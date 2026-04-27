import { useState } from "react";
import { useGetWithdrawalRequestsQuery, useVerifyWithdrawalMutation } from "../../Redux/apis/deliveryApi";
import { Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

const SkeletonRow = () => {
    return (
        <tr className="border-t animate-pulse">
            <td className="p-3">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
            </td>

            <td className="p-3">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
            </td>

            <td className="p-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
            </td>

            <td className="p-3">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
            </td>

            <td className="p-3">
                <div className="h-5 bg-gray-200 rounded-full w-20"></div>
            </td>

            <td className="p-3 text-center">
                <div className="flex justify-center gap-2">
                    <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                    <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                </div>
            </td>
        </tr>
    );
};

function WithdrawalTable() {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const { data, isLoading, refetch } = useGetWithdrawalRequestsQuery({
        page: currentPage,
        limit: itemsPerPage
    });
    const [verifyWithdrawal, { isLoading: actionLoading }] = useVerifyWithdrawalMutation();

    const withdrawals = data?.data || [];
    const pagination = data?.pagination || {
        page: currentPage,
        per_page: itemsPerPage,
        total: 0,
        total_pages: 0
    };

    const totalPages = pagination.total_pages;

    const handleAction = async (id, status) => {
        try {
            const res = await verifyWithdrawal({
                requestId: id,
                status,
                adminNote:
                    status === "approved"
                        ? "Approved by admin"
                        : "Rejected by admin",
            }).unwrap();

            console.log("API Response:", res);
            toast.success(res?.message || `Request ${status} successfully`);
            refetch(); // Refresh the data after action

        } catch (error) {
            console.log("Error:", error);
            toast.error(error?.data?.error || "Action failed");
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    if (isLoading) {
        return (
            <div className="p-4">
                <div className="bg-white rounded-xl shadow overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left">User</th>
                                <th className="p-3 text-left">Amount</th>
                                <th className="p-3 text-left">Description</th>
                                <th className="p-3 text-left">Date</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(6)].map((_, i) => (
                                <SkeletonRow key={i} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    // Calculate display range for the current page
    const startItem = (pagination.page - 1) * pagination.per_page + 1;
    const endItem = Math.min(pagination.page * pagination.per_page, pagination.total);

    return (
        <div className="p-4">
            {/* Items per page selector */}
            <div className="mb-4 flex justify-between items-center">
                {/* <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Show:</label>
                    <select
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        className="border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                    <span className="text-sm text-gray-600">entries</span>
                </div> */}

                {/* <div className="text-sm text-gray-600">
                    Showing {startItem} to {endItem} of {pagination.total} entries
                </div> */}
            </div>

            <div className="bg-white rounded-xl shadow overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="p-3 text-left">User</th>
                            <th className="p-3 text-left">Amount</th>
                            <th className="p-3 text-left">Description</th>
                            <th className="p-3 text-left">Date</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {withdrawals.length > 0 ? (
                            withdrawals.map((item) => (
                                <tr key={item._id} className="border-t hover:bg-gray-50">
                                    {/* User */}
                                    <td className="p-3">
                                        {item.deliveryBoyID ? (
                                            <div>
                                                <p className="font-medium">{item.deliveryBoyID.email}</p>
                                                <p className="text-xs text-gray-500">
                                                    {item.deliveryBoyID.contactNo}
                                                </p>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">N/A</span>
                                        )}
                                    </td>

                                    {/* Amount */}
                                    <td className="p-3 font-semibold text-green-600">
                                        ₹{item.amount}
                                    </td>

                                    {/* Description */}
                                    <td className="p-3 max-w-[250px] break-words">
                                        {item.description}
                                    </td>

                                    {/* Date */}
                                    <td className="p-3 text-gray-500">
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </td>

                                    {/* Status */}
                                    <td className="p-3">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full font-semibold
                                                ${item.status === "approved"
                                                    ? "bg-green-100 text-green-600"
                                                    : item.status === "rejected"
                                                        ? "bg-red-100 text-red-600"
                                                        : "bg-yellow-100 text-yellow-600"
                                                }
                                            `}
                                        >
                                            {item.status}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="p-3 text-center">
                                        {item.status === "pending" ? (
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleAction(item._id, "approved")}
                                                    disabled={actionLoading}
                                                    className="bg-green-500 hover:bg-green-600 text-white p-1 w-6 h-6 rounded-full transition-colors"
                                                >
                                                    <Check size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleAction(item._id, "rejected")}
                                                    disabled={actionLoading}
                                                    className="bg-red-500 hover:bg-red-600 text-white p-1 w-6 h-6 rounded-full transition-colors"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 text-xs">No Action</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-gray-500">
                                    No withdrawal requests found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {pagination.total > 0 && (
                <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        Page {pagination.page} of {pagination.total_pages}
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page === 1}
                            className={`px-3 py-1 rounded-md flex items-center gap-1 
                                ${pagination.page === 1
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-[#00E5B0] to-[#00E5B0]  text-white"
                                }`}
                        >
                            <ChevronLeft size={16} />
                            Previous
                        </button>

                        {/* Only show page numbers if total pages is manageable */}
                        {pagination.total_pages <= 7 ? (
                            <div className="flex gap-1">
                                {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((pageNum) => (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`px-3 py-1 rounded-md 
                                            ${pagination.page === pageNum
                                                ? "bg-gradient-to-r from-[#00E5B0] to-[#00E5B0]  text-white"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            // Simplified pagination for many pages
                            <div className="flex gap-1">
                                <button
                                    onClick={() => handlePageChange(1)}
                                    className={`px-3 py-1 rounded-md transition-colors
                                        ${pagination.page === 1
                                            ? "bg-gradient-to-r from-[#00E5B0] to-[#00E5B0]  text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    1
                                </button>
                                {pagination.page > 3 && <span className="px-2 py-1">...</span>}
                                {pagination.page > 2 && (
                                    <button
                                        onClick={() => handlePageChange(pagination.page - 1)}
                                        className="px-3 py-1 rounded-md bg-gradient-to-r from-[#00E5B0] to-[#00E5B0]  text-white"
                                    >
                                        {pagination.page - 1}
                                    </button>
                                )}
                                {pagination.page !== 1 && pagination.page !== pagination.total_pages && (
                                    <button className="px-3 py-1 rounded-mdbg-gradient-to-r from-[#00E5B0] to-[#00E5B0] text-white">
                                        {pagination.page}
                                    </button>
                                )}
                                {pagination.page < pagination.total_pages - 1 && (
                                    <button
                                        onClick={() => handlePageChange(pagination.page + 1)}
                                        className="px-3 py-1 rounded-md bg-gradient-to-r from-[#00E5B0] to-[#00E5B0]  text-white"
                                    >
                                        {pagination.page + 1}
                                    </button>
                                )}
                                {pagination.page < pagination.total_pages - 2 && <span className="px-2 py-1">...</span>}
                                <button
                                    onClick={() => handlePageChange(pagination.total_pages)}
                                    className={`px-3 py-1 rounded-md transition-colors
                                        ${pagination.page === pagination.total_pages
                                            ? "bg-gradient-to-r from-[#00E5B0] to-[#00E5B0]  text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    {pagination.total_pages}
                                </button>
                            </div>
                        )}

                        <button
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={pagination.page === pagination.total_pages}
                            className={`px-3 py-1 rounded-md flex items-center gap-1 transition-colors
                                ${pagination.page === pagination.total_pages
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-brand-navy text-white hover:bg-brand-navy"
                                }`}
                        >
                            Next
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}

            <ToastContainer />

        </div>
    );
}

export default WithdrawalTable;