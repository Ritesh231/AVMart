import Orderstats from "../Components/Orderstats";
import OrdersTable from "../Components/Queries/TotalQueries";

export default function OrderManagement() {
  return (
    <div className="p-4 sm:p-6 bg-[#F8FAFC] min-h-screen w-full">
      <h1 className="text-xl font-semibold mb-6">Delivery Boys</h1>

      <Orderstats/>
      <OrdersTable />
    </div>
  );
}
