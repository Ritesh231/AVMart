import { FaSearch, FaTrash, FaEye, FaEdit } from "react-icons/fa";
import { ArrowDown, BadgeIndianRupee, Blocks, ChartColumnIncreasing, ChevronDown, CircleDashed, CreditCard, Download, FileText, HandCoins, Search, SlidersHorizontal, Upload, Wallet, WalletMinimal } from 'lucide-react'
import { IoFilter } from "react-icons/io5";
import { BsWallet2 } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import ExcelJS from "exceljs";
import { useGetallSubcategoriesQuery, useDeleteSubcategoryMutation } from "../../Redux/apis/productsApi"
import EditSubcategoryModal from "../../components/Products/EditSubcategoryModal";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

export default function UsersTable() {
  const { data, isLoading, isError } = useGetallSubcategoriesQuery();
  const [deleteSubcategory, { isLoading: isDeleting }] = useDeleteSubcategoryMutation();
  const subcategory = data?.data || [];
  const uniqueCategories = [
    "All",
    ...new Set(subcategory.map((item) => item.categoryName).filter(Boolean)),
  ];

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedSubcategoryIds, setSelectedSubcategoryIds] = useState([]);
  const selectAllRef = useRef(null);
  const exportMenuRef = useRef(null);

  const filteredSubcategories = subcategory.filter((u) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      u.name?.toLowerCase().includes(search) ||
      u.categoryName?.toLowerCase().includes(search) ||
      u._id?.toLowerCase().includes(search) ||
      u.productCount?.toString().includes(search);

    const matchesCategory =
      selectedCategory === "All" || u.categoryName === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 6;

  // Pagination Logic
  const totalPages = Math.ceil(filteredSubcategories.length / ordersPerPage);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;

  const currentOrders = filteredSubcategories.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        exportMenuRef.current &&
        !exportMenuRef.current.contains(event.target)
      ) {
        setIsExportMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredSubcategories.length]);

  useEffect(() => {
    setSelectedSubcategoryIds([]);
  }, [filteredSubcategories.length, searchTerm, selectedCategory]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const selectedFilteredCount = filteredSubcategories.filter((item) =>
    selectedSubcategoryIds.includes(item._id)
  ).length;
  const isAllSelected =
    filteredSubcategories.length > 0 &&
    selectedFilteredCount === filteredSubcategories.length;
  const isSomeSelected = selectedFilteredCount > 0 && !isAllSelected;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = isSomeSelected;
    }
  }, [isSomeSelected]);


  if (isError) {
    return <p className="text-red-500">Failed to load Subcategories</p>;
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) return;
    try {
      await deleteSubcategory(id).unwrap();
      toast.success("Subcategory Deleted Successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete subcategory");
    }
  }

  // Raw rows (not stringified) used by every export type
  const getExportRows = () => {
    const selectedRows = filteredSubcategories.filter((item) =>
      selectedSubcategoryIds.includes(item._id)
    );
    return selectedRows.length ? selectedRows : filteredSubcategories;
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

  const toSafeHtml = (value) =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  // Fetches an image and converts it to a base64 data URI so it can be
  // embedded directly into Excel/DOC/PDF instead of exporting as a link.
  // NOTE: requires the image host to allow cross-origin fetches (CORS).
  const imageUrlToBase64 = async (url) => {
    if (!url) return null;
    try {
      const response = await fetch(url, { mode: "cors" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.warn("Could not embed image (likely a CORS issue):", url, err);
      return null;
    }
  };

  // ---------- EXCEL (.xlsx with real embedded images) ----------
  const exportToExcel = async () => {
    const rows = getExportRows();
    if (!rows.length) {
      setIsExportMenuOpen(false);
      return;
    }
    setIsExportMenuOpen(false);
    setIsExporting(true);

    try {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Subcategories");

      sheet.columns = [
        { header: "Sr No", key: "srNo", width: 10 },
        { header: "Subcategory ID", key: "id", width: 18 },
        { header: "Subcategory Name", key: "name", width: 28 },
        { header: "Image", key: "image", width: 14 },
        { header: "Category Name", key: "category", width: 22 },
        { header: "Products", key: "products", width: 12 },
      ];
      sheet.getRow(1).font = { bold: true };
      sheet.getRow(1).height = 20;

      for (let i = 0; i < rows.length; i++) {
        const item = rows[i];
        sheet.addRow({
          srNo: i + 1,
          id: item._id?.slice(-5) || "-",
          name: item.name || "-",
          image: "",
          category: item.categoryName || "-",
          products: item.productCount ?? 0,
        });

        const rowNumber = i + 2; // header occupies row 1
        sheet.getRow(rowNumber).height = 60;

        if (item.image) {
          const base64 = await imageUrlToBase64(item.image);
          if (base64) {
            const match = base64.match(/^data:image\/(png|jpe?g|gif);/i);
            let extension = match ? match[1].toLowerCase() : "png";
            if (extension === "jpg") extension = "jpeg";
            if (!["png", "jpeg", "gif"].includes(extension)) extension = "png";

            const imageId = workbook.addImage({ base64, extension });
            sheet.addImage(imageId, {
              tl: { col: 3, row: rowNumber - 1 },
              ext: { width: 50, height: 50 },
            });
          }
        }
      }

      const buffer = await workbook.xlsx.writeBuffer();
      downloadBlob(
        buffer,
        "subcategories_export.xlsx",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to export Excel file");
    } finally {
      setIsExporting(false);
    }
  };

  // ---------- Shared HTML builder (used by DOC + PDF) ----------
  const getExportHtml = async (title) => {
    const rows = getExportRows();
    if (!rows.length) return "";

    const headers = ["Sr No", "Subcategory ID", "Subcategory Name", "Image", "Category Name", "Products"];
    const tableHead = headers.map((h) => `<th>${toSafeHtml(h)}</th>`).join("");

    const bodyRows = await Promise.all(
      rows.map(async (item, index) => {
        const base64 = item.image ? await imageUrlToBase64(item.image) : null;
        const imageCell = base64
          ? `<img src="${base64}" width="50" height="50" style="object-fit:cover;border-radius:6px;" />`
          : "-";

        return `<tr>
         <td>${index + 1}</td>
          <td>${toSafeHtml(item._id?.slice(-5) || "-")}</td>
          <td>${toSafeHtml(item.name || "-")}</td>
          <td>${imageCell}</td>
          <td>${toSafeHtml(item.categoryName || "-")}</td>
          <td>${toSafeHtml(item.productCount ?? 0)}</td>
        </tr>`;
      })
    );

    return `
      <html>
        <head><meta charset="utf-8" /></head>
        <body>
          <h2>${toSafeHtml(title)}</h2>
          <table border="1" cellspacing="0" cellpadding="6">
            <thead><tr>${tableHead}</tr></thead>
            <tbody>${bodyRows.join("")}</tbody>
          </table>
        </body>
      </html>`;
  };

  const exportToDoc = async () => {
    setIsExportMenuOpen(false);
    setIsExporting(true);
    try {
      const html = await getExportHtml("Subcategories Export");
      if (!html) return;
      downloadBlob(html, "subcategories_export.doc", "application/msword");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export DOC file");
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPdf = async () => {
    setIsExportMenuOpen(false);
    setIsExporting(true);
    try {
      const html = await getExportHtml("Subcategories Export");
      if (!html) return;

      const printWindow = window.open("", "_blank");
      if (!printWindow) return;

      printWindow.document.write(`
        <html>
          <head>
            <title>Subcategories Export</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h2 { margin-bottom: 12px; }
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background: #f2f2f2; }
              img { display: block; }
            </style>
          </head>
          <body>
            ${html.match(/<body>([\s\S]*)<\/body>/)?.[1] || ""}
          </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.focus();
      // Give the images time to load from base64 before triggering print
      printWindow.onload = () => {
        printWindow.print();
      };
      setTimeout(() => printWindow.print(), 300);
    } catch (err) {
      console.error(err);
      toast.error("Failed to export PDF file");
    } finally {
      setIsExporting(false);
    }
  };

  const toggleSubcategorySelection = (id) => {
    setSelectedSubcategoryIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelectedSubcategoryIds(filteredSubcategories.map((item) => item._id));
      return;
    }
    setSelectedSubcategoryIds([]);
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
              placeholder='Search By Subcategory name and Subcategory id'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Export Button */}
        <div className='flex justify-evenly gap-2 items-center'>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none border-brand-cyan border-[1px] font-semibold text-brand-navy px-4 py-3 pr-10 rounded-2xl focus:outline-none bg-white cursor-pointer"
            >
              {uniqueCategories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <ChevronDown
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-brand-navy"
            />
          </div>
          <div ref={exportMenuRef} className="relative">
            <button
              className='bg-brand-navy px-6 py-3 rounded-2xl flex justify-center gap-2 items-center text-white font-bold hover:bg-opacity-90 transition-all disabled:opacity-60'
              onClick={() => setIsExportMenuOpen((prev) => !prev)}
              disabled={isExporting}
            >
              <Download size={20} /> {isExporting ? "Exporting..." : "Export"}
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
              <th className="w-12 p-3 text-center align-middle">
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                />
              </th>
              <th className="p-3 text-left">Subcategory ID</th>
              <th className="p-3 text-left">Subcategory Name</th>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Category Name</th>
              <th className="p-3 text-left">Products</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-t">
                  <td className="p-3">
                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </td>

                  <td className="p-3">
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </td>

                  <td className="p-3">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </td>

                  <td className="p-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-md animate-pulse"></div>
                  </td>

                  <td className="p-3">
                    <div className="h-6 w-24 bg-gray-200 rounded-xl animate-pulse"></div>
                  </td>

                  <td className="p-6">
                    <div className="h-4 w-10 bg-gray-200 rounded animate-pulse"></div>
                  </td>

                  <td className="p-3">
                    <div className="flex gap-2">
                      <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              currentOrders.map((u) => (
                <tr key={u._id} className="border-t hover:bg-gray-50 ">
                  <td className="w-12 p-3 text-center align-middle">
                    <input
                      type="checkbox"
                      checked={selectedSubcategoryIds.includes(u._id)}
                      onChange={() => toggleSubcategorySelection(u._id)}
                    />
                  </td>

                  <td className="p-3 font-medium">{u._id.slice(-5)}</td>
                  <td className="p-3 font-medium">{u.name}</td>

                  <td className="p-3">
                    <img
                      src={u.image}
                      alt="item"
                      className="w-8 h-8 rounded-md object-cover border"
                    />
                  </td>

                  <td className="p-3">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl
            bg-[#8A9FF324] border border-[#0B97ED] text-[#0B97ED] text-sm font-semibold">
                      {u.categoryName}
                    </span>
                  </td>

                  <td className="p-6">{u.productCount}</td>

                  <td className="p-3 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <button className="p-1 text-blue-600"
                        onClick={() => {
                          setSelectedSubcategory(u);
                          setIsModalOpen(true);
                        }}>
                        <FaEdit size={18} />
                      </button>

                      <button className="p-1 text-red-600" onClick={() => handleDelete(u._id)}>
                        <MdDelete size={18} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>

        <EditSubcategoryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          subcategoryData={selectedSubcategory}
        />

        {/* Pagination */}
        {filteredSubcategories.length > ordersPerPage && (
          <div className="flex justify-between items-center mt-6 px-4 py-4 bg-white border-t">

            {/* Showing Info */}
            <p className="text-sm text-gray-600 hidden md:block">
              Showing {indexOfFirstOrder + 1} to{" "}
              {Math.min(indexOfLastOrder, filteredSubcategories.length)} of{" "}
              {filteredSubcategories.length} orders
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
    </>
  );
}