"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiEye, FiEdit2, FiTrash2, FiCheck } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";

import EditRequestModal from "@/components/DashBoard/EditRequestModal";
import DeleteRequestModal from "@/components/DashBoard/DeleteRequestModal";

export default function DonationRequestsCards() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  // Modal triggers
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const userRole = session?.user?.role || "donor";
  const isAdmin = userRole === "admin";

  const fetchRequests = async () => {
    if (!session?.user?.id) return;
    try {
      setIsLoading(true);
      const endpoint = isAdmin
        ? "http://localhost:5000/api/all-blood-donation-requests"
        : `http://localhost:5000/api/donation-requests/${session.user.id}`;

      const res = await fetch(endpoint);
      if (!res.ok) throw new Error("Failed to fetch requests");
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!sessionLoading) {
      fetchRequests();
    }
  }, [session, sessionLoading, isAdmin]);

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

  // Quick Inline Status Update (Admin only)
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/donation-requests/status/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Status update failed");

      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  // Full Edit API Handler
  const handleSaveEdit = async (id, updatedFields) => {
    const res = await fetch(`http://localhost:5000/api/donation-requests/edit/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFields),
    });
    if (!res.ok) throw new Error("Update failed");

    setRequests((prev) =>
      prev.map((r) => (r._id === id ? { ...r, ...updatedFields } : r))
    );
  };

  // Full Delete API Handler
  const handleDelete = async (id) => {
    const res = await fetch(`http://localhost:5000/api/donation-requests/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Delete failed");

    setRequests((prev) => prev.filter((r) => r._id !== id));
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-[6px] h-[24px] px-[10px] rounded-full font-mono text-[11px] font-[600] uppercase tracking-[0.05em] text-[#B45309] bg-[#FDF4E7]">
            <i className="w-[6px] h-[6px] rounded-full bg-current"></i>
            pending
          </span>
        );
      case "inprogress":
        return (
          <span className="inline-flex items-center gap-[6px] h-[24px] px-[10px] rounded-full font-mono text-[11px] font-[600] uppercase tracking-[0.05em] text-[#0E7490] bg-[#EAF7FA]">
            <i className="w-[6px] h-[6px] rounded-full bg-current"></i>
            inprogress
          </span>
        );
      case "done":
        return (
          <span className="inline-flex items-center gap-[6px] h-[24px] px-[10px] rounded-full font-mono text-[11px] font-[600] uppercase tracking-[0.05em] text-[#15803D] bg-[#EDF7F0]">
            <i className="w-[6px] h-[6px] rounded-full bg-current"></i>
            done
          </span>
        );
      case "canceled":
        return (
          <span className="inline-flex items-center gap-[6px] h-[24px] px-[10px] rounded-full font-mono text-[11px] font-[600] uppercase tracking-[0.05em] text-[#64748B] bg-[#F1F5F9]">
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
      <div className="bg-white border border-[#E4E8ED] rounded-[14px] overflow-hidden">
        
        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-[6px] p-[12px_16px] border-b border-[#E4E8ED]">
          {["all", "pending", "inprogress", "done", "canceled"].map((tab) => {
            const isActive = activeFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`flex items-center gap-[6px] h-[32px] px-[12px] rounded-[9px] text-[13px] font-[600] capitalize transition-colors ${
                  isActive
                    ? "bg-[#FDF1F2] text-[#C1121F]"
                    : "text-[#5C6675] hover:bg-[#F5F7F9] hover:text-[#10141C]"
                }`}
              >
                <span>{tab}</span>
                <span className={`text-[11px] font-mono px-[5px] py-[1px] rounded-full ${isActive ? "bg-[#C1121F] text-white" : "bg-[#F5F7F9] text-[#5C6675]"}`}>
                  {counts[tab]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Table */}
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
                  <td colSpan={7} className="py-[40px] text-center text-[#5C6675] font-mono text-[13px]">
                    Loading requests...
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-[40px] text-center text-[#5C6675] text-[14px]">
                    No requests found.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req._id} className="border-b border-[#E4E8ED] hover:bg-[#F5F7F9] transition-colors">
                    <td className="py-[14px] px-[16px] align-middle">
                      <p className="font-[600] text-[14px] text-[#10141C]">{req.recipientName}</p>
                      <p className="font-mono text-[11px] text-[#5C6675]">{req._id?.slice(-8).toUpperCase()}</p>
                    </td>

                    <td className="py-[14px] px-[16px] text-[13.5px] text-[#10141C] align-middle">
                      {req.upazilaName ? `${req.upazilaName}, ${req.districtName}` : req.address}
                    </td>

                    <td className="py-[14px] px-[16px] font-mono text-[12px] text-[#10141C] align-middle">
                      {req.donationDate}<br /><span className="text-[#5C6675]">{req.donationTime}</span>
                    </td>

                    <td className="py-[14px] px-[16px] align-middle">
                      <span className="inline-flex flex-col items-center justify-center border-[1.5px] border-[#C1121F] rounded-[8px] bg-white text-[#C1121F] font-mono font-[600] relative overflow-hidden min-w-[42px] h-[32px] text-[13px] pt-[3px] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3.5px] before:bg-[#C1121F]">
                        {req.bloodGroup}
                      </span>
                    </td>

                    {/* Role Gated Status Display */}
                    <td className="py-[14px] px-[16px] align-middle">
                      {getStatusChip(req.status)}
                      {isAdmin && req.status === "inprogress" && (
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

                    <td className="py-[14px] px-[16px] text-[13.5px] align-middle">
                      {req.donorName ? (
                        <div>
                          <p className="font-[600] text-[#10141C]">{req.donorName}</p>
                          <p className="font-mono text-[11px] text-[#5C6675]">{req.donorEmail}</p>
                        </div>
                      ) : (
                        <span className="text-[#5C6675]">—</span>
                      )}
                    </td>

                    <td className="py-[14px] px-[16px] text-right align-middle">
                      <div className="inline-flex items-center gap-[4px]">
                        <Link
                          href={`/donation-requests/${req._id}`}
                          className="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center text-[#5C6675] hover:text-[#10141C] hover:bg-[#F5F7F9]"
                        >
                          <FiEye className="text-[16px]" />
                        </Link>
                        <button
                          onClick={() => setEditTarget(req)}
                          className="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center text-[#5C6675] hover:text-[#10141C] hover:bg-[#F5F7F9]"
                        >
                          <FiEdit2 className="text-[15px]" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(req)}
                          className="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center text-[#C1121F] hover:bg-[#FDF1F2]"
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
      </div>

      {/* ── Standalone Modals ── */}
      <EditRequestModal
        isOpen={Boolean(editTarget)}
        onClose={() => setEditTarget(null)}
        request={editTarget}
        onSave={handleSaveEdit}
        isAdmin={isAdmin}
      />

      <DeleteRequestModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        request={deleteTarget}
        onDelete={handleDelete}
      />
    </div>
  );
}