import { Outlet } from "react-router-dom";

export default function Reports() {
    return (
        <div className="p-4 sm:p-6 bg-[#F8FAFC] min-h-screen ">
            <Outlet />
        </div>
    );
}
