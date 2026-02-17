import { baseApi } from "../apis/baseApi";

export const Queriesapi =  baseApi.injectEndpoints({
     
  endpoints: (builder) => ({
     getallqueries:builder.query({
      query:()=>({
      url:"/api/v1/admin/queries/all"
      }),
      providesTags:["Queries"],
     }),

     markasContacted:builder.mutation({
        query:({id,status})=>({
         url:`/api/v1/admin/queries/${id}/status`,
         method:"PUT",
         body:{status},
        }),
        invalidatesTags:["Queries"],
     }),
     
     deleteQuery:builder.mutation({
        query:(id)=>({
          url:`/api/v1/admin/queries/${id}`,
          method:"DELETE",  
        })
     })
    
  }),
});

export const { useGetallqueriesQuery,useMarkasContactedMutation,useDeleteQueryMutation} = Queriesapi;