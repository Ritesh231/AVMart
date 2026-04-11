import { baseApi } from "../apis/baseApi";

export const Dashboardapi = baseApi.injectEndpoints({

  tags: ["Dashboard"],

  endpoints: (builder) => ({
    getDashboard: builder.query({
      query: ({ range = "monthly", start, end }) => {
        let params = { range };

        if (range === "custom") {
          params.start = start;
          params.end = end;
        }

        return {
          url: "/api/v1/admin/home",
          method: "GET",
          params,
        };
      },
      providesTags: ["Dashboard"],
    }),
  })
})

export const { useGetDashboardQuery } = Dashboardapi;