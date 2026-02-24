import { FaUsers, FaCheckCircle, FaTimesCircle,FaClock } from "react-icons/fa";
import { IoCartOutline} from "react-icons/io5";
import { IoMdPerson } from "react-icons/io";
import { MdDeliveryDining } from "react-icons/md";
import { FaSackDollar } from "react-icons/fa6";
import StatCard from "../StatCard";
import { useGetAllDeliveryBoysQuery } from "../../Redux/apis/deliveryApi";

export default function UserStats() {

 const { data, isLoading, isError } = useGetAllDeliveryBoysQuery("pending");
 const counts = data?.cards || {};

const stats = [
  {
    title: "New Requests",
    number: counts?.newRequests||0,
    statement: "+12% from last Month",
    icon: <FaClock  size={24}/>,
    variant: "special",
  },
  {
    title: "Delivery Boys",
    number: counts?.deliveryBoys,
    statement: "+12% from last week",
    icon: <IoMdPerson size={24}/>,
    variant: "normal",
  },
  {
    title: "Total Deliveries",
    number: counts?.totalDeliveries,
    statement: "+12% from last week",
    icon:  <MdDeliveryDining size={24}/>,
    variant: "normal",
  },
  {
    title: "Total Payout",
    number: counts?.totalPayout,
    statement: "+12% from last week",
    icon:<FaSackDollar size={24}/>,
    variant: "normal",
  },
];

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
