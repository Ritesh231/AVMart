import React from 'react'
import { PackageCheck, Box, ShoppingCart, Users, CarFront, ChartColumnIncreasing, Filter, Plus, ChevronsRight } from "lucide-react"
import StatCard from '../components/StatCard';
import ProductViewCard from '../components/product/ProductViewCard';
import TransactionItem from '../components/TransactionItem';

const Dashboard = () => {
    const overViewStats = [
        {
            title: "Delivery Boys",
            number: "20",
            statement: "+ 12 % from last Month",
            icon: <Users size={24} />,
            special: true
        },
        {
            title: "Total Products",
            number: "300",
            statement: "+ 12 % from last Month",
            icon: <ShoppingCart size={24} />
        },
        {
            title: "In Stock",
            number: "200",
            statement: "+ 12 % from last Month",
            icon: <Box size={24} />
        },
        {
            title: "Active Orders",
            number: "20",
            statement: "+ 12 % from last Month",
            icon: <PackageCheck size={24} />
        }
    ];

    const shortOverViewStats = [
        {
            title: "Total Users",
            number: "200",
            statement: "+ 12 % from last Month",
            icon: <Users size={24} />,
            special: true
        },
        {
            title: "Total Orders",
            number: "4K",
            statement: "+ 12 % from last Month",
            icon: <ShoppingCart size={24} />,
        },
        {
            title: "Total Sales",
            number: "95%",
            statement: "+ 12 % from last Month",
            icon: <ChartColumnIncreasing size={24} />,
        },
    ]

    const recentAddedProducts = [
        {
            title: "Fogg Unisex Body Spray",
            discount: "10",
            image: "./images/product-images/fogg.png",
            disPrice: 400,
            ogPrice: 600,
        },
        {
            title: "Mortein Multi Insect Killer",
            discount: "10",
            image: "./images/product-images/mortein.png",
            disPrice: 400,
            ogPrice: 600,
        },
        {
            title: "Fogg Unisex Body Spray",
            discount: "10",
            image: "./images/product-images/fogg.png",
            disPrice: 400,
            ogPrice: 600,
        }
    ];

    const transactionHistory = [
        {
            username: "John Doe",
            image: "",
            time: "14 min ago",
            amount: "450",
            type: "credited"
        },
        {
            username: "Self Transfer",
            image: "",
            time: "02 min ago",
            amount: "450",
            type: "debited"
        },
        {
            username: "John Doe",
            image: "",
            time: "14 min ago",
            amount: "450",
            type: "credited"
        },
        {
            username: "John Doe",
            image: "",
            time: "14 min ago",
            amount: "450",
            type: "credited"
        },
        {
            username: "John Doe",
            image: "",
            time: "14 min ago",
            amount: "450",
            type: "credited"
        }
    ];

    return (
        <div className="p-6 min-h-screen">
            <h2 className=" text-brand-navy my-6">Dashboard</h2>

            {/* MAIN GRID LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* LEFT COLUMN: Finance & Transaction History (Span 4 of 12) */}
                <section className="lg:col-span-4 flex flex-col gap-6 p-6 border-2 border-brand-soft rounded-[3rem] bg-white h-full">
                    <div className="total-revenue">
                        <div className="relative overflow-hidden bg-brand-navy rounded-[2.5rem] p-8 text-white shadow-xl min-h-[240px] flex flex-col justify-between">
                            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-brand-cyan/70 rounded-full blur-[50px]"></div>
                            <div className="flex justify-between items-start relative z-10">
                                <h3 className="text-xl font-medium opacity-90">Total Revenue</h3>
                                <span className="text-xs font-semibold bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                                    + 12 % from last Month
                                </span>
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-5xl font-bold tracking-tight">₹ 45,000</h3>
                            </div>
                            <div className="flex justify-between items-end relative z-10">
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest opacity-60 mb-1">Account Number</p>
                                    <p className="text-sm font-medium tracking-widest text-white/90">8574 7474 7845 4545</p>
                                </div>
                                <button className="bg-white text-brand-navy px-6 py-2 rounded-2xl font-bold text-md hover:bg-opacity-90 transition-all shadow-lg">
                                    Withdraw
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="transation-history px-2">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-brand-navy">Transaction History</h2>
                            <button className="text-brand-teal font-bold hover:underline">See All &gt;</button>
                        </div>
                        <div className="flex flex-col">
                            {transactionHistory.map((item, index) => (
                                <TransactionItem key={index} data={item} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* RIGHT COLUMN: Short Overview + Recently Added (Span 8 of 12) */}
                <div className="lg:col-span-8 flex flex-col gap-6">

                    {/* TOP RIGHT: Short Overview */}
                    <section className="bg-white border-2 border-brand-soft rounded-[2.5rem] p-6">
                        <div className='flex justify-between items-center mb-6 px-2'>
                            <h2 className="text-xl font-bold text-brand-navy">Short Overview</h2>
                            <div className='bg-brand-blue rounded-lg py-2 px-4 flex gap-2 items-center text-brand-navy font-semibold text-sm'>
                                <p>1 Last Month</p>
                                <Filter size={18} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {shortOverViewStats.map((stat, index) => (
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

                    {/* BOTTOM RIGHT: Recently Added Products */}
                    <section className="bg-white border-2 border-brand-soft rounded-[2.5rem] p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-brand-navy">Recently Added Products</h2>
                            <button className="flex items-center gap-2 bg-brand-navy text-white px-5 py-2 rounded-xl text-sm font-semibold">
                                <Plus size={18} /> Add Product
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {recentAddedProducts.map((product, index) => (
                                <ProductViewCard key={index} product={product} />
                            ))}
                        </div>
                        <div className="mt-6 flex justify-end">
                            <a href="/products" className="flex items-center gap-1 text-brand-navy font-bold text-lg hover:underline">
                                View All Products <ChevronsRight size={20} />
                            </a>
                        </div>
                    </section>
                </div>

                {/* BOTTOM FULL WIDTH: Quick Overview */}
                <section className="lg:col-span-12 bg-white border-2 border-brand-soft rounded-[3rem] p-8">
                    <h2 className="text-xl font-bold text-brand-navy mb-6">Quick Overview For You</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {overViewStats.map((stat, index) => (
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
            </div>
        </div>
    )
}

export default Dashboard