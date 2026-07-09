import React, { useState, useRef, useEffect } from "react";
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

    // ✅ Separate selection state for each table
    const [selectedOrderIds, setSelectedOrderIds] = useState([]);
    const [selectedProductIds, setSelectedProductIds] = useState([]);

    const selectAllOrdersRef = useRef(null);
    const selectAllProductsRef = useRef(null);
    const exportMenuRef = useRef(null);

    const ITEMS_PER_PAGE = 10;

    const { data, isLoading, isFetching } = useGetTotalRevenueQuery(filters, {
        refetchOnMountOrArgChange: true,
    });

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        if (key === "filterType") {
            setOrdersPage(1);
            setProductsPage(1);
        }
    };

    const orders = data?.Data || [];
    const productRevenue = data?.productWiseRevenue || [];

    const paginatedOrders = [...orders]
        .reverse()
        .slice((ordersPage - 1) * ITEMS_PER_PAGE, ordersPage * ITEMS_PER_PAGE);

    const paginatedProducts = [...productRevenue]
        .reverse()
        .slice((productsPage - 1) * ITEMS_PER_PAGE, productsPage * ITEMS_PER_PAGE);

    const totalOrderPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
    const totalProductPages = Math.ceil(productRevenue.length / ITEMS_PER_PAGE);

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

    // ✅ Indeterminate state for Orders header checkbox
    useEffect(() => {
        if (selectAllOrdersRef.current) {
            const some = paginatedOrders.some((o) => selectedOrderIds.includes(o.orderId));
            selectAllOrdersRef.current.indeterminate = some && !isAllOrdersSelected;
        }
    }, [selectedOrderIds, paginatedOrders, isAllOrdersSelected]);

    // ✅ Indeterminate state for Products header checkbox
    useEffect(() => {
        if (selectAllProductsRef.current) {
            const some = paginatedProducts.some((p) => selectedProductIds.includes(p.productId));
            selectAllProductsRef.current.indeterminate = some && !isAllProductsSelected;
        }
    }, [selectedProductIds, paginatedProducts, isAllProductsSelected]);
    const getOrderRowsForExport = () => {
        let filtered = orders;

        if (selectedOrderIds.length > 0) {
            filtered = orders.filter((o) =>
                selectedOrderIds.includes(o.orderId)
            );
        }

        if (!filtered.length) {
            toast.info("No order data available to export");
            return [];
        }

        return [...filtered].reverse().map((order, index) => ({
            "S.No": index + 1,
            "Order ID": order.orderId
                ? order.orderId.slice(-5)
                : "-",
            Date: order.date
                ? new Date(order.date).toLocaleString("en-IN")
                : "-",
            "Total Amount": `₹${Number(order.totalAmount || 0).toFixed(2)}`,
        }));
    };

    const getProductRowsForExport = () => {
        let filtered = productRevenue;
        if (selectedProductIds.length > 0) {
            filtered = productRevenue.filter((p) => selectedProductIds.includes(p.productId));
        }
        if (!filtered.length) {
            toast.info("No product data available to export");
            return [];
        }
        return [...filtered].reverse().map((item, index) => ({
            "S.No": index + 1,
            Product: item.productName || "-",
            Quantity: item.totalQuantity || 0,
            Revenue: `₹${Number(item.totalRevenue || 0).toFixed(2)}`,
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

    const buildTablesContent = (productRows, orderRows) => {
        const createTable = (rows, heading) => {
            if (!rows.length) return "";
            const headers = Object.keys(rows[0]);
            return `
        <h3 style="margin-top:30px">${heading}</h3>
        <table>
            <thead>
                <tr>
                    ${headers.map(h => `<th>${h}</th>`).join("")}
                </tr>
            </thead>
            <tbody>
                ${rows.map(row => `
                    <tr>
                        ${headers.map(h => `<td>${row[h] ?? "-"}</td>`).join("")}
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;
        };

        return `
        ${createTable(productRows, "Product Wise Revenue")}
        ${createTable(orderRows, "Orders")}
    `;
    };

    // New helper — builds ONE valid HTML document (used by both Doc and PDF export)
    const buildHtmlDocument = (title, innerContent, isWord = false) => {
        const wordNamespaces = isWord
            ? `xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"`
            : "";

        return `<!DOCTYPE html>
<html ${wordNamespaces}>
<head>
    <meta charset="utf-8"/>
    <title>${title}</title>
    <style>
        body{ font-family:Arial,sans-serif; padding:20px; }
        h2{ text-align:center; }
        h3{ margin-top:30px; }
        table{ width:100%; border-collapse:collapse; margin-top:10px; }
        th,td{ border:1px solid #ccc; padding:8px; text-align:left; }
        th{ background:#f5f5f5; }
    </style>
</head>
<body>
    <h2>${title}</h2>
    ${innerContent}
</body>
</html>`;
    };

    const exportToExcel = () => {
        const orderRows = getOrderRowsForExport();
        const productRows = getProductRowsForExport();

        if (!orderRows.length && !productRows.length) return;

        let csv = "";

        if (productRows.length) {
            csv += "PRODUCT WISE REVENUE\n";
            csv += buildCsv(productRows);
            csv += "\n\n";
        }

        if (orderRows.length) {
            csv += "ORDERS\n";
            csv += buildCsv(orderRows);
        }

        downloadBlob(
            csv,
            `revenue_report_${new Date().toISOString().split("T")[0]}.csv`,
            "text/csv;charset=utf-8;"
        );

        setIsExportMenuOpen(false);
    };

    // exportToDoc — now builds ONE document, no nesting
    const exportToDoc = () => {
        const orderRows = getOrderRowsForExport();
        const productRows = getProductRowsForExport();

        if (!orderRows.length && !productRows.length) return;

        const content = buildTablesContent(productRows, orderRows);
        const html = buildHtmlDocument("Revenue Report", content, true); // true = add Word namespaces

        downloadBlob(
            html,
            `revenue_report_${new Date().toISOString().split("T")[0]}.doc`,
            "application/msword"
        );

        setIsExportMenuOpen(false);
    };

    // exportToPdf — same fix, no Word namespaces needed for print
    const exportToPdf = () => {
        const orderRows = getOrderRowsForExport();
        const productRows = getProductRowsForExport();
        if (!orderRows.length && !productRows.length) return;

        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        const content = buildTablesContent(productRows, orderRows);
        const html = buildHtmlDocument("Revenue Report", content, false);

        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        setIsExportMenuOpen(false);
    };

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
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#1E264F] text-white hover:bg-opacity-90"}`}
                    >Prev</button>
                    {[...Array(totalPages)].map((_, i) => {
                        const p = i + 1;
                        return (
                            <button key={p} onClick={() => onPageChange(p)}
                                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${currentPage === p ? "bg-gradient-to-r from-[#FD610D] to-[#FF8800] text-white shadow-md" : "bg-gray-100 text-[#1E264F] hover:bg-gray-200"}`}>
                                {p}
                            </button>
                        );
                    })}
                    <button
                        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#1E264F] text-white hover:bg-opacity-90"}`}
                    >Next</button>
                </div>
            </div>
        );
    };

    const TableSkeleton = ({ rows = 5, columns = 3 }) => (
        <div className="overflow-x-auto animate-pulse">
            <table className="min-w-full">
                <thead className="bg-gray-100">
                    <tr>{Array.from({ length: columns }).map((_, i) => (
                        <th key={i} className="px-6 py-4"><div className="h-4 bg-gray-300 rounded w-24"></div></th>
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
        { title: "Total Orders", number: data?.totalOrders || 0, icon: <IoCartOutline size={24} />, variant: "special" },
        { title: "Total Revenue", number: `₹${Number(data?.totalRevenue || 0).toFixed(2)}`, icon: <IoCashOutline size={24} />, variant: "normal" },
    ];

    if (isLoading) {
        return (
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(2)].map((_, i) => <StatCardSkeleton key={i} />)}
                </div>
                <ReportTab />
                <div className="bg-white shadow rounded-2xl p-4"><TableSkeleton /></div>
                <div className="bg-white shadow rounded-2xl p-4"><TableSkeleton /></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <section>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stats.map((item, i) => (
                        <StatCard key={i} title={item.title} number={item.number} icon={item.icon} variant={item.variant} />
                    ))}
                </div>
            </section>

            <ReportTab />

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <h2 className="text-xl font-bold">Total Revenue Report</h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex flex-wrap items-center gap-3 border border-brand-cyan rounded-xl px-3 py-2">
                        <select value={filters.filterType} onChange={(e) => handleFilterChange("filterType", e.target.value)}
                            className="outline-none bg-transparent text-sm font-medium cursor-pointer px-2 py-1 min-w-[140px]">
                            <option value="all">All</option>
                            <option value="week">Week</option>
                            <option value="month">Month</option>
                            <option value="custom">Custom Range</option>
                        </select>
                        {filters.filterType === "custom" && (
                            <div className="flex items-center gap-2 flex-wrap">
                                <input type="date" value={filters.fromDate}
                                    onChange={(e) => handleFilterChange("fromDate", e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none" />
                                <span className="text-gray-400 text-sm">to</span>
                                <input type="date" value={filters.toDate}
                                    onChange={(e) => handleFilterChange("toDate", e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none" />
                            </div>
                        )}
                    </div>
                    <div ref={exportMenuRef} className="relative">
                        <button onClick={() => setIsExportMenuOpen((prev) => !prev)}
                            className="bg-brand-navy px-5 py-3 rounded-xl flex items-center gap-2 text-white font-semibold hover:bg-opacity-90 transition-all">
                            <Download size={18} /> Export <ChevronDown size={16} />
                        </button>
                        {isExportMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-0 overflow-hidden">
                                <button onClick={exportToExcel} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50">Export Excel</button>
                                <button onClick={exportToPdf} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50">Export PDF</button>
                                {/* <button onClick={exportToDoc} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50">Export DOC</button> */}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isFetching && <div className="text-sm text-gray-500">Updating report...</div>}

            {/* ✅ Product Wise Revenue Table */}
            <div className="bg-white shadow rounded-2xl p-4">
                <h2 className="text-xl font-semibold mb-4">Product Wise Revenue</h2>
                <div className="bg-white rounded-xl border overflow-x-auto">
                    <table className="min-w-[600px] w-full text-sm">
                        <thead className="bg-[#F1F5F9] text-gray-600 text-xs">
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
                                <th className="p-3 text-right">Revenue</th>
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
                                        <td className="p-3 text-gray-600">
                                            {(productsPage - 1) * ITEMS_PER_PAGE + index + 1}
                                        </td>
                                        <td className="p-3">
                                            <div className="flex justify-center">
                                                <div className="w-[180px] text-left text-gray-800 font-medium">
                                                    {item.productName}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-3 text-center text-gray-700">{item.totalQuantity}</td>
                                        <td className="p-3 text-right font-semibold text-green-600">
                                            ₹{Number(item.totalRevenue).toFixed(2)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-10 text-gray-500 font-medium">
                                        No revenue data found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination currentPage={productsPage} totalPages={totalProductPages} onPageChange={setProductsPage} />
            </div>

            {/* ✅ Orders Table */}
            <div className="bg-white shadow rounded-2xl p-4">
                <h2 className="text-xl font-semibold mb-4">Orders</h2>
                <div className="bg-white rounded-xl border overflow-x-auto">
                    <table className="min-w-[600px] w-full text-sm">
                        <thead className="bg-[#F1F5F9] text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="w-12 p-3 text-center align-middle">
                                    <input ref={selectAllOrdersRef} type="checkbox"
                                        checked={isAllOrdersSelected}
                                        onChange={(e) => toggleSelectAllOrders(e.target.checked)} />
                                </th>
                                <th className="p-3 text-left">Sr No.</th>
                                <th className="p-3 text-center">Order ID</th>
                                <th className="p-3 text-center">Date</th>
                                <th className="p-3 text-right">Amount</th>
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
                                        <td className="p-3 text-gray-600">
                                            {(ordersPage - 1) * ITEMS_PER_PAGE + index + 1}
                                        </td>
                                        <td className="p-3 font-medium text-blue-600 text-center">
                                            {order.orderId?.slice(-5)}
                                        </td>
                                        <td className="p-3 text-center text-gray-500">
                                            {new Date(order.date).toLocaleString("en-IN")}
                                        </td>
                                        <td className="p-3 text-right font-semibold text-green-600">
                                            ₹{Number(order.totalAmount).toFixed(2)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-10 text-gray-500 font-medium">
                                        No orders found
                                    </td>
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

export default RevenueReport;