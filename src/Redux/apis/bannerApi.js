import { baseApi } from "../apis/baseApi";

export const Bannerapi = baseApi.injectEndpoints({

  tags: ["Banners"],

  endpoints: (builder) => ({
    getallbanners: builder.query({
      query: () => ({
        url: "/api/v1/adminauth/offers?type=main/category/subcategory/mostselling"
      }),
      providesTags: ["Banners"],
    }),

    addTopSellingBanner: builder.mutation({
      query: (body) => ({
        url: "/api/v1/admin/BestSellerBanner/add",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Banners"],
    }),

    addNormalBanner: builder.mutation({
      query: (body) => ({
        url: `/api/v1/admin/banner/add`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Banners"],
    }),

    addCategoryBanner: builder.mutation({
      query: (body) => ({
        url: `/api/v1/admin/CatBanner/add`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Banners"],
    }),

    addSubcategoryBanner: builder.mutation({
      query: (body) => ({
        url: `/api/v1/admin/subCatBanner/add`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Banners"],
    }),

    deleteBanner: builder.mutation({
      query: ({ id, type }) => {
        let url = "";

        switch (type) {
          case "main":
            url = `/api/v1/admin/banner/delete/${id}`; // updated for main banner
            break;
          case "category":
            url = `/api/v1/admin/CatBanner/${id}`;
            break;
          case "subcategory":
            url = `/api/v1/admin/subCatBanner/delete/${id}`;
            break;
          case "mostselling":
            url = `/api/v1/admin/BestSellerBanner/delete/${id}`;
            break;
          default:
            url = `/api/v1/admin/banner/delete/${id}`;
        }

        return {
          url,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Banners"],
    }),

  })
})

export const { useGetallbannersQuery, useAddTopSellingBannerMutation, useDeleteBannerMutation,
  useAddNormalBannerMutation, useAddCategoryBannerMutation, useAddSubcategoryBannerMutation,
} = Bannerapi;