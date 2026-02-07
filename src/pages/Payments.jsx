import { ArrowDown, BadgeIndianRupee, Blocks, ChartColumnIncreasing, ChevronDown, CircleDashed, CreditCard, Download, FileText, HandCoins, Search, SlidersHorizontal, Upload, Wallet, WalletMinimal } from 'lucide-react'
import React, { useState } from 'react'
import StatCard from '../components/StatCard'
import OnlinePaymentCard from '../components/payment/OnlinePaymentCard';
import CashOnDeliveryCard from '../components/payment/CashOnDeliveryCard';
import PartialPaymentCard from '../components/payment/PartialPaymentCard';

const Payments = () => {

    const paymentTypeStat = [
        {
            title: "Online Payments",
            number: "₹5.8K",
            statement: "+ 12 % from last Month",
            icon: <BadgeIndianRupee size={24} />,
            special: true // Dark blue gradient background
        },
        {
            title: "Cash On Delivery",
            number: "₹5.8K",
            statement: "+ 12 % from last week",
            icon: <BadgeIndianRupee size={24} />,
            special: false // Light mint background
        },
        {
            title: "Partial Payments",
            number: "₹5.8K",
            statement: "+ 12 % from last week",
            icon: <BadgeIndianRupee size={24} />,
            special: false
        },
        {
            title: "Total Revenue",
            number: "₹5.8K",
            statement: "+ 12 % from last week",
            icon: <BadgeIndianRupee size={24} />,
            special: false
        }
    ];

    // Mock onlineTransaction list
    const onlineTransaction = [
        {
            id: 1,
            customerName: "John Doe",
            date: "2026-02-05 10:30 AM",
            orderId: "ORD - 1234",
            transactionId: "TXN-123",
            paymentMethod: "UPI",
            amount: "1,250",
            status: "Success"
        },
    ];
    // Mock CashOnDelivery Transaction list
    const CODTransaction = [
        {
            id: 1,
            customerName: "John Doe",
            date: "2026-02-05 10:30 AM",
            orderId: "ORD - 1234",
            CODId: "COD-123",
            deliveryBoy: "Rahul Sharma",
            amount: "1,250",
            status: "Completed"
        },
    ];
    // Mock Partial Payment Transaction list
    const partialPaymentTransactions = [
        {
            id: "PAR-9012",
            customerName: "Anita Desai",
            orderId: "ORD-1239",
            deliveryBoy: "John Doe",
            totalAmount: 3500,
            currency: "₹",
            status: "Fully Paid",
            breakdown: {
                advance: {
                    label: "Advance Payment ( Partial )",
                    amount: 3500,
                    method: "UPI",
                    date: "20/12/2025",
                    time: "09:30 AM",
                    statusText: "Paid At Order Placement"
                },
                remaining: {
                    label: "Remaining Payment",
                    amount: 3500, // Based on image total collection
                    method: "Cash",
                    date: "20/12/2025",
                    time: "09:30 AM",
                    statusText: "Paid At Delivery"
                }
            }
        },
        {
            id: "PAR-9012",
            customerName: "Anita Desai",
            orderId: "ORD-1239",
            deliveryBoy: "John Doe",
            totalAmount: 3500,
            currency: "₹",
            status: "Fully Paid",
            breakdown: {
                advance: {
                    label: "Advance Payment ( Partial )",
                    amount: 3500,
                    method: "UPI",
                    date: "20/12/2025",
                    time: "09:30 AM",
                    statusText: "Paid At Order Placement"
                },
                remaining: {
                    label: "Remaining Payment",
                    amount: 3500, // Based on image total collection
                    method: "Cash",
                    date: "20/12/2025",
                    time: "09:30 AM",
                    statusText: "Paid At Delivery"
                }
            }
        },
    ];

    // NOTE: Code for pyment type toggle button
    const [activeTab, setActiveTab] = useState('Online');
    const tabs = [
        { id: 'Online', label: 'Online Payments', icon: <CreditCard size={20} /> },
        { id: 'Cash', label: 'Cash On Delivery', icon: <Wallet size={20} /> },
        { id: 'Partial', label: 'Partial Payments', icon: <Blocks size={20} /> }
    ];

    return (
        <div className='p-6'>
            <section className="heading-and-btn-sec my-6 ">
                <h2>Invoice Management</h2>
                <p className='text-[#9F9F9F] text-[0.92rem]'>Manage Invoices & Inventory</p>
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
            <section className="flex items-center bg-[#1E264F] p-2 my-6 rounded-xl w-fit shadow-lg">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 rounded-lg flex items-center gap-3 font-semibold transition-all duration-300 first:ml-0 ml-2
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
                                placeholder='Search By Invoice Number or GST Number'
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

                {/* TODO - Need to render it based on payemt type toggle */}

                {/* Online Payment Cards */}
                {
                    activeTab == "Online" ? <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {onlineTransaction.map((txn) => (
                            <OnlinePaymentCard key={txn.id} {...txn} />
                        ))}
                    </div> : <></>
                }

                {/* --------------------------- */}

                {/* CashOnDelivery Payment Cards */}
                {
                    activeTab === "Cash" ? <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {CODTransaction.map((txn) => (
                            <CashOnDeliveryCard key={txn.id}  {...txn} />
                        ))}
                    </div> : <></>
                }
                {/* --------------------------- */}

                {
                    activeTab === "Partial" ? <div className="">
                        {partialPaymentTransactions.map((txn) => (
                            <PartialPaymentCard key={txn.id} transaction={txn} />
                        ))}
                    </div> : <></>
                }
            </section >
        </div>
    )
}

export default Payments