import { baseApi } from "../apis/baseApi";

export const Productsapi =  baseApi.injectEndpoints({
 
  endpoints: (builder) => ({
   getallcategories:builder.query({
     credentials: "include",
   query:()=>({
    url:"/api/v1/admin/categories/all"
   }),
    providesTags: ["Categories"],
   }),
   
   getallSubcategories:builder.query({
    query:()=>({
     url:"/api/v1/admin/subcategory/all",
    }),
    providesTags: ["Subcategories"],
   }),
   
   getallBrands:builder.query({
    query:()=>({
      url:"/api/v1/admin/brand/all",
    }),
     providesTags: ["Brands"],
   }),

   /*************Product**********************/

      getallproducts:builder.query({
    query:()=>({
        url:"/api/v1/admin/products/all-detailed"
    }),
      providesTags: ["Products"],
   }),
     
      addProduct: builder.mutation({
      query: (body) => {
        // Check if body is FormData
        const isFormData = body instanceof FormData;
        
        return {
          url: "/api/v1/admin/products/create",
          method: "POST",
          body: body,
          // Don't set Content-Type header for FormData
          // Browser will automatically set it with the correct boundary
          headers: isFormData ? {} : {
            'Content-Type': 'application/json',
          },
        };
      },
      // Invalidates cache if needed
      invalidatesTags: ['Products'],
    }),
  

   updateProduct:builder.mutation({
   query:({id,body})=>({
    url:`/api/v1/admin/products/update/${id}`,
    method:"PUT",
    body,
   }),
  invalidatesTags: ["Products"],
   }),

   deleteProduct:builder.mutation({
    query:(id)=>({
      url:`/api/v1/admin/products/delete/${id}`,
      method:"DELETE",
    }),
    invalidatesTags: ["Products"],
   }),
   
/*****************Category********************/
   addCategory:builder.mutation({
    query:(body)=>({
      url:"/api/v1/admin/categories/create",
      method:"POST",
      body,
    }),
     invalidatesTags: ["Categories"],
   }),

      editCategory:builder.mutation({
    query:({id,...body})=>({
      url:`/api/v1/admin/categories/update/${id}`,
      method:"PUT",
      body,
    }),
     invalidatesTags: ["Categories"],
   }),

   deleteCategory:builder.mutation({
    query:(id)=>({
      url:`/api/v1/admin/categories/delete/${id}`,
      method:"DELETE",
    }),
     invalidatesTags: ["Categories"],
   }),

   /****************************Subcategory *********************/

     addSubcategory:builder.mutation({
    query:(body)=>({
      url:"/api/v1/admin/subcategory/create",
      method:"POST",
      body,
    }),
      invalidatesTags: ["Subcategories"],
   }),
   
 editSubcategory: builder.mutation({
  query: ({ id, body }) => ({
    url: `/api/v1/admin/subcategory/update/${id}`,
    method: "PUT",
    body,
  }),
  invalidatesTags: ["Subcategories"],
}),

deleteSubcategory:builder.mutation({
query:(id)=>({
  url:`/api/v1/admin/subcategory/delete/${id}`,
  method:"DELETE",
}),
invalidatesTags: ["Subcategories"],
}),


   /************************Brand********************** */

      addBrand:builder.mutation({
    query:(body)=>({
      url:"/api/v1/admin/brand/create",
      method:"POST",
      body,
    }),
     invalidatesTags: ["Brands"],
   }),

   updateBrand:builder.mutation({
    query:({id,body})=>({
      url:`/api/v1/admin/brand/update/${id}`,
      method:"PUT",
      body,
    }),
     invalidatesTags: ["Brands"],
   }),

   deleteBrand:builder.mutation({
    query:(id)=>({
      url:`/api/v1/admin/brand/delete/${id}`,
      method:"DELETE",
    })
   }),
    invalidatesTags: ["Brands"],
  }),
});

export const { useGetallproductsQuery, useGetallcategoriesQuery, 
  useGetallSubcategoriesQuery, useGetallBrandsQuery, useAddProductMutation, 
  useAddCategoryMutation, useAddSubcategoryMutation, useAddBrandMutation,useEditCategoryMutation,
useDeleteCategoryMutation, useEditSubcategoryMutation,useDeleteSubcategoryMutation,
useUpdateProductMutation,useDeleteProductMutation, useUpdateBrandMutation,useDeleteBrandMutation } = Productsapi;