import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    credentials: "include",
    // Prepare headers function
    prepareHeaders: (headers, { getState }) => {
      // Don't set Content-Type for FormData - browser will set it with boundary
      const token = getState()?.auth?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Products",
    "Auth",
    "Users",
    "Banner",
    "Categories", 
    "Subcategories", 
    "Brands",
    "Queries"
  ],
  endpoints: () => ({}),
});