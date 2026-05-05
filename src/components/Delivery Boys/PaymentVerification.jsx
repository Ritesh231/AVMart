import React, { useState } from "react";
import {
    useSendCashVerificationOtpMutation,
    useVerifyCashAndDeductMutation,
} from "../../Redux/apis/ordersApi";
import toast from "react-hot-toast";

function CashDeductionBox({ deliveryBoyId }) {
    const [sendOtp, { isLoading: sendingOtp }] =
        useSendCashVerificationOtpMutation();
    const [verifyOtp, { isLoading: verifying }] =
        useVerifyCashAndDeductMutation();

    const [otp, setOtp] = useState("");
    const [amount, setAmount] = useState("");
    const [otpSent, setOtpSent] = useState(false);

    // 🔹 Send OTP
    const handleSendOtp = async () => {
        try {
            const res = await sendOtp({ deliveryBoyId }).unwrap();
            toast.success(res?.message || "OTP sent successfully");
            setOtpSent(true);
        } catch (err) {
            toast.error("Failed to send OTP");
        }
    };

    // 🔹 Verify & Deduct
    const handleVerify = async () => {
        if (!otp || !amount) {
            return toast.error("All fields are required");
        }

        try {
            const res = await verifyOtp({
                deliveryBoyId,
                otp,
                amount,
            }).unwrap();

            toast.success(res?.message || "Cash deducted successfully");

            // reset
            setOtp("");
            setAmount("");
            setOtpSent(false);

        } catch (err) {
            toast.error("Invalid OTP or failed deduction");
        }
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-md w-full max-w-sm space-y-4">

            {/* 🔸 Send OTP Button */}
            <button
                onClick={handleSendOtp}
                disabled={sendingOtp}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition"
            >
                {sendingOtp ? "Sending OTP..." : "Send OTP"}
            </button>

            {/* 🔸 Show only after OTP sent */}
            {otpSent && (
                <div className="space-y-3">

                    {/* OTP Input */}
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        maxLength={6}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        className="w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-400"
                    />

                    {/* Amount Input */}
                    <input
                        type="text"
                        placeholder="Enter Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
                        className="w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-400"
                    />

                    {/* Verify Button */}
                    <button
                        onClick={handleVerify}
                        disabled={verifying}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition"
                    >
                        {verifying ? "Processing..." : "Verify & Deduct"}
                    </button>

                </div>
            )}
        </div>
    );
}

export default CashDeductionBox;