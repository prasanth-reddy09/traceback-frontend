"use client";

import { Inbox } from "lucide-react";
import { InboxCard } from "./InboxCard";

interface InboxViewProps {
  claims: any[];
  isLoading: boolean;
  userId: string | null;
}

export function InboxView({ claims, isLoading, userId }: InboxViewProps) {
  if (isLoading) return <LoadingSkeleton />;
  
  if (!claims || claims.length === 0) return (
    <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
      <Inbox className="w-12 h-12 text-gray-200 mx-auto mb-4" />
      <h3 className="text-lg font-bold text-gray-900">Your inbox is empty</h3>
      <p className="text-gray-400 text-sm">Active claim requests will appear here.</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
        <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
          {claims.length} Total
        </span>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {claims.map((claim) => (
          <InboxCard key={claim.id} claim={claim} currentUserId={userId || ""} />
        ))}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-28 bg-gray-200 rounded-[28px]" />
      ))}
    </div>
  );
}