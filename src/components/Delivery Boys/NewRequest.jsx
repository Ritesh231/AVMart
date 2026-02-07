import { FaSearch, FaTrash, FaEye,FaCheck, FaTimes } from "react-icons/fa";
import { IoFilter } from "react-icons/io5";
import { BsWallet2 } from "react-icons/bs";
import { SiTicktick } from "react-icons/si";
import { RxCrossCircled } from "react-icons/rx";
import { MdDeliveryDining } from "react-icons/md";

const users = Array.from({ length: 6 }).map((_, i) => ({
    name: "John Doe",
    date: "22/2/2026",
    contact: "+91 2222222222",
    email:"johndoe@gmail.com",
    items: [
        "/images/item1.png",
        "/images/item2.png",
        "/images/item3.png",
    ],
  
    vehicle: "MH20GH2341",
    action: "Send to Delivery",
}));

export default function UsersTable() {
    return (
        <>
          

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
                            <th className="p-3 text-left">Name</th>
                            <th className="p-3 text-left">Date</th>
                            <th className="p-3 text-left">Contact</th>
                            <th className="p-3 text-left">Vehicle Type</th>
                            <th className="p-3 text-left">Vehicle No</th>
                            <th className="p-3 text-left">Action</th>
                         
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id} className="border-t hover:bg-gray-50">
                                <td className="p-3">
                                    <input type="checkbox" />
                                </td>
                                <td className="p-3 font-medium">{u.name}</td>
                                <td className="p-3">{u.date}</td>
                              <td className="p-3">
  <div className="flex items-center gap-3">
    
    {/* Avatar */}
    <div className="h-9 w-9 rounded-full bg-blue-900 text-white flex items-center justify-center font-semibold text-sm">
      JD
    </div>

    {/* Name & Email */}
    <div className="leading-tight">
      <p className="text-sm font-medium text-gray-900">{u.contact}</p>
      <p className="text-xs text-gray-500">{u.email}</p>
    </div>

  </div>
</td>

                                <td className="p-3">
                                    <div className="flex items-center gap-2">
                                     <MdDeliveryDining size={24}/> Bike
                                    </div>
                                </td>
                               
                                <td className="p-3">
                                   
                                        {u.vehicle}
                               
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
    <button
      className="p-1 text-blue-900"
      title="View"
    >
      <FaEye size={18} />
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
