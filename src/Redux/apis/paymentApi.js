import { baseApi } from "../apis/baseApi";

export const paymentapi = baseApi.injectEndpoints({
  tagTypes: ["Payment"],

  endpoints: (builder) => ({
    getTransactionsOverview: builder.query({
      query: ({ tab = "online", page = 1, limit = 20 }) => {
        // Ensure all values are primitives (strings/numbers)
        const params = {
          tab: String(tab),  // Convert to string explicitly
          page: Number(page),
          limit: Number(limit)
        };

        console.log("Sending params:", params); // Debug log

        return {
          url: "/api/v1/adminauth/transactions/overview",
          params: params,
        };
      },
      providesTags: ["Payment"],
    }),
  }),
});

export const { useGetTransactionsOverviewQuery } = paymentapi;