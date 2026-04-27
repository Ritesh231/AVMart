import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Download, Search } from 'lucide-react'
import { FaTrash, FaEye } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";
import { SiTicktick } from "react-icons/si";
import { useGetallusersQuery, useUpdateStatusMutation, useDeleteUserMutation } from "../Redux/apis/userApi"
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const tabs = [
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' }
];

export default function UsersTable() {
  const [activeTab, setActiveTab] = useState('pending');
  const [shopTypeFilter, setShopTypeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const selectAllRef = useRef(null);
  const [orderFilter, setOrderFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  const queryParams = {
    page: currentPage,
    limit: usersPerPage,
    status: activeTab,
  };

  const { data, isLoading, isError, refetch } = useGetallusersQuery(queryParams);

  const users = data?.data || [];
  const paginationMeta = data?.meta?.pagination || {};

  const navigate = useNavigate();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateStatusMutation();
  const [deleteStatus, { isLoading: isDeleting }] = useDeleteUserMutation();

  // Apply client-side filtering for shopType and search
  const filteredUsers = users.filter((user) => {
    // Shop Type Filter
    const matchesShopType =
      shopTypeFilter === "all" || user.shopType === shopTypeFilter;

    // Search Filter
    const matchesSearch =
      searchTerm === "" ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.contact?.includes(searchTerm) ||
      user.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    // ✅ Order Filter Logic
    let matchesOrderFilter = true;

    if (orderFilter === "recent") {
      if (!user.latestOrder?.createdAt) return false;

      const orderDate = new Date(user.latestOrder.createdAt);
      const now = new Date();

      const diffDays = (now - orderDate) / (1000 * 60 * 60 * 24);

      matchesOrderFilter = diffDays <= 7; // last 7 days
    }

    if (orderFilter === "no_orders") {
      matchesOrderFilter = user.ordersCount === 0 || !user.ordersCount;
    }

    if (orderFilter === "high_orders") {
      matchesOrderFilter = user.ordersCount >= 5;
    }

    return matchesShopType && matchesSearch && matchesOrderFilter;
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm, shopTypeFilter]);

  // Refetch data when page or activeTab changes
  useEffect(() => {
    refetch();
  }, [currentPage, activeTab, refetch]);

  useEffect(() => {
    setSelectedUserIds([]);
  }, [activeTab, searchTerm, shopTypeFilter, currentPage]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      toast.success("Status updated successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to Update", error);
    }
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;
    try {
      await deleteStatus(id).unwrap();
      toast.success("User deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete User", error);
    }
  }

  const selectedFilteredCount = filteredUsers.filter((u) =>
    selectedUserIds.includes(u._id)
  ).length;
  const isAllSelected =
    filteredUsers.length > 0 && selectedFilteredCount === filteredUsers.length;
  const isSomeSelected = selectedFilteredCount > 0 && !isAllSelected;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = isSomeSelected;
    }
  }, [isSomeSelected]);

  const toggleUserSelection = (id) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelectedUserIds(filteredUsers.map((u) => u._id));
      return;
    }
    setSelectedUserIds([]);
  };

  const getRowsForExport = () => {
    const selectedRows = filteredUsers.filter((u) => selectedUserIds.includes(u._id));
    const sourceRows = selectedRows.length > 0 ? selectedRows : filteredUsers;

    if (sourceRows.length === 0) {
      toast.info("No users available to export");
      return [];
    }

    return sourceRows.map((u) => ({
      "Shop Name": u.shopName || "-",
      "Owner Name": u.name || "-",
      Location: u.shopAddress || "-",
      Contact: u.contact || "-",
      Email: u.email || "-",
      "Shop Type": u.shopType || "-",
      Status: u.status || "-",
      Joined: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"
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

    downloadBlob(csv, "users_export.csv", "text/csv;charset=utf-8;");
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
          <h2>Users Export</h2>
          <table border="1" cellspacing="0" cellpadding="6">
            <thead><tr>${tableHead}</tr></thead>
            <tbody>${tableRows}</tbody>
          </table>
        </body>
      </html>`;

    downloadBlob(html, "users_export.doc", "application/msword");
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
          <title>Users Export</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { margin-bottom: 12px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background: #f2f2f2; }
          </style>
        </head>
        <body>
          <h2>Users Export</h2>
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

  // Calculate pagination display info using API meta data
  const startIndex = paginationMeta.total > 0 ? (paginationMeta.page - 1) * paginationMeta.per_page + 1 : 0;
  const endIndex = Math.min(
    paginationMeta.page * paginationMeta.per_page,
    paginationMeta.total
  );

  if (isError) {
    return <p>No User Found</p>;
  }

  // Debug: Log filtered users to check if kirana users exist
  console.log("All users:", users);
  console.log("Filtered users by shopType:", filteredUsers);
  console.log("Selected shop type:", shopTypeFilter);

  return (
    <>
      {/* Tabs */}
      <section className="flex flex-col sm:flex-row bg-[#1E264F] p-2 my-6 rounded-xl md:w-fit w-full shadow-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-lg flex items-center justify-center sm:justify-start
        gap-3 font-semibold transition-all duration-300
        ${activeTab === tab.id
                ? "bg-gradient-to-r from-[#FD610D] to-[#FF8800]  text-white shadow-sm"
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
              value={searchTerm}
              type="text"
              placeholder='Search By User Name and Phone no'
            />
          </div>
        </div>

        {/* Export Button */}
        <div className='flex justify-evenly gap-2 items-center'>
          <div className="flex items-center gap-3">

            {/* Shop Type */}
            <div className="flex items-center border border-brand-cyan px-3 py-3 rounded-2xl bg-white">
              <select
                value={shopTypeFilter}
                onChange={(e) => setShopTypeFilter(e.target.value)}
                className="bg-transparent font-semibold text-brand-navy outline-none"
              >
                <option value="all">All Shop Types</option>
                <option value="medical">Medical</option>
                <option value="general">General</option>
                <option value="kirana">Kirana</option>
                <option value="cosmetics">Cosmetics</option>
              </select>
            </div>

            {/* Order Filter */}
            <div className="flex items-center border border-brand-cyan px-3 py-3 rounded-2xl bg-white">
              <select
                value={orderFilter}
                onChange={(e) => setOrderFilter(e.target.value)}
                className="bg-transparent font-semibold text-brand-navy outline-none"
              >
                <option value="all">All Orders</option>
                <option value="recent">Recent Orders</option>
                <option value="no_orders">No Orders</option>
                <option value="high_orders">High Orders (5+)</option>
              </select>
            </div>

          </div>

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
              Array.from({ length: usersPerPage }).map((_, i) => (
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
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-10 text-gray-500 font-medium">
                  No users available with selected filters.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedUserIds.includes(u._id)}
                      onChange={() => toggleUserSelection(u._id)}
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
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
                          onClick={() => handleStatusChange(u._id, "approved")}
                        />
                        <RxCrossCircled
                          size={20}
                          className="text-red-500 cursor-pointer"
                          onClick={() => handleStatusChange(u._id, "rejected")}
                        />
                        <FaEye
                          className="text-blue-900 cursor-pointer"
                          onClick={() => navigate(`/order/details/${u._id}`)}
                        />
                      </div>
                    )}

                    {u.status === "approved" && (
                      <div className="flex items-center gap-3">
                        <span className="text-green-700 text-xs bg-green-100 px-3 py-1 rounded-full">
                          Approved
                        </span>
                        <FaEye
                          className="text-blue-900 cursor-pointer"
                          onClick={() => navigate(`/order/details/${u._id}`)}
                        />
                        <FaTrash className="text-red-600 cursor-pointer" onClick={() => handleDelete(u._id)} />
                      </div>
                    )}

                    {u.status === "rejected" && (
                      <div className="flex items-center gap-3">
                        <span className="text-red-700 text-xs bg-red-100 px-3 py-1 rounded-full">
                          Rejected
                        </span>
                        <FaEye
                          className="text-blue-900 cursor-pointer"
                          onClick={() => navigate(`/order/details/${u._id}`)}
                        />
                        <FaTrash className="text-red-600 cursor-pointer" onClick={() => handleDelete(u._id)} />
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination using API meta data */}
        {paginationMeta.total_pages > 1 && (
          <div className="flex justify-between items-center mt-6 px-4 py-4 bg-white rounded-xl border">
            {/* Showing Info */}
            <p className="text-sm text-gray-600">
              Showing {startIndex} to {endIndex} of {paginationMeta.total} users
            </p>

            {/* Pagination Buttons */}
            <div className="flex items-center gap-2">
              {/* Previous */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={!paginationMeta.has_prev_page}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all
          ${!paginationMeta.has_prev_page
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#1E264F] text-white hover:bg-opacity-90"
                  }`}
              >
                Prev
              </button>

              {/* Page Numbers */}
              {[...Array(paginationMeta.total_pages)].map((_, index) => {
                const page = index + 1;
                if (
                  page === 1 ||
                  page === paginationMeta.total_pages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all
                ${currentPage === page
                          ? "bg-gradient-to-r from-[#FD610D] to-[#FF8800] text-white shadow-md"
                          : "bg-gray-100 text-[#1E264F] hover:bg-gray-200"
                        }`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="px-2">...</span>;
                }
                return null;
              })}

              {/* Next */}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, paginationMeta.total_pages))
                }
                disabled={!paginationMeta.has_next_page}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all
          ${!paginationMeta.has_next_page
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