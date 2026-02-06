import { FaSearch, FaTrash, FaEye } from "react-icons/fa";
import { IoFilter } from "react-icons/io5";

const users = Array.from({ length: 6 }).map((_, i) => ({
  id: i,
  shop: "Medicovr Citycare Medical Shop",
  owner: "Sarah Chen",
  location: "Sambhajinagar",
  phone: "+91 2222 2222",
  email: "sarahchen@gmail.com",
  type: "Medical",
  joined: "20/12/2025",
}));

export default function UsersTable() {
  return (
    <>
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4 bg-[#1A2550] p-2 rounded-lg w-full sm:w-fit">
        {["Pending", "Approved", "Rejected"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${
              tab === "Approved"
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
              <th className="p-3 text-left">Shop Name</th>
              <th className="p-3 text-left">Owner Name</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Contact</th>
              <th className="p-3 text-left">Shop Type</th>
              <th className="p-3 text-left">Joined</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  <input type="checkbox" />
                </td>
                <td className="p-3 font-medium">{u.shop}</td>
                <td className="p-3">{u.owner}</td>
                <td className="p-3">{u.location}</td>
                <td className="p-3">
                  <div>{u.phone}</div>
                  <div className="text-xs text-gray-400">{u.email}</div>
                </td>
                <td className="p-3">{u.type}</td>
                <td className="p-3">{u.joined}</td>
                <td className="p-3 flex gap-3 text-lg">
                  <FaEye className="text-blue-600 cursor-pointer" />
                  <FaTrash className="text-red-500 cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
