import ProductCategoryCards from "../components/Products/ProductCategorytabs";
import ProductCategories from "../components/Products/Brands";
import { Outlet } from "react-router-dom";
import ProductTabs from "../components/Products/ProductTabs"
import Header from "../components/Header";

export default function OrderManagement() {
  return (
    <div className="p-4 sm:p-6 bg-[#F8FAFC] min-h-screen ">
      <h1 className="text-xl font-semibold mb-2">Product Management</h1>
      <h3 className="text-[#9F9F9F] mb-6">Manage products, categories and inventory</h3>
      < ProductCategoryCards />
      <ProductTabs/>
      <Outlet/>
    </div>
  );
}
