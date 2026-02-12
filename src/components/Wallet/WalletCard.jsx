import { FaUsers, FaCheckCircle, FaTimesCircle,FaClock } from "react-icons/fa";
import { IoCartOutline} from "react-icons/io5";
import { IoMdPerson } from "react-icons/io";
import { MdDeliveryDining } from "react-icons/md";
import { FaSackDollar } from "react-icons/fa6";
import { RiWallet3Fill } from "react-icons/ri";
import StatCard from "../StatCard";

const stats = [
  {
    title: "Total Wallet Balance",
    number: "₹ 47,280",
    statement: "All Users Combined",
    icon: <RiWallet3Fill  size={24}/>,
    variant: "special",
  },
  {
    title: "Cashback Issued",
    number: "₹ 7,280",
    statement: "+12% from last week",
    icon: <RiWallet3Fill size={24}/>,
    variant: "normal",
  },
  {
    title: "Cashback Expired",
    number: "₹ 17,280",
    statement: "Last 30 days",
    icon:  <RiWallet3Fill size={24}/>,
    variant: "normal",
  },
  {
    title: "Active Users",
    number: "522",
    statement: "With Wallet Balance",
    icon:<RiWallet3Fill size={24}/>,
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
