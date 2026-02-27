import { baseApi } from "../apis/baseApi";

export const Orderapi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrdersByStatus: builder.query({
      query: (status) => ({
        url: `api/v1/delivery/get/all?status=${status}`,
      }),
      providesTags: ["Orders"],
    }),

     getOrdersByStatusAssign: builder.query({
      query: (status) => ({
        url: `api/v1/delivery/get/all?deliveryStatus=${status}`,
      }),
      providesTags: ["Orders"],
    }),


    getOrdersById: builder.mutation({
      query: (id) => ({
        url: `api/v1/delivery/getorder/${id}`
      }),
      providesTags: ["Orders"],
    }),
    
    getOrderDetailsById:builder.mutation({
      query:(id)=>({
        url:`/api/v1/profile/getUserDetail/${id}`
      }),
       providesTags: ["Orders"],
    }),
     
    assignOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/api/v1/admin/order/status/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const { useGetOrdersByStatusQuery, useGetOrdersByIdMutation, 
  useAssignOrderStatusMutation, useGetOrderDetailsByIdMutation,
useGetOrdersByStatusAssignQuery } = Orderapi;