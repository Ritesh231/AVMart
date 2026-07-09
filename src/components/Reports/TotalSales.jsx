import React, { useState, useRef, useEffect } from "react";
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
            if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
            for (let i = start; i <= end; i++) pages.push(i);
        }
        return pages;
    };

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 px-4 py-4 bg-white border-t">
            <p className="text-sm text-gray-600">Page {currentPage} of {totalPages}</p>
            <div className="flex items-center gap-2 flex-wrap justify-center">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#1E264F] text-white hover:bg-opacity-90"}`}
                >Prev</button>

                {getPageNumbers().map((page) => (
                    <button key={page} onClick={() => onPageChange(page)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${currentPage === page ? "bg-gradient-to-r from-[#FD610D] to-[#FF8800] text-white" : "bg-gray-100 text-[#1E264F] hover:bg-gray-200"}`}>
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#1E264F] text-white hover:bg-opacity-90"}`}
                >Next</button>
            </div>
        </div>
    );
};

function SalesReport() {
    const [filters, setFilters] = useState({ filterType: "month", fromDate: "", toDate: "" });
    const [ordersPage, setOrdersPage] = useState(1);
    const [productsPage, setProductsPage] = useState(1);
    const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

    // ✅ Separate selection state for each table
    const [selectedOrderIds, setSelectedOrderIds] = useState([]);
    const [selectedProductIds, setSelectedProductIds] = useState([]);
    const selectAllOrdersRef = useRef(null);
    const selectAllProductsRef = useRef(null);
    const exportMenuRef = useRef(null);

    const { data, isLoading } = useGetTotalSalesQuery(filters, { refetchOnMountOrArgChange: true });

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setOrdersPage(1);
        setProductsPage(1);
    };

    const orders = data?.Data || [];
    const products = data?.productWiseSales || [];

    const paginatedOrders = [...orders].reverse().slice((ordersPage - 1) * ITEMS_PER_PAGE, ordersPage * ITEMS_PER_PAGE);
    const paginatedProducts = [...products].reverse().slice((productsPage - 1) * ITEMS_PER_PAGE, productsPage * ITEMS_PER_PAGE);

    const totalOrderPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
    const totalProductPages = Math.ceil(products.length / ITEMS_PER_PAGE);

    // ✅ Orders checkbox logic
    const isAllOrdersSelected =
        paginatedOrders.length > 0 &&
        paginatedOrders.every((o) => selectedOrderIds.includes(o.orderId));

    const toggleSelectAllOrders = (checked) => {
        const ids = paginatedOrders.map((o) => o.orderId);
        if (checked) {
            setSelectedOrderIds((prev) => [...new Set([...prev, ...ids])]);
        } else {
            setSelectedOrderIds((prev) => prev.filter((id) => !ids.includes(id)));
        }
    };

    const toggleOrderSelection = (id) => {
        setSelectedOrderIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    // ✅ Products checkbox logic
    const isAllProductsSelected =
        paginatedProducts.length > 0 &&
        paginatedProducts.every((p) => selectedProductIds.includes(p.productId));

    const toggleSelectAllProducts = (checked) => {
        const ids = paginatedProducts.map((p) => p.productId);
        if (checked) {
            setSelectedProductIds((prev) => [...new Set([...prev, ...ids])]);
        } else {
            setSelectedProductIds((prev) => prev.filter((id) => !ids.includes(id)));
        }
    };

    const toggleProductSelection = (id) => {
        setSelectedProductIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

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

    // ✅ Indeterminate state for Orders
    useEffect(() => {
        if (selectAllOrdersRef.current) {
            const some = paginatedOrders.some((o) => selectedOrderIds.includes(o.orderId));
            selectAllOrdersRef.current.indeterminate = some && !isAllOrdersSelected;
        }
    }, [selectedOrderIds, paginatedOrders, isAllOrdersSelected]);

    // ✅ Indeterminate state for Products
    useEffect(() => {
        if (selectAllProductsRef.current) {
            const some = paginatedProducts.some((p) => selectedProductIds.includes(p.productId));
            selectAllProductsRef.current.indeterminate = some && !isAllProductsSelected;
        }
    }, [selectedProductIds, paginatedProducts, isAllProductsSelected]);

    // ✅ Export filters by selectedOrderIds
    const getOrderRowsForExport = () => {
        let filtered = orders;
        if (selectedOrderIds.length > 0) {
            filtered = orders.filter((o) => selectedOrderIds.includes(o.orderId));
        }
        if (!filtered.length) {
            toast.info("No sales order data available to export");
            return [];
        }
        return [...filtered].reverse().map((order, index) => ({
            "S.No": index + 1,
            "Order ID": order.orderId
                ? String(order.orderId).slice(-5)
                : "-",
            Date: order.date ? new Date(order.date).toLocaleString("en-IN") : "-",
            Items: order.totalItems || 0,
            Amount: `₹${Number(order.totalAmount || 0).toFixed(2)}`,
            Status: order.status || "-",
        }));
    };

    // ✅ Export filters by selectedProductIds
    const getProductRowsForExport = () => {
        let filtered = products;
        if (selectedProductIds.length > 0) {
            filtered = products.filter((p) => selectedProductIds.includes(p.productId));
        }
        if (!filtered.length) {
            toast.info("No product sales data available to export");
            return [];
        }
        return [...filtered].reverse().map((item, index) => ({
            "S.No": index + 1,
            Product: item.productName || "-",
            Quantity: item.totalQuantity || 0,
            Sales: `₹${Number(item.totalSales || 0).toFixed(2)}`,
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

    const buildCsv = (rows) => {
        const headers = Object.keys(rows[0]);
        return [
            headers.join(","),
            ...rows.map((row) =>
                headers.map((h) => `"${String(row[h] ?? "").replace(/"/g, '""')}"`).join(",")
            ),
        ].join("\n");
    };

    const buildHtmlTable = (rows, title) => {
        const headers = Object.keys(rows[0]);
        const tableHead = headers.map((h) => `<th>${h}</th>`).join("");
        const tableRows = rows
            .map((row) => `<tr>${headers.map((h) => `<td>${row[h] ?? "-"}</td>`).join("")}</tr>`)
            .join("");
        return `<html><head><meta charset="utf-8"/><title>${title}</title>
        <style>body{font-family:Arial,sans-serif;padding:20px}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #ccc;padding:8px;text-align:left}th{background:#f5f5f5}</style>
        </head><body><h2>${title}</h2><table><thead><tr>${tableHead}</tr></thead><tbody>${tableRows}</tbody></table></body></html>`;
    };

    const exportToExcel = () => {
        const orderRows = getOrderRowsForExport();
        const productRows = getProductRowsForExport();

        // ✅ Export whichever has data (or both)
        if (!orderRows.length && !productRows.length) return;

        let csvContent = "";

        if (orderRows.length) {
            const headers = Object.keys(orderRows[0]);
            csvContent += "Orders\n";
            csvContent += headers.join(",") + "\n";
            csvContent += orderRows.map((row) =>
                headers.map((h) => `"${String(row[h] ?? "").replace(/"/g, '""')}"`).join(",")
            ).join("\n");
            csvContent += "\n\n";
        }

        if (productRows.length) {
            const headers = Object.keys(productRows[0]);
            csvContent += "Product Wise Sales\n";
            csvContent += headers.join(",") + "\n";
            csvContent += productRows.map((row) =>
                headers.map((h) => `"${String(row[h] ?? "").replace(/"/g, '""')}"`).join(",")
            ).join("\n");
        }

        downloadBlob(csvContent, `sales_report_${new Date().toISOString().split("T")[0]}.csv`, "text/csv;charset=utf-8;");
        setIsExportMenuOpen(false);
    };

    const exportToDoc = () => {
        const orderRows = getOrderRowsForExport();
        const productRows = getProductRowsForExport();
        if (!orderRows.length && !productRows.length) return;

        const buildSection = (rows, title) => {
            if (!rows.length) return "";
            const headers = Object.keys(rows[0]);
            const tableHead = headers.map((h) => `<th>${h}</th>`).join("");
            const tableRows = rows.map((row) =>
                `<tr>${headers.map((h) => `<td>${row[h] ?? "-"}</td>`).join("")}</tr>`
            ).join("");
            return `<h3>${title}</h3><table><thead><tr>${tableHead}</tr></thead><tbody>${tableRows}</tbody></table><br/>`;
        };

        const html = `<html><head><meta charset="utf-8"/><title>Sales Report</title>
        <style>body{font-family:Arial,sans-serif;padding:20px}table{width:100%;border-collapse:collapse;margin-top:10px}th,td{border:1px solid #ccc;padding:8px;text-align:left}th{background:#f5f5f5}h3{margin-top:20px}</style>
        </head><body><h2>Sales Report</h2>
        ${buildSection(orderRows, "Orders")}
        ${buildSection(productRows, "Product Wise Sales")}
        </body></html>`;

        downloadBlob(html, `sales_report_${new Date().toISOString().split("T")[0]}.doc`, "application/msword");
        setIsExportMenuOpen(false);
    };

    const exportToPdf = () => {
        const orderRows = getOrderRowsForExport();
        const productRows = getProductRowsForExport();
        if (!orderRows.length && !productRows.length) return;

        const buildSection = (rows, title) => {
            if (!rows.length) return "";
            const headers = Object.keys(rows[0]);
            const tableHead = headers.map((h) => `<th>${h}</th>`).join("");
            const tableRows = rows.map((row) =>
                `<tr>${headers.map((h) => `<td>${row[h] ?? "-"}</td>`).join("")}</tr>`
            ).join("");
            return `<h3>${title}</h3><table><thead><tr>${tableHead}</tr></thead><tbody>${tableRows}</tbody></table><br/>`;
        };

        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        printWindow.document.write(`<html><head><title>Sales Report</title>
        <style>body{font-family:Arial,sans-serif;padding:20px}table{width:100%;border-collapse:collapse;margin-top:10px}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f3f4f6}h3{margin-top:20px}</style>
        </head><body><h2>Sales Report</h2>
        ${buildSection(orderRows, "Orders")}
        ${buildSection(productRows, "Product Wise Sales")}
        </body></html>`);

        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        setIsExportMenuOpen(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "cancelled": return "bg-red-100 text-red-600";
            case "pending": return "bg-yellow-100 text-yellow-600";
            case "assigned": return "bg-blue-100 text-blue-600";
            case "confirmed": return "bg-green-100 text-green-600";
            default: return "bg-gray-100 text-gray-600";
        }
    };

    const stats = [
        { title: "Total Orders", number: data?.totalOrders || 0, icon: <IoCartOutline size={24} />, variant: "special" },
        { title: "Total Sales", number: `₹${Number(data?.totalSales || 0).toFixed(2)}`, icon: <IoCashOutline size={24} />, variant: "normal" },
        { title: "Total Quantity", number: data?.totalQuantity || 0, icon: <IoPieChartOutline size={24} />, variant: "normal" },
    ];

    if (isLoading) {
        return (
            <div className="p-6 space-y-6">
                <section>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[...Array(3)].map((_, index) => <StatCardSkeleton key={index} />)}
                    </div>
                </section>
                <ReportTab />
                <div className="bg-white shadow rounded-2xl p-4"><TableSkeleton rows={5} columns={3} /></div>
                <div className="bg-white shadow rounded-2xl p-4"><TableSkeleton rows={6} columns={6} /></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">

            {/* 📊 Summary */}
            <section className="stat-card-sec">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
                    {stats.map((item, index) => (
                        <StatCard key={index} title={item.title} number={item.number} icon={item.icon} variant={item.variant} />
                    ))}
                </div>
            </section>

            <ReportTab />

            {/* 🔍 Filters + Export */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <h2 className="text-xl font-bold">Total Sales</h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex flex-wrap items-center gap-3 border border-brand-cyan rounded-xl px-3 py-2">
                        <select value={filters.filterType} onChange={(e) => handleFilterChange("filterType", e.target.value)}
                            className="outline-none bg-transparent text-sm font-medium cursor-pointer px-2 py-1 min-w-[140px]">
                            <option value="">All</option>
                            <option value="week">Week</option>
                            <option value="month">Month</option>
                            <option value="custom">Custom Range</option>
                        </select>
                        {filters.filterType === "custom" && (
                            <div className="flex items-center gap-2 flex-wrap">
                                <input type="date" value={filters.fromDate}
                                    onChange={(e) => handleFilterChange("fromDate", e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan" />
                                <span className="text-gray-400 text-sm">to</span>
                                <input type="date" value={filters.toDate}
                                    onChange={(e) => handleFilterChange("toDate", e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan" />
                            </div>
                        )}
                    </div>
                    <div ref={exportMenuRef} className="relative">
                        <button onClick={() => setIsExportMenuOpen((prev) => !prev)}
                            className="bg-brand-navy px-5 py-3 rounded-xl flex items-center gap-2 text-white font-semibold hover:bg-opacity-90 transition-all whitespace-nowrap">
                            <Download size={18} /> Export <ChevronDown size={16} />
                        </button>
                        {isExportMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-0 overflow-hidden">
                                <button onClick={exportToExcel} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors">Export Excel</button>
                                <button onClick={exportToPdf} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors">Export PDF</button>
                                <button onClick={exportToDoc} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors">Export DOC</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 📦 Product Wise Sales */}
            <div className="bg-white shadow rounded-2xl p-4">
                <h2 className="text-xl font-semibold mb-4">Product Wise Sales</h2>
                <div className="bg-white rounded-xl border overflow-x-auto">
                    <table className="min-w-[600px] w-full text-sm">
                        <thead className="bg-[#F1F5F9] text-gray-600  text-xs">
                            <tr>
                                <th className="w-12 p-3 text-center align-middle">
                                    <input ref={selectAllProductsRef} type="checkbox"
                                        checked={isAllProductsSelected}
                                        onChange={(e) => toggleSelectAllProducts(e.target.checked)} />
                                </th>
                                <th className="p-3 text-left">Sr No.</th>
                                <th className="p-3">
                                    <div className="flex justify-center">
                                        <div className="w-[180px] text-left">
                                            Product
                                        </div>
                                    </div>
                                </th>
                                <th className="p-3 text-center">Quantity</th>
                                <th className="p-3 text-right">Sales</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedProducts.length ? (
                                paginatedProducts.map((item, index) => (
                                    <tr key={item.productId} className="border-t hover:bg-gray-50">
                                        <td className="w-12 p-3 text-center align-middle">
                                            <input type="checkbox"
                                                checked={selectedProductIds.includes(item.productId)}
                                                onChange={() => toggleProductSelection(item.productId)}
                                                onClick={(e) => e.stopPropagation()} />
                                        </td>
                                        <td className="p-3 text-gray-600">{(productsPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                                        <td className="p-3">
                                            <div className="flex justify-center w-full">
                                                <div className="w-full max-w-[200px] text-left text-gray-800 font-medium">
                                                    {item.productName}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-3 text-center text-gray-700">{item.totalQuantity}</td>
                                        <td className="p-3 text-right font-semibold text-green-600">
                                            ₹{Number(item.totalSales).toFixed(2)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-10 text-gray-500 font-medium">No products found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination currentPage={productsPage} totalPages={totalProductPages} onPageChange={setProductsPage} />
            </div>

            {/* 📅 Orders Table */}
            <div className="bg-white shadow rounded-2xl p-4">
                <h2 className="text-xl font-semibold mb-4">Orders</h2>
                <div className="bg-white rounded-xl border overflow-x-auto">
                    <table className="min-w-[900px] w-full text-sm">
                        <thead className="bg-[#F1F5F9] text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="w-12 p-3 text-center align-middle">
                                    <input ref={selectAllOrdersRef} type="checkbox"
                                        checked={isAllOrdersSelected}
                                        onChange={(e) => toggleSelectAllOrders(e.target.checked)} />
                                </th>
                                <th className="p-3 text-left">Sr No.</th>
                                <th className="p-3 text-center">Order ID</th>
                                <th className="p-3 text-center">Items</th>
                                <th className="p-3 text-right">Amount</th>
                                <th className="p-3 text-center">Status</th>
                                <th className="p-3 text-center">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedOrders.length ? (
                                paginatedOrders.map((order, index) => (
                                    <tr key={order.orderId} className="border-t hover:bg-gray-50">
                                        <td className="w-12 p-3 text-center align-middle">
                                            <input type="checkbox"
                                                checked={selectedOrderIds.includes(order.orderId)}
                                                onChange={() => toggleOrderSelection(order.orderId)}
                                                onClick={(e) => e.stopPropagation()} />
                                        </td>
                                        <td className="p-3 text-gray-600">{(ordersPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                                        <td className="p-3 font-medium text-blue-600 text-center">
                                            {order.orderId?.slice(-5)}
                                        </td>
                                        <td className="p-3 text-center text-gray-700">{order.totalItems}</td>
                                        <td className="p-3 text-right font-semibold text-green-600">
                                            ₹{Number(order.totalAmount).toFixed(2)}
                                        </td>
                                        <td className="p-3 text-center">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-3 text-center text-gray-500 whitespace-nowrap">
                                            {new Date(order.date).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-10 text-gray-500 font-medium">No orders found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination currentPage={ordersPage} totalPages={totalOrderPages} onPageChange={setOrdersPage} />
            </div>

        </div>
    );
}

export default SalesReport;