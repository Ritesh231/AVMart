import React from 'react'

const StatCardSkeleton = () => {
    return (
        <div className="p-4 rounded-xl border bg-white shadow-sm animate-pulse">
            <div className="flex items-center justify-between mb-3">
                <div className="h-4 w-24 bg-gray-300 rounded"></div>
                <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
            </div>

            <div className="h-8 w-16 bg-gray-300 rounded mb-2"></div>

            <div className="h-3 w-20 bg-gray-200 rounded"></div>
        </div>
    );
};

export default StatCardSkeleton;