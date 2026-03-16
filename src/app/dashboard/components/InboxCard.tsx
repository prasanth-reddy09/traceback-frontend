// src/app/dashboard/components/InboxCard.tsx
"use client";

import Link from "next/link";
import { ChevronRight, User, Package, MessageCircle } from "lucide-react";

export function InboxCard({ claim, currentUserId }: { claim: any, currentUserId: string }) {
  // Logic: Are you the one who found the item?
  const isFinder = String(claim.finderId) === String(currentUserId);

  const statusStyles: any = {
    PENDING: "bg-amber-50 text-amber-600 border-amber-100",
    APPROVED: "bg-emerald-50 text-emerald-600 border-emerald-100",
    REJECTED: "bg-rose-50 text-rose-600 border-rose-100",
  };

  return (
    <Link href={`/item/${claim.itemId}`} className="group block mb-4">
      <div className="bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm hover:border-blue-500 hover:shadow-xl transition-all flex items-center gap-5">
        
        {/* LEFT: Item Image */}
        <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
          {claim.itemImageUrl ? (
            <img src={claim.itemImageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Item" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <Package className="w-8 h-8" />
            </div>
          )}
        </div>

        {/* MIDDLE: Info Section */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              {isFinder 
                ? `Claim by ${claim.loserName}` 
                : `Claimed from ${claim.finderName}` 
              }
            </span>
            <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase border ${statusStyles[claim.status]}`}>
              {claim.status}
            </span>
          </div>

          <h3 className="text-lg font-bold text-gray-900 leading-none mb-2">
            {claim.itemTitle}
          </h3>

          <p className="text-sm text-gray-500 truncate font-medium flex items-center gap-2 italic">
            <MessageCircle className="w-3.5 h-3.5 text-gray-300" />
            "{claim.proofDescription || "Waiting for response..."}"
          </p>
        </div>

        {/* RIGHT: Action Arrow */}
        <div className="bg-gray-100 p-3 rounded-2xl text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </Link>
  );
}