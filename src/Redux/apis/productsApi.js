import { baseApi } from "../apis/baseApi";

export const Productsapi =  baseApi.injectEndpoints({
 
  endpoints: (builder) => ({
   getallproducts:builder.query({
    query:()=>({
        url:"/api/v1/admin/products/all"
    })
   }),
   
   getallcategories:builder.query({
   query:()=>({
    url:"/api/v1/admin/categories/all"
   })
   }),
   
   getallSubcategories:builder.query({
    query:()=>({
     url:"/api/v1/admin/subcategory/all",
    })
   }),
   
   getallBrands:builder.query({
    query:()=>({
      url:"/api/v1/admin/brand/all",
    })
   }),

   /*************Product**********************/
     
    addProduct:builder.mutation({
    query:(body)=>({
      url:"/api/v1/admin/products/create",
      method:"POST",
      body,
    })
   }),

   updateProduct:builder.mutation({
   query:({id,body})=>({
    url:`/api/v1/admin/products/update/${id}`,
    method:"PUT",
    body,
   })
   }),

   deleteProduct:builder.mutation({
    query:(id)=>({
      url:`/api/v1/admin/products/delete/${id}`,
      method:"DELETE",
    })
   }),
   
/*****************Category********************/
   addCategory:builder.mutation({
    query:(body)=>({
      url:"/api/v1/admin/categories/create",
      method:"POST",
      body,
    })
   }),

      editCategory:builder.mutation({
    query:({id,...body})=>({
      url:`/api/v1/admin/categories/update/${id}`,
      method:"PUT",
      body,
    })
   }),

   deleteCategory:builder.mutation({
    query:(id)=>({
      url:`/api/v1/admin/categories/delete/${id}`,
      method:"DELETE",
    })
   }),

   /****************************Subcategory *********************/

     addSubcategory:builder.mutation({
    query:(body)=>({
      url:"/api/v1/admin/subcategory/create",
      method:"POST",
      body,
    })
   }),
   
 editSubcategory: builder.mutation({
  query: ({ id, body }) => ({
    url: `/api/v1/admin/subcategory/update/${id}`,
    method: "PUT",
    body,
  }),
}),

deleteSubcategory:builder.mutation({
query:(id)=>({
  url:`/api/v1/admin/subcategory/delete/${id}`,
  method:"DELETE",
})
}),


   /************************Brand********************** */

      addBrand:builder.mutation({
    query:(body)=>({
      url:"/api/v1/admin/brand/create",
      method:"POST",
      body,
    })
   }),

   updateBrand:builder.mutation({
    query:({id,body})=>({
      url:`/api/v1/admin/brand/update/${id}`,
      method:"PUT",
      body,
    })
   }),

   deleteBrand:builder.mutation({
    query:(id)=>({
      url:`/api/v1/admin/brand/delete/${id}`,
      method:"DELETE",
    })
   })
  }),
});

export const { useGetallproductsQuery, useGetallcategoriesQuery, 
  useGetallSubcategoriesQuery, useGetallBrandsQuery, useAddProductMutation, 
  useAddCategoryMutation, useAddSubcategoryMutation, useAddBrandMutation,useEditCategoryMutation,
useDeleteCategoryMutation, useEditSubcategoryMutation,useDeleteSubcategoryMutation,
useUpdateProductMutation,useDeleteProductMutation, useUpdateBrandMutation,useDeleteBrandMutation } = Productsapi;