import { baseApi } from "../apis/baseApi";

// ✅ move outside
const buildQuery = ({ filterType, fromDate, toDate }) => {
    const params = new URLSearchParams();

    if (filterType) params.append("filterType", filterType);
    if (fromDate) params.append("fromDate", fromDate);
    if (toDate) params.append("toDate", toDate);

    return params.toString() ? `?${params.toString()}` : "";
};

export const Reportapi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // 🔹 All Reports
        getReports: builder.query({
            query: (filters = {}) => ({
                url: `/api/v1/admin/report/reports${buildQuery(filters)}`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Reports"],
        }),

        // 🔹 Total Profit
        getTotalProfit: builder.query({
            query: (filters = {}) => ({
                url: `/api/v1/admin/report/total-profit${buildQuery(filters)}`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Reports"],
        }),

        // 🔹 Total Revenue
        getTotalRevenue: builder.query({
            query: (filters = {}) => ({
                url: `/api/v1/admin/report/total-reveune${buildQuery(filters)}`,
                method: 'GET',
                credentials: 'include',
            }),
            providesTags: ['Reports'],
        }),


        // 🔹 Total Sales
        getTotalSales: builder.query({
            query: (filters = {}) => ({
                url: `/api/v1/admin/report/total-sales${buildQuery(filters)}`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Reports"],
        }),

        // 🔹 Inrate / Outrate
        getInrateOutrate: builder.query({
            query: (filters = {}) => ({
                url: `/api/v1/admin/report/inrate-outrate${buildQuery(filters)}`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Reports"],
        }),

        // 🔹 All Reports with status
        getAllReports: builder.query({
            query: ({ status, ...filters }) => {
                const params = new URLSearchParams();

                if (filters.filterType) params.append("filterType", filters.filterType);
                if (filters.fromDate) params.append("fromDate", filters.fromDate);
                if (filters.toDate) params.append("toDate", filters.toDate);

                if (status) params.append("status", status); // ✅ FIX

                return {
                    url: `/api/v1/admin/report/all?${params.toString()}`,
                    method: "GET",
                    credentials: "include",
                };
            },
            providesTags: ["Reports"],
        }),

    }),
});

export const {
    useGetReportsQuery,
    useGetTotalProfitQuery,
    useGetTotalRevenueQuery,
    useGetTotalSalesQuery,
    useGetInrateOutrateQuery,
    useGetAllReportsQuery,
} = Reportapi;