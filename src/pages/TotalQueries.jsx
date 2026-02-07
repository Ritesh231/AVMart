import QueriesCards from "../components/Queries/QueriesCards";
import TotalQueries from "../components/Queries/TotalQueries";
import QueriesTabs from "../components/Queries/QueriesTabs"
import { Outlet } from "react-router-dom";

export default function OrderManagement() {
  return (
    <div className="p-4 sm:p-6 bg-[#F8FAFC] min-h-screen w-full">
      <h1 className="text-xl font-semibold mb-6">Total Queries</h1>
      <QueriesCards/>
      <QueriesTabs/>
      <Outlet/>
    </div>
  );
}
