import { FaSearch, FaTrash, FaEye, FaEdit } from "react-icons/fa";
import { ArrowDown, BadgeIndianRupee, Blocks, ChartColumnIncreasing, ChevronDown, CircleDashed, CreditCard, Download, FileText, HandCoins, Search, SlidersHorizontal, Upload, Wallet, WalletMinimal } from 'lucide-react'
import { IoFilter } from "react-icons/io5";
import { BsWallet2 } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { useGetallSubcategoriesQuery,useDeleteSubcategoryMutation } from "../../Redux/apis/productsApi"
import EditSubcategoryModal from "../../components/Products/EditSubcategoryModal";
import { useState } from "react";

const users = Array.from({ length: 6 }).map((_, i) => ({
  id: "#12345",
  name: "Face Care",
  price: "450",
  placed: "20/12/2025",
  items: [
    "/images/item1.png",
  ],
  categoryname: "Online",
  products: "145",
  action: "Send to Delivery",
}));

export default function UsersTable() {  
  const { data, isLoading, isError } = useGetallSubcategoriesQuery();
  const [deleteSubcategory,{ isLoading: isDeleting } ]=useDeleteSubcategoryMutation();
  const subcategory = data?.data || [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSubcategories=subcategory.filter((u)=>{
    const search=searchTerm.toLowerCase();
    return(
      u.name?.toLowerCase().includes(search)||
      u.categoryname?.toLowerCase().includes(search)||
      u._id?.toLowerCase().includes(search)||
      u.productCount?.toString().includes(search)
    )
  })

  if (isError) {
    return <p className="text-red-500">Failed to load Subcategories</p>;
  }
  
   const handleDelete=async(id)=>{
       const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );
  
    if (!confirmDelete) return;
      try{
        await deleteSubcategory(id).unwrap();
        toast.success("Category Deleted Successfully");
      }catch(err){
        toast.error("Error to delete Category",err);
      }
    }

  return (
    <>
      {/* Search & Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        {/* Search Bar */}
        <div className="w-full lg:w-[40%] md:w-[50%]">
          <div className='flex items-center gap-2 bg-white border-2 border-brand-soft rounded-2xl p-3 focus-within:border-brand-teal transition-all'>
            <Search className="text-brand-gray" size={20} />
            <input
              className='w-full bg-transparent border-none focus:ring-0 focus:outline-none text-brand-navy placeholder:text-brand-gray'
              type="text"
              placeholder='Search By Subcategory name and Subcategory id'
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
          <button className='border-brand-cyan border-[1px] font-semibold text-brand-navy px-3 py-3 rounded-2xl flex justify-center gap-2 items-center'>
            <p>Today’s</p> <ChevronDown size={20} />
          </button>
          <button className='bg-brand-navy px-6 py-3 rounded-2xl flex justify-center gap-2 items-center text-white font-bold hover:bg-opacity-90 transition-all'>
            <Download size={20} /> Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="min-w-[900px] w-full text-sm">

          <thead className="bg-[#F1F5F9] text-gray-600">
            <tr>
              <th className="p-3"></th>
              <th className="p-3 text-left">Subcategory ID</th>
              <th className="p-3 text-left">Subcategory Name</th>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Category Name</th>
              <th className="p-3 text-left">Products</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-t">
                  <td className="p-3">
                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </td>

                  <td className="p-3">
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </td>

                  <td className="p-3">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </td>

                  <td className="p-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-md animate-pulse"></div>
                  </td>

                  <td className="p-3">
                    <div className="h-6 w-24 bg-gray-200 rounded-xl animate-pulse"></div>
                  </td>

                  <td className="p-6">
                    <div className="h-4 w-10 bg-gray-200 rounded animate-pulse"></div>
                  </td>

                  <td className="p-3">
                    <div className="flex gap-2">
                      <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
            filteredSubcategories.map((u) => (
                <tr key={u._id} className="border-t hover:bg-gray-50 ">
                  <td className="p-3">
                    <input type="checkbox" />
                  </td>

                  <td className="p-3 font-medium">{u._id.slice(-5)}</td>
                  <td className="p-3 font-medium">{u.name}</td>

                  <td className="p-3">
                    <img
                      src={u.image}
                      alt="item"
                      className="w-8 h-8 rounded-md object-cover border"
                    />
                  </td>

                  <td className="p-3">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl
            bg-[#8A9FF324] border border-[#0B97ED] text-[#0B97ED] text-sm font-semibold">
                      {u.categoryName}
                    </span>
                  </td>

                  <td className="p-6">{u.productCount}</td>

                  <td className="p-3 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <button className="p-1 text-blue-600"
                        onClick={() => {
                          setSelectedSubcategory(u);
                          setIsModalOpen(true);
                        }}>
                        <FaEdit size={18} />
                      </button>
                      
                      <button className="p-1 text-red-600" onClick={()=>handleDelete(u._id)}>
                        <MdDelete size={18} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>

        </table>

        <EditSubcategoryModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  subcategoryData={selectedSubcategory}
/>

      </div>
    </>
  );
}
