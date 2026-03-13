// src/app/dashboard/components/SearchSection.tsx
import { Search, Plus } from "lucide-react";
import Link from "next/link";

export function SearchSection({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, categories }: any) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
          <input 
            type="text"
            placeholder="Search by title or location..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-gray-900"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <select 
            className="flex-1 md:flex-none bg-white border border-gray-200 rounded-2xl px-6 py-4 text-sm font-semibold shadow-sm outline-none cursor-pointer focus:border-blue-500 text-gray-900"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat: string) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <Link href="/report" className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-100 whitespace-nowrap">
            <Plus className="w-5 h-5" /> Report Item
          </Link>
        </div>
      </div>
    </div>
  );
}