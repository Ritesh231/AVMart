import React, { useState } from "react";
import { useGetInrateOutrateQuery } from "../../Redux/apis/reportApi";
import ReportTab from "./ReportTab";
import StatCard from "../StatCard";
import StatCardSkeleton from "../statcardskeleton";
import { IoCheckmarkDoneOutline, IoCashOutline, IoTrendingUpOutline, IoPieChartOutline } from "react-icons/io5";
import { Download, ChevronDown } from "lucide-react";

function InrateOutrateReport() {
    const [filters, setFilters] = useState({
        filterType: "monthly",
        fromDate: "",
        toDate: "",
    });

    const { data, isLoading } = useGetInrateOutrateQuery(filters, {
        refetchOnMountOrArgChange: true,
    });

    const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

    const isCustom = filters.filterType === "custom";

    const handleChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };


    const getRowsForExport = () => {
        const records = data?.Data || [];

        if (!records.length) {
            toast.info("No in/out rate report data available to export");
            return [];
        }

        return [...records].reverse().map((item, index) => ({
            "S.No": index + 1,
            "Product Name": item.productName || "-",
            "Quantity": item.quantity || 0,
            "InRate": `₹${Number(item.InRate || 0).toFixed(2)}`,
            "OutRate": `₹${Number(item.OutRate || 0).toFixed(2)}`,
            "Margin": `₹${Number(item.margin || 0).toFixed(2)}`,
            "Stock": item.stock || 0,
            "Date": item.date
                ? new Date(item.date).toLocaleDateString("en-IN")
                : "-",
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
                    .map((header) => `"${String(row[header] ?? "").replace(/"/g, '""')}"`)
                    .join(",")
            ),
        ].join("\n");

        downloadBlob(
            csv,
            `inrate-outrate-report-${new Date().toISOString().split("T")[0]}.csv`,
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
        <title>Inrate Outrate Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h2 { margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td {
            border: 1px solid #ccc;
            padding: 10px;
            text-align: left;
          }
          th { background: #f5f5f5; }
        </style>
      </head>
      <body>
        <h2>Inrate Outrate Report</h2>
        <table>
          <thead>
            <tr>${tableHead}</tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </body>
    </html>
  `;

        downloadBlob(
            html,
            `inrate-outrate-report-${new Date().toISOString().split("T")[0]}.doc`,
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
        <title>Inrate Outrate Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h2 { margin-bottom: 20px; }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
          }
          th { background: #f3f4f6; }
        </style>
      </head>
      <body>
        <h2>Inrate Outrate Report</h2>
        <table>
          <thead>
            <tr>${tableHead}</tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </body>
    </html>
  `);

        printWindow.document.close();
        printWindow.focus();
        printWindow.print();

        setIsExportMenuOpen(false);
    };


    const stats = [
        {
            title: "Total Records",
            number: data?.totalRecords || 0,
            icon: <IoCheckmarkDoneOutline size={24} />,
            variant: "special",
        },
        {
            title: "Total InRate",
            number: `₹${Number(data?.totalInRate || 0).toFixed(2)}`,
            icon: <IoPieChartOutline size={24} />,
            variant: "normal",
        },
        {
            title: "Total OutRate",
            number: `₹${Number(data?.totalOutRate || 0).toFixed(2)}`,
            icon: <IoTrendingUpOutline size={24} />,
            variant: "normal",
        },
        {
            title: "Total Profit",
            number: `₹${Number(data?.totalProfit || 0).toFixed(2)}`,
            icon: <IoCashOutline size={24} />,
            variant: "normal",
        },
    ];

    const TableSkeleton = ({ rows = 7, columns = 7 }) => (
        <div className="overflow-x-auto animate-pulse">
            <table className="min-w-full">
                <thead className="bg-gray-100">
                    <tr>
                        {Array.from({ length: columns }).map((_, index) => (
                            <th key={index} className="px-6 py-4">
                                <div className="h-4 bg-gray-300 rounded w-24 mx-auto"></div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <tr key={rowIndex} className="border-b">
                            {Array.from({ length: columns }).map((_, colIndex) => (
                                <td key={colIndex} className="px-6 py-4">
                                    <div className="h-4 bg-gray-200 rounded"></div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    // Replace your current loading block
    if (isLoading) {
        return (
            <div className="p-6 space-y-6">
                {/* Summary Skeleton */}
                <section>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[...Array(3)].map((_, index) => (
                            <StatCardSkeleton key={index} />
                        ))}
                    </div>
                </section>

                <ReportTab />

                {/* Filter Skeleton */}
                <div className="flex justify-between items-center bg-white shadow rounded-2xl p-4">
                    <div className="h-8 w-40 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-10 w-72 bg-gray-200 rounded-xl animate-pulse"></div>
                </div>

                {/* Product Wise Sales Skeleton */}
                <div className="bg-white shadow rounded-2xl p-4">
                    <div className="h-7 w-56 bg-gray-300 rounded mb-6 animate-pulse"></div>
                    <TableSkeleton rows={5} columns={3} />
                </div>

                {/* Orders Table Skeleton */}
                <div className="bg-white shadow rounded-2xl p-4">
                    <div className="h-7 w-32 bg-gray-300 rounded mb-6 animate-pulse"></div>
                    <TableSkeleton rows={6} columns={5} />
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">

            {/* 📊 Summary Cards */}
            <section className="stat-card-sec">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

            {/* 🔍 Filters */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <h2 className="text-xl font-bold">In Out Report</h2>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    {/* Filter Section */}
                    <div className="flex flex-wrap items-center gap-3 border border-brand-cyan rounded-xl px-3 py-2">
                        <select
                            value={filters}
                            onChange={(e) => setFilters(e.target.value)}
                            className="outline-none bg-transparent text-sm font-medium cursor-pointer px-2 py-1 min-w-[140px]"
                        >
                            <option value="">All</option>
                            <option value="week">Week</option>
                            <option value="month">Month</option>
                            <option value="custom">Custom Range</option>
                        </select>

                        {filters === "custom" && (
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

            {/* 📋 Table */}
            <div className="bg-white shadow rounded-2xl p-4">
                <div className="overflow-x-auto">
                    <table className="w-full border text-sm ">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 border text-left">Product</th>
                                <th className="p-2 border">Qty</th>
                                <th className="p-2 border">InRate</th>
                                <th className="p-2 border">OutRate</th>
                                <th className="p-2 border">Margin</th>
                                <th className="p-2 border">Stock</th>
                                <th className="p-2 border">Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            {[...(data?.Data || [])]
                                .reverse()
                                .map((item) => (
                                    <tr key={item.variantId} className="text-center">
                                        <td className="p-2 border text-left">{item.productName}</td>

                                        <td className="p-2 border">{item.quantity}</td>

                                        <td className="p-2 border">
                                            ₹ {Number(item.InRate).toFixed(2)}
                                        </td>

                                        <td className="p-2 border">
                                            ₹ {Number(item.OutRate).toFixed(2)}
                                        </td>

                                        <td className="p-2 border font-semibold text-green-600">
                                            ₹ {Number(item.margin).toFixed(2)}
                                        </td>

                                        <td className="p-2 border">{item.stock}</td>

                                        <td className="p-2 border">
                                            {new Date(item.date).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}

                            {!data?.Data?.length && (
                                <tr>
                                    <td colSpan="7" className="p-4 text-center text-gray-500">
                                        No records found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}

export default InrateOutrateReport;