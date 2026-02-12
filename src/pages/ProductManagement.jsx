import ProductCategoryCards from "../components/Products/ProductCategorytabs";
import ProductCategories from "../components/Products/Brands";
import { Outlet } from "react-router-dom";
import ProductTabs from "../components/Products/ProductTabs";
import { Link } from "react-router-dom";

export default function OrderManagement() {
  return (
    <div className="p-4 sm:p-6 bg-[#F8FAFC] min-h-screen">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">

        {/* Left Side Title */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Product Management
          </h1>
          <p className="text-gray-400 text-sm">
            Manage products, categories and inventory
          </p>
        </div>

        {/* Right Side Buttons */}
        <div className="flex flex-wrap gap-3">
          
          <Link to="/AddProduct">
          <button className="bg-[#00E5B0] hover:bg-[#00c79a] text-white px-4 py-2 rounded-lg text-sm font-medium transition">
            + Add Product
          </button>
          </Link>

         <Link to="/AddCategory">
          <button className="bg-[#1E293B] hover:bg-[#0f172a] text-white px-4 py-2 rounded-lg text-sm font-medium transition">
            + Add Category
          </button>
          </Link>

          <Link to="/AddSubcategory">
          <button className="bg-[#1E293B] hover:bg-[#0f172a] text-white px-4 py-2 rounded-lg text-sm font-medium transition">
            + Add Sub Category
          </button>
          </Link>
           
          <Link to="/AddBrand">
          <button className="bg-[#1E293B] hover:bg-[#0f172a] text-white px-4 py-2 rounded-lg text-sm font-medium transition">
            + Add Brand
          </button>
          </Link>
           
        </div>
      </div>

      {/* Rest of Page */}
      <ProductCategoryCards />
      <ProductTabs />
      <Outlet />

    </div>
  );
}
