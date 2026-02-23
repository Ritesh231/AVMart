import { baseApi } from "../apis/baseApi";

export const Dashboardapi =  baseApi.injectEndpoints({

tags:["Dashboard"],
 
  endpoints: (builder) => ({
      getDashboard: builder.query({
      query: () => ({
        url: "/api/v1/admin/home",
        method: "GET",
      }),
      providesTags: ["DeliveryBoys"],
    }),      
  })
})

export const { useGetDashboardQuery } = Dashboardapi;