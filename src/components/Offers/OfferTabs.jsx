import { useLocation, useNavigate } from "react-router-dom";
import { CreditCard, Wallet, Blocks } from "lucide-react";

const tabs = [
  {
    id: "Main Banner",
    label: "Main Banner",
    path: "/offers/mainbanner",
  },
  {
    id: "Category Banner",
    label: "Category Banner",
    path: "/offers",
  },
  {
    id: "Top Selling",
    label: "Top Selling",
    path: "/offers",
  },
  {
    id: "Product",
    label: "Product",
    path: "/offers",
  },
];

export default function OrderPaymentTabs() {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <section className="flex flex-col sm:flex-row bg-[#1E264F] p-2 my-6 rounded-xl gap-2  md:w-fit w-full shadow-lg">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
          
        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className={`px-6 py-3 rounded-lg flex items-center gap-3 font-semibold transition-all duration-300 first:ml-0
              ${
                isActive
                  ? "bg-[#00E5B0] text-white shadow-sm"
                  : "bg-white text-[#1E264F] hover:bg-opacity-90"
              }`}
          >
            <span className={isActive ? "text-white" : "text-[#1E264F]"}>
              {tab.icon}
            </span>
            {tab.label}
          </button>
        );
      })}
    </section>
  );
}
