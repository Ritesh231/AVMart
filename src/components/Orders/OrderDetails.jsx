import React, { useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { IoBag } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import Orderstats from "../../components/Orders/Orderstats";
import { useParams } from "react-router-dom";
import { useGetOrderDetailsByIdMutation } from "../../Redux/apis/ordersApi";

const steps = [
  { title: "Order Placed", done: true },
  { title: "Payment Confirmed", done: true },
  { title: "Processing", done: true },
  { title: "Shipped", done: false },
  { title: "Delivered", done: false },
];

const OrderDetails = () => {

  const { id } = useParams();

  const [getOrderDetails, { data, isLoading }] =
    useGetOrderDetailsByIdMutation();

  useEffect(() => {
    if (id) {
      getOrderDetails(id);
    }
  }, [id]);

  const orders = data?.data?.recentOrders || [];

  const ongoingOrders = orders.filter(
    (order) => order.status !== "delivered"
  );

  const completedOrders = orders.filter(
    (order) => order.status === "delivered"
  );

  const getTrackingSteps = (order) => {
    const steps = [
      { key: "ordered", label: "Order Placed" },
      { key: "confirmed", label: "Order Confirmed" },
      { key: "assigned", label: "Delivery Assigned" },
      { key: "delivered", label: "Delivered" },
    ];

    const statusOrder = ["ordered", "confirmed", "assigned", "delivered"];
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
          <span className={`px-3 py-1 text-xs rounded-full ${order.status === "delivered"
              ? "bg-green-100 text-green-600"
              : "bg-yellow-100 text-yellow-600"
            }`}>
            {order.deliveryStatus}
          </span>
          <p className="font-semibold text-emerald-600 mt-1">
            ₹{order.total}
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
          <p className="font-semibold">₹{item.price}</p>
        </div>
      ))}

      <div className="border border-emerald-200 rounded-xl p-5 mt-6">
        <h4 className="font-semibold mb-6">Order Tracking</h4>
        
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
    </div>
  );

  const [activeTab, setActiveTab] = React.useState("ongoing");

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
      <Orderstats />
      <div className="">

        {/* Profile Card */}
        <div className="bg-[#E0F5F1] rounded-xl p-6 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">
              {data?.data?.shop?.shopName}
            </h2>
            <h2 className="text-base">{data?.data?.shop?.contact}</h2>
            <div className="">
              <p className="text-2xl font-bold text-[#03C616] mt-4">${data?.data?.stats?.totalRevenue}</p>
              <p className="text-sm text-gray-500">Total Spent</p>
            </div>
          </div>

          <p className="flex items-center mb-24 gap-3 text-sm text-gray-500 whitespace-nowrap">
            <FaLocationDot className="text-xl text-[#1A2550]" />
            <span>{data?.data?.shop?.address}</span>

            <FaCalendarAlt className="text-xl text-[#1A2550]" />
            <span>{new Date(data?.data?.shop?.joined).toLocaleDateString()}</span>
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 bg-[#1A2550] p-3 w-fit mt-4 rounded-lg">
          {[
            { label: "Ongoing Orders", value: "ongoing" },
            { label: "Completed Orders", value: "completed" },
            { label: "Addresses", value: "address" },
            { label: "Personal Details", value: "personal" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.value
                  ? "bg-white text-black"
                  : "text-white hover:bg-white/20"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Order Card */}
        <div className="mt-6 space-y-6">

          {/* Ongoing Orders */}
          {activeTab === "ongoing" && (
            ongoingOrders.length > 0 ? (
              ongoingOrders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))
            ) : (
              <p className="text-gray-500">No ongoing orders</p>
            )
          )}

          {/* Completed Orders */}
          {activeTab === "completed" && (
            completedOrders.length > 0 ? (
              completedOrders.map((order) => (
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
    </div>
  );
};

export default OrderDetails;
