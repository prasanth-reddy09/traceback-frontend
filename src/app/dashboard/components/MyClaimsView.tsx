// src/app/dashboard/components/MyClaimsView.tsx
import { Clock, ChevronRight } from "lucide-react";
import Link from "next/link";

export function MyClaimsView({ claims, isLoading }: any) {
  if (isLoading) return <div>Heloo test</div>
//   <div className="space-y-4 animate-pulse">{[1,2].map(i => <div key(i) className="h-24 bg-gray-200 rounded-2xl" />)}</div>;
  if (!claims || claims.length === 0) return <div className="text-center py-20 text-gray-400">You haven't claimed any items yet.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {claims.map((claim: any) => (
        <Link key={claim.id} href={`/item/${claim.item?.id}`}>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:border-blue-500 transition-all flex items-center justify-between group">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                  claim.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                  claim.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {claim.status}
                </span>
                <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {new Date(claim.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">{claim.item?.title}</h3>
            </div>
            <ChevronRight className="text-gray-300 group-hover:text-blue-600 transition-all" />
          </div>
        </Link>
      ))}
    </div>
  );
}