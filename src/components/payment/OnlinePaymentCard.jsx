import React from 'react';
import { CreditCard, CheckCircle2, Eye, Receipt } from 'lucide-react';

const OnlinePaymentCard = ({
    customerName,
    dateTime,
    orderId,
    txnId,
    paymentMethod,
    amount,
    status,
    onView,
    margin,
}) => {
    return (
        <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow w-full max-w-md">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="bg-[#1E264F] w-11 h-11 shrink-0 rounded-xl flex items-center justify-center text-white">
                        <CreditCard size={20} />
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-[#1E264F] font-semibold text-base leading-tight truncate">
                            {customerName}
                        </h3>
                        <p className="text-slate-400 text-xs mt-0.5">{dateTime?.split('T')[0]}</p>
                    </div>
                </div>

                <span className="shrink-0 inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-1.5 rounded-full border border-emerald-200">
                    <CheckCircle2 size={14} />
                    {status?.split('_')[0]}
                </span>
            </div>

            {/* Order info */}
            <div className="flex items-start gap-2 bg-brand-blue rounded-xl px-3.5 py-3 mb-2 border border-blue-100">
                <Receipt size={16} className="text-[#1E264F]/50 mt-0.5 shrink-0" />
                <div className="text-xs text-[#1E264F]/80 leading-relaxed min-w-0">
                    <p className="truncate">
                        Order <span className="text-[#1E264F] font-medium">{orderId}</span>
                    </p>
                    <p className="truncate">
                        Transaction <span className="text-[#1E264F] font-medium">{txnId}</span>
                    </p>
                </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-brand-blue border border-blue-100 rounded-xl p-3 flex flex-col justify-between">
                    <p className="text-[10px] font-semibold uppercase text-[#1E264F]/60 tracking-wide">
                        Method
                    </p>
                    <p className="text-sm font-semibold text-[#1E264F] mt-2">{paymentMethod ?? 'Online'}</p>
                </div>

                <div className="bg-brand-blue border border-blue-100 rounded-xl p-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-semibold uppercase text-[#1E264F]/60 tracking-wide">
                            Amount
                        </p>
                        <button
                            onClick={onView}
                            aria-label="View payment details"
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

export default OnlinePaymentCard;