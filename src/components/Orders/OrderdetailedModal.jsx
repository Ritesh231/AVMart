import { X } from "lucide-react";
import { useRef } from "react";
import { MdDelete } from "react-icons/md";
import { CiCircleMinus } from "react-icons/ci";
import { useDeleteOrderItemMutation, useQtyDecreaseMutation } from "../../Redux/apis/ordersApi";
import { toast } from "react-toastify";
import { IoPrint } from "react-icons/io5";
import { useDispatch } from "react-redux";

function OrderDetailsModal({ order, loading, onClose }) {
  if (!order && !loading) return null;

  const timeline = (() => {
    if (!order) return [];

    // Always start with Order Placed
    const data = [

    ];

    if (Array.isArray(order.statusHistory)) {
      data.push(
        ...order.statusHistory.map((item) => ({
          status: item.status,
          at: item.at,
          by: item.by,
        }))
      );
    }

    return data;
  })();

  const printRef = useRef();
  const [deleteOrderItem] = useDeleteOrderItemMutation();
  const [qtyDecrease] = useQtyDecreaseMutation();

  const handlePrint = () => {

    const clone = printRef.current.cloneNode(true);

    const scrollContainer = clone.querySelector(".max-h-\\[80vh\\]");

    if (scrollContainer) {
      scrollContainer.style.maxHeight = "none";
      scrollContainer.style.overflow = "visible";
    }

    const printContents = clone.innerHTML;

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

  const qtyDecreaseHandler = async (item) => {
    try {
      const res = await qtyDecrease({ orderId: order._id, productId: item.productId }).unwrap();
      toast.success(res?.message || "Item quantity decreased successfully");
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (error) {
      console.error(error);
      toast.error("Failed to decrease item quantity");
    }
  }

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

            {/* Extra shop details */}
            <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-2 gap-y-1 text-xs text-gray-600">
              {order?.shopInfo?.type && (
                <p><span className="font-medium text-gray-700">Type:</span> {order.shopInfo.type}</p>
              )}
              {order?.shopInfo?.email && (
                <p><span className="font-medium text-gray-700">Email:</span> {order.shopInfo.email}</p>
              )}
              {order?.shopInfo?.gstNumber && (
                <p className="col-span-2"><span className="font-medium text-gray-700">GST No:</span> {order.shopInfo.gstNumber}</p>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="border rounded-xl p-3 bg-gray-50 space-y-3">
            {order?.items?.map((item, index) => (
              <div key={index} className="flex justify-between items-start border-b border-gray-200 pb-2">

                {/* LEFT SIDE */}
                <div className="flex gap-3 items-start">
                  <img
                    src={item.image}
                    className="w-10 h-10 rounded object-cover"
                    alt=""
                  />
                  <div>
                    <p className="font-medium text-sm">
                      {item.productName}
                    </p>
                    {item.variantInfo && (
                      <p className="text-xs text-gray-500">{item.variantInfo}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity} &nbsp;•&nbsp; Selling Price: ₹{item.price?.toFixed(2)}
                    </p>
                    {typeof item.mrp === "number" && (
                      <p className="text-xs text-gray-400">InRate: ₹{item.mrp.toFixed(2)}</p>
                    )}
                    {item.discountType && item.discountValue > 0 && (
                      <p className="text-xs text-green-600">
                        Discount: {item.discountValue}{item.discountType === "percentage" ? "%" : "₹"}
                      </p>
                    )}
                    {typeof item.gstRate === "number" && (
                      <p className="text-xs text-gray-400">
                        GST: {item.gstRate}% (₹{item.gstAmount?.toFixed(2)})
                      </p>
                    )}
                    {item.quantity > 1 && (
                      <button
                        onClick={() => qtyDecreaseHandler(item)}
                        className="flex items-center mt-1 mr-1 gap-1 text-red-500 border border-red-300 px-2 py-[2px] rounded-md text-xs hover:bg-red-50 transition no-print"
                      >
                        <CiCircleMinus size={14} />
                        <span>Qty Decrease</span>
                      </button>
                    )}
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

            {/* Full price breakdown */}
            <div className="flex justify-between items-center text-sm">
              <span>Subtotal</span>
              <span>₹{order?.subtotal?.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span>Total Tax</span>
              <span>₹{order?.totalTax?.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span>Total Delivery Charge</span>
              <span>₹{order?.deliveryCharge?.toFixed(2)}</span>
            </div>

            {order?.otherCharges > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span>Other Charges</span>
                <span>₹{order?.otherCharges?.toFixed(2)}</span>
              </div>
            )}

            {order?.packagingType && (
              <div className="flex justify-between items-center text-sm">
                <span>Packaging Type</span>
                <span className="capitalize">{order.packagingType}</span>
              </div>
            )}

            {order?.totalDiscount > 0 && (
              <div className="flex justify-between items-center text-sm text-red-500">
                <span>Total Discount</span>
                <span>- ₹{order?.totalDiscount?.toFixed(2)}</span>
              </div>
            )}

            {Array.isArray(order?.discounts) && order.discounts.length > 0 && (
              <div className="text-xs text-gray-500 space-y-1">
                {order.discounts.map((d, i) => (
                  <p key={i}>{JSON.stringify(d)}</p>
                ))}
              </div>
            )}

            <div className="flex justify-between text-green-600 items-center text-sm font-semibold pt-1 border-t border-gray-200">
              <span>Grand Total</span>
              <span>₹{order?.grandTotal?.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="border rounded-xl p-3 bg-gray-50 space-y-1">
            <p className="font-semibold text-sm mb-1">Payment Info</p>
            <div className="flex justify-between text-sm">
              <span>Payment Method</span>
              <span>{order?.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Payment Status</span>
              <span className="capitalize">{order?.payment_status}</span>
            </div>
            {order?.amountPaidOnline > 0 && (
              <div className="flex justify-between text-sm">
                <span>Paid Online</span>
                <span>₹{order?.amountPaidOnline?.toFixed(2)}</span>
              </div>
            )}
            {order?.paymentMethod !== "COD" && order?.amountPaidCash > 0 && (
              <div className="flex justify-between text-sm">
                <span>Paid in Cash</span>
                <span>₹{order?.amountPaidCash?.toFixed(2)}</span>
              </div>
            )}
            {order?.walletAmountUsed > 0 && (
              <div className="flex justify-between text-sm">
                <span>Wallet Used</span>
                <span>₹{order?.walletAmountUsed?.toFixed(2)}</span>
              </div>
            )}
            {order?.remainingAmount > 0 && (
              <div className="flex justify-between text-sm text-red-500">
                <span>Remaining Amount</span>
                <span>₹{order?.remainingAmount?.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-semibold pt-1 border-t border-gray-200">
              <span>Total Paid</span>
              <span>₹{order?.paidAmount?.toFixed(2)}</span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="border rounded-xl p-3 bg-gray-50">
            <p className="font-semibold text-sm mb-1">Shipping Address</p>
            {order?.shippingAddress?.label && (
              <p className="text-xs text-gray-500 mb-1">Label: {order.shippingAddress.label}</p>
            )}
            <p className="text-sm">{order?.shippingAddress?.fullName}</p>
            {order?.shippingAddress?.phone && (
              <p className="text-xs text-gray-600">Phone: {order.shippingAddress.phone}</p>
            )}
            <p className="text-xs text-gray-600">
              {order?.shippingAddress?.addressLine1}
              {order?.shippingAddress?.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ""}
            </p>
            {order?.shippingAddress?.landmark && (
              <p className="text-xs text-gray-600">Landmark: {order.shippingAddress.landmark}</p>
            )}
            <p className="text-xs text-gray-600">
              {order?.shippingAddress?.city}, {order?.shippingAddress?.state} - {order?.shippingAddress?.postalCode}
            </p>
            <p className="text-xs text-gray-600">{order?.shippingAddress?.country}</p>
          </div>

          {/* Delivery Boy */}
          {order?.deliveryBoy && (
            <div className="border rounded-xl p-3 bg-gray-50">
              <p className="font-semibold text-sm mb-1">Delivery Partner</p>
              <p className="text-sm">{order.deliveryBoy.name}</p>
              {order.deliveryBoy.contact && (
                <p className="text-xs text-gray-600">Contact: {order.deliveryBoy.contact}</p>
              )}
              {order.deliveryBoy.email && (
                <p className="text-xs text-gray-600">Email: {order.deliveryBoy.email}</p>
              )}
            </div>
          )}

          {/* Cancellation Info */}
          {order?.cancellationReason && (
            <div className="border rounded-xl p-3 bg-red-50">
              <p className="font-semibold text-sm mb-1 text-red-600">Cancellation Reason</p>
              <p className="text-sm text-red-500">{order.cancellationReason}</p>
              {order?.cancellationImage && (
                <img
                  src={order.cancellationImage}
                  className="mt-2 w-full max-h-40 object-cover rounded-lg"
                  alt="Cancellation proof"
                />
              )}
            </div>
          )}

          {/* Order Meta */}
          <div className="border rounded-xl p-3 bg-gray-50 text-xs text-gray-500 space-y-1">
            <p><span className="font-medium text-gray-700">Order ID:</span> {order?.orderId}</p>
            <p><span className="font-medium text-gray-700">Items Count:</span> {order?.itemsCount}</p>
            <p><span className="font-medium text-gray-700">Placed On:</span> {order?.placedOn}</p>
            <p><span className="font-medium text-gray-700">Created At:</span> {order?.createdAt ? new Date(order.createdAt).toLocaleString() : ""}</p>
            <p className="capitalize"><span className="font-medium text-gray-700">Status:</span> {order?.rawStatus}</p>
          </div>

          {/* Timeline */}
          <div className="border rounded-xl p-4 bg-gray-50 no-print">
            <p className="font-semibold text-sm mb-4">Order Timeline</p>

            {[...timeline].reverse().map((item, index, arr) => {
              const isLast = index === timeline.length - 1;

              return (
                <div key={index} className="relative flex items-start gap-4">

                  {/* Vertical Line */}
                  {!isLast && (
                    <div className="absolute left-[11px] top-6 w-[2px] h-full bg-green-500"></div>
                  )}

                  {/* Circle */}
                  <div className="z-10 w-6 h-6 rounded-full bg-blue-900 text-green-300 flex items-center justify-center text-xs">
                    ✓
                  </div>

                  {/* Content */}
                  <div className="pb-6 flex-1">
                    <div className="flex justify-between items-start">

                      <div>
                        <p className="font-medium capitalize">
                          {item.status}
                        </p>

                        {item.by && (
                          <p className="text-xs text-gray-500">
                            By : {item.by}
                          </p>
                        )}
                      </div>

                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {item.at
                          ? new Date(item.at).toLocaleString()
                          : "-"}
                      </span>

                    </div>
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