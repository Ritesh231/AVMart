import { FaSearch, FaTrash, FaEye } from "react-icons/fa";
import { ArrowDown, BadgeIndianRupee, Blocks, ChartColumnIncreasing, ChevronDown, CircleDashed, CreditCard, Download, FileText, HandCoins, Search, SlidersHorizontal, Upload, Wallet, WalletMinimal } from 'lucide-react'
import { IoFilter } from "react-icons/io5";
import { BsWallet2 } from "react-icons/bs";
import { useGetOrdersByStatusAssignQuery } from "../../Redux/apis/ordersApi";
import {
  useGetAllDeliveryBoysQuery,
  useGetAssignDeliveryBoysMutation
} from "../../Redux/apis/deliveryApi";
import { useState, useEffect, useRef } from "react";
import { useGetOrdersByIdMutation } from "../../Redux/apis/ordersApi";
import OrderDetailsModal from "../Orders/OrderdetailedModal";
import { toast } from "react-toastify";

export default function UsersTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 20; // Match API limit

  // ✅ Server-side pagination - send page and limit to API
  const {
    data,
    isLoading,
    isError,
    refetch
  } = useGetOrdersByStatusAssignQuery({
    status: "assigned",
    page: currentPage,
    limit: ordersPerPage
  });

  const [getOrderById, { data: orderData, isLoading: Loader }] = useGetOrdersByIdMutation();

  const users = data?.orders || [];
  const pagination = data?.pagination || {
    total: 0,
    page: 1,
    limit: ordersPerPage,
    pages: 1
  };

  const [paymentFilter, setPaymentFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const selectAllRef = useRef(null);

  // ✅ Filter and search on current page data (API already paginated)
  const filteredUsers = users.filter((order) => {
    const matchesPayment =
      paymentFilter === "All"
        ? true
        : order.paymentMethod?.toLowerCase() === paymentFilter.toLowerCase();
    const matchesSearch = JSON.stringify(order || {})
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesPayment && matchesSearch;
  });

  // ❌ Remove frontend pagination - API already handles it
  // const totalPages = Math.ceil(filteredUsers.length / ordersPerPage);
  // const indexOfLastOrder = currentPage * ordersPerPage;
  // const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  // const currentOrders = filteredUsers.slice(indexOfFirstOrder, indexOfLastOrder);

  // ✅ Use filtered users directly (already from current API page)
  const currentOrders = filteredUsers;

  // Reset to page 1 when filters change and refetch
  useEffect(() => {
    setCurrentPage(1);
    refetch();
  }, [paymentFilter, searchTerm, refetch]);

  // Reset selected orders when data changes
  useEffect(() => {
    setSelectedOrderIds([]);
  }, [users.length]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const { data: deliveryData, isLoading: loading } = useGetAllDeliveryBoysQuery({ status: "approved" });
  const [assignDeliveryBoy] = useGetAssignDeliveryBoysMutation();

  const handleAssign = async (deliveryBoyId) => {
    try {
      await assignDeliveryBoy({
        orderId: selectedOrderId,
        deliveryBoyId: deliveryBoyId,
      }).unwrap();

      toast.success("Delivery Boy Assigned Successfully");
      setIsModalOpen(false);
      refetch(); // Refresh orders after assignment
    } catch (error) {
      console.error(error);
      toast.error("Failed to Assign Delivery Boy");
    }
  };

  const selectedFilteredCount = filteredUsers.filter((order) =>
    selectedOrderIds.includes(order._id)
  ).length;
  const isAllSelected =
    filteredUsers.length > 0 && selectedFilteredCount === filteredUsers.length;
  const isSomeSelected = selectedFilteredCount > 0 && !isAllSelected;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = isSomeSelected;
    }
  }, [isSomeSelected]);

  const toggleOrderSelection = (id) => {
    setSelectedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((orderId) => orderId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelectedOrderIds(filteredUsers.map((order) => order._id));
      return;
    }
    setSelectedOrderIds([]);
  };

  const getRowsForExport = () => {
    const selectedRows = filteredUsers.filter((order) =>
      selectedOrderIds.includes(order._id)
    );
    const sourceRows = selectedRows.length > 0 ? selectedRows : filteredUsers;

    if (sourceRows.length === 0) {
      toast.info("No confirmed orders available to export");
      return [];
    }

    return sourceRows.map((order) => ({
      "Order ID": order._id?.slice(-5) || "-",
      "Shop Name": order.shopInfo?.name || "-",
      Price: order.price ?? "-",
      "Placed On": order.placedOn || "-",
      Items: order.itemsPreview?.length || order.itemsSummary?.length || 0,
      "Payment Method": order.paymentMethod || "-",
      Status: order.OrderStatus || "-"
    }));
  };

  const downloadBlob = (content, fileName, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToExcel = () => {
    const rows = getRowsForExport();
    if (!rows.length) return;

    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        headers
          .map((header) => `"${String(row[header]).replace(/"/g, '""')}"`)
          .join(",")
      )
    ].join("\n");

    downloadBlob(csv, "confirmed_orders_export.csv", "text/csv;charset=utf-8;");
    setIsExportMenuOpen(false);
  };

  const exportToDoc = () => {
    const rows = getRowsForExport();
    if (!rows.length) return;

    const headers = Object.keys(rows[0]);
    const tableHead = headers.map((header) => `<th>${header}</th>`).join("");
    const tableRows = rows
      .map(
        (row) =>
          `<tr>${headers.map((header) => `<td>${row[header]}</td>`).join("")}</tr>`
      )
      .join("");

    const html = `
      <html>
        <head><meta charset="utf-8" /></head>
        <body>
          <h2>Confirmed Orders Export</h2>
          <table border="1" cellspacing="0" cellpadding="6">
            <thead><tr>${tableHead}</tr></thead>
            <tbody>${tableRows}</tbody>
          </table>
        </body>
      </html>`;

    downloadBlob(html, "confirmed_orders_export.doc", "application/msword");
    setIsExportMenuOpen(false);
  };

  const exportToPdf = () => {
    const rows = getRowsForExport();
    if (!rows.length) return;

    const headers = Object.keys(rows[0]);
    const tableHead = headers.map((header) => `<th>${header}</th>`).join("");
    const tableRows = rows
      .map(
        (row) =>
          `<tr>${headers.map((header) => `<td>${row[header]}</td>`).join("")}</tr>`
      )
      .join("");

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Confirmed Orders Export</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { margin-bottom: 12px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background: #f2f2f2; }
          </style>
        </head>
        <body>
          <h2>Confirmed Orders Export</h2>
          <table>
            <thead><tr>${tableHead}</tr></thead>
            <tbody>${tableRows}</tbody>
          </table>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    setIsExportMenuOpen(false);
  };

  // ✅ Calculate display values from API pagination
  const startIndex = (pagination.page - 1) * pagination.limit + 1;
  const endIndex = Math.min(pagination.page * pagination.limit, pagination.total);

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              placeholder='Search By Orders'
            />
          </div>
        </div>

        {/* Export Button */}
        <div className='flex justify-evenly gap-2 items-center'>
          <select
            value={paymentFilter}
            onChange={(e) => {
              setPaymentFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="border-brand-cyan border px-4 py-3 rounded-2xl text-sm font-semibold text-brand-navy cursor-pointer"
          >
            <option value="All">All Payments</option>
            <option value="COD">COD</option>
            <option value="Online">Online</option>
            <option value="Partial">Partial</option>
          </select>

          <div className="relative">
            <button
              onClick={() => setIsExportMenuOpen((prev) => !prev)}
              className='bg-brand-navy px-6 py-3 rounded-2xl flex justify-center gap-2 items-center text-white font-bold hover:bg-opacity-90 transition-all'
            >
              <Download size={20} /> Export <ChevronDown size={16} />
            </button>

            {isExportMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-lg z-20 overflow-hidden">
                <button
                  onClick={exportToExcel}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Export Excel
                </button>
                <button
                  onClick={exportToPdf}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Export PDF
                </button>
                <button
                  onClick={exportToDoc}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Export DOC
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="min-w-[900px] w-full text-sm">

          <thead className="bg-[#F1F5F9] text-gray-600">
            <tr>
              <th className="p-3">
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                />
              </th>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Shop Info</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Placed On</th>
              <th className="p-3 text-left">Items</th>
              <th className="p-3 text-left">Payment Method</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {/* 🔄 Loading Skeleton */}
            {isLoading &&
              Array.from({ length: 6 }).map((_, index) => (
                <tr key={index} className="border-t animate-pulse">
                  <td className="p-3">
                    <div className="h-4 w-4 bg-gray-200 rounded"></div>
                  </td>
                  <td className="p-3">
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  </td>
                  <td className="p-3">
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  </td>
                  <td className="p-3">
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  </td>
                  <td className="p-3">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="h-6 w-24 bg-gray-200 rounded-xl"></div>
                  </td>
                  <td className="p-3">
                    <div className="h-8 w-28 bg-gray-200 rounded-md"></div>
                  </td>
                </tr>
              ))}

            {/* ❌ Error State */}
            {isError && !isLoading && (
              <tr>
                <td colSpan="8" className="text-center p-6 text-red-500 font-semibold">
                  Failed to load orders. Please try again.
                </td>
              </tr>
            )}

            {!isLoading && !isError && users.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center p-6 text-gray-500">
                  No confirmed orders found.
                </td>
              </tr>
            )}

            {/* ✅ Actual Data */}
            {!isLoading &&
              !isError &&
              currentOrders.map((u) => (
                <tr key={u._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedOrderIds.includes(u._id)}
                      onChange={() => toggleOrderSelection(u._id)}
                    />
                  </td>
                  <td className="p-3 font-medium">{u._id?.slice(-5)}</td>
                  <td className="p-3 font-medium">{u.shopInfo?.name}</td>
                  <td className="p-3">
                    {u.price?.toString().includes(".")
                      ? u.price.toString().split(".")[0] +
                      "." +
                      u.price.toString().split(".")[1].slice(0, 2)
                      : u.price}
                  </td>
                  <td className="p-3">{u.placedOn}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {u.itemsPreview?.slice(0, 3).map((item, index) => (
                        <img
                          key={index}
                          src={item.image}
                          alt="item"
                          className="w-8 h-8 rounded-md object-cover border"
                        />
                      ))}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl
                      bg-[#57FB6830] border border-[#03C616] text-[#03C616] text-sm font-semibold">
                      <BsWallet2 className="text-[#03C616]" />
                      {u.paymentMethod}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      className="p-1 text-blue-900"
                      title="View"
                      onClick={async () => {
                        setSelectedOrderId(u._id);
                        await getOrderById(u._id);
                      }}
                    >
                      <FaEye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {selectedOrderId && (
          <OrderDetailsModal
            order={orderData?.order}
            loading={Loader}
            onClose={() => setSelectedOrderId(null)}
          />
        )}

        {/* Delivery Boy Assignment Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-96 max-h-[500px] overflow-y-auto">
              <h3 className="text-lg font-bold mb-4">Assign Delivery Boy</h3>
              {deliveryData?.data?.map((boy) => (
                <div
                  key={boy._id}
                  onClick={() => handleAssign(boy._id)}
                  className="border p-3 rounded-lg mb-2 cursor-pointer hover:bg-gray-50"
                >
                  <p className="font-semibold">{boy.Name}</p>
                  <p className="text-sm text-gray-600">Orders: {boy.completeOrders}</p>
                  <p className="text-sm text-gray-600">Status: {boy.deliveryBoyAvailable}</p>
                </div>
              ))}
              <button
                onClick={() => setIsModalOpen(false)}
                className="mt-4 w-full bg-gray-500 text-white py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ✅ Server-side Pagination */}
        {pagination.total > ordersPerPage && (
          <div className="flex justify-between items-center mt-6 px-4 py-4 bg-white border-t">
            {/* Showing Info */}
            <p className="text-sm text-gray-600">
              Showing {startIndex} to {endIndex} of {pagination.total} orders
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

              {/* Page Numbers with Ellipsis */}
              {[...Array(pagination.pages)].map((_, index) => {
                const page = index + 1;
                // Show limited page numbers for better UX
                if (
                  page === 1 ||
                  page === pagination.pages ||
                  (page >= currentPage - 2 && page <= currentPage + 2)
                ) {
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
                }
                // Add ellipsis
                if (page === currentPage - 3 || page === currentPage + 3) {
                  return <span key={page} className="px-2">...</span>;
                }
                return null;
              })}

              {/* Next */}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, pagination.pages))
                }
                disabled={currentPage === pagination.pages}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${currentPage === pagination.pages
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
    </>
  );
}