import { X } from "lucide-react";
import { useRef } from "react";
import { MdDelete } from "react-icons/md";
import { useDeleteOrderItemMutation } from "../../Redux/apis/ordersApi";
import toast from "react-hot-toast";
import { IoPrint } from "react-icons/io5";

function OrderDetailsModal({ order, loading, onClose }) {
  if (!order && !loading) return null;

  const statusFlow = ["ordered", "assigned", "dispatched", "ongoing", "delivered"];

  const currentIndex = statusFlow.indexOf(
    order?.rawStatus?.toLowerCase()
  );

  const printRef = useRef();
  const [deleteOrderItem] = useDeleteOrderItemMutation();

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;

    const printWindow = window.open("", "_blank", "width=800,height=600");

    printWindow.document.write(`
    <html>
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
        body {
  padding: 20px;

  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}
          .no-print {
            display: none !important;
          }
              .print-header {
    background-color: #1E264F !important;
    color: white !important;
  }

     /* ✅ ADD THIS */
      ::-webkit-scrollbar {
        display: none;
      }

      * {
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE */
      }
        </style>
      </head>
      <body>
        ${printContents}
      </body>
    </html>
  `);

    printWindow.document.close();

    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const handleDeleteItem = async (itemId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this item?");
    if (!isConfirmed) return;

    try {
      const res = await deleteOrderItem({ orderId: order._id, itemId }).unwrap();

      toast.success(res?.message || "Item deleted successfully");

      // ✅ Close modal after short delay (so toast is visible)
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete item");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm no-scrollbar">
      <div ref={printRef} className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-fadeIn ">

        {/* Header */}
        <div
          className="print-header flex justify-between items-center"
          style={{ backgroundColor: "#1E264F", color: "white", padding: "16px" }}
        >
          <div>
            <h2 className="font-bold text-white text-lg">{order?.orderId}</h2>
            <p className="text-xs opacity-80">{order?.placedOn}</p>
          </div>

          <div className="flex items-center gap-3 no-print">
            <span className="bg-yellow-400 text-black text-xs px-3 py-1 rounded-full font-semibold">
              {order?.deliveryStatus}
            </span>

            <button
              onClick={handlePrint}
              className="bg-gray-300 text-black text-xs px-3 py-1 rounded-full font-semibold"
            >
              <IoPrint size={20} />
            </button>

            <button onClick={onClose}>
              <X size={20} />
            </button>

          </div>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto no-scrollbar">

          {/* Shop Info */}
          <div className="border rounded-xl p-3 bg-gray-50">
            <div className="flex items-center gap-3">
              <img
                src={order?.shopInfo?.image}
                className="w-12 h-12 rounded-lg object-cover"
                alt=""
              />
              <div>
                <p className="font-semibold">
                  {order?.shopInfo?.name}
                </p>
                <p className="text-sm text-gray-500">
                  {order?.shopInfo?.contact}
                </p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="border rounded-xl p-3 bg-gray-50 space-y-3">
            {order?.items?.map((item, index) => (
              <div key={index} className="flex justify-between items-center border-b border-gray-200 pb-2">

                {/* LEFT SIDE */}
                <div className="flex gap-3 items-center">
                  <img
                    src={item.image}
                    className="w-10 h-10 rounded object-cover"
                    alt=""
                  />
                  <div>
                    <p className="font-medium text-sm">
                      {item.productName}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>

                {/* RIGHT SIDE (PRICE + DELETE) */}
                <div className="flex items-center gap-3 ">
                  <p className="font-semibold">
                    ₹{item.itemTotal.toFixed(2)}
                  </p>

                  <MdDelete
                    className="text-red-500 cursor-pointer hover:scale-110 transition no-print"
                    size={18}
                    onClick={() => handleDeleteItem(item._id)}
                  />

                </div>

              </div>
            ))}
            <div className="flex justify-between items-center text-sm">
              <span>Total Delivery Charge</span>
              <span>₹{order?.deliveryCharge?.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-green-600 items-center text-sm">
              <span>Total Amount</span>
              <span>₹{order?.grandTotal?.toFixed(2)}</span>
            </div>

          </div>

          {/* Shipping Address */}
          <div className="border rounded-xl p-3 bg-gray-50">
            <p className="font-semibold text-sm mb-1">Shipping Address</p>
            <p className="text-sm">{order?.shippingAddress?.fullName}</p>
            <p className="text-xs text-gray-600">
              {order?.shippingAddress?.addressLine1},{" "}
              {order?.shippingAddress?.city}
            </p>
          </div>

          {/* Timeline */}
          <div className="border rounded-xl p-4 bg-gray-50 no-print">
            <p className="font-semibold text-sm mb-4">Order Timeline</p>

            {statusFlow.map((step, i) => {
              const isCompleted = i <= currentIndex;
              const isLast = i === statusFlow.length - 1;

              return (
                <div key={i} className="relative flex items-start gap-4">

                  {/* Vertical Line */}
                  {!isLast && (
                    <div
                      className={`absolute left-[11px] top-6 w-[2px] h-full
              ${isCompleted ? "bg-green-500" : "bg-gray-300"}
            `}
                    ></div>
                  )}

                  {/* Circle */}
                  <div
                    className={`z-10 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold
            ${isCompleted
                        ? "bg-blue-900 text-green-300"
                        : "border-2 border-gray-300 bg-white"
                      }
          `}
                  >
                    {isCompleted && "✓"}
                  </div>

                  {/* Text */}
                  <div className="pb-6">
                    <p
                      className={`text-sm font-medium capitalize ${isCompleted ? "text-black" : "text-gray-400"
                        }`}
                    >
                      {step}
                    </p>

                    {isCompleted && (
                      <p className="text-xs text-gray-500">
                        {new Date(order?.createdAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsModal;