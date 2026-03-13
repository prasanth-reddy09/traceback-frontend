"use client";

import { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { apiClient } from "@/lib/apiClient";
import { Send } from "lucide-react";

// Our clean, predictable Message interface
interface Message {
  id?: number;
  senderId: number;
  senderName: string;
  content: string;
}

interface ChatRoomProps {
  claimId: number;
}

export default function ChatRoom({ claimId }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [currentUserId, setCurrentUserId] = useState<number>(0);
  
  // Refs for WebSockets and Auto-Scrolling
  const stompClientRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Every time 'messages' updates, scroll to the bottom!
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // 1. Grab the current user's ID
    const storedId = localStorage.getItem("user_id");
    if (storedId) setCurrentUserId(Number(storedId));

    // 2. Fetch the Chat History from the database first!
    const fetchChatHistory = async () => {
      try {
        const response = await apiClient.get(`/messages/${claimId}`);
        
        // Map the Java Entity to match our React Interface
        const formattedMessages = response.data.map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          senderId: msg.sender?.id || msg.senderId,
          senderName: msg.sender?.name || msg.senderName || "User"
        }));

        setMessages(formattedMessages);
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      }
    };
    
    fetchChatHistory();

    // 3. Connect to the Spring Boot Radio Tower for LIVE messages
    const socket = new SockJS("http://localhost:8080/ws");
    const client = Stomp.over(socket);
    
    // Turn off the massive wall of debug logs in the console
    client.debug = () => {}; 

    client.connect({}, () => {
      console.log("Connected to Chat Room:", claimId);
      
      // Listen to this specific claim's channel
      client.subscribe(`/topic/chat/${claimId}`, (messageOutput) => {
        const rawMsg = JSON.parse(messageOutput.body);
        
        // Ensure incoming live messages match our interface too
        const newLiveMessage: Message = {
          id: rawMsg.id,
          content: rawMsg.content,
          senderId: rawMsg.sender?.id || rawMsg.senderId,
          senderName: rawMsg.sender?.name || rawMsg.senderName || "User"
        };

        setMessages((prevMessages) => [...prevMessages, newLiveMessage]);
      });
    });

    stompClientRef.current = client;

    // 4. Cleanup when the component unmounts (user leaves the page)
    return () => {
      if (client) client.disconnect();
    };
  }, [claimId]);

  // 5. Send a message to your Spring Boot REST API
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      await apiClient.post("/messages", {
        claimId: claimId,
        senderId: currentUserId,
        content: input,
      });
      
      setInput(""); // Clear input instantly
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-gray-50 rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Chat Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Live Chat
        </h3>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            No messages yet. Say hello!
          </div>
        ) : (
          messages.map((msg, index) => {
            // Check if I sent this message
            const isMe = msg.senderId === currentUserId;

            return (
              <div key={index} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                <span className="text-xs text-gray-400 mb-1 px-1">
                  {isMe ? "You" : msg.senderName}
                </span>
                <div 
                  className={`px-4 py-2 rounded-2xl max-w-[80%] break-words ${
                    isMe 
                      ? "bg-blue-600 text-white rounded-tr-none" 
                      : "bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })
        )}
        {/* Invisible div to anchor our auto-scroll feature! */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={sendMessage} className="p-3 text-black bg-white border-t border-gray-200 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <button 
          type="submit" 
          disabled={!input.trim()}
          className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:bg-blue-300 transition-colors flex items-center justify-center w-10 h-10"
        >
          <Send className="w-5 h-5 ml-1 flex-shrink-0" />
        </button>
      </form>
    </div>
  );
}