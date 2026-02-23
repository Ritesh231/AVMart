import { RiWallet3Fill } from "react-icons/ri";
import {useGetWalletQuery} from "../../Redux/apis/walletApi";
import StatCard from "../StatCard";

export default function UserStats() {
  const {data,isLoading,isError}=useGetWalletQuery();
  const wallet=data?.data?.stats||[];
  
  const stats = [
  {
    title: "Total Wallet Balance",
    number: wallet?.totalWalletBalance,
    statement: "All Users Combined",
    icon: <RiWallet3Fill  size={24}/>,
    variant: "special",
  },
  {
    title: "Cashback Issued",
    number: wallet?.cashbackIssued?.total,
    statement: "+12% from last week",
    icon: <RiWallet3Fill size={24}/>,
    variant: "normal",
  },
  {
    title: "Cashback Expired",
    number: wallet?.cashbackExpired,
    statement: "Last 30 days",
    icon:  <RiWallet3Fill size={24}/>,
    variant: "normal",
  },
  {
    title: "Active Users",
    number: wallet?.activeUsers,
    statement: "With Wallet Balance",
    icon:<RiWallet3Fill size={24}/>,
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
