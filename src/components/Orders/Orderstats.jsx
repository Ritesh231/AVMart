import { IoCartOutline } from "react-icons/io5";
import StatCard from "../StatCard";
import { useGetOrdersByStatusQuery } from "../../Redux/apis/ordersApi";
import StatCardSkeleton from "../statcardskeleton";


export default function UserStats() {
  const { data, isLoading, isError } = useGetOrdersByStatusQuery("Pending");
  const count = data?.topStats || {};

  const stats = [
    {
      title: "Total Orders",
      number: count.totalOrders || 0,
      icon: <IoCartOutline size={24} />,
      variant: "special",
    },
    {
      title: "Completed",
      number: count.completed || 0,
      icon: <IoCartOutline size={24} />,
      variant: "normal",
    },
    {
      title: "Approved",
      number: count.approved || 0,
      icon: <IoCartOutline size={24} />,
      variant: "normal",
    },
    {
      title: "Rejected",
      number: count.rejected || 0,
      icon: <IoCartOutline size={24} />,
      variant: "normal",
    },
  ];

  if (isError) return <p>Error loading stats</p>;

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