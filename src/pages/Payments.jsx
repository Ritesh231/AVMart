import { ArrowDown, BadgeIndianRupee, Blocks, ChartColumnIncreasing, ChevronDown, CircleDashed, CreditCard, Download, FileText, HandCoins, Search, SlidersHorizontal, Upload, Wallet, WalletMinimal } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import StatCard from '../components/StatCard'
import OnlinePaymentCard from '../components/payment/OnlinePaymentCard';
import CashOnDeliveryCard from '../components/payment/CashOnDeliveryCard';
import PartialPaymentCard from '../components/payment/PartialPaymentCard';
import { useGetTransactionsOverviewQuery } from "../Redux/apis/paymentApi";

const Payments = () => {
    const [activeTab, setActiveTab] = useState('Online');
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState("All");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [selectedTransactionIds, setSelectedTransactionIds] = useState([]);
    const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
    const selectAllRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);

    const tabMapping = {
        Online: "online",
        Cash: "cod",
        Partial: "partial",
    };

    // Pass pagination parameters to API
    const {
        data,
        isLoading,
        isFetching,
        isError,
    } = useGetTransactionsOverviewQuery({
        tab: tabMapping[activeTab],  // This returns "online", "cod", or "partial" (string)
        page: currentPage,
        limit: itemsPerPage
    });

    const transactions = data?.list?.transactions || [];
    const pagination = data?.list?.pagination || {
        page: currentPage,
        per_page: itemsPerPage,
        total: 0,
        total_pages: 0,
        has_next_page: false,
        has_prev_page: false
    };

    // Client-side filtering (search and date) on current page data
    const filteredTransactions = transactions.filter((txn) => {
        const search = searchTerm.toLowerCase();

        const matchesSearch =
            txn.customer?.toLowerCase().includes(search) ||
            txn.shortOrderId?.toLowerCase().includes(search) ||
            txn.txnId?.toLowerCase().includes(search) ||
            txn.paymentDetails?.[0]?.id?.toLowerCase().includes(search);

        const matchesDate = (() => {
            if (!txn.dateTime) return true;
            const txnDate = new Date(txn.dateTime);
            const now = new Date();

            const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const startOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
            const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

            switch (dateFilter) {
                case "Today":
                    return txnDate >= startOfToday && txnDate < startOfTomorrow;
                case "Yesterday":
                    return txnDate >= startOfYesterday && txnDate < startOfToday;
                case "This Month":
                    return txnDate >= startOfMonth;
                case "Last Month":
                    return txnDate >= startOfLastMonth && txnDate <= endOfLastMonth;
                case "Custom":
                    if (!fromDate || !toDate) return true;
                    const start = new Date(fromDate);
                    const end = new Date(toDate);
                    end.setHours(23, 59, 59, 999);
                    return txnDate >= start && txnDate <= end;
                default:
                    return true;
            }
        })();

        return matchesSearch && matchesDate;
    });

    const totalItems = pagination.total;
    const totalPages = pagination.total_pages;

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, searchTerm, dateFilter, fromDate, toDate]);

    useEffect(() => {
        setSelectedTransactionIds([]);
    }, [activeTab, searchTerm, dateFilter, fromDate, toDate, currentPage]);

    const selectedFilteredCount = filteredTransactions.filter((txn) =>
        selectedTransactionIds.includes(txn.id)
    ).length;
    const isAllSelected =
        filteredTransactions.length > 0 &&
        selectedFilteredCount === filteredTransactions.length;

    const isSomeSelected = selectedFilteredCount > 0 && !isAllSelected;

    // useEffect(() => {
    //     if (selectAllRef.current) {
    //         selectAllRef.current.indeterminate = isSomeSelected;
    //     }
    // }, [isSomeSelected]);

    const toggleTransactionSelection = (id) => {
        setSelectedTransactionIds((prev) =>
            prev.includes(id) ? prev.filter((txnId) => txnId !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = (checked) => {
        if (checked) {
            setSelectedTransactionIds(filteredTransactions.map((txn) => txn.id));
            return;
        }
        setSelectedTransactionIds([]);
    };

    const getRowsForExport = () => {
        // For export, we need to fetch all data or use current filtered data
        // This exports only current page data
        const selectedRows = filteredTransactions.filter((txn) =>
            selectedTransactionIds.includes(txn.id)
        );
        const sourceRows = selectedRows.length > 0 ? selectedRows : filteredTransactions;
        if (!sourceRows.length) {
            return [];
        }
        return sourceRows.map((txn) => ({
            Tab: activeTab,
            Customer: txn.customer || "-",
            "Order ID": txn.shortOrderId || "-",
            "Transaction ID": txn.txnId || txn.paymentDetails?.[0]?.id || "-",
            "Payment Method": txn.method || "-",
            Amount: txn.amount ?? "-",
            "Paid Online": txn.paidOnline ?? "-",
            "Paid Cash": txn.paidCash ?? "-",
            Remaining: txn.remaining ?? "-",
            Status: txn.status?.replaceAll("_", " ") || "-",
            Date: txn.dateTime ? new Date(txn.dateTime).toLocaleString() : "-",
            "Delivery Boy": txn.deliveryBoy?.name || "Not Assigned"
        }));
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

    const exportToExcel = () => {
        const rows = getRowsForExport();
        if (!rows.length) {
            setIsExportMenuOpen(false);
            return;
        }
        const headers = Object.keys(rows[0]);
        const csv = [
            headers.join(","),
            ...rows.map((row) =>
                headers
                    .map((header) => `"${String(row[header]).replace(/"/g, '""')}"`)
                    .join(",")
            )
        ].join("\n");
        downloadBlob(csv, `${activeTab.toLowerCase()}_payments_export.csv`, "text/csv;charset=utf-8;");
        setIsExportMenuOpen(false);
    };

    const toSafeHtml = (value) =>
        String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");

    const getExportHtml = (title) => {
        const rows = getRowsForExport();
        if (!rows.length) {
            return "";
        }
        const headers = Object.keys(rows[0]);
        const tableHead = headers.map((header) => `<th>${toSafeHtml(header)}</th>`).join("");
        const tableRows = rows
            .map(
                (row) =>
                    `<tr>${headers
                        .map((header) => `<td>${toSafeHtml(row[header])}</td>`)
                        .join("")}</tr>`
            )
            .join("");

        return `
      <html>
        <head><meta charset="utf-8" /></head>
        <body>
          <h2>${toSafeHtml(title)}</h2>
          <table border="1" cellspacing="0" cellpadding="6">
            <thead><tr>${tableHead}</tr></thead>
            <tbody>${tableRows}</tbody>
          </table>
        </body>
      </html>`;
    };

    const exportToDoc = () => {
        const html = getExportHtml(`${activeTab} Payments Export`);
        if (!html) {
            setIsExportMenuOpen(false);
            return;
        }
        downloadBlob(html, `${activeTab.toLowerCase()}_payments_export.doc`, "application/msword");
        setIsExportMenuOpen(false);
    };

    const exportToPdf = () => {
        const html = getExportHtml(`${activeTab} Payments Export`);
        if (!html) {
            setIsExportMenuOpen(false);
            return;
        }

        const printWindow = window.open("", "_blank");
        if (!printWindow) {
            setIsExportMenuOpen(false);
            return;
        }

        printWindow.document.write(`
      <html>
        <head>
          <title>${activeTab} Payments Export</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { margin-bottom: 12px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background: #f2f2f2; }
          </style>
        </head>
        <body>
          ${html.match(/<body>([\s\S]*)<\/body>/)?.[1] || ""}
        </body>
      </html>
    `);

        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        setIsExportMenuOpen(false);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const summary = data?.summary || {};

    const StatCardSkeleton = () => {
        return (
            <div className="animate-pulse bg-gray-100 p-6 rounded-2xl">
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            </div>
        );
    };

    const PaymentCardSkeleton = () => {
        return (
            <div className="animate-pulse bg-gray-100 p-6 rounded-2xl">
                <div className="h-5 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="space-y-3">
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-300 rounded w-4/6"></div>
                </div>
                <div className="h-8 bg-gray-300 rounded w-1/3 mt-6"></div>
            </div>
        );
    };

    const paymentTypeStat = [
        {
            title: "Online Payments",
            number: summary?.online || "0",
            statement: "+ 12 % from last Month",
            icon: <BadgeIndianRupee size={24} />,
            special: true
        },
        {
            title: "Cash On Delivery",
            number: summary?.cod || "0",
            statement: "+ 12 % from last week",
            icon: <BadgeIndianRupee size={24} />,
            special: false
        },
        {
            title: "Total Revenue",
            number: summary?.totalRevenue || "0",
            statement: "+ 12 % from last week",
            icon: <BadgeIndianRupee size={24} />,
            special: false
        }
    ];

    const tabs = [
        { id: 'Online', label: 'Online Payments', icon: <CreditCard size={20} /> },
        { id: 'Cash', label: 'Cash On Delivery', icon: <Wallet size={20} /> },
        { id: 'Partial', label: 'Partial Payments', icon: <Blocks size={20} /> }
    ];

    // Calculate display range
    const startItem = (pagination.page - 1) * pagination.per_page + 1;
    const endItem = Math.min(pagination.page * pagination.per_page, pagination.total);

    // Render pagination buttons
    const renderPaginationButtons = () => {
        const maxButtons = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxButtons - 1);

        if (endPage - startPage + 1 < maxButtons) {
            startPage = Math.max(1, endPage - maxButtons + 1);
        }

        const pages = [];
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages.map((page) => (
            <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all
                    ${currentPage === page
                        ? "bg-gradient-to-r from-[#FD610D] to-[#FF8800] text-white shadow-md"
                        : "bg-gray-100 text-[#1E264F] hover:bg-gray-200"
                    }`}
            >
                {page}
            </button>
        ));
    };

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="animate-pulse mb-6">
                    <div className="h-6 bg-gray-300 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                </div>
                <section className="mb-6 bg-white border-2 border-[#0F172A]/20 rounded-[2.5rem] p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[...Array(3)].map((_, i) => (
                            <StatCardSkeleton key={i} />
                        ))}
                    </div>
                </section>
                <section className="bg-white border-2 border-brand-soft rounded-[2.5rem] p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <PaymentCardSkeleton key={i} />
                        ))}
                    </div>
                </section>
            </div>
        );
    }

    console.log("Active tab:", activeTab);
    console.log("Mapped tab value:", tabMapping[activeTab]);
    console.log("API params:", { tab: tabMapping[activeTab], page: currentPage, limit: itemsPerPage });

    if (isError) return <p>Error loading payments</p>;

    return (
        <div className='p-6'>
            <section className="heading-and-btn-sec my-2 ">
                <h2>Payment</h2>
                <p className='text-[#9F9F9F] text-[0.92rem]'>Manage Payments</p>
            </section>

            {/* Stats Cards */}
            <section className="stat-card-sec mb-6 bg-white border-2 border-[#0F172A]/20 rounded-[2.5rem] p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {paymentTypeStat.map((stat, index) => (
                        <StatCard
                            key={index}
                            title={stat.title}
                            number={stat.number}
                            statement={stat.statement}
                            icon={stat.icon}
                            variant={stat.special ? 'special' : 'normal'}
                        />
                    ))}
                </div>
            </section>

            {/* Payment filter button section */}
            <section className="flex flex-col sm:flex-row bg-[#1E264F] p-2 my-6 rounded-xl gap-2 md:w-fit w-full shadow-lg">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            setActiveTab(tab.id);
                            setCurrentPage(1);
                        }}
                        className={`px-6 py-3 rounded-lg flex items-center gap-3 font-semibold transition-all duration-300 first:ml-0 
                        ${activeTab === tab.id
                                ? 'bg-gradient-to-r from-[#FD610D] to-[#FF8800] text-white shadow-sm'
                                : 'bg-white text-[#1E264F] hover:bg-opacity-90'
                            }`}
                    >
                        <span className={activeTab === tab.id ? 'text-white' : 'text-[#1E264F]'}>
                            {tab.icon}
                        </span>
                        {tab.label}
                    </button>
                ))}
            </section>

            <section className="bg-white border-2 border-[#0F172A]/20  rounded-[2.5rem] p-6 shadow-sm overflow-hidden">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">

                    {/* 🔍 Search Bar */}
                    <div className="w-full lg:w-[40%]">
                        <div className="flex items-center gap-2 bg-white border-2 border-brand-soft rounded-2xl p-3 focus-within:border-brand-teal transition-all">
                            <Search className="text-brand-gray" size={20} />
                            <input
                                className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-brand-navy placeholder:text-brand-gray"
                                type="text"
                                placeholder="Search By Name, Order ID, Transaction ID"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* 🔧 Right Controls */}
                    <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full lg:w-auto">

                        {/* ✅ Select All */}
                        <label className="flex items-center justify-center sm:justify-start gap-2 
    border border-brand-cyan rounded-xl px-3 py-2 text-sm font-semibold 
    text-brand-navy bg-white w-full sm:w-auto">
                            <input
                                ref={selectAllRef}
                                type="checkbox"
                                checked={isAllSelected}
                                onChange={(e) => toggleSelectAll(e.target.checked)}
                            />
                            Select All
                        </label>

                        {/* 📅 Date Filter + Inputs */}
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">

                            {/* Dropdown */}
                            <div className="relative w-full sm:w-auto">
                                <select
                                    value={dateFilter}
                                    onChange={(e) => {
                                        setDateFilter(e.target.value);
                                        setFromDate("");
                                        setToDate("");
                                    }}
                                    className="w-full appearance-none border border-brand-cyan font-semibold 
          text-brand-navy px-4 py-3 pr-12 rounded-2xl focus:outline-none bg-white cursor-pointer"
                                >
                                    <option value="All">All</option>
                                    <option value="Today">Today</option>
                                    <option value="Yesterday">Yesterday</option>
                                    <option value="This Month">This Month</option>
                                    <option value="Last Month">Last Month</option>
                                    <option value="Custom">Custom Range</option>
                                </select>

                                <ChevronDown
                                    size={18}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-navy"
                                />
                            </div>

                            {/* Custom Date Inputs */}
                            {dateFilter === "Custom" && (
                                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                    <input
                                        type="date"
                                        value={fromDate}
                                        max={toDate || undefined}
                                        onChange={(e) => {
                                            const selectedFrom = e.target.value;
                                            if (toDate && selectedFrom > toDate) setToDate("");
                                            setFromDate(selectedFrom);
                                        }}
                                        className="w-full border border-brand-soft px-3 py-2 rounded-xl"
                                    />

                                    <span className="hidden sm:flex items-center text-gray-500">to</span>

                                    <input
                                        type="date"
                                        value={toDate}
                                        min={fromDate || undefined}
                                        onChange={(e) => {
                                            const selectedTo = e.target.value;
                                            if (fromDate && selectedTo < fromDate) return;
                                            setToDate(selectedTo);
                                        }}
                                        className="w-full border border-brand-soft px-3 py-2 rounded-xl"
                                    />
                                </div>
                            )}
                        </div>

                        {/* 📤 Export Button */}
                        <div className="relative w-full sm:w-auto">
                            <button
                                className="w-full sm:w-auto bg-brand-navy px-4 py-3 rounded-2xl 
        flex justify-center gap-2 items-center text-white font-bold hover:bg-opacity-90 transition-all"
                                onClick={() => setIsExportMenuOpen((prev) => !prev)}
                            >
                                <Download size={20} />
                                Export
                            </button>

                            {isExportMenuOpen && (
                                <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 
        w-full sm:w-40 bg-white rounded-xl shadow-lg border z-20">
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

                {/* Online Payments */}
                {activeTab === "Online" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 w-full whitespace-break-spaces">
                        {isFetching
                            ? [...Array(6)].map((_, i) => (
                                <PaymentCardSkeleton key={i} />
                            ))
                            : filteredTransactions.map((txn) => (
                                <div key={txn.id} className="relative">
                                    <input
                                        type="checkbox"
                                        className="absolute top-3 left-3 z-10"
                                        checked={selectedTransactionIds.includes(txn.id)}
                                        onChange={() => toggleTransactionSelection(txn.id)}
                                    />
                                    <OnlinePaymentCard
                                        customerName={txn.customer}
                                        dateTime={txn.dateTime}
                                        orderId={txn.shortOrderId}
                                        txnId={txn.txnId}
                                        paymentMethod={txn.method}
                                        amount={txn.amount}
                                        status={txn.status}
                                    />
                                </div>
                            ))
                        }
                    </div>
                )}

                {/* Cash On Delivery Payments */}
                {activeTab === "Cash" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 whitespace-break-spaces">
                        {isFetching
                            ? [...Array(6)].map((_, i) => (
                                <PaymentCardSkeleton key={i} />
                            ))
                            : filteredTransactions.map((txn) => (
                                <div key={txn.id} className="relative">
                                    <input
                                        type="checkbox"
                                        className="absolute top-3 left-3 z-10"
                                        checked={selectedTransactionIds.includes(txn.id)}
                                        onChange={() => toggleTransactionSelection(txn.id)}
                                    />
                                    <CashOnDeliveryCard
                                        transaction={{
                                            id: txn.id,
                                            customer: txn.customer,
                                            date: new Date(txn.dateTime).toLocaleString(),
                                            status: txn.status?.replaceAll("_", " "),
                                            orderId: txn.shortOrderId,
                                            CODId: txn.paymentDetails?.[0]?.id,
                                            deliveryBoy: txn.deliveryBoy?.name || "Not Assigned",
                                            amount: txn.amount,
                                        }}
                                    />
                                </div>
                            ))
                        }
                    </div>
                )}

                {/* Partial Payments */}
                {activeTab === "Partial" && (
                    <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-1 gap-6">
                        {isFetching
                            ? [...Array(6)].map((_, i) => (
                                <PaymentCardSkeleton key={i} />
                            ))
                            : filteredTransactions.map((txn) => {
                                const formattedTransaction = {
                                    id: txn.id,
                                    customerName: txn.customer,
                                    orderId: txn.shortOrderId,
                                    deliveryBoy: txn.deliveryBoy,
                                    totalAmount: txn.amount,
                                    currency: "₹",
                                    status: txn.status?.replaceAll("_", " "),
                                    breakdown: {
                                        advance: {
                                            label: "Advance Payment (Online)",
                                            amount: txn.paidOnline,
                                            method: "Online",
                                            date: new Date(txn.dateTime).toLocaleDateString(),
                                            time: new Date(txn.dateTime).toLocaleTimeString(),
                                            statusText: "Paid at Order Placement"
                                        },
                                        remaining: {
                                            label: "Remaining Payment (Cash)",
                                            amount: txn.paidCash,
                                            method: "Cash",
                                            date: new Date(txn.dateTime).toLocaleDateString(),
                                            time: new Date(txn.dateTime).toLocaleTimeString(),
                                            statusText: txn.remaining > 0 ? "Pending at Delivery" : "Paid at Delivery"
                                        }
                                    }
                                };

                                return (
                                    <div key={txn.id} className="relative">
                                        <input
                                            type="checkbox"
                                            className="absolute top-3 left-3 z-10"
                                            checked={selectedTransactionIds.includes(txn.id)}
                                            onChange={() => toggleTransactionSelection(txn.id)}
                                        />
                                        <PartialPaymentCard
                                            transaction={formattedTransaction}
                                        />
                                    </div>
                                );
                            })
                        }
                    </div>
                )}
            </section>

            {/* Pagination Controls */}
            {pagination.total > 0 && (
                <div className="flex justify-between items-center mt-6">
                    <p className="text-sm text-center items-center text-gray-600 hidden md:block">
                        Showing {startItem} to {endItem} of {pagination.total} transactions
                    </p>

                    <div className="flex gap-2 items-center">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={!pagination.has_prev_page}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1
                                ${!pagination.has_prev_page
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-[#1E264F] text-white hover:bg-opacity-90"
                                }`}
                        >
                            Prev
                        </button>

                        {renderPaginationButtons()}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={!pagination.has_next_page}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1
                                ${!pagination.has_next_page
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
    )
}

export default Payments