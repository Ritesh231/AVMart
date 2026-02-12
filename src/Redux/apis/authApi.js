import { baseApi } from "../apis/baseApi";

export const Authapi =  baseApi.injectEndpoints({
 
  endpoints: (builder) => ({
     login:builder.mutation({
        query:(credentials)=>({
           url:"/api/v1/adminauth/login",
           method:"POST", 
           body:credentials,
        })
     })
  }),
});

export const { useLoginMutation } = Authapi;