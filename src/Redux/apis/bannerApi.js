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
      
      addTopSellingBanner:builder.mutation({
         query:(body)=>({
        url:"/api/v1/admin/BestSellerBanner/add",
        method:"POST",
        body,
     }),
      invalidatesTags: ["Banners"],
  }),

  addNormalBanner:builder.mutation({
    query:(body)=>({
      url:`/api/v1/admin/banner/add`,
      method:"POST",
      body,
    }),
     invalidatesTags: ["Banners"],
  }),

   addCategoryBanner:builder.mutation({
    query:(body)=>({
      url:`/api/v1/admin/CatBanner/add`,
      method:"POST",
      body,
    }),
     invalidatesTags: ["Banners"],
  }),

  addSubcategoryBanner:builder.mutation({
    query:(body)=>({
      url:`/api/v1/admin/subCatBanner/add`,
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

export const { useGetallbannersQuery,useAddTopSellingBannerMutation,useDeleteBannerMutation,
  useAddNormalBannerMutation,useAddCategoryBannerMutation,useAddSubcategoryBannerMutation,
 } = Bannerapi;