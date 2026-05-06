import React, { useState, useRef, useEffect } from "react";
import { useGetInrateOutrateQuery } from "../../Redux/apis/reportApi";
import ReportTab from "./ReportTab";
import StatCard from "../StatCard";
import StatCardSkeleton from "../statcardskeleton";
import { IoCheckmarkDoneOutline, IoCashOutline, IoTrendingUpOutline, IoPieChartOutline } from "react-icons/io5";
import { Download, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";

function InrateOutrateReport() {
    const [filters, setFilters] = useState({ filterType: "monthly", fromDate: "", toDate: "" });
    const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
    const [page, setPage] = useState(1);

    // ✅ Selection state
    const [selectedIds, setSelectedIds] = useState([]);
    const selectAllRef = useRef(null);

    const ITEMS_PER_PAGE = 10;

    const { data, isLoading } = useGetInrateOutrateQuery(filters, { refetchOnMountOrArgChange: true });

    const records = data?.Data || [];
    const totalPages = Math.ceil(records.length / ITEMS_PER_PAGE);
    const paginatedRecords = [...records].reverse().slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const handleChange = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

    // ✅ Checkbox logic
    const isAllSelected =
        paginatedRecords.length > 0 &&
        paginatedRecords.every((item) => selectedIds.includes(item.variantId));

    const toggleSelectAll = (checked) => {
        const ids = paginatedRecords.map((item) => item.variantId);
        if (checked) {
            setSelectedIds((prev) => [...new Set([...prev, ...ids])]);
        } else {
            setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
        }
    };

    const toggleRowSelection = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    // ✅ Indeterminate state
    useEffect(() => {
        if (selectAllRef.current) {
            const some = paginatedRecords.some((item) => selectedIds.includes(item.variantId));
            selectAllRef.current.indeterminate = some && !isAllSelected;
        }
    }, [selectedIds, paginatedRecords, isAllSelected]);

    // ✅ Export filters by selectedIds
    const getRowsForExport = () => {
        let filtered = records;
        if (selectedIds.length > 0) {
            filtered = records.filter((item) => selectedIds.includes(item.variantId));
        }
        if (!filtered.length) {
            toast.info("No in/out rate report data available to export");
            return [];
        }
        return [...filtered].reverse().map((item, index) => ({
            "S.No": index + 1,
            "Product Name": item.productName || "-",
            "Quantity": item.quantity || 0,
            "InRate": `₹${Number(item.InRate || 0).toFixed(2)}`,
            "OutRate": `₹${Number(item.OutRate || 0).toFixed(2)}`,
            "Margin": `₹${Number(item.margin || 0).toFixed(2)}`,
            "Stock": item.stock || 0,
            "Date": item.date ? new Date(item.date).toLocaleDateString("en-IN") : "-",
        }));
    };

    const downloadBlob = (content, fileName, type) => {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const exportToExcel = () => {
        const rows = getRowsForExport();
        if (!rows.length) return;
        const headers = Object.keys(rows[0]);
        const csv = [
            headers.join(","),
            ...rows.map((row) => headers.map((h) => `"${String(row[h] ?? "").replace(/"/g, '""')}"`).join(",")),
        ].join("\n");
        downloadBlob(csv, `inrate-outrate-report-${new Date().toISOString().split("T")[0]}.csv`, "text/csv;charset=utf-8;");
        setIsExportMenuOpen(false);
    };

    const exportToDoc = () => {
        const rows = getRowsForExport();
        if (!rows.length) return;
        const headers = Object.keys(rows[0]);
        const tableHead = headers.map((h) => `<th>${h}</th>`).join("");
        const tableRows = rows.map((row) => `<tr>${headers.map((h) => `<td>${row[h] ?? "-"}</td>`).join("")}</tr>`).join("");
        const html = `<html><head><meta charset="utf-8"/><title>Inrate Outrate Report</title>
        <style>body{font-family:Arial,sans-serif;padding:20px}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #ccc;padding:8px;text-align:left}th{background:#f5f5f5}</style>
        </head><body><h2>Inrate Outrate Report</h2><table><thead><tr>${tableHead}</tr></thead><tbody>${tableRows}</tbody></table></body></html>`;
        downloadBlob(html, `inrate-outrate-report-${new Date().toISOString().split("T")[0]}.doc`, "application/msword");
        setIsExportMenuOpen(false);
    };

    const exportToPdf = () => {
        const rows = getRowsForExport();
        if (!rows.length) return;
        const headers = Object.keys(rows[0]);
        const tableHead = headers.map((h) => `<th>${h}</th>`).join("");
        const tableRows = rows.map((row) => `<tr>${headers.map((h) => `<td>${row[h] ?? "-"}</td>`).join("")}</tr>`).join("");
        const printWindow = window.open("", "_blank");
        if (!printWindow) return;
        printWindow.document.write(`<html><head><title>Inrate Outrate Report</title>
        <style>body{font-family:Arial,sans-serif;padding:20px}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f3f4f6}</style>
        </head><body><h2>Inrate Outrate Report</h2><table><thead><tr>${tableHead}</tr></thead><tbody>${tableRows}</tbody></table></body></html>`);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        setIsExportMenuOpen(false);
    };

    const Pagination = ({ currentPage, totalPages, onPageChange }) => {
        if (totalPages <= 1) return null;
        const getPageNumbers = () => {
            const pages = [];
            const maxVisible = 5;
            if (totalPages <= maxVisible) {
                for (let i = 1; i <= totalPages; i++) pages.push(i);
            } else {
                let start = Math.max(1, currentPage - 2);
                let end = Math.min(totalPages, start + maxVisible - 1);
                if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
                for (let i = start; i <= end; i++) pages.push(i);
            }
            return pages;
        };
        return (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 px-4 py-4 bg-white border-t">
                <p className="text-sm text-gray-600">Page {currentPage} of {totalPages}</p>
                <div className="flex items-center gap-2 flex-wrap justify-center">
                    <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#1E264F] text-white hover:bg-opacity-90"}`}>Prev</button>
                    {getPageNumbers().map((p) => (
                        <button key={p} onClick={() => onPageChange(p)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${currentPage === p ? "bg-gradient-to-r from-[#FD610D] to-[#FF8800] text-white" : "bg-gray-100 text-[#1E264F] hover:bg-gray-200"}`}>{p}</button>
                    ))}
                    <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#1E264F] text-white hover:bg-opacity-90"}`}>Next</button>
                </div>
            </div>
        );
    };

    const TableSkeleton = ({ rows = 7, columns = 7 }) => (
        <div className="overflow-x-auto animate-pulse">
            <table className="min-w-full">
                <thead className="bg-gray-100">
                    <tr>{Array.from({ length: columns }).map((_, i) => (
                        <th key={i} className="px-6 py-4"><div className="h-4 bg-gray-300 rounded w-24 mx-auto"></div></th>
                    ))}</tr>
                </thead>
                <tbody>{Array.from({ length: rows }).map((_, r) => (
                    <tr key={r} className="border-b">{Array.from({ length: columns }).map((_, c) => (
                        <td key={c} className="px-6 py-4"><div className="h-4 bg-gray-200 rounded"></div></td>
                    ))}</tr>
                ))}</tbody>
            </table>
        </div>
    );

    const stats = [
        { title: "Total Records", number: data?.totalRecords || 0, icon: <IoCheckmarkDoneOutline size={24} />, variant: "special" },
        { title: "Total InRate", number: `₹${Number(data?.totalInRate || 0).toFixed(2)}`, icon: <IoPieChartOutline size={24} />, variant: "normal" },
        { title: "Total OutRate", number: `₹${Number(data?.totalOutRate || 0).toFixed(2)}`, icon: <IoTrendingUpOutline size={24} />, variant: "normal" },
        { title: "Total Profit", number: `₹${Number(data?.totalProfit || 0).toFixed(2)}`, icon: <IoCashOutline size={24} />, variant: "normal" },
    ];

    if (isLoading) {
        return (
            <div className="p-6 space-y-6">
                <section>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}
                    </div>
                </section>
                <ReportTab />
                <div className="bg-white shadow rounded-2xl p-4"><TableSkeleton rows={7} columns={8} /></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">

            {/* 📊 Summary Cards */}
            <section className="stat-card-sec">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((item, index) => (
                        <StatCard key={index} title={item.title} number={item.number} icon={item.icon} variant={item.variant} />
                    ))}
                </div>
            </section>

            <ReportTab />

            {/* 🔍 Filters + Export */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <h2 className="text-xl font-bold">In Out Report</h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex flex-wrap items-center gap-3 border border-brand-cyan rounded-xl px-3 py-2">
                        <select value={filters.filterType}
                            onChange={(e) => { handleChange("filterType", e.target.value); setPage(1); }}
                            className="outline-none bg-transparent text-sm font-medium cursor-pointer px-2 py-1 min-w-[140px]">
                            <option value="">All</option>
                            <option value="week">Week</option>
                            <option value="monthly">Monthly</option>
                            <option value="custom">Custom Range</option>
                        </select>
                        {filters.filterType === "custom" && (
                            <div className="flex items-center gap-2 flex-wrap">
                                <input type="date" value={filters.fromDate}
                                    onChange={(e) => handleChange("fromDate", e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan" />
                                <span className="text-gray-400 text-sm">to</span>
                                <input type="date" value={filters.toDate}
                                    onChange={(e) => handleChange("toDate", e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan" />
                            </div>
                        )}
                    </div>
                    <div className="relative">
                        <button onClick={() => setIsExportMenuOpen((prev) => !prev)}
                            className="bg-brand-navy px-5 py-3 rounded-xl flex items-center gap-2 text-white font-semibold hover:bg-opacity-90 transition-all whitespace-nowrap">
                            <Download size={18} /> Export <ChevronDown size={16} />
                        </button>
                        {isExportMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                                <button onClick={exportToExcel} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors">Export Excel</button>
                                <button onClick={exportToPdf} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors">Export PDF</button>
                                <button onClick={exportToDoc} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors">Export DOC</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 📋 Table */}
            <div className="bg-white shadow rounded-2xl p-4">
                <div className="bg-white rounded-xl border overflow-x-auto">
                    <table className="min-w-[900px] w-full text-sm">
                        <thead className="bg-[#F1F5F9] text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="p-3">
                                    <input ref={selectAllRef} type="checkbox"
                                        checked={isAllSelected}
                                        onChange={(e) => toggleSelectAll(e.target.checked)} />
                                </th>
                                <th className="p-3 text-left">#</th>
                                <th className="p-3 text-left">Product</th>
                                <th className="p-3 text-center">Qty</th>
                                <th className="p-3 text-center">InRate</th>
                                <th className="p-3 text-center">OutRate</th>
                                <th className="p-3 text-center">Margin</th>
                                <th className="p-3 text-center">Stock</th>
                                <th className="p-3 text-center">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedRecords.length ? (
                                paginatedRecords.map((item, index) => (
                                    <tr key={item.variantId} className="border-t hover:bg-gray-50">
                                        <td className="p-3">
                                            <input type="checkbox"
                                                checked={selectedIds.includes(item.variantId)}
                                                onChange={() => toggleRowSelection(item.variantId)}
                                                onClick={(e) => e.stopPropagation()} />
                                        </td>
                                        <td className="p-3 text-gray-600">{(page - 1) * ITEMS_PER_PAGE + index + 1}</td>
                                        <td className="p-3 font-medium text-gray-800">{item.productName}</td>
                                        <td className="p-3 text-center text-gray-700">{item.quantity}</td>
                                        <td className="p-3 text-center text-gray-700">₹{Number(item.InRate).toFixed(2)}</td>
                                        <td className="p-3 text-center text-gray-700">₹{Number(item.OutRate).toFixed(2)}</td>
                                        <td className="p-3 text-center font-semibold text-green-600">₹{Number(item.margin).toFixed(2)}</td>
                                        <td className="p-3 text-center text-gray-700">{item.stock}</td>
                                        <td className="p-3 text-center text-gray-500 whitespace-nowrap">
                                            {new Date(item.date).toLocaleDateString("en-IN")}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="text-center py-10 text-gray-500 font-medium">No records found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>

        </div>
    );
}

export default InrateOutrateReport;