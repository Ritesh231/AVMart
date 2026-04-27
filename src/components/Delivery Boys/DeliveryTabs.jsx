import { useLocation, useNavigate } from "react-router-dom";
import { FaRegClock } from "react-icons/fa";
import { SiTicktick } from "react-icons/si";
import { RxCrossCircled } from "react-icons/rx";
import { BsCashCoin } from "react-icons/bs";

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
  {
    id: "Payment Requests",
    label: "All Payment Request",
    icon: <BsCashCoin size={20} />,
    path: "/delivery/Paymentrequest",
  },
  {
    id: "Update Delivery Charges",
    label: "Update Delivery Charges",
    icon: <BsCashCoin size={20} />,
    path: "/delivery/UpdateDeliveryCharges",
  }

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
              ${isActive
                ? "bg-gradient-to-r from-[#FD610D] to-[#FF8800] text-white"
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