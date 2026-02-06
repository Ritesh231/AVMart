import Orderstats from "../Components/Orderstats";
import OrdersTable from "../Components/OrderRejected";

export default function OrderManagement() {
  return (
    <div className="p-4 sm:p-6 bg-[#F8FAFC] min-h-screen w-screen">
      <h1 className="text-xl font-semibold mb-6">Order Management</h1>

      <Orderstats/>
      <OrdersTable />
    </div>
  );
}
