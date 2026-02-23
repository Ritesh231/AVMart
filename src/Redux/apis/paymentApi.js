import { baseApi } from "../apis/baseApi";

export const paymentapi = baseApi.injectEndpoints({
  tagTypes: ["Payment"],

  endpoints: (builder) => ({
    getTransactionsOverview: builder.query({
      query: (tab = "online") => ({
        url: "/api/v1/adminauth/transactions/overview",
        params: { tab },   
      }),
      providesTags: ["Payment"],
    }),
  }),
});

export const { useGetTransactionsOverviewQuery } = paymentapi;