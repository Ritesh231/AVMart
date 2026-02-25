import React from "react";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import StatCard from "../StatCard";

export default function RevenueStats({
  totalEarned = 625,
  totalWithdrawn = 350,
  balance = 275,
}) {
  const stats = [
    {
      title: "Total Earned",
      number: `₹${totalEarned}`,
      statement: "Overall earnings",
      icon: <TrendingUp size={24} />,
    },
    {
      title: "Total Withdrawn",
      number: `₹${totalWithdrawn}`,
      statement: "Amount withdrawn",
      icon: <TrendingDown size={24} />,
    },
    {
      title: "Balance",
      number: `₹${balance}`,
      statement: "Available balance",
      icon: <Wallet size={24} />,
    },
  ];

  return (
    <section className="mb-6 bg-white border-2 border-[#62CDB999] rounded-[2.5rem] p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((item, index) => (
          <StatCard
            key={index}
            title={item.title}
            number={item.number}
            statement={item.statement}
            icon={item.icon}
          />
        ))}
      </div>
    </section>
  );
}