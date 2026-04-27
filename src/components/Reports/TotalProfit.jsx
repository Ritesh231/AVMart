import React, { useState } from "react";
import { useGetTotalProfitQuery } from "../../Redux/apis/reportApi";
import ReportTab from "./ReportTab";
import StatCard from "../StatCard";
import StatCardSkeleton from "../statcardskeleton";
import { IoCartOutline, IoCashOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { Download, ChevronDown } from "lucide-react";

const ProfitReport = ({ }) => {
    const [filterType, setFilterType] = useState("month");
    const [page, setPage] = useState(1);
    const limit = 10;
    const { data, isLoading, isError } = useGetTotalProfitQuery({ filterType }, {
        refetchOnMountOrArgChange: true,
    });
    const reports = data?.orderWiseProfit || [];

    const totalPages = Math.ceil(reports.length / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReports = [...reports]
        .reverse()
        .slice(startIndex, endIndex);

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

    // ✅ Add this reusable skeleton component above your ProfitReport component
    const TableSkeleton = ({ rows = 5, columns = 4 }) => (
        <div className="overflow-x-auto animate-pulse">
            <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        {Array.from({ length: columns }).map((_, index) => (
                            <th key={index} className="px-4 py-3">
                                <div className="h-4 bg-gray-300 rounded w-24"></div>
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <tr key={rowIndex} className="border-b">
                            {Array.from({ length: columns }).map((_, colIndex) => (
                                <td key={colIndex} className="px-4 py-4">
                                    <div className="h-4 bg-gray-200 rounded"></div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    if (isLoading) {
        return (
            <div className="p-6 space-y-6">
                {/* Stat Cards Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(2)].map((_, index) => (
                        <StatCardSkeleton key={index} />
                    ))}
                </div>

                <ReportTab />

                {/* Product Wise Profit Skeleton */}
                <div className="bg-white rounded-xl shadow border overflow-hidden">
                    <div className="p-4 border-b">
                        <div className="h-6 w-48 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                    <div className="p-4 border-b">
                        <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="p-4">
                        <TableSkeleton rows={5} columns={4} />
                    </div>
                </div>

                {/* Order Wise Profit Skeleton */}
                <div className="bg-white rounded-xl shadow border overflow-hidden">
                    <div className="p-4 border-b">
                        <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="p-4">
                        <TableSkeleton rows={5} columns={4} />
                    </div>
                </div>
            </div>
        );
    }

    // Export data formatter for Profit Report
    const getRowsForExport = () => {
        const orderWiseProfit = report?.orderWiseProfit || [];

        if (!orderWiseProfit.length) {
            toast.info("No profit report data available to export");
            return [];
        }

        return [...orderWiseProfit].reverse().map((item, index) => ({
            "S.No": index + 1,
            "Order ID": item.orderId?.slice(-6) || "-",
            Date: item.date
                ? new Date(item.date).toLocaleDateString("en-IN")
                : "-",
            Profit: `₹${Number(item.orderProfit || 0).toFixed(2)}`,
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
            ...rows.map((row) =>
                headers
                    .map((header) =>
                        `"${String(row[header] ?? "").replace(/"/g, '""')}"`
                    )
                    .join(",")
            ),
        ].join("\n");

        downloadBlob(
            csv,
            `profit_report_${new Date().toISOString().split("T")[0]}.csv`,
            "text/csv;charset=utf-8;"
        );

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
                    `<tr>${headers
                        .map((header) => `<td>${row[header] ?? "-"}</td>`)
                        .join("")}</tr>`
            )
            .join("");

        const html = `
        <html>
            <head>
                <meta charset="utf-8" />
                <title>Profit Report</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                    th { background: #f5f5f5; }
                </style>
            </head>
            <body>
                <h2>Profit Report</h2>
                <table>
                    <thead><tr>${tableHead}</tr></thead>
                    <tbody>${tableRows}</tbody>
                </table>
            </body>
        </html>
    `;

        downloadBlob(
            html,
            `profit_report_${new Date().toISOString().split("T")[0]}.doc`,
            "application/msword"
        );

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
                    `<tr>${headers
                        .map((header) => `<td>${row[header] ?? "-"}</td>`)
                        .join("")}</tr>`
            )
            .join("");

        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        printWindow.document.write(`
        <html>
            <head>
                <title>Profit Report</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h2 { margin-bottom: 20px; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                    }
                    th { background: #f3f4f6; }
                </style>
            </head>
            <body>
                <h2>Profit Report</h2>
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



    if (isError) {
        return <div className="p-6 text-red-500">Failed to load profit report</div>;
    }

    const report = data || {};

    const stats = [
        {
            title: "Total Profit",
            number: `₹${report.totalProfit?.toFixed(2) || "0.00"}`,
            icon: <IoCashOutline size={24} />,
            variant: "special",
        },
        {
            title: "Total Orders",
            number: report.totalOrders || 0,
            icon: <IoCartOutline size={24} />,
            variant: "normal",
        },
    ];

    return (
        <div className="p-6 space-y-6">

            {/* 🔹 Summary Cards */}
            <section className="stat-card-sec">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {stats.map((item, index) => (
                        <StatCard
                            key={index}
                            title={item.title}
                            number={item.number}
                            icon={item.icon}
                            variant={item.variant}
                        />
                    ))}
                </div>
            </section>

            <ReportTab />

            {/* 🔹 Product Wise Profit */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <h2 className="text-xl font-bold">Total Profit</h2>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    {/* Filter Section */}
                    <div className="flex flex-wrap items-center gap-3 border border-brand-cyan rounded-xl px-3 py-2">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="outline-none bg-transparent text-sm font-medium cursor-pointer px-2 py-1 min-w-[140px]"
                        >
                            <option value="">All</option>
                            <option value="week">Week</option>
                            <option value="month">Month</option>
                            <option value="custom">Custom Range</option>
                        </select>

                        {filterType === "custom" && (
                            <div className="flex items-center gap-2 flex-wrap">
                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                                />

                                <span className="text-gray-400 text-sm">to</span>

                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                                />
                            </div>
                        )}
                    </div>

                    {/* Export Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsExportMenuOpen((prev) => !prev)}
                            className="bg-brand-navy px-5 py-3 rounded-xl flex items-center gap-2 text-white font-semibold hover:bg-opacity-90 transition-all whitespace-nowrap"
                        >
                            <Download size={18} />
                            Export
                            <ChevronDown size={16} />
                        </button>

                        {isExportMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                                <button
                                    onClick={exportToExcel}
                                    className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
                                >
                                    Export Excel
                                </button>

                                <button
                                    onClick={exportToPdf}
                                    className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
                                >
                                    Export PDF
                                </button>

                                <button
                                    onClick={exportToDoc}
                                    className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
                                >
                                    Export DOC
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 🔹 Order Wise Profit */}
            <div className="bg-white rounded-xl shadow border overflow-hidden">
                <div className="p-4 border-b font-semibold text-gray-700">
                    Order Wise Profit
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3 border-r">#</th>
                                <th className="px-4 py-3 border-r">Order ID</th>
                                <th className="px-4 py-3 border-r">Date</th>
                                <th className="px-4 py-3 text-right">Profit</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedReports.map((item, index) => (
                                <tr key={item.orderId} className="border-b hover:bg-gray-50 text-center">
                                    <td className="px-4 py-3 border-r">{startIndex + index + 1}</td>
                                    <td className="px-4 py-3 text-blue-600 font-medium border-r">
                                        {item.orderId.slice(-6)}
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 border-r">
                                        {new Date(item.date).toLocaleDateString("en-IN")}
                                    </td>
                                    <td className="px-4 py-3 text-right font-semibold">
                                        <span
                                            className={
                                                item.orderProfit > 0
                                                    ? "text-green-600"
                                                    : "text-gray-400"
                                            }
                                        >
                                            ₹{item.orderProfit.toFixed(2)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {reports.length > limit && (
                <div className="flex justify-between items-center mt-6 px-4 py-4 bg-white border-t rounded-xl">
                    <p className="text-sm text-gray-600 hidden md:block">
                        Showing {startIndex + 1} to {Math.min(endIndex, reports.length)} of{" "}
                        {reports.length} reports
                    </p>

                    <div className="flex items-center gap-2">
                        {/* Prev */}
                        <button
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            disabled={page === 1}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${page === 1
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-[#1E264F] text-white hover:bg-opacity-90"
                                }`}
                        >
                            Prev
                        </button>

                        {/* Page Numbers */}
                        {[...Array(totalPages)].map((_, index) => {
                            const p = index + 1;
                            return (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all
                            ${page === p
                                            ? "bg-gradient-to-r from-[#FD610D] to-[#FF8800] text-white shadow-md"
                                            : "bg-gray-100 text-[#1E264F] hover:bg-gray-200"
                                        }`}
                                >
                                    {p}
                                </button>
                            );
                        })}

                        {/* Next */}
                        <button
                            onClick={() =>
                                setPage((prev) => Math.min(prev + 1, totalPages))
                            }
                            disabled={page === totalPages}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${page === totalPages
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
};

export default ProfitReport;