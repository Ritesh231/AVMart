import { MdMessage } from "react-icons/md";
import StatCard from "../StatCard";
import { useGetallqueriesQuery } from "../../Redux/apis/queryApi";

export default function UserStats() {
  const { data, isLoading, isError } = useGetallqueriesQuery();

  const queries = data?.data || [];

  // 🔥 Calculate counts
  const totalQueries = queries.length;
  const contactedCount = queries.filter(
    (q) => q.status === "Contacted"
  ).length;

  const pendingCount = queries.filter(
    (q) => q.status === "Pending"
  ).length;

  // 🎯 Dynamic Stats Array
  const stats = [
    // {
    //   title: "Total Queries",
    //   number: totalQueries,
    //   statement: "All user queries",
    //   icon: <MdMessage size={24} />,
    //   variant: "special",
    // },
    {
      title: "Contacted",
      number: contactedCount,
      statement: "Resolved / contacted users",
      icon: <MdMessage size={24} />,
      variant: "normal",
    },
    {
      title: "Pending",
      number: pendingCount,
      statement: "Waiting for response",
      icon: <MdMessage size={24} />,
      variant: "normal",
    },
  ];

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading data</p>;

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
