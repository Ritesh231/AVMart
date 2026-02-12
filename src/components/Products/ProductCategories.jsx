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
  const categories = data?.data ?? [];

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
    <div className="p-6 bg-[#F8FAFC] rounded-xl border border-teal-200">

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {categories.map((category) => (
          <CategoryCard
            key={category._id}
            category={category}
          />
        ))}
      </div>

    </div>
  );
}

