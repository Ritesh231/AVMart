import { FaSearch, FaTrash, FaEye, FaEdit } from "react-icons/fa";
import { IoFilter } from "react-icons/io5";
import { BsWallet2 } from "react-icons/bs";
import { MdDelete } from "react-icons/md";


const users = Array.from({ length: 6 }).map((_, i) => ({
    id: "#12345",
    name: "Face Care",
    price: "450",
    placed: "20/12/2025",
    items: [
        "/images/item1.png",
    ],
    categoryname: "Online",
    products:"145",
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
                        className={`px-4 py-2 rounded-lg text-sm font-semibold ${tab === "Approved"
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
                            <th className="p-3 text-left">Subcategory ID</th>
                            <th className="p-3 text-left">Subcategory Name</th>
                            <th className="p-3 text-left">Image</th>
                            <th className="p-3 text-left">Category Name</th>
                            <th className="p-3 text-left">Products</th>
                            <th className="p-3 text-left">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id} className="border-t hover:bg-gray-50">
                                <td className="p-3">
                                    <input type="checkbox" />
                                </td>
                                <td className="p-3 font-medium">{u.id}</td>
                                <td className="p-3 font-medium">{u.name}</td>
                               <td className="p-3">
                                    <div className="flex items-center gap-2">
                                        {u.items?.slice(0).map((img, index) => (
                                            <img
                                                key={index}
                                                src={img}
                                                alt="item"
                                                className="w-8 h-8 rounded-md object-cover border"
                                            />
                                        ))}
                                    </div>
                                </td>                              
                                <td className="p-3">
                                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl
                                     bg-[#8A9FF324] border border-[#0B97ED] text-[#0B97ED] text-sm font-semibold">
                                        {u.categoryname}
                                    </span>
                                </td>
                                <td className="p-3">{u.products}</td>
                                <td className="p-3 whitespace-nowrap">
                                 <div className="flex items-center gap-1">
                                   {/* Approve */}
                                   <button
                                     className="p-1 text-blue-600 bg-white"
                                     title="Approve"
                                   >
                                     <FaEdit size={18} />
                                   </button>
                               
                                   {/* Reject */}
                                   <button
                                     className="p-1 text-red-600 bg-white"
                                     title="Reject"
                                   >
                                     <MdDelete size={18} />
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
