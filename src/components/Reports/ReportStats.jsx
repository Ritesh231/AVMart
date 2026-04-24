import { useState } from "react";
import { IoCartOutline, IoCashOutline, IoCheckmarkDoneOutline, IoTrendingUpOutline } from "react-icons/io5";
import StatCard from "../StatCard";
import { useGetTotalProfitQuery, useGetTotalSalesQuery, useGetTotalRevenueQuery, useGetAllReportsQuery } from "../../Redux/apis/reportApi";
import StatCardSkeleton from "../statcardskeleton";

export default function ReportStats() {
    const { data: profitData, isLoading: loadingProfit } = useGetTotalProfitQuery({}, { refetchOnMountOrArgChange: true });
    const { data: salesData, isLoading: loadingSales } = useGetTotalSalesQuery({}, { refetchOnMountOrArgChange: true });
    const { data: recordsData, isLoading: loadingRecords } = useGetAllReportsQuery({ status: "product" }, { refetchOnMountOrArgChange: true });

    const totalProfit = profitData?.totalProfit || 0;
    const totalSales = salesData?.totalSales || 0;
    const totalOrders = salesData?.totalOrders || profitData?.totalOrders || 0;
    const totalRecords = recordsData?.total || 0;

    const isLoading = loadingProfit || loadingSales || loadingRecords;

    const stats = [
        {
            title: "Total Profit",
            number: `₹${Number(totalProfit).toFixed(2)}`,
            icon: <IoCashOutline size={24} />,
            variant: "special",
        },
        {
            title: "Total Sales",
            number: `₹${Number(totalSales).toFixed(2)}`,
            icon: <IoTrendingUpOutline size={24} />,
            variant: "normal",
        },
        {
            title: "Total Orders",
            number: totalOrders,
            icon: <IoCartOutline size={24} />,
            variant: "normal",
        },
        {
            title: "Product Reports",
            number: totalRecords,
            icon: <IoCheckmarkDoneOutline size={24} />,
            variant: "normal",
        },
    ];

    return (
        <section className="stat-card-sec mb-6 ">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

                {isLoading
                    ? Array.from({ length: 4 }).map((_, index) => (
                        <StatCardSkeleton key={index} />
                    ))
                    : stats.map((item, index) => (
                        <StatCard
                            key={index}
                            title={item.title}
                            number={item.number}
                            icon={item.icon}
                            variant={item.variant}
                        />
                    ))}

            </div>
        </section>
    );
}