import { baseApi } from "../apis/baseApi";

export const deliveryapi = baseApi.injectEndpoints({
  overrideExisting: false,

  tagTypes: ["DeliveryBoys"],

  endpoints: (builder) => ({
    
    getAllDeliveryBoys: builder.query({
      query: ({ status, period }) => ({
        url: "/api/v1/delivery/getalldeliveryboys",
        method: "GET",
        params: {
          status,  
          period,  
        },
      }),
      providesTags: ["DeliveryBoys"],
    }),
    
    getAssignDeliveryBoys:builder.mutation({
      query:(body)=>({
        url:"/api/v1/delivery/assignOrderByZone/byAdmin",
        method:"POST",
        body,
      }),
    }),

    updateDeliveryStatus:builder.mutation({
      query:({id,body,status})=>({
        url:`api/v1/adminauth/status/${id}`,
        method:"PUT",
        body:{status},
      }),
       invalidatesTags: ["DeliveryBoys"],
    }),
    
    getdeliveryProfile:builder.query({
      query:(id)=>({
        url:`/api/v1/adminauth/delivery-boy/${id}/profile`
      })
    }),
 getDeliveryBoyDetails: builder.query({
  query: ({ id, tab }) => ({
    url: `/api/v1/adminauth/delivery-boy/${id}/tab`,
    params: { tab },
  }),
}),

getDeliveryBoyOrderDetails:builder.query({
  query:(id)=>({
    url:`/api/v1/adminauth/delivery-boy/order/${id}`,
  })
})
    
 }),
});

export const { useGetAllDeliveryBoysQuery, useGetAssignDeliveryBoysMutation,
  useUpdateDeliveryStatusMutation,useGetdeliveryProfileQuery,useGetDeliveryBoyDetailsQuery,
useGetDeliveryBoyOrderDetailsQuery} = deliveryapi;