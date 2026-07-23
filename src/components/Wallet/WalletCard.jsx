import { RiWallet3Fill } from "react-icons/ri";
import { useGetWalletQuery } from "../../Redux/apis/walletApi";
import StatCard from "../StatCard";
import StatCardSkeleton from "../statcardskeleton";

export default function UserStats({
  dateFilter = "today",
  startDate,
  endDate,
}) {
  const { data, isLoading, isError } = useGetWalletQuery({
    dateFilter,
    startDate,
    endDate,
  });

  const wallet = data?.data?.stats || {};

  const stats = [
    {
      title: "Total Wallet Balance",
      number: wallet?.totalWalletBalance,
      statement: "All Users Combined",
      icon: <RiWallet3Fill size={24} />,
      variant: "special",
    },
    {
      title: "Cashback Issued",
      number: wallet?.cashbackIssued?.total,
      icon: <RiWallet3Fill size={24} />,
      variant: "normal",
    },
    {
      title: "Cashback Expired",
      number: wallet?.cashbackExpired,
      statement: "Last 30 days",
      icon: <RiWallet3Fill size={24} />,
      variant: "normal",
    },
    {
      title: "Active Users",
      number: wallet?.activeUsers,
      statement: "With Wallet Balance",
      icon: <RiWallet3Fill size={24} />,
      variant: "normal",
    },
  ];

  return (
    <section className="stat-card-sec mb-6 bg-white border-2 border-[#0F172A]/20 rounded-[2.5rem] p-6">
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
                statement={item.statement}
                icon={item.icon}
                variant={item.variant}
              />
            ))}
      </div>
    </section>
  );
}