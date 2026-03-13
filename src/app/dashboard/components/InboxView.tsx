// src/app/dashboard/components/InboxView.tsx
import { Inbox } from "lucide-react";
import { InboxCard } from "./InboxCard";

export function InboxView({ claims, isLoading, userId }: any) {
  if (isLoading) return <div className="space-y-4 animate-pulse">{[1,2,3].map(i => <div key={i} className="h-24 bg-gray-200 rounded-2xl" />)}</div>;
  
  // Logic: Show all claims where I am either the Finder or the Loser
  if (!claims || claims.length === 0) return (
    <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
      <Inbox className="w-12 h-12 text-gray-200 mx-auto mb-4" />
      <h3 className="text-lg font-bold text-gray-900">Your inbox is empty</h3>
      <p className="text-gray-400 text-sm">Active conversations about items will show up here.</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Recent Messages</h2>
        <span className="bg-blue-100 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">
          {claims.length} Active
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