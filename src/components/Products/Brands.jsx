import React, { useEffect, useRef, useState } from "react";
import { FiSearch, FiDownload, FiEdit, FiTrash2 } from "react-icons/fi";
import { useGetallBrandsQuery, useDeleteBrandMutation } from "../../Redux/apis/productsApi";
import toast from "react-hot-toast";
import EditBrandModal from "./EditBrandModal";

export default function BrandsSection() {
  const { data, isLoading, isError } = useGetallBrandsQuery();
  const brands = data?.data || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrandIds, setSelectedBrandIds] = useState([]);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const selectAllRef = useRef(null);

  const filteredBrands = brands.filter((u) => {
    const search = searchTerm.toLowerCase();
    return u.name?.toLowerCase().includes(search);
  });

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 12;

  // Pagination Logic
  const totalPages = Math.ceil(filteredBrands.length / ordersPerPage);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;

  const currentOrders = filteredBrands.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  // Reset to page 1 when orders change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredBrands.length]);

  useEffect(() => {
    setSelectedBrandIds([]);
  }, [filteredBrands.length, searchTerm]);

  const [deleteBrand, { isLoading: isDeleting }] = useDeleteBrandMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const selectedFilteredCount = filteredBrands.filter((brand) =>
    selectedBrandIds.includes(brand._id)
  ).length;
  const isAllSelected =
    filteredBrands.length > 0 && selectedFilteredCount === filteredBrands.length;
  const isSomeSelected = selectedFilteredCount > 0 && !isAllSelected;

  // useEffect(() => {
  //   if (selectAllRef.current) {
  //     selectAllRef.current.indeterminate = isSomeSelected;
  //   }
  // }, [isSomeSelected]);

  const openEditModal = (brand) => {
    setSelectedBrand(brand);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setSelectedBrand(null);
  };

  const toggleBrandSelection = (id) => {
    setSelectedBrandIds((prev) =>
      prev.includes(id) ? prev.filter((brandId) => brandId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelectedBrandIds(filteredBrands.map((brand) => brand._id));
      return;
    }
    setSelectedBrandIds([]);
  };

  const getRowsForExport = () => {
    const selectedRows = filteredBrands.filter((brand) =>
      selectedBrandIds.includes(brand._id)
    );
    const sourceRows = selectedRows.length ? selectedRows : filteredBrands;

    if (!sourceRows.length) {
      return [];
    }

    return sourceRows.map((brand) => ({
      "Brand ID": brand._id?.slice(-5) || "-",
      "Brand Name": brand.name || "-"
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

    downloadBlob(csv, "brands_export.csv", "text/csv;charset=utf-8;");
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
    const html = getExportHtml("Brands Export");
    if (!html) {
      setIsExportMenuOpen(false);
      return;
    }
    downloadBlob(html, "brands_export.doc", "application/msword");
    setIsExportMenuOpen(false);
  };

  const exportToPdf = () => {
    const html = getExportHtml("Brands Export");
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
          <title>Brands Export</title>
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

  const ShimmerCard = () => (
    <div className="w-40 h-36 bg-gray-200 animate-pulse rounded-xl p-4 flex flex-col items-center gap-3">
      <div className="w-20 h-6 bg-gray-300 rounded"></div>
      <div className="flex gap-2 mt-4">
        <div className="w-8 h-8 bg-gray-300 rounded-md"></div>
        <div className="w-8 h-8 bg-gray-300 rounded-md"></div>
      </div>
    </div>
  );

  if (isError) return <p>Error loading brands</p>;

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Brand?"
    );

    if (!confirmDelete) return;
    try {
      await deleteBrand(id).unwrap();
      toast.success("Category Deleted Successfully");
      refetch();
    } catch (err) {
      toast.error("Error to delete Category", err);
    }
  }

  return (
    <div className="p-6 bg-[#F8FAFC] rounded-xl border border-[#0F172A]/20 ">

      {/* Search + Export */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">

        {/* Search */}
        <div className="relative w-full sm:max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search By Brand Name"
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-[#0F172A]/20  text-sm 
      focus:outline-none focus:ring-2 focus:ring-teal-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Right Controls */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">

          <label className="flex items-center justify-center sm:justify-start gap-2 
    border border-[#0F172A]/20  rounded-lg px-3 py-2 text-sm font-medium 
    bg-white text-[#1A2550] w-full sm:w-auto">
            <input
              ref={selectAllRef}
              type="checkbox"
              checked={isAllSelected}
              onChange={(e) => toggleSelectAll(e.target.checked)}
            />
            Select All
          </label>

          <div className="relative w-full sm:w-auto">
            <button
              className="w-full sm:w-auto flex items-center justify-center gap-2 
        bg-[#1A2550] text-white px-4 py-2 rounded-lg text-sm font-medium"
              onClick={() => setIsExportMenuOpen((prev) => !prev)}
            >
              <FiDownload size={14} />
              Export
            </button>

            {isExportMenuOpen && (
              <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-full sm:w-40 
        bg-white rounded-xl shadow-lg border z-20">
                <button onClick={exportToPdf} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                  PDF
                </button>
                <button onClick={exportToDoc} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                  DOC
                </button>
                <button onClick={exportToExcel} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                  Excel
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Brand Cards */}
      <div className="grid md:grid-cols-6 grid-cols-2 gap-10">

        {isLoading
          ? Array(12)
            .fill(0)
            .map((_, index) => <ShimmerCard key={index} />)
          : currentOrders.map((brand) => (
            <div
              key={brand._id}
              className="relative w-40 h-36 bg-brand-blue/50 rounded-xl p-4 flex flex-col items-center gap-3 border border-teal-100"
            >
              <input
                type="checkbox"
                className="absolute top-2 left-2"
                checked={selectedBrandIds.includes(brand._id)}
                onChange={() => toggleBrandSelection(brand._id)}
              />
              <div className="text-center">
                <h2 className="text-2xl font-black tracking-wide">
                  {brand.name}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(brand)}
                  className="p-2 rounded-md bg-indigo-50 text-indigo-600"
                >
                  <FiEdit size={14} />
                </button>

                <button
                  className="p-2 rounded-md bg-red-50 text-red-600"
                  onClick={() => handleDelete(brand._id)}
                  disabled={isDeleting}
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Separate Modal Component */}
      <EditBrandModal
        isOpen={isModalOpen}
        onClose={closeEditModal}
        brandData={selectedBrand}
      />


      {/* Pagination */}
      {filteredBrands.length > ordersPerPage && (
        <div className="flex justify-between items-center mt-6 px-4 py-4 bg-white border-t">

          {/* Showing Info */}
          <p className="text-sm text-gray-600">
            Showing {indexOfFirstOrder + 1} to{" "}
            {Math.min(indexOfLastOrder, filteredBrands.length)} of{" "}
            {filteredBrands.length} orders
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
                      ? "bg-gradient-to-r from-[#FD610D] to-[#FF8800] text-white shadow-md"
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
  );
}
