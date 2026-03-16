import { apiClient } from "@/lib/apiClient";

export const claimService = {
  createClaim: async (itemId: number) => {
    const userId = localStorage.getItem("user_id");
    
    if (!userId) {
      throw new Error("You must be logged in to claim an item.");
    }

    const response = await apiClient.post(`/claims`, {
      itemId: itemId,
      loserId: Number(userId),
      proofDescription: "I am the rightful owner of this item."
    });
    
    return response.data;
  },
 
  getClaimsForItem: async (itemId: number) => {
    const response = await apiClient.get(`/claims/item/${itemId}`);
    return response.data; 
  },

  resolveClaim: async (claimId: number, action: "APPROVE" | "REJECT") => {
    const finderId = localStorage.getItem("user_id");
    if (!finderId) throw new Error("You must be logged in.");

    const response = await apiClient.put(`/claims/${claimId}/resolve`, null, {
      params: {
        finderId: Number(finderId),
        action: action
      }
    });
    
    return response.data;
  },

  getMyClaims: async () => {
    const userId = localStorage.getItem("user_id");
    const response = await apiClient.get(`/claims/user/${userId}`);
    return response.data;
  },

  getClaimsToReview: async () => {
    const userId = localStorage.getItem("user_id");
    const response = await apiClient.get(`/claims/finder/${userId}`);
    return response.data;
  },
};