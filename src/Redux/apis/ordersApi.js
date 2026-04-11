import { baseApi } from "../apis/baseApi";

export const Orderapi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // In your ordersApi file
    getOrdersByStatus: builder.query({
      query: ({ status, page, limit }) => {
        // Build URL with proper string parameters
        let url = `api/v1/delivery/get/all?status=${encodeURIComponent(status)}`;
        if (page) url += `&page=${page}`;
        if (limit) url += `&limit=${limit}`;
        return { url };
      },
      providesTags: ["Orders"],
    }),
    // In your ordersApi file
    getOrdersByStatusAssign: builder.query({
      query: ({ status, page = 1, limit = 20 }) => ({
        url: `api/v1/delivery/get/all?deliveryStatus=${encodeURIComponent(status)}&page=${page}&limit=${limit}`,
      }),
      providesTags: ["Orders"],
    }),


    getOrdersById: builder.mutation({
      query: (id) => ({
        url: `api/v1/delivery/getorder/${id}`
      }),
      providesTags: ["Orders"],
    }),

    getOrderDetailsById: builder.mutation({
      query: ({ id, page, per_page }) => ({
        url: `/api/v1/profile/getUserDetail/${id}`,
        params: {
          page,
          per_page,
        },
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