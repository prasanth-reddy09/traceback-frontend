// src/app/dashboard/components/MyClaimsView.tsx
"use client";

import { Clock, Inbox } from "lucide-react";
import { InboxCard } from "./InboxCard";

export function MyClaimsView({ claims, isLoading, userId }: any) {
  if (isLoading) return <LoadingSkeleton />;
  
  if (!claims || claims.length === 0) return (
    <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
      <Inbox className="w-12 h-12 text-gray-200 mx-auto mb-4" />
      <h3 className="text-lg font-bold text-gray-900">No claims yet</h3>
      <p className="text-gray-400 text-sm">When you try to claim an item, it will show up here.</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-xl font-bold text-gray-900">Your Claims</h2>
        <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
          {claims.length} Outgoing
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {claims.map((claim: any) => (
          <InboxCard key={claim.id} claim={claim} currentUserId={userId} />
        ))}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2].map((i) => (
        <div key={i} className="h-28 bg-gray-200 rounded-[28px]" />
      ))}
    </div>
  );
}