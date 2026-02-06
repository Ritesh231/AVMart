import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Invoices from '../pages/Invoices';
import Orders from '../pages/Orders';
import Product from '../pages/Product';
import Users from '../pages/Users';
import Payments from '../pages/Payments';
import DeliveryBoy from '../pages/DeliveryBoy';
import Queries from '../pages/Queries';
import Offers from '../pages/Offers';
import Wallet from '../pages/Wallet';

// Import your page components here
// const Orders = () => <div className="p-6 text-2xl font-bold">Orders Page</div>;

const AppRouter = () => {
    return (
        <Routes>
            {/* Default Redirect to Orders as per your image */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/products" element={<Product />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/delivery-boy" element={<DeliveryBoy />} />
            <Route path="/queries" element={<Queries />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/wallet" element={<Wallet />} />

            <Route path="*" element={<div className="p-8">404 - Page Not Found</div>} />
        </Routes>
    );
};

export default AppRouter;