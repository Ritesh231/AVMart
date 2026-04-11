import { useGetWithdrawalRequestsQuery, useVerifyWithdrawalMutation } from "../../Redux/apis/deliveryApi";
import { Check, X } from "lucide-react";
import { ToastContainer } from "react-toastify";

function WithdrawalTable() {
    const { data, isLoading } = useGetWithdrawalRequestsQuery();
    const [verifyWithdrawal, { isLoading: actionLoading }] = useVerifyWithdrawalMutation();

    const withdrawals = data?.data || [];

    const handleAction = async (id, status) => {
        try {
            const res = await verifyWithdrawal({
                requestId: id,
                status,
                adminNote:
                    status === "approved"
                        ? "Approved by admin"
                        : "Rejected by admin",
            }).unwrap();

            console.log("API Response:", res); // debug

            // ✅ Show backend message
            toast.success(res?.message || `Request ${status} successfully`);

        } catch (error) {
            console.log("Error:", error);

            toast.error(error?.data?.error || "Action failed");
        }
    };

    if (isLoading) return <p className="p-4">Loading...</p>;

    return (
        <div className="p-4">
            <div className="bg-white rounded-xl shadow overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="p-3 text-left">User</th>
                            <th className="p-3 text-left">Amount</th>
                            <th className="p-3 text-left">Description</th>
                            <th className="p-3 text-left">Date</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {withdrawals.map((item) => (
                            <tr key={item._id} className="border-t hover:bg-gray-50">

                                {/* User */}
                                <td className="p-3">
                                    {item.deliveryBoyID ? (
                                        <div>
                                            <p className="font-medium">{item.deliveryBoyID.email}</p>
                                            <p className="text-xs text-gray-500">
                                                {item.deliveryBoyID.contactNo}
                                            </p>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400">N/A</span>
                                    )}
                                </td>

                                {/* Amount */}
                                <td className="p-3 font-semibold text-green-600">
                                    ₹{item.amount}
                                </td>

                                {/* Description */}
                                <td className="p-3 max-w-[250px] break-words">
                                    {item.description}
                                </td>

                                {/* Date */}
                                <td className="p-3 text-gray-500">
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </td>

                                {/* Status */}
                                <td className="p-3">
                                    <span
                                        className={`px-2 py-1 text-xs rounded-full font-semibold
                      ${item.status === "approved"
                                                ? "bg-green-100 text-green-600"
                                                : item.status === "rejected"
                                                    ? "bg-red-100 text-red-600"
                                                    : "bg-yellow-100 text-yellow-600"
                                            }
                    `}
                                    >
                                        {item.status}
                                    </span>
                                </td>

                                {/* Actions */}
                                <td className="p-3 text-center">
                                    {item.status === "pending" ? (
                                        <div className="flex justify-center gap-2">

                                            {/* Approve */}
                                            <button
                                                onClick={() => handleAction(item._id, "approved")}
                                                disabled={actionLoading}
                                                className="bg-green-500 hover:bg-green-600 text-white p-1 w-6 h-6 rounded-full"
                                            >
                                                <Check size={16} />
                                            </button>

                                            {/* Reject */}
                                            <button
                                                onClick={() => handleAction(item._id, "rejected")}
                                                disabled={actionLoading}
                                                className="bg-red-500 hover:bg-red-600 text-white p-1 w-6 h-6 rounded-full"
                                            >
                                                <X size={16} />
                                            </button>

                                        </div>
                                    ) : (
                                        <span className="text-gray-400 text-xs">No Action</span>
                                    )}
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default WithdrawalTable;