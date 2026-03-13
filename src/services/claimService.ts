import { apiClient } from "@/lib/apiClient";

export const claimService = {
  // Create a new claim for an item
  createClaim: async (itemId: number) => {
    const userId = localStorage.getItem("user_id");
    
    if (!userId) {
      throw new Error("You must be logged in to claim an item.");
    }

    // PERFECT MATCH: Send the exact keys your Java backend expects!
    const response = await apiClient.post(`/claims`, {
      itemId: itemId,
      loserId: Number(userId), // Changed from 'claimantId' to 'loserId'
      proofDescription: "I am the rightful owner of this item." // Added the missing field!
    });
    
    return response.data;
  },
  // NEW: Ask Spring Boot if any claims exist for this item
  getClaimsForItem: async (itemId: number) => {
    const response = await apiClient.get(`/claims/item/${itemId}`);
    return response.data; // Returns an array of Claim objects
  },

  // NEW: Resolve a claim (Approve or Reject)
  resolveClaim: async (claimId: number, action: "APPROVE" | "REJECT") => {
    const finderId = localStorage.getItem("user_id");
    if (!finderId) throw new Error("You must be logged in.");

    // Hits: PUT /api/claims/{claimId}/resolve?finderId=1&action=APPROVE
    const response = await apiClient.put(`/claims/${claimId}/resolve`, null, {
      params: {
        finderId: Number(finderId),
        action: action
      }
    });
    
    return response.data;
  },

  // Get claims submitted by the current user
  getMyClaims: async () => {
    const userId = localStorage.getItem("user_id");
    const response = await apiClient.get(`/claims/user/${userId}`);
    return response.data;
  },

  // Get claims sent to the finder (for their reported items)
  getClaimsToReview: async () => {
    const userId = localStorage.getItem("user_id");
    const response = await apiClient.get(`/claims/finder/${userId}`);
    return response.data;
  },
};