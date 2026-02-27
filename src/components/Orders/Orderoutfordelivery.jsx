import { FaSearch, FaTrash, FaEye } from "react-icons/fa";
import { ArrowDown, BadgeIndianRupee, Blocks, ChartColumnIncreasing, ChevronDown, CircleDashed, CreditCard, Download, FileText, HandCoins, Search, SlidersHorizontal, Upload, Wallet, WalletMinimal } from 'lucide-react'
import { IoFilter } from "react-icons/io5";
import { BsWallet2 } from "react-icons/bs";
import { MdDeliveryDining } from "react-icons/md";
import React, { useState } from 'react';
import { useGetOrdersByStatusQuery } from "../../Redux/apis/ordersApi";
import OrderDetailsModal from "../Orders/OrderdetailedModal";
import { useGetOrdersByIdMutation } from "../../Redux/apis/ordersApi"

export default function UsersTable() {
    const { data, isLoading, isError } = useGetOrdersByStatusQuery("OutForDelivery");
    const users = data?.orders || [];
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [getOrderById, { data: orderData, isLoading: Loader }] =
        useGetOrdersByIdMutation();
      
    const [activeTab, setActiveTab] = useState('Online');
    const tabs = [
        { id: 'Online', label: 'Online Payments', },
        { id: 'Cash', label: 'Cash On Delivery', },
        { id: 'Partial', label: 'Partial Payments', }
    ];

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
                            <th className="p-3 text-left">Payment</th>
                            <th className="p-3 text-left">Delivery Boy</th>
                            <th className="p-3 text-left">Action</th>
                        </tr>
                    </thead>

                 <tbody>
  {/* 🔄 Loading Skeleton */}
  {isLoading &&
    Array.from({ length: 6 }).map((_, index) => (
      <tr key={index} className="border-t animate-pulse">
        <td className="p-3">
          <div className="h-4 w-4 bg-gray-200 rounded"></div>
        </td>

        <td className="p-3">
          <div className="h-4 w-28 bg-gray-200 rounded"></div>
        </td>

        <td className="p-3">
          <div className="h-4 w-40 bg-gray-200 rounded"></div>
        </td>

        <td className="p-3">
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </td>

        <td className="p-3">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </td>

        <td className="p-3">
          <div className="flex gap-2">
            <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
          </div>
        </td>

        <td className="p-3">
          <div className="h-6 w-28 bg-gray-200 rounded-xl"></div>
        </td>

        <td className="p-3">
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
        </td>

        <td className="p-3">
          <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
        </td>
      </tr>
    ))}

  {/* ❌ Error State */}
  {isError && !isLoading && (
    <tr>
      <td colSpan="9" className="text-center p-6 text-red-500 font-semibold">
        Failed to load Out Of Delivery orders. Please try again.
      </td>
    </tr>
  )}

  {/* 📭 Empty State */}
  {!isLoading && !isError && users.length === 0 && (
    <tr>
      <td colSpan="9" className="text-center p-6 text-gray-500">
        No orders found in Out Of Delivery.
      </td>
    </tr>
  )}

  {/* ✅ Actual Data */}
  {!isLoading &&
    !isError &&
    users.map((u) => (
      <tr key={u._id} className="border-t hover:bg-gray-50">
        <td className="p-3">
          <input type="checkbox" />
        </td>

        <td className="p-3 font-medium">{u._id}</td>

        <td className="p-3 font-medium">{u.shopInfo?.name}</td>

        <td className="p-3">{u.price}</td>

        <td className="p-3">
          {u.placedOn}
        </td>

        <td className="p-3">
          <div className="flex items-center gap-2">
            {u.itemsPreview?.slice(0, 3).map((img, index) => (
              <img
                key={index}
                src={img.image}
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

        <td className="p-3">
          <div className="flex items-center gap-2 text-[#1A2550] text-sm">
            <MdDeliveryDining className="text-xl" />
            {u.deliveryBoy?.name || "Not Assigned"}
          </div>
        </td>

        <td className="p-3">
          <button
            className="p-1 text-blue-900"
            title="View"
            onClick={async () => {
              setSelectedOrderId(u._id);
              await getOrderById(u._id);
            }}
          >
            <FaEye size={18} />
          </button>
        </td>
      </tr>
    ))}
</tbody>
                </table>
                {selectedOrderId && (
                    <OrderDetailsModal
                        order={orderData?.order}
                        loading={isLoading}
                        onClose={() => setSelectedOrderId(null)}
                    />
                )}
            </div>
        </>
    );
}
