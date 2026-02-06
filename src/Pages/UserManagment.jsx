import UserStats from "../Components/Userstats";
import UsersTable from "../Components/UserTable";

export default function UsersManagement() {
  return (
    <div className="p-4 sm:p-6 bg-[#F8FAFC] min-h-screen w-screen">
      <h1 className="text-xl font-semibold mb-6">Users Management</h1>

      <UserStats />
      <UsersTable />
    </div>
  );
}
