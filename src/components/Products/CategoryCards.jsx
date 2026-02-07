import React from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function CategoryCard() {
  return (
    <div className="flex items-center h-32 justify-between p-4 rounded-xl border border-teal-200 bg-white hover:shadow-md transition">
      <div className="flex items-center gap-4">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Lipstick_icon.svg/1024px-Lipstick_icon.svg.png"
          alt="category"
          className="w-10 h-10 object-contain"
        />
        <div>
          <h3 className="font-semibold text-gray-800">Cosmetics</h3>
          <p className="text-xs text-gray-500">Subcategories : 10</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-xs text-gray-400">142 Products</span>

        <button className="p-2 rounded-md bg-indigo-50 text-indigo-600">
          <FiEdit size={14} />
        </button>

        <button className="p-2 rounded-md bg-red-50 text-red-600">
          <FiTrash2 size={14} />
        </button>
      </div>
    </div>
  );
}
