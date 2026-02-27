import { X } from "lucide-react";

function OrderDetailsModal({ order, loading, onClose }) {
  if (!order && !loading) return null;

  const statusFlow = ["ordered", "assigned",  "dispatched", "ongoing", "delivered"];

  const currentIndex = statusFlow.indexOf(
  order?.rawOrderStatus?.toLowerCase()
);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">

        {/* Header */}
        <div className="bg-[#1E264F] text-white p-4 flex justify-between items-center">
          <div>
            <h2 className="font-bold text-lg">{order?.orderId}</h2>
            <p className="text-xs opacity-80">{order?.placedOn}</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-yellow-400 text-black text-xs px-3 py-1 rounded-full font-semibold">
              {order?.deliveryStatus}
            </span>

            <button onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">

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
                <p className="font-semibold">₹{item.itemTotal}</p>
              </div>
            ))}

            <div className="border-t pt-2 text-sm space-y-1">
              <div className="flex justify-between">
                <span>Wallet Used</span>
                <span>₹{order?.walletAmountUsed}</span>
              </div>
              <div className="flex justify-between">
                <span>Remaining</span>
                <span>₹{order?.remainingAmount}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2">
                <span>Total</span>
                <span>{order?.priceFormatted}</span>
              </div>
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
  <div className="border rounded-xl p-4 bg-gray-50">
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
            ${
              isCompleted
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
            className={`text-sm font-medium capitalize ${
              isCompleted ? "text-black" : "text-gray-400"
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