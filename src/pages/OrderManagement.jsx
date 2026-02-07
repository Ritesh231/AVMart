import { Outlet } from "react-router-dom";
import Orderstats from "../components/Orders/Orderstats";
import OrderPaymentTabs from "../components/Orders/OrderTabs";

export default function OrderManagement() {
  return (
    <div className="p-4 sm:p-6 bg-[#F8FAFC] min-h-screen ">
      <h1 className="text-xl font-semibold mb-6">Order Management</h1>
      <Orderstats />
      <OrderPaymentTabs />
      <Outlet />
    </div>
  );
}
