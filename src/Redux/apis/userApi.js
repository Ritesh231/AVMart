import { baseApi } from "../apis/baseApi";

export const Userapi =  baseApi.injectEndpoints({
  tags:["Users"],
     
  endpoints: (builder) => ({
     getallusers:builder.query({
      query:()=>({
      url:"/api/v1/profile/all"
      }),
      providesTags:["Users"],
     }),
      
      updateStatus:builder.mutation({
      query:({id,status})=>({
      url:`/api/v1/adminauth/profiles/${id}/status`,
      method:"PUT",
      body:{status},
      }),
      invalidatesTags:["Users"],
     }),

       deleteUser:builder.mutation({
      query:(id)=>({
      url:`/api/v1/profile/delete/${id}`,
      method:"DELETE",
      }),
      invalidatesTags:["Users"],
     }),
    
  }),
});

export const { useGetallusersQuery,useUpdateStatusMutation, useDeleteUserMutation } = Userapi;