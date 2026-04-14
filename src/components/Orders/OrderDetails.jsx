import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { IoBag } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import Orderstats from "../../components/Orders/Orderstats";
import { useParams } from "react-router-dom";
import { useGetOrderDetailsByIdMutation } from "../../Redux/apis/ordersApi";
import StatCard from "../../components/StatCard";
import { IoCartOutline } from "react-icons/io5";

const steps = [
  { title: "Order Placed", done: true },
  { title: "Payment Confirmed", done: true },
  { title: "Processing", done: true },
  { title: "Shipped", done: false },
  { title: "Delivered", done: false },
];

const OrderDetails = () => {

  const { id } = useParams();
  const [openTrackingId, setOpenTrackingId] = useState(null);
  const [page, setPage] = React.useState(1);
  const perPage = 10;

  const [activeTab, setActiveTab] = React.useState("ongoing");

  useEffect(() => {
    if (id) {
      getOrderDetails({
        id,
        page,
        per_page: perPage,
        filter: activeTab,
      });
    }
  }, [id, page, activeTab]);

  const [getOrderDetails, { data, isLoading }] =
    useGetOrderDetailsByIdMutation();

  const orders = data?.data?.recentOrders || [];
  const pagination = data?.data?.meta?.pagination;
  const statsData = data?.data?.stats || {};

  const stats = [
    {
      title: "Total Orders",
      number: statsData.totalOrders || 0,
      statement: "All orders",
      icon: <IoCartOutline size={24} />,
      variant: "special",
    },
    {
      title: "Completed",
      number: statsData.completedOrders || 0,
      statement: "Delivered successfully",
      icon: <IoCartOutline size={24} />,
      variant: "normal",
    },
    {
      title: "Approved",
      number: statsData.approvedOrders || 0,
      statement: "Approved orders",
      icon: <IoCartOutline size={24} />,
      variant: "normal",
    },
    {
      title: "Rejected",
      number: statsData.rejectedOrders || 0,
      statement: "Rejected orders",
      icon: <IoCartOutline size={24} />,
      variant: "normal",
    },
  ];

  const assignedOrders = orders.filter(
    (order) => order.status === "Ordered"
  );

  const ongoingOrders = orders.filter(
    (order) => order.status !== "Ordered"
  );

  const completedOrders = orders.filter(
    (order) => order.status === "Delivered"
  );

  const getTrackingSteps = (order) => {
    const steps = [
      { key: "ordered", label: "Order Placed" },
      { key: "confirmed", label: "Order Confirmed" },
      { key: "assigned", label: "Delivery Assigned" },
      { key: "dispatched", label: "Shipped" },
      { key: "delivered", label: "Delivered" },
    ];

    const statusOrder = ["ordered", "confirmed", "assigned", "dispatched", "delivered"];
    const currentIndex = statusOrder.indexOf(order.order_status);

    return steps.map((step, index) => ({
      ...step,
      done: index <= currentIndex,
    }));
  };

  const OrderCard = ({ order }) => (

    <div className="bg-white rounded-xl shadow-sm p-6 space-y-4 border">


      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-lg">
            Order #{order.orderId}
          </h3>
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="text-right">
          <span
            className={`px-3 py-1 text-xs rounded-full ${order.deliveryStatus === "delivered"
              ? "bg-green-100 text-green-600"
              : order.deliveryStatus === "Cancelled"
                ? "bg-red-100 text-red-600"
                : "bg-yellow-100 text-yellow-600"
              }`}
          >
            {order.deliveryStatus}
          </span>

          <p className="font-semibold text-emerald-600 mt-1">
            ₹{order.total.toFixed(2)}
          </p>

        </div>
      </div>

      {/* Items */}
      {order.items.map((item, index) => (
        <div key={index} className="flex justify-between border rounded-lg p-3">
          <div className="flex gap-3">
            <img
              src={item.image}
              alt="product"
              className="w-14 h-14 rounded object-cover"
            />
            <div>
              <p className="font-medium">{item.productName}</p>
              <p className="text-sm text-gray-500">
                Qty: {item.quantity}
              </p>
            </div>
          </div>
          <p className="font-semibold">₹{item.price.toFixed(2)}</p>
        </div>
      ))}

      <div className="border border-emerald-200 rounded-xl p-5 mt-6">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold">Order Tracking</h4>

          <button
            onClick={() =>
              setOpenTrackingId((prev) => (prev === order._id ? null : order._id))
            }
            className="text-sm text-blue-600 font-medium flex items-center gap-1"
          >
            {openTrackingId === order._id ? "Hide" : "View"} Tracking
            <span className={`transition-transform ${openTrackingId === order._id ? "rotate-180" : ""}`}>
              ▼
            </span>
          </button>

        </div>

        <div className="relative">

          <div className="space-y-8">
            {openTrackingId === order._id && (
              <div className="border border-emerald-200 rounded-xl p-5 mt-4">

                <div className="relative">
                  <div className="absolute left-5 top-2 h-full w-[2px] bg-slate-300"></div>

                  <div className="space-y-8">
                    {getTrackingSteps(order).map((step, index) => (
                      <div key={index} className="flex items-start gap-4 relative">
                        <div
                          className={`w-10 h-10 flex items-center justify-center rounded-full z-10
              ${step.done ? "bg-[#0F1E4A]" : "bg-gray-400"}
            `}
                        >
                          <FaCheck
                            className={`text-sm ${step.done ? "text-emerald-400" : "text-white"
                              }`}
                          />
                        </div>

                        <div>
                          <p className="font-medium">{step.label}</p>
                          <p className="text-xs text-gray-500">
                            {step.done ? "Completed" : "Pending"}
                          </p>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );


  const OrderDetailsSkeleton = () => (
    <div className="min-h-screen bg-gray-50 p-6 animate-pulse">

      {/* Profile Card Skeleton */}
      <div className="bg-[#E0F5F1] rounded-xl p-6 flex justify-between items-center">
        <div className="space-y-3">
          <div className="h-6 w-40 bg-gray-300 rounded"></div>
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
          <div className="mt-4 space-y-2">
            <div className="h-8 w-24 bg-gray-300 rounded"></div>
            <div className="h-4 w-20 bg-gray-300 rounded"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-48 bg-gray-300 rounded"></div>
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-3 bg-[#1A2550] p-3 w-fit mt-4 rounded-lg">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-8 w-28 bg-gray-400 rounded-lg"></div>
        ))}
      </div>

      {/* Order Card Skeleton */}
      <div className="mt-6 space-y-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6 border space-y-4">

            {/* Header */}
            <div className="flex justify-between">
              <div className="space-y-2">
                <div className="h-5 w-32 bg-gray-300 rounded"></div>
                <div className="h-4 w-24 bg-gray-300 rounded"></div>
              </div>
              <div className="space-y-2 text-right">
                <div className="h-6 w-20 bg-gray-300 rounded-full"></div>
                <div className="h-5 w-16 bg-gray-300 rounded"></div>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3">
              {[1, 2].map((j) => (
                <div key={j} className="flex justify-between border rounded-lg p-3">
                  <div className="flex gap-3">
                    <div className="w-14 h-14 bg-gray-300 rounded"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-gray-300 rounded"></div>
                      <div className="h-3 w-20 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                  <div className="h-4 w-12 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>

            {/* Tracking Skeleton */}
            <div className="border border-emerald-200 rounded-xl p-5 mt-6 space-y-6">
              <div className="h-5 w-32 bg-gray-300 rounded"></div>
              {[1, 2, 3, 4].map((k) => (
                <div key={k} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-28 bg-gray-300 rounded"></div>
                    <div className="h-3 w-20 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (isLoading) return <OrderDetailsSkeleton />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <section className="stat-card-sec mb-6 mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((item, index) => (
            <StatCard
              key={index}
              title={item.title}
              number={item.number}
              statement={item.statement}
              icon={item.icon}
              variant={item.variant}
            />
          ))}
        </div>
      </section>
      <div className="">

        {/* Profile Card */}
        <div className="bg-[#E0F5F1] rounded-xl p-4 md:p-6 flex flex-col md:flex-row md:justify-between md:items-start gap-6">

          {/* LEFT SECTION */}
          <div className="space-y-2 flex-1 min-w-0">

            {/* ✅ IMAGE + NAME */}
            <div className="flex items-center gap-4">
              <img
                src={data?.data?.shop?.image}
                alt="shop"
                className="w-16 h-16 rounded-full object-contain border"
              />

              <div>
                <p className="text-sm text-gray-500">Shop Name</p>
                <h2 className="text-lg font-semibold break-words">
                  {data?.data?.shop?.shopName}
                </h2>
              </div>
            </div>

            {/* CONTACT */}
            <p className="text-sm text-gray-500 mt-2">Contact</p>
            <h2 className="text-base break-words">
              {data?.data?.shop?.contact}
            </h2>

            <div className="mt-4 space-y-3">
              {/* Total Revenue */}
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-xl md:text-2xl font-bold text-[#03C616]">
                  ₹{Number(data?.data?.stats?.totalRevenue || 0).toFixed(2)}
                </p>
              </div>

              {/* Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                {/* Delivered */}
                <div className="bg-white rounded-lg p-3 border w-64">
                  <p className="text-xs text-gray-500">Delivered</p>
                  <p className="text-lg font-semibold text-green-600">
                    ₹{Number(data?.data?.stats?.deliveredRevenue || 0).toFixed(2)}
                  </p>
                </div>

                {/* Pending */}
                <div className="bg-white rounded-lg p-3 border w-64">
                  <p className="text-xs text-gray-500">Pending</p>
                  <p className="text-lg font-semibold text-yellow-600">
                    ₹{Number(data?.data?.stats?.pendingRevenue || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex flex-col gap-4 text-sm text-gray-500 w-full md:w-[300px] flex-shrink-0">

            {/* Address */}
            <div className="flex items-start gap-3">
              <FaLocationDot className="text-xl text-[#1A2550] mt-1" />
              <div>
                <p className="text-xs text-gray-400">Address</p>
                <span className="text-sm text-gray-700 break-words">
                  {data?.data?.shop?.address}
                </span>
              </div>
            </div>

            {/* Joined */}
            <div className="flex items-start gap-3">
              <FaCalendarAlt className="text-xl text-[#1A2550] mt-1" />
              <div>
                <p className="text-xs text-gray-400">Joined On</p>
                <span className="text-sm text-gray-700">
                  {data?.data?.shop?.joined
                    ? new Date(data.data.shop.joined).toLocaleDateString()
                    : "-"}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FaCalendarAlt className="text-xl text-[#1A2550] mt-1" />
              <div>
                <p className="text-xs text-gray-400">Shop Owner Date of Birth </p>
                <span className="text-sm text-gray-700">
                  {data?.data?.shop?.dateOfBirth
                    ? new Date(data.data.shop.dateOfBirth).toLocaleDateString("en-GB")
                    : "-"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="w-full overflow-x-auto">
          <div className="flex gap-3 bg-[#1A2550] p-3 w-max rounded-lg">
            {[
              { label: "Ongoing Orders", value: "ongoing" },
              { label: "Completed Orders", value: "completed" },
              { label: "Addresses", value: "address" },
              { label: "Personal Details", value: "personal" },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${activeTab === tab.value
                  ? "bg-white text-black"
                  : "text-white hover:bg-white/20"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Order Card */}
        <div className="mt-6 space-y-6">

          {/* Ongoing Orders */}
          {activeTab === "ongoing" && (
            orders.length > 0 ? (
              orders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))
            ) : (
              <p className="text-gray-500">No ongoing orders</p>
            )
          )}

          {activeTab === "completed" && (
            orders.length > 0 ? (
              orders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))
            ) : (
              <p className="text-gray-500">No completed orders</p>
            )
          )}

          {/* Address Tab */}
          {activeTab === "address" && (
            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <h3 className="font-semibold text-lg mb-3">Shop Address</h3>
              <p>{data?.data?.shop?.address}</p>
            </div>
          )}

          {/* Personal Details */}
          {activeTab === "personal" && (
            <div className="bg-white rounded-xl shadow-sm p-6 border space-y-2">
              <h3 className="font-semibold text-lg mb-3">Personal Details</h3>
              <p><strong>Name:</strong> {data?.data?.shop?.shopName}</p>
              <p><strong>Email:</strong> {data?.data?.shop?.email}</p>
              <p><strong>Contact:</strong> {data?.data?.shop?.contact}</p>
              <p><strong>Joined:</strong> {new Date(data?.data?.shop?.joined).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center mt-6">

        {/* Previous Button */}
        <button
          onClick={() => setPage((prev) => prev - 1)}
          disabled={!pagination?.has_prev_page}
          className="px-4 py-2 bg-[#1A2550] text-white rounded disabled:opacity-50"
        >
          Previous
        </button>

        {/* Page Info */}
        <p className="text-sm text-gray-600">
          Page {pagination?.page} of {pagination?.total_pages}
        </p>

        {/* Next Button */}
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={!pagination?.has_next_page}
          className="px-4 py-2 bg-[#1A2550] text-white rounded disabled:opacity-50"
        >
          Next
        </button>

      </div>
    </div>
  );
};

export default OrderDetails;
