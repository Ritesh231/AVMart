import React from 'react'
import { PackageCheck, Box, ShoppingCart, Users, CarFront, ChartColumnIncreasing, Filter, Plus, ChevronsRight } from "lucide-react"
import StatCard from '../components/StatCard';
import ProductViewCard from '../components/Products/ProductViewCard';
import TransactionItem from '../components/TransactionItem';
import { useGetDashboardQuery } from "../Redux/apis/dashboardApi"
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { data: Product, isLoading, isError } = useGetDashboardQuery();
    const product = Product?.data || [];

    const Skeleton = ({ className }) => (
        <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />
    );

    const navigate = useNavigate();

    const overViewStats = [
        {
            title: "Delivery Boys",
            number: product?.quickStats?.deliveryBoys || "0",
            statement: "+ 12 % from last Month",
            icon: <Users size={24} />,
            special: true
        },
        {
            title: "Total Products",
            number: product?.quickStats?.totalProducts || "0",
            statement: "+ 12 % from last Month",
            icon: <ShoppingCart size={24} />
        },
        {
            title: "In Stock",
            number: product?.quickStats?.inStock || "0",
            statement: "+ 12 % from last Month",
            icon: <Box size={24} />
        },
        {
            title: "Active Orders",
            number: product?.quickStats?.activeOrders || "0",
            statement: "+ 12 % from last Month",
            icon: <PackageCheck size={24} />
        }
    ];

    const shortOverViewStats = [
        {
            title: "Total Users",
            number: product?.overview?.totalUsers || [],
            statement: `${product?.overview?.usersChange || "+0%"} from last Month`,
            icon: <Users size={24} />,
            special: true
        },
        {
            title: "Total Orders",
            number: product?.overview?.totalOrders,
            statement: `${product?.overview?.ordersChange || "+0%"} from last Month`,
            icon: <ShoppingCart size={24} />,
        },
        {
            title: "Total Sales",
            number: product?.overview?.salesChange,
            statement: "+ 12 % from last Month",
            icon: <ChartColumnIncreasing size={24} />,
        },
    ]

    const transactionHistory =
        product?.transactions?.map((item) => ({
            username: item.name,
            image: "",
            time: new Date(item.timeAgo).toLocaleString(),
            amount: item.amount,
            type: item.type === "credit" ? "credited" : "debited"
        })) || [];

    return (
        <div className="p-6 min-h-screen">
            <h2 className=" text-brand-navy my-6">Dashboard</h2>

            {/* MAIN GRID LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* LEFT COLUMN: Finance & Transaction History (Span 4 of 12) */}
                <section className="lg:col-span-4 flex flex-col gap-6 p-6 border-2 border-[#62CDB969]/40 rounded-[3rem] bg-white h-full">
                    <div className="total-revenue">
                        {isLoading ? (
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl">
                                <Skeleton className="h-6 w-40 mb-6" />
                                <Skeleton className="h-10 w-60 mb-6" />
                                <Skeleton className="h-4 w-40 mb-2" />
                                <Skeleton className="h-4 w-52" />
                            </div>
                        ) : (
                            <div className="relative overflow-hidden bg-brand-navy rounded-[2.5rem] p-8 text-white shadow-xl min-h-[240px] flex flex-col justify-between">
                                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-brand-cyan/70 rounded-full blur-[50px]"></div>
                                <div className="flex justify-between items-start relative z-10">
                                    <h3 className="text-xl font-medium opacity-90">Total Revenue</h3>
                                    <span className="text-xs font-semibold bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                                        ` {product?.revenueChange} from last Month`
                                    </span>
                                </div>
                                <div className="relative z-10">
                                    <h3 className="text-5xl font-bold tracking-tight">₹ {product?.totalRevenue}</h3>
                                </div>
                                <div className="flex justify-between items-end relative z-10">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest opacity-60 mb-1">Account Number</p>
                                        <p className="text-sm font-medium tracking-widest text-white/90">{product?.accountNumber}</p>
                                    </div>
                                    <button className="bg-white text-brand-navy px-6 py-2 rounded-2xl font-bold text-md hover:bg-opacity-90 transition-all shadow-lg">
                                        Withdraw
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="transation-history px-2">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-brand-navy">Transaction History</h2>
                            <button className="text-brand-teal font-bold hover:underline">See All &gt;</button>
                        </div>
                        <div className="flex flex-col">
                            {isLoading
                                ? Array(5)
                                    .fill(0)
                                    .map((_, index) => (
                                        <div key={index} className="flex items-center gap-4 py-3">
                                            <Skeleton className="h-12 w-12 rounded-full" />
                                            <div className="flex-1">
                                                <Skeleton className="h-4 w-32 mb-2" />
                                                <Skeleton className="h-3 w-20" />
                                            </div>
                                            <Skeleton className="h-4 w-16" />
                                        </div>
                                    ))
                                : transactionHistory.map((item, index) => (
                                    <TransactionItem key={index} data={item} />
                                ))}
                        </div>
                    </div>
                </section>

                {/* RIGHT COLUMN: Short Overview + Recently Added (Span 8 of 12) */}
                <div className="lg:col-span-8 flex flex-col gap-6">

                    {/* TOP RIGHT: Short Overview */}
                    <section className="bg-white border-2 border-[#62CDB969]/40 rounded-[2.5rem] p-6">
                        <div className='flex justify-between items-center mb-6 px-2'>
                            <h2 className="text-xl font-bold text-brand-navy">Short Overview</h2>
                            <div className='bg-brand-blue rounded-lg py-2 px-4 flex gap-2 items-center text-brand-navy font-semibold text-sm'>
                                <p>1 Last Month</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {isLoading
                                ? Array(3)
                                    .fill(0)
                                    .map((_, index) => (
                                        <div key={index} className="p-6 bg-white rounded-2xl border">
                                            <Skeleton className="h-4 w-32 mb-4" />
                                            <Skeleton className="h-8 w-20 mb-4" />
                                            <Skeleton className="h-4 w-40" />
                                        </div>
                                    ))
                                : shortOverViewStats.map((stat, index) => (
                                    <StatCard
                                        key={index}
                                        title={stat.title}
                                        number={stat.number}
                                        statement={stat.statement}
                                        icon={stat.icon}
                                        variant={stat.special ? "special" : "normal"}
                                    />
                                ))}
                        </div>
                    </section>

                    {/* BOTTOM RIGHT: Recently Added Products */}
                    <section className="bg-white border-2 border-[#62CDB969] rounded-[2.5rem] p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-brand-navy">Recently Added Products</h2>
                            <button className="flex items-center gap-2 bg-brand-navy text-white px-5 py-2 rounded-xl text-sm font-semibold" onClick={() => navigate("/AddProduct")}>
                                <Plus size={18} /> Add Product
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {product?.recentProducts?.map((product, index) => (
                                <ProductViewCard key={index} product={product} />
                            ))}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <Link to="/products/all" className="flex items-center gap-1 text-brand-navy font-bold text-lg hover:underline">
                                View All Products <ChevronsRight size={20} />
                            </Link>
                        </div>
                    </section>
                </div>

                {/* BOTTOM FULL WIDTH: Quick Overview */}
                <section className="lg:col-span-12 bg-white border-2 border-[#62CDB969] rounded-[3rem] p-8">
                    <h2 className="text-xl font-bold text-brand-navy mb-6">Quick Overview For You</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {isLoading
                            ? Array(4)
                                .fill(0)
                                .map((_, index) => (
                                    <div
                                        key={index}
                                        className="p-6 bg-white rounded-2xl border border-gray-200"
                                    >
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="animate-pulse bg-gray-200 h-5 w-28 rounded"></div>
                                            <div className="animate-pulse bg-gray-200 h-8 w-8 rounded-full"></div>
                                        </div>

                                        <div className="animate-pulse bg-gray-200 h-8 w-20 rounded mb-3"></div>
                                        <div className="animate-pulse bg-gray-200 h-4 w-36 rounded"></div>
                                    </div>
                                ))
                            : overViewStats.map((stat, index) => (
                                <StatCard
                                    key={index}
                                    title={stat.title}
                                    number={stat.number}
                                    statement={stat.statement}
                                    icon={stat.icon}
                                    variant={stat.special ? "special" : "normal"}
                                />
                            ))}
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Dashboard