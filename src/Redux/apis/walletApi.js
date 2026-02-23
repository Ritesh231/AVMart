import { baseApi } from "../apis/baseApi";

export const Walletapi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWallet: builder.query({
      query: (status) => ({
        url: `/api/v1/admin/wallet-cashback/dashboard`,
      }),
      providesTags: ["Wallet"],
    }),

  
    
  }),
});

export const { useGetWalletQuery } = Walletapi;