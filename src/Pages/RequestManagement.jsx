import Orderstats from "../Components/Orderstats";
import OrdersTable from "../Components/Delivery Boys/NewRequest";

export default function OrderManagement() {
  return (
    <div className="p-4 sm:p-6 bg-[#F8FAFC] min-h-screen w-screen">
      <h1 className="text-xl font-semibold mb-6">Delivery Boys</h1>

      <Orderstats/>
      <OrdersTable />
    </div>
  );
}
