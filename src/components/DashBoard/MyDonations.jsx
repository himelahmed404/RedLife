"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiEye, FiDroplet, FiCheckCircle, FiClock } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import StatusChip from "@/components/DashBoard/StatusChip";
import BloodToken from "@/components/DashBoard/BloodToken";
import toast from "react-hot-toast";

export default function MyDonations() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");


  // ── Fetch donations where this user is the donor ──
  useEffect(() => {
    if (sessionLoading || !session?.user?.id) return;

    const fetchDonations = async () => {
      try {
        setIsLoading(true);
        const data = await apiFetch("/api/my-donations");
        setDonations(data);
      } catch (err) {
        console.error("Fetch donations error:", err);
        toast.error("Could not load your donations.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonations();
  }, [session, sessionLoading]);

  // ── Counts ──
  const counts = {
    all: donations.length,
    inprogress: donations.filter((d) => d.status === "inprogress").length,
    done: donations.filter((d) => d.status === "done").length,
    canceled: donations.filter((d) => d.status === "canceled").length,
  };

  const filteredDonations =
    activeFilter === "all"
      ? donations
      : donations.filter((d) => d.status === activeFilter);

  const stats = [
    { label: "Total commitments", value: counts.all, icon: FiDroplet, color: "text-[#C1121F] bg-[#FDF1F2]" },
    { label: "Blood donated", value: counts.done, icon: FiCheckCircle, color: "text-[#15803D] bg-[#EDF7F0]" },
    { label: "In progress", value: counts.inprogress, icon: FiClock, color: "text-[#0E7490] bg-[#EAF7FA]" },
  ];

  return (
    <div className="w-full max-w-[1180px] mx-auto">
      {/* Heading */}
      <div className="mb-[22px]">
        <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675] mb-[6px]">
          My donations
        </p>
        <h2 className="text-[clamp(24px,3vw,30px)] font-bold text-[#10141C] leading-[1.1] tracking-[-0.02em]">
          Blood I have donated
        </h2>
      </div>

      {/* Stat Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-[12px] mb-[18px]">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white border border-[#E4E8ED] rounded-[14px] p-[16px] flex items-center gap-[14px]"
            >
              <span className={`w-[40px] h-[40px] rounded-[11px] flex items-center justify-center shrink-0 ${stat.color}`}>
                <Icon className="text-[18px]" />
              </span>
              <div>
                <p className="text-[24px] font-bold text-[#10141C] leading-none">{stat.value}</p>
                <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#5C6675] mt-[5px]">
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-[#E4E8ED] rounded-[14px] overflow-hidden">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-[6px] p-[12px_16px] border-b border-[#E4E8ED]">
          {[
            { key: "all", label: "all" },
            { key: "inprogress", label: "inprogress" },
            { key: "done", label: "donated" },
            { key: "canceled", label: "canceled" },
          ].map((tab) => {
            const isActive = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`flex items-center gap-[6px] h-[32px] px-[12px] rounded-[9px] text-[13px] font-[600] capitalize transition-colors ${isActive
                  ? "bg-[#FDF1F2] text-[#C1121F]"
                  : "text-[#5C6675] hover:bg-[#F5F7F9] hover:text-[#10141C]"
                  }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[11px] font-mono px-[5px] py-[1px] rounded-full ${isActive ? "bg-[#C1121F] text-white" : "bg-[#F5F7F9] text-[#5C6675]"
                    }`}
                >
                  {counts[tab.key]}
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
                <th className="py-[12px] px-[16px] font-[500]">Hospital</th>
                <th className="py-[12px] px-[16px] font-[500]">Date & Time</th>
                <th className="py-[12px] px-[16px] font-[500]">Group</th>
                <th className="py-[12px] px-[16px] font-[500]">Status</th>
                <th className="py-[12px] px-[16px] font-[500]">Requester</th>
                <th className="py-[12px] px-[16px] font-[500] text-right">View</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-[40px] text-center text-[#5C6675] font-mono text-[13px]">
                    Loading donations...
                  </td>
                </tr>
              ) : filteredDonations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-[40px] text-center text-[#5C6675] text-[14px]">
                    No donations found.{" "}
                    <Link href="/donation-requests" className="text-[#C1121F] font-[600] hover:underline">
                      Browse the donation board
                    </Link>
                  </td>
                </tr>
              ) : (
                filteredDonations.map((donation) => (
                  <tr
                    key={donation._id}
                    className="border-b border-[#E4E8ED] hover:bg-[#F5F7F9] transition-colors last:border-b-0"
                  >
                    {/* Recipient */}
                    <td className="py-[14px] px-[16px] align-middle">
                      <p className="font-[600] text-[14px] text-[#10141C]">{donation.recipientName}</p>
                      <p className="font-mono text-[11px] text-[#5C6675]">
                        {donation._id?.slice(-8).toUpperCase()}
                      </p>
                    </td>

                    {/* Hospital & Location */}
                    <td className="py-[14px] px-[16px] text-[13.5px] text-[#10141C] align-middle">
                      <p className="font-[500]">{donation.hospitalName}</p>
                      <p className="text-[12px] text-[#5C6675]">
                        {donation.upazilaName ? `${donation.upazilaName}, ${donation.districtName}` : donation.address}
                      </p>
                    </td>

                    {/* Date & Time */}
                    <td className="py-[14px] px-[16px] font-mono text-[12px] text-[#10141C] align-middle">
                      {donation.donationDate}
                      <br />
                      <span className="text-[#5C6675]">{donation.donationTime}</span>
                    </td>

                    {/* Blood Group Token */}
                    <td className="py-[14px] px-[16px] align-middle">
                      <BloodToken group={donation.bloodGroup} />
                    </td>

                    {/* Status */}
                    <td className="py-[14px] px-[16px] align-middle">
                      <StatusChip status={donation.status} label={donation.status === "done" ? "donated" : undefined} />
                    </td>

                    {/* Requester */}
                    <td className="py-[14px] px-[16px] text-[13.5px] align-middle">
                      <p className="font-[600] text-[#10141C]">{donation.requesterName}</p>
                      <p className="font-mono text-[11px] text-[#5C6675]">{donation.requesterEmail}</p>
                    </td>

                    {/* View */}
                    <td className="py-[14px] px-[16px] text-right align-middle">
                      <Link
                        href={`/donation-requests/${donation._id}`}
                        className="w-[32px] h-[32px] rounded-[8px] inline-flex items-center justify-center text-[#5C6675] hover:text-[#10141C] hover:bg-[#F5F7F9]"
                      >
                        <FiEye className="text-[16px]" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-[12px_16px] border-t border-[#E4E8ED] font-mono text-[12px] text-[#5C6675]">
          <span>showing {filteredDonations.length} of {donations.length} donations</span>
        </div>
      </div>
    </div>
  );
}
