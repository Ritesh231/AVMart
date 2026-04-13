import { baseApi } from "../apis/baseApi";

export const deliveryapi = baseApi.injectEndpoints({
  overrideExisting: false,

  tagTypes: ["DeliveryBoys"],

  endpoints: (builder) => ({

    getAllDeliveryBoys: builder.query({
      query: ({ status, period, page, limit, search }) => ({
        url: "/api/v1/delivery/getalldeliveryboys",
        method: "GET",
        params: {
          status,
          period,
          page,
          limit,
          search,
        },
      }),
      providesTags: ["DeliveryBoys"],
    }),

    getAssignDeliveryBoys: builder.mutation({
      query: (body) => ({
        url: "/api/v1/delivery/assignOrderByZone/byAdmin",
        method: "POST",
        body,
      }),
    }),

    updateDeliveryStatus: builder.mutation({
      query: ({ id, body, status }) => ({
        url: `api/v1/adminauth/status/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["DeliveryBoys"],
    }),

    getdeliveryProfile: builder.query({
      query: (id) => ({
        url: `/api/v1/adminauth/delivery-boy/${id}/profile`
      })
    }),

    getDeliveryBoyDetails: builder.query({
      query: ({ id, tab, page = 1, limit = 10 }) => ({
        url: `/api/v1/adminauth/delivery-boy/${id}/tab`,
        params: {
          tab,
          page,
          limit
        },
      }),
    }),

    getDeliveryBoyOrderDetails: builder.query({
      query: (id) => ({
        url: `/api/v1/adminauth/delivery-boy/order/${id}`,
      })
    }),

    getWithdrawalRequests: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `/api/v1/adminauth/withdrawal-requests?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["DeliveryBoys"],
    }),

    verifyWithdrawal: builder.mutation({
      query: (body) => ({
        url: "/api/v1/adminauth/verify-withdrawal",
        method: "POST",
        body,
      }),
      invalidatesTags: ["DeliveryBoys"], // refresh list after action
    }),



  }),
});

export const { useGetAllDeliveryBoysQuery, useGetAssignDeliveryBoysMutation,
  useUpdateDeliveryStatusMutation, useGetdeliveryProfileQuery, useGetDeliveryBoyDetailsQuery,
  useGetDeliveryBoyOrderDetailsQuery, useGetWithdrawalRequestsQuery, useVerifyWithdrawalMutation } = deliveryapi;