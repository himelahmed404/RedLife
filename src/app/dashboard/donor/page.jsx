"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiArrowRight, FiEye, FiEdit2, FiTrash2, FiDroplet } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";

import EditRequestModal from "@/components/DashBoard/EditRequestModal";
import DeleteRequestModal from "@/components/DashBoard/DeleteRequestModal";
import Image from "next/image";

export default function DonorDashboardHome() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const [recentRequests, setRecentRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal handlers
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Fetch only the latest 3 requests for this donor
  const fetchRecentRequests = async () => {
    if (!session?.user?.id) return;
    try {
      setIsLoading(true);
      const res = await fetch(`http://localhost:5000/api/donation-requests/${session.user.id}`);
      if (!res.ok) throw new Error("Failed to fetch requests");
      const data = await res.json();
      // Take only the top 3 latest items
      setRecentRequests(data.slice(0, 3));
    } catch (err) {
      console.error("Error fetching recent requests:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!sessionLoading) {
      fetchRecentRequests();
    }
  }, [session, sessionLoading]);

  // Handle Edit submission
  const handleSaveEdit = async (id, updatedFields) => {
    const res = await fetch(`http://localhost:5000/api/donation-requests/edit/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFields),
    });
    if (!res.ok) throw new Error("Update failed");

    setRecentRequests((prev) =>
      prev.map((r) => (r._id === id ? { ...r, ...updatedFields } : r))
    );
  };

  // Handle Delete
  const handleDelete = async (id) => {
    const res = await fetch(`http://localhost:5000/api/donation-requests/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Delete failed");

    setRecentRequests((prev) => prev.filter((r) => r._id !== id));
  };

  const getInitials = (name) => {
    if (!name) return "D";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
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
    <div className="w-full max-w-[1180px] mx-auto space-y-[24px]">
      
      {/* ── 1. WELCOME & DONOR PROFILE INFO CARD ── */}
      <div className="bg-white border border-[#E4E8ED] rounded-[16px] p-[20px] md:p-[28px] flex flex-wrap items-center justify-between gap-[20px]">
        {/* Left: Avatar + Greeting */}
        <div className="flex items-center gap-[16px]">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt="Profile" width={80} height={80}
              className="w-[50px] h-[50px] rounded-full object-cover shrink-0 border border-[#E4E8ED]"
            />
          ) : (
            <div className="w-[50px] h-[50px] rounded-full bg-[#10141C] text-white flex items-center justify-center font-bold text-[18px] shrink-0">
              {getInitials(session?.user?.name)}
            </div>
          )}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#5C6675] mb-[2px]">
              Welcome back
            </p>
            <h2 className="text-[24px] md:text-[26px] font-bold text-[#10141C] tracking-[-0.02em]">
              {session?.user?.name || "Donor"}
            </h2>
            <p className="text-[13px] text-[#5C6675]">
              {session?.user?.district && session?.user?.upazila
                ? `${session.user.upazila}, ${session.user.district}`
                : "Location not set"}
            </p>
          </div>
        </div>

        {/* Right: Blood Group & Eligibility Status */}
        <div className="flex items-center gap-[16px]">
          <div className="inline-flex flex-col items-center justify-center border-[1.5px] border-[#C1121F] rounded-[9px] bg-white text-[#C1121F] font-mono font-[700] relative overflow-hidden min-w-[60px] h-[48px] text-[19px] pt-[4px] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[4px] before:bg-[#C1121F]">
            {session?.user?.bloodGroup || "—"}
          </div>
          <div>
            <p className="text-[14px] font-[600] text-[#10141C] flex items-center gap-[5px]">
              <span className="w-[7px] h-[7px] rounded-full bg-[#15803D]"></span>
              Eligible to donate
            </p>
            <p className="font-mono text-[12px] text-[#5C6675]">
              Ready for immediate requests
            </p>
          </div>
        </div>
      </div>

      {/* ── 2. RECENT 3 DONATION REQUESTS TABLE ── */}
      <div className="bg-white border border-[#E4E8ED] rounded-[16px] overflow-hidden">
        {/* Table Header Row */}
        <div className="flex items-center justify-between px-[16px] py-[14px] border-b border-[#E4E8ED]">
          <h3 className="text-[17px] font-[700] text-[#10141C]">Your recent requests</h3>
          <Link
            href="/dashboard/donor/my-donation-requests"
            className="inline-flex items-center gap-[6px] h-[33px] px-[12px] rounded-[9px] border border-[#E4E8ED] bg-white text-[#10141C] hover:border-[#10141C] hover:bg-[#F5F7F9] font-[600] text-[13px] transition-colors"
          >
            View my all request <FiArrowRight className="text-[14px]" />
          </Link>
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
                  <td colSpan={7} className="py-[36px] text-center font-mono text-[13px] text-[#5C6675]">
                    Loading recent requests...
                  </td>
                </tr>
              ) : recentRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-[36px] text-center text-[14px] text-[#5C6675]">
                    You have not posted any donation requests yet.
                  </td>
                </tr>
              ) : (
                recentRequests.map((req) => (
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

                    {/* Status Chip */}
                    <td className="py-[14px] px-[16px] align-middle">
                      {getStatusChip(req.status)}
                    </td>

                    {/* Accepted Donor Details */}
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
                        <button
                          onClick={() => setEditTarget(req)}
                          title="Edit"
                          className="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center text-[#5C6675] hover:text-[#10141C] hover:bg-[#F5F7F9]"
                        >
                          <FiEdit2 className="text-[15px]" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(req)}
                          title="Delete"
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
        isAdmin={false}
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