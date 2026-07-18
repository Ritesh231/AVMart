import { Outlet } from "react-router-dom";

export default function Reports() {
    return (
        <div className="p-4 sm:p-6 bg-[#F8FAFC] min-h-screen ">
            <h1 className="text-2xl font-semibold mb-3">Reports</h1>
            <h3 className="text-[#9F9F9F] mb-2">Manage reports</h3>
            <Outlet />
        </div>
    );
}
