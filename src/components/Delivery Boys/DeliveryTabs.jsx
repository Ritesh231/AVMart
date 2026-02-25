import { useLocation, useNavigate } from "react-router-dom";
import { FaRegClock } from "react-icons/fa";
import { SiTicktick } from "react-icons/si";
import { RxCrossCircled } from "react-icons/rx";

const tabs = [
  {
    id: "New Requests",
    label: "New Requests",
    icon: <FaRegClock size={20} />,
    path: "/delivery/requests",  
  },
  {
    id: "Approved",
    label: "Approved",
    icon: <SiTicktick size={20} />,
    path: "/delivery/approved",
  },
  {
    id: "Rejected",
    label: "Rejected",
    icon: <RxCrossCircled size={20} />,
    path: "/delivery/rejected",
  },
];

export default function OrderPaymentTabs() {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <section className="flex flex-col sm:flex-row bg-[#1E264F] p-2 my-6 rounded-xl gap-2 md:w-fit w-full shadow-lg">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;

        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className={`px-6 py-3 rounded-lg flex items-center gap-3 font-semibold transition-all
              ${
                isActive
                  ? "bg-[#00E5B0] text-white"
                  : "bg-white text-[#1E264F]"
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </section>
  );
}