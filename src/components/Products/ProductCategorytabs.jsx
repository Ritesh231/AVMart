
import { IoBag } from "react-icons/io5";
import { MdCategory } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import StatCard from "../StatCard"; 
import { useGetallproductsQuery } from "../../Redux/apis/productsApi"

export default function UserStats() {

  const {data,isLoading,isError}= useGetallproductsQuery();
  const counts=data?.dashboardStats||[];
   
  const stats = [
  {
    title: "Total Products",
    number: counts?.totalProducts||0,
    statement: "+12% from last Month",
    icon: <IoBag size={24}/>,
    variant: "special",
  },
  {
    title: "Categories",
    number: counts?.totalCategories||0,
    statement: "+12% from last week",
    icon: <MdCategory size={24}/>,
    variant: "normal",
  },
  {
    title: "Sub Categories",
    number: counts?.totalSubCategories||0,
    statement: "+12% from last week",
    icon: <MdCategory size={24}/>,
    variant: "normal",
  },
  {
    title: "Brands",
    number: counts?.totalBrands||0,
    statement: "+12% from last week",
    icon: <FaStar size={24}/>,
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
