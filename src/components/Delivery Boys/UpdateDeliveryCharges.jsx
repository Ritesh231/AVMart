import React, { useState } from "react";
import { useUpdateDeliveryChargesMutation } from "../../Redux/apis/deliveryApi";
import { toast } from "react-toastify";

const UpdateDeliveryCharges = () => {
    const [amount, setAmount] = useState("");
    const [updateDeliveryCharges, { isLoading }] =
        useUpdateDeliveryChargesMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!amount || amount <= 0) {
            return toast.error("Please enter valid amount");
        }

        try {
            await updateDeliveryCharges(Number(amount)).unwrap();
            toast.success("Delivery charges updated successfully ✅");
            setAmount("");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update delivery charges ❌");
        }
    };

    return (
        <div className="min-h-[60vh] flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">

                {/* Title */}
                <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                    Update Delivery Charges
                </h2>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Delivery Charge (₹)
                        </label>
                        <input
                            type="number"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#00E5B0] text-white py-2 rounded-lg hover:bg-green-900 transition disabled:opacity-50"
                    >
                        {isLoading ? "Updating..." : "Update Charges"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateDeliveryCharges;