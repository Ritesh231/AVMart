import React from 'react'
import { CreditCard, CheckCircle2 } from 'lucide-react';

const OnlinePaymentCard = ({
    customerName,
    dateTime,
    orderId,
   txnId,
    paymentMethod,
    amount,
    status
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
                    <span className="text-xs font-semibold ">{status}</span>
                </div>
            </div>
            
            {/* Order Info */}
            <div className="mb-5">
                <p className="text-brand-gray/60 text-sm font-semibold">
                    Order : {orderId} . Transaction : {txnId}
                </p>
            </div>
           
            {/* Details Grid */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-brand-blue p-2 rounded-lg flex flex-col  justify-between items-start">
                    <p className="text-[10px] text-brand-navy font-bold uppercase">Payment Method</p>
                    <p className="text-brand-navy font-extrabold text-base">Online</p>
                </div>
                <div className="bg-brand-blue p-2 rounded-lg flex flex-col  justify-between items-start">
                    <p className="text-[10px] text-brand-navy font-bold uppercase">Amount</p>
                    <p className="text-brand-navy font-extrabold text-base">₹{amount}</p>
                </div>

            </div>
        </div>
    )
}

export default OnlinePaymentCard