"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { itemService } from "@/services/itemService";
import { claimService } from "@/services/claimService";

// Import your Refactored Components
import { SearchSection } from "./components/SearchSection";
import { FeedView } from "./components/FeedView";
// import { MyReportsView } from "./components/MyReportsView"; // You can use FeedView here too
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
        return <MyClaimsView claims={claims} isLoading={loadingClaims}  userId={userId}/>;

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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {renderContent()}
      </main>
    </div>
  );
}