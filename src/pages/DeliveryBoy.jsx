import Deliverystats from "../components/Delivery Boys/DeliveryCards";
import OrdersTable from "../components/Delivery Boys/NewRequest";
import DeliveryTabs from "../components/Delivery Boys/DeliveryTabs";
import { Outlet } from "react-router-dom";

export default function OrderManagement() {
  return (
    <div className="p-4 sm:p-6 bg-[#F8FAFC] min-h-screen ">
      <h1 className="text-xl font-semibold mb-6">Delivery Boys</h1>
      <Deliverystats/>
      <DeliveryTabs/>
      <Outlet/>
    </div>
  );
}
