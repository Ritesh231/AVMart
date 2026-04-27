import React, { useState } from "react";
import { ArrowDown, BadgeIndianRupee, Blocks, ChartColumnIncreasing, ChevronDown, CircleDashed, CreditCard, Download, FileText, HandCoins, Search, SlidersHorizontal, Upload, Wallet, WalletMinimal } from 'lucide-react'
import { FiSearch, FiDownload } from "react-icons/fi";
import { BiCategory } from "react-icons/bi";
import { MdSubdirectoryArrowRight } from "react-icons/md";
import { AiOutlineProduct } from "react-icons/ai";
import { BsStar } from "react-icons/bs";
import CategoryCard from "./CategoryCards";
import { useGetallcategoriesQuery } from "../../Redux/apis/productsApi";

const tabs = [
  { name: "Categories", icon: <BiCategory /> },
  { name: "Sub Categories", icon: <MdSubdirectoryArrowRight /> },
  { name: "Products", icon: <AiOutlineProduct /> },
  { name: "Brands", icon: <BsStar /> },
];

export default function ProductCategories() {

  const { data, isLoading, isError } = useGetallcategoriesQuery();
  const [page, setPage] = useState(1);
  const limit = 10;

  const categories = data?.data ?? [];

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedCategories = categories.slice(startIndex, endIndex);

  const totalPages = Math.ceil(categories.length / limit);

  const CategoryShimmer = () => (
    <div className="p-4 rounded-xl border bg-white animate-pulse">
      <div className="flex gap-4">
        <div className="w-10 h-10 bg-gray-200 rounded" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <CategoryShimmer key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <p className="text-red-500">Failed to load categories</p>;
  }

  return (
    <div className="p-6 bg-[#F8FAFC] rounded-xl border border-[#0F172A]/20 ">

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {paginatedCategories.map((category) => (
          <CategoryCard
            key={category._id}
            category={category}
          />
        ))}
      </div>
      {categories.length > limit && (
        <div className="flex justify-between items-center mt-6 px-4 py-4 bg-white border-t rounded-xl">

          {/* Showing Info */}
          <p className="text-sm text-gray-600 hidden md:block">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, categories.length)} of{" "}
            {categories.length} categories
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-2">

            {/* Prev */}
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all
        ${page === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#1E264F] text-white hover:bg-opacity-90"
                }`}
            >
              Prev
            </button>

            {/* Page Numbers */}
            {[...Array(totalPages)].map((_, index) => {
              const p = index + 1;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all
            ${page === p
                      ? "bg-gradient-to-r from-[#FD610D] to-[#FF8800] text-white shadow-md"
                      : "bg-gray-100 text-[#1E264F] hover:bg-gray-200"
                    }`}
                >
                  {p}
                </button>
              );
            })}

            {/* Next */}
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all
        ${page === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#1E264F] text-white hover:bg-opacity-90"
                }`}
            >
              Next
            </button>

          </div>
        </div>
      )}
    </div>
  );
}

