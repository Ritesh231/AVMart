import React, { useState } from "react";
import { ArrowDown, BadgeIndianRupee, Blocks, ChartColumnIncreasing, ChevronDown, CircleDashed, CreditCard, Download, FileText, HandCoins, Search, SlidersHorizontal, Upload, Wallet, WalletMinimal } from 'lucide-react'
import { FaSearch, FaTrash, FaEye } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";
import { SiTicktick } from "react-icons/si";
import { useGetallusersQuery, useUpdateStatusMutation,useDeleteUserMutation  } from "../Redux/apis/userApi"
import { toast } from "react-toastify";

const tabs = [
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' }
];


export default function UsersTable() {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, isError } = useGetallusersQuery();
  const users = data?.data || [];

  const filteredUsers = users.filter((user) => {
    const matchesStatus = user.status === activeTab;

    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.contact?.includes(searchTerm) ||
      user.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const [updateStatus, { isLoading: isUpdating }] = useUpdateStatusMutation();
  const [deleteStatus, { isLoading: isDeleting }]=useDeleteUserMutation ();
   
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      toast.success("status updated successfully");
    } catch (error) {
      toast.error("Failed to Update", error);
    }
  }
  
  const handleDelete=async(id)=>{
     const confirmDelete = window.confirm("Are you sure you want to delete this user?");
     if (!confirmDelete) return;
    try{
      
      await deleteStatus(id).unwrap();
      toast.success("user deleted successfully");
    }catch (error){
      toast.error("Failed to delete User",error);
    }
  }

  if (isError) {
    return <p>No User Found</p>;
  }

  return (
    <>
      {/* Tabs */}
      <section className="flex flex-col sm:flex-row bg-[#1E264F] p-2 my-6 rounded-xl  md:w-fit w-full shadow-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-lg flex items-center justify-center sm:justify-start
        gap-3 font-semibold transition-all duration-300
        ${activeTab === tab.id
                ? "bg-[#00E5B0] text-white shadow-sm"
                : "bg-white text-[#1E264F] hover:bg-opacity-90"
              }
        sm:ml-2 mb-2 sm:mb-0 w-full sm:w-auto
      `}
          >
            <span className={activeTab === tab.id ? "text-white" : "text-[#1E264F]"}>
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </section>

      {/* Search & Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        {/* Search Bar */}
        <div className="w-full lg:w-[40%] md:w-[50%]">
          <div className='flex items-center gap-2 bg-white border-2 border-brand-soft rounded-2xl p-3 focus-within:border-brand-teal transition-all'>
            <Search className="text-brand-gray" size={20} />
            <input
              className='w-full bg-transparent border-none focus:ring-0 focus:outline-none text-brand-navy placeholder:text-brand-gray'
              onChange={(e) => setSearchTerm(e.target.value)}
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
     
      {/* Table */}
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="min-w-[900px] w-full text-sm">
          <thead className="bg-[#F1F5F9] text-gray-600">
            <tr>
              <th className="p-3"></th>
              <th className="p-3 text-left">Shop Name</th>
              <th className="p-3 text-left">Owner Name</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Contact</th>
              <th className="p-3 text-left">Shop Type</th>
              <th className="p-3 text-left">Joined</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          
          <tbody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-t">
                  <td className="p-3">
                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                  </td>

                  <td className="p-3">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  </td>

                  <td className="p-3">
                    <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                  </td>

                  <td className="p-3">
                    <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                  </td>

                  <td className="p-3 space-y-1">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
                  </td>

                  <td className="p-3">
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                  </td>

                  <td className="p-3">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  </td>
                   
                  <td className="p-3">
                    <div className="flex gap-3">
                      <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
                      <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              filteredUsers.map((u) => (
                <tr key={u._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <input type="checkbox" />
                  </td>


                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {u.shopPhoto ? (
                        <img
                          src={u.shopPhoto}
                          alt={u.shopName}
                          className="w-10 h-10 rounded-md object-cover border"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                          N/A
                        </div>
                      )}

                      <span className="font-medium">{u.shopName}</span>
                    </div>
                  </td>
                   
                  <td className="p-3">{u.name || "-"}</td>
                  <td className="p-3">{u.shopAddress}</td>

                  <td className="p-3">
                    <div>{u.contact}</div>
                    <div className="text-xs text-gray-400">{u.email}</div>
                  </td>

                  <td className="p-3">
                    <div className="text-sm text-black">{u.shopType}</div>
                  </td>

                  <td className="p-3">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-3">
                    {u.status === "pending" && (
                      <div className="flex gap-3 text-lg">
                        <SiTicktick
                          size={20}
                          className="text-green-600 cursor-pointer"
                          onClick={() => handleStatusChange(u._id, "accepted")}
                        />
                        <RxCrossCircled
                          size={20}
                          className="text-red-500 cursor-pointer"
                          onClick={() => handleStatusChange(u._id, "rejected")}
                        />
                      </div>
                    )}

                    {u.status === "approved" && (
                      <div className="flex items-center gap-3">
                        <span className="text-green-700 text-xs bg-green-100 px-3 py-1 rounded-full">
                          Approved
                        </span>
                        <FaEye className="text-blue-900 cursor-pointer" />
                        <FaTrash className="text-red-600 cursor-pointer" onClick={()=>handleDelete(u._id)} />
                      </div>
                    )}

                    {u.status === "rejected" && (
                      <div className="flex items-center gap-3">
                        <span className="text-red-700 text-xs bg-red-100 px-3 py-1 rounded-full">
                          Rejected
                        </span>
                        <FaEye className="text-blue-900 cursor-pointer" />
                        <FaTrash className="text-red-600 cursor-pointer" onClick={()=>handleDelete(u._id)} />
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div >
    </>
  );
}
