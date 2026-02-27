import React from "react";
import { useGetallbannersQuery, useDeleteBannerMutation } from "../../Redux/apis/bannerApi";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useOutletContext } from "react-router-dom";

export default function MainBanner() {

  // ✅ Get activeTab from parent (Offers)
  const { activeTab } = useOutletContext();

  

  /******************** API *****************************/
  const { data, isLoading, isError, refetch } = useGetallbannersQuery();
  const [deleteBanner] = useDeleteBannerMutation();

  const banners = data?.data || [];

  // ✅ Filter based on activeTab from parent
  const filteredBanners = banners.filter(
    (banner) => banner.bannerType === activeTab
  );

  console.log(banners);
  
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this Banner?")) return;

    try {
      await deleteBanner(id).unwrap();
      toast.success("Banner deleted successfully");
      refetch();
    } catch (err) {
      toast.error("Failed to delete banner");
    }
  };

  /******************** Loading UI *****************************/
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-40 bg-gray-200 animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">
        Failed to load banners
      </div>
    );
  }

  /******************** UI *****************************/
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {filteredBanners.length > 0 ? (
        filteredBanners.map((banner) => (
          <div
            key={banner._id}
            className="relative rounded-lg overflow-hidden group border bg-white"
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
        ))
      ) : (
        <div className="col-span-full text-center text-gray-500">
          No banners found for this category.
        </div>
      )}
    </div>
  );
}