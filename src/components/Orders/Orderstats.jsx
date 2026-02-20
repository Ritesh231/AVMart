import { IoCartOutline } from "react-icons/io5";
import StatCard from "../StatCard";
import { useGetallordersQuery } from "../../Redux/apis/ordersApi";

export default function UserStats() {

  const { data, isLoading, isError } = useGetallordersQuery();

  const count = data?.topStats || {};

  const stats = [
    {
      title: "Total Orders",
      number: count.totalOrders || 0,
      statement: "+12% from last Month",
      icon: <IoCartOutline size={24} />,
      variant: "special",
    },
    {
      title: "Completed",
      number: count.completed || 0,
      statement: "+12% from last week",
      icon: <IoCartOutline size={24} />,
      variant: "normal",
    },
    {
      title: "Approved",
      number: count.approved || 0,
      statement: "+12% from last week",
      icon: <IoCartOutline size={24} />,
      variant: "normal",
    },
    {
      title: "Rejected",
      number: count.rejected || 0,
      statement: "+12% from last week",
      icon: <IoCartOutline size={24} />,
      variant: "normal",
    },
  ];

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading stats</p>;

  return (
       <section className="stat-card-sec mb-6 bg-white border-2 border-[#62CDB999] rounded-[2.5rem] p-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
