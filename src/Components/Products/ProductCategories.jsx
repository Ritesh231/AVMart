import React, { useState } from "react";
import { FiSearch, FiDownload } from "react-icons/fi";
import { BiCategory } from "react-icons/bi";
import { MdSubdirectoryArrowRight } from "react-icons/md";
import { AiOutlineProduct } from "react-icons/ai";
import { BsStar } from "react-icons/bs";
import CategoryCard from "./CategoryCards";

const tabs = [
  { name: "Categories", icon: <BiCategory /> },
  { name: "Sub Categories", icon: <MdSubdirectoryArrowRight /> },
  { name: "Products", icon: <AiOutlineProduct /> },
  { name: "Brands", icon: <BsStar /> },
];

const data = Array.from({ length: 8 });

export default function ProductCategories() {
  const [activeTab, setActiveTab] = useState("Categories");

  return (
    <div className="p-6 bg-[#F8FAFC] rounded-xl border border-teal-200">

      {/* 🔹 TOP TABS */}
      <div className="inline-flex bg-[#1E2A5A] rounded-xl p-1 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
              ${
                activeTab === tab.name
                  ? "bg-[#2EE6C5] text-[#0F172A]"
                  : "text-white hover:bg-white/10"
              }`}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </div>

      {/* 🔹 SEARCH + EXPORT */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-full max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search By Category Name Or ID"
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
          />
        </div>

        <button className="flex items-center gap-2 bg-[#1E2A5A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#16204A]">
          <FiDownload />
          Export
        </button>
      </div>

      {/* 🔹 CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2  gap-5">
        {data.map((_, index) => (
          <CategoryCard key={index} />
        ))}
      </div>
    </div>
  );
}
