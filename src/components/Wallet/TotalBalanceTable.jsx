
import { Download, Search, SlidersHorizontal } from 'lucide-react'
import { useGetWalletQuery } from "../../Redux/apis/walletApi";
import { useEffect, useRef, useState } from "react";

export default function UsersTable() {
    const { data, isLoading, isError } = useGetWalletQuery();
    const users = data?.data?.transactions || [];
    const [dateFilter, setDateFilter] = useState("Today");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTransactionIds, setSelectedTransactionIds] = useState([]);
    const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
    const selectAllRef = useRef(null);

    const dateFilteredUsers = users.filter((u) => {
        if (!u.date) return false;

        const transactionDate = new Date(u.date);
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        if (dateFilter === "Today") {
            return (
                transactionDate.toDateString() === today.toDateString()
            );
        }

        if (dateFilter === "Yesterday") {
            const yesterday = new Date();
            yesterday.setDate(today.getDate() - 1);
            return (
                transactionDate.toDateString() === yesterday.toDateString()
            );
        }

        if (dateFilter === "Last7Days") {
            const last7 = new Date();
            last7.setDate(today.getDate() - 7);
            return transactionDate >= last7 && transactionDate <= today;
        }

        if (dateFilter === "Custom" && fromDate && toDate) {
            const start = new Date(fromDate);
            const end = new Date(toDate);
            end.setHours(23, 59, 59, 999);

            return transactionDate >= start && transactionDate <= end;
        }
        return true;
    });

    const filteredUsers = dateFilteredUsers.filter((u) =>
        JSON.stringify(u || {}).toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        setSelectedTransactionIds([]);
    }, [users.length, dateFilter, fromDate, toDate, searchTerm]);

    const getRowId = (u, index) => u._id || u.id || `${u.date || "date"}-${u.user || "user"}-${index}`;
    const selectedFilteredCount = filteredUsers.filter((u, index) =>
        selectedTransactionIds.includes(getRowId(u, index))
    ).length;
    const isAllSelected =
        filteredUsers.length > 0 && selectedFilteredCount === filteredUsers.length;
    const isSomeSelected =
        selectedFilteredCount > 1 && selectedFilteredCount < filteredProducts.length;

    useEffect(() => {
        if (selectAllRef.current) {
            selectAllRef.current.indeterminate = isSomeSelected;
        }
    }, [isSomeSelected]);

    const toggleRowSelection = (id) => {
        setSelectedTransactionIds((prev) =>
            prev.includes(id) ? prev.filter((txnId) => txnId !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = (checked) => {
        if (checked) {
            setSelectedTransactionIds(filteredUsers.map((u, index) => getRowId(u, index)));
            return;
        }
        setSelectedTransactionIds([]);
    };

    const getRowsForExport = () => {
        const selectedRows = filteredUsers.filter((u, index) =>
            selectedTransactionIds.includes(getRowId(u, index))
        );
        const sourceRows = selectedRows.length > 0 ? selectedRows : filteredUsers;
        if (!sourceRows.length) {
            return [];
        }
        return sourceRows.map((u) => ({
            Date: u.date?.split("T")[0] || "-",
            User: u.user || "-",
            Reason: u.reason || "-",
            Amount: u.amount ?? "-"
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
        downloadBlob(csv, "wallet_transactions_export.csv", "text/csv;charset=utf-8;");
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
        if (!rows.length) return "";
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
        const html = getExportHtml("Wallet Transactions Export");
        if (!html) {
            setIsExportMenuOpen(false);
            return;
        }
        downloadBlob(html, "wallet_transactions_export.doc", "application/msword");
        setIsExportMenuOpen(false);
    };

    const exportToPdf = () => {
        const html = getExportHtml("Wallet Transactions Export");
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
          <title>Wallet Transactions Export</title>
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

    return (
        <>
            {/* Search & Actions */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                {/* Search Bar */}
                <div className="w-full lg:w-[40%] md:w-[50%]">
                    <div className='flex items-center gap-2 bg-white border-2 border-brand-soft rounded-2xl p-3 focus-within:border-brand-teal transition-all'>
                        <Search className="text-brand-gray" size={20} />
                        <input
                            className='w-full bg-transparent border-none focus:ring-0 focus:outline-none text-brand-navy placeholder:text-brand-gray'
                            type="text"
                            placeholder='Search By Name or ID'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Export Button */}
                <div className='flex justify-evenly gap-2 items-center'>
                    {/* <button className='bg-brand-cyan  font-semibold text-brand-navy px-3 py-3 rounded-xl flex justify-center gap-2 items-center'>
                        <SlidersHorizontal size={20} />
                    </button> */}
                    <div className="flex items-center gap-2">
                        <select
                            value={dateFilter}
                            onChange={(e) => {
                                setDateFilter(e.target.value);
                                setFromDate("");
                                setToDate("");
                            }}
                            className="border border-brand-cyan px-4 py-3 rounded-2xl font-semibold text-brand-navy"
                        >
                            <option value="Today">Today</option>
                            <option value="Yesterday">Yesterday</option>
                            <option value="Last7Days">Last 7 Days</option>
                            <option value="Custom">Custom Range</option>
                        </select>

                        {dateFilter === "Custom" && (
                            <>
                                <input
                                    type="date"
                                    value={fromDate}
                                    max={toDate || undefined}
                                    onChange={(e) => {
                                        const selected = e.target.value;
                                        if (toDate && selected > toDate) setToDate("");
                                        setFromDate(selected);
                                    }}
                                    className="border px-3 py-2 rounded-xl"
                                />

                                <span>to</span>

                                <input
                                    type="date"
                                    value={toDate}
                                    min={fromDate || undefined}
                                    onChange={(e) => {
                                        const selected = e.target.value;
                                        if (fromDate && selected < fromDate) return;
                                        setToDate(selected);
                                    }}
                                    className="border px-3 py-2 rounded-xl"
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
                                <button onClick={exportToPdf} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">PDF</button>
                                <button onClick={exportToDoc} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">DOC</button>
                                <button onClick={exportToExcel} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Excel</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border overflow-x-auto">
                <table className="min-w-[900px] w-full text-sm">

                    <thead className="bg-[#F1F5F9] text-gray-600">
                        <tr>
                            <th className="p-3">
                                <input
                                    ref={selectAllRef}
                                    type="checkbox"
                                    checked={isAllSelected}
                                    onChange={(e) => toggleSelectAll(e.target.checked)}
                                />
                            </th>
                            <th className="p-3 text-left">Date</th>
                            <th className="p-3 text-left">User</th>
                            <th className="p-3 text-left">Reason</th>
                            <th className="p-3 text-left">Amount</th>
                        </tr>
                    </thead>

                    <tbody>
                        {isLoading ? (
                            Array.from({ length: 6 }).map((_, index) => (
                                <tr key={index} className="border-t animate-pulse">
                                    <td className="p-3">
                                        <div className="h-4 w-4 bg-gray-200 rounded"></div>
                                    </td>
                                    <td className="p-3">
                                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                                    </td>
                                    <td className="p-3">
                                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                                    </td>
                                    <td className="p-3">
                                        <div className="h-4 w-48 bg-gray-200 rounded"></div>
                                    </td>
                                    <td className="p-3">
                                        <div className="h-4 w-20 bg-gray-200 rounded"></div>
                                    </td>
                                </tr>
                            ))
                        ) : users.length > 0 ? (
                            filteredUsers.map((u) => (
                                <tr key={getRowId(u)} className="border-t hover:bg-gray-50">
                                    <td className="p-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedTransactionIds.includes(getRowId(u))}
                                            onChange={() => toggleRowSelection(getRowId(u))}
                                        />
                                    </td>
                                    <td className="p-3 font-medium">
                                        {u.date?.split("T")[0]}
                                    </td>
                                    <td className="p-3 font-medium">{u.user}</td>
                                    <td className="p-3">{u.reason}</td>
                                    <td
                                        className={`p-3 font-semibold ${u.amount < 0 ? "text-red-500" : "text-emerald-600"
                                            }`}
                                    >
                                        ₹{u.amount}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            // 🔥 No Data State
                            <tr>
                                <td colSpan="5" className="text-center py-10 text-gray-500">
                                    No Transactions Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}
