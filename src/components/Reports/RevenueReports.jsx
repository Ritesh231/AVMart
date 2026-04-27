import React, { useState } from "react";
import { useGetTotalRevenueQuery } from "../../Redux/apis/reportApi";
import ReportTab from "./ReportTab";
import StatCard from "../StatCard";
import { IoCartOutline, IoCashOutline } from "react-icons/io5";
import StatCardSkeleton from "../statcardskeleton";
import { toast } from "react-toastify";
import { Download, ChevronDown } from "lucide-react";

function RevenueReport() {
    const [filters, setFilters] = useState({
        filterType: "month",
        fromDate: "",
        toDate: "",
    });

    const [ordersPage, setOrdersPage] = useState(1);
    const [productsPage, setProductsPage] = useState(1);
    const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

    const ITEMS_PER_PAGE = 10;

    const { data, isLoading, isFetching } = useGetTotalRevenueQuery(filters, {
        refetchOnMountOrArgChange: true,
    });

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));

        if (key === "filterType") {
            setOrdersPage(1);
            setProductsPage(1);
        }
    };

    const orders = data?.Data || [];
    const productRevenue = data?.productWiseRevenue || [];

    const paginatedOrders = [...orders]
        .reverse()
        .slice(
            (ordersPage - 1) * ITEMS_PER_PAGE,
            ordersPage * ITEMS_PER_PAGE
        );

    const paginatedProducts = [...productRevenue]
        .reverse()
        .slice(
            (productsPage - 1) * ITEMS_PER_PAGE,
            productsPage * ITEMS_PER_PAGE
        );

    const totalOrderPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
    const totalProductPages = Math.ceil(productRevenue.length / ITEMS_PER_PAGE);

    const Pagination = ({ currentPage, totalPages, onPageChange }) => {
        if (totalPages <= 1) return null;

        return (
            <div className="flex justify-between items-center mt-6 px-4 py-4 bg-white border-t rounded-xl">
                <p className="text-sm text-gray-600 hidden md:block">
                    Page {currentPage} of {totalPages}
                </p>

                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                        disabled={currentPage === 1}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${currentPage === 1
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-[#1E264F] text-white hover:bg-opacity-90"
                            }`}
                    >
                        Prev
                    </button>

                    {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        return (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${currentPage === page
                                        ? "bg-gradient-to-r from-[#FD610D] to-[#FF8800] text-white shadow-md"
                                        : "bg-gray-100 text-[#1E264F] hover:bg-gray-200"
                                    }`}
                            >
                                {page}
                            </button>
                        );
                    })}

                    <button
                        onClick={() =>
                            onPageChange(Math.min(currentPage + 1, totalPages))
                        }
                        disabled={currentPage === totalPages}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${currentPage === totalPages
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-[#1E264F] text-white hover:bg-opacity-90"
                            }`}
                    >
                        Next
                    </button>
                </div>
            </div>
        );
    };

    const stats = [
        {
            title: "Total Orders",
            number: data?.totalOrders || 0,
            icon: <IoCartOutline size={24} />,
            variant: "special",
        },
        {
            title: "Total Revenue",
            number: `₹${Number(data?.totalRevenue || 0).toFixed(2)}`,
            icon: <IoCashOutline size={24} />,
            variant: "normal",
        },
    ];

    const getRowsForExport = () => {
        if (!orders.length) {
            toast.info("No revenue report data available to export");
            return [];
        }

        return [...orders].reverse().map((order, index) => ({
            "S.No": index + 1,
            "Order ID": order.orderId || "-",
            Date: order.date ? new Date(order.date).toLocaleString("en-IN") : "-",
            "Total Amount": `₹${Number(order.totalAmount || 0).toFixed(2)}`,
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
                    .map(
                        (header) =>
                            `"${String(row[header] ?? "").replace(/"/g, '""')}"`
                    )
                    .join(",")
            ),
        ].join("\n");

        downloadBlob(
            csv,
            `revenue_report_${new Date().toISOString().split("T")[0]}.csv`,
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
          <title>Revenue Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 10px; text-align: left; }
            th { background: #f5f5f5; }
          </style>
        </head>
        <body>
          <h2>Revenue Report</h2>
          <table>
            <thead><tr>${tableHead}</tr></thead>
            <tbody>${tableRows}</tbody>
          </table>
        </body>
      </html>
    `;

        downloadBlob(
            html,
            `revenue_report_${new Date().toISOString().split("T")[0]}.doc`,
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
          <title>Revenue Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background: #f3f4f6; }
          </style>
        </head>
        <body>
          <h2>Revenue Report</h2>
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

    const TableSkeleton = ({ rows = 5, columns = 3 }) => (
        <div className="overflow-x-auto animate-pulse">
            <table className="min-w-full">
                <thead className="bg-gray-100">
                    <tr>
                        {Array.from({ length: columns }).map((_, index) => (
                            <th key={index} className="px-6 py-4">
                                <div className="h-4 bg-gray-300 rounded w-24"></div>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(2)].map((_, index) => (
                        <StatCardSkeleton key={index} />
                    ))}
                </div>

                <ReportTab />

                <div className="bg-white shadow rounded-2xl p-4 flex justify-between items-center">
                    <div className="h-8 w-56 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-10 w-64 bg-gray-200 rounded-xl animate-pulse"></div>
                </div>

                <div className="bg-white shadow rounded-2xl p-4">
                    <div className="h-7 w-56 bg-gray-300 rounded mb-6 animate-pulse"></div>
                    <TableSkeleton rows={5} columns={3} />
                </div>

                <div className="bg-white shadow rounded-2xl p-4">
                    <div className="h-7 w-40 bg-gray-300 rounded mb-6 animate-pulse"></div>
                    <TableSkeleton rows={5} columns={3} />
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <section>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <h2 className="text-xl font-bold">Total Revenue Report</h2>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex flex-wrap items-center gap-3 border border-brand-cyan rounded-xl px-3 py-2">
                        <select
                            value={filters.filterType}
                            onChange={(e) =>
                                handleFilterChange("filterType", e.target.value)
                            }
                            className="outline-none bg-transparent text-sm font-medium cursor-pointer px-2 py-1 min-w-[140px]"
                        >
                            <option value="all">All</option>
                            <option value="week">Week</option>
                            <option value="month">Month</option>
                            <option value="custom">Custom Range</option>
                        </select>

                        {filters.filterType === "custom" && (
                            <div className="flex items-center gap-2 flex-wrap">
                                <input
                                    type="date"
                                    value={filters.fromDate}
                                    onChange={(e) =>
                                        handleFilterChange("fromDate", e.target.value)
                                    }
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
                                />

                                <span className="text-gray-400 text-sm">to</span>

                                <input
                                    type="date"
                                    value={filters.toDate}
                                    onChange={(e) =>
                                        handleFilterChange("toDate", e.target.value)
                                    }
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
                                />
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setIsExportMenuOpen((prev) => !prev)}
                            className="bg-brand-navy px-5 py-3 rounded-xl flex items-center gap-2 text-white font-semibold hover:bg-opacity-90 transition-all"
                        >
                            <Download size={18} />
                            Export
                            <ChevronDown size={16} />
                        </button>

                        {isExportMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                                <button
                                    onClick={exportToExcel}
                                    className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50"
                                >
                                    Export Excel
                                </button>
                                <button
                                    onClick={exportToPdf}
                                    className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50"
                                >
                                    Export PDF
                                </button>
                                <button
                                    onClick={exportToDoc}
                                    className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50"
                                >
                                    Export DOC
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isFetching && (
                <div className="text-sm text-gray-500">Updating report...</div>
            )}

            <div className="bg-white shadow rounded-2xl p-4">
                <h2 className="text-xl font-semibold mb-4">Product Wise Revenue</h2>

                <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left border-r text-sm font-semibold text-gray-700 uppercase">Product</th>
                                <th className="px-6 py-4 text-center border-r text-sm font-semibold text-gray-700 uppercase">Quantity</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase">Revenue</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {paginatedProducts.length ? (
                                paginatedProducts.map((item) => (
                                    <tr key={item.productId} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 border-r text-sm font-medium text-gray-800">
                                            {item.productName}
                                        </td>
                                        <td className="px-6 py-4 border-r text-sm text-center text-gray-700">
                                            {item.totalQuantity}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right font-semibold text-green-600">
                                            ₹ {Number(item.totalRevenue).toFixed(2)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-10 text-center text-gray-500">
                                        No revenue data found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    currentPage={productsPage}
                    totalPages={totalProductPages}
                    onPageChange={setProductsPage}
                />
            </div>

            <div className="bg-white shadow rounded-2xl p-4">
                <h2 className="text-xl font-semibold mb-4">Orders</h2>

                <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                            <tr>
                                <th className="px-6 py-4 border-r text-left text-sm font-semibold text-gray-700 uppercase">Order ID</th>
                                <th className="px-6 py-4 border-r text-center text-sm font-semibold text-gray-700 uppercase">Date</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {paginatedOrders.length ? (
                                paginatedOrders.map((order) => (
                                    <tr key={order.orderId} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 border-r text-sm font-medium text-gray-800">
                                            {order.orderId}
                                        </td>
                                        <td className="px-6 py-4 border-r text-sm text-center text-gray-700">
                                            {new Date(order.date).toLocaleString("en-IN")}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right font-semibold text-green-600">
                                            ₹ {Number(order.totalAmount).toFixed(2)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-10 text-center text-gray-500">
                                        No orders found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    currentPage={ordersPage}
                    totalPages={totalOrderPages}
                    onPageChange={setOrdersPage}
                />
            </div>
        </div>
    );
}

export default RevenueReport;