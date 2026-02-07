import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "../Layout/Layout";

const Dashboard = lazy(() => import("../pages/Dashboard"));
const Users = lazy(() => import("../pages/UserManagment"));
const Orders = lazy(() => import("../pages/OrderManagement"));
const Products = lazy(() => import("../pages/ProductManagement"));
const Payments = lazy(() => import("../pages/Payments"));
const Invoices = lazy(() => import("../pages/Invoices"));
const Delivery = lazy(() => import("../pages/DeliveryBoy"));
const Queries = lazy(() => import("../pages/TotalQueries"));

/* Order Status */
const OrderPending = lazy(() => import("../components/Orders/OrderPending"));
const OrderConfirmed = lazy(() => import("../components/Orders/OrderConfirmed"));
const OrderOutForDelivery = lazy(() =>
  import("../components/Orders/Orderoutfordelivery")
);
const OrderDelivered = lazy(() => import("../components/Orders/OrderDelivered"));
const OrderRejected = lazy(() => import("../components/Orders/OrderRejected"));

/* Product */
const AllProducts = lazy(() => import("../components/Products/AllProducts"));
const ProductCategories = lazy(() =>
  import("../components/Products/ProductCategories")
);
const Subcategories = lazy(() =>
  import("../components/Products/Subcategories")
);
const Brands = lazy(() => import("../components/Products/Brands"));

/* Delivery */
const DeliveryRequests = lazy(() =>
  import("../components/Delivery Boys/NewRequest")
);


/*Queries */
const Query = lazy(() => import("../components/Queries/TotalQueries"));

const Loader = () => (
  <div className="flex items-center justify-center h-screen">
    <span className="text-gray-500 text-sm">Loading...</span>
  </div>
);

export default function AppRouter() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/invoices" element={<Invoices />} />
       
          {/*Queries*/}
          <Route path="/queries" element={<Queries />}> 
           <Route index element={<Navigate to="pending" replace />} />
           <Route path="pending" element={<Query/>} />
          </Route>

          {/* Orders */}
          <Route path="/orders" element={<Orders />}>
            <Route index element={<Navigate to="pending" replace />} />
            <Route path="pending" element={<OrderPending />} />
            <Route path="confirmed" element={<OrderConfirmed />} />
            <Route path="out-for-delivery" element={<OrderOutForDelivery />} />
            <Route path="delivered" element={<OrderDelivered />} />
            <Route path="rejected" element={<OrderRejected />} />
          </Route>

          {/* Products */}
          <Route path="/products" element={<Products />}>
            <Route index element={<Navigate to="categories" replace />} />
            <Route path="all" element={<AllProducts />} />
            <Route path="categories" element={<ProductCategories />} />
            <Route path="subcategories" element={<Subcategories />} />
            <Route path="brands" element={<Brands />} />
          </Route>

          {/* Delivery */}
          <Route path="/delivery" element={<Delivery />}>
            <Route index element={<Navigate to="requests" replace />} />
            <Route path="requests" element={<DeliveryRequests />} />
          </Route>
        </Route>

        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Suspense>
  );
}
