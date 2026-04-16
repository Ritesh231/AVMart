import { FaUsers, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { IoMdPerson } from "react-icons/io";
import { MdDeliveryDining } from "react-icons/md";
import { FaSackDollar } from "react-icons/fa6";
import StatCard from "../StatCard";
import { useGetAllDeliveryBoysQuery } from "../../Redux/apis/deliveryApi";
import StatCardSkeleton from "../statcardskeleton";
import { useState } from "react";

export default function UserStats() {

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  let status = "pending";

  const { data, isLoading, isError, refetch } = useGetAllDeliveryBoysQuery({
    status,
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm || undefined
  });

  const counts = data?.cards || {};

  const stats = [
    {
      title: "New Requests",
      number: counts?.newRequests || 0,
      icon: <FaClock size={24} />,
      variant: "special",
    },
    {
      title: "Delivery Boys",
      number: counts?.deliveryBoys || 0,
      icon: <IoMdPerson size={24} />,
      variant: "normal",
    },
    {
      title: "Total Deliveries",
      number: counts?.totalDeliveries || 0,
      icon: <MdDeliveryDining size={24} />,
      variant: "normal",
    },
    {
      title: "Total Payout",
      number: counts?.totalPayout || 0,
      icon: <FaSackDollar size={24} />,
      variant: "normal",
    },
  ];

  if (isError) {
    return (
      <section className="stat-card-sec mb-6 bg-white border-2 border-red-200 rounded-[2.5rem] p-6">
        <div className="text-center text-red-500">
          Failed to load delivery stats. Please try again.
        </div>
      </section>
    );
  }

  return (
    <section className="stat-card-sec mb-6 bg-white border-2 border-[#62CDB999] rounded-[2.5rem] p-6">
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