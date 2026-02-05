import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';

// Import your page components here
// const Orders = () => <div className="p-6 text-2xl font-bold">Orders Page</div>;

const AppRouter = () => {
    return (
        <Routes>
            {/* Default Redirect to Orders as per your image */}
            <Route path="/" element={<Navigate to="/orders" />} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<div className="p-8">Users Content</div>} />
            <Route path="/orders" element={<div className="p-8 text-brand-navy">Orders Content</div>} />
            <Route path="/products" element={<div className="p-8">Products Content</div>} />
            {/* Add other routes similarly */}

            <Route path="*" element={<div className="p-8">404 - Page Not Found</div>} />
        </Routes>
    );
};

export default AppRouter;