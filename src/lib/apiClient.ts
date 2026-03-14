import axios from "axios";

// This line checks if a 'NEXT_PUBLIC_API_BASE_URL' exists in the environment.
// If not, it falls back to localhost for your local development.
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
// 1. Create the base client pointing to your Spring Boot API
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. The Interceptor
apiClient.interceptors.request.use((config) => {
  // We check if 'window' is defined because Next.js renders on the server first, 
  // and servers don't have localStorage!
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("jwt_token");
    
    // If the user is logged in and has a token, attach it!
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});