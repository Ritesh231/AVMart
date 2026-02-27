import React, { useState } from "react";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Package,
  Bike,
  Calendar,
  CheckCircle,
  ChevronDown,
  Truck,
  Download, Search, SlidersHorizontal
} from "lucide-react";

import { FaUserCheck } from "react-icons/fa";
import { MdAttachMoney } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import AttendanceStats from "./AttendanceCard";
import RevenueStats from "./RevenueCard";
import OrderStats from "./OrderCard";
import { useGetdeliveryProfileQuery, useGetDeliveryBoyDetailsQuery, useGetDeliveryBoyOrderDetailsQuery } from "../../Redux/apis/deliveryApi";
import { useParams } from "react-router-dom";

export default function DeliveryBoyDetails() {
  const [activeTab, setActiveTab] = useState("attendance");
  const [openOrderId, setOpenOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { id } = useParams();
  const { data, isLoading, isError } = useGetdeliveryProfileQuery(id);
  const profile = data?.data || [];

  const {
    data: tabData,
    isLoading: tabLoading,
    isError: tabError,
  } = useGetDeliveryBoyDetailsQuery(
    { id, tab: activeTab },
    { skip: !id }
  );

  const {
    data: orderdetail,
    isLoading: orderLoading,
    isError: orderError,
  } = useGetDeliveryBoyOrderDetailsQuery(openOrderId, {
    skip: !openOrderId,
  });

  const orderData = orderdetail?.data;

  const toggleOrder = (id) => {
    setOpenOrderId(openOrderId === id ? null : id);
  };

  const attendanceData = tabData?.data || [];
  const attendanceCount = tabData?.stats || {
    present: 0,
    absent: 0,
    halfDay: 0,
  };
  const orders =
    tabData?.data?.filter((order) => {
      const term = searchTerm.toLowerCase();

      return (
        order._id?.toLowerCase().includes(term) ||
        order.deliveryStatus?.toLowerCase().includes(term) ||
        order.paymentMethod?.toLowerCase().includes(term)
      );
    }) || [];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div>
          <h1 className="text-xl font-semibold">Delivery Boy Details</h1>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">

          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-indigo-900 text-white flex items-center justify-center text-2xl font-bold">
            {profile?.name?.charAt(0)?.toUpperCase()}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h2 className="text-xl font-semibold">{profile?.name}</h2>
              <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                {profile?._id}
              </span>
              <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                Active
              </span>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-2">
                <Phone size={16} /> {profile?.phone}
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} /> {profile?.email}
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} /> {profile?.address}
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 mt-3">
              <div className="bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
                <Package size={16} /> 1247 Deliveries
              </div>
              <div className="bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
                <Bike size={16} /> {profile?.vehicleNumber} {profile?.vehicleType}
              </div>
              <div className="bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
                <Calendar size={16} /> {profile?.joinedAt?.split("T")[0]}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row bg-[#1E264F] p-2 my-6 rounded-xl gap-2 md:w-fit w-full shadow-lg">
        <button
          onClick={() => setActiveTab("attendance")}
          className={`px-6 py-3 rounded-lg flex items-center gap-3 font-semibold transition-all duration-300
      ${activeTab === "attendance"
              ? "bg-[#00E5B0] text-white"
              : "bg-white text-[#1E264F] hover:bg-gray-100"
            }`}
        >
          <FaUserCheck size={20} />
          Attendance
        </button>

        <button
          onClick={() => setActiveTab("revenue")}
          className={`px-6 py-3 rounded-lg flex items-center gap-3 font-semibold transition-all duration-300
      ${activeTab === "revenue"
              ? "bg-[#00E5B0] text-white"
              : "bg-white text-[#1E264F] hover:bg-gray-100"
            }`}
        >
          <MdAttachMoney size={20} />
          Revenue
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`px-6 py-3 rounded-lg flex items-center gap-3 font-semibold transition-all duration-300
      ${activeTab === "orders"
              ? "bg-[#00E5B0] text-white"
              : "bg-white text-[#1E264F] hover:bg-gray-100"
            }`}
        >
          <FaShoppingCart size={20} />
          Orders
        </button>
      </div>

      {/* Summary Cards */}

      {activeTab === "attendance" && (
        <>
          <AttendanceStats
            present={attendanceCount?.present || 0}
            absent={attendanceCount?.absent || 0}
            halfDay={attendanceCount?.halfDay || 0}
          />

          {/* Filter */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            {/* Search Bar */}
            <div className="w-full lg:w-[40%] md:w-[50%]">
              <div className='flex items-center gap-2 bg-white border-2 border-brand-soft rounded-2xl p-3 focus-within:border-brand-teal transition-all'>
                <Search className="text-brand-gray" size={20} />
                <input
                  className='w-full bg-transparent border-none focus:ring-0 focus:outline-none text-brand-navy placeholder:text-brand-gray'
                  type="text"
                  placeholder='Search By Name, Date, Working hours'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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

          <div className="bg-white rounded-xl shadow-sm border md:overflow-hidden overflow-x-auto ">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-6 py-3">Date</th>
                  <th className="text-left px-6 py-3">Check In</th>
                  <th className="text-left px-6 py-3">Check Out</th>
                  <th className="text-left px-6 py-3">Working Hours</th>
                  <th className="text-left px-6 py-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {attendanceData
                  ?.filter((item) => {
                    const term = searchTerm.toLowerCase();

                    return (
                      item.date?.toLowerCase().includes(term) ||
                      item.status?.toLowerCase().includes(term) ||
                      item.workingHours?.toLowerCase().includes(term)
                    );
                  })
                  ?.map((item) => (
                    <tr key={item._id} className="border-t">
                      <td className="px-6 py-4">
                        {item.date?.split("T")[0]}
                      </td>
                      <td className="px-6 py-4">{item.checkIn}</td>
                      <td className="px-6 py-4">{item.checkOut}</td>
                      <td className="px-6 py-4">{item.workingHours}</td>
                      <td className="px-6 py-4">
                        <span className="bg-indigo-900 text-white px-3 py-1 rounded-full text-xs">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      
      {activeTab === "revenue" && (
        <>
          {/* Revenue Summary Cards */}
          <RevenueStats
            totalEarned={tabData?.stats?.totalEarned || 0}
            totalWithdrawn={tabData?.stats?.totalWithdrawn || 0}
            balance={tabData?.stats?.balance || 0}
          />

          {/* Filter */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            {/* Search Bar */}
            <div className="w-full lg:w-[40%] md:w-[50%]">
              <div className='flex items-center gap-2 bg-white border-2 border-brand-soft rounded-2xl p-3 focus-within:border-brand-teal transition-all'>
                <Search className="text-brand-gray" size={20} />
                <input
                  className='w-full bg-transparent border-none focus:ring-0 focus:outline-none text-brand-navy placeholder:text-brand-gray'
                  type="text"
                  placeholder='Search By Name, Order ID, Transaction ID'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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

          {/* Transactions Table */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-6 py-3">Transaction ID</th>
                  <th className="text-left px-6 py-3">Order ID</th>
                  <th className="text-left px-6 py-3">Date</th>
                  <th className="text-left px-6 py-3">Type</th>
                  <th className="text-left px-6 py-3">Amount</th>
                  <th className="text-left px-6 py-3">Description</th>
                </tr>
              </thead>

              <tbody>
                {tabData?.data
                  ?.filter((txn) => {
                    const term = searchTerm.toLowerCase();

                    return (
                      txn.transactionId?.toLowerCase().includes(term) ||
                      txn.orderId?.toLowerCase().includes(term) ||
                      txn.type?.toLowerCase().includes(term) ||
                      txn.description?.toLowerCase().includes(term)
                    );
                  })
                  ?.map((txn) => (
                    <tr key={txn._id} className="border-t">
                      <td className="px-6 py-4">{txn.transactionId}</td>
                      <td className="px-6 py-4">{txn.orderId}</td>
                      <td className="px-6 py-4">{txn.date}</td>
                      <td className="px-6 py-4">{txn.type}</td>
                      <td className="px-6 py-4">₹{txn.amount}</td>
                      <td className="px-6 py-4">{txn.description}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === "orders" && (
        <>
          {/* Top Summary Cards */}
          <OrderStats
            ongoing={tabData?.stats?.ongoing || 0}
            completed={tabData?.stats?.completed || 0}
            rejected={tabData?.stats?.rejected || 0}
          />

          {/* Filter */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            {/* Search Bar */}
            <div className="w-full lg:w-[40%] md:w-[50%]">
              <div className='flex items-center gap-2 bg-white border-2 border-brand-soft rounded-2xl p-3 focus-within:border-brand-teal transition-all'>
                <Search className="text-brand-gray" size={20} />
                <input
                  className='w-full bg-transparent border-none focus:ring-0 focus:outline-none text-brand-navy placeholder:text-brand-gray'
                  type="text"
                  placeholder='Search By Name, Order ID, Transaction ID'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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

          {/* Orders List */}
          <div className="space-y-4">
            {orders.map((order) => {

              const isOngoing = order.deliveryStatus === "Ongoing";
              const isDelivered = order.deliveryStatus === "Delivered";

              return (
                <div key={order._id} className="bg-white rounded-xl shadow-sm border overflow-hidden">

                  {/* Header */}
                  <div
                    className="flex justify-between items-center p-5 cursor-pointer"
                    onClick={() => toggleOrder(order._id)}
                  >
                    <div className="flex items-center gap-3">

                      {/* Dynamic Status Icon */}
                      {isOngoing && (
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Truck size={18} className="text-blue-600" />
                        </div>
                      )}

                      {isDelivered && (
                        <div className="bg-green-100 p-2 rounded-lg">
                          <CheckCircle size={18} className="text-green-600" />
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">
                            {order._id.slice(-6).toUpperCase()}
                          </h3>

                          <span className="bg-gray-200 text-xs px-3 py-1 rounded-full">
                            {order.deliveryStatus}
                          </span>
                        </div>

                        <p className="text-sm text-gray-500 mt-1">
                          {order.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold">
                          ₹{order.grandTotal}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.paymentMethod}
                        </p>
                      </div>

                      <button
                        onClick={() => toggleOrder(order._id)}
                        className="p-2 rounded-md hover:bg-gray-100 transition"
                      >
                        <ChevronDown
                          size={18}
                          className={`transition-transform duration-300 ${openOrderId === order._id ? "rotate-180" : ""
                            }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Collapsible Content */}
                  {openOrderId === order._id && (
                    <div className="border-t p-5 bg-gray-50 space-y-5">

                      {orderLoading && <p>Loading order details...</p>}

                      {!orderLoading && orderData && (
                        <>
                          {/* Customer Details */}
                          <div>
                            <h4 className="font-medium mb-2">Customer Details</h4>
                            <p className="text-sm font-medium">
                              {orderData.customer?.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {orderData.customer?.phone}
                            </p>
                            <p className="text-sm text-gray-500">
                              {orderData.customer?.address}
                            </p>
                          </div>

                          {/* Order Items */}
                          <div>
                            <h4 className="font-medium mb-2">Order Items</h4>

                            {orderData.items?.map((item, index) => (
                              <div
                                key={index}
                                className="text-sm flex justify-between mb-1"
                              >
                                <span>
                                  {item.name} x{item.quantity}
                                </span>
                                <span>₹{item.itemTotal}</span>
                              </div>
                            ))}
                          </div>

                          {/* Bill Summary */}
                          <div>
                            <h4 className="font-medium mb-2">Bill Summary</h4>

                            <div className="text-sm flex justify-between">
                              <span>Subtotal</span>
                              <span>₹{orderData.billSummary?.subtotal}</span>
                            </div>

                            <div className="text-sm flex justify-between">
                              <span>Delivery Charge</span>
                              <span>₹{orderData.billSummary?.deliveryCharge}</span>
                            </div>

                            <div className="text-sm flex justify-between text-green-600">
                              <span>Paid</span>
                              <span>₹{orderData.billSummary?.totalPaid}</span>
                            </div>

                            <div className="text-sm flex justify-between text-red-600 font-medium">
                              <span>Remaining to collect</span>
                              <span>
                                ₹{orderData.billSummary?.remainingToCollect}
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}