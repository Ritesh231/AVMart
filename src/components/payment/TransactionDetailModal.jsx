import React from 'react';
import { X, Package, User, CreditCard, IndianRupee, Truck, MapPin, Mail, Phone, FileText } from 'lucide-react';
import { useGetTransactionByIdQuery } from '../../Redux/apis/paymentApi';

const TransactionDetailModal = ({ orderId, onClose }) => {
    const { data, isLoading, isError } = useGetTransactionByIdQuery(
        { id: orderId },
        { skip: !orderId }
    );

    const order = data?.data;

    const statusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'paid':
            case 'captured':
            case 'delivered':
                return 'bg-green-50 text-green-700 border border-green-200';
            case 'pending':
                return 'bg-amber-50 text-amber-700 border border-amber-200';
            case 'failed':
            case 'cancelled':
                return 'bg-red-50 text-red-700 border border-red-200';
            default:
                return 'bg-gray-100 text-gray-600 border border-gray-200';
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-[2rem] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 bg-gradient-to-r from-[#FD610D] to-[#FF8800] px-6 py-4 flex justify-between items-start">
                    <div>
                        <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                            Order Details
                        </p>
                        <h3 className="text-xl font-extrabold text-white tracking-tight">
                            {order?.orderId || '—'}
                        </h3>
                        {order?.placedOn && (
                            <p className="text-xs text-white/70 mt-0.5">Placed on {order.placedOn}</p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/25 transition-all"
                    >
                        <X size={18} className="text-white" />
                    </button>
                </div>

                <div className="p-4 space-y-3 bg-[#FAFBFF]">
                    {isLoading && (
                        <div className="animate-pulse space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-20 bg-gray-200 rounded-2xl"></div>
                            <div className="h-20 bg-gray-200 rounded-2xl"></div>
                        </div>
                    )}

                    {isError && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-2xl p-3">
                            Failed to load order details.
                        </div>
                    )}

                    {order && (
                        <>
                            {/* Status Pills */}
                            <div className="flex flex-wrap gap-1.5">
                                <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${statusColor(order.orderStatus)}`}>
                                    Order · {order.orderStatus}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${statusColor(order.deliveryStatus)}`}>
                                    Delivery · {order.deliveryStatus}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${statusColor(order.paymentDetails?.paymentStatus)}`}>
                                    Payment · {order.paymentDetails?.paymentStatus}
                                </span>
                            </div>

                            {/* Grand Total + Delivery Boy side by side */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="bg-gradient-to-r from-[#1E264F] to-[#2A3566] rounded-2xl p-4 flex items-center justify-between shadow-md">
                                    <div>
                                        <p className="text-white/60 text-[9px] font-bold uppercase tracking-wider">
                                            Grand Total
                                        </p>
                                        <p className="text-white text-2xl font-extrabold mt-0.5">
                                            ₹{order.financials?.grandTotal ?? 0}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white/60 text-[9px] font-bold uppercase tracking-wider">
                                            Remaining
                                        </p>
                                        <p className={`text-base font-bold mt-0.5 ${order.financials?.remainingAmount > 0 ? 'text-amber-300' : 'text-emerald-300'}`}>
                                            ₹{order.financials?.remainingAmount ?? 0}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
                                    <div className="bg-[#1E264F] text-white rounded-xl p-2 shrink-0">
                                        <Truck size={16} />
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-[9px] font-bold uppercase tracking-wider">
                                            Delivery Boy
                                        </p>
                                        <p className="text-sm font-bold text-[#1E264F] mt-0.5">
                                            {order.deliveryBoy?.name || (
                                                <span className="text-gray-400 font-medium italic">Not Assigned</span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Customer */}
                            <SectionCard icon={<User size={14} />} title="Customer">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                    <InfoRow label="Name" value={order.customer?.name} />
                                    <InfoRow label="Shop" value={order.customer?.shopName} />
                                    <InfoRow icon={<Phone size={12} />} label="Contact" value={order.customer?.contact} />
                                    <InfoRow icon={<Mail size={12} />} label="Email" value={order.customer?.email} />
                                    <div className="sm:col-span-2">
                                        <InfoRow icon={<MapPin size={12} />} label="Address" value={order.customer?.shopAddress} />
                                    </div>
                                    {order.customer?.gstNumber && (
                                        <InfoRow icon={<FileText size={12} />} label="GST" value={order.customer.gstNumber} />
                                    )}
                                </div>
                            </SectionCard>

                            {/* Items */}
                            <SectionCard icon={<Package size={14} />} title="Items">
                                <div className="overflow-hidden rounded-xl border border-gray-100">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-[#1E264F]/5">
                                                <th className="text-left px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-[#1E264F]">Product</th>
                                                <th className="text-left px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-[#1E264F]">Variant</th>
                                                <th className="text-right px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-[#1E264F]">Qty</th>
                                                <th className="text-right px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-[#1E264F]">Price</th>
                                                <th className="text-right px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-[#1E264F]">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.items?.map((item, i) => (
                                                <tr
                                                    key={item.variantId}
                                                    className={`border-t border-gray-100 ${i % 2 === 1 ? 'bg-gray-50/50' : ''}`}
                                                >
                                                    <td className="px-3 py-2 font-semibold text-[#1E264F]">{item.productName}</td>
                                                    <td className="px-3 py-2 text-gray-500">{item.variantDisplay}</td>
                                                    <td className="px-3 py-2 text-right text-gray-600">{item.quantity}</td>
                                                    <td className="px-3 py-2 text-right text-gray-600">₹{item.price}</td>
                                                    <td className="px-3 py-2 text-right font-bold text-[#1E264F]">₹{item.itemTotal}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </SectionCard>

                            {/* Financials */}
                            <SectionCard icon={<IndianRupee size={14} />} title="Financials">
                                <div className="space-y-0.5 text-sm">
                                    <Row label="Subtotal" value={order.financials?.subtotal} />
                                    <Row label="Discount" value={order.financials?.totalDiscount} negative />
                                    <Row label="Tax (GST)" value={order.financials?.totalTax} />
                                    <Row label="Delivery Charge" value={order.financials?.deliveryCharge} />
                                    <Row label="Wallet Used" value={order.financials?.walletAmountUsed} negative />
                                    <hr className="my-1.5 border-dashed border-gray-200" />
                                    <Row label="Grand Total" value={order.financials?.grandTotal} bold />
                                    <Row label="Paid Online" value={order.financials?.amountPaidOnline} />
                                    <Row label="Paid Cash" value={order.financials?.amountPaidCash} />
                                    <Row label="Remaining" value={order.financials?.remainingAmount} bold accent />
                                </div>
                            </SectionCard>

                            {/* Payment / Transactions */}
                            <SectionCard icon={<CreditCard size={14} />} title="Payment Details">
                                <div className="space-y-2 text-sm">
                                    <InfoRow label="Method" value={order.paymentDetails?.paymentMethod} />
                                    {order.paymentDetails?.razorpayOrderId && (
                                        <InfoRow label="Razorpay Order ID" value={order.paymentDetails.razorpayOrderId} mono />
                                    )}
                                    {order.paymentDetails?.transactions?.map((tx) => (
                                        <div
                                            key={tx.id}
                                            className="border border-gray-100 rounded-xl p-3 bg-white shadow-sm"
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-[#1E264F] capitalize">
                                                    {tx.type} · ₹{tx.amount}
                                                </span>
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusColor(tx.status)}`}>
                                                    {tx.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(tx.createdAt).toLocaleString()}
                                            </p>
                                            {tx.metadata?.razorpayPaymentId && (
                                                <p className="text-xs text-gray-400 mt-0.5 font-mono">
                                                    {tx.metadata.razorpayPaymentId}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </SectionCard>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// Reusable section wrapper
const SectionCard = ({ icon, title, children }) => (
    <section className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2.5">
            <div className="bg-[#1E264F] text-white rounded-lg p-1.5">
                {icon}
            </div>
            <h4 className="text-[#1E264F] font-bold text-sm">{title}</h4>
        </div>
        {children}
    </section>
);

const InfoRow = ({ icon, label, value, mono }) => (
    <div className="flex items-start gap-1.5">
        {icon && <span className="text-gray-400 mt-0.5">{icon}</span>}
        <p className={mono ? 'font-mono text-xs text-gray-600' : ''}>
            <span className="text-gray-400 text-[11px] block">{label}</span>
            <span className="text-[#1E264F] font-semibold">{value || '—'}</span>
        </p>
    </div>
);

const Row = ({ label, value, bold, negative, accent }) => (
    <div className={`flex justify-between py-0.5 ${bold ? 'font-bold text-[#1E264F] text-[14px]' : 'text-gray-600'}`}>
        <span>{label}</span>
        <span className={accent ? 'text-[#FD610D] font-extrabold' : ''}>
            {negative && value > 0 ? '– ' : ''}₹{value ?? 0}
        </span>
    </div>
);

export default TransactionDetailModal;