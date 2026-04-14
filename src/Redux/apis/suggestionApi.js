import { baseApi } from "../apis/baseApi";

export const Suggestionapi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getallsuggestions: builder.query({
            query: ({ page = 1, limit = 5 }) => ({
                url: `/api/v1/adminauth/suggestions/all?page=${page}&limit=${limit}`,
            }),
            providesTags: ["Suggestions"],
        }),
    }),
});

export const { useGetallsuggestionsQuery } = Suggestionapi;