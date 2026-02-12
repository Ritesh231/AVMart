import React from 'react'
import {useGetallbannersQuery} from "../../Redux/apis/bannerApi";
import { FaTrash } from "react-icons/fa";
import {useDeleteBannerMutation} from "../../Redux/apis/bannerApi";

export default function MainBanner() {
  /********************API*****************************/
    const {data,isLoading,isError,refetch}=useGetallbannersQuery();
    const banners=data?.data||[];
    const [deleteBanner,{isLoading:deleting}]=useDeleteBannerMutation();

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
    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
         {banners.map((banner) => (
       <div
  key={banner._id}
  className="relative rounded-lg overflow-hidden group"
>
  {/* Banner image */}
  <img
    src={banner.image}
    alt={banner.title}
    className="w-full h-40 object-contain"
  />

  {/* Bottom overlay */}
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
)
}