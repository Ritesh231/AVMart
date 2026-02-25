import React from 'react'
import {useGetallbannersQuery} from "../../Redux/apis/bannerApi";
import { FaTrash } from "react-icons/fa";
import {useDeleteBannerMutation} from "../../Redux/apis/bannerApi";
import { useState } from "react";
import { toast } from "react-toastify";
import OrderPaymentTabs from "../Offers/OfferTabs";

export default function MainBanner() {
  /********************API*****************************/
  const [activeTab, setActiveTab] = useState("main");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading, isError, refetch } = useGetallbannersQuery();
  const banners = data?.data || [];
   
  const [deleteBanner, { isLoading: deleting }] = useDeleteBannerMutation();

    const handleDelete=async(id)=>{
      if(!window.confirm("Delete this Banner"))return;
      try{
        await deleteBanner(id).unwrap();
        toast.success("Banner deleted successfully");
        refetch();
      }catch(err){
        toast.error("Failed to delete banner")
      }
    }
    
  const filteredBanners = banners
  .filter((banner) => banner.bannerType === activeTab);
      
    if(isLoading){
        return(
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
               {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-40 bg-gray-200 animate-pulse rounded-lg"
          />
        ))}
            </div>
        )
    }
      if (isError) {
    return null;
  }

return (
  <>
  <OrderPaymentTabs
  activeTab={activeTab}
  setActiveTab={setActiveTab}
/>

    {/* Status Filter */}
    <div className="flex gap-3 mb-6">
      {["all", "active", "inactive"].map((status) => (
        <button
          key={status}
          onClick={() => setStatusFilter(status)}
          className={`px-3 py-1 rounded-md text-xs capitalize transition
            ${
              statusFilter === status
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
        >
          {status}
        </button>
      ))}
    </div>

    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
      {filteredBanners.map((banner) => (
        <div
          key={banner._id}
          className="relative rounded-lg overflow-hidden group"
        >
          <img
            src={banner.image}
            alt={banner.title}
            className="w-full h-40 object-contain"
          />

          <div className="absolute bottom-0 left-0 w-full flex justify-center pb-2">
            <button
              onClick={() => handleDelete(banner._id)}
              className="bg-white/90 p-2 rounded-full text-red-600 shadow-md
                         hover:bg-red-600 hover:text-white transition"
            >
              <FaTrash size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  </>
);
}