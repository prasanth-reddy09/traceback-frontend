import { apiClient } from "@/lib/apiClient";

export const authService = {
 register: async (userData: any) => {
    const payload = {
      name: userData.name,
      email: userData.email,
      passwordHash: userData.password 
    };

    const response = await apiClient.post("/users/register", payload);
    return response.data;
  },

  login: async (credentials: any) => {
    const response = await apiClient.post("/users/login", credentials);
    const data = response.data; 
    if (data.token) {
      localStorage.setItem("jwt_token", data.token);
      
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
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_name");
      window.location.href = "/login";
    }
  }
};