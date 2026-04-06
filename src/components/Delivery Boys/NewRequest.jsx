import {
  FaEye,
} from "react-icons/fa";
import { Search, SlidersHorizontal, Download } from "lucide-react";
import { SiTicktick } from "react-icons/si";
import { RxCrossCircled } from "react-icons/rx";
import { MdDeliveryDining } from "react-icons/md";
import { useLocation } from "react-router-dom";
import { useGetAllDeliveryBoysQuery, useUpdateDeliveryStatusMutation } from "../../Redux/apis/deliveryApi";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function UsersTable() {

  const location = useLocation();
  const navigate = useNavigate();
  const [vehicleFilter, setVehicleFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const selectAllRef = useRef(null);
  
  let status = "pending";

  if (location.pathname.includes("approved")) status = "approved";
  if (location.pathname.includes("rejected")) status = "rejected";

  const { data, isLoading, isError } =
    useGetAllDeliveryBoysQuery({ status });

  const [updateDeliveryStatus, { isLoading: statusLoading }] =
    useUpdateDeliveryStatusMutation();

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateDeliveryStatus({
        id,
        status: newStatus,
      }).unwrap();

      console.log("Status updated successfully");
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const users = data?.data || [];
  const uniqueVehicleTypes = [
    "All",
    ...new Set(users.map((u) => u.VehicleType).filter(Boolean)),
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 6;

  // Pagination Logic
  const vehicleFilteredUsers =
    vehicleFilter === "All"
      ? users
      : users.filter((u) => u.VehicleType === vehicleFilter);
  const filteredUsers = vehicleFilteredUsers.filter((u) =>
    JSON.stringify(u || {}).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / ordersPerPage);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;

  const currentOrders = filteredUsers.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  // Reset to page 1 when orders change
  useEffect(() => {
    setCurrentPage(1);
  }, [users.length, vehicleFilter, searchTerm]);

  useEffect(() => {
    setSelectedUserIds([]);
  }, [users.length, vehicleFilter, searchTerm]);

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
    if (!sourceRows.length) {
      return [];
    }
    return sourceRows.map((u) => ({
      Name: u.Name || "N/A",
      Date: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-",
      Contact: u.contactNo || "-",
      Email: u.email || "-",
      "Vehicle Type": u.VehicleType || "N/A",
      "Vehicle No": u.VehicleNumber || "N/A",
      Status: status
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
    downloadBlob(csv, `delivery_${status}_export.csv`, "text/csv;charset=utf-8;");
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
    const html = getExportHtml(`Delivery Boys (${status}) Export`);
    if (!html) {
      setIsExportMenuOpen(false);
      return;
    }
    downloadBlob(html, `delivery_${status}_export.doc`, "application/msword");
    setIsExportMenuOpen(false);
  };

  const exportToPdf = () => {
    const html = getExportHtml(`Delivery Boys (${status}) Export`);
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
          <title>Delivery Boys (${status}) Export</title>
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
        <div className="w-full lg:w-[40%] md:w-[50%]">
          <div className="flex items-center gap-2 bg-white border-2 rounded-2xl p-3">
            <Search size={20} />
            <input
              className="w-full bg-transparent outline-none"
              type="text"
              placeholder="Search By User Name and Phone no"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <label className="inline-flex items-center gap-2 border border-brand-cyan rounded-xl px-3 py-3 text-sm font-semibold text-brand-navy bg-white whitespace-nowrap">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={(e) => toggleSelectAll(e.target.checked)}
            />
            Select All
          </label>
          <button className="bg-brand-cyan px-3 py-3 rounded-xl">
            <SlidersHorizontal size={20} />
          </button>

          <select
            value={vehicleFilter}
            onChange={(e) => {
              setVehicleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="border px-4 py-3 rounded-2xl bg-white font-medium"
          >
            {uniqueVehicleTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>

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
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Contact</th>
              <th className="p-3 text-left">Vehicle Type</th>
              <th className="p-3 text-left">Vehicle No</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {/* ✅ Loading Skeleton */}
            {isLoading &&
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-t animate-pulse">
                  <td className="p-3"><div className="h-4 w-4 bg-gray-200 rounded"></div></td>
                  <td className="p-3"><div className="h-4 w-24 bg-gray-200 rounded"></div></td>
                  <td className="p-3"><div className="h-4 w-20 bg-gray-200 rounded"></div></td>
                  <td className="p-3"><div className="h-4 w-32 bg-gray-200 rounded"></div></td>
                  <td className="p-3"><div className="h-4 w-20 bg-gray-200 rounded"></div></td>
                  <td className="p-3"><div className="h-4 w-20 bg-gray-200 rounded"></div></td>
                  <td className="p-3"><div className="h-4 w-16 bg-gray-200 rounded"></div></td>
                </tr>
              ))}

            {/* ❌ Error */}
            {isError && (
              <tr>
                <td colSpan="7" className="text-center p-6 text-red-500 font-semibold">
                  Failed to load delivery boys.
                </td>
              </tr>
            )}

            {/* ✅ Data */}
            {!isLoading && !isError &&
              currentOrders.map((u) => (
                <tr key={u._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedUserIds.includes(u._id)}
                      onChange={() => toggleUserSelection(u._id)}
                    />
                  </td>

                  <td className="p-3 font-medium">
                    {u.Name || "N/A"}
                  </td>

                  <td className="p-3">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-blue-900 text-white flex items-center justify-center text-sm">
                        {u.Name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{u.contactNo}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <MdDeliveryDining size={20} />
                      {u.VehicleType || "N/A"}
                    </div>
                  </td>

                  <td className="p-3">
                    {u.VehicleNumber || "N/A"}
                  </td>

                  <td className="p-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">

                      {/* ✅ Show Approve/Reject ONLY for pending */}
                      {status === "pending" && (
                        <>
                          <button
                            className="text-green-600"
                            disabled={statusLoading}
                            onClick={() => handleStatusUpdate(u._id, "approved")}
                          >
                            <SiTicktick size={18} />
                          </button>

                          <button
                            className="text-red-600"
                            disabled={statusLoading}
                            onClick={() => handleStatusUpdate(u._id, "rejected")}
                          >
                            <RxCrossCircled size={18} />
                          </button>
                        </>
                      )}

                      {/* View always visible */}
                      <button className="text-blue-900" onClick={() => navigate(`/delivery/DeliveryBoyDetail/${u._id}`)}>
                        <FaEye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>


        {/* Pagination */}
        {filteredUsers.length > ordersPerPage && (
          <div className="flex justify-between items-center mt-6 px-4 py-4 bg-white border-t">

            {/* Showing Info */}
            <p className="text-sm text-gray-600">
              Showing {indexOfFirstOrder + 1} to{" "}
              {Math.min(indexOfLastOrder, filteredUsers.length)} of{" "}
              {filteredUsers.length} orders
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
                        : "bg-gray-100 text-[#1E264F] hover:bg-gray-200"
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
