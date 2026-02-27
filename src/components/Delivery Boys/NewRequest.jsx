import {
  FaSearch,
  FaEye,
} from "react-icons/fa";
import { Search, SlidersHorizontal, Download, ChevronDown } from "lucide-react";
import { SiTicktick } from "react-icons/si";
import { RxCrossCircled } from "react-icons/rx";
import { MdDeliveryDining } from "react-icons/md";
import { useLocation } from "react-router-dom";
import { useGetAllDeliveryBoysQuery, useUpdateDeliveryStatusMutation } from "../../Redux/apis/deliveryApi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function UsersTable() {

  const location = useLocation();
  const navigate = useNavigate();
  const [vehicleFilter, setVehicleFilter] = useState("All");
  
  let status = "pending";

  if (location.pathname.includes("approved")) status = "approved";
  if (location.pathname.includes("rejected")) status = "rejected";

  const { data, isLoading, isError } =
    useGetAllDeliveryBoysQuery({ status });

  const [updateDeliveryStatus, { isLoading: statusLoading }] =
    useUpdateDeliveryStatusMutation();

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateDeliveryStatus({
        id,
        status: newStatus,
      }).unwrap();

      console.log("Status updated successfully");
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const users = data?.data || [];
  const uniqueVehicleTypes = [
    "All",
    ...new Set(users.map((u) => u.VehicleType).filter(Boolean)),
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 6;

  // Pagination Logic
  const filteredUsers =
    vehicleFilter === "All"
      ? users
      : users.filter((u) => u.VehicleType === vehicleFilter);

  const totalPages = Math.ceil(filteredUsers.length / ordersPerPage);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;

  const currentOrders = filteredUsers.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  // Reset to page 1 when orders change
  useState(() => {
    setCurrentPage(1);
  }, [users.length]);

  return (
    <>
      {/* Search & Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="w-full lg:w-[40%] md:w-[50%]">
          <div className="flex items-center gap-2 bg-white border-2 rounded-2xl p-3">
            <Search size={20} />
            <input
              className="w-full bg-transparent outline-none"
              type="text"
              placeholder="Search By User Name and Phone no"
            />
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <button className="bg-brand-cyan px-3 py-3 rounded-xl">
            <SlidersHorizontal size={20} />
          </button>

          <select
            value={vehicleFilter}
            onChange={(e) => {
              setVehicleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="border px-4 py-3 rounded-2xl bg-white font-medium"
          >
            {uniqueVehicleTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>

          <button className="bg-brand-navy px-6 py-3 rounded-2xl text-white flex items-center gap-2">
            <Download size={20} /> Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="min-w-[900px] w-full text-sm">
          <thead className="bg-[#F1F5F9] text-gray-600">
            <tr>
              <th className="p-3"></th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Contact</th>
              <th className="p-3 text-left">Vehicle Type</th>
              <th className="p-3 text-left">Vehicle No</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {/* ✅ Loading Skeleton */}
            {isLoading &&
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-t animate-pulse">
                  <td className="p-3"><div className="h-4 w-4 bg-gray-200 rounded"></div></td>
                  <td className="p-3"><div className="h-4 w-24 bg-gray-200 rounded"></div></td>
                  <td className="p-3"><div className="h-4 w-20 bg-gray-200 rounded"></div></td>
                  <td className="p-3"><div className="h-4 w-32 bg-gray-200 rounded"></div></td>
                  <td className="p-3"><div className="h-4 w-20 bg-gray-200 rounded"></div></td>
                  <td className="p-3"><div className="h-4 w-20 bg-gray-200 rounded"></div></td>
                  <td className="p-3"><div className="h-4 w-16 bg-gray-200 rounded"></div></td>
                </tr>
              ))}

            {/* ❌ Error */}
            {isError && (
              <tr>
                <td colSpan="7" className="text-center p-6 text-red-500 font-semibold">
                  Failed to load delivery boys.
                </td>
              </tr>
            )}

            {/* ✅ Data */}
            {!isLoading && !isError &&
              currentOrders.map((u) => (
                <tr key={u._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <input type="checkbox" />
                  </td>

                  <td className="p-3 font-medium">
                    {u.Name || "N/A"}
                  </td>

                  <td className="p-3">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-blue-900 text-white flex items-center justify-center text-sm">
                        {u.Name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{u.contactNo}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <MdDeliveryDining size={20} />
                      {u.VehicleType || "N/A"}
                    </div>
                  </td>

                  <td className="p-3">
                    {u.VehicleNumber || "N/A"}
                  </td>

                  <td className="p-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">

                      {/* ✅ Show Approve/Reject ONLY for pending */}
                      {status === "pending" && (
                        <>
                          <button
                            className="text-green-600"
                            disabled={statusLoading}
                            onClick={() => handleStatusUpdate(u._id, "approved")}
                          >
                            <SiTicktick size={18} />
                          </button>

                          <button
                            className="text-red-600"
                            disabled={statusLoading}
                            onClick={() => handleStatusUpdate(u._id, "rejected")}
                          >
                            <RxCrossCircled size={18} />
                          </button>
                        </>
                      )}

                      {/* View always visible */}
                      <button className="text-blue-900" onClick={() => navigate(`/delivery/DeliveryBoyDetail/${u._id}`)}>
                        <FaEye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>


        {/* Pagination */}
        {filteredUsers.length > ordersPerPage && (
          <div className="flex justify-between items-center mt-6 px-4 py-4 bg-white border-t">

            {/* Showing Info */}
            <p className="text-sm text-gray-600">
              Showing {indexOfFirstOrder + 1} to{" "}
              {Math.min(indexOfLastOrder, filteredUsers.length)} of{" "}
              {filteredUsers.length} orders
            </p>

            {/* Buttons */}
            <div className="flex items-center gap-2">

              {/* Prev */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all
          ${currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#1E264F] text-white hover:bg-opacity-90"
                  }`}
              >
                Prev
              </button>

              {/* Page Numbers */}
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all
              ${currentPage === page
                        ? "bg-[#00E5B0] text-white shadow-md"
                        : "bg-gray-100 text-[#1E264F] hover:bg-gray-200"
                      }`}
                  >
                    {page}
                  </button>
                );
              })}

              {/* Next */}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all
          ${currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#1E264F] text-white hover:bg-opacity-90"
                  }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}