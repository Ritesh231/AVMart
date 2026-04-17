import { X } from "lucide-react";
import { useRef } from "react";

function OrderDetailsModal({ order, loading, onClose }) {
  if (!order && !loading) return null;

  const statusFlow = ["ordered", "assigned", "dispatched", "ongoing", "delivered"];

  const currentIndex = statusFlow.indexOf(
    order?.rawStatus?.toLowerCase()
  );

  const printRef = useRef();

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
              className="bg-white text-black text-xs px-3 py-1 rounded-full font-semibold"
            >
              Print
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
              <div key={index} className="flex justify-between items-center">
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
                <p className="font-semibold">₹{item.itemTotal.toFixed(2)}</p>
              </div>
            ))}

            <div className="border-t pt-2 text-sm space-y-2">

              {/* ✅ Wallet (only if > 0) */}
              {order?.walletAmountUsed > 0 && (
                <div className="flex justify-between">
                  <span>Wallet Used</span>
                  <span>₹{order.walletAmountUsed.toFixed(2)}</span>
                </div>
              )}

              {/* ✅ Discount Breakdown (only if exists) */}
              {order?.discounts?.length > 0 && (
                <div className="space-y-1">
                  {/* <p className="text-xs font-semibold text-gray-500">
                    Discount Breakdown
                  </p> */}

                  {/* {order.discounts.map((disc, index) => (
                    disc?.discountAmount > 0 && (
                      <div
                        key={index}
                        className="flex justify-between text-green-600 text-sm"
                      >
                        <span>
                          {disc.name} ({disc.value}%)
                        </span>
                        <span>- ₹{disc.discountAmount.toFixed(2)}</span>
                      </div>
                    )
                  ))} */}
                </div>
              )}

              {order?.totalDiscount > 0 && (
                <div className="flex justify-between text-green-700 font-semibold border-t pt-1">
                  <span>Total Discount</span>
                  <span>- ₹{order.totalDiscount.toFixed(2)}</span>
                </div>
              )}

              {order?.deliveryCharge > 0 && (
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span>₹{order.deliveryCharge.toFixed(2)}</span>
                </div>
              )}

              {order?.remainingAmount > 0 && (
                <div className="flex justify-between">
                  <span>Remaining</span>
                  <span>₹{order.remainingAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between font-bold text-base pt-2">
                <span>Total</span>
                <span>{order?.priceFormatted}</span>
              </div>

              {order?.paidAmount > 0 && (
                <div className="flex justify-between font-bold text-base pt-2 text-green-800">
                  <span>Paid Amount</span>
                  <span>₹{order.paidAmount.toFixed(2)}</span>
                </div>
              )}
            </div>

            {order?.deliveryStatus === "Cancelled" && (
              <div className="border-t pt-3">
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 space-y-3">

                  {/* Title */}
                  <p className="text-sm font-bold text-red-600">
                    ⚠ Order Cancelled
                  </p>

                  {/* Reason */}
                  <div className="flex flex-col text-sm gap-1">
                    <span className="font-medium text-gray-700">
                      Reason
                    </span>
                    <span className="text-red-500 font-semibold break-words">
                      {order?.cancellationReason || "N/A"}
                    </span>
                  </div>

                  {/* Image */}
                  {order?.cancellationImage && (
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-medium text-gray-700">
                        Proof Image
                      </span>

                      <img
                        src={order.cancellationImage}
                        alt="Cancellation"
                        className="w-full max-h-40 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
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