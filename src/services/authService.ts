import { apiClient } from "@/lib/apiClient";

export const authService = {
 register: async (userData: any) => {
    // TRANSLATION LAYER: Map the frontend 'password' to the backend 'passwordHash'
    const payload = {
      name: userData.name,
      email: userData.email,
      passwordHash: userData.password // <-- The Magic Fix!
    };

    const response = await apiClient.post("/users/register", payload);
    return response.data;
  },

  login: async (credentials: any) => {
    const response = await apiClient.post("/users/login", credentials);
    const data = response.data; // This contains token, userId, and name!
    
    if (data.token) {
      // Save the token
      localStorage.setItem("jwt_token", data.token);
      
      // NEW: Save the user ID and name directly to localStorage!
      if (data.userId) {
        localStorage.setItem("user_id", data.userId.toString());
      }
      if (data.name) {
        localStorage.setItem("user_name", data.name);
      }
    }
    
    return data;
  },

  logout: () => {
    if (typeof window !== "undefined") {
      // Clear EVERYTHING out of the safe when they log out
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_name");
      window.location.href = "/login";
    }
  }
};