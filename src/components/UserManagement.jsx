import React, { useState, useMemo } from "react";
import { FaFileAlt, FaPen, FaTrash, FaEye, FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import { BsFileText, BsPeopleFill } from "react-icons/bs";
import { BiExport } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useGetUserQuery } from "../../../Redux/API/UserAPI";
import { useDeleteUserMutation } from "../../../Redux/API/UserAPI"; //

const UserManagement = () => {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState("USERS");


  //----------------------API--------------------------------
  const { data, isLoading, isError } = useGetUserQuery();
  const rawUsers = data?.data || [];
   const [deleteUser] = useDeleteUserMutation();

const users = useMemo(() => {
  if (!data?.data) return [];

  return data.data.map((u) => {
    const warehouse = data.allwarehouse?.find(
      w => String(w.employee_id) === String(u.userId)
    );

    const defaultDepartment =
      warehouse?.default_department ||
      (u.department_name?.length > 0 ? u.department_name[0] : "—");

    const defaultLocation =
      warehouse?.default_location 

    return {
      id: u._id,
      displayId: u.userId,
      name: u.Name,
      phone: u.mobile,
      email: u.email,
      companyNames: u.companies?.map(c => c.companyName).join(", ") || "—",
      roleNames: u.Roles?.length > 0 ? u.Roles.join(", ") : "—",
      departmentNames: defaultDepartment,
      default_location: defaultLocation,
      locationNames: u.location_name || [],
    };
  });
}, [data]);





  //--------------------Warehouse Declaration-----------------------

  const warehouseCount = data?.Warehouse_employees?.length || 0;
  const warehouses = data?.Warehouse_employees || [];

  //----------------------Filters------------------------------

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.displayId?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole =
        roleFilter === "All Roles" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  const filteredWarehouses = useMemo(() => {
    if (!warehouses || warehouses.length === 0) return [];

    return warehouses
      .map((wh) => {
        // Find the user associated with this warehouse
        const user = users.find((u) => u.displayId === wh.employee_id);

        return {
          ...wh,
          userName: user ? user.name : "—", // show user name
        };
      })
      .filter((wh) => {
        // Apply search filter
        const search = searchQuery.toLowerCase();
        return (
          wh.userName.toLowerCase().includes(search) ||
          wh.location_code.join(",").includes(search) ||
          wh.location_name.join(",").toLowerCase().includes(search)
        );
      });
  }, [warehouses, users, searchQuery]);



  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(filteredUsers.map((u) => u.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getDeptBadge = (dept) => {
    switch (dept) {
      case "Engineering":
        return "bg-blue-100 text-blue-700";
      case "Production":
        return "bg-green-100 text-green-700";
      case "Operation":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
   
  //----------------------------UI----------------------------------

  return (
    <div className="font-sans min-h-screen bg-[#CCC7E830] rounded-3xl -mx-3">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 4px; }
      `}</style>

      {/* Stats Cards */}
      <div className="flex flex-col md:flex-row items-end gap-6 mb-8">

        {/* USERS CARD */}
        <div
          onClick={() => setActiveTab("USERS")}
          className={`flex gap-6 flex-1 w-full cursor-pointer transition-all ${activeTab === "USERS" ? "scale-[1.02]" : "opacity-80"
            }`}
        >
          <div
            className={`rounded-[24px] p-6 text-white relative overflow-hidden shadow-lg 
      w-full md:w-64 h-36 flex flex-col justify-between
      ${activeTab === "USERS" ? "bg-[#2E236C]" : "bg-[#6b63b5]"}`}
          >
            <span className="text-sm font-medium opacity-90">Total Users</span>
            <span className="text-[40px] font-bold leading-none">
              {users.length}
            </span>
            <div className="absolute bottom-4 right-4 bg-white text-[#2E236C] w-10 h-10 rounded-[12px] flex items-center justify-center">
              <BsFileText className="text-xl" />
            </div>
          </div>
        </div> 

        {/* HOD CARD (info only – no tab switch) */}
        <div className="bg-[#DCE6F3] rounded-[24px] p-6 text-gray-800 relative overflow-hidden shadow-sm w-full md:w-64 h-36 flex flex-col justify-between">
          <span className="text-sm font-medium text-gray-600">
            Total HOD's
          </span>
          <span className="text-[40px] font-bold leading-none text-black">
            {users.filter((u) => u.role === "HOD").length}
          </span>
          <div className="absolute bottom-4 right-4 bg-[#2E236C] text-white w-10 h-10 rounded-[12px] flex items-center justify-center">
            <BsPeopleFill className="text-xl" />
          </div>
        </div> 

        {/* WAREHOUSE CARD */}
         <div
          onClick={() => setActiveTab("WAREHOUSE")}
          className={`rounded-[24px] p-6 relative overflow-hidden shadow-sm 
    w-full md:w-64 h-36 flex flex-col justify-between cursor-pointer 
    transition-all hover:scale-[1.02]
    ${activeTab === "WAREHOUSE"
              ? "bg-[#2E236C] text-white"
              : "bg-[#DCE6F3] text-gray-800"
            }`}
        >
          <span className={`text-sm font-medium ${activeTab === "WAREHOUSE" ? "text-white/80" : "text-gray-600"
            }`}>
            Total Warehouses
          </span>

          <span className="text-[40px] font-bold leading-none">
            {warehouseCount}
          </span>

          <div
            className={`absolute bottom-4 right-4 w-10 h-10 rounded-[12px] 
      flex items-center justify-center
      ${activeTab === "WAREHOUSE"
                ? "bg-white text-[#2E236C]"
                : "bg-white text-[#2E236C]"
              }`}
          >
            <FaMapMarkerAlt className="text-xl" />
          </div>
        </div>

        <button className="bg-[#2E236C] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-indigo-900 transition-colors shadow-md h-fit">
          Download Report
        </button>
      </div>


      {/* Main Content Area */}
      <div className="bg-white rounded-[24px] shadow-sm p-6">
        {/* USERS Tab */}
        {activeTab === "USERS" && (
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            {/* Left Title Section */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <FaFileAlt className="text-xl" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-black">All Users</h2>
                <p className="text-xs text-gray-400">
                  A list of all users in the system
                </p>
              </div>
            </div>

            {/* Right Filters Section */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search By name or department"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                />
              </div>

              <select
                className="border border-gray-200 rounded-lg text-sm py-2 px-3 bg-white text-gray-600 focus:outline-none"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="All Roles">All Roles</option>
                <option value="Requester">Requester</option>
                <option value="HOD">HOD</option>
              </select>

              <button className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                Export <BiExport className="text-lg rotate-90" />
              </button>
            </div>
          </div>
        )}

        {/* WAREHOUSE Tab */}
        {activeTab === "WAREHOUSE" && (
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            {/* Left Title Section */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                <FaMapMarkerAlt className="text-xl" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-black">All Warehouses</h2>
                <p className="text-xs text-gray-400">
                  A list of all warehouses in the system
                </p>
              </div>
            </div>

            {/* Right Search Section */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search by warehouse name, code or location"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-1 focus:ring-green-500 bg-white"
                />
              </div>

              <button className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                Export <BiExport className="text-lg rotate-90" />
              </button>
            </div>
          </div>
        )}


        {/* Scrollable Table Container */}
        {activeTab === "USERS" && (
          <div className="overflow-x-auto overflow-y-auto max-h-[500px] custom-scrollbar border border-gray-100 rounded-lg">
            <table className="w-full text-left text-sm text-gray-600 border-collapse">
              <thead className="bg-[#EBF3FA] text-xs font-bold text-gray-700 uppercase tracking-wider sticky top-0 z-10">
                <tr>
                  <th className="p-4 w-10">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                      checked={
                        filteredUsers.length > 0 &&
                        selectedRows.length === filteredUsers.length
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="p-4">USER ID</th>
                  <th className="p-4">NAME</th>
                  <th className="p-4">CONTACT</th>
                  <th className="p-4">COMPANY</th>
                  <th className="p-4">ROLE</th>
                  <th className="p-4">DEPARTMENT</th>
                  <th className="p-4">Location</th>
                  <th className="p-4 text-center">ACTION</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50 bg-white">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className={`transition-colors ${selectedRows.includes(user.id)
                        ? "bg-indigo-50"
                        : "hover:bg-gray-50"
                        }`}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                          checked={selectedRows.includes(user.id)}
                          onChange={() => handleSelectRow(user.id)}
                        />
                      </td>
                      <td className="p-4 font-bold text-gray-800">
                        {user.displayId}
                      </td>
                      <td className="p-4 font-medium text-gray-800">
                        {user.name}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-gray-800 font-medium">
                            {user.phone}
                          </span>
                          <span className="text-xs text-gray-400">
                            {user.email}
                          </span>
                        </div>
                      </td>

                      <td className="p-4 text-gray-800 font-medium">
                        {user.companyNames}
                      </td>


                      <td className="p-4 text-gray-800 font-medium">
                        {user.roleNames}
                      </td>

                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
                          {user.departmentNames}
                        </span>
                      </td>

                     <td className="p-4 text-xs font-semibold text-gray-700">
  {user.default_location ? (
    <div className="flex items-center gap-2">
      <FaMapMarkerAlt className="text-[#2E236C] shrink-0" />
      <span>{user.default_location}</span>
    </div>
  ) : (
    <span className="text-gray-400">—</span>
  )}
</td>



                      <td className="p-4">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => navigate(`/user-details/${user.displayId}`)}
                            className="text-[#2E236C] hover:text-indigo-900 bg-transparent"
                          >
                            <FaEye className="text-lg" />
                          </button>
                         <button
  onClick={() => {
    navigate(`/users/edit/${user.displayId}`);
  }}
  className="text-[#00C2BA] hover:text-teal-600 bg-transparent"
  title="Edit User"
>
  <FaPen className="text-lg" />
</button>

 {/* <button
                          onClick={async () => {
                            if (
                              window.confirm(
                                `Are you sure you want to delete user "${user.name}"?`
                              )
                            ) {
                              try {
                                await deleteUser(user.displayId).unwrap();
                                alert("User deleted successfully!");
                              } catch (err) {
                                console.error(err);
                                alert("Failed to delete user");
                              }
                            }
                          }}
                          className="text-red-500 hover:text-red-700 bg-transparent"
                        >
                          <FaTrash className="text-lg" />
                        </button> */}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="p-10 text-center text-gray-400 font-medium"
                    >
                      No users found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Info */}
        {activeTab === "USERS" && (
          <div className="mt-6 flex justify-between items-center text-sm text-gray-500">
            <span>
              Showing <strong>{filteredUsers.length}</strong> of{" "}
              <strong>{users.length}</strong> total users
            </span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 border border-gray-200 rounded text-gray-500 hover:bg-gray-50 text-xs">
                Previous
              </button>
              <button className="w-7 h-7 bg-[#2E236C] text-white rounded flex items-center justify-center text-xs">
                1
              </button>
              <button className="px-3 py-1 border border-gray-200 rounded text-gray-500 hover:bg-gray-50 text-xs">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/*Warehoue Table*/}
      {activeTab === "WAREHOUSE" && (
        <div className="bg-white rounded-xl border p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2">User Name</th>
                <th className="py-2">Warehouse Code</th>
                <th className="py-2">Warehouse Name</th>
                <th className="py-2">Location</th>
              </tr>
            </thead>

            <tbody>
              {filteredWarehouses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-400">
                    No Warehouses Found
                  </td>
                </tr>
              ) : (
                filteredWarehouses.map((wh) => (
                  <tr key={wh._id} className="border-b hover:bg-gray-50">
                    <td className="py-2">{wh.userName}</td>
                    <td className="py-2">{wh.location_code.join(", ")}</td>
                    <td className="py-2 w-64">
                      -
                    </td>
                    <td className="py-2 w-64">
                      {Array.isArray(wh.location_name) && wh.location_name.length > 0 ? (
                        <div className="whitespace-normal break-words">
                          {wh.location_name.join(", ")}
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      )}

     

    </div>
  );
};

export default UserManagement;
