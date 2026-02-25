import React from "react";
import { Truck, CheckCircle, XCircle } from "lucide-react";
import StatCard from "../StatCard";

export default function OrderStats({
  ongoing = 2,
  completed = 3,
  rejected = 1,
}) {
  const stats = [
    {
      title: "Ongoing",
      number: ongoing,
      statement: "Currently in delivery",
      icon: <Truck size={24} />,
    },
    {
      title: "Completed",
      number: completed,
      statement: "Successfully delivered",
      icon: <CheckCircle size={24} />,
    },
    {
      title: "Rejected",
      number: rejected,
      statement: "Cancelled / rejected orders",
      icon: <XCircle size={24} />,
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