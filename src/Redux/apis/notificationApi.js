import { baseApi } from "../apis/baseApi";

export const Notificationapi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // Get All Notifications
        getAllNotifications: builder.query({
            query: () => ({
                url: "/api/v1/admin/notifications/get-all",
                method: "GET",
            }),
            providesTags: ["Notification"],
        }),

        // Get Unread Count
        getUnreadNotificationCount: builder.query({
            query: () => ({
                url: "/api/v1/admin/notifications/unread-count",
                method: "GET",
            }),
            providesTags: ["Notification"],
        }),

        // Mark All Notifications as Read
        markAllNotificationsRead: builder.mutation({
            query: () => ({
                url: "/api/v1/admin/notifications/mark-all-read",
                method: "PUT",
            }),
            invalidatesTags: ["Notification"],
        }),

        // Mark Single Notification as Read
        markNotificationRead: builder.mutation({
            query: (id) => ({
                url: `/api/v1/admin/notifications/update/${id}/read`,
                method: "PUT",
            }),
            invalidatesTags: ["Notification"],
        }),

        // Delete Notification
        deleteNotification: builder.mutation({
            query: (id) => ({
                url: `/api/v1/admin/notifications/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Notification"],
        }),

    }),
});

export const {
    useGetAllNotificationsQuery,
    useGetUnreadNotificationCountQuery,
    useMarkAllNotificationsReadMutation,
    useMarkNotificationReadMutation,
    useDeleteNotificationMutation,
} = Notificationapi;