import { baseApi } from "../apis/baseApi";

export const Reportapi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getReports: builder.query({
            query: ({ filterType, fromDate, toDate } = {}) => {
                let url = `/api/v1/admin/report/reports`;

                const params = new URLSearchParams();

                if (filterType) params.append("filterType", filterType);
                if (fromDate) params.append("fromDate", fromDate);
                if (toDate) params.append("toDate", toDate);

                if ([...params].length > 0) {
                    url += `?${params.toString()}`;
                }

                return {
                    url,
                    method: "GET",
                    credentials: "include", // ✅ IMPORTANT for cookie (DeliveryBoy_token)
                };
            },
            providesTags: ["Reports"],
        }),

    }),
});

export const {
    useGetReportsQuery,
} = Reportapi;