import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Package,
  Bike,
  Calendar,
  CheckCircle,
  ChevronDown,
  Truck,
  Download, Search, SlidersHorizontal, ChevronLeft, ChevronRight
} from "lucide-react";

import { FaUserCheck } from "react-icons/fa";
import { MdAttachMoney } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import AttendanceStats from "./AttendanceCard";
import RevenueStats from "./RevenueCard";
import OrderStats from "./OrderCard";
import { useGetdeliveryProfileQuery, useGetDeliveryBoyDetailsQuery, useGetDeliveryBoyOrderDetailsQuery, useGetWithdrawalRequestsQuery, useVerifyWithdrawalMutation } from "../../Redux/apis/deliveryApi";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function DeliveryBoyDetails() {
  const [activeTab, setActiveTab] = useState("attendance");
  const [openOrderId, setOpenOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const selectAllRef = useRef(null);
  const { id } = useParams();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data, isLoading, isError } = useGetdeliveryProfileQuery(id);
  const { data: withdrawalData, isLoading: withdrawalLoading } = useGetWithdrawalRequestsQuery();
  const [verifyWithdrawal] = useVerifyWithdrawalMutation();

  const withdrawals = withdrawalData?.data || [];
  const profile = data?.data || [];
  const [vehicleFilter, setVehicleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const applyDateFilter = (data, dateField = "date") => {
    if (dateFilter === "All") return data;

    return data.filter((item) => {
      if (!item[dateField]) return false;

      const itemDate = new Date(item[dateField]);
      const today = new Date();

      if (dateFilter === "Today") {
        return itemDate.toDateString() === today.toDateString();
      }

      if (dateFilter === "Last7Days") {
        const last7 = new Date();
        last7.setDate(today.getDate() - 7);
        return itemDate >= last7 && itemDate <= today;
      }

      if (dateFilter === "Custom" && fromDate && toDate) {
        const start = new Date(fromDate);
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
        return itemDate >= start && itemDate <= end;
      }

      return true;
    });
  };

  const {
    data: tabData,
    isLoading: tabLoading,
    isError: tabError,
    refetch: refetchTabData,
  } = useGetDeliveryBoyDetailsQuery(
    { id, tab: activeTab, page: currentPage, limit: itemsPerPage },
    { skip: !id }
  );

  const {
    data: orderdetail,
    isLoading: orderLoading,
    isError: orderError,
  } = useGetDeliveryBoyOrderDetailsQuery(openOrderId, {
    skip: !openOrderId,
  });

  const orderData = orderdetail?.data;

  const toggleOrder = (id) => {
    setOpenOrderId(openOrderId === id ? null : id);
  };

  // Get pagination meta from API response
  const paginationMeta = tabData?.meta || {
    page: currentPage,
    per_page: itemsPerPage,
    total: 0,
    total_pages: 0,
    has_next_page: false,
    has_prev_page: false
  };

  const attendanceData = tabData?.data || [];
  const attendanceCount = tabData?.stats || {
    present: 0,
    absent: 0,
    halfDay: 0,
  };

  // Filter data based on search and status (client-side filtering on current page data)
  const getFilteredData = () => {
    let data = attendanceData;

    // Apply search filter
    if (activeTab === "attendance") {
      data = data.filter((item) => {
        const term = searchTerm.toLowerCase();
        return (
          item.date?.toLowerCase().includes(term) ||
          item.status?.toLowerCase().includes(term) ||
          item.workingHours?.toLowerCase().includes(term)
        );
      });
    } else if (activeTab === "revenue") {
      data = data.filter((txn) => {
        const term = searchTerm.toLowerCase();
        return (
          txn.transactionId?.toLowerCase().includes(term) ||
          txn.orderId?.toLowerCase().includes(term) ||
          txn.type?.toLowerCase().includes(term) ||
          txn.description?.toLowerCase().includes(term)
        );
      });
    } else if (activeTab === "orders") {
      data = data.filter((order) => {
        const term = searchTerm.toLowerCase();
        return (
          order._id?.toLowerCase().includes(term) ||
          order.deliveryStatus?.toLowerCase().includes(term) ||
          order.paymentMethod?.toLowerCase().includes(term)
        );
      });
    }

    // Apply status filter
    if (statusFilter !== "All") {
      if (activeTab === "attendance") {
        data = data.filter((item) => item.status === statusFilter);
      } else if (activeTab === "revenue") {
        data = data.filter((txn) => txn.type === statusFilter);
      } else if (activeTab === "orders") {
        data = data.filter((order) => order.deliveryStatus === statusFilter);
      }
    }

    // Apply date filter
    if (dateFilter !== "All") {
      data = applyDateFilter(data);
    }

    return data;
  };

  const filteredData = getFilteredData();

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, statusFilter, dateFilter, fromDate, toDate, searchTerm]);

  // Reset selections when tab or filters change
  useEffect(() => {
    setSelectedIds([]);
    setIsExportMenuOpen(false);
  }, [activeTab, searchTerm, statusFilter, dateFilter, fromDate, toDate, currentPage]);

  const getItemId = (item) =>
    item?._id || item?.transactionId || item?.orderId || item?.date;

  const selectedFilteredCount = filteredData.filter((item) =>
    selectedIds.includes(getItemId(item))
  ).length;
  const isAllSelected =
    filteredData.length > 0 && selectedFilteredCount === filteredData.length;
  const isSomeSelected = selectedFilteredCount > 0 && !isAllSelected;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = isSomeSelected;
    }
  }, [isSomeSelected]);

  const toggleSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(filteredData.map((item) => getItemId(item)));
      return;
    }
    setSelectedIds([]);
  };

  const getRowsForExport = () => {
    const selectedRows = filteredData.filter((item) =>
      selectedIds.includes(getItemId(item))
    );
    const sourceRows = selectedRows.length ? selectedRows : filteredData;
    if (!sourceRows.length) return [];

    if (activeTab === "attendance") {
      return sourceRows.map((item) => ({
        Date: item.date?.split("T")[0] || "-",
        "Check In": item.checkIn || "-",
        "Check Out": item.checkOut || "-",
        "Working Hours": item.workingHours || "-",
        Status: item.status || "-"
      }));
    }

    if (activeTab === "revenue") {
      return sourceRows.map((txn) => ({
        "Transaction ID": txn.transactionId || "-",
        "Order ID": txn.orderId || "-",
        Date: txn.date || "-",
        Type: txn.type || "-",
        Amount: txn.amount ?? "-",
        Description: txn.description || "-"
      }));
    }

    return sourceRows.map((order) => ({
      "Order ID": order._id?.slice(-6).toUpperCase() || "-",
      Status: order.deliveryStatus || "-",
      Date: order.date || "-",
      "Grand Total": order.grandTotal ?? "-",
      "Payment Method": order.paymentMethod || "-"
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
    downloadBlob(csv, `delivery_${activeTab}_export.csv`, "text/csv;charset=utf-8;");
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
    if (!rows.length) return "";
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
            <thead><tr>${tableHead}</tr></thead>
            <tbody>${tableRows}</tbody>
          </table>
        </body>
      </html>`;
  };

  const exportToDoc = () => {
    const html = getExportHtml(`Delivery Boy ${activeTab} Export`);
    if (!html) {
      setIsExportMenuOpen(false);
      return;
    }
    downloadBlob(html, `delivery_${activeTab}_export.doc`, "application/msword");
    setIsExportMenuOpen(false);
  };

  const exportToPdf = () => {
    const html = getExportHtml(`Delivery Boy ${activeTab} Export`);
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
          <title>Delivery Boy ${activeTab} Export</title>
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

  const handleWithdrawalAction = async (id, status) => {
    try {
      await verifyWithdrawal({
        requestId: id,
        status,
        paymentReference: "TXN123456789",
        adminNote:
          status === "approved"
            ? "Approved by admin"
            : "Rejected by admin",
      }).unwrap();

      toast.success(`Request ${status}`);
    } catch (err) {
      toast.error(err?.data?.error || "Action failed");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };


  // Apply vehicle filter
  if (vehicleFilter !== "All") {
    data = data.filter(
      (item) => item.vehicleType === vehicleFilter
    );
  }

  // Calculate display range
  const startItem = (paginationMeta.page - 1) * paginationMeta.per_page + 1;
  const endItem = Math.min(paginationMeta.page * paginationMeta.per_page, paginationMeta.total);

  // Render pagination buttons
  const renderPaginationButtons = () => {
    const totalPages = paginationMeta.total_pages;
    const currentPageNum = paginationMeta.page;
    const maxButtons = 5;
    let startPage = Math.max(1, currentPageNum - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages.map((page) => (
      <button
        key={page}
        onClick={() => handlePageChange(page)}
        className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all
          ${currentPageNum === page
            ? "bg-[#00E5B0] text-white shadow-md"
            : "bg-gray-100 text-[#1E264F] hover:bg-gray-200"
          }`}
      >
        {page}
      </button>
    ));
  };

  if (isLoading) return <div className="p-6">Loading profile...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div>
          <h1 className="text-xl font-semibold">Delivery Boy Details</h1>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">

          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-indigo-900 text-white flex items-center justify-center text-2xl font-bold">
            {profile?.name?.charAt(0)?.toUpperCase()}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h2 className="text-xl font-semibold">{profile?.name}</h2>
              <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                {profile?._id}
              </span>
              <span
                className={`text-xs px-3 py-1 rounded-full ${profile?.availabilityStatus === "Notavailable"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
                  }`}
              >
                {profile?.availabilityStatus}
              </span>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-2">
                <Phone size={16} /> {profile?.phone}
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} /> {profile?.email}
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} /> {profile?.address}
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 mt-3">
              <div className="bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
                <Package size={16} /> Total Deliveries : {profile?.totalDeliveries}
              </div>
              <div className="bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
                <Bike size={16} /> {profile?.vehicleNumber} {profile?.vehicleType}
              </div>
              <div className="bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
                <Calendar size={16} /> {profile?.joinedAt?.split("T")[0]}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row bg-[#1E264F] p-2 my-6 rounded-xl gap-2 md:w-fit w-full shadow-lg">
        <button
          onClick={() => {
            setActiveTab("attendance");
            setCurrentPage(1);
          }}
          className={`px-6 py-3 rounded-lg flex items-center gap-3 font-semibold transition-all duration-300
      ${activeTab === "attendance"
              ? "bg-[#00E5B0] text-white"
              : "bg-white text-[#1E264F] hover:bg-gray-100"
            }`}
        >
          <FaUserCheck size={20} />
          Attendance
        </button>

        <button
          onClick={() => {
            setActiveTab("revenue");
            setCurrentPage(1);
          }}
          className={`px-6 py-3 rounded-lg flex items-center gap-3 font-semibold transition-all duration-300
      ${activeTab === "revenue"
              ? "bg-[#00E5B0] text-white"
              : "bg-white text-[#1E264F] hover:bg-gray-100"
            }`}
        >
          <MdAttachMoney size={20} />
          Revenue
        </button>

        <button
          onClick={() => {
            setActiveTab("orders");
            setCurrentPage(1);
          }}
          className={`px-6 py-3 rounded-lg flex items-center gap-3 font-semibold transition-all duration-300
      ${activeTab === "orders"
              ? "bg-[#00E5B0] text-white"
              : "bg-white text-[#1E264F] hover:bg-gray-100"
            }`}
        >
          <FaShoppingCart size={20} />
          Orders
        </button>
      </div>

      {/* Summary Cards */}
      {activeTab === "attendance" && (
        <AttendanceStats
          present={attendanceCount?.present || 0}
          absent={attendanceCount?.absent || 0}
          halfDay={attendanceCount?.halfDay || 0}
        />
      )}

      {activeTab === "revenue" && (
        <RevenueStats
          totalEarned={tabData?.stats?.totalEarned || 0}
          totalWithdrawn={tabData?.stats?.totalWithdrawn || 0}
          balance={tabData?.stats?.balance || 0}
        />
      )}

      {activeTab === "orders" && (
        <OrderStats
          total={tabData?.stats?.totalOrders}
          ongoing={tabData?.stats?.ongoing || 0}
          completed={tabData?.stats?.completed || 0}
          rejected={tabData?.stats?.rejected || 0}
        />
      )}

      {/* Filter Section */}
      <div className="flex flex-col gap-4 mb-6">

        {/* 🔍 Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">

          {/* Search Box */}
          <div className="w-full lg:w-[40%] md:w-[50%]">
            <div className="flex items-center gap-2 bg-white border-2 border-brand-soft rounded-2xl p-3 focus-within:border-brand-teal transition-all">
              <Search className="text-brand-gray" size={20} />
              <input
                className="w-full bg-transparent outline-none text-sm text-brand-navy placeholder:text-brand-gray"
                type="text"
                placeholder={
                  activeTab === "attendance"
                    ? "Search by date / hours"
                    : "Search by Order ID / Txn ID"
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Right Side Controls */}
          <div className="flex gap-2 items-center flex-wrap">

            {/* Select All */}
            <label className="inline-flex items-center gap-2 border border-brand-cyan rounded-xl px-3 py-3 text-sm font-semibold text-brand-navy bg-white whitespace-nowrap">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={(e) => toggleSelectAll(e.target.checked)}
              />
              Select All
            </label>

            {/* Filter Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border px-3 py-2 rounded-xl bg-white w-full sm:w-auto text-sm"
            >
              <option value="All">All Status</option>

              {activeTab === "attendance" && (
                <>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="HalfDay">HalfDay</option>
                </>
              )}

              {activeTab === "orders" && (
                <>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="At Location">At Location</option>
                </>
              )}

              {activeTab === "revenue" && (
                <>
                  <option value="Credit">Credit</option>
                  <option value="Debit">Debit</option>
                </>
              )}
            </select>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setFromDate("");
                setToDate("");
              }}
              className="border px-3 py-2 rounded-xl bg-white w-full sm:w-auto text-sm"
            >
              <option value="All">All Dates</option>
              <option value="Today">Today</option>
              <option value="Last7Days">Last 7 Days</option>
              <option value="Custom">Custom Range</option>
            </select>


            {/* Export Button */}
            <div className="relative">
              <button
                className="bg-brand-navy px-6 py-3 rounded-2xl text-white flex items-center gap-2"
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

        {/* ⚙️ Controls */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 w-full">



          {/* 📅 Custom Date Range */}
          {dateFilter === "Custom" && (
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <input
                type="date"
                value={fromDate}
                max={toDate || undefined}
                onChange={(e) => {
                  const selected = e.target.value;
                  if (toDate && selected > toDate) setToDate("");
                  setFromDate(selected);
                }}
                className="border px-3 py-2 rounded-xl w-full text-sm"
              />

              <input
                type="date"
                value={toDate}
                min={fromDate || undefined}
                onChange={(e) => {
                  const selected = e.target.value;
                  if (fromDate && selected < fromDate) return;
                  setToDate(selected);
                }}
                className="border px-3 py-2 rounded-xl w-full text-sm"
              />
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {tabLoading && (
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <p>Loading {activeTab} data...</p>
        </div>
      )}

      {/* Attendance Tab */}
      {activeTab === "attendance" && !tabLoading && (
        <>
          <div className="bg-white rounded-xl shadow-sm border md:overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-6 py-3"></th>
                  <th className="text-left px-6 py-3">Date</th>
                  <th className="text-left px-6 py-3">Check In</th>
                  <th className="text-left px-6 py-3">Check Out</th>
                  <th className="text-left px-6 py-3">Working Hours</th>
                  <th className="text-left px-6 py-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr key={item._id} className="border-t">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(getItemId(item))}
                          onChange={() => toggleSelection(getItemId(item))}
                        />
                      </td>
                      <td className="px-6 py-4">{item.date?.split("T")[0]}</td>
                      <td className="px-6 py-4">{item.checkIn}</td>
                      <td className="px-6 py-4">{item.checkOut}</td>
                      <td className="px-6 py-4">{item.workingHours}</td>
                      <td className="px-6 py-4">
                        <span className="bg-indigo-900 text-white px-3 py-1 rounded-full text-xs">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      No attendance records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {paginationMeta.total > 0 && (
            <div className="flex justify-between items-center mt-6 px-4 py-4 bg-white rounded-xl shadow-sm border">
              <p className="text-sm text-gray-600 hidden md:block">
                Showing {startItem} to {endItem} of {paginationMeta.total} records
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!paginationMeta.has_prev_page}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1
                    ${!paginationMeta.has_prev_page
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-[#1E264F] text-white hover:bg-opacity-90"
                    }`}
                >
                  <ChevronLeft size={16} /> Prev
                </button>
                {renderPaginationButtons()}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!paginationMeta.has_next_page}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1
                    ${!paginationMeta.has_next_page
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-[#1E264F] text-white hover:bg-opacity-90"
                    }`}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Revenue Tab */}
      {activeTab === "revenue" && !tabLoading && (
        <>
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-6 py-3"></th>
                  <th className="text-left px-6 py-3">Transaction ID</th>
                  <th className="text-left px-6 py-3">Order ID</th>
                  <th className="text-left px-6 py-3">Date</th>
                  <th className="text-left px-6 py-3">Type</th>
                  <th className="text-left px-6 py-3">Amount</th>
                  <th className="text-left px-6 py-3">Description</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((txn) => (
                    <tr key={txn._id} className="border-t">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(getItemId(txn))}
                          onChange={() => toggleSelection(getItemId(txn))}
                        />
                      </td>
                      <td className="px-6 py-4">{txn.transactionId}</td>
                      <td className="px-6 py-4">{txn.orderId}</td>
                      <td className="px-6 py-4">{txn.date}</td>
                      <td className="px-6 py-4">{txn.type}</td>
                      <td className="px-6 py-4">₹{txn.amount}</td>
                      <td className="px-6 py-4">{txn.description}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
                      No revenue records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {paginationMeta.total > 0 && (
            <div className="flex justify-between items-center mt-6 px-4 py-4 bg-white rounded-xl shadow-sm border">
              <p className="text-sm text-gray-600">
                Showing {startItem} to {endItem} of {paginationMeta.total} records
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!paginationMeta.has_prev_page}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1
                    ${!paginationMeta.has_prev_page
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-[#1E264F] text-white hover:bg-opacity-90"
                    }`}
                >
                  <ChevronLeft size={16} /> Prev
                </button>
                {renderPaginationButtons()}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!paginationMeta.has_next_page}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1
                    ${!paginationMeta.has_next_page
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-[#1E264F] text-white hover:bg-opacity-90"
                    }`}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && !tabLoading && (
        <>
          <div className="space-y-4">
            {filteredData.length > 0 ? (
              filteredData.map((order) => {
                const isOngoing = order.deliveryStatus === "Ongoing";
                const isDelivered = order.deliveryStatus === "Delivered";

                return (
                  <div key={order._id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    {/* Header */}
                    <div
                      className="flex justify-between items-center p-5 cursor-pointer"
                      onClick={() => toggleOrder(order._id)}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(getItemId(order))}
                          onClick={(e) => e.stopPropagation()}
                          onChange={() => toggleSelection(getItemId(order))}
                        />

                        {/* Dynamic Status Icon */}
                        {isOngoing && (
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <Truck size={18} className="text-blue-600" />
                          </div>
                        )}

                        {isDelivered && (
                          <div className="bg-green-100 p-2 rounded-lg">
                            <CheckCircle size={18} className="text-green-600" />
                          </div>
                        )}

                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold">
                              {order._id.slice(-6).toUpperCase()}
                            </h3>
                            <span className="bg-gray-200 text-xs px-3 py-1 rounded-full">
                              {order.deliveryStatus}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {order.date}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold">
                            ₹{order.grandTotal}
                          </p>
                          <p className="text-xs text-gray-500">
                            {order.paymentMethod}
                          </p>
                        </div>

                        <button
                          onClick={() => toggleOrder(order._id)}
                          className="p-2 rounded-md hover:bg-gray-100 transition"
                        >
                          <ChevronDown
                            size={18}
                            className={`transition-transform duration-300 ${openOrderId === order._id ? "rotate-180" : ""
                              }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Collapsible Content */}
                    {openOrderId === order._id && (
                      <div className="border-t p-5 bg-gray-50 space-y-5">
                        {orderLoading && <p>Loading order details...</p>}
                        {!orderLoading && orderData && (
                          <>
                            {/* Customer Details */}
                            <div>
                              <h4 className="font-medium mb-2">Customer Details</h4>
                              <p className="text-sm font-medium">
                                {orderData.customer?.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {orderData.customer?.phone}
                              </p>
                              <p className="text-sm text-gray-500">
                                {orderData.customer?.address}
                              </p>
                            </div>

                            {/* Order Items */}
                            <div>
                              <h4 className="font-medium mb-2">Order Items</h4>
                              {orderData.items?.map((item, index) => (
                                <div
                                  key={index}
                                  className="text-sm flex justify-between mb-1"
                                >
                                  <span>
                                    {item.name} x{item.quantity}
                                  </span>
                                  <span>₹{item.itemTotal}</span>
                                </div>
                              ))}
                            </div>

                            {/* Bill Summary */}
                            <div>
                              <h4 className="font-medium mb-2">Bill Summary</h4>
                              <div className="text-sm flex justify-between">
                                <span>Subtotal</span>
                                <span>₹{Number(orderData.billSummary?.subtotal || 0).toFixed(2)}</span>
                              </div>
                              <div className="text-sm flex justify-between">
                                <span>+ Delivery Charge</span>
                                <span>₹{Number(orderData.billSummary?.deliveryCharge || 0).toFixed(2)}</span>
                              </div>
                              <div className="text-sm flex justify-between text-green-600">
                                <span>- Discount</span>
                                <span>₹{Number(orderData.billSummary?.totalDiscount || 0).toFixed(2)}</span>
                              </div>
                              <hr className="my-2" />
                              <div className="text-sm flex justify-between text-green-600">
                                <span>Paid</span>
                                <span>₹{Number(orderData.billSummary?.totalPaid || 0).toFixed(2)}</span>
                              </div>
                              <div className="text-sm flex justify-between text-red-600 font-medium">
                                <span>Remaining to Collect</span>
                                <span>
                                  ₹{Number(orderData.billSummary?.remainingToCollect || 0).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-xl shadow-sm border p-8 text-center text-gray-500">
                No orders found
              </div>
            )}
          </div>

          {/* Pagination */}
          {paginationMeta.total > 0 && (
            <div className="flex justify-between items-center mt-6 px-4 py-4 bg-white rounded-xl shadow-sm border">
              <p className="text-sm text-gray-600">
                Showing {startItem} to {endItem} of {paginationMeta.total} orders
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!paginationMeta.has_prev_page}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1
                    ${!paginationMeta.has_prev_page
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-[#1E264F] text-white hover:bg-opacity-90"
                    }`}
                >
                  <ChevronLeft size={16} /> Prev
                </button>
                {renderPaginationButtons()}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!paginationMeta.has_next_page}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1
                    ${!paginationMeta.has_next_page
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-[#1E264F] text-white hover:bg-opacity-90"
                    }`}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Payment Request Tab (if needed) */}
      {activeTab === "paymentRequest" && (
        <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-3 text-left">User</th>
                <th className="px-6 py-3 text-left">Amount</th>
                <th className="px-6 py-3 text-left">Description</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {withdrawalLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-6">
                    Loading...
                  </td>
                </tr>
              ) : (
                withdrawals.map((item) => (
                  <tr key={item._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {item.deliveryBoyID ? (
                        <div>
                          <p className="font-medium">{item.deliveryBoyID.email}</p>
                          <p className="text-xs text-gray-500">{item.deliveryBoyID.contactNo}</p>
                        </div>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-green-600 font-semibold">₹{item.amount}</td>
                    <td className="px-6 py-4 max-w-[250px] break-words">{item.description}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs rounded-full font-semibold
                        ${item.status === "approved" ? "bg-green-100 text-green-600" :
                          item.status === "rejected" ? "bg-red-100 text-red-600" :
                            "bg-yellow-100 text-yellow-600"}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.status === "pending" ? (
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleWithdrawalAction(item._id, "approved")}
                            className="bg-green-500 hover:bg-green-600 text-white w-6 h-6 rounded-full">✔</button>
                          <button onClick={() => handleWithdrawalAction(item._id, "rejected")}
                            className="bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-full">✖</button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">No Action</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}