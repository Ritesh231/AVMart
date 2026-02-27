import React,{useEffect}from "react";
import { ChevronDown, Download, Search, SlidersHorizontal } from 'lucide-react'
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import ProductCategoryCards from "../Products/ProductCategorytabs"
import { useGetallproductsQuery, useDeleteProductMutation } from "../../Redux/apis/productsApi"
import EditProductModal from "../../components/Products/UpdateProductModel";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const products = Array.from({ length: 20 });

const ProductGrid = () => {
    const { data, isLoading, isError } = useGetallproductsQuery();
    const products = data?.data || [];
    const [selectedCategory, setSelectedCategory] = useState("All");
       const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState("")
    const uniqueCategories = [
  "All",
  ...new Set(products.map((item) => item.category?.name).filter(Boolean)),
];
    
         const [currentPage, setCurrentPage] = useState(1);
        const ordersPerPage = 10;

         const filteredProducts = products.filter((u) => {
  const search = searchTerm.toLowerCase();

  const matchesSearch =
    u.slug?.toLowerCase().includes(search) ||
    u.price?.toString().includes(search) ||
    u.productName?.toLowerCase().includes(search);

  const matchesCategory =
    selectedCategory === "All" || u.category?.name === selectedCategory;

  return matchesSearch && matchesCategory;
});
      
        // Pagination Logic
    const totalPages = Math.ceil(filteredProducts.length / ordersPerPage);
      
      const indexOfLastOrder = currentPage * ordersPerPage;
      const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
      
    const currentOrders = filteredProducts.slice(
        indexOfFirstOrder,
        indexOfLastOrder
      );
      
      // Reset to page 1 when orders change
      useEffect(() => {
  setCurrentPage(1);
}, [filteredProducts.length]);
    const navigate = useNavigate();

    const [deleteproduct, { isLoading: isDeleting }] = useDeleteProductMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
 

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );
        if (!confirmDelete) return;
        try {
            await deleteproduct(id).unwrap();
            toast.success("Product Deleted Successfully");
        } catch (err) {
            toast.error("Error to delete Product", err);
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
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Export Button */}
                <div className='flex justify-evenly gap-2 items-center'>
                    <button className='bg-brand-cyan  font-semibold text-brand-navy px-3 py-3 rounded-xl flex justify-center gap-2 items-center'>
                        <SlidersHorizontal size={20} />
                    </button>
                 <div className="relative">
  <select
    value={selectedCategory}
    onChange={(e) => {
      setSelectedCategory(e.target.value);
      setCurrentPage(1);
    }}
    className="appearance-none border-brand-cyan border-[1px] font-semibold text-brand-navy px-4 py-3 pr-10 rounded-2xl focus:outline-none bg-white cursor-pointer"
  >
    {uniqueCategories.map((cat, index) => (
      <option key={index} value={cat}>
        {cat}
      </option>
    ))}
  </select>

  <ChevronDown
    size={18}
    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-brand-navy"
  />
</div>
                    <button className='bg-brand-navy px-6 py-3 rounded-2xl flex justify-center gap-2 items-center text-white font-bold hover:bg-opacity-90 transition-all'>
                        <Download size={20} /> Export
                    </button>
                </div>
            </div>

            {/* 🔹 Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">

                {currentOrders.map((product) => {
                    const firstVariant = product.variants?.[0];

                    return (
                        <div
                            key={product._id}
                            className="relative border border-emerald-200 rounded-xl p-3 hover:shadow-md transition"
                        >
                            {/* Status Dot */}
                            <span
                                onClick={() => navigate("/AddProduct")}
                                className="absolute top-2 right-2 h-6 w-6 bg-green-500 rounded-full 
                   flex items-center justify-center 
                   cursor-pointer hover:bg-green-600 transition"
                            >
                                <Plus size={14} className="text-white" />
                            </span>

                            {/* Image */}
                            <div className="flex justify-center mb-3 bg-[#62CDB929]">
                                <img
                                    src={product.primaryImages?.[0]}
                                    alt={product.productName}
                                    className="h-24 object-contain"
                                />
                            </div>

                            {/* Product Name */}
                            <h3 className="text-sm font-semibold text-gray-800 leading-tight">
                                {product.productName}
                            </h3>

                            {/* Price */}
                            <div className="flex gap-2 mt-1">
                                <p className="text-sm font-semibold text-gray-800">
                                    ₹{firstVariant?.price || firstVariant?.originalPrice}
                                </p>

                                {firstVariant?.discountValue && (
                                    <p className="text-sm text-gray-400 line-through">
                                        ₹{firstVariant?.originalPrice}
                                    </p>
                                )}
                            </div>

                            {/* Stock */}
                            <div className="flex items-center justify-between mt-1">
                                <p className="text-xs text-gray-600">
                                    In Stock :
                                    <span className="ml-1 text-green-600 font-semibold">
                                        {firstVariant?.stock || 0}
                                    </span>
                                </p>

                                <p className="text-xs bg-slate-900 text-white px-2 py-0.5 rounded-md">
                                    Qty :
                                    <span className="ml-1 font-semibold">
                                        {firstVariant?.quantityValue}
                                    </span>
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center gap-2 mt-3">
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

                                <button
                                    className="flex items-center justify-center p-1.5 rounded-md bg-red-50 text-red-600"
                                    onClick={() => handleDelete(product._id)}
                                >
                                    <FaTrash size={12} />
                                </button>
                            </div>
                        </div>
                    );
                })}

            </div>
            <EditProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                productData={selectedProduct}
            />


    {/* Pagination */}
{ filteredProducts.length > ordersPerPage && (
  <div className="flex justify-between items-center mt-6 px-4 py-4 bg-white border-t">

    {/* Showing Info */}
    <p className="text-sm text-gray-600">
      Showing {indexOfFirstOrder + 1} to{" "}
      {Math.min(indexOfLastOrder,   filteredProducts.length)} of{" "}
      {  filteredProducts.length} orders
    </p>

    {/* Buttons */}
    <div className="flex items-center gap-2">

      {/* Prev */}
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all
          ${currentPage === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-[#1E264F] text-white hover:bg-opacity-90"
          }`}
      >
        Prev
      </button>

      {/* Page Numbers */}
      {[...Array(totalPages)].map((_, index) => {
        const page = index + 1;
        return (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all
              ${currentPage === page
                ? "bg-[#00E5B0] text-white shadow-md"
                : "bg-gray-100 text-[#1E264F] hover:bg-gray-200"
              }`}
          >
            {page}
          </button>
        );
      })}

      {/* Next */}
      <button
        onClick={() =>
          setCurrentPage((prev) => Math.min(prev + 1, totalPages))
        }
        disabled={currentPage === totalPages}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all
          ${currentPage === totalPages
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
};

export default ProductGrid;
