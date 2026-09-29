"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiEye, FiEdit2, FiTrash2, FiCheck, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import toast from "react-hot-toast";

import EditRequestModal from "@/components/DashBoard/EditRequestModal";
import DeleteRequestModal from "@/components/DashBoard/DeleteRequestModal";
import StatusConfirmModal from "@/components/DashBoard/StatusConfirmModal";

export default function DonationRequestsCards({ personalOnly = false }) {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  // Track which row has inline edit toggled open
  const [activeInlineEditId, setActiveInlineEditId] = useState(null);

  // Status confirm modal state
  const [statusConfirmTarget, setStatusConfirmTarget] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Modal triggers for Full Edit & Delete
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const rawRole = session?.user?.Role || session?.user?.role || "donor";
  const userRole = String(rawRole).toLowerCase();
  const isAdminOrVolunteer = userRole === "admin" || userRole === "volunteer";
  const isAdminButPersonal = personalOnly;


  // ── Fetch Requests ──
  const fetchRequests = async () => {
    if (!session?.user?.id) return;
    try {
      setIsLoading(true);
      const endpoint = isAdminOrVolunteer && !isAdminButPersonal
        ? "/api/all-blood-donation-requests"
        : `/api/donation-requests/${session.user.id}`;

      const data = await apiFetch(endpoint);
      setRequests(data);
    } catch (err) {
      console.error("Fetch requests error:", err);
      toast.error("Could not load donation requests.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!sessionLoading) {
      fetchRequests();
    }
  }, [session, sessionLoading, userRole, personalOnly]);

  // ── Counts ──
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

  // ── Initiate status change (Opens modal) ──
  const triggerStatusModal = (req, newStatus) => {
    setStatusConfirmTarget({
      _id: req._id,
      recipientName: req.recipientName,
      newStatus: newStatus,
    });
  };

  // ── Execute confirmed status change ──
  const handleConfirmStatusChange = async () => {
    if (!statusConfirmTarget) return;

    try {
      setIsUpdatingStatus(true);
      await apiFetch(`/api/donation-requests/status/${statusConfirmTarget._id}`, {
        method: "PATCH",
        body: { status: statusConfirmTarget.newStatus },
      });

      setRequests((prev) =>
        prev.map((r) =>
          r._id === statusConfirmTarget._id
            ? { ...r, status: statusConfirmTarget.newStatus }
            : r
        )
      );

      toast.success(`Request marked as ${statusConfirmTarget.newStatus}.`);

      // Close states
      setActiveInlineEditId(null);
      setStatusConfirmTarget(null);
    } catch (err) {
      toast.error("Could not update status: " + err.message);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // ── Full Edit API Handler ──
  const handleSaveEdit = async (id, updatedFields) => {
    await apiFetch(`/api/donation-requests/edit/${id}`, {
      method: "PUT",
      body: updatedFields,
    });

    setRequests((prev) =>
      prev.map((r) => (r._id === id ? { ...r, ...updatedFields } : r))
    );
    toast.success("Request updated.");
  };

  // ── Full Delete API Handler ──
  const handleDelete = async (id) => {
    await apiFetch(`/api/donation-requests/${id}`, { method: "DELETE" });

    setRequests((prev) => prev.filter((r) => r._id !== id));
    toast.success("Request deleted.");
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
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-[6px] p-[12px_16px] border-b border-[#E4E8ED]">
          {["all", "pending", "inprogress", "done", "canceled"].map((tab) => {
            const isActive = activeFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`flex items-center gap-[6px] h-[32px] px-[12px] rounded-[9px] text-[13px] font-[600] capitalize transition-colors ${isActive
                  ? "bg-[#FDF1F2] text-[#C1121F]"
                  : "text-[#5C6675] hover:bg-[#F5F7F9] hover:text-[#10141C]"
                  }`}
              >
                <span>{tab}</span>
                <span
                  className={`text-[11px] font-mono px-[5px] py-[1px] rounded-full ${isActive ? "bg-[#C1121F] text-white" : "bg-[#F5F7F9] text-[#5C6675]"
                    }`}
                >
                  {counts[tab]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Table View */}
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
                filteredRequests.map((req) => {
                  const isInlineEditing = activeInlineEditId === req._id;

                  return (
                    <tr
                      key={req._id}
                      className="border-b border-[#E4E8ED] hover:bg-[#F5F7F9] transition-colors last:border-b-0"
                    >
                      {/* Recipient */}
                      <td className="py-[14px] px-[16px] align-middle">
                        <p className="font-[600] text-[14px] text-[#10141C]">{req.recipientName}</p>
                        <p className="font-mono text-[11px] text-[#5C6675]">
                          {req._id?.slice(-8).toUpperCase()}
                        </p>
                      </td>

                      {/* Location */}
                      <td className="py-[14px] px-[16px] text-[13.5px] text-[#10141C] align-middle">
                        {req.upazilaName ? `${req.upazilaName}, ${req.districtName}` : req.address}
                      </td>

                      {/* Date & Time */}
                      <td className="py-[14px] px-[16px] font-mono text-[12px] text-[#10141C] align-middle">
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

                      {/* ── STATUS COLUMN (WITH PENCIL TOGGLE FOR ALL STATES) ── */}
                      <td className="py-[14px] px-[16px] align-middle">
                        <div className="flex items-center gap-[6px]">
                          {getStatusChip(req.status)}

                          {/* Pencil button to toggle action buttons */}
                          <button
                            type="button"
                            onClick={() =>
                              setActiveInlineEditId(isInlineEditing ? null : req._id)
                            }
                            title="Change status"
                            className={`w-[24px] h-[24px] rounded-full flex items-center justify-center transition-colors ${isInlineEditing
                              ? "bg-[#10141C] text-white"
                              : "text-[#5C6675] hover:text-[#10141C] hover:bg-[#E4E8ED]/60"
                              }`}
                          >
                            <FiEdit2 className="text-[12px]" />
                          </button>
                        </div>

                        {/* Inline toggled action buttons */}
                        {isInlineEditing && (
                          <div className="flex items-center gap-[6px] mt-[8px]">
                            <button
                              type="button"
                              onClick={() => triggerStatusModal(req, "done")}
                              className="inline-flex items-center gap-[4px] h-[28px] px-[9px] rounded-[7px] text-[12px] font-[600] bg-[#FDF1F2] text-[#C1121F] hover:bg-[#FAE3E5] transition-colors cursor-pointer"
                            >
                              <FiCheck className="text-[13px]" /> Done
                            </button>
                            <button
                              type="button"
                              onClick={() => triggerStatusModal(req, "canceled")}
                              className="inline-flex items-center gap-[4px] h-[28px] px-[9px] rounded-[7px] text-[12px] font-[600] bg-white border border-[#E4E8ED] text-[#10141C] hover:bg-[#F5F7F9] hover:border-[#10141C] transition-colors cursor-pointer"
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
                            <p className="font-[600] text-[#10141C]">{req.donorName}</p>
                            <p className="font-mono text-[11px] text-[#5C6675]">{req.donorEmail}</p>
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
                            className="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center text-[#5C6675] hover:text-[#10141C] hover:bg-[#F5F7F9]"
                          >
                            <FiEye className="text-[16px]" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setEditTarget(req)}
                            className="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center text-[#5C6675] hover:text-[#10141C] hover:bg-[#F5F7F9]"
                          >
                            <FiEdit2 className="text-[15px]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(req)}
                            className="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center text-[#C1121F] hover:bg-[#FDF1F2]"
                          >
                            <FiTrash2 className="text-[15px]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
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

      {/* ── Status Confirmation Modal ── */}
      <StatusConfirmModal
        isOpen={Boolean(statusConfirmTarget)}
        onClose={() => setStatusConfirmTarget(null)}
        onConfirm={handleConfirmStatusChange}
        statusTarget={statusConfirmTarget}
        isProcessing={isUpdatingStatus}
      />

      {/* ── Full Details Edit Modal ── */}
      <EditRequestModal
        isOpen={Boolean(editTarget)}
        onClose={() => setEditTarget(null)}
        request={editTarget}
        onSave={handleSaveEdit}
      />

      {/* ── Delete Confirmation Modal ── */}
      <DeleteRequestModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        request={deleteTarget}
        onDelete={handleDelete}
      />
    </div>
  );
}