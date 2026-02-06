import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

const UsersManagement = lazy(() => import("../src/Pages/UserManagment"));
const OrderManagment = lazy(() => import("../src/Pages/OrderManagement"));
const ProductManagment = lazy(() => import("../src/Pages/ProductManagement"));
const DeliveryManagement = lazy(() => import("../src/Pages/RequestManagement"));
const Queries = lazy(() => import("../src/Pages/TotalQueries"));
const Layout = lazy(() => import("../src/Layout/Layout"));

const Loader = () => (
  <div className="flex items-center justify-center h-screen">
    <span className="text-gray-500 text-sm">Loading...</span>
  </div>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
  
        {/* Layout Route */}
        <Route element={<Layout />}>
          <Route path="/users" element={<UsersManagement />} />
          <Route path="/orders" element={<OrderManagment />} />
          <Route path="/products" element={<ProductManagment />} />
          <Route path="/delivery" element={<DeliveryManagement />} />
          <Route path="/queries" element={<Queries />} />
        </Route>

      </Routes>
    </Suspense>
  );
}
