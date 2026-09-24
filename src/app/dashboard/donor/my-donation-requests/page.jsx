"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiEye, FiEdit2, FiTrash2, FiCheck, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";

export default function MyDonationRequestsPage() {
    const { data: session, isPending: sessionLoading } = authClient.useSession();
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("all");
    const [requestToDelete, setRequestToDelete] = useState(null);

    // ── Fetch requests for the logged-in user ──
    const fetchMyRequests = async () => {
        if (!session?.user?.id) return;

        try {
            setIsLoading(true);
            const res = await fetch(`http://localhost:5000/api/donation-requests/${session.user.id}`);
            if (!res.ok) throw new Error("Failed to fetch requests");

            const data = await res.json();
            setRequests(data);
        } catch (err) {
            console.error("Fetch requests error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!sessionLoading) {
            fetchMyRequests();
        }
    }, [session, sessionLoading]);

    // ── Tab counts ──
    const counts = {
        all: requests.length,
        pending: requests.filter((r) => r.status === "pending").length,
        inprogress: requests.filter((r) => r.status === "inprogress").length,
        done: requests.filter((r) => r.status === "done").length,
        canceled: requests.filter((r) => r.status === "canceled").length,
    };

    const filteredRequests =
        activeFilter === "all"
            ? requests
            : requests.filter((req) => req.status === activeFilter);

    // ── Update Status Handler (e.g., mark done/canceled) ──
    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const res = await fetch(`http://localhost:5000/api/donation-requests/status/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) throw new Error("Failed to update status");

            // Optimistic update in UI
            setRequests((prev) =>
                prev.map((req) => (req._id === id ? { ...req, status: newStatus } : req))
            );
        } catch (error) {
            console.error("Status update error:", error);
            alert("Could not update request status.");
        }
    };

    // ── Delete Request Handler ──
    const handleDelete = async () => {
        if (!requestToDelete) return;

        try {
            const res = await fetch(`http://localhost:5000/api/donation-requests/${requestToDelete._id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete request");

            setRequests((prev) => prev.filter((r) => r._id !== requestToDelete._id));
            setRequestToDelete(null);
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete request.");
        }
    };

    const getStatusChip = (status) => {
        switch (status) {
            case "pending":
                return (
                    <span className="inline-flex items-center gap-[6px] h-[24px] px-[9px] rounded-full font-mono text-[11px] font-[600] uppercase tracking-[0.05em] text-[#B45309] bg-[#FDF4E7]">
                        <i className="w-[6px] h-[6px] rounded-full bg-current"></i>
                        pending
                    </span>
                );
            case "inprogress":
                return (
                    <span className="inline-flex items-center gap-[6px] h-[24px] px-[9px] rounded-full font-mono text-[11px] font-[600] uppercase tracking-[0.05em] text-[#0E7490] bg-[#EAF7FA]">
                        <i className="w-[6px] h-[6px] rounded-full bg-current"></i>
                        inprogress
                    </span>
                );
            case "done":
                return (
                    <span className="inline-flex items-center gap-[6px] h-[24px] px-[9px] rounded-full font-mono text-[11px] font-[600] uppercase tracking-[0.05em] text-[#15803D] bg-[#EDF7F0]">
                        <i className="w-[6px] h-[6px] rounded-full bg-current"></i>
                        done
                    </span>
                );
            case "canceled":
                return (
                    <span className="inline-flex items-center gap-[6px] h-[24px] px-[9px] rounded-full font-mono text-[11px] font-[600] uppercase tracking-[0.05em] text-[#64748B] bg-[#F1F5F9]">
                        <i className="w-[6px] h-[6px] rounded-full bg-current"></i>
                        canceled
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="w-full max-w-[1180px] mx-auto">
            {/* Header */}
            <div className="mb-[22px]">
                <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675] mb-[6px]">
                    Donor · Only the requests you posted
                </p>
                <h2 className="text-[clamp(24px,3vw,30px)] font-bold text-[#10141C] leading-[1.1] tracking-[-0.02em]">
                    My donation requests
                </h2>
            </div>

            {/* Main Table Card */}
            <div className="bg-white border border-[#E4E8ED] rounded-[14px] overflow-hidden">
                {/* Status Filter Tabs */}
                <div className="flex flex-wrap items-center gap-[6px] p-[12px_16px] border-b border-[#E4E8ED]">
                    {[
                        { key: "all", label: "All" },
                        { key: "pending", label: "pending" },
                        { key: "inprogress", label: "inprogress" },
                        { key: "done", label: "done" },
                        { key: "canceled", label: "canceled" },
                    ].map((tab) => {
                        const isActive = activeFilter === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveFilter(tab.key)}
                                className={`flex items-center gap-[6px] h-[32px] px-[12px] rounded-[9px] text-[13px] font-[600] transition-colors cursor-pointer ${
                                    isActive
                                        ? "bg-[#FDF1F2] text-[#C1121F]"
                                        : "text-[#5C6675] hover:bg-[#F5F7F9] hover:text-[#10141C]"
                                }`}
                            >
                                <span>{tab.label}</span>
                                <span
                                    className={`text-[11px] font-mono px-[5px] py-[1px] rounded-full ${
                                        isActive ? "bg-[#C1121F] text-white" : "bg-[#F5F7F9] text-[#5C6675]"
                                    }`}
                                >
                                    {counts[tab.key]}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Responsive Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[850px]">
                        <thead>
                            <tr className="border-b border-[#E4E8ED] font-mono text-[10.5px] uppercase tracking-[0.1em] text-[#5C6675]">
                                <th className="py-[12px] px-[16px] font-[500]">Recipient</th>
                                <th className="py-[12px] px-[16px] font-[500]">Location</th>
                                <th className="py-[12px] px-[16px] font-[500]">Date & Time</th>
                                <th className="py-[12px] px-[16px] font-[500]">Group</th>
                                <th className="py-[12px] px-[16px] font-[500]">Status</th>
                                <th className="py-[12px] px-[16px] font-[500]">Donor</th>
                                <th className="py-[12px] px-[16px] font-[500] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="py-[48px] text-center text-[#5C6675]">
                                        <div className="w-[24px] h-[24px] border-[2px] border-[#C1121F] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                        <span className="text-[13px] font-mono">Loading requests...</span>
                                    </td>
                                </tr>
                            ) : filteredRequests.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-[40px] text-center text-[14px] text-[#5C6675]">
                                        No donation requests found under this status.
                                    </td>
                                </tr>
                            ) : (
                                filteredRequests.map((req) => (
                                    <tr
                                        key={req._id}
                                        className="border-b border-[#E4E8ED] hover:bg-[#F5F7F9] transition-colors last:border-b-0"
                                    >
                                        {/* Recipient Name & DB ID */}
                                        <td className="py-[14px] px-[16px] align-middle">
                                            <p className="font-[600] text-[14px] text-[#10141C] leading-snug">
                                                {req.recipientName}
                                            </p>
                                            <p className="font-mono text-[11px] text-[#5C6675] tracking-[0.04em]">
                                                {req._id.substring(req._id.length - 8).toUpperCase()}
                                            </p>
                                        </td>

                                        {/* Location */}
                                        <td className="py-[14px] px-[16px] text-[13.5px] text-[#10141C] align-middle">
                                            {req.upazilaName ? `${req.upazilaName}, ${req.districtName}` : req.address}
                                        </td>

                                        {/* Date & Time */}
                                        <td className="py-[14px] px-[16px] font-mono text-[12px] text-[#10141C] align-middle leading-snug">
                                            {req.donationDate}
                                            <br />
                                            <span className="text-[#5C6675]">{req.donationTime}</span>
                                        </td>

                                        {/* Blood Group Token */}
                                        <td className="py-[14px] px-[16px] align-middle">
                                            <span className="inline-flex flex-col items-center justify-center border-[1.5px] border-[#C1121F] rounded-[8px] bg-white text-[#C1121F] font-mono font-[600] relative overflow-hidden min-w-[42px] h-[32px] text-[13px] pt-[3px] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3.5px] before:bg-[#C1121F]">
                                                {req.bloodGroup}
                                            </span>
                                        </td>

                                        {/* Status & Quick Action Buttons */}
                                        <td className="py-[14px] px-[16px] align-middle">
                                            {getStatusChip(req.status)}
                                            {req.status === "inprogress" && (
                                                <div className="flex items-center gap-[6px] mt-[8px]">
                                                    <button
                                                        onClick={() => handleUpdateStatus(req._id, "done")}
                                                        className="inline-flex items-center gap-[4px] h-[28px] px-[9px] rounded-[7px] text-[12px] font-[600] bg-[#FDF1F2] text-[#C1121F] hover:bg-[#FAE3E5] transition-colors"
                                                    >
                                                        <FiCheck className="text-[13px]" /> Done
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(req._id, "canceled")}
                                                        className="inline-flex items-center gap-[4px] h-[28px] px-[9px] rounded-[7px] text-[12px] font-[600] bg-white border border-[#E4E8ED] text-[#10141C] hover:bg-[#F5F7F9] hover:border-[#10141C] transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                        </td>

                                        {/* Donor Details */}
                                        <td className="py-[14px] px-[16px] text-[13.5px] align-middle">
                                            {req.donorName ? (
                                                <div>
                                                    <p className="font-[600] text-[#10141C] leading-snug">
                                                        {req.donorName}
                                                    </p>
                                                    <p className="font-mono text-[11px] text-[#5C6675]">
                                                        {req.donorEmail}
                                                    </p>
                                                </div>
                                            ) : (
                                                <span className="text-[#5C6675]">—</span>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="py-[14px] px-[16px] text-right align-middle">
                                            <div className="inline-flex items-center gap-[4px]">
                                                <Link
                                                    href={`/donation-requests/${req._id}`}
                                                    title="View"
                                                    className="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center text-[#5C6675] hover:text-[#10141C] hover:bg-[#F5F7F9] transition-colors"
                                                >
                                                    <FiEye className="text-[16px]" />
                                                </Link>
                                                <Link
                                                    href={`/dashboard/edit-donation-request/${req._id}`}
                                                    title="Edit"
                                                    className="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center text-[#5C6675] hover:text-[#10141C] hover:bg-[#F5F7F9] transition-colors"
                                                >
                                                    <FiEdit2 className="text-[15px]" />
                                                </Link>
                                                <button
                                                    onClick={() => setRequestToDelete(req)}
                                                    title="Delete"
                                                    className="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center text-[#C1121F] hover:bg-[#FDF1F2] transition-colors"
                                                >
                                                    <FiTrash2 className="text-[15px]" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="flex items-center justify-between p-[12px_16px] border-t border-[#E4E8ED] font-mono text-[12px] text-[#5C6675]">
                    <span>showing {filteredRequests.length} requests</span>
                    <div className="flex items-center gap-[8px]">
                        <button
                            disabled
                            className="inline-flex items-center gap-[4px] h-[32px] px-[12px] rounded-[8px] border border-[#E4E8ED] bg-white text-[#5C6675] text-[13px] font-[600] disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <FiChevronLeft className="text-[14px]" /> Prev
                        </button>
                        <button
                            disabled
                            className="inline-flex items-center gap-[4px] h-[32px] px-[12px] rounded-[8px] border border-[#E4E8ED] bg-white text-[#5C6675] text-[13px] font-[600] disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Next <FiChevronRight className="text-[14px]" />
                        </button>
                    </div>
                </div>
            </div>

            {/* ── DELETE CONFIRMATION MODAL ── */}
            <AnimatePresence>
                {requestToDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-[18px]">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setRequestToDelete(null)}
                            className="absolute inset-0 bg-[#10141C]/55 backdrop-blur-[2px]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="relative bg-white rounded-[16px] w-full max-w-[440px] shadow-2xl overflow-hidden"
                        >
                            <div className="flex items-center justify-between px-[20px] py-[16px] border-b border-[#E4E8ED]">
                                <h3 className="text-[17px] font-[700] text-[#10141C]">Delete this request?</h3>
                                <button
                                    onClick={() => setRequestToDelete(null)}
                                    className="w-[30px] h-[30px] flex items-center justify-center text-[#5C6675] hover:text-[#10141C] hover:bg-[#F5F7F9] rounded-[8px]"
                                >
                                    <FiX className="text-[18px]" />
                                </button>
                            </div>
                            <div className="p-[20px]">
                                <p className="text-[13.5px] text-[#5C6675] leading-relaxed">
                                    The request for <strong className="text-[#10141C]">{requestToDelete.recipientName}</strong> will be removed from the public board. This cannot be undone.
                                </p>
                            </div>
                            <div className="flex justify-end gap-[8px] px-[20px] py-[14px] bg-[#F5F7F9] border-t border-[#E4E8ED]">
                                <button
                                    onClick={() => setRequestToDelete(null)}
                                    className="h-[38px] px-[16px] rounded-[9px] border border-[#E4E8ED] bg-white font-[600] text-[13.5px] text-[#10141C] hover:bg-[#F5F7F9]"
                                >
                                    Keep it
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="h-[38px] px-[16px] rounded-[9px] bg-[#C1121F] hover:bg-[#7A0A12] font-[600] text-[13.5px] text-white transition-colors"
                                >
                                    Delete request
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}