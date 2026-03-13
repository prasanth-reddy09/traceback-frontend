// src/app/dashboard/components/InboxCard.tsx
import Link from "next/link";
import { MessageSquare, ChevronRight } from "lucide-react";

export function InboxCard({ claim, currentUserId }: { claim: any, currentUserId: string }) {
  // Determine if the logged-in user is the Finder or the Loser
  const isFinder = claim.item.finderId === currentUserId;

  return (
    <Link href={`/item/${claim.item.id}`} className="group">
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm hover:border-blue-500 hover:shadow-xl transition-all flex items-center gap-4">
        {/* Left: Small Image */}
        <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0">
          <img 
            src={claim.item.imageUrl || "/placeholder.png"} 
            className="w-full h-full object-cover" 
            alt="Item" 
          />
        </div>

        {/* Middle: User Info & Tag */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold text-gray-900 truncate">
              {isFinder ? `Claimant #${claim.loser.id}` : `Finder #${claim.item.finderId}`}
            </span>
            <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ${
              isFinder ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"
            }`}>
              {isFinder ? "For Your Item" : "Your Claim"}
            </span>
          </div>
          <p className="text-xs text-gray-500 truncate italic">
            "{claim.item.description || 'No description provided'}"
          </p>
        </div>

        {/* Right: Action Icon */}
        <div className="bg-gray-300 p-2 text-black rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
          <ChevronRight className="w-5 h-5 " />
        </div>
      </div>
    </Link>
  );
}