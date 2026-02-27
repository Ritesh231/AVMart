import { FaSearch, FaTrash, FaEye, FaCheck, FaTimes } from "react-icons/fa";
import { ArrowDown, BadgeIndianRupee, Blocks, ChartColumnIncreasing, ChevronDown, CircleDashed, CreditCard, Download, FileText, HandCoins, Search, SlidersHorizontal, Upload, Wallet, WalletMinimal } from 'lucide-react'
import { IoFilter } from "react-icons/io5";
import { BsWallet2 } from "react-icons/bs";
import { SiTicktick } from "react-icons/si";
import { RxCrossCircled } from "react-icons/rx";
import { Link } from "react-router-dom";
import { useGetOrdersByStatusQuery, useAssignOrderStatusMutation, } from "../../Redux/apis/ordersApi";
import {
  useGetAllDeliveryBoysQuery,
  useGetAssignDeliveryBoysMutation
} from "../../Redux/apis/deliveryApi";
import { useGetOrdersByIdMutation } from "../../Redux/apis/ordersApi";
import OrderDetailsModal from "../Orders/OrderdetailedModal"
import { useState } from "react";
import { toast } from "react-toastify";

export default function UsersTable() {
  const { data, isLoading, isError } = useGetOrdersByStatusQuery("Pending");
  const orders = data?.orders || [];

const users = orders.filter(
  (order) =>
    order.OrderStatus !== "confirmed" &&
    order.OrderStatus !== "cancelled"
);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [getOrderById, { data: orderData, loading = { isLoading } }] =
    useGetOrdersByIdMutation();
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [selectedOrderForDelivery, setSelectedOrderForDelivery] = useState(null);
  const [selectedBoyId, setSelectedBoyId] = useState(null);
  const [activeStatus, setActiveStatus] = useState("all");
  

   const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 6;


  const filteredOrders =
  activeStatus === "all"
    ? users
    : users.filter((order) =>
        order.paymentMethod?.toLowerCase() === activeStatus
      );
  
    // Pagination Logic
   const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  
const currentOrders = filteredOrders.slice(
  indexOfFirstOrder,
  indexOfLastOrder
);
  
  // Reset to page 1 when orders change
  useState(() => {
    setCurrentPage(1);
  }, [users.length]);

  const [
    assignOrderStatus,
    { isLoading: isUpdating }
  ] = useAssignOrderStatusMutation();

  const skeletonRows = Array.from({ length: 6 });

  const { data: deliveryData } = useGetAllDeliveryBoysQuery({
    status: "approved"
  });



  const [assignDeliveryBoy, { isLoading: assigning }] =
    useGetAssignDeliveryBoysMutation();

  const handleApprove = async (id) => {
    try {
      await assignOrderStatus({
        id,
        status: "confirmed",
      }).unwrap();

      // Open Delivery Modal
      setSelectedOrderForDelivery(id);
      setIsDeliveryModalOpen(true);
      toast.success(response?.message || "Success");
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.error);
    }
  };

  const handleReject = async (id) => {
    try {
      await assignOrderStatus({
        id,
        status: "cancelled",
      }).unwrap();

      toast.success(response?.message || "Success");
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to reject ❌");
    }
  };

  const handleAssignDelivery = async (boyId) => {
    try {
      setSelectedBoyId(boyId);

      await assignDeliveryBoy({
        orderId: selectedOrderForDelivery,
        deliveryBoyId: boyId,
      }).unwrap();

      setIsDeliveryModalOpen(false);
      setSelectedOrderForDelivery(null);
    } catch (error) {
      console.error(error);
    } finally {
      setSelectedBoyId(null);
    }
  };


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
        <div className="relative">
  <select
    value={activeStatus}
    onChange={(e) => setActiveStatus(e.target.value)}
    className="appearance-none border border-brand-cyan font-semibold text-brand-navy px-4 py-3 pr-10 rounded-2xl bg-white"
  >
    <option value="all">All Payments</option>
 <option value="all">All Payments</option>
<option value="cod">COD</option>
<option value="partial">Partial</option>
  </select>

  <ChevronDown
    size={18}
    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-brand-navy"
  />
</div>
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
              <th className="p-3 text-left">Payment Method</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {/* 🔹 Loading Skeleton */}
            {isLoading &&
              skeletonRows.map((_, i) => (
                <tr key={i} className="border-t animate-pulse">
                  <td className="p-3">
                    <div className="h-4 w-4 bg-gray-200 rounded"></div>
                  </td>
                  <td className="p-3">
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  </td>
                  <td className="p-3">
                    <div className="h-4 w-40 bg-gray-200 rounded"></div>
                  </td>
                  <td className="p-3">
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  </td>
                  <td className="p-3">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <div className="h-6 w-6 bg-gray-200 rounded"></div>
                      <div className="h-6 w-6 bg-gray-200 rounded"></div>
                      <div className="h-6 w-6 bg-gray-200 rounded"></div>
                    </div>
                  </td>
                </tr>
              ))}

            {/* 🔹 Error State */}
            {isError && (
              <tr>
                <td colSpan="8" className="text-center py-10 text-red-500 font-semibold">
                  ❌ Failed to load orders. Please try again.
                </td>
              </tr>
            )}

            {/* 🔹 Empty State */}
            {!isLoading && !isError && users.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-10 text-gray-500 font-medium">
                  No orders found.
                </td>
              </tr>
            )}

            {/* 🔹 Data Rows */}
            {!isLoading &&
              !isError &&
              currentOrders.map((u) => (
                <tr key={u._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <input type="checkbox" />
                  </td>
                  <td className="p-3 font-medium">{u._id?.slice(-5)}</td>
                  <td className="p-3 font-medium">{u.shopInfo?.name}</td>
                  <td className="p-3">
                    {u.price?.toString().includes(".")
                      ? u.price.toString().split(".")[0] +
                      "." +
                      u.price.toString().split(".")[1].slice(0, 2)
                      : u.price}
                  </td>
                  
                  <td className="p-3">{u.placedOn}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {u.itemsSummary?.slice(0, 3).map((item, index) => (
                        <img
                          key={index}
                          src={item.image}
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
                  <td className="p-3 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {/* ✅ Approve */}
                      <button
                        className="p-1 text-green-600 bg-white"
                        onClick={() => handleApprove(u._id)}
                        disabled={isUpdating}
                      >
                        <SiTicktick size={18} />
                      </button>

                      {/* ❌ Reject */}
                      <button
                        className="p-1 text-red-600 bg-white"
                        onClick={() => handleReject(u._id)}
                        disabled={isUpdating}
                      >
                        <RxCrossCircled size={18} />
                      </button>

                      {/* 👁 View */}
                      <button
                        className="p-1 text-blue-900"
                        onClick={async () => {
                          setSelectedOrderId(u._id);
                          await getOrderById(u._id);
                        }}
                      >
                        <FaEye size={18} />
                      </button>
                    </div>
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

        {isDeliveryModalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-[400px] max-h-[500px] overflow-y-auto rounded-xl p-5">

              <h2 className="text-lg font-semibold mb-4">
                Assign Delivery Boy
              </h2>

              {deliveryData?.data?.map((boy) => {
                const isThisLoading =
                  assigning && selectedBoyId === boy._id;

                return (
                  <div
                    key={boy._id}
                    onClick={() => !assigning && handleAssignDelivery(boy._id)}
                    className={`border p-3 rounded mb-2 cursor-pointer transition
              ${isThisLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}
            `}
                  >
                    <p className="font-medium">{boy.Name}</p>
                    <p className="text-sm text-gray-500">
                      Orders: {boy.completeOrders}
                    </p>
                    <p className="text-sm text-gray-500">
                      Status: {boy.deliveryBoyAvailable}
                    </p>

                    {isThisLoading && (
                      <p className="text-xs text-blue-600 mt-1">
                        Assigning...
                      </p>
                    )}
                  </div>
                );
              })}

              <button
                onClick={() => setIsDeliveryModalOpen(false)}
                className="mt-4 w-full bg-red-400 text-white py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}
                {/* Pagination */}
{filteredOrders.length > ordersPerPage && (
  <div className="flex justify-between items-center mt-6 px-4 py-4 bg-white border-t">

    {/* Showing Info */}
    <p className="text-sm text-gray-600">
      Showing {indexOfFirstOrder + 1} to{" "}
      {Math.min(indexOfLastOrder, filteredOrders.length)} of{" "}
      {filteredOrders.length} orders
    </p>

    {/* Buttons */}
    <div className="flex items-center gap-2">

      {/* Prev */}
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all
          ${currentPage === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-[#1E264F] text-white hover:bg-opacity-90"
          }`}
      >
        Prev
      </button>

      {/* Page Numbers */}
      {[...Array(totalPages)].map((_, index) => {
        const page = index + 1;
        return (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all
              ${currentPage === page
                ? "bg-[#00E5B0] text-white shadow-md"
                : "bg-gray-100 text-[#1E264F] hover:bg-gray-200"
              }`}
          >
            {page}
          </button>
        );
      })}

      {/* Next */}
      <button
        onClick={() =>
          setCurrentPage((prev) => Math.min(prev + 1, totalPages))
        }
        disabled={currentPage === totalPages}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all
          ${currentPage === totalPages
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-[#1E264F] text-white hover:bg-opacity-90"
          }`}
      >
        Next
      </button>

    </div>
  </div>
)}
      </div>
    </>
  );
}
