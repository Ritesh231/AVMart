import { MdMessage } from "react-icons/md";
import StatCard from "../StatCard";

const stats = [
  {
    title: "Total Queries",
    number: "20",
    statement: "+12% from last Month",
    icon: <MdMessage  size={24}/>,
    variant: "special",
  },
  {
    title: "Contacted",
    number: "25",
    statement: "+12% from last week",
    icon: <MdMessage size={24}/>,
    variant: "normal",
  },
  {
    title: "Pending",
    number: "100",
    statement: "+12% from last week",
    icon:  <MdMessage size={24}/>,
    variant: "normal",
  },
];

export default function UserStats() {
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
