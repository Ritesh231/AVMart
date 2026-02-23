import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    credentials: "include", // ✅ VERY IMPORTANT
  }),
  tagTypes: [
    "Products",
    "Auth",
    "Users",
    "Banner",
    "Categories", 
    "Subcategories", 
    "Brands",
    "Queries",
    "Orders",
    "Wallet",
    "Dashboard",
  ],
  endpoints: () => ({}),
});