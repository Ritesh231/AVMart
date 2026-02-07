import { useLocation, useNavigate } from "react-router-dom";
import { FaRegClock } from "react-icons/fa";
import { SiTicktick } from "react-icons/si";
import { RxCrossCircled } from "react-icons/rx";

const tabs = [
  {
    id: "New Requests",
    label: "New Requests",
    icon: <FaRegClock size={20} />,
    path: "/Delivery/requests",
  },
  {
    id: "Approved",
    label: "Sub Categories",
    icon: <SiTicktick size={20} />,
    path: "/DeliveryRequests",
  },
   {
    id: "Rejected",
    label: "Sub Categories",
    icon: <RxCrossCircled size={20} />,
    path: "/DeliveryRequests",
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
