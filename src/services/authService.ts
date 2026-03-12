import { apiClient } from "@/lib/apiClient";

export const authService = {
  // 1. Register a new user
  register: async (userData: any) => {
    // Hits POST http://localhost:8080/api/users/register
    const response = await apiClient.post("/users/register", userData);
    return response.data;
  },

  // 2. Log in and save the token
  login: async (credentials: any) => {
    // Hits POST http://localhost:8080/api/users/login
    const response = await apiClient.post("/users/login", credentials);
    
    // Spring Boot sends back the JWT token. Let's save it to the browser's safe!
    const token = response.data; 
    
    if (token) {
      // If your backend returns a JSON object like { token: "ey..." }, use token.token
      // If it returns a raw string, just use token.
      const jwt = typeof token === "string" ? token : token.token;
      localStorage.setItem("jwt_token", jwt);
    }
    
    return response.data;
  },

  // 3. Log out (Just destroy the token!)
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("jwt_token");
      // Redirect back to the login page
      window.location.href = "/login";
    }
  }
};