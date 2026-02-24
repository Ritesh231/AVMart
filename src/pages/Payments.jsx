import { ArrowDown, BadgeIndianRupee, Blocks, ChartColumnIncreasing, ChevronDown, CircleDashed, CreditCard, Download, FileText, HandCoins, Search, SlidersHorizontal, Upload, Wallet, WalletMinimal } from 'lucide-react'
import React, { useState } from 'react'
import StatCard from '../components/StatCard'
import OnlinePaymentCard from '../components/payment/OnlinePaymentCard';
import CashOnDeliveryCard from '../components/payment/CashOnDeliveryCard';
import PartialPaymentCard from '../components/payment/PartialPaymentCard';
import { useGetTransactionsOverviewQuery } from "../Redux/apis/paymentApi";

const Payments = () => {
    const [activeTab, setActiveTab] = useState('Online');
    const [searchTerm, setSearchTerm] = useState("");

    const tabMapping = {
        Online: "online",
        Cash: "cod",
        Partial: "partial",
    };

    const {
        data,
        isLoading,
        isFetching,
        isError,
    } = useGetTransactionsOverviewQuery(tabMapping[activeTab]);

    const transactions = data?.list?.transactions || [];
    const filteredTransactions = transactions.filter((txn) => {
  const search = searchTerm.toLowerCase();

  return (
    txn.customer?.toLowerCase().includes(search) ||
    txn.orderId?.toLowerCase().includes(search) ||
    txn.shortOrderId?.toLowerCase().includes(search) ||
    txn.txnId?.toLowerCase().includes(search) ||
    txn.paymentDetails?.[0]?.id?.toLowerCase().includes(search)
  );
});

    const summary = data?.summary || {};

    const StatCardSkeleton = () => {
        return (
            <div className="animate-pulse bg-gray-100 p-6 rounded-2xl">
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            </div>
        );
    };

    const PaymentCardSkeleton = () => {
        return (
            <div className="animate-pulse bg-gray-100 p-6 rounded-2xl">
                <div className="h-5 bg-gray-300 rounded w-1/2 mb-4"></div>

                <div className="space-y-3">
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-300 rounded w-4/6"></div>
                </div>
                <div className="h-8 bg-gray-300 rounded w-1/3 mt-6"></div>
            </div>
        );
    };

    const paymentTypeStat = [
        {
            title: "Online Payments",
            number: summary?.online || "0",
            statement: "+ 12 % from last Month",
            icon: <BadgeIndianRupee size={24} />,
            special: true
        },
        {
            title: "Cash On Delivery",
            number: summary?.cod || "0",
            statement: "+ 12 % from last week",
            icon: <BadgeIndianRupee size={24} />,
            special: false
        },
        {
            title: "Partial Payments",
            number: summary?.partial || "0",
            statement: "+ 12 % from last week",
            icon: <BadgeIndianRupee size={24} />,
            special: false
        },
        {
            title: "Total Revenue",
            number: summary?.totalRevenue || "0",
            statement: "+ 12 % from last week",
            icon: <BadgeIndianRupee size={24} />,
            special: false
        }
    ];

    // const onlineTransaction = [
    //     {
    //         id: 1,
    //         customerName: "John Doe",
    //         date: "2026-02-05 10:30 AM",
    //         orderId: "ORD - 1234",
    //         transactionId: "TXN-123",
    //         paymentMethod: "UPI",
    //         amount: "1,250",
    //         status: "Success"
    //     },
    // ];
    // // Mock CashOnDelivery Transaction list
    // const CODTransaction = [
    //     {
    //         id: 1,
    //         customerName: "John Doe",
    //         date: "2026-02-05 10:30 AM",
    //         orderId: "ORD - 1234",
    //         CODId: "COD-123",
    //         deliveryBoy: "Rahul Sharma",
    //         amount: "1,250",
    //         status: "Completed"
    //     },
    // ];

    // const partialPaymentTransactions = [
    //     {
    //         id: "PAR-9012",
    //         customerName: "Anita Desai",
    //         orderId: "ORD-1239",
    //         deliveryBoy: "John Doe",
    //         totalAmount: 3500,
    //         currency: "₹",
    //         status: "Fully Paid",
    //         breakdown: {
    //             advance: {
    //                 label: "Advance Payment ( Partial )",
    //                 amount: 3500,
    //                 method: "UPI",
    //                 date: "20/12/2025",
    //                 time: "09:30 AM",
    //                 statusText: "Paid At Order Placement"
    //             },
    //             remaining: {
    //                 label: "Remaining Payment",
    //                 amount: 3500,
    //                 method: "Cash",
    //                 date: "20/12/2025",
    //                 time: "09:30 AM",
    //                 statusText: "Paid At Delivery"
    //             }
    //         }
    //     },

    //     {
    //         id: "PAR-9012",
    //         customerName: "Anita Desai",
    //         orderId: "ORD-1239",
    //         deliveryBoy: "John Doe",
    //         totalAmount: 3500,
    //         currency: "₹",
    //         status: "Fully Paid",
    //         breakdown: {
    //             advance: {
    //                 label: "Advance Payment ( Partial )",
    //                 amount: 3500,
    //                 method: "UPI",
    //                 date: "20/12/2025",
    //                 time: "09:30 AM",
    //                 statusText: "Paid At Order Placement"
    //             },
    //             remaining: {
    //                 label: "Remaining Payment",
    //                 amount: 3500, // Based on image total collection
    //                 method: "Cash",
    //                 date: "20/12/2025",
    //                 time: "09:30 AM",
    //                 statusText: "Paid At Delivery"
    //             }
    //         }
    //     },
    // ];

    // NOTE: Code for pyment type toggle button

    const tabs = [
        { id: 'Online', label: 'Online Payments', icon: <CreditCard size={20} /> },
        { id: 'Cash', label: 'Cash On Delivery', icon: <Wallet size={20} /> },
        { id: 'Partial', label: 'Partial Payments', icon: <Blocks size={20} /> }
    ];

    if (isLoading) {
        return (
            <div className="p-6">
                {/* Skeleton Heading */}
                <div className="animate-pulse mb-6">
                    <div className="h-6 bg-gray-300 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                </div>

                {/* Skeleton Stat Cards */}
                <section className="mb-6 bg-white border-2 border-[#62CDB999] rounded-[2.5rem] p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <StatCardSkeleton key={i} />
                        ))}
                    </div>
                </section>

                {/* Skeleton Payment Cards */}
                <section className="bg-white border-2 border-brand-soft rounded-[2.5rem] p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <PaymentCardSkeleton key={i} />
                        ))}
                    </div>
                </section>
            </div>
        );
    }
    if (isError) return <p>Error loading payments</p>;

    return (
        <div className='p-6'>
            <section className="heading-and-btn-sec my-6 ">
                <h2>Payment</h2>
                <p className='text-[#9F9F9F] text-[0.92rem]'>Manage Payments</p>
            </section>

            {/* Stats Cards */}
            <section className="stat-card-sec mb-6 bg-white border-2 border-[#62CDB999] rounded-[2.5rem] p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {paymentTypeStat.map((stat, index) => (
                        <StatCard
                            key={index}
                            title={stat.title}
                            number={stat.number}
                            statement={stat.statement}
                            icon={stat.icon}
                            variant={stat.special ? 'special' : 'normal'}
                        />
                    ))}
                </div>
            </section>

            {/* Payment filter button section*/}
            <section className="flex flex-col sm:flex-row bg-[#1E264F] p-2 my-6 rounded-xl gap-2  md:w-fit w-full shadow-lg">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 rounded-lg flex items-center gap-3 font-semibold transition-all duration-300 first:ml-0 
                        ${activeTab === tab.id
                                ? 'bg-[#00E5B0] text-white shadow-sm'
                                : 'bg-white text-[#1E264F] hover:bg-opacity-90'
                            }`}
                    >
                        {/* Icon inherits text color automatically */}
                        <span className={activeTab === tab.id ? 'text-white' : 'text-[#1E264F]'}>
                            {tab.icon}
                        </span>
                        {tab.label}
                    </button>
                ))}
            </section>

            <section className="bg-white border-2 border-brand-soft rounded-[2.5rem] p-6 shadow-sm overflow-hidden">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                    {/* Search Bar */}
                    <div className="w-full lg:w-[40%] md:w-[50%]">
                        <div className='flex items-center gap-2 bg-white border-2 border-brand-soft rounded-2xl p-3 focus-within:border-brand-teal transition-all'>
                            <Search className="text-brand-gray" size={20} />
                            <input
                                className='w-full bg-transparent border-none focus:ring-0 focus:outline-none text-brand-navy placeholder:text-brand-gray'
                                type="text"
                                placeholder='Search By Name, Order ID, Transaction ID'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Export Button */}
                    <div className='flex justify-evenly gap-2 items-center'>
                        <button className='bg-brand-cyan  font-semibold text-brand-navy px-3 py-3 rounded-xl flex justify-center gap-2 items-center'>
                            <SlidersHorizontal size={20} />
                        </button>
                        <button className='border-brand-cyan border-[1px] font-semibold text-brand-navy px-3 py-3 rounded-2xl flex justify-center gap-2 items-center'>
                            <p>Today’s</p> <ChevronDown size={20} />
                        </button>
                        <button className='bg-brand-navy px-6 py-3 rounded-2xl flex justify-center gap-2 items-center text-white font-bold hover:bg-opacity-90 transition-all'>
                            <Download size={20} /> Export
                        </button>
                    </div>
                </div>

                {
                    activeTab === "Online" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 w-full whitespace-break-spaces">
                            {isFetching
                                ? [...Array(6)].map((_, i) => (
                                    <PaymentCardSkeleton key={i} />
                                ))
                                : filteredTransactions.map((txn) => (
                                    <OnlinePaymentCard
                                        key={txn._id || txn.id}
                                        customerName={txn.customer}
                                        dateTime={txn.dateTime}
                                        orderId={txn.orderId}
                                        txnId={txn.txnId}
                                        paymentMethod={txn.paymentMethod}
                                        amount={txn.amount}
                                        status={txn.status}
                                    />
                                ))
                            }
                        </div>
                    )
                }

                {/* --------------------------- */}

                {/* CashOnDelivery Payment Cards */}
                {activeTab === "Cash" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 whitespace-break-spaces">
                        {isFetching
                            ? [...Array(6)].map((_, i) => (
                                <PaymentCardSkeleton key={i} />
                            ))
                            : filteredTransactions.map((txn) => (
                                <CashOnDeliveryCard
                                    key={txn._id || txn.id}
                                    transaction={{
                                        id: txn.id,
                                        customer: txn.customer,
                                        date: new Date(txn.dateTime).toLocaleString(),
                                        status: txn.status.replaceAll("_", " "),
                                        orderId: txn.shortOrderId,
                                        CODId: txn.paymentDetails?.[0]?.id,
                                        deliveryBoy: txn.deliveryBoy?.name || "Not Assigned",
                                        amount: txn.amount,
                                    }}
                                />
                            ))
                        }
                    </div>
                )}

                {/* --------------------------- */}

                {activeTab === "Partial" && (
                    <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-1 gap-6">
                        {isFetching
                            ? [...Array(6)].map((_, i) => (
                                <PaymentCardSkeleton key={i} />
                            ))
                            : filteredTransactions.map((txn) => {
                                const formattedTransaction = {
                                    id: txn.id,
                                    customerName: txn.customer,
                                    orderId: txn.shortOrderId,
                                    deliveryBoy: "N/A",
                                    totalAmount: txn.amount,
                                    currency: "₹",
                                    status: txn.status.replaceAll("_", " "),
                                    breakdown: {
                                        advance: {
                                            label: "Advance Payment (Online)",
                                            amount: txn.paidOnline,
                                            method: "Online",
                                            date: new Date(txn.dateTime).toLocaleDateString(),
                                            time: new Date(txn.dateTime).toLocaleTimeString(),
                                            statusText: "Paid at Order Placement"
                                        },
                                        remaining: {
                                            label: "Remaining Payment (Cash)",
                                            amount: txn.paidCash,
                                            method: "Cash",
                                            date: new Date(txn.dateTime).toLocaleDateString(),
                                            time: new Date(txn.dateTime).toLocaleTimeString(),
                                            statusText: txn.remaining > 0 ? "Pending at Delivery" : "Paid at Delivery"
                                        }
                                    }
                                };

                                return (
                                    <PartialPaymentCard
                                        key={txn._id}
                                        transaction={formattedTransaction}
                                    />
                                );
                            })
                        }
                    </div>
                )}
            </section >
        </div>
    )
}

export default Payments