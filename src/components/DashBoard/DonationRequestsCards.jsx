"use client";

import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import toast from "react-hot-toast";

import DonationRequestsTable from "@/components/DashBoard/DonationRequestsTable";

const STATUS_TABS = ["all", "pending", "inprogress", "done", "canceled"];

// scope "mine": /dashboard/my-donation-requests
// scope "all":  /dashboard/all-blood-donation-request (admin + volunteer)
export default function DonationRequestsCards({ scope = "mine", eyebrow, title }) {
  const { data: session } = authClient.useSession();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  const userId = session?.user?.id;
  const endpoint = scope === "all"
    ? "/api/all-blood-donation-requests"
    : `/api/donation-requests/${userId}`;

  // ── Fetch Requests ──
  useEffect(() => {
    if (!userId) return;
    let ignore = false;

    apiFetch(endpoint)
      .then((data) => {
        if (!ignore) setRequests(data);
      })
      .catch((err) => {
        console.error("Fetch requests error:", err);
        toast.error("Could not load donation requests.");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [endpoint, userId]);

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

  return (
    <div className="w-full max-w-[1180px] mx-auto">
      {/* Heading */}
      {title && (
        <div className="mb-[22px]">
          <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675] mb-[6px]">
            {eyebrow}
          </p>
          <h2 className="text-[clamp(24px,3vw,30px)] font-bold text-[#10141C] leading-[1.1] tracking-[-0.02em]">
            {title}
          </h2>
        </div>
      )}

      <div className="bg-white border border-[#E4E8ED] rounded-[14px] overflow-hidden">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-[6px] p-[12px_16px] border-b border-[#E4E8ED]">
          {STATUS_TABS.map((tab) => {
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
        <DonationRequestsTable
          requests={filteredRequests}
          setRequests={setRequests}
          isLoading={isLoading}
          scope={scope}
        />

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
    </div>
  );
}
