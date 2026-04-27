import { FaTrash } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { Download, Search, SlidersHorizontal } from 'lucide-react'
import { useGetallqueriesQuery, useMarkasContactedMutation, useDeleteQueryMutation } from "../../Redux/apis/queryApi";
import { useLocation } from "react-router-dom";

export default function UsersTable() {
  const { data, isLoading, isError } = useGetallqueriesQuery();
  const [markedContacted, { isLoading: isUpdating }] = useMarkasContactedMutation();
  const [markedDeleted, { isLoading: isDeleting }] = useDeleteQueryMutation();
  const [updatingId, setUpdatingId] = useState(null);
  const [dateFilter, setDateFilter] = useState("Last7Days");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQueryIds, setSelectedQueryIds] = useState([]);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const selectAllRef = useRef(null);

  const location = useLocation();
  let statusFilter = "Contacted";

  if (location.pathname.includes("all")) {
    statusFilter = "All";
  } else if (location.pathname.includes("pending")) {
    statusFilter = "Pending";
  }

  const allQueries = (data?.data || []).filter((q) => {
    if (statusFilter === "All") return true;
    return q.status === statusFilter;
  });

  const filteredByDate = allQueries.filter((q) => {
    if (!q.updatedAt) return false;

    const queryDate = new Date(q.updatedAt);
    const today = new Date();

    if (dateFilter === "Today") {
      return queryDate.toDateString() === today.toDateString();
    }

    if (dateFilter === "Yesterday") {
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      return queryDate.toDateString() === yesterday.toDateString();
    }

    if (dateFilter === "Last7Days") {
      const last7 = new Date();
      last7.setDate(today.getDate() - 7);
      return queryDate >= last7 && queryDate <= today;
    }

    if (dateFilter === "Custom" && fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999); // include full end day

      return queryDate >= start && queryDate <= end;
    }

    return true;
  });

  const filteredQueries = filteredByDate.filter((q) =>
    JSON.stringify(q || {}).toLowerCase().includes(searchTerm.toLowerCase())
  );

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
  const totalPages = Math.ceil(filteredQueries.length / queriesPerPage);

  const indexOfLastQuery = currentPage * queriesPerPage;
  const indexOfFirstQuery = indexOfLastQuery - queriesPerPage;

  const currentQueries = filteredQueries.slice(
    indexOfFirstQuery,
    indexOfLastQuery
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, filteredQueries.length, searchTerm, dateFilter, fromDate, toDate]);

  useEffect(() => {
    setSelectedQueryIds([]);
  }, [statusFilter, filteredQueries.length, searchTerm, dateFilter, fromDate, toDate]);

  const selectedFilteredCount = filteredQueries.filter((q) =>
    selectedQueryIds.includes(q._id)
  ).length;
  const isAllSelected =
    filteredQueries.length > 0 && selectedFilteredCount === filteredQueries.length;
  const isSomeSelected = selectedFilteredCount > 0 && !isAllSelected;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = isSomeSelected;
    }
  }, [isSomeSelected]);

  const toggleQuerySelection = (id) => {
    setSelectedQueryIds((prev) =>
      prev.includes(id) ? prev.filter((queryId) => queryId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelectedQueryIds(filteredQueries.map((q) => q._id));
      return;
    }
    setSelectedQueryIds([]);
  };

  const getRowsForExport = () => {
    const selectedRows = filteredQueries.filter((q) =>
      selectedQueryIds.includes(q._id)
    );
    const sourceRows = selectedRows.length > 0 ? selectedRows : filteredQueries;
    if (!sourceRows.length) {
      return [];
    }
    return sourceRows.map((q) => ({
      Name: q.name || "-",
      Email: q.email || "-",
      Contact: q.contactNo || "-",
      Message: q.message || "-",
      Status: q.status || "-",
      Date: q.updatedAt?.split("T")[0] || "-"
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
    downloadBlob(csv, `queries_${statusFilter.toLowerCase()}_export.csv`, "text/csv;charset=utf-8;");
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
          <thead><tr>${tableHead}</tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
      </body>
    </html>`;
  };

  const exportToDoc = () => {
    const html = getExportHtml(`${statusFilter} Queries Export`);
    if (!html) {
      setIsExportMenuOpen(false);
      return;
    }
    downloadBlob(html, `queries_${statusFilter.toLowerCase()}_export.doc`, "application/msword");
    setIsExportMenuOpen(false);
  };

  const exportToPdf = () => {
    const html = getExportHtml(`${statusFilter} Queries Export`);
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
        <title>${statusFilter} Queries Export</title>
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Export Button */}
        <div className='flex justify-evenly gap-2 items-center'>
          {/* <button className='bg-brand-cyan  font-semibold text-brand-navy px-3 py-3 rounded-xl flex justify-center gap-2 items-center'>
                        <SlidersHorizontal size={20} />
                    </button> */}
          <div className="flex items-center gap-3">

            {/* Date Filter Dropdown */}
            <select
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
                setFromDate("");
                setToDate("");
              }}
              className="border px-4 py-3 rounded-2xl bg-white font-medium"
            >
              <option value="Today">Today</option>
              <option value="Yesterday">Yesterday</option>
              <option value="Last7Days">Last 7 Days</option>
              <option value="Custom">Custom Range</option>
            </select>

            {/* Custom Date Range */}
            {dateFilter === "Custom" && (
              <>
                <input
                  type="date"
                  value={fromDate}
                  max={toDate || undefined}
                  onChange={(e) => {
                    const selected = e.target.value;
                    if (toDate && selected > toDate) {
                      setToDate("");
                    }
                    setFromDate(selected);
                  }}
                  className="border px-3 py-3 rounded-xl"
                />

                <span>to</span>

                <input
                  type="date"
                  value={toDate}
                  min={fromDate || undefined}
                  onChange={(e) => {
                    const selected = e.target.value;
                    if (fromDate && selected < fromDate) return;
                    setToDate(selected);
                  }}
                  className="border px-3 py-3 rounded-xl"
                />
              </>
            )}
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
                    <input
                      type="checkbox"
                      checked={selectedQueryIds.includes(u._id)}
                      onChange={() => toggleQuerySelection(u._id)}
                    />
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
        {filteredQueries.length > queriesPerPage && (
          <div className="flex justify-between items-center mt-6 px-4 py-4 border-t bg-white">

            {/* Showing Info */}
            <p className="text-sm text-gray-600">
              Showing{" "}
              {filteredQueries.length === 0 ? 0 : indexOfFirstQuery + 1} to{" "}
              {Math.min(indexOfLastQuery, filteredQueries.length)} of{" "}
              {filteredQueries.length} queries
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
                        ? "bg-gradient-to-r from-[#FD610D] to-[#FF8800] text-white shadow-md"
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
