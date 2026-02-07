import React from "react";
import { ArrowDown, BadgeIndianRupee, Blocks, ChartColumnIncreasing, ChevronDown, CircleDashed, CreditCard, Download, FileText, HandCoins, Search, SlidersHorizontal, Upload, Wallet, WalletMinimal } from 'lucide-react'
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import ProductCategoryCards from "../Products/ProductCategorytabs"

const products = Array.from({ length: 20 });

const ProductGrid = () => {
    return (
        <div className="p-6 bg-white rounded-xl border border-emerald-200">
                {/* Search */}
               <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                    {/* Search Bar */}
                    <div className="w-full lg:w-[40%] md:w-[50%]">
                        <div className='flex items-center gap-2 bg-white border-2 border-brand-soft rounded-2xl p-3 focus-within:border-brand-teal transition-all'>
                            <Search className="text-brand-gray" size={20} />
                            <input
                                className='w-full bg-transparent border-none focus:ring-0 focus:outline-none text-brand-navy placeholder:text-brand-gray'
                                type="text"
                                placeholder='Search By User Name and Phone no'
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

            {/* 🔹 Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">

                {products.map((_, i) => (
                    <div
                        key={i}
                        className="relative border border-emerald-200 rounded-xl p-3 hover:shadow-md transition"
                    >
                        {/* Active Dot */}
                        <span className="
  absolute top-2 right-2
  h-5 w-5
  bg-green-500
  rounded-full
  flex items-center justify-center
  text-white
  text-xs
  font-bold
">
                            +
                        </span>


                        {/* Image */}
                        <div className="flex justify-center mb-3 bg-[#62CDB929]">
                            <img
                                src="data:image/jpeg;base64,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"
                                alt="product"
                                className="h-24 object-contain"
                            />
                        </div>

                        {/* Info */}
                        <h3 className="text-sm font-semibold text-gray-800 leading-tight">
                            Fogg Unisex Body Spray
                        </h3>

                        <p className="text-xs text-gray-500 mt-1">₹400</p>

                        <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-gray-600">
                                In Stock :
                                <span className="ml-1 text-green-600 font-semibold">100</span>
                            </p>

                            <p className="text-xs bg-slate-900 text-white px-2 py-0.5 rounded-md">
                                Qty :
                                <span className="ml-1 font-semibold">100</span>
                            </p>
                        </div>


                        {/* Buttons */}
                        <div className="flex items-center gap-2 mt-3">
                            {/* Edit – takes more space */}
                            <button className="flex-1 flex items-center justify-center gap-1 p-1.5 rounded-md bg-indigo-50 text-indigo-600 text-xs font-medium">
                                <FaEdit size={12} />
                                Edit
                            </button>

                            {/* Delete – small */}
                            <button className="flex items-center justify-center p-1.5 rounded-md bg-red-50 text-red-600">
                                <FaTrash size={12} />
                            </button>
                        </div>

                    </div>
                ))}

            </div>
        </div>
    );
};

export default ProductGrid;
