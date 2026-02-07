import React, { useState } from "react";
import { ArrowDown, BadgeIndianRupee, Blocks, ChartColumnIncreasing, ChevronDown, CircleDashed, CreditCard, Download, FileText, HandCoins, Search, SlidersHorizontal, Upload, Wallet, WalletMinimal } from 'lucide-react'
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

      {/* 🔹 SEARCH + EXPORT */}
         <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                    {/* Search Bar */}
                    <div className="w-full lg:w-[40%] md:w-[50%]">
                        <div className='flex items-center gap-2 bg-white border-2 border-brand-soft rounded-2xl p-3 focus-within:border-brand-teal transition-all'>
                            <Search className="text-brand-gray" size={20} />
                            <input
                                className='w-full bg-transparent border-none focus:ring-0 focus:outline-none text-brand-navy placeholder:text-brand-gray'
                                type="text"
                                placeholder='Search By Orders'
                            />
                        </div>
                    </div>

                    {/* Export Button */}
                    <div className='flex justify-evenly gap-2 items-center'>
                        <button className='bg-brand-cyan  font-semibold text-brand-navy px-3 py-3 rounded-xl flex justify-center gap-2 items-center'>
                            <SlidersHorizontal size={20} />
                        </button>
                        <button className='border-brand-cyan border-[1px] font-semibold text-brand-navy px-3 py-3 rounded-2xl flex justify-center gap-2 items-center'>
                            <p>Today’s</p> <ChevronDown size={20} />
                        </button>
                        <button className='bg-brand-navy px-6 py-3 rounded-2xl flex justify-center gap-2 items-center text-white font-bold hover:bg-opacity-90 transition-all'>
                            <Download size={20} /> Export
                        </button>
                    </div>
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
