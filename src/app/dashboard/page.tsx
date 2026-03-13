// "use client";

// import { useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { useQuery } from "@tanstack/react-query";
// import { itemService } from "@/services/itemService";
// import { claimService } from "@/services/claimService";
// import Link from "next/link";
// import { 
//   Plus, 
//   Search, 
//   Tag, 
//   MapPin, 
//   ChevronRight, 
//   Package, 
//   MessageSquare, 
//   Clock,
//   Bell,
//   Inbox
// } from "lucide-react";

// export default function DashboardPage() {
//   const searchParams = useSearchParams();
  
//   // 1. Tab State from URL
//   const activeTab = searchParams.get("tab") || "feed";
  
//   // 2. Search & Filter State
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const categories = ["All", "Electronics", "Pets", "Documents", "Wallets", "Accessories", "Others"];

//   // 3. FETCH: Items (Feed or My Reported)
//   const { data: items, isLoading: loadingItems } = useQuery({
//     queryKey: ["items", activeTab, searchQuery, selectedCategory],
//     queryFn: () => {
//       if (activeTab === "feed") return itemService.searchItems(searchQuery, selectedCategory);
//       if (activeTab === "my-items") return itemService.getMyReportedItems();
//       return null;
//     },
//     enabled: activeTab === "feed" || activeTab === "my-items",
//   });

//   // 4. FETCH: Claims I made (as a Loser)
//   const { data: myClaims, isLoading: loadingMyClaims } = useQuery({
//     queryKey: ["my-claims"],
//     queryFn: () => claimService.getMyClaims(),
//     enabled: activeTab === "my-claims",
//   });

//   // 5. FETCH: Claims sent TO ME (Inbox for Finder)
//   const { data: claimsToReview, isLoading: loadingReview } = useQuery({
//     queryKey: ["claims-to-review"],
//     queryFn: () => claimService.getClaimsToReview(),
//     enabled: activeTab === "inbox" || activeTab === "my-items",
//   });

//   return (
//     <div className="min-h-screen bg-gray-50 pb-20">
      
//       {/* 1. SEARCH SECTION (Only visible on the Main Feed) */}
//       {activeTab === "feed" && (
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
//           <div className="flex flex-col md:flex-row gap-4 items-center">
//             <div className="relative flex-1 w-full group">
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
//               <input 
//                 type="text"
//                 placeholder="Search by title or location..."
//                 className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-gray-900"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//             <div className="flex gap-3 w-full md:w-auto">
//               <select 
//                 className="flex-1 md:flex-none bg-white border border-gray-200 rounded-2xl px-6 py-4 text-sm font-semibold shadow-sm outline-none cursor-pointer focus:border-blue-500 text-gray-900"
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//               >
//                 {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
//               </select>
//               <Link href="/report" className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-100 whitespace-nowrap">
//                 <Plus className="w-5 h-5" /> Report Item
//               </Link>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 2. MAIN CONTENT RENDERER */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
//         {/* TAB VIEW: INBOX */}
//         {activeTab === "inbox" && (
//           <FinderInboxView claims={claimsToReview} isLoading={loadingReview} />
//         )}

//         {/* TAB VIEW: MY CLAIMS (Requests I sent) */}
//         {activeTab === "my-claims" && (
//           <ClaimsListView claims={myClaims} isLoading={loadingMyClaims} />
//         )}

//         {/* TAB VIEW: MY REPORTS OR MAIN FEED */}
//         {(activeTab === "feed" || activeTab === "my-items") && (
//           <div className="space-y-6">
//             <div className="flex items-center justify-between">
//               <h2 className="text-xl font-bold text-gray-900">
//                 {activeTab === "feed" ? "Community Discoveries" : "Items You Reported"}
//               </h2>
//               {activeTab === "my-items" && (
//                 <Link href="/report" className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1">
//                   <Plus className="w-4 h-4" /> Report New
//                 </Link>
//               )}
//             </div>
//             <ItemsGridView items={items} isLoading={loadingItems} />
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// /** * --- SUB-COMPONENTS --- 
//  */

// // 1. The Full Inbox View for the Finder
// function FinderInboxView({ claims, isLoading }: any) {
//   if (isLoading) return <div className="space-y-4 animate-pulse">{[1,2,3].map(i => <div key={i} className="h-24 bg-gray-200 rounded-2xl" />)}</div>;
  
//   const pending = claims?.filter((c: any) => c.status === "PENDING") || [];

//   if (pending.length === 0) return (
//     <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
//       <Inbox className="w-12 h-12 text-gray-200 mx-auto mb-4" />
//       <h3 className="text-lg font-bold text-gray-900">No new messages</h3>
//       <p className="text-gray-400 text-sm">When users claim your items, they'll show up here.</p>
//     </div>
//   );

//   return (
//     <div className="space-y-4">
//       <h2 className="text-xl font-bold text-gray-900 mb-6">Pending Claim Requests</h2>
//       {pending.map((claim: any) => (
//         <Link key={claim.id} href={`/item/${claim.item?.id}`}>
//           <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:border-blue-500 hover:shadow-xl transition-all flex items-center justify-between group">
//             <div className="flex gap-5 items-center">
//               <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
//                 <MessageSquare className="w-6 h-6" />
//               </div>
//               <div>
//                 <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Item: {claim.item?.title}</p>
//                 <h3 className="text-lg font-bold text-gray-900">Claim request from User #{claim.loser?.id}</h3>
//                 <p className="text-sm text-gray-400">Sent on {new Date(claim.createdAt).toLocaleDateString()}</p>
//               </div>
//             </div>
//             <div className="bg-gray-50 p-2 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
//               <ChevronRight className="w-6 h-6" />
//             </div>
//           </div>
//         </Link>
//       ))}
//     </div>
//   );
// }

// // 2. The Main Feed Grid
// function ItemsGridView({ items, isLoading }: any) {
//   if (isLoading) return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
//       {[1,2,3].map(i => <div key={i} className="h-72 bg-gray-200 rounded-[32px]" />)}
//     </div>
//   );
  
//   if (!items || items.length === 0) return (
//     <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-gray-100 text-gray-400">No items found.</div>
//   );

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//       {items.map((item: any) => (
//         <Link 
//           key={item.id} 
//           href={`/item/${item.id}`} 
//           className={`group ${item.status === 'RESOLVED' ? 'opacity-50 grayscale pointer-events-none' : ''}`}
//         >
//           <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
//             <div className="relative h-60 bg-gray-100 overflow-hidden">
//               {item.imageUrl ? (
//                 <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
//               ) : (
//                 <div className="flex items-center justify-center h-full text-gray-300 font-bold italic text-sm">No Image Provided</div>
//               )}
//               <div className="absolute top-4 right-4">
//                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-lg ${
//                   item.status === 'LOST' ? 'bg-rose-500' : 'bg-emerald-500'
//                 }`}>
//                   {item.status}
//                 </span>
//               </div>
//             </div>
//             <div className="p-6">
//               <div className="flex items-center gap-2 text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-3">
//                 <Tag className="w-3.5 h-3.5" /> {item.category}
//               </div>
//               <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">{item.title}</h3>
//               <div className="flex items-center text-sm text-gray-400 font-medium gap-2 mb-4">
//                 <MapPin className="w-4 h-4" /> {item.location}
//               </div>
//               <div className="pt-5 border-t border-gray-50 flex items-center justify-between text-blue-600 font-bold text-[10px] tracking-widest uppercase">
//                 <span>{item.status === 'RESOLVED' ? 'CASE CLOSED' : 'VIEW DISCOVERY'}</span>
//                 <ChevronRight className="w-4 h-4" />
//               </div>
//             </div>
//           </div>
//         </Link>
//       ))}
//     </div>
//   );
// }

// // 3. Claims List (Requests sent by the user)
// function ClaimsListView({ claims, isLoading }: any) {
//   if (isLoading) return <div className="space-y-4 animate-pulse">{[1,2].map(i => <div key={i} className="h-24 bg-gray-200 rounded-2xl" />)}</div>;
  
//   if (!claims || claims.length === 0) return <div className="text-center py-20 text-gray-400">You haven't claimed any items.</div>;

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//       {claims.map((claim: any) => (
//         <Link key={claim.id} href={`/item/${claim.item?.id}`}>
//           <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:border-blue-500 transition-all flex items-center justify-between group">
//             <div>
//               <div className="flex items-center gap-2 mb-2">
//                 <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
//                   claim.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
//                   claim.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
//                 }`}>
//                   {claim.status}
//                 </span>
//                 <span className="text-[10px] text-gray-400">{new Date(claim.createdAt).toLocaleDateString()}</span>
//               </div>
//               <h3 className="text-lg font-bold text-gray-900">{claim.item?.title}</h3>
//             </div>
//             <ChevronRight className="text-gray-300 group-hover:text-blue-600 transition-all" />
//           </div>
//         </Link>
//       ))}
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { itemService } from "@/services/itemService";
import { claimService } from "@/services/claimService";

// Import your Refactored Components
import { SearchSection } from "./components/SearchSection";
import { FeedView } from "./components/FeedView";
import { MyReportsView } from "./components/MyReportsView"; // You can use FeedView here too
import { MyClaimsView } from "./components/MyClaimsView";
import { InboxView } from "./components/InboxView";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "feed";
  
  // 1. Local State for Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [userId, setUserId] = useState<string | null>(null);

  const categories = ["All", "Electronics", "Pets", "Documents", "Wallets", "Accessories", "Others"];

  // Handle Hydration / LocalStorage safely
  useEffect(() => {
    setUserId(localStorage.getItem("user_id"));
  }, []);

  // 2. DATA QUERIES
  
  // Fetch Items (Feed or My Reported)
  const { data: items, isLoading: loadingItems } = useQuery({
    queryKey: ["items", activeTab, searchQuery, selectedCategory],
    queryFn: () => {
      if (activeTab === "feed") return itemService.searchItems(searchQuery, selectedCategory);
      if (activeTab === "my-items") return itemService.getMyReportedItems();
      return null;
    },
    enabled: activeTab === "feed" || activeTab === "my-items",
  });

  // Fetch Claims (Combined for Inbox and My Claims)
  const { data: claims, isLoading: loadingClaims } = useQuery({
    queryKey: ["all-claims", activeTab],
    queryFn: async () => {
      if (activeTab === "inbox") return claimService.getClaimsToReview();
      if (activeTab === "my-claims") return claimService.getMyClaims();
      return null;
    },
    enabled: activeTab === "inbox" || activeTab === "my-claims",
  });

  // 3. TAB RENDERER (The SRP Switch)
  const renderContent = () => {
    switch (activeTab) {
      case "inbox":
        return <InboxView claims={claims} isLoading={loadingClaims} userId={userId} />;
      
      case "my-items":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Your Reports</h2>
            <FeedView items={items} isLoading={loadingItems} />
          </div>
        );

      case "my-claims":
        return <MyClaimsView claims={claims} isLoading={loadingClaims} />;

      case "feed":
      default:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Community Discoveries</h2>
            <FeedView items={items} isLoading={loadingItems} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* Search only appears on the main Feed */}
      {activeTab === "feed" && (
        <SearchSection 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
        />
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {renderContent()}
      </main>
    </div>
  );
}