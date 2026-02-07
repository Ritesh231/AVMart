import { useLocation, useNavigate } from "react-router-dom";
import { CreditCard, Wallet, Blocks } from "lucide-react";

const tabs = [
  {
    id: "pending",
    label: "Pending",
    path: "/orders/pending",
  },
  {
    id: "confirmed",
    label: "Confirmed",
    path: "/orders/confirmed",
  },
  {
    id: "out-for-delivery",
    label: "Out For Delivery",
    path: "/orders/out-for-delivery",
  },
  {
    id: "delivered",
    label: "Delivered",
    path: "/orders/delivered",
  },
  {
    id: "rejected",
    label: "Rejected",
    path: "/orders/rejected",
  },
];

export default function OrderPaymentTabs() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <section className="flex items-center bg-[#1E264F] p-2 my-6 rounded-xl w-fit shadow-lg">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;

        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className={`px-6 py-3 rounded-lg flex items-center gap-3 font-semibold transition-all duration-300 ml-2 first:ml-0
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
