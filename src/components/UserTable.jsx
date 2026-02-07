import React,{useState} from "react";
import { ArrowDown, BadgeIndianRupee, Blocks, ChartColumnIncreasing, ChevronDown, CircleDashed, CreditCard, Download, FileText, HandCoins, Search, SlidersHorizontal, Upload, Wallet, WalletMinimal } from 'lucide-react'
import { FaSearch, FaTrash, FaEye } from "react-icons/fa";
import { IoFilter } from "react-icons/io5";

 const tabs = [
        { id: 'Pending', label: 'Pending'},
        { id: 'Approved', label: 'Approved'},
        { id: 'Rejected', label: 'Rejected'}
    ];

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
  const [activeTab, setActiveTab] = useState('Pending');

  return (
    <>
      {/* Tabs */}
    <section className="flex items-center bg-[#1E264F] p-2 my-6 rounded-xl w-fit shadow-lg">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 rounded-lg flex items-center gap-3 font-semibold transition-all duration-300 first:ml-0 ml-2
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
