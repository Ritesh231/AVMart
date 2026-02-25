import React, { useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import StatCard from "../StatCard";

export default function AttendanceStats({
  present = 5,
  absent = 1,
  halfDay = 2,
}) {
  const [activeCard, setActiveCard] = useState("Present");

  const stats = [
    {
      title: "Present",
      number: present,
      statement: "Employee attendance today",
      icon: <FaCheckCircle size={24} />,
    },
    {
      title: "Absent",
      number: absent,
      statement: "Employees not available",
      icon: <FaTimesCircle size={24} />,
    },
    {
      title: "Half Day",
      number: halfDay,
      statement: "Partial attendance",
      icon: <FaClock size={24} />,
    },
  ];
   
  return (
     <section className="stat-card-sec mb-6 bg-white border-2 border-[#62CDB999] rounded-[2.5rem] p-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {stats.map((item, index) => (
        <StatCard
          key={index}
          title={item.title}
          number={item.number}
          statement={item.statement}
          icon={item.icon}
          variant={item.variant}
        />
      ))}
    </div>
    </section>
  );
}