import { FaSearch, FaTrash, FaEye, FaCheck, FaTimes } from "react-icons/fa";
import { ArrowDown, BadgeIndianRupee, Blocks, ChartColumnIncreasing, ChevronDown, CircleDashed, CreditCard, Download, FileText, HandCoins, Search, SlidersHorizontal, Upload, Wallet, WalletMinimal } from 'lucide-react'
import { IoFilter } from "react-icons/io5";
import { BsWallet2 } from "react-icons/bs";
import { SiTicktick } from "react-icons/si";
import { RxCrossCircled } from "react-icons/rx";

const users = Array.from({ length: 6 }).map((_, i) => ({
    id: "#12345",
    name: "Sarah Chen",
    email: "sarahchen@gmail.com",
    contact:"+91 8585202202",
    message:"Hi, I haven't received my order yet. Can you help?",
    shop: "Medicovr Citycare Medical Shop",
    price: "450",
    placed: "20/12/2025",
    status: "Contacted",
    action: "Send to Delivery",
}));

export default function UsersTable() {
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
                                placeholder='Search By User Name and Phone no'
                            />
                        </div>
                    </div>

                    {/* Export Button */}
                    <div className='flex justify-evenly gap-2 items-center'>
                        <button className='bg-brand-cyan  font-semibold text-brand-navy px-3 py-3 rounded-xl flex justify-center gap-2 items-center'>
                            <SlidersHorizontal size={20} />
                        </button>
                        <button className='border-brand-cyan border-[1px] font-semibold text-brand-navy px-3 py-3 rounded-2xl flex justify-center gap-2 items-center'>
                            <p>Today’s</p> <ChevronDown size={20} />
                        </button>
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
                            <th className="p-3"></th>
                            <th className="p-3 text-left">Customer</th>
                            <th className="p-3 text-left">Contact</th>
                            <th className="p-3 text-left">Message</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Date</th>
                            <th className="p-3 text-left">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id} className="border-t hover:bg-gray-50">
                                <td className="p-3">
                                    <input type="checkbox" />
                                </td>
                                <td className="p-3">
                                    <div className="flex items-center gap-3">
                                        {/* Avatar */}
                                        <div className="h-9 w-9 rounded-full bg-blue-900 text-white flex items-center justify-center font-semibold text-sm">
                                            SC
                                        </div>
                                        
                                        {/* Name & Email */}
                                        <div className="leading-tight">
                                            <p className="text-sm font-medium text-gray-900">{u.name}</p>
                                            <p className="text-xs text-gray-500">{u.email}</p>
                                        </div>
                                    </div>
                                </td>

                                <td className="p-3 font-medium">{u.contact}</td>
                                <td className="p-3 w-48 break-words">{u.message}</td>
                               
                               

                                <td className="p-3">
                                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl
                                     bg-[#FFDD00]/10 border border-[#FFDD00] text-[#FFDD00] text-sm font-semibold">
                                        {u.status}
                                    </span>
                                </td>
                                 <td className="p-3">{u.placed}</td>
                                <td className="p-3 whitespace-nowrap">
                                    <div className="flex items-center gap-1">
                                    <button className="bg-[#1A2550] text-white p-2 rounded-lg">Mark as Contacted</button>
                                        {/* Reject */}
                                        <button
                                            className="p-1 text-red-600 bg-white"
                                            title="Reject"
                                        >
                                           <FaTrash size={18} />
                                        </button>

                                    </div>
                                </td>


                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
