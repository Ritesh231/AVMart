import React from 'react'
import { CreditCard, CheckCircle2, Eye } from 'lucide-react';

const OnlinePaymentCard = ({
    customerName,
    dateTime,
    orderId,
    txnId,
    paymentMethod,
    amount,
    status,
    onView, // ✅ destructure it
}) => {
    return (
        <div className="bg-white border-2 border-brand-soft rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow w-full max-w-md">
            {/* Header Section */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                    <div className="bg-brand-navy p-3 rounded-xl flex items-center justify-center text-white">
                        <CreditCard size={24} />
                    </div>
                    <div>
                        <h3 className="text-brand-navy font-bold text-lg leading-tight">{customerName}</h3>
                        <p className="text-brand-navy text-xs font-medium">{dateTime?.split("T")[0]}</p>
                    </div>
                </div>
                {/* Status Badge */}
                <div className="flex items-center gap-1 bg-brand-green text-green-600 px-3 py-2 rounded-lg border border-green-200 whitespace-break-spaces">
                    <CheckCircle2 size={18} />
                    <span className="text-xs font-semibold">
                        {status?.split("_")[0]}
                    </span>
                </div>
            </div>

            {/* Order Info */}
            <div className="mb-5">
                <p className="text-black text-sm">
                    Order : {orderId} <br /> Transaction : {txnId}
                </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {/* Payment Method */}
                <div className="bg-brand-blue p-2 sm:p-3 rounded-lg flex flex-col justify-between items-start w-full">
                    <p className="text-[10px] text-brand-navy font-bold uppercase w-full break-words whitespace-normal">
                        Payment Method
                    </p>
                    <p className="text-brand-navy font-extrabold text-sm sm:text-base break-words">
                        Online
                    </p>
                </div>

                {/* Amount + View button side by side */}
                <div className="bg-brand-blue p-2 sm:p-3 rounded-lg flex items-center justify-between w-full gap-2">
                    <div className="flex flex-col justify-between items-start">
                        <p className="text-[10px] text-brand-navy font-bold uppercase">
                            Amount
                        </p>
                        <p className="text-brand-navy font-extrabold text-sm sm:text-base">
                            ₹{amount?.toFixed(2)}
                        </p>
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
    )
}

export default OnlinePaymentCard;