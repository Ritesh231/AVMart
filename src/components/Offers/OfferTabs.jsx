import { useLocation, useNavigate } from "react-router-dom";
import { CreditCard, Wallet, Blocks } from "lucide-react";

export default function OrderPaymentTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "main", label: "Main Banner" },
    { id: "category", label: "Category Banner" },
    { id: "mostselling", label: "Top Selling" },
    { id: "subcategory", label: "Product" },
  ];
  
  return (
    <section className="flex flex-col sm:flex-row bg-[#1E264F] p-2 my-6 rounded-xl gap-2 md:w-fit w-full shadow-lg">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300
              ${
                isActive
                  ? "bg-[#00E5B0] text-white shadow-sm"
                  : "bg-white text-[#1E264F]"
              }`}
          >
            {tab.label}
          </button>
        );
      })}
    </section>
  );
}
