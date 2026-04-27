import React, { useState, useMemo } from "react";
import { toast } from "react-toastify";
import { useGetAllReportsQuery } from "../../Redux/apis/reportApi";
import ReportTab from "./ReportTab";
import StatCard from "../StatCard";
import StatCardSkeleton from "../statcardskeleton";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { Download, ChevronDown } from "lucide-react";

function AllReports() {
    const [activeTab, setActiveTab] = useState("product");

    const [filters, setFilters] = useState({
        filterType: "month",
        fromDate: "",
        toDate: "",
    });

    const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

    // Add these helper functions inside AllReports component (above return)

    const getRowsForExport = () => {
        if (!data?.Data?.length) {
            toast.info(`No ${activeTab} data available to export`);
            return [];
        }

        if (activeTab === "product") {
            return [...data.Data].reverse().map((item) => {
                const variant = item.variants?.[0] || {};

                return {
                    Product: item.productName || "-",
                    Category: item.category || "-",
                    Brand: item.brand || "-",
                    Party: item.party?.PartName || "-",
                    Price: variant.price ?? 0,
                    Stock: variant.stock ?? 0,
                    Variants: item.totalVariants ?? 0,
                    Status: item.status || "-",
                    Date: item.date
                        ? new Date(item.date).toLocaleDateString()
                        : "-",
                };
            });
        }

        return [...data.Data].reverse().map((order) => {
            const totalAmount =
                order.products?.reduce(
                    (sum, product) => sum + product.price * product.quantity,
                    0
                ) || 0;

            const totalItems =
                order.products?.reduce(
                    (sum, product) => sum + product.quantity,
                    0
                ) || 0;

            return {
                Invoice: order.paymentInvoice || "-",
                "Total Items": totalItems,
                "Total Amount": totalAmount,
                Products:
                    order.products?.map(
                        (product) =>
                            `${product.productName} x ${product.quantity}`
                    ).join(", ") || "No products",
                Date: order.date
                    ? new Date(order.date).toLocaleDateString()
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
            `${activeTab}_report_${new Date().toISOString().split("T")[0]}.csv`,
            "text/csv;charset=utf-8;"
        );

        setIsExportMenuOpen(false);
    };

    const exportToDoc = () => {
        const rows = getRowsForExport();
        if (!rows.length) return;

        const headers = Object.keys(rows[0]);

        const tableHead = headers
            .map((header) => `<th>${header}</th>`)
            .join("");

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
                <title>${activeTab} Report</title>
            </head>
            <body>
                <h2>${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Report</h2>
                <table border="1" cellspacing="0" cellpadding="8">
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
            `${activeTab}_report_${new Date().toISOString().split("T")[0]}.doc`,
            "application/msword"
        );

        setIsExportMenuOpen(false);
    };

    const exportToPdf = () => {
        const rows = getRowsForExport();
        if (!rows.length) return;

        const headers = Object.keys(rows[0]);

        const tableHead = headers
            .map((header) => `<th>${header}</th>`)
            .join("");

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
                <title>${activeTab} Report</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 20px;
                    }
                    h2 {
                        margin-bottom: 20px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background: #f5f5f5;
                    }
                </style>
            </head>
            <body>
                <h2>${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Report</h2>
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

    const isCustom = filters.filterType === "custom";

    const { data, isLoading } = useGetAllReportsQuery({
        ...filters,
        status: activeTab, // 🔥 key logic
    }, {
        refetchOnMountOrArgChange: true,
    });

    const handleChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

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

    const stats = [
        {
            title: "Total Records",
            number: data?.total || 0,
            icon: <IoCheckmarkDoneOutline size={24} />,
            variant: "special",
        },
    ];

    return (
        <div className="p-6 space-y-6">

            {/* 📊 Total */}
            <section className="stat-card-sec">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

            {/* 🔥 Tabs */}
            <div className="flex gap-4">
                <button
                    onClick={() => setActiveTab("product")}
                    className={`px-4 py-2 rounded-xl ${activeTab === "product"
                        ? "bg-gradient-to-r from-[#FD610D] to-[#FF8800] text-white"
                        : "bg-gray-200"
                        }`}
                >
                    Products
                </button>

                <button
                    onClick={() => setActiveTab("order")}
                    className={`px-4 py-2 rounded-xl ${activeTab === "order"
                        ? "bg-gradient-to-r from-[#FD610D] to-[#FF8800] text-white"
                        : "bg-gray-200"
                        }`}
                >
                    Orders
                </button>
            </div>

            {/* 🔍 Filters */}
            <div className="bg-white shadow rounded-2xl p-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <h2 className="text-xl font-bold">All Reports</h2>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        {/* Filter Section */}
                        <div className="flex flex-wrap items-center gap-3 border border-brand-cyan rounded-xl px-3 py-2">
                            <select
                                value={filters.filterType}
                                onChange={(e) =>
                                    handleChange("filterType", e.target.value)
                                }
                                className="outline-none bg-transparent text-sm font-medium cursor-pointer px-2 py-1 min-w-[140px]"
                            >
                                <option value="week">Weekly</option>
                                <option value="month">Monthly</option>
                                <option value="year">Yearly</option>
                                <option value="custom">Custom Range</option>
                            </select>

                            {isCustom && (
                                <div className="flex items-center gap-2 flex-wrap">
                                    <input
                                        type="date"
                                        value={filters.fromDate}
                                        onChange={(e) =>
                                            handleChange("fromDate", e.target.value)
                                        }
                                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                                    />

                                    <span className="text-gray-400 text-sm">to</span>

                                    <input
                                        type="date"
                                        value={filters.toDate}
                                        onChange={(e) =>
                                            handleChange("toDate", e.target.value)
                                        }
                                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Export Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() =>
                                    setIsExportMenuOpen((prev) => !prev)
                                }
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

            {/* 📋 Table */}
            {/* 📋 Dynamic Table */}
            <div className="bg-white shadow rounded-2xl p-4 overflow-x-auto">
                {activeTab === "product" ? (
                    <table className="w-full border text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 border text-left">Product</th>
                                <th className="p-3 border">Category</th>
                                <th className="p-3 border">Brand</th>
                                <th className="p-3 border">Party</th>
                                <th className="p-3 border">Price</th>
                                <th className="p-3 border">Stock</th>
                                <th className="p-3 border">Margin %</th>
                                <th className="p-3 border">Variants</th>
                                <th className="p-3 border">Status</th>
                                <th className="p-3 border">Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data?.Data?.length ? (
                                [...data.Data]
                                    .reverse()
                                    .map((item) => {
                                        const variant = item.variants?.[0] || {};

                                        return (
                                            <tr key={item.productId} className="text-center hover:bg-gray-50">
                                                <td className="p-3 border text-left">{item.productName}</td>
                                                <td className="p-3 border">{item.category || "N/A"}</td>
                                                <td className="p-3 border">{item.brand || "N/A"}</td>
                                                <td className="p-3 border">
                                                    {item.party?.PartName || "N/A"}
                                                </td>
                                                <td className="p-3 border">₹ {variant.price ?? 0}</td>
                                                <td className="p-3 border">{variant.stock ?? 0}</td>
                                                <td className="p-3 border">{variant.marginPercentage ?? 0}</td>
                                                <td className="p-3 border">{item.totalVariants ?? 0}</td>
                                                <td className="p-3 border">
                                                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="p-3 border">
                                                    {new Date(item.date).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        );
                                    })
                            ) : (
                                <tr>
                                    <td colSpan="9" className="p-6 text-center text-gray-500">
                                        No product data found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                ) : (
                    <table className="w-full border text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 border">Invoice</th>
                                <th className="p-3 border">Total Items</th>
                                <th className="p-3 border">Total Amount</th>
                                <th className="p-3 border">Products</th>
                                <th className="p-3 border">Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data?.Data?.length ? (
                                [...data.Data]
                                    .reverse()
                                    .map((order, index) => {
                                        const totalAmount =
                                            order.products?.reduce(
                                                (sum, product) =>
                                                    sum + product.price * product.quantity,
                                                0
                                            ) || 0;

                                        const totalItems =
                                            order.products?.reduce(
                                                (sum, product) => sum + product.quantity,
                                                0
                                            ) || 0;

                                        return (
                                            <tr
                                                key={order.paymentInvoice || index}
                                                className="text-center hover:bg-gray-50"
                                            >
                                                <td className="p-3 border font-medium">
                                                    #{order.paymentInvoice}
                                                </td>



                                                <td className="p-3 border">{totalItems}</td>

                                                <td className="p-3 border font-semibold">
                                                    ₹ {totalAmount.toLocaleString()}
                                                </td>

                                                <td className="p-3 border text-left">
                                                    {order.products?.length > 0 ? (
                                                        <div className="space-y-1">
                                                            {order.products.map((product, idx) => (
                                                                <div key={idx} className="text-sm">
                                                                    {product.productName} × {product.quantity}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">No products</span>
                                                    )}
                                                </td>

                                                <td className="p-3 border">
                                                    {new Date(order.date).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        );
                                    })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-6 text-center text-gray-500">
                                        No order data found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

        </div>
    );
}

export default AllReports;