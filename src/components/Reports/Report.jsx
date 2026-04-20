import React, { useState } from "react";
import { useGetReportsQuery } from "../../Redux/apis/reportApi";

const Reports = () => {
    const [filterType, setFilterType] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const { data, isLoading, isError } = useGetReportsQuery(
        filterType === "custom"
            ? { filterType, fromDate, toDate }
            : filterType
                ? { filterType }
                : {}
    );

    const reports = data?.data || [];

    return (
        <div className="p-6">
            {/* Header */}
            <h2 className="text-2xl font-bold mb-4">Reports</h2>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6 items-end">
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="">All</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                    <option value="custom">Custom</option>
                </select>

                {filterType === "custom" && (
                    <>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="border p-2 rounded"
                        />
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="border p-2 rounded"
                        />
                    </>
                )}
            </div>

            {/* Loading / Error */}
            {isLoading && <p className="text-blue-500">Loading...</p>}
            {isError && <p className="text-red-500">Error fetching reports</p>}

            {/* Table */}
            {!isLoading && reports.length > 0 && (
                <div className="overflow-x-auto bg-white shadow rounded-lg">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3">#</th>
                                <th className="px-4 py-3">Order ID</th>
                                <th className="px-4 py-3">Customer</th>
                                <th className="px-4 py-3">Amount</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            {reports.map((item, index) => (
                                <tr
                                    key={item._id || index}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="px-4 py-3">{index + 1}</td>
                                    <td className="px-4 py-3">{item.orderId || "-"}</td>
                                    <td className="px-4 py-3">
                                        {item.customerName || "-"}
                                    </td>
                                    <td className="px-4 py-3">
                                        ₹{item.amount || 0}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-1 rounded bg-blue-100 text-blue-600">
                                            {item.status || "-"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {item.createdAt
                                            ? new Date(item.createdAt).toLocaleDateString("en-IN")
                                            : "-"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!isLoading && reports.length === 0 && (
                <p className="text-gray-500">No data found</p>
            )}
        </div>
    );
};

export default Reports;