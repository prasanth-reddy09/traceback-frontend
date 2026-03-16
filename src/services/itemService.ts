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
 
  getAllItems: async (page: number = 0, size: number = 10) => {
    const response = await apiClient.get("/items", {
      params: { page, size }
    });
    return response.data; 
  },

  reportItem: async (itemData: any) => {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      throw new Error("Could not find User ID. Please log out and log back in.");
    }

    const response = await apiClient.post(`/items/report/${userId}`, itemData);
    return response.data;
  },

  getItemById: async (id: string): Promise<Item> => {
    const response = await apiClient.get(`/items/${id}`);
    return response.data;
  },

  getMyReportedItems: async () => {
    const userId = localStorage.getItem("user_id");
    const response = await apiClient.get(`/items/user/${userId}`);
    return response.data;
  },

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