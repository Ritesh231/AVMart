import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  Plus,
  CreditCard,
  Truck,
  MessageSquare,
  Tag,
  Wallet,
  Bell,
} from "lucide-react";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";


const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={16} /> },
  { name: "Users", path: "/users", icon: <Users size={16} /> },
  { name: "Orders", path: "/orders", icon: <ShoppingCart size={16} /> },
  { name: "Products", path: "/products", icon: <Package size={16} /> },
  { name: "Add Product", path: "/add-product", icon: <Plus size={16} /> },
  { name: "Payments", path: "/payments", icon: <CreditCard size={16} /> },
  { name: "Delivery Boy", path: "/delivery", icon: <Truck size={16} /> },
  { name: "Queries", path: "/queries", icon: <MessageSquare size={16} /> },
  { name: "Offers", path: "/offers", icon: <Tag size={16} /> },
  { name: "Wallet", path: "/wallet", icon: <Wallet size={16} /> },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="w-full bg-white border-b border-slate-200">

      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">

        {/* Logo */}
        <img src="/images/logo.svg" alt="AV Mart" className="h-8" />

        {/* Right Section */}
        <div className="flex items-center gap-3 sm:gap-4">

          {/* Date (hide on mobile) */}
          <div className="hidden sm:flex bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-sm font-semibold">
            12.12.2026
          </div>

          {/* Notification */}
          <button className="relative p-2 rounded-full hover:bg-slate-100">
            <Bell size={20} />
            <span className="absolute top-2 right-2 h-2 w-2 bg-emerald-500 rounded-full"></span>
          </button>

          {/* User */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm">
              MQ
            </div>
            <div>
              <p className="text-sm font-semibold">Admin User</p>
              <p className="text-xs text-slate-500">admin@gmail.com</p>
            </div>
          </div>

          {/* Burger (mobile only) */}
          <button
            className="sm:hidden p-2 rounded-lg hover:bg-slate-100"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden sm:block px-6 py-3">
        <ul className="flex items-center justify-center gap-2 flex-wrap">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
                  ${
                    isActive
                      ? "bg-[#1A2550] text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-[#1A2550] hover:text-white"
                  }`
                }
              >
                <span
                  className={`${
                    location.pathname === item.path
                      ? "text-[#62CDB9]"
                      : "group-hover:text-[#62CDB9]"
                  }`}
                >
                  {item.icon}
                </span>
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="sm:hidden border-t bg-white shadow-md">
          <ul className="flex flex-col gap-2 p-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition
                  ${
                    isActive
                      ? "bg-[#1A2550] text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-[#1A2550] hover:text-white"
                  }`
                }
              >
                <span
                  className={`${
                    location.pathname === item.path
                      ? "text-[#62CDB9]"
                      : "group-hover:text-[#62CDB9]"
                  }`}
                >
                  {item.icon}
                </span>
                {item.name}
              </NavLink>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};


export default Header;
