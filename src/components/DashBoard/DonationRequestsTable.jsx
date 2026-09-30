"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiEye, FiEdit2, FiTrash2, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

import StatusChip from "@/components/DashBoard/StatusChip";
import BloodToken from "@/components/DashBoard/BloodToken";
import EditRequestModal from "@/components/DashBoard/EditRequestModal";
import DeleteRequestModal from "@/components/DashBoard/DeleteRequestModal";
import StatusConfirmModal from "@/components/DashBoard/StatusConfirmModal";

// scope "mine": the viewer's own requests, full control.
// scope "all":  every request. Admins get full control, volunteers can only change status.
export default function DonationRequestsTable({
  requests,
  setRequests,
  isLoading,
  scope = "mine",
  emptyMessage = "No requests found.",
}) {
  const { data: session } = authClient.useSession();
  const role = session?.user?.role || "donor";

  const canManage = scope === "mine" || role === "admin";
  const canChangeStatus = canManage || role === "volunteer";

  const [statusTarget, setStatusTarget] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ── Execute confirmed status change ──
  const handleConfirmStatusChange = async () => {
    if (!statusTarget) return;

    try {
      setIsUpdatingStatus(true);
      await apiFetch(`/api/donation-requests/status/${statusTarget._id}`, {
        method: "PATCH",
        body: { status: statusTarget.newStatus },
      });

      setRequests((prev) =>
        prev.map((r) =>
          r._id === statusTarget._id ? { ...r, status: statusTarget.newStatus } : r
        )
      );
      toast.success(`Request marked as ${statusTarget.newStatus}.`);
      setStatusTarget(null);
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

  return (
    <>
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
            ) : requests.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-[40px] text-center text-[#5C6675] text-[14px]">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              requests.map((req) => (
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
                    <BloodToken group={req.bloodGroup} />
                  </td>

                  {/* Status: Done / Cancel only while a donor is on the way */}
                  <td className="py-[14px] px-[16px] align-middle">
                    <StatusChip status={req.status} />

                    {canChangeStatus && req.status === "inprogress" && (
                      <div className="flex items-center gap-[6px] mt-[8px]">
                        <button
                          type="button"
                          onClick={() => setStatusTarget({ ...req, newStatus: "done" })}
                          className="inline-flex items-center gap-[4px] h-[28px] px-[9px] rounded-[7px] text-[12px] font-[600] bg-[#EDF7F0] text-[#15803D] hover:bg-[#DCF0E2] transition-colors cursor-pointer"
                        >
                          <FiCheck className="text-[13px]" /> Done
                        </button>
                        <button
                          type="button"
                          onClick={() => setStatusTarget({ ...req, newStatus: "canceled" })}
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
                        title="View"
                        className="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center text-[#5C6675] hover:text-[#10141C] hover:bg-[#F5F7F9]"
                      >
                        <FiEye className="text-[16px]" />
                      </Link>
                      {canManage && (
                        <>
                          <button
                            type="button"
                            onClick={() => setEditTarget(req)}
                            title="Edit"
                            className="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center text-[#5C6675] hover:text-[#10141C] hover:bg-[#F5F7F9]"
                          >
                            <FiEdit2 className="text-[15px]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(req)}
                            title="Delete"
                            className="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center text-[#C1121F] hover:bg-[#FDF1F2]"
                          >
                            <FiTrash2 className="text-[15px]" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Status Confirmation Modal ── */}
      <StatusConfirmModal
        isOpen={Boolean(statusTarget)}
        onClose={() => setStatusTarget(null)}
        onConfirm={handleConfirmStatusChange}
        statusTarget={statusTarget}
        isProcessing={isUpdatingStatus}
      />

      {/* ── Full Details Edit Modal (keyed so the form resets per request) ── */}
      <EditRequestModal
        key={editTarget?._id || "closed"}
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
    </>
  );
}
