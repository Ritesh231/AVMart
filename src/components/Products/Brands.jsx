import React from "react";
import { FiSearch, FiDownload, FiEdit, FiTrash2 } from "react-icons/fi";

const brands = ["Lakme", "Lakme", "Lakme"];

export default function BrandsSection() {
  return (
    <div className="p-6 bg-[#F8FAFC] rounded-xl border border-teal-200">
      
      {/* Search + Export */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-full max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search By Brand Name"
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-teal-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
          />
        </div>

        <button className="flex items-center gap-2 bg-[#1A2550] text-white px-4 py-2 rounded-lg text-sm font-medium">
          <FiDownload size={14} />
          Export
        </button>
      </div>

      {/* Brand Cards */}
      <div className="flex gap-5">
        {brands.map((brand, index) => (
          <div
            key={index}
            className="w-40 h-36 bg-[#ECFDFB] rounded-xl p-4 flex flex-col items-center gap-3 border border-teal-100"
          >
            {/* Brand Logo */}
            <div className="text-center">
              <h2 className="text-2xl font-black tracking-wide">LAKMÉ</h2>
              <p className="text-xs text-gray-500">{brand}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-md bg-indigo-50 text-indigo-600">
                <FiEdit size={14} />
              </button>
              <button className="p-2 rounded-md bg-red-50 text-red-600">
                <FiTrash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
