import React, { useState, useMemo } from "react";
import { toast } from "react-toastify";
import { useGetReportsQuery } from "../../Redux/apis/reportApi";
import ReportStats from "./ReportStats";
import ReportTab from "./ReportTab";
import { Download, ChevronDown } from "lucide-react";

const TableSkeleton = () => {
    return (
        <div className="overflow-x-auto bg-white shadow rounded-2xl p-4 animate-pulse">
            <table className="min-w-full border">
                <thead>
                    <tr>
                        {[...Array(6)].map((_, i) => (
                            <th key={i} className="px-4 py-3 border">
                                <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {[...Array(5)].map((_, row) => (
                        <tr key={row}>
                            {[...Array(6)].map((_, col) => (
                                <td key={col} className="px-4 py-4 border">
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const TotalReports = () => {
    const [filterType, setFilterType] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data, isLoading, isError } = useGetReportsQuery(
        filterType === "custom"
            ? { filterType, fromDate, toDate }
            : filterType
                ? { filterType }
                : {},
        { refetchOnMountOrArgChange: true }
    );

    const reports = data?.Data || [];
    const totalPages = Math.ceil(reports.length / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReports = [...reports].reverse().slice(startIndex, endIndex);

    const handleFilterChange = (e) => {
        setFilterType(e.target.value);
        setPage(1);
    };

    const getRowsForExport = () => {
        if (!reports.length) {
            toast.info("No reports available to export");
            return [];
        }

        return [...reports].reverse().map((item) => {
            const totalAmount =
                item.products?.reduce(
                    (sum, product) => sum + product.price * product.quantity,
                    0
                ) || 0;

            const totalItems =
                item.products?.reduce(
                    (sum, product) => sum + product.quantity,
                    0
                ) || 0;

            return {
                Invoice: item.paymentInvoice || "-",
                "HSN Code": item.HSNCODE || "-",
                "Total Items": totalItems,
                Products:
                    item.products
                        ?.map(
                            (product) =>
                                `${product.productName} (x${product.quantity})`
                        )
                        .join(", ") || "-",
                "Total Amount": totalAmount,
                Date: item.date
                    ? new Date(item.date).toLocaleDateString()
                    : "-",
            };
        });
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
            `sales_report_${new Date().toISOString().split("T")[0]}.csv`,
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
                <title>Sales Report</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                    th { background: #f5f5f5; }
                </style>
            </head>
            <body>
                <h2>Total Reports</h2>
                <table>
                    <thead><tr>${tableHead}</tr></thead>
                    <tbody>${tableRows}</tbody>
                </table>
            </body>
        </html>
    `;

        downloadBlob(
            html,
            `sales_report_${new Date().toISOString().split("T")[0]}.doc`,
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
                <title>Total Reports</title>
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
                <h2>Total Reports</h2>
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

    return (
        <div className="p-6 space-y-6">
            <ReportStats />
            <ReportTab />

            <div className="bg-white shadow rounded-2xl p-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <h2 className="text-xl font-bold">Total Reports</h2>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        {/* Filter Section */}
                        <div className="flex flex-wrap items-center gap-3 border border-brand-cyan rounded-xl px-3 py-2">
                            <select
                                value={filterType}
                                onChange={handleFilterChange}
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
            </div>

            {isLoading && <TableSkeleton />}

            {isError && (
                <div className="bg-white shadow rounded-2xl p-4 text-center">
                    <p className="text-red-500">Error fetching reports</p>
                </div>
            )}

            {!isLoading && reports.length > 0 && (
                <div className="overflow-x-auto bg-white shadow rounded-2xl p-4">
                    <table className="min-w-full text-sm text-left border">
                        <thead className="bg-gray-100 text-gray-700 uppercase text-xs text-center">
                            <tr>
                                <th className="px-4 py-3 border">#</th>
                                <th className="px-4 py-3 border">Invoice</th>
                                <th className="px-4 py-3 border">HSN Code</th>
                                <th className="px-4 py-3 border">Products</th>
                                <th className="px-4 py-3 border">Total Amount</th>
                                {/* <th className="px-4 py-3 border">Date</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedReports.map((item, index) => {
                                const totalAmount = item.products?.reduce(
                                    (sum, p) => sum + p.price * p.quantity,
                                    0
                                );

                                return (
                                    <tr
                                        key={index}
                                        className="border-b hover:bg-gray-50 text-center"
                                    >
                                        <td className="px-4 py-3 border">{startIndex + index + 1}</td>
                                        <td className="px-4 py-3 font-medium border">
                                            #{item.paymentInvoice}
                                        </td>
                                        <td className="px-4 py-3 border">
                                            {item.HSNCODE || "-"}
                                        </td>
                                        <td className="px-4 py-3 border text-left">
                                            {item.products?.length > 0 ? (
                                                item.products.map((p, i) => (
                                                    <div key={i} className="text-xs">
                                                        {p.productName} (x{p.quantity})
                                                    </div>
                                                ))
                                            ) : (
                                                "-"
                                            )}
                                        </td>
                                        <td className="px-4 py-3 font-semibold text-green-600 border">
                                            ₹{totalAmount || 0}
                                        </td>
                                        {/* <td className="px-4 py-3 border">
                                            {new Date(item.date).toLocaleDateString()}
                                        </td> */}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

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

            {!isLoading && reports.length === 0 && !isError && (
                <div className="bg-white shadow rounded-2xl p-4 text-center">
                    <p className="text-gray-500">No data found</p>
                </div>
            )}

        </div>
    );
};

export default TotalReports;