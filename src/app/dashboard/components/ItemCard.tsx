// src/app/dashboard/components/ItemCard.tsx
import Link from "next/link";
import { Tag, MapPin, ChevronRight } from "lucide-react";

export function ItemCard({ item }: { item: any }) {
  const isResolved = item.status === 'RESOLVED';

  return (
    <Link 
      href={`/item/${item.id}`} 
      className={`group ${isResolved ? 'opacity-50 grayscale pointer-events-none' : ''}`}
    >
      <div className="bg-white rounded-4xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
        <div className="relative h-60 bg-gray-100 overflow-hidden">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-300 font-bold italic text-sm">No Image</div>
          )}
          <div className="absolute top-4 right-4">
             <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-lg ${
              item.status === 'LOST' ? 'bg-rose-500' : 'bg-emerald-500'
            }`}>
              {item.status}
            </span>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-2 text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-3">
            <Tag className="w-3.5 h-3.5" /> {item.category}
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">{item.title}</h3>
          <div className="flex items-center text-sm text-gray-400 font-medium gap-2 mb-4">
            <MapPin className="w-4 h-4" /> {item.location}
          </div>
          <div className="pt-5 border-t border-gray-50 flex items-center justify-between text-blue-600 font-bold text-[10px] tracking-widest uppercase">
            <span>{isResolved ? 'CASE CLOSED' : 'VIEW DISCOVERY'}</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}