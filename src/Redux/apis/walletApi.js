import { baseApi } from "../apis/baseApi";

export const Walletapi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWallet: builder.query({
      query: ({
        dateFilter = "today",
        startDate,
        endDate,
      } = {}) => ({
        url: "/api/v1/admin/wallet-cashback/dashboard",
        params: {
          dateFilter,
          ...(dateFilter === "custom" && {
            startDate,
            endDate,
          }),
        },
      }),
      providesTags: ["Wallet"],
    }),
  }),
});

export const { useGetWalletQuery } = Walletapi;