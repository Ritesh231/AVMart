import React, { useState } from "react";
import { useGetallsuggestionsQuery } from "../../Redux/apis/suggestionApi";

export default function FeedbackList() {
    const [page, setPage] = useState(1);

    const { data, isLoading, isError } = useGetallsuggestionsQuery({
        page,
        limit: 5,
    });

    if (isLoading) {
        return <p className="p-4">Loading...</p>;
    }

    if (isError) {
        return <p className="p-4 text-red-500">Failed to load data</p>;
    }

    const feedbacks = data?.data || [];
    const pagination = data?.pagination;

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">User Feedback</h2>

            <div className="grid gap-4">
                {feedbacks.map((item) => (
                    <div
                        key={item.id}
                        className="border rounded-xl p-4 shadow-sm bg-white hover:shadow-md transition"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-500">
                                #{item.reference}
                            </span>

                            <span
                                className={`text-xs px-2 py-1 rounded-full ${item.status === "new"
                                    ? "bg-green-100 text-green-600"
                                    : "bg-gray-100 text-gray-600"
                                    }`}
                            >
                                {item.status}
                            </span>

                        </div>

                        <div className="mb-2">
                            <span
                                className={`text-xs px-2 py-1 rounded-full ${item.type === "bug"
                                    ? "bg-red-100 text-red-600"
                                    : "bg-blue-100 text-blue-600"
                                    }`}
                            >
                                {item.type}
                            </span>
                        </div>

                        <p className="text-gray-800 mb-2">{item.issue}</p>

                        <div className="flex justify-between text-sm text-gray-500">
                            <span>{item.email}</span>
                            <span>
                                {new Date(item.createdAt).toLocaleString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* ✅ Pagination Controls */}
            <div className="flex justify-between items-center mt-6">
                <button
                    disabled={page === 1}
                    onClick={() => setPage((prev) => prev - 1)}
                    className={`px-4 py-2 rounded text-white ${page === 1
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#1E264F] hover:bg-[#2a3570] cursor-pointer"
                        }`}
                >
                    Prev
                </button>

                <span className="text-sm">
                    Page {pagination?.page} of {pagination?.pages}
                </span>

                <button
                    disabled={page === pagination?.pages}
                    onClick={() => setPage((prev) => prev + 1)}
                    className={`px-4 py-2 rounded text-white ${page === pagination?.pages
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#1E264F] hover:bg-[#2a3570] cursor-pointer"
                        }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
}