import React, { useState } from "react";
import { FiSearch, FiDownload, FiEdit, FiTrash2 } from "react-icons/fi";
import { useGetallBrandsQuery,useDeleteBrandMutation } from "../../Redux/apis/productsApi";
import toast from "react-hot-toast";
import EditBrandModal from "./EditBrandModal";

export default function BrandsSection() {
  const { data, isLoading, isError } = useGetallBrandsQuery();
  const brands = data?.data || [];

const [deleteBrand, { isLoading: isDeleting }] = useDeleteBrandMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [searchTerm,setSearchTerm]=useState("");
   
  const openEditModal = (brand) => {
    setSelectedBrand(brand);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setSelectedBrand(null);
  };

     const filteredBrands=brands.filter((u)=>{
        const search=searchTerm.toLowerCase();
        return(
          u.name?.toLowerCase().includes(search)
        )
    })
  
const ShimmerCard = () => (
  <div className="w-40 h-36 bg-gray-200 animate-pulse rounded-xl p-4 flex flex-col items-center gap-3">
    <div className="w-20 h-6 bg-gray-300 rounded"></div>
    <div className="flex gap-2 mt-4">
      <div className="w-8 h-8 bg-gray-300 rounded-md"></div>
      <div className="w-8 h-8 bg-gray-300 rounded-md"></div>
    </div>
  </div>
);
  
  if (isError) return <p>Error loading brands</p>;
  
     const handleDelete=async(id)=>{
       const confirmDelete = window.confirm(
      "Are you sure you want to delete this Brand?"
    );
    
    if (!confirmDelete) return;
      try{
        await deleteBrand(id).unwrap();
        toast.success("Category Deleted Successfully");
      }catch(err){
        toast.error("Error to delete Category",err);
      }
    }
    
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
          
        <button className="flex items-center gap-2 bg-[#1A2550] text-white px-4 py-2 rounded-lg text-sm font-medium">
          <FiDownload size={14} />
          Export
        </button>

      </div>

      {/* Brand Cards */}
   <div className="grid md:grid-cols-6 grid-cols-2 gap-5">
   
  {isLoading
    ? Array(12)
        .fill(0)
        .map((_, index) => <ShimmerCard key={index} />)
    : filteredBrands.map((brand) => (
        <div
          key={brand._id}
          className="w-40 h-36 bg-[#ECFDFB] rounded-xl p-4 flex flex-col items-center gap-3 border border-teal-100"
        >
          <div className="text-center">
            <h2 className="text-2xl font-black tracking-wide">
              {brand.name}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openEditModal(brand)}
              className="p-2 rounded-md bg-indigo-50 text-indigo-600"
            >
              <FiEdit size={14} />
            </button>

            <button
              className="p-2 rounded-md bg-red-50 text-red-600"
              onClick={() => handleDelete(brand._id)}
              disabled={isDeleting}
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        </div>
      ))}
</div>
    
      {/* Separate Modal Component */}
      <EditBrandModal
        isOpen={isModalOpen}
        onClose={closeEditModal}
        brandData={selectedBrand}
      />
    </div>
  );
}
