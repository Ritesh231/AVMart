import Deliverystats from "../components/Delivery Boys/DeliveryCards";
import OrdersTable from "../components/Delivery Boys/NewRequest";
import DeliveryTabs from "../components/Delivery Boys/DeliveryTabs";
import { Outlet } from "react-router-dom";

export default function OrderManagement() {
  return (
    <div className="p-4 sm:p-6 bg-[#F8FAFC] min-h-screen ">
      <h1 className="text-xl font-semibold mb-2">Delivery Boys</h1>
      <h3 className="text-[#9F9F9F] mb-6">Manage Delivery Boys & orders</h3>
      <Deliverystats/>
      <DeliveryTabs/>
      <Outlet/>
    </div>
  );
}
