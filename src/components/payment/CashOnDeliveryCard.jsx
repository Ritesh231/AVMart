import React from 'react';
import { CheckCircle2, Eye, Receipt } from 'lucide-react';
import { FaWallet } from 'react-icons/fa6';

const CashOnDeliveryCard = ({ transaction, onView }) => {
  const { customer, date, status, orderId, CODId, deliveryBoy, amount, margin } = transaction;

  const hasDeliveryBoy =
    deliveryBoy && deliveryBoy.trim().toLowerCase() !== 'not assigned';

  return (
    <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow w-full max-w-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="bg-[#1E264F] w-11 h-11 shrink-0 rounded-xl flex items-center justify-center text-white">
            <FaWallet size={18} />
          </div>
          <div className="min-w-0">
            <h3 className="text-[#1E264F] font-semibold text-base leading-tight truncate">
              {customer}
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">{date}</p>
          </div>
        </div>

        <span className="shrink-0 inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-1.5 rounded-full border border-emerald-200 capitalize">
          <CheckCircle2 size={14} />
          {status}
        </span>
      </div>

      {/* Order info */}
      <div className="flex items-start gap-2 bg-brand-blue rounded-xl px-3.5 py-3 mb-4 border border-blue-100">
        <Receipt size={16} className="text-[#1E264F]/50 mt-0.5 shrink-0" />
        <div className="text-xs text-[#1E264F]/80 leading-relaxed min-w-0">
          <p className="truncate">
            Order <span className="text-[#1E264F] font-medium">{orderId}</span>
          </p>
          <p className="truncate">
            COD ID <span className="text-[#1E264F] font-medium">{CODId}</span>
          </p>
        </div>
      </div>

      {/* Details */}
      <div className={`grid gap-3 ${hasDeliveryBoy ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {hasDeliveryBoy && (
          <div className="bg-brand-blue border border-blue-100 rounded-xl p-3 flex flex-col justify-between">
            <p className="text-[10px] font-semibold uppercase text-[#1E264F]/60 tracking-wide">
              Delivery boy
            </p>
            <p className="text-sm font-semibold text-[#1E264F] mt-2 truncate">
              {deliveryBoy}
            </p>
          </div>
        )}

        <div className="bg-brand-blue border border-blue-100 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase text-[#1E264F]/60 tracking-wide">
              Amount
            </p>
            <button
              onClick={onView}
              aria-label="View transaction details"
              className="text-[#1E264F] hover:bg-[#1E264F] hover:text-white rounded-md p-1 transition-colors"
            >
              <Eye size={14} />
            </button>
          </div>
          <p className="text-sm font-semibold text-[#1E264F] mt-2">
            ₹{amount?.toFixed(2)}
          </p>
        </div>

        <div className="bg-brand-blue border border-blue-100 rounded-xl p-3 flex flex-col justify-between">
          <p className="text-[10px] font-semibold uppercase text-[#1E264F]/60 tracking-wide">
            Margin
          </p>
          <p className="text-sm font-semibold text-emerald-600 mt-2">
            ₹{margin?.toFixed(2)}
          </p>
        </div>

      </div>
    </div>
  );
};

export default CashOnDeliveryCard;