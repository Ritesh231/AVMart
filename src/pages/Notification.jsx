import React, { useMemo, useState } from "react";
import {
    Package,
    Truck,
    Wallet,
    MessageCircle,
    Settings,
    Bell,
    Check,
    CheckCheck,
    Trash2,
    Inbox,
} from "lucide-react";
import {
    useGetAllNotificationsQuery,
    useMarkAllNotificationsReadMutation,
    useMarkNotificationReadMutation,
    useDeleteNotificationMutation,
} from "../Redux/apis/notificationApi";
import { toast } from "react-toastify";

const CATEGORY_META = {
    order: {
        label: "Order",
        icon: Package,
        dot: "bg-blue-500",
        badge: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200",
        rail: "bg-blue-500",
    },
    driver: {
        label: "Driver",
        icon: Truck,
        dot: "bg-emerald-500",
        badge: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
        rail: "bg-emerald-500",
    },
    payment: {
        label: "Payment",
        icon: Wallet,
        dot: "bg-violet-500",
        badge: "bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200",
        rail: "bg-violet-500",
    },
    support: {
        label: "Support",
        icon: MessageCircle,
        dot: "bg-rose-500",
        badge: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200",
        rail: "bg-rose-500",
    },
    system: {
        label: "System",
        icon: Settings,
        dot: "bg-slate-500",
        badge: "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-300",
        rail: "bg-slate-400",
    },
};

const FILTERS = [
    { key: "all", label: "All" },
    { key: "unread", label: "Unread" },
    { key: "order", label: "Orders" },
    { key: "driver", label: "Drivers" },
    { key: "payment", label: "Payments" },
    { key: "support", label: "Support" },
    { key: "system", label: "System" },
];

function timeAgo(iso) {
    const diffMs = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(iso).toLocaleDateString("en-GB");
}

export default function NotificationsPage() {
    const [activeFilter, setActiveFilter] = useState("all");

    const { data, isLoading, isFetching, isError, refetch } =
        useGetAllNotificationsQuery();
    const [markAllRead, { isLoading: markingAll }] =
        useMarkAllNotificationsReadMutation();
    const [markOneRead] = useMarkNotificationReadMutation();
    const [deleteNotification] = useDeleteNotificationMutation();

    const notifications = data?.notifications ?? [];

    const unreadCount = useMemo(
        () => notifications.filter((n) => !n.isRead).length,
        [notifications]
    );

    const visibleNotifications = useMemo(() => {
        if (activeFilter === "all") return notifications;
        if (activeFilter === "unread") return notifications.filter((n) => !n.isRead);
        return notifications.filter((n) => n.category === activeFilter);
    }, [notifications, activeFilter]);

    const handleMarkAllRead = async () => {
        try {
            await markAllRead().unwrap();
            toast.success("All notifications marked as read");
        } catch (e) {
            console.error("Failed to mark all as read", e);
            toast.error("Failed to mark all as read");
        }
    };

    const handleMarkOneRead = async (id) => {
        try {
            await markOneRead(id).unwrap();
            toast.success("Notification marked as read");
        } catch (e) {
            console.error("Failed to mark notification as read", e);
            toast.error("Failed to mark notification as read");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this notification?")) return;
        try {
            await deleteNotification(id).unwrap();
            toast.success("Notification deleted successfully");
        } catch (e) {
            console.error("Failed to delete notification", e);
            toast.error("Failed to delete notification");
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F6FA] p-4 md:p-6">
            {/* Header card */}
            <div className="mb-4 flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B1440]">
                        <Bell className="h-5 w-5 text-[#FF7A1A]" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-[#0B1440]">
                            Notifications
                        </h1>
                        <p className="text-sm text-slate-400">
                            {unreadCount > 0
                                ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                                : "You're all caught up"}
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleMarkAllRead}
                    disabled={markingAll || unreadCount === 0}
                    className="inline-flex items-center gap-2 self-start rounded-xl bg-[#FF7A1A] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e96c10] disabled:cursor-not-allowed disabled:opacity-40 md:self-auto"
                >
                    <CheckCheck className="h-4 w-4" />
                    Mark all as read
                </button>
            </div>

            {/* Filter pills */}
            <div className="mb-4 flex flex-wrap gap-2 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
                {FILTERS.map((f) => {
                    const isActive = activeFilter === f.key;
                    const count =
                        f.key === "all"
                            ? notifications.length
                            : f.key === "unread"
                                ? unreadCount
                                : notifications.filter((n) => n.category === f.key).length;
                    return (
                        <button
                            key={f.key}
                            onClick={() => setActiveFilter(f.key)}
                            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${isActive
                                ? "bg-[#0B1440] text-white shadow-sm"
                                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                                }`}
                        >
                            {f.label}
                            <span
                                className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${isActive
                                    ? "bg-[#FF7A1A] text-white"
                                    : "bg-white text-slate-400 ring-1 ring-inset ring-slate-200"
                                    }`}
                            >
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* List card */}
            <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
                {isLoading && (
                    <div className="flex flex-col items-center justify-center gap-2 py-16 text-slate-400">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#FF7A1A]" />
                        <p className="text-sm">Loading notifications…</p>
                    </div>
                )}

                {isError && !isLoading && (
                    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400">
                        <p className="text-sm">Couldn't load notifications.</p>
                        <button
                            onClick={refetch}
                            className="rounded-lg bg-[#0B1440] px-4 py-2 text-sm font-medium text-white hover:bg-[#141d52]"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {!isLoading && !isError && visibleNotifications.length === 0 && (
                    <div className="flex flex-col items-center justify-center gap-2 py-16 text-slate-400">
                        <Inbox className="h-8 w-8 text-slate-300" />
                        <p className="text-sm">Nothing here yet.</p>
                    </div>
                )}

                {!isLoading && !isError && visibleNotifications.length > 0 && (
                    <ul className="divide-y divide-slate-100">
                        {visibleNotifications.map((n) => {
                            const meta = CATEGORY_META[n.category] ?? CATEGORY_META.system;
                            const Icon = meta.icon;
                            return (
                                <li
                                    key={n._id}
                                    className={`group relative flex gap-4 px-5 py-4 transition hover:bg-slate-50 ${!n.isRead ? "bg-orange-50/40" : ""
                                        }`}
                                >
                                    {/* left color rail for unread */}
                                    <span
                                        className={`absolute left-0 top-0 h-full w-1 rounded-r ${!n.isRead ? meta.rail : "bg-transparent"
                                            }`}
                                    />

                                    {/* icon */}
                                    <div
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.badge}`}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </div>

                                    {/* content */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-sm font-semibold text-[#0B1440]">
                                                {n.title}
                                            </h3>
                                            <span
                                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${meta.badge}`}
                                            >
                                                {meta.label}
                                            </span>
                                            {n.priority === "high" && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-600 ring-1 ring-inset ring-red-200">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                                    High priority
                                                </span>
                                            )}
                                            {!n.isRead && (
                                                <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                                            )}
                                        </div>
                                        <p className="mt-1 text-sm text-slate-500">{n.body}</p>
                                        <p className="mt-1.5 text-xs text-slate-400">
                                            {timeAgo(n.createdAt)}
                                        </p>
                                    </div>

                                    {/* actions */}
                                    <div className="flex shrink-0 items-start gap-1 opacity-100 transition ">
                                        {!n.isRead && (
                                            <button
                                                onClick={() => handleMarkOneRead(n._id)}
                                                title="Mark as read"
                                                className="rounded-lg p-2 text-slate-400 bg-emerald-100 text-emerald-500 hover:bg-emerald-200 hover:text-emerald-900"
                                            >
                                                <Check className="h-4 w-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(n._id)}
                                            title="Delete"
                                            className="rounded-lg p-2 text-slate-400 bg-rose-100 text-rose-800 hover:bg-rose-200 hover:text-rose-900"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}

                {isFetching && !isLoading && (
                    <div className="border-t border-slate-100 py-2 text-center text-xs text-slate-400">
                        Refreshing…
                    </div>
                )}
            </div>
        </div>
    );
}