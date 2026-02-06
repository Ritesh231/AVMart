import { FaSearch, FaTrash, FaEye } from "react-icons/fa";
import { IoFilter } from "react-icons/io5";
import { BsWallet2 } from "react-icons/bs";

const users = Array.from({ length: 6 }).map((_, i) => ({
    id: "#12345",
    shop: "Medicovr Citycare Medical Shop",
    price: "450",
    placed: "20/12/2025",
    items: [
        "/images/item1.png",
        "/images/item2.png",
        "/images/item3.png",
    ],
    email: "sarahchen@gmail.com",
    payment: "Online",
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
                            <th className="p-3 text-left">Order ID</th>
                            <th className="p-3 text-left">Shop Info</th>
                            <th className="p-3 text-left">Price</th>
                            <th className="p-3 text-left">Placed On</th>
                            <th className="p-3 text-left">Items</th>
                            <th className="p-3 text-left">Payment</th>
                            <th className="p-3 text-left">Delivery Boy</th>
                         
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id} className="border-t hover:bg-gray-50">
                                <td className="p-3">
                                    <input type="checkbox" />
                                </td>
                                <td className="p-3 font-medium">{u.id}</td>
                                <td className="p-3 font-medium">{u.shop}</td>
                                <td className="p-3">{u.price}</td>
                                <td className="p-3">{u.placed}</td>
                                <td className="p-3">
                                    <div className="flex items-center gap-2">
                                        {u.items?.slice(0, 3).map((img, index) => (
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
                                     bg-[#57FB6830] border border-[#03C616] text-[#03C616] text-sm font-semibold">
                                        <BsWallet2 className="text-[#03C616]" />
                                        {u.payment}
                                    </span>
                                </td>
                                <td className="inline-flex items-center gap-2 px-3 py-2 mt-2 whitespace-nowrap bg-[#1A2550] w-32 text-white rounded-md">{u.action}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
