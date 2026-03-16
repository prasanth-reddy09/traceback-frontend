"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { itemService } from "@/services/itemService";
import { claimService } from "@/services/claimService";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ItemInfo } from "./components/ItemInfo";
import { ClaimSection } from "./components/ClaimSection";

export default function ItemDetailsPage() {
  const params = useParams();
  const itemId = params.id as string;
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    const storedId = localStorage.getItem("user_id");
    if (storedId) setCurrentUserId(Number(storedId));
  }, []);

  const { data: item, isLoading: loadingItem } = useQuery({
    queryKey: ["item", itemId],
    queryFn: () => itemService.getItemById(itemId),
  });

  const { data: claims } = useQuery({
    queryKey: ["claims", itemId],
    queryFn: () => claimService.getClaimsForItem(Number(itemId)),
  });

  if (loadingItem) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full" /></div>;
  if (!item) return <div className="p-10 text-center font-bold">Item not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 font-medium text-sm transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Feed
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <ItemInfo item={item} />
          <div className="lg:col-span-7">
            <div className="sticky top-6">
              <ClaimSection 
                itemId={itemId} 
                item={item} 
                claims={claims} 
                currentUserId={currentUserId} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}