"use client";

import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { ItemCard } from "./ItemCard";
import SkeletonCard from "./SkeletonCard";

export function FeedView({
  infiniteData,
  items,
  isLoading,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isSearchMode,
}: any) {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  // Choose which data source to display
  const displayItems = isSearchMode
    ? items
    : infiniteData?.pages.flatMap((page: any) => page.content) || items;

  if (!displayItems || displayItems.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400 font-medium">
        No items found.
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayItems.map((item: any) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>

      {/* Only show the Sentinel and loading states if we ARE NOT in search mode */}
      {!isSearchMode && (
        <div ref={ref} className="flex justify-center py-10">
          {isFetchingNextPage ? (
            <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full" />
          ) : hasNextPage ? (
            <span className="text-gray-400 text-sm font-medium">
              Searching for more...
            </span>
          ) : (
            <span className="text-gray-400 text-xs italic">
              End of the feed.
            </span>
          )}
        </div>
      )}
    </div>
  );
}
