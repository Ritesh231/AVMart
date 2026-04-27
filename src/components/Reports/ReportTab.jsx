import { useLocation, useNavigate } from "react-router-dom";
import { CreditCard, Wallet, Blocks } from "lucide-react";

const tabs = [
    {
        id: "TotalReports",
        label: "Total Reports",
        path: "/reports/TotalReports",
    },
    {
        id: "TotalProfit",
        label: "Total Profit",
        path: "/reports/TotalProfit",
    },
    {
        id: "Revenue Report",
        label: "Revenue Report",
        path: "/reports/RevenueReport",
    },
    {
        id: "TotalSales",
        label: "Total Sales",
        path: "/reports/TotalSales",
    },
    {
        id: "InOutReports",
        label: "Inrate Outrate",
        path: "/reports/InOutReports",
    },
    {
        id: "AllReports",
        label: "All Reports",
        path: "/reports/AllReports",
    }


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
                        className={`px-6 py-3 rounded-lg flex items-center justify-center gap-3 font-semibold transition-all duration-300  first:ml-0
              ${isActive
                                ? "bg-gradient-to-r from-[#FD610D] to-[#FF8800]  text-white shadow-sm"
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
