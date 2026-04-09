import { baseApi } from "../apis/baseApi";

export const Userapi = baseApi.injectEndpoints({
  tags: ["Users"],

  endpoints: (builder) => ({
    getallusers: builder.query({
      query: (params = {}) => ({
        url: "/api/v1/profile/all",
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          status: params.status || 'all',
          search: params.search || '',
        },
      }),
      providesTags: ["Users"],
    }),

    updateStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/api/v1/adminauth/profiles/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Users"],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/api/v1/profile/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),

  }),
});

export const { useGetallusersQuery, useUpdateStatusMutation, useDeleteUserMutation } = Userapi;