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
    const itemsPerPage = 12;

    const filterByDate = (txnDate) => {
        if (!txnDate) return true;

        const txn = new Date(txnDate);
        const now = new Date();

        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

        const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        switch (dateFilter) {
            case "Today":
                return txn >= startOfToday && txn < startOfTomorrow;

            case "Yesterday":
                return txn >= startOfYesterday && txn < startOfToday;

            case "This Month":
                return txn >= startOfMonth;

            case "Last Month":
                return txn >= startOfLastMonth && txn <= endOfLastMonth;

            case "Custom":
                if (!fromDate || !toDate) return true;

                const start = new Date(fromDate);
                const end = new Date(toDate);
                end.setHours(23, 59, 59, 999);

                return txn >= start && txn <= end;
            default:
                return true;
        }
    };

    const tabMapping = {
        Online: "online",
        Cash: "cod",
        Partial: "partial",
    };

    const {
        data,
        isLoading,
        isFetching,
        isError,
    } = useGetTransactionsOverviewQuery(tabMapping[activeTab]);

    const transactions = data?.list?.transactions || [];
    const filteredTransactions = transactions.filter((txn) => {
        const search = searchTerm.toLowerCase();

        const matchesSearch =
            txn.customer?.toLowerCase().includes(search) ||
            txn.orderId?.toLowerCase().includes(search) ||
            txn.shortOrderId?.toLowerCase().includes(search) ||
            txn.txnId?.toLowerCase().includes(search) ||
            txn.paymentDetails?.[0]?.id?.toLowerCase().includes(search);

        const matchesDate = filterByDate(txn.dateTime);

        return matchesSearch && matchesDate;
    });

    const totalItems = filteredTransactions.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);


    useEffect(() => {
        setSelectedTransactionIds([]);
    }, [activeTab, searchTerm, dateFilter, fromDate, toDate, transactions.length]);

    const selectedFilteredCount = filteredTransactions.filter((txn) =>
        selectedTransactionIds.includes(txn._id || txn.id)
    ).length;
    const isAllSelected =
        filteredTransactions.length > 0 &&
        selectedFilteredCount === filteredTransactions.length;
    const isSomeSelected = selectedFilteredCount > 0 && !isAllSelected;

    useEffect(() => {
        if (selectAllRef.current) {
            selectAllRef.current.indeterminate = isSomeSelected;
        }
    }, [isSomeSelected]);

    const toggleTransactionSelection = (id) => {
        setSelectedTransactionIds((prev) =>
            prev.includes(id) ? prev.filter((txnId) => txnId !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = (checked) => {
        if (checked) {
            setSelectedTransactionIds(paginatedTransactions.map((txn) => txn._id || txn.id));
            return;
        }
        setSelectedTransactionIds([]);
    };

    const getRowsForExport = () => {
        const selectedRows = filteredTransactions.filter((txn) =>
            selectedTransactionIds.includes(txn._id || txn.id)
        );
        const sourceRows = selectedRows.length > 0 ? selectedRows : filteredTransactions;
        if (!sourceRows.length) {
            return [];
        }
        return sourceRows.map((txn) => ({
            Tab: activeTab,
            Customer: txn.customer || "-",
            "Order ID": txn.orderId || txn.shortOrderId || "-",
            "Transaction ID": txn.txnId || txn.paymentDetails?.[0]?.id || "-",
            "Payment Method": txn.paymentMethod || "-",
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
        // {
        //     title: "Partial Payments",
        //     number: summary?.partial || "0",
        //     statement: "+ 12 % from last week",
        //     icon: <BadgeIndianRupee size={24} />,
        //     special: false
        // },
        {
            title: "Total Revenue",
            number: summary?.totalRevenue || "0",
            statement: "+ 12 % from last week",
            icon: <BadgeIndianRupee size={24} />,
            special: false
        }
    ];

    // const onlineTransaction = [
    //     {
    //         id: 1,
    //         customerName: "John Doe",
    //         date: "2026-02-05 10:30 AM",
    //         orderId: "ORD - 1234",
    //         transactionId: "TXN-123",
    //         paymentMethod: "UPI",
    //         amount: "1,250",
    //         status: "Success"
    //     },
    // ];
    // // Mock CashOnDelivery Transaction list
    // const CODTransaction = [
    //     {
    //         id: 1,
    //         customerName: "John Doe",
    //         date: "2026-02-05 10:30 AM",
    //         orderId: "ORD - 1234",
    //         CODId: "COD-123",
    //         deliveryBoy: "Rahul Sharma",
    //         amount: "1,250",
    //         status: "Completed"
    //     },
    // ];

    // const partialPaymentTransactions = [
    //     {
    //         id: "PAR-9012",
    //         customerName: "Anita Desai",
    //         orderId: "ORD-1239",
    //         deliveryBoy: "John Doe",
    //         totalAmount: 3500,
    //         currency: "₹",
    //         status: "Fully Paid",
    //         breakdown: {
    //             advance: {
    //                 label: "Advance Payment ( Partial )",
    //                 amount: 3500,
    //                 method: "UPI",
    //                 date: "20/12/2025",
    //                 time: "09:30 AM",
    //                 statusText: "Paid At Order Placement"
    //             },
    //             remaining: {
    //                 label: "Remaining Payment",
    //                 amount: 3500,
    //                 method: "Cash",
    //                 date: "20/12/2025",
    //                 time: "09:30 AM",
    //                 statusText: "Paid At Delivery"
    //             }
    //         }
    //     },

    //     {
    //         id: "PAR-9012",
    //         customerName: "Anita Desai",
    //         orderId: "ORD-1239",
    //         deliveryBoy: "John Doe",
    //         totalAmount: 3500,
    //         currency: "₹",
    //         status: "Fully Paid",
    //         breakdown: {
    //             advance: {
    //                 label: "Advance Payment ( Partial )",
    //                 amount: 3500,
    //                 method: "UPI",
    //                 date: "20/12/2025",
    //                 time: "09:30 AM",
    //                 statusText: "Paid At Order Placement"
    //             },
    //             remaining: {
    //                 label: "Remaining Payment",
    //                 amount: 3500, // Based on image total collection
    //                 method: "Cash",
    //                 date: "20/12/2025",
    //                 time: "09:30 AM",
    //                 statusText: "Paid At Delivery"
    //             }
    //         }
    //     },
    // ];

    // NOTE: Code for pyment type toggle button

    const tabs = [
        { id: 'Online', label: 'Online Payments', icon: <CreditCard size={20} /> },
        { id: 'Cash', label: 'Cash On Delivery', icon: <Wallet size={20} /> },
        { id: 'Partial', label: 'Partial Payments', icon: <Blocks size={20} /> }
    ];

    if (isLoading) {
        return (
            <div className="p-6">
                {/* Skeleton Heading */}
                <div className="animate-pulse mb-6">
                    <div className="h-6 bg-gray-300 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                </div>

                {/* Skeleton Stat Cards */}
                <section className="mb-6 bg-white border-2 border-[#62CDB999] rounded-[2.5rem] p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <StatCardSkeleton key={i} />
                        ))}
                    </div>
                </section>

                {/* Skeleton Payment Cards */}
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
    if (isError) return <p>Error loading payments</p>;

    return (
        <div className='p-6'>
            <section className="heading-and-btn-sec my-6 ">
                <h2>Payment</h2>
                <p className='text-[#9F9F9F] text-[0.92rem]'>Manage Payments</p>
            </section>

            {/* Stats Cards */}
            <section className="stat-card-sec mb-6 bg-white border-2 border-[#62CDB999] rounded-[2.5rem] p-6">
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

            {/* Payment filter button section*/}
            <section className="flex flex-col sm:flex-row bg-[#1E264F] p-2 my-6 rounded-xl gap-2  md:w-fit w-full shadow-lg">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 rounded-lg flex items-center gap-3 font-semibold transition-all duration-300 first:ml-0 
                        ${activeTab === tab.id
                                ? 'bg-[#00E5B0] text-white shadow-sm'
                                : 'bg-white text-[#1E264F] hover:bg-opacity-90'
                            }`}
                    >
                        {/* Icon inherits text color automatically */}
                        <span className={activeTab === tab.id ? 'text-white' : 'text-[#1E264F]'}>
                            {tab.icon}
                        </span>
                        {tab.label}
                    </button>
                ))}
            </section>

            <section className="bg-white border-2 border-brand-soft rounded-[2.5rem] p-6 shadow-sm overflow-hidden">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                    {/* Search Bar */}
                    <div className="w-full lg:w-[40%] md:w-[50%]">
                        <div className='flex items-center gap-2 bg-white border-2 border-brand-soft rounded-2xl p-3 focus-within:border-brand-teal transition-all'>
                            <Search className="text-brand-gray" size={20} />
                            <input
                                className='w-full bg-transparent border-none focus:ring-0 focus:outline-none text-brand-navy placeholder:text-brand-gray'
                                type="text"
                                placeholder='Search By Name, Order ID, Transaction ID'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Export Button */}
                    <div className='flex justify-evenly gap-2 items-center'>
                        <label className="inline-flex items-center gap-2 border border-brand-cyan rounded-xl px-3 py-2 text-sm font-semibold text-brand-navy bg-white whitespace-nowrap">
                            <input
                                ref={selectAllRef}
                                type="checkbox"
                                checked={isAllSelected}
                                onChange={(e) => toggleSelectAll(e.target.checked)}
                            />
                            Select All
                        </label>
                        {/* <button className='bg-brand-cyan  font-semibold text-brand-navy px-3 py-3 rounded-xl flex justify-center gap-2 items-center'>
                            <SlidersHorizontal size={20} />
                        </button> */}
                        <div className="flex items-center gap-3">
                            {/* Main Date Filter Dropdown */}
                            <div className="relative">
                                <select
                                    value={dateFilter}
                                    onChange={(e) => {
                                        setDateFilter(e.target.value);
                                        setFromDate("");
                                        setToDate("");
                                    }}
                                    className="appearance-none border-brand-cyan border-[1px] font-semibold text-brand-navy px-4 py-3 pr-10 rounded-2xl focus:outline-none bg-white cursor-pointer"
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
                                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-brand-navy"
                                />
                            </div>

                            {/* Custom Date Pickers */}
                            {dateFilter === "Custom" && (
                                <>
                                    {/* From Date */}
                                    <input
                                        type="date"
                                        value={fromDate}
                                        max={toDate || undefined}   // cannot select after end date
                                        onChange={(e) => {
                                            const selectedFrom = e.target.value;

                                            // If from date is after current to date → reset toDate
                                            if (toDate && selectedFrom > toDate) {
                                                setToDate("");
                                            }

                                            setFromDate(selectedFrom);
                                        }}
                                        className="border border-brand-soft px-3 py-2 rounded-xl"
                                    />

                                    <span className="text-gray-500">to</span>

                                    {/* To Date */}
                                    <input
                                        type="date"
                                        value={toDate}
                                        min={fromDate || undefined}  // cannot select before start date
                                        onChange={(e) => {
                                            const selectedTo = e.target.value;

                                            // Extra safety check
                                            if (fromDate && selectedTo < fromDate) {
                                                return;
                                            }

                                            setToDate(selectedTo);
                                        }}
                                        className="border border-brand-soft px-3 py-2 rounded-xl"
                                    />
                                </>
                            )}
                        </div>
                        <div className="relative">
                            <button
                                className='bg-brand-navy px-6 py-3 rounded-2xl flex justify-center gap-2 items-center text-white font-bold hover:bg-opacity-90 transition-all'
                                onClick={() => setIsExportMenuOpen((prev) => !prev)}
                            >
                                <Download size={20} /> Export
                            </button>
                            {isExportMenuOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border z-20">
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

                {
                    activeTab === "Online" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 w-full whitespace-break-spaces">
                            {isFetching
                                ? [...Array(6)].map((_, i) => (
                                    <PaymentCardSkeleton key={i} />
                                ))
                                : paginatedTransactions.map((txn) => (
                                    <div key={txn._id || txn.id} className="relative">
                                        <input
                                            type="checkbox"
                                            className="absolute top-3 left-3 z-10"
                                            checked={selectedTransactionIds.includes(txn._id || txn.id)}
                                            onChange={() => toggleTransactionSelection(txn._id || txn.id)}
                                        />
                                        <OnlinePaymentCard
                                            customerName={txn.customer}
                                            dateTime={txn.dateTime}
                                            orderId={txn.orderId}
                                            txnId={txn.txnId}
                                            paymentMethod={txn.paymentMethod}
                                            amount={txn.amount}
                                            status={txn.status}
                                        />
                                    </div>
                                ))
                            }
                        </div>
                    )
                }

                {/* --------------------------- */}

                {/* CashOnDelivery Payment Cards */}
                {activeTab === "Cash" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 whitespace-break-spaces">
                        {isFetching
                            ? [...Array(6)].map((_, i) => (
                                <PaymentCardSkeleton key={i} />
                            ))
                            : paginatedTransactions.map((txn) => (
                                <div key={txn._id || txn.id} className="relative">
                                    <input
                                        type="checkbox"
                                        className="absolute top-3 left-3 z-10"
                                        checked={selectedTransactionIds.includes(txn._id || txn.id)}
                                        onChange={() => toggleTransactionSelection(txn._id || txn.id)}
                                    />
                                    <CashOnDeliveryCard
                                        transaction={{
                                            id: txn.id,
                                            customer: txn.customer,
                                            date: new Date(txn.dateTime).toLocaleString(),
                                            status: txn.status.replaceAll("_", " "),
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

                {/* --------------------------- */}

                {activeTab === "Partial" && (
                    <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-1 gap-6">
                        {isFetching
                            ? [...Array(6)].map((_, i) => (
                                <PaymentCardSkeleton key={i} />
                            ))
                            : paginatedTransactions.map((txn) => {
                                const formattedTransaction = {
                                    id: txn.id,
                                    customerName: txn.customer,
                                    orderId: txn.shortOrderId,
                                    deliveryBoy: txn.deliveryBoy,
                                    totalAmount: txn.amount,
                                    currency: "₹",
                                    status: txn.status.replaceAll("_", " "),
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
                                    <div key={txn._id || txn.id} className="relative">
                                        <input
                                            type="checkbox"
                                            className="absolute top-3 left-3 z-10"
                                            checked={selectedTransactionIds.includes(txn._id || txn.id)}
                                            onChange={() => toggleTransactionSelection(txn._id || txn.id)}
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
            </section >

            <div className="flex justify-between items-center mt-6">
                <p className="text-sm text-gray-500">
                    Showing {startIndex + 1} - {Math.min(endIndex, totalItems)} of {totalItems}
                </p>

                <div className="flex gap-2">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Prev
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-brand-cyan text-white" : ""
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Payments
