import React, { useState } from 'react';
import { ChevronDown, ChevronUp, DollarSign, WalletMinimal } from 'lucide-react';

const PartialPaymentCard = ({ transaction }) => {
    const [isOpen, setIsOpen] = useState(false);

    // 1. Safety check: If transaction is missing, return null or a skeleton
    if (!transaction || !transaction.breakdown) {
        return <div className="p-4 border border-red-200 rounded-xl bg-red-50 text-red-500">Error: Transaction data missing</div>;
    }

    const { advance, remaining } = transaction.breakdown || {};

    return (
        <div className="bg-white border-2 border-brand-soft rounded-3xl p-4 mb-4 shadow-sm transition-all overflow-hidden">
            {/* COLLAPSIBLE HEADER */}
            <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-4">
                    <div className="bg-brand-navy p-3 rounded-xl text-white">
                        <WalletMinimal size={24} />
                    </div>
                    <div>
                        <h3 className="text-brand-navy font-bold text-lg">{transaction.customerName}</h3>
                        <p className="text-brand-gray text-base ">
                            Order: {transaction.orderId} • Payment ID: {transaction.id}
                        </p>
                    </div>
                </div>

                <div className="hidden md:block bg-brand-navy text-white text-xs px-4 py-3 rounded-xl font-bold">
                    Delivery Boy - {transaction.deliveryBoy}
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-brand-gray text-[10px] font-bold uppercase">Total Amount</p>
                        <p className="text-brand-teal font-extrabold text-xl">{transaction.currency}{transaction.totalAmount.toLocaleString()}</p>
                    </div>
                    <div className="text-brand-navy ml-2">
                        {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </div>
                </div>
            </div>

            {/* EXPANDABLE CONTENT */}
            {isOpen && (
                <div className="mt-6 pt-6 border-t border-brand-soft bg-brand-soft/80 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-6 text-brand-navy font-bold">
                        <DollarSign size={20} className="bg-brand-navy text-white rounded-full p-0.5" />
                        <span>Payment Breakdown</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4  rounded-lg">
                        {/* Step 1: Advance */}
                        <PaymentStep step="1" data={advance} type="upi" />

                        {/* Step 2: Remaining */}
                        <PaymentStep step="2" data={remaining} type="cash" />

                        {/* Summary Card */}
                        <div className="flex flex-col justify-between items-start bg-white border border-brand-soft p-5 rounded-2xl shadow-sm">
                            <div className="flex items-center gap-2 mb-4 text-brand-navy font-bold text-sm">
                                <DollarSign size={16} className="bg-brand-navy text-white rounded-full p-0.5" />
                                <span>Payment Summary</span>
                            </div>
                            <div>
                                <p className="text-brand-gray text-[10px] font-bold uppercase">Total Collected</p>
                                <p className="text-brand-navy font-extrabold text-2xl mt-1">
                                    {transaction.currency}{advance.amount + remaining.amount} / {transaction.currency}{transaction.totalAmount}
                                </p>

                            </div>
                            <div className="mt-4 w-full bg-[#E6FCEE] text-green-600 text-[10px] font-bold py-2 rounded-xl text-center uppercase">
                                {transaction.status}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Internal Sub-component for Advance/Remaining blocks
const PaymentStep = ({ step, data, type }) => (
    <div className="bg-white border border-brand-soft p-5 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <span className="bg-[#BFF6E9] text-brand-teal w-8 h-8 rounded-full flex items-center justify-center font-bold">{step}</span>
                <span className="text-brand-navy font-bold text-sm">{data.label}</span>
            </div>
        </div>

        <div className="space-y-2 mb-4">
            <div className="flex justify-between text-xs">
                <span className="text-brand-gray font-semibold">Amount Paid</span>
                <span className="text-brand-navy font-bold">₹{data.amount}</span>
            </div>
            <div className="flex justify-between text-xs items-center">
                <span className="text-brand-gray font-semibold">Method</span>
                <span className={`px-3 py-0.5 rounded-lg border font-bold ${type === 'upi' ? 'bg-blue-50 border-blue-200 text-blue-500' : 'bg-cyan-50 border-cyan-200 text-brand-teal'}`}>
                    {data.method}
                </span>
            </div>
            <div className="flex justify-between text-xs">
                <span className="text-brand-gray font-semibold">Date & Time</span>
                <span className="text-brand-navy font-bold">{data.date} {data.time}</span>
            </div>
        </div>

        <div className="w-full bg-[#E6FCEE] text-green-600 text-[10px] font-bold py-2 rounded-xl text-center uppercase">
            {data.statusText}
        </div>
    </div>
);

export default PartialPaymentCard;