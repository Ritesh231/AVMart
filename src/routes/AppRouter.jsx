import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "../Layout/Layout";

const Login = lazy(() => import("../pages/Login"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Users = lazy(() => import("../pages/UserManagment"));
const Orders = lazy(() => import("../pages/OrderManagement"));
const Products = lazy(() => import("../pages/ProductManagement"));
const Payments = lazy(() => import("../pages/Payments"));
const Invoices = lazy(() => import("../pages/Invoices"));
const Delivery = lazy(() => import("../pages/DeliveryBoy"));
const Queries = lazy(() => import("../pages/TotalQueries"));
const Wallet = lazy(() => import("../pages/Wallet"));

/* Order Status */
const OrderPending = lazy(() => import("../components/Orders/OrderPending"));
const OrderConfirmed = lazy(() => import("../components/Orders/OrderConfirmed"));
const OrderOutForDelivery = lazy(() =>
  import("../components/Orders/Orderoutfordelivery")
);
const OrderDelivered = lazy(() => import("../components/Orders/OrderDelivered"));
const OrderRejected = lazy(() => import("../components/Orders/OrderRejected"));
const OrderDetails = lazy(() => import("../components/Orders/OrderDetails"));


/* Product */
const AllProducts = lazy(() => import("../components/Products/AllProducts"));
const ProductCategories = lazy(() =>
  import("../components/Products/ProductCategories")
);
const Subcategories = lazy(() =>
  import("../components/Products/Subcategories")
);

const Brands = lazy(() => import("../components/Products/Brands"));
const AddProduct = lazy(() => import("../components/Products/AddProduct"));
const AddCategory = lazy(() => import("../components/Products/AddCategory"));
const AddSubcategory = lazy(() => import("../components/Products/AddSubcategory"));
const AddBrand= lazy(() => import("../components/Products/AddBrand"));

/* Delivery */
const DeliveryRequests = lazy(() =>
  import("../components/Delivery Boys/NewRequest")
);

const DeliveryBoyDetail = lazy(() =>
  import("../components/Delivery Boys/DeliveryBoyDetailedPage")
);

/*Queries */
const PendingQueries = lazy(() => import("../components/Queries/PendingQueries"));


/*Offers*/
const Offers = lazy(() => import("../pages/Offers"));
const MainBanner = lazy(() => import("../components/Offers/MainBanner"));
const AddBanner=lazy(()=>import("../components/Offers/AddBanner"));

/*Wallet*/
const WalletTable = lazy(() => import("../components/Wallet/TotalBalanceTable"));


const Loader = () => (
  <div className="flex items-center justify-center h-screen bg-gradient-to-br from-brand-navy via-white to-black">
    
    <div className="flex flex-col items-center gap-6">
      
      {/* Logo */}
      <img
        src="/images/logo.svg"
        alt="Logo"
        className="w-48 h-48 animate-pulse"
      />
      
      {/* Animated Spinner Ring */}
      <div className="relative">
        <div className="w-14 h-14 border-4 border-white/20 rounded-full"></div>
        <div className="absolute top-0 left-0 w-14 h-14 border-4 border-brand-teal border-t-transparent rounded-full animate-spin"></div>
      </div>

      {/* Loading Text */}
      <p className="text-white text-sm tracking-widest uppercase animate-pulse">
        Loading...
      </p>

    </div>
  </div>
);

export default function AppRouter() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<Login/>} />
         
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/invoices" element={<Invoices />} />
           
          {/*Queries*/}
          <Route path="/queries" element={<Queries />}> 
           <Route index element={<Navigate to="pending" replace />} />
           <Route path="all" element={<PendingQueries/>} />
           <Route path="pending" element={<PendingQueries/>}/>
          <Route path="contacted" element={<PendingQueries/>}/>
           
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
          <Route path="/order/details/:id" element={<OrderDetails/>}/>
          
          {/* Products */}
          <Route path="/products" element={<Products />}>
            <Route index element={<Navigate to="categories" replace />} />
            <Route path="all" element={<AllProducts />} />
            <Route path="categories" element={<ProductCategories />} />
            <Route path="subcategories" element={<Subcategories />} />
            <Route path="brands" element={<Brands />} />
          </Route>
           
            <Route path="/AddProduct" element={<AddProduct/>}/>
            <Route path="/AddCategory" element={<AddCategory/>}/>
            <Route path="/AddSubcategory" element={<AddSubcategory/>}/>
            <Route path="/AddBrand" element={<AddBrand/>}/>
               
          {/* Delivery */}
          <Route path="/delivery" element={<Delivery />}>
            <Route index element={<Navigate to="requests" replace />} />
            <Route path="requests" element={<DeliveryRequests />} />
            <Route path="approved" element={<DeliveryRequests />} />
            <Route path="rejected" element={<DeliveryRequests />} />
          </Route>
           
            <Route path="/delivery/DeliveryBoyDetail/:id" element={<DeliveryBoyDetail/>}/>
         
          {/*Offer*/}
           <Route path="/offers" element={<Offers/>}>
            <Route index element={<Navigate to="mainbanner" replace />} />
            <Route path="mainbanner" element={< MainBanner/>} />
            <Route path="add-banner" element={<AddBanner/>}/>
          </Route>
          
          {/*Wallet*/}
            <Route path="/wallet" element={<Wallet/>}>
            <Route index element={<Navigate to="WalletTable" replace />} />
            <Route path="WalletTable" element={<WalletTable/>} />
          </Route>

        </Route>
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Suspense>
  );
}
