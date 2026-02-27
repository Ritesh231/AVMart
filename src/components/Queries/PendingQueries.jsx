import { FaSearch, FaTrash, FaEye, FaCheck, FaTimes } from "react-icons/fa";
import { useState,useEffect } from "react";
import { ArrowDown, BadgeIndianRupee, Blocks, ChartColumnIncreasing, ChevronDown, CircleDashed, CreditCard, Download, FileText, HandCoins, Search, SlidersHorizontal, Upload, Wallet, WalletMinimal } from 'lucide-react'
import { useGetallqueriesQuery, useMarkasContactedMutation, useDeleteQueryMutation } from "../../Redux/apis/queryApi";
import { useLocation } from "react-router-dom";

export default function UsersTable() {
    const { data, isLoading, isError } = useGetallqueriesQuery();
    const [markedContacted, { isLoading: isUpdating }] = useMarkasContactedMutation();
    const [markedDeleted, { isLoading: isDeleting }] = useDeleteQueryMutation();
    const [updatingId, setUpdatingId] = useState(null);
    
    const location = useLocation();
    let statusFilter = "Pending";

    if (location.pathname.includes("all")) {
        statusFilter = "All";
    } else if (location.pathname.includes("contacted")) {
        statusFilter = "Contacted";
    }

    const queries = (data?.data || []).filter((q) => {
        if (statusFilter === "All") return true;
        return q.status === statusFilter;
    });

    const handleMarkAsContacted = async (id) => {
        try {
            setUpdatingId(id);
            await markedContacted({ id, status: "Contacted" }).unwrap();
            console.log("Marked as Contacted");
        } catch (error) {
            console.error("Failed to update:", error);
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this query?"
        );
        if (!confirmDelete) return;
        try {
            await markedDeleted(id).unwrap();
            toast.success("Query Deleted Successfully");
        } catch (err) {
            toast.error("Error to delete Query", err);
        }
    }

    const [currentPage, setCurrentPage] = useState(1);
const queriesPerPage = 6;

// Pagination Logic
const totalPages = Math.ceil(queries.length / queriesPerPage);

const indexOfLastQuery = currentPage * queriesPerPage;
const indexOfFirstQuery = indexOfLastQuery - queriesPerPage;

const currentQueries = queries.slice(
  indexOfFirstQuery,
  indexOfLastQuery
);

useEffect(() => {
  setCurrentPage(1);
}, [statusFilter, queries.length]);

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
                            <th className="p-3 text-left">Customer</th>
                            <th className="p-3 text-left">Contact</th>
                            <th className="p-3 text-left">Message</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Date</th>
                            <th className="p-3 text-left">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {isLoading ? (
                            [...Array(5)].map((_, index) => (
                                <tr key={index} className="border-t animate-pulse">
                                    <td className="p-3">
                                        <div className="h-4 w-4 bg-gray-200 rounded"></div>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-gray-200"></div>
                                            <div className="space-y-2">
                                                <div className="h-3 w-24 bg-gray-200 rounded"></div>
                                                <div className="h-3 w-32 bg-gray-200 rounded"></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <div className="h-3 w-20 bg-gray-200 rounded"></div>
                                    </td>
                                    <td className="p-3">
                                        <div className="h-3 w-40 bg-gray-200 rounded"></div>
                                    </td>
                                    <td className="p-3">
                                        <div className="h-6 w-20 bg-gray-200 rounded-xl"></div>
                                    </td>
                                    <td className="p-3">
                                        <div className="h-3 w-24 bg-gray-200 rounded"></div>
                                    </td>
                                    <td className="p-3">
                                        <div className="h-8 w-32 bg-gray-200 rounded-lg"></div>
                                    </td>
                                </tr>
                            ))
                        ) : isError ? (
                            // Real Error
                            <tr>
                                <td colSpan="7" className="text-center p-6 text-red-500">
                                    Failed to load queries.
                                </td>
                            </tr>
                        ) : currentQueries.length === 0 ? (
                            // No Data Found
                            <tr>
                                <td colSpan="7" className="text-center p-6 text-red-500">
                                    {statusFilter === "All"
                                        ? "No Queries Found"
                                        : `No ${statusFilter} Queries Found`}
                                </td>
                            </tr>
                        ) : (
                           currentQueries.map((u) => (
                                <tr key={u._id} className="border-t hover:bg-gray-50">
                                    <td className="p-3">
                                        <input type="checkbox" />
                                    </td>

                                    <td className="p-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-blue-900 text-white flex items-center justify-center font-semibold text-sm">
                                                {u.name?.charAt(0)}
                                            </div>
                                            <div className="leading-tight">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {u.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {u.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="p-3 font-medium">{u.contactNo}</td>
                                    <td className="p-3 w-48 break-words">{u.message}</td>

                                    <td className="p-3">
                                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl
            bg-[#FFDD00]/10 border border-[#FFDD00] text-[#FFDD00] text-sm font-semibold">
                                            {u.status}
                                        </span>
                                    </td>

                                    <td className="p-3">
                                        {u.updatedAt?.split("T")[0] || "-"}
                                    </td>

                                    <td className="p-3 whitespace-nowrap">
                                        <div className="flex items-center gap-1">
                                            {u.status === "Pending" && (
                                                <button
                                                    onClick={() => handleMarkAsContacted(u._id)}
                                                    disabled={updatingId === u._id}
                                                    className="bg-[#1A2550] text-white p-2 rounded-lg disabled:opacity-50"
                                                >
                                                    {updatingId === u._id ? "Updating..." : "Mark as Contacted"}
                                                </button>
                                            )}

                                            <button
                                                className="p-1 text-red-600 bg-white"
                                                title="Reject"
                                                onClick={() => handleDelete(u._id)}
                                            >
                                                <FaTrash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
{queries.length > queriesPerPage && (
  <div className="flex justify-between items-center mt-6 px-4 py-4 border-t bg-white">

    {/* Showing Info */}
    <p className="text-sm text-gray-600">
      Showing{" "}
      {queries.length === 0 ? 0 : indexOfFirstQuery + 1} to{" "}
      {Math.min(indexOfLastQuery, queries.length)} of{" "}
      {queries.length} queries
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
            : "bg-[#1A2550] text-white hover:bg-opacity-90"
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
                : "bg-gray-100 text-[#1A2550] hover:bg-gray-200"
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
            : "bg-[#1A2550] text-white hover:bg-opacity-90"
          }`}
      >
        Next
      </button>

    </div>
  </div>
)}
            </div>
        </>
    );
}
