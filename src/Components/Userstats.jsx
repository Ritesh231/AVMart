import { FaUsers, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const stats = [
  {
    title: "Total Users",
    value: "200",
    change: "+12% from last Month",
    icon: <FaUsers />,
    bg: "bg-gradient-to-br from-[#1A2550] to-[#62CDB9]",
    text: "text-white",
  },
  {
    title: "Newly Added",
    value: "20",
    change: "+12% from last week",
    icon: <FaUsers />,
    bg: "bg-[#E6F4F1]",
    text: "text-gray-800",
  },
  {
    title: "Approved",
    value: "20",
    change: "+12% from last week",
    icon: <FaCheckCircle />,
    bg: "bg-[#E6F4F1]",
    text: "text-gray-800",
  },
  {
    title: "Rejected",
    value: "20",
    change: "+12% from last week",
    icon: <FaTimesCircle />,
    bg: "bg-[#E6F4F1]",
    text: "text-gray-800",
  },
];

export default function UserStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((s, i) => (
        <div
          key={i}
          className={`p-5 rounded-xl flex justify-between items-center ${s.bg} ${s.text}`}
        >
          <div>
            <p className="text-sm font-medium opacity-80">{s.title}</p>
            <h2 className="text-3xl font-bold">{s.value}</h2>
            <p className="text-xs mt-1 opacity-80">{s.change}</p>
          </div>
          <div className="text-2xl opacity-90">{s.icon}</div>
        </div>
      ))}
    </div>
  );
}
