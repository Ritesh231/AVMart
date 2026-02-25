import { baseApi } from "../apis/baseApi";

export const Bannerapi =  baseApi.injectEndpoints({

tags:["Banners"],
 
  endpoints: (builder) => ({
     getallbanners:builder.query({
      query:()=>({
      url:"/api/v1/adminauth/offers?type=main/category/subcategory/mostselling"
      }),
      providesTags:["Banners"],
     }),
      
      addBanner:builder.mutation({
         query:(body)=>({
        url:"/api/v1/admin/BestSellerBanner/add",
        method:"POST",
        body,
     }),
      invalidatesTags: ["Banners"],
  }),

  deleteBanner:builder.mutation({
   query:(id)=>({
    url:`/api/v1/admin/BestSellerBanner/delete/${id}`,  
    method:"DELETE",
   }),
    invalidatesTags: ["Banners"],
  }),
      
})
})

export const { useGetallbannersQuery,useAddBannerMutation,useDeleteBannerMutation } = Bannerapi;