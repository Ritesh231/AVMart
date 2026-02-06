import Orderstats from "../Components/Orderstats";
import ProductCategories from "../Components/Products/Brands";
import Header from "../Components/Header";

export default function OrderManagement() {
  return (
    <div className="p-4 sm:p-6 bg-[#F8FAFC] min-h-screen w-screen">
      <h1 className="text-xl font-semibold mb-6">Product Management</h1>
      <Header/>
      <Orderstats/>
      <ProductCategories/>
    </div>
  );
}
