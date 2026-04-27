import React, { useState } from "react";
import { useGetTotalSalesQuery } from "../../Redux/apis/reportApi";
import ReportTab from "./ReportTab";
import StatCard from "../StatCard";
import StatCardSkeleton from "../statcardskeleton";
import { IoCartOutline, IoCashOutline, IoPieChartOutline } from "react-icons/io5";
import { Download, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 10;

const TableSkeleton = ({ rows = 5, columns = 5 }) => (
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

            if (end - start < maxVisible - 1) {
                start = Math.max(1, end - maxVisible + 1);
            }

            for (let i = start; i <= end; i++) pages.push(i);
        }

        return pages;
    };

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 px-4 py-4 bg-white border-t">
            <p className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
            </p>

            <div className="flex items-center gap-2 flex-wrap justify-center">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${currentPage === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-[#1E264F] text-white hover:bg-opacity-90"
                        }`}
                >
                    Prev
                </button>

                {getPageNumbers().map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${currentPage === page
                            ? "bg-gradient-to-r from-[#FD610D] to-[#FF8800] text-white"
                            : "bg-gray-100 text-[#1E264F] hover:bg-gray-200"
                            }`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${currentPage === totalPages
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

function SalesReport() {
    const [filters, setFilters] = useState({
        filterType: "month",
        fromDate: "",
        toDate: "",
    });

    const [ordersPage, setOrdersPage] = useState(1);
    const [productsPage, setProductsPage] = useState(1);
    const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

    const { data, isLoading } = useGetTotalSalesQuery(filters, {
        refetchOnMountOrArgChange: true,
    });

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setOrdersPage(1);
        setProductsPage(1);
    };

    const orders = data?.Data || [];
    const products = data?.productWiseSales || [];

    const paginatedOrders = [...orders]
        .reverse()
        .slice((ordersPage - 1) * ITEMS_PER_PAGE, ordersPage * ITEMS_PER_PAGE);

    const paginatedProducts = [...products]
        .reverse()
        .slice((productsPage - 1) * ITEMS_PER_PAGE, productsPage * ITEMS_PER_PAGE);

    const totalOrderPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
    const totalProductPages = Math.ceil(products.length / ITEMS_PER_PAGE);

    const getStatusColor = (status) => {
        switch (status) {
            case "cancelled":
                return "bg-red-100 text-red-600";
            case "pending":
                return "bg-yellow-100 text-yellow-600";
            case "assigned":
                return "bg-blue-100 text-blue-600";
            case "confirmed":
                return "bg-green-100 text-green-600";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    const getRowsForExport = () => {
        if (!orders.length) {
            toast.info("No sales report data available to export");
            return [];
        }

        return [...orders].reverse().map((order, index) => ({
            "S.No": index + 1,
            "Order ID": order.orderId || "-",
            Date: order.date ? new Date(order.date).toLocaleString("en-IN") : "-",
            Items: order.totalItems || 0,
            Amount: Number(order.totalAmount || 0).toFixed(2),
            Status: order.status || "-",
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
                headers.map((header) => `"${String(row[header] ?? "").replace(/"/g, '""')}"`).join(",")
            ),
        ].join("\n");

        downloadBlob(csv, `sales_report_${new Date().toISOString().split("T")[0]}.csv`, "text/csv;charset=utf-8;");
        setIsExportMenuOpen(false);
    };

    const exportToDoc = () => {
        const rows = getRowsForExport();
        if (!rows.length) return;

        const headers = Object.keys(rows[0]);
        const tableHead = headers.map((h) => `<th>${h}</th>`).join("");
        const tableRows = rows
            .map((row) => `<tr>${headers.map((h) => `<td>${row[h] ?? "-"}</td>`).join("")}</tr>`)
            .join("");

        downloadBlob(
            `<!DOCTYPE html><html><body><h2>Sales Report</h2><table border="1" cellspacing="0" cellpadding="8" width="100%"><thead><tr>${tableHead}</tr></thead><tbody>${tableRows}</tbody></table></body></html>`,
            `sales_report_${new Date().toISOString().split("T")[0]}.doc`,
            "application/msword"
        );

        setIsExportMenuOpen(false);
    };

    const exportToPdf = () => {
        const rows = getRowsForExport();
        if (!rows.length) return;

        const headers = Object.keys(rows[0]);
        const tableHead = headers.map((h) => `<th>${h}</th>`).join("");
        const tableRows = rows
            .map((row) => `<tr>${headers.map((h) => `<td>${row[h] ?? "-"}</td>`).join("")}</tr>`)
            .join("");

        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        printWindow.document.write(`<!DOCTYPE html><html><body><h2>Sales Report</h2><table border="1" cellspacing="0" cellpadding="8" width="100%"><thead><tr>${tableHead}</tr></thead><tbody>${tableRows}</tbody></table></body></html>`);
        printWindow.document.close();
        printWindow.print();
        setIsExportMenuOpen(false);
    };

    const stats = [
        {
            title: "Total Orders",
            number: data?.totalOrders || 0,
            icon: <IoCartOutline size={24} />,
            variant: "special",
        },
        {
            title: "Total Sales",
            number: `₹${Number(data?.totalSales || 0).toFixed(2)}`,
            icon: <IoCashOutline size={24} />,
            variant: "normal",
        },
        {
            title: "Total Quantity",
            number: data?.totalQuantity || 0,
            icon: <IoPieChartOutline size={24} />,
            variant: "normal",
        },
    ];

    if (isLoading) {
        return (
            <div className="p-6 space-y-6">
                <section>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[...Array(3)].map((_, index) => (
                            <StatCardSkeleton key={index} />
                        ))}
                    </div>
                </section>

                <ReportTab />

                <div className="bg-white shadow rounded-2xl p-4">
                    <TableSkeleton rows={5} columns={3} />
                </div>

                <div className="bg-white shadow rounded-2xl p-4">
                    <TableSkeleton rows={6} columns={5} />
                </div>
            </div>
        );
    }



    return (
        <div className="p-6 space-y-6">

            {/* 📊 Summary */}
            <section className="stat-card-sec">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
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
                <h2 className="text-xl font-bold">Total Sales</h2>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    {/* Filter Section */}
                    <div className="flex flex-wrap items-center gap-3 border border-brand-cyan rounded-xl px-3 py-2">
                        <select
                            value={filters.filterType}
                            onChange={(e) => handleFilterChange("filterType", e.target.value)}
                            className="outline-none bg-transparent text-sm font-medium cursor-pointer px-2 py-1 min-w-[140px]"
                        >
                            <option value="">All</option>
                            <option value="week">Week</option>
                            <option value="month">Month</option>
                            <option value="custom">Custom Range</option>
                        </select>

                        {filters.filterType === "custom" && (
                            <div className="flex items-center gap-2 flex-wrap">
                                <input
                                    type="date"
                                    value={filters.fromDate}
                                    onChange={(e) => handleFilterChange("fromDate", e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                                />

                                <span className="text-gray-400 text-sm">to</span>

                                <input
                                    type="date"
                                    value={filters.toDate}
                                    onChange={(e) => handleFilterChange("toDate", e.target.value)}
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


            {/* 📦 Product Wise Sales */}
            <div className="bg-white shadow rounded-2xl p-4">
                <h2 className="text-xl font-semibold mb-4">Product Wise Sales</h2>
                <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm bg-white">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left border-r text-sm font-semibold text-gray-700 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-4 text-center border-r text-sm font-semibold text-gray-700 uppercase tracking-wider">Quantity</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">Sales</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {paginatedProducts.map((item) => (   // ✅ use paginatedProducts not full array
                                <tr key={item.productId} className="transition-all duration-200">
                                    <td className="px-6 py-4 text-left text-sm font-medium text-gray-800 whitespace-nowrap">{item.productName}</td>
                                    <td className="px-6 py-4 text-center text-sm text-gray-700 font-medium">{item.totalQuantity}</td>
                                    <td className="px-6 py-4 text-right text-sm font-semibold text-green-600 whitespace-nowrap">₹ {Number(item.totalSales).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* ✅ Add pagination here */}
                <Pagination
                    currentPage={productsPage}
                    totalPages={totalProductPages}
                    onPageChange={setProductsPage}
                />
            </div>

            {/* 📅 Orders Table */}
            <div className="bg-white shadow rounded-2xl p-4">
                <h2 className="text-xl font-semibold mb-4">Orders</h2>
                <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm bg-white">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                            <tr>
                                <th className="px-6 py-4 border-r text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-4 border-r text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">Items</th>
                                <th className="px-6 py-4 border-r text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 border-r text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {paginatedOrders.length ? (   // ✅ use paginatedOrders not full array
                                paginatedOrders.map((order) => (
                                    <tr key={order.orderId} className="transition-all duration-200">
                                        <td className="px-6 py-4 border-r text-left text-sm font-medium text-gray-800 whitespace-nowrap">{order.orderId}</td>
                                        <td className="px-6 py-4 border-r text-center text-sm text-gray-700 font-medium">{order.totalItems}</td>
                                        <td className="px-6 py-4 border-r text-right text-sm font-semibold text-green-600 whitespace-nowrap">₹ {Number(order.totalAmount).toFixed(2)}</td>
                                        <td className="px-6 py-4 border-r text-center">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm text-gray-700 whitespace-nowrap">{new Date(order.date).toLocaleString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500 text-sm">No orders found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* ✅ Add pagination here */}
                <Pagination
                    currentPage={ordersPage}
                    totalPages={totalOrderPages}
                    onPageChange={setOrdersPage}
                />
            </div>

        </div>
    );
}

export default SalesReport;