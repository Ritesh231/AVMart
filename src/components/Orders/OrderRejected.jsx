import { FaEye } from "react-icons/fa";
import { ChevronDown, Download, Search, SlidersHorizontal } from "lucide-react";
import { BsWallet2 } from "react-icons/bs";
import { useGetOrdersByStatusQuery, useAssignOrderStatusMutation } from "../../Redux/apis/ordersApi";
import OrderDetailsModal from "../Orders/OrderdetailedModal";
import { useGetOrdersByIdMutation } from "../../Redux/apis/ordersApi";
import { useEffect, useRef, useState } from "react";

export default function UsersTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 20;

  const {
    data,
    isLoading,
    isError,
    refetch
  } = useGetOrdersByStatusQuery({
    status: "rejected",
    page: currentPage,
    limit: ordersPerPage
  });

  const users = data?.orders || [];
  const pagination = data?.pagination || {
    total: 0,
    page: 1,
    limit: ordersPerPage,
    pages: 1
  };

  const [assignOrderStatus] = useAssignOrderStatusMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const selectAllRef = useRef(null);

  // ✅ Filter and search on current page data (API already paginated)
  const filteredUsers =
    paymentFilter === "All"
      ? users
      : users.filter(
        (order) => order.paymentMethod?.toLowerCase() === paymentFilter.toLowerCase()
      );

  const searchedUsers = filteredUsers.filter((order) =>
    JSON.stringify(order || {}).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ❌ Remove frontend pagination - API already handles it
  // const totalPages = Math.ceil(searchedUsers.length / ordersPerPage);
  // const indexOfLastOrder = currentPage * ordersPerPage;
  // const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  // const currentOrders = searchedUsers.slice(indexOfFirstOrder, indexOfLastOrder);

  // ✅ Use searched users directly (already from current API page)
  const currentOrders = searchedUsers;

  // Reset to page 1 when filters change and refetch
  useEffect(() => {
    setCurrentPage(1);
    refetch();
  }, [paymentFilter, searchTerm, refetch]);

  // Reset selected orders when data changes
  useEffect(() => {
    setSelectedOrderIds([]);
  }, [users.length]);

  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [getOrderById, { data: orderData, isLoading: Loader }] =
    useGetOrdersByIdMutation();

  const selectedFilteredCount = searchedUsers.filter((order) =>
    selectedOrderIds.includes(order._id)
  ).length;
  const isAllSelected =
    searchedUsers.length > 0 && selectedFilteredCount === searchedUsers.length;
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
      setSelectedOrderIds(searchedUsers.map((order) => order._id));
      return;
    }
    setSelectedOrderIds([]);
  };

  const getRowsForExport = () => {
    const selectedRows = searchedUsers.filter((order) =>
      selectedOrderIds.includes(order._id)
    );
    const sourceRows = selectedRows.length > 0 ? selectedRows : searchedUsers;

    if (!sourceRows.length) {
      return [];
    }

    return sourceRows.map((order) => ({
      "Order ID": order._id || "-",
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
    if (!rows.length) {
      setIsExportMenuOpen(false);
      return;
    }

    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        headers
          .map((header) => `"${String(row[header]).replace(/"/g, '""')}"`)
          .join(",")
      )
    ].join("\n");

    downloadBlob(csv, "rejected_orders_export.csv", "text/csv;charset=utf-8;");
    setIsExportMenuOpen(false);
  };

  const toSafeHtml = (value) =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const getExportHtml = (title) => {
    const rows = getRowsForExport();
    if (!rows.length) {
      return "";
    }
    const headers = Object.keys(rows[0]);
    const tableHead = headers.map((header) => `<th>${toSafeHtml(header)}</th>`).join("");
    const tableRows = rows
      .map(
        (row) =>
          `<tr>${headers
            .map((header) => `<td>${toSafeHtml(row[header])}</td>`)
            .join("")}</tr>`
      )
      .join("");

    return `
      <html>
        <head><meta charset="utf-8" /></head>
        <body>
          <h2>${toSafeHtml(title)}</h2>
          <table border="1" cellspacing="0" cellpadding="6">
            <thead><tr>${tableHead}</table></thead>
            <tbody>${tableRows}</tbody>
          </table>
        </body>
      </html>`;
  };

  const exportToDoc = () => {
    const html = getExportHtml("Rejected Orders Export");
    if (!html) {
      setIsExportMenuOpen(false);
      return;
    }
    downloadBlob(html, "rejected_orders_export.doc", "application/msword");
    setIsExportMenuOpen(false);
  };

  const exportToPdf = () => {
    const html = getExportHtml("Rejected Orders Export");
    if (!html) {
      setIsExportMenuOpen(false);
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      setIsExportMenuOpen(false);
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Rejected Orders Export</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { margin-bottom: 12px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background: #f2f2f2; }
          </style>
        </head>
        <body>
          ${html.match(/<body>([\s\S]*)<\/body>/)?.[1] || ""}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    setIsExportMenuOpen(false);
  };

  const startIndex = (pagination.page - 1) * pagination.limit + 1;
  const endIndex = Math.min(pagination.page * pagination.limit, pagination.total);

  const handleReassign = async (id) => {
    try {
      await assignOrderStatus({ id, status: "confirmed" });
    } catch (error) {
      console.error("Error reassigning order:", error);
    }
  };

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
          <div className="relative">
            <select
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none border border-brand-cyan font-semibold text-brand-navy px-5 py-3 pr-10 rounded-2xl bg-white cursor-pointer focus:outline-none"
            >
              <option value="All">All Payments</option>
              <option value="Online">Online</option>
              <option value="COD">Cash On Delivery</option>
              <option value="Partial">Partial</option>
            </select>

            <ChevronDown
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-brand-navy"
            />
          </div>
          <div className="relative">
            <button
              className='bg-brand-navy px-6 py-3 rounded-2xl flex justify-center gap-2 items-center text-white font-bold hover:bg-opacity-90 transition-all'
              onClick={() => setIsExportMenuOpen((prev) => !prev)}
            >
              <Download size={20} /> Export
            </button>
            {isExportMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border z-20">
                <button
                  onClick={exportToPdf}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  PDF
                </button>
                <button
                  onClick={exportToDoc}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  DOC
                </button>
                <button
                  onClick={exportToExcel}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Excel
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
              <th className="p-3 text-left">Payment</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {/* 🔄 Skeleton Loading */}
            {isLoading &&
              Array.from({ length: 6 }).map((_, index) => (
                <tr key={index} className="border-t animate-pulse">
                  <td className="p-3">
                    <div className="h-4 w-4 bg-gray-200 rounded"></div>
                  </td>
                  <td className="p-3">
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  </td>
                  <td className="p-3">
                    <div className="h-4 w-40 bg-gray-200 rounded"></div>
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
                    <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                  </td>
                </tr>
              ))}

            {/* ❌ Error State */}
            {isError && !isLoading && (
              <tr>
                <td colSpan="8" className="text-center p-6 text-red-500 font-semibold">
                  Failed to load rejected orders. Please try again.
                </td>
              </tr>
            )}

            {/* 📭 Empty State */}
            {!isLoading && !isError && searchedUsers.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center p-6 text-gray-500">
                  No rejected orders found.
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
                      {u.itemsPreview?.slice(0, 3).map((img, index) => (
                        <img
                          key={index}
                          src={img.image}
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

                  <td className="p-3 flex gap-5">
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
                    {/* <button
                      className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                        bg-[#1E264F] text-white hover:bg-opacity-90"
                      onClick={() => handleReassign(u._id)}
                    >
                      Reassign
                    </button> */}
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