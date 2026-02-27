
import { ArrowDown, BadgeIndianRupee, Blocks, ChartColumnIncreasing, ChevronDown, CircleDashed, CreditCard, Download, FileText, HandCoins, Search, SlidersHorizontal, Upload, Wallet, WalletMinimal } from 'lucide-react'
import { useGetWalletQuery } from "../../Redux/apis/walletApi";
import { useState } from "react";

const users = Array.from({ length: 6 }).map((_, i) => ({
    date: "20/02/26",
    user: "johhn doe",
    reason: "Cashback-5 items",
    amount: "7,689",
}));

export default function UsersTable() {
    const { data, isLoading, isError } = useGetWalletQuery();
    const users = data?.data?.transactions || [];
    const [dateFilter, setDateFilter] = useState("Today");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    
    const filteredUsers = users.filter((u) => {
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
                        />
                    </div>
                </div>

                {/* Export Button */}
                <div className='flex justify-evenly gap-2 items-center'>
                    <button className='bg-brand-cyan  font-semibold text-brand-navy px-3 py-3 rounded-xl flex justify-center gap-2 items-center'>
                        <SlidersHorizontal size={20} />
                    </button>
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
                    <button className='bg-brand-navy px-6 py-3 rounded-2xl flex justify-center gap-2 items-center text-white font-bold hover:bg-opacity-90 transition-all'>
                        <Download size={20} /> Export
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border overflow-x-auto">
                <table className="min-w-[900px] w-full text-sm">

                    <thead className="bg-[#F1F5F9] text-gray-600">
                        <tr>
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
                                <tr key={u.id} className="border-t hover:bg-gray-50">
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
                                <td colSpan="4" className="text-center py-10 text-gray-500">
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
