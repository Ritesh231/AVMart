import React from 'react';
import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Users, ShoppingCart, Package,
    FileText, CreditCard, Truck, MessageSquare, Tag, Wallet, Bell, Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from "../Redux/apis/authApi";
import { RiArrowDropDownLine } from "react-icons/ri";

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        const storedAdmin = localStorage.getItem("admin");
        if (storedAdmin) {
            setAdmin(JSON.parse(storedAdmin));
        }
    }, []);

    const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

    const handleLogout = async () => {
        try {
            await logout().unwrap();
            localStorage.removeItem("token");
            localStorage.removeItem("admin");
            navigate("/");

        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const [showDropdown, setShowDropdown] = useState(false);

    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
        { name: 'Users', path: '/users', icon: <Users size={18} /> },
        { name: 'Orders', path: '/orders', icon: <ShoppingCart size={18} /> },
        { name: 'Products', path: '/products', icon: <Package size={18} /> },
        { name: 'Invoices', path: '/invoices', icon: <FileText size={18} /> },
        { name: 'Payments', path: '/payments', icon: <CreditCard size={18} /> },
        { name: 'Delivery Boy', path: '/delivery', icon: <Truck size={18} /> },
        { name: 'Queries', path: '/queries', icon: <MessageSquare size={18} /> },
        { name: 'Offers', path: '/offers', icon: <Tag size={18} /> },
        { name: 'Wallet', path: '/wallet', icon: <Wallet size={18} /> },
    ];

    return (
        <header className="w-full bg-white shadow-sm">
            {/* Top Header Section */}
            <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center">
                    {/* Logo Placeholder - Replace with your <img> */}
                    <div className="flex items-center gap-2 font-black text-2xl text-brand-navy italic">
                        <img src="./images/logo.svg" alt="" />
                    </div>
                </div>

                <div className="flex items-center gap-4 md:gap-6">
                    <div className="hidden md:flex items-center bg-brand-cyan px-4 py-2 rounded-xl text-brand-navy font-bold gap-3">
                        <span>{new Date().toLocaleDateString("en-GB")}</span>
                        <Calendar size={18} />
                    </div>

                    <button className="relative p-2 text-brand-navy hover:bg-slate-100 rounded-full transition-colors">
                        <Bell size={22} />
                        <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-brand-teal rounded-full border-2 border-white"></span>
                    </button>

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
            <nav className="bg-brand-soft border-t border-brand-teal/10">
                <div className="overflow-x-auto no-scrollbar scroll-smooth">
                    <ul className="flex justify-center items-center gap-2 px-6 py-3 min-w-max">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) => `
                    flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 text-xs
                    ${isActive
                                            ? 'bg-brand-navy text-white  '
                                            : 'bg-white text-brand-navy hover:bg-slate-50 border border-transparent'}
                  `}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <span
                                                className={`text-lg transition-colors ${isActive ? "text-[#00E9BE]" : "text-current"
                                                    }`}
                                            >
                                                {item.icon}
                                            </span>
                                            <span>{item.name}</span>
                                        </>
                                    )}
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