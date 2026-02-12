import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { IoBag } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import Orderstats from "../../components/Orders/Orderstats";

const steps = [
  { title: "Order Placed", done: true },
  { title: "Payment Confirmed", done: true },
  { title: "Processing", done: true },
  { title: "Shipped", done: false },
  { title: "Delivered", done: false },
];

const OrderDetails = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
        <Orderstats/>
      <div className="">
        
        {/* Profile Card */}
        <div className="bg-[#E0F5F1] rounded-xl p-6 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">
              Medicover Clycare Medical Shop
            </h2>
            <h2 className="text-base">+91 8484555555</h2>
              <div className="">
            <p className="text-2xl font-bold text-[#03C616] mt-4">$3,28,500</p>
            <p className="text-sm text-gray-500">Total Spent</p>
          </div>
          </div>
           
           <p className="flex items-center mb-24 gap-3 text-sm text-gray-500 whitespace-nowrap">
  <FaLocationDot className="text-xl text-[#1A2550]" />
  <span>United States</span>

  <FaCalendarAlt className="text-xl text-[#1A2550]" />
  <span>Joined on 2020-09-09</span>
</p>

        </div>

        {/* Tabs */}
        <div className="flex gap-3 bg-[#1A2550] p-3 w-[600px] mt-4">
          {["Ongoing Orders", "Completed Orders", "Addresses", "Personal Details"].map(
            (tab, i) => (
              <button
                key={i}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  i === 0
                    ? "bg-white text-black"
                    : "bg-[#1A2550] text-white"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* Order Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">

          {/* Order Header */}
          <div className="flex justify-between items-center">
            
            <div className="flex items-center gap-4">
    <div className="bg-[#1A2550] text-white rounded-full p-4">
      <IoBag className="text-xl" />
    </div>

    <div>
      <h3 className="font-semibold">Order #ORD-2024-09</h3>
      <p className="text-sm text-gray-500">2024-09-12</p>
    </div>
  </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 text-xs rounded-full bg-[#1A2550] text-white">
                Processing
              </span>
              <span className="font-semibold text-emerald-600">$328.500</span>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between border rounded-lg p-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src="https://via.placeholder.com/50"
                    alt="product"
                    className="w-12 h-12 rounded"
                  />
                  <div>
                    <p className="font-medium">Fogg Perfume</p>
                    <p className="text-sm text-gray-500">Quantity: 1</p>
                  </div>
                </div>

                <p className="font-semibold text-emerald-600">$328.500</p>
              </div>
            ))}
          </div>

          {/* Order Tracking */}
          <div className="border border-emerald-200 rounded-xl p-5">
      <h4 className="font-semibold mb-6">Order Tracking</h4>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-2 h-full w-[2px] bg-slate-300"></div>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-4 relative">
              {/* Icon */}
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full z-10
                  ${step.done ? "bg-[#0F1E4A]" : "bg-[#0F1E4A] opacity-80"}
                `}
              >
                <FaCheck
                  className={`text-sm ${
                    step.done ? "text-emerald-400" : "text-slate-400"
                  }`}
                />
              </div>

              {/* Text */}
              <div>
                <p className="font-medium">{step.title}</p>
                <p className="text-xs text-gray-500">
                  Nov 28, 2024 10:30 AM
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

          {/* Shipping Address */}
          <div className="bg-[#1A2550] text-white rounded-lg p-4">
            <h4 className="font-semibold mb-1">Shipping Address</h4>
            <p className="text-sm">
              123 Park Avenue, New York NY 1987651
            </p>
          </div>

          {/* Price Summary */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>$150</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>$30</span>
            </div>
            <div className="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span className="text-emerald-600">$180</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
