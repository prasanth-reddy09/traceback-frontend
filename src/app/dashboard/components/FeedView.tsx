// src/app/dashboard/components/FeedView.tsx
import { ItemCard } from "./ItemCard";

export function FeedView({ items, isLoading }: any) {
  if (isLoading) return <LoadingGrid />;
  if (!items || items.length === 0) return <EmptyState message="No community discoveries found." />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((item: any) => <ItemCard key={item.id} item={item} />)}
    </div>
  );
}

// Helpers inside the same file for cleanliness
function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
      {[1, 2, 3].map(i => <div key={i} className="h-72 bg-gray-200 rounded-[32px]" />)}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-gray-100 text-gray-400">{message}</div>;
}