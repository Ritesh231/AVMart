import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  credentials: "include",
});

const baseQueryWithAuthCheck = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    localStorage.removeItem("Admin_token");
    localStorage.removeItem("admin");
    window.dispatchEvent(new Event("unauthorized"));
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithAuthCheck,
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
    "Suggestions",
  ],
  endpoints: () => ({}),
});