import React from 'react';
import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Users, ShoppingCart, Package,
    FileText, CreditCard, Truck, MessageSquare, Tag, Wallet, Bell, Calendar,
    Settings, Check, CheckCheck, Inbox
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from "../Redux/apis/authApi";
import {
    useGetAllNotificationsQuery,
    useGetUnreadNotificationCountQuery,
    useMarkAllNotificationsReadMutation,
    useMarkNotificationReadMutation,
} from "../Redux/apis/notificationApi";
// import useAdminNotificationsSocket from "../hooks/UseAdminNotificationSocket";
import { RiArrowDropDownLine } from "react-icons/ri";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { HiDocumentReport } from "react-icons/hi";

// Small, header-scoped version of the category styling used on the full
// Notifications page — kept in sync visually (blue/emerald/violet/rose/slate).
const CATEGORY_META = {
    order: { icon: Package, badge: "bg-blue-50 text-blue-600" },
    driver: { icon: Truck, badge: "bg-emerald-50 text-emerald-600" },
    payment: { icon: Wallet, badge: "bg-violet-50 text-violet-600" },
    support: { icon: MessageSquare, badge: "bg-rose-50 text-rose-600" },
    system: { icon: Settings, badge: "bg-slate-100 text-slate-600" },
};

function timeAgo(iso) {
    const diffMs = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
}

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Keeps the notification cache live via socket events, app-wide
    // useAdminNotificationsSocket();



    const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

    const handleLogout = async () => {
        try {
            await logout().unwrap();
            localStorage.removeItem("Admin_token");
            localStorage.removeItem("admin");
            navigate("/", { replace: true });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const [showNotifications, setShowNotifications] = useState(false);
    const notifRef = useRef(null);

    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        const storedAdmin = localStorage.getItem("admin");
        if (storedAdmin) {
            setAdmin(JSON.parse(storedAdmin));
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // --- Live notifications ---
    const { data: unreadData } = useGetUnreadNotificationCountQuery();
    const { data: notifData, isLoading: notifLoading } = useGetAllNotificationsQuery();
    const [markAllRead, { isLoading: markingAll }] = useMarkAllNotificationsReadMutation();
    const [markOneRead] = useMarkNotificationReadMutation();

    const unreadCount = unreadData?.unreadCount ?? 0;
    const latestNotifications = (notifData?.notifications ?? []).slice(0, 5);

    const handleMarkAllRead = async (e) => {
        e.stopPropagation();
        try {
            await markAllRead().unwrap();
        } catch (err) {
            console.error("Failed to mark all as read", err);
        }
    };

    const handleNotificationClick = async (notif) => {
        if (!notif.isRead) {
            try {
                await markOneRead(notif._id).unwrap();
            } catch (err) {
                console.error("Failed to mark notification as read", err);
            }
        }
        setShowNotifications(false);
        navigate("/notification");
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
        { name: 'Users', path: '/users', icon: <Users size={18} /> },
        { name: 'Orders', path: '/orders', icon: <ShoppingCart size={18} /> },
        { name: 'Products', path: '/products', icon: <Package size={18} /> },
        { name: 'Payments', path: '/payments', icon: <CreditCard size={18} /> },
        { name: 'Delivery Boy', path: '/delivery', icon: <Truck size={18} /> },
        { name: 'Queries', path: '/queries', icon: <MessageSquare size={18} /> },
        { name: 'Offers', path: '/offers', icon: <Tag size={18} /> },
        { name: 'Wallet', path: '/wallet', icon: <Wallet size={18} /> },
        { name: 'Suggestions', path: '/suggestions', icon: <MessageSquare size={18} /> },
        { name: 'Reports', path: '/reports', icon: <HiDocumentReport size={18} /> },
        { name: 'Notifications', path: '/notification', icon: <Bell size={18} /> },
    ];

    const isActiveRoute = (path) => {
        if (path === "/") {
            return location.pathname === "/";
        }
        return location.pathname.startsWith(path);
    };

    return (
        <header className="w-full bg-white shadow-sm">
            {/* Top Header Section */}
            <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center">
                    <div className="flex  items-center gap-2 font-black text-2xl text-brand-navy italic">
                        <img src="./AVMartLogo.png" alt="" className='w-36 h-20' />
                    </div>
                </div>

                <div className="flex items-center gap-4 md:gap-6">
                    <div className="hidden md:flex items-center bg-gradient-to-r from-[#FD610D] to-[#FF8800] px-4 py-2 rounded-xl text-white font-bold gap-3">
                        <span>{new Date().toLocaleDateString("en-GB")}</span>
                        <Calendar size={18} />
                    </div>

                    {/* 🔔 Notification Bell + Popup */}
                    <div className="relative" ref={notifRef}>
                        <button
                            onClick={() => setShowNotifications((prev) => !prev)}
                            className="relative p-2 text-brand-navy hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <Bell size={22} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-gradient-to-r from-[#FD610D] to-[#FF8800] px-1 text-[10px] font-bold text-white border-2 border-white">
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden">
                                {/* Panel header */}
                                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-brand-navy">
                                    <h3 className="text-sm font-bold text-white">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={handleMarkAllRead}
                                            disabled={markingAll}
                                            className="flex items-center gap-1 text-xs font-semibold text-[#FF8800] hover:text-white transition disabled:opacity-50"
                                        >
                                            <CheckCheck size={14} />
                                            Mark all read
                                        </button>
                                    )}
                                </div>

                                {/* Panel body */}
                                <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
                                    {notifLoading && (
                                        <div className="py-8 text-center text-sm text-slate-400">
                                            Loading…
                                        </div>
                                    )}

                                    {!notifLoading && latestNotifications.length === 0 && (
                                        <div className="flex flex-col items-center gap-2 py-8 text-slate-400">
                                            <Inbox size={22} className="text-slate-300" />
                                            <p className="text-sm">No notifications yet</p>
                                        </div>
                                    )}

                                    {!notifLoading && latestNotifications.map((notif) => {
                                        const meta = CATEGORY_META[notif.category] ?? CATEGORY_META.system;
                                        const Icon = meta.icon;
                                        return (
                                            <button
                                                key={notif._id}
                                                onClick={() => handleNotificationClick(notif)}
                                                className={`w-full flex gap-3 px-4 py-3 text-left transition hover:bg-slate-50 ${!notif.isRead ? "bg-orange-50/50" : ""
                                                    }`}
                                            >
                                                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${meta.badge}`}>
                                                    <Icon size={16} />
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="flex items-center gap-2">
                                                        <span className="text-sm font-semibold text-brand-navy truncate">
                                                            {notif.title}
                                                        </span>
                                                        {!notif.isRead && (
                                                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF7A1A]" />
                                                        )}
                                                    </span>
                                                    <span className="block text-xs text-slate-500 mt-0.5 line-clamp-2">
                                                        {notif.body}
                                                    </span>
                                                    <span className="block text-[11px] text-slate-400 mt-1">
                                                        {timeAgo(notif.createdAt)}
                                                    </span>
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Panel footer */}
                                <button
                                    onClick={() => {
                                        setShowNotifications(false);
                                        navigate("/notification");
                                    }}
                                    className="block w-full py-2.5 text-center text-xs font-bold text-brand-navy bg-slate-50 hover:bg-slate-100 transition"
                                >
                                    View all notifications
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <div
                            onClick={() => setShowDropdown(prev => !prev)}
                            className="flex items-center gap-3 border-l pl-4 md:pl-6 border-slate-200 cursor-pointer"
                        >
                            <div className="h-10 w-10 bg-brand-navy text-white flex items-center justify-center rounded-full font-bold shadow-md uppercase">
                                {admin?.email?.charAt(0)}
                            </div>
                            <div className="hidden lg:flex items-center justify-between gap-3">
                                <div>
                                    <h4 className="text-sm font-bold text-brand-navy leading-none">
                                        Admin
                                    </h4>
                                    <p className="text-[11px] text-brand-gray mt-1 tracking-wider">
                                        {admin?.email}
                                    </p>
                                </div>
                                <RiArrowDropDownLine className="text-2xl text-brand-navy" />
                            </div>
                        </div>

                        {/* Dropdown */}
                        {showDropdown && (
                            <div className="absolute right-0 mt-3 w-40 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
                                <button
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className="w-full text-left px-4 py-3 text-sm font-semibold text-red-600 hover:bg-gray-50 rounded-xl transition"
                                >
                                    {isLoggingOut ? "Logging out..." : "Logout"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation Bar */}
            <nav className="bg-[#FD610D]/10 border-t border-brand-teal/10">
                <div className="overflow-x-auto no-scrollbar scroll-smooth">
                    <ul className="flex items-center gap-2 px-3 sm:px-6 py-3 min-w-max">
                        <li className="md:hidden">
                            <button
                                onClick={() => {
                                    if (window.history.length > 1) {
                                        navigate(-1);
                                    } else {
                                        navigate("/dashboard");
                                    }
                                }}
                                className="flex items-center justify-center h-9 w-9 text-2xl rounded-xl bg-white text-brand-navy shadow-sm border border-gray-100 hover:bg-brand-navy hover:text-white transition-all duration-200 active:scale-95"
                            >
                                <IoArrowBackCircleOutline />
                            </button>
                        </li>

                        {navItems.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    className={`
              flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 text-xs whitespace-nowrap
              ${isActiveRoute(item.path)
                                            ? 'bg-brand-navy text-white'
                                            : 'bg-white text-brand-navy hover:bg-slate-50 border border-transparent'
                                        }
            `}
                                >
                                    <>
                                        <span
                                            className={`text-lg ${isActiveRoute(item.path)
                                                ? "text-[#FD610D]"
                                                : "text-current"
                                                }`}
                                        >
                                            {item.icon}
                                        </span>
                                        <span className="hidden sm:inline">
                                            {item.name}
                                        </span>
                                    </>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default Header;