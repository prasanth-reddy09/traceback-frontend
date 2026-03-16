// "use client";

// import { useState, useEffect, Suspense } from "react"; // Added Suspense
// import { useSearchParams } from "next/navigation";
// import { useQuery } from "@tanstack/react-query";
// import { itemService } from "@/services/itemService";
// import { claimService } from "@/services/claimService";

// import { SearchSection } from "./components/SearchSection";
// import { FeedView } from "./components/FeedView";
// import { MyClaimsView } from "./components/MyClaimsView";
// import { InboxView } from "./components/InboxView";

// // 1. Move everything into a internal component
// function DashboardContent() {
//   const searchParams = useSearchParams();
//   const activeTab = searchParams.get("tab") || "feed";
  
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [userId, setUserId] = useState<string | null>(null);

//   const categories = ["All", "Electronics", "Pets", "Documents", "Wallets", "Accessories", "Others"];

//   useEffect(() => {
//     setUserId(localStorage.getItem("user_id"));
//   }, []);

//   const { data: items, isLoading: loadingItems } = useQuery({
//     queryKey: ["items", activeTab, searchQuery, selectedCategory],
//     queryFn: () => {
//       if (activeTab === "feed") return itemService.searchItems(searchQuery, selectedCategory);
//       if (activeTab === "my-items") return itemService.getMyReportedItems();
//       return null;
//     },
//     enabled: activeTab === "feed" || activeTab === "my-items",
//   });

//   const { data: claims, isLoading: loadingClaims } = useQuery({
//     queryKey: ["all-claims", activeTab],
//     queryFn: async () => {
//       if (activeTab === "inbox") return claimService.getClaimsToReview();
//       if (activeTab === "my-claims") return claimService.getMyClaims();
//       return null;
//     },
//     enabled: activeTab === "inbox" || activeTab === "my-claims",
//   });

//   const renderContent = () => {
//     switch (activeTab) {
//       case "inbox":
//         return <InboxView claims={claims} isLoading={loadingClaims} userId={userId} />;
//       case "my-items":
//         return (
//           <div className="space-y-6">
//             <h2 className="text-xl font-bold text-gray-900">Your Reports</h2>
//             <FeedView items={items} isLoading={loadingItems} />
//           </div>
//         );
//       case "my-claims":
//         return <MyClaimsView claims={claims} isLoading={loadingClaims}  userId={userId}/>;
//       case "feed":
//       default:
//         return (
//           <div className="space-y-6">
//             <h2 className="text-xl font-bold text-gray-900">Community Discoveries</h2>
//             <FeedView items={items} isLoading={loadingItems} />
//           </div>
//         );
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 pb-20">
//       {activeTab === "feed" && (
//         <SearchSection 
//           searchQuery={searchQuery}
//           setSearchQuery={setSearchQuery}
//           selectedCategory={selectedCategory}
//           setSelectedCategory={setSelectedCategory}
//           categories={categories}
//         />
//       )}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
//         {renderContent()}
//       </main>
//     </div>
//   );
// }

// // 2. This is the part Vercel needs! 
// export default function DashboardPage() {
//   return (
//     <Suspense fallback={<div className="p-10 text-center">Loading Dashboard...</div>}>
//       <DashboardContent />
//     </Suspense>
//   );
// }
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { itemService } from "@/services/itemService";
import { claimService } from "@/services/claimService";

import { SearchSection } from "./components/SearchSection";
import { FeedView } from "./components/FeedView";
import { MyClaimsView } from "./components/MyClaimsView";
import { InboxView } from "./components/InboxView";

function DashboardContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "feed";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [userId, setUserId] = useState<string | null>(null);

  const categories = ["All", "Electronics", "Pets", "Documents", "Wallets", "Accessories", "Others"];

  useEffect(() => {
    setUserId(localStorage.getItem("user_id"));
  }, []);

  const isSearching = searchQuery.length > 0 || selectedCategory !== "All";

  // 1. INFINITE FEED (For the main community discoveries)
  const { 
    data: infiniteData, 
    isLoading: loadingInfinite,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ["items", "infinite"],
    queryFn: ({ pageParam = 0 }) => itemService.getAllItems(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.last ? undefined : lastPage.number + 1,
    enabled: activeTab === "feed" && !isSearching,
  });

  // 2. SEARCH QUERY (Standard list, no pagination as requested)
  const { data: searchResults, isLoading: loadingSearch } = useQuery({
    queryKey: ["items", "search", searchQuery, selectedCategory],
    queryFn: () => itemService.searchItems(searchQuery, selectedCategory),
    enabled: activeTab === "feed" && isSearching,
  });

  // 3. MY REPORTS QUERY
  const { data: myItems, isLoading: loadingMyItems } = useQuery({
    queryKey: ["my-items", userId],
    queryFn: () => itemService.getMyReportedItems(),
    enabled: activeTab === "my-items",
  });

  // 4. CLAIMS QUERIES (Inbox & My Claims)
  const { data: claims, isLoading: loadingClaims } = useQuery({
    queryKey: ["all-claims", activeTab],
    queryFn: async () => {
      if (activeTab === "inbox") return claimService.getClaimsToReview();
      if (activeTab === "my-claims") return claimService.getMyClaims();
      return null;
    },
    enabled: activeTab === "inbox" || activeTab === "my-claims",
  });

  const renderContent = () => {
    switch (activeTab) {
      case "inbox":
        return <InboxView claims={claims} isLoading={loadingClaims} userId={userId} />;
      
      case "my-items":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Your Reports</h2>
            <FeedView items={myItems} isLoading={loadingMyItems} isMyItems={true} />
          </div>
        );

      case "my-claims":
        return <MyClaimsView claims={claims} isLoading={loadingClaims} userId={userId} />;

      case "feed":
      default:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">
              {isSearching ? `Search Results (${searchResults?.length || 0})` : "Community Discoveries"}
            </h2>
            <FeedView 
              items={isSearching ? searchResults : null}
              infiniteData={isSearching ? null : infiniteData} 
              isLoading={isSearching ? loadingSearch : loadingInfinite} 
              fetchNextPage={fetchNextPage}
              hasNextPage={!isSearching && hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              isSearchMode={isSearching}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {activeTab === "feed" && (
        <SearchSection 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
        />
      )}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {renderContent()}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}

