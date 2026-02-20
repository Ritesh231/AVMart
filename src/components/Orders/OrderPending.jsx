import { FaSearch, FaTrash, FaEye, FaCheck, FaTimes } from "react-icons/fa";
import { ArrowDown, BadgeIndianRupee, Blocks, ChartColumnIncreasing, ChevronDown, CircleDashed, CreditCard, Download, FileText, HandCoins, Search, SlidersHorizontal, Upload, Wallet, WalletMinimal } from 'lucide-react'
import { IoFilter } from "react-icons/io5";
import { BsWallet2 } from "react-icons/bs";
import { SiTicktick } from "react-icons/si";
import { RxCrossCircled } from "react-icons/rx";
import { Link } from "react-router-dom";
import { useGetallordersQuery } from "../../Redux/apis/ordersApi";

// const users = Array.from({ length: 6 }).map((_, i) => ({
//     id: "#12345",
//     shop: "Medicovr Citycare Medical Shop",
//     price: "450",
//     placed: "20/12/2025",
//     items: [
//         "/images/item1.png",
//         "/images/item2.png",
//         "/images/item3.png",
//     ],
//     email: "sarahchen@gmail.com",
//     payment: "Online",
//     action: "Send to Delivery",
// }));

export default function UsersTable() {
    const { data, isLoading, isError } = useGetallordersQuery();
    const users = data?.orders || [];

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
                            placeholder='Search By Orders'
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
                            <th className="p-3 text-left">Order ID</th>
                            <th className="p-3 text-left">Shop Info</th>
                            <th className="p-3 text-left">Price</th>
                            <th className="p-3 text-left">Placed On</th>
                            <th className="p-3 text-left">Items</th>
                            <th className="p-3 text-left">Payment Method</th>
                            <th className="p-3 text-left">Action</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {users.map((u) => (
                            <tr key={u._id} className="border-t hover:bg-gray-50">
                                <td className="p-3">
                                    <input type="checkbox" />
                                </td>
                                <td className="p-3 font-medium">{u._id?.slice(-5)}</td>
                                <td className="p-3 font-medium">{u.shopInfo?.name}</td>
                                <td className="p-3">{u.price}</td>
                                <td className="p-3">{u.placedOn}</td>
                                <td className="p-3">
                                    <div className="flex items-center gap-2">
                                        {u.itemsPreview?.slice(0, 3).map((item, index) => (
                                            <img
                                                key={index}
                                                src={item.image}
                                                alt="item"
                                                className="w-8 h-8 rounded-md object-cover border"
                                            />
                                        ))}
                                    </div>
                                </td>
                                <td className="p-3">
                                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl
                                     bg-[#57FB6830] border border-[#03C616] text-[#03C616] text-sm font-semibold">
                                        <BsWallet2 className="text-[#03C616]" />
                                        {u.paymentMethod}
                                    </span>
                                </td>
                                <td className="p-3 whitespace-nowrap">
                                    <div className="flex items-center gap-1">
                                        {/* Approve */}
                                        <button
                                            className="p-1 text-green-600 bg-white"
                                            title="Approve"
                                        >
                                            <SiTicktick size={18} />
                                        </button>

                                        {/* Reject */}
                                        <button
                                            className="p-1 text-red-600 bg-white"
                                            title="Reject"
                                        >
                                            <RxCrossCircled size={18} />
                                        </button>

                                        {/* View */}
                                        <Link to="/order/details">
                                            <button
                                                className="p-1 text-blue-900"
                                                title="View"
                                            >
                                                <FaEye size={18} />
                                            </button>
                                        </Link>
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
