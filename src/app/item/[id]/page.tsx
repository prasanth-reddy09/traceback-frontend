"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { itemService } from "@/services/itemService";
import { claimService } from "@/services/claimService";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Tag, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import ChatRoom from "@/components/ChatRoom";

export default function ItemDetailsPage() {
  const params = useParams();
  const itemId = params.id as string;
  const queryClient = useQueryClient();
  
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [activeClaimId, setActiveClaimId] = useState<number | null>(null);
  // NEW: Tracks which claim the Finder clicked on from their list
  const [selectedClaimId, setSelectedClaimId] = useState<number | null>(null);

  useEffect(() => {
    const storedId = localStorage.getItem("user_id");
    if (storedId) setCurrentUserId(Number(storedId));
  }, []);

  // 1. Fetch the Item details
  const { data: item, isLoading: loadingItem } = useQuery({
    queryKey: ["item", itemId],
    queryFn: () => itemService.getItemById(itemId),
  });

  // 2. NEW: Fetch any existing claims for this item!
  const { data: claims } = useQuery({
    queryKey: ["claims", itemId],
    queryFn: () => claimService.getClaimsForItem(Number(itemId)),
  });

  // 3. The Mutation to Create a Claim
  const claimMutation = useMutation({
    mutationFn: () => claimService.createClaim(Number(itemId)),
    onSuccess: (data) => {
      toast.success("Item claimed successfully!");
      setActiveClaimId(data.id);
      // Tell React Query to refresh the claims list in the background
      queryClient.invalidateQueries({ queryKey: ["claims", itemId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to claim item.");
    }
  });

  // 3. The Mutation to Resolve a Claim (Approve/Reject)
  const resolveMutation = useMutation({
    mutationFn: ({ claimId, action }: { claimId: number, action: "APPROVE" | "REJECT" }) => 
      claimService.resolveClaim(claimId, action),
    onSuccess: (data, variables) => {
      toast.success(`Claim successfully ${variables.action.toLowerCase()}d!`);
      // Refresh both the claims list AND the item details (so the status badge updates to RESOLVED)
      queryClient.invalidateQueries({ queryKey: ["claims", itemId] });
      queryClient.invalidateQueries({ queryKey: ["item", itemId] });
      // Send them back to the claims list view
      setSelectedClaimId(null); 
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to resolve the claim.");
    }
  });

  if (loadingItem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!item) return <div>Item not found</div>;

  // --- SMART LOGIC ---
  const finderId = item.finder?.id || item.finderId;
  const isMyItem = currentUserId === finderId;

  // Did I already claim this in the past? (Cures the amnesia!)
  // (We check both 'loser.id' and 'loserId' just to be safe with how Java sends JSON)
  const myExistingClaim = claims?.find((c: any) => c.loser?.id === currentUserId || c.loserId === currentUserId);

  // Determine exactly which Claim ID to plug into the Chat Room
  let displayClaimId = activeClaimId; // If they just clicked the button
  if (!displayClaimId && myExistingClaim) displayClaimId = myExistingClaim.id; // If they claimed it yesterday
  if (!displayClaimId && isMyItem && claims && claims.length > 0) displayClaimId = claims[0].id; // If I'm the finder, and someone claimed it!

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-gray-500 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Item Details (Unchanged) */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="w-full h-96 bg-gray-200 relative">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">No image provided</div>
              )}
            </div>
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{item.title}</h1>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{item.description}</p>
            </div>
          </div>

         {/* Right Column: The Action Area */}
          <div className="lg:col-span-1">
            <div className="sticky top-10 flex flex-col gap-4">
              
              {/* --- SCENARIO 1: I AM THE FINDER --- */}
              {isMyItem ? (
                claims && claims.length > 0 ? (
                  
                  /* The Finder clicked a specific claim to view the chat */
                  selectedClaimId ? (
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => setSelectedClaimId(null)}
                        className="text-sm text-blue-600 cursor-pointer hover:text-blue-800 flex items-center mb-2 font-medium"
                      >
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Claims List
                      </button>
                      <ChatRoom claimId={selectedClaimId} />
                      
                     {/* The Real Approve/Reject Buttons! */}
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <button 
                          onClick={() => resolveMutation.mutate({ claimId: selectedClaimId, action: "APPROVE" })}
                          disabled={resolveMutation.isPending}
                          className="bg-green-600 text-white py-2  cursor-pointer rounded-lg text-sm font-bold hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          {resolveMutation.isPending ? "..." : "Approve"}
                        </button>
                        <button 
                          onClick={() => resolveMutation.mutate({ claimId: selectedClaimId, action: "REJECT" })}
                          disabled={resolveMutation.isPending}
                          className="bg-red-600 text-white py-2  cursor-pointer rounded-lg text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          {resolveMutation.isPending ? "..." : "Reject"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    
                    /* The Finder is looking at the Master List of Claims */
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                      <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center justify-between">
                        Active Claims 
                        <span className="bg-blue-100 text-blue-700 py-1 px-3 rounded-full text-xs">{claims.length}</span>
                      </h3>
                      <div className="space-y-3">
                        {claims.map((claim: any) => (
                          <div key={claim.id} className="border border-gray-200 p-4 rounded-lg hover:border-blue-300 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-bold text-sm text-gray-900">{claim.loser?.name || "User " + claim.loser?.id}</p>
                                <p className="text-xs text-gray-500">{new Date(claim.createdAt || Date.now()).toLocaleDateString()}</p>
                              </div>
                              <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                                claim.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                claim.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {claim.status}
                              </span>
                            </div>
                            <button 
                              onClick={() => setSelectedClaimId(claim.id)}
                              className="w-full mt-2 bg-gray-50  cursor-pointer text-blue-600 border border-gray-200 py-2 rounded-md text-sm font-semibold hover:bg-blue-50 transition-colors"
                            >
                              Open Chat
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ) : (
                  /* The Finder is waiting for the first claim */
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                    <AlertCircle className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                    <h3 className="font-bold text-gray-900 text-lg">You reported this item</h3>
                    <p className="text-sm text-gray-500 mt-2">
                      When someone claims this item, they will appear here.
                    </p>
                  </div>
                )
              ) 
              
              /* --- SCENARIO 2: I AM A GUEST WHO CLAIMED IT --- */
              : displayClaimId ? (
                <div className="flex flex-col gap-2">
                  <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-sm font-medium border border-blue-200">
                    You claimed this item! Talk to the finder below.
                  </div>
                  <ChatRoom claimId={displayClaimId} />
                </div>
              ) 
              
              /* --- SCENARIO 3: I AM A GUEST WHO HAS NOT CLAIMED IT YET --- */
              : (
                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Is this yours?</h3>
                  <button
                    onClick={() => claimMutation.mutate()}
                    disabled={claimMutation.isPending}
                    className="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-all shadow-sm mt-4"
                  >
                    {claimMutation.isPending ? "Connecting..." : "Claim This Item"}
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}