import { FaUsers, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import StatCard from "../components/StatCard";
import { useGetallusersQuery } from "../Redux/apis/userApi";
import StatCardSkeleton from "./statcardskeleton";

export default function UserStats() {
  const { data, isLoading, isError } = useGetallusersQuery();
  const users = data?.stats || [];

  const stats = [
    {
      title: "Total Users",
      number: users?.totalUsers,
      // period: users?.period,
      icon: <FaUsers size={24} />,
      variant: "special",
    },
    {
      title: "Newly Added",
      number: users?.newlyAdded?.count,
      period: users?.newlyAdded?.period,
      icon: <FaUsers size={24} />,
      variant: "normal",
    },
    {
      title: "Approved",
      number: users?.approved?.count,
      period: users?.approved?.period,
      icon: <FaCheckCircle size={24} />,
      variant: "normal",
    },
    {
      title: "Rejected",
      number: users?.rejected?.count,
      period: users?.rejected?.period,
      icon: <FaTimesCircle size={24} />,
      variant: "normal",
    },
  ];

  return (
    <section className="stat-card-sec mb-6  ">
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
              statement={item.period}
              icon={item.icon}
              variant={item.variant}
            />
          ))}
      </div>
    </section>
  );
}
