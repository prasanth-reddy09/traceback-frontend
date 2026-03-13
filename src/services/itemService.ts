import { apiClient } from "@/lib/apiClient";

export interface Item {
  id: number;
  title: string;
  description: string;
  location : string
  category: string;
  status: "LOST" | "FOUND" | "RESOLVED";
  imageUrl: string | null;
  createdAt: string;
}

export const itemService = {
  // Fetch all items from the database
  getAllItems: async (): Promise<Item[]> => {
    const response = await apiClient.get("/items");
    return response.data;
  },

 // Save a newly reported item using the specific backend URL
  reportItem: async (itemData: any) => {
    // 1. Grab the ID we saved during login
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      throw new Error("Could not find User ID. Please log out and log back in.");
    }

    // 2. Hit your EXACT Spring Boot endpoint: POST /api/items/report/{finderId}
    const response = await apiClient.post(`/items/report/${userId}`, itemData);
    return response.data;
  },

  // NEW: Fetch a single item by its ID
  getItemById: async (id: string): Promise<Item> => {
    // Hits GET http://localhost:8080/api/items/{id}
    const response = await apiClient.get(`/items/${id}`);
    return response.data;
  },

  // Get items reported by the current user
  getMyReportedItems: async () => {
    const userId = localStorage.getItem("user_id");
    const response = await apiClient.get(`/items/user/${userId}`);
    return response.data;
  },

  // Search items by keyword and category
  searchItems: async (keyword: string, category: string) => {
    const response = await apiClient.get('/items/search', {
      params: { 
        keyword: keyword || undefined, 
        category: category !== 'All' ? category : undefined 
      }
    });
    return response.data;
  },
};