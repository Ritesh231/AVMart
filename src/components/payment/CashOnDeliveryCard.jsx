import React from "react";
import { CheckCircle2, Eye } from "lucide-react";
import { FaWallet } from "react-icons/fa6";

const CashOnDeliveryCard = ({ transaction, onView }) => {
  const {
    customer,
    date,
    status,
    orderId,
    CODId,
    deliveryBoy,
    amount,
  } = transaction;

  return (
    <div className="bg-white border-2 border-brand-soft rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow w-full max-w-md">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3">
          <div className="bg-brand-navy h-12 p-3 rounded-xl text-white">
            <FaWallet size={24} />
          </div>
          <div>
            <h3 className="text-brand-navy font-semibold text-lg">
              {customer}
            </h3>
            <p className="text-brand-navy text-xs font-medium">
              {date}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-brand-green text-green-600 px-3 py-2 rounded-lg border border-green-200">
          <CheckCircle2 size={18} />
          <span className="text-xs capitalize">
            {status}
          </span>
        </div>
      </div>

      {/* Order Info */}
      <div className="mb-5">
        <p className="text-brand-gray/60 text-sm font-semibold whitespace-break-spaces">
          Order : {orderId} · COD ID : {CODId}
        </p>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-4">
        {deliveryBoy &&
          deliveryBoy.trim().toLowerCase() !== "not assigned" && (
            <div className="bg-brand-blue p-2 rounded-lg">
              <p className="text-[10px] font-bold uppercase">
                Delivery Boy
              </p>
              <p className="font-extrabold">{deliveryBoy}</p>
            </div>
          )}

        {/* Amount + View button side by side */}
        <div className="bg-brand-blue p-2 rounded-lg flex items-center justify-between gap-2">
          <div>
            <p className="text-[10px] font-bold uppercase">
              Amount
            </p>
            <p className="font-extrabold">₹{amount?.toFixed(2)}</p>
          </div>

          <button
            onClick={onView}
            className="flex items-center gap-1 bg-[#1E264F] text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:bg-opacity-90 transition-all shrink-0"
          >
            <Eye size={14} /> View
          </button>
        </div>
      </div>
    </div>
  );
};

export default CashOnDeliveryCard;