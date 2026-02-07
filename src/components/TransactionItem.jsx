import React from 'react'

const TransactionItem = ({ data }) => {
    const isCredited = data.type === "credited";

    return (
        <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
            <div className="flex items-center gap-4">
                {/* Profile Image with Soft Background */}
                <div className="h-14 w-14 rounded-2xl overflow-hidden bg-brand-soft flex-shrink-0">
                    <img
                        src={data.image || "https://ui-avatars.com/api/?name=" + data.username}
                        alt={data.username}
                        className="h-full w-full object-cover"
                    />
                </div>

                <div>
                    <h4 className="font-bold text-brand-navy text-lg leading-tight">{data.username}</h4>
                    <p className="text-xs text-brand-gray font-medium mt-1">{data.time}</p>
                </div>
            </div>

            {/* Dynamic Amount Styling */}
            <div className={`text-xl font-bold ${isCredited ? 'text-green-500' : 'text-red-500'}`}>
                {isCredited ? '+' : '-'}₹{data.amount}
            </div>
        </div>
    );
};

export default TransactionItem