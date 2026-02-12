import React from "react";
import { ArrowDown, BadgeIndianRupee, Blocks, ChartColumnIncreasing, ChevronDown, CircleDashed, CreditCard, Download, FileText, HandCoins, Search, SlidersHorizontal, Upload, Wallet, WalletMinimal } from 'lucide-react'
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import ProductCategoryCards from "../Products/ProductCategorytabs"
import { useGetallproductsQuery, useDeleteProductMutation } from "../../Redux/apis/productsApi"
import EditProductModal from "../../components/Products/UpdateProductModel";
import { useState } from "react";

const products = Array.from({ length: 20 });

const ProductGrid = () => {
    const { data, isLoading, isError } = useGetallproductsQuery();
    const products = data?.data || [];

    const [ deleteproduct, { isLoading: isDeleting } ] = useDeleteProductMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this category?"
        );

        if (!confirmDelete) return;
        try {
            await deleteproduct(id).unwrap();
            toast.success("Category Deleted Successfully");
        } catch (err) {
            toast.error("Error to delete Category", err);
        }
    }
    
    const ProductShimmer = () => {
        return (
            <div className="border border-gray-200 rounded-xl p-3 bg-white animate-pulse">
                {/* Image */}
                <div className="h-24 bg-gray-200 rounded-lg mb-3" />

                {/* Title */}
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />

                {/* Price */}
                <div className="h-3 bg-gray-200 rounded w-1/3" />
            </div>
        );
    };

    if (isError) {
        return <p>No products available</p>;
    }

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, index) => (
                    <ProductShimmer key={index} />
                ))}
            </div>
        )
    }
     
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

                {products.map((product) => (
                    <div
                        key={product._i}
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
                                src={product.displayImage}
                                alt="product"
                                className="h-24 object-contain"
                            />
                        </div>

                        {/* Info */}
                        <h3 className="text-sm font-semibold text-gray-800 leading-tight">
                            {product.slug}
                        </h3>

                        <div className="flex gap-2 mt-1">
                            <p className="text-sm text-gray-500  font-semibold ">{product.price}</p>
                            <p className="text-sm text-gray-500 ">{product.originalPrice}</p>
                        </div>

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
                            <button
                                className="flex-1 flex items-center justify-center gap-1 p-1.5 rounded-md bg-indigo-50 text-indigo-600 text-xs font-medium"
                                onClick={() => {
                                    setSelectedProduct(product);
                                    setIsModalOpen(true);
                                }}
                            >
                                <FaEdit size={12} />
                                Edit
                            </button>

                            {/* Delete – small */}
                            <button className="flex items-center justify-center p-1.5 rounded-md bg-red-50 text-red-600"
                                onClick={() => handleDelete(product._i)}>
                                <FaTrash size={12} />
                            </button>
                        </div>

                    </div>
                ))}

            </div>
            <EditProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                productData={selectedProduct}
            />

        </div>
    );
};

export default ProductGrid;
