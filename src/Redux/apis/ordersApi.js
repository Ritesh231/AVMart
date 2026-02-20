import { baseApi } from "../apis/baseApi";

export const Orderapi =  baseApi.injectEndpoints({

    tags:["Orders"],
 
  endpoints: (builder) => ({
     getallorders:builder.query({
      query:()=>({
      url:"api/v1/delivery/get/all?status=Pending"
      }),
      providesTags:["Orders"],
     }),
      
     
})
})

export const { useGetallordersQuery } = Orderapi;