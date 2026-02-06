import { FaSearch, FaTrash, FaEye, FaCheck, FaTimes } from "react-icons/fa";
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
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-4 bg-[#1A2550] p-2 rounded-lg w-full sm:w-fit">
                {["Pending", "Confirmed", "Out For Delivery", "Delivered", "Rejected"].map((tab) => (
                    <button
                        key={tab}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold ${tab === "Pending"
                            ? "bg-[#00BFA6] text-white"
                            : "bg-white text-gray-600"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Search & Actions */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <div className="relative w-full md:w-96">
                    <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
                    <input
                        type="text"
                        placeholder="Search By Shop Name, Location or Type"
                        className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm outline-none"
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <button className="flex-1 md:flex-none px-4 py-2 bg-[#00E9BE] border rounded-lg text-lg">
                        <IoFilter />
                    </button>
                    <button className="flex-1 md:flex-none px-4 py-2 bg-white border rounded-lg text-sm">
                        All Type
                    </button>
                    <button className="flex-1 md:flex-none px-4 py-2 bg-[#1E3A8A] text-white rounded-lg text-sm">
                        Export
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
                                     bg-[#57FB6830] border border-[#03C616] text-[#22FF00] text-sm font-semibold">
                                        {u.status}
                                    </span>
                                </td>
                                 <td className="p-3">{u.placed}</td>
                                <td className="p-3 whitespace-nowrap">
                                    <div className="flex items-center gap-1">
                                    
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
