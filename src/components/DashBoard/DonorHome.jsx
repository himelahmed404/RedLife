"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

import WelcomeCard from "@/components/DashBoard/WelcomeCard";
import DonationRequestsTable from "@/components/DashBoard/DonationRequestsTable";

export default function DonorHome() {
  const { data: session } = authClient.useSession();

  const [recentRequests, setRecentRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  const userId = session?.user?.id;

  // Fetch only the latest 3 requests for this donor
  useEffect(() => {
    if (!userId) return;
    let ignore = false;

    apiFetch(`/api/donation-requests/${userId}?limit=3`)
      .then((data) => {
        if (!ignore) setRecentRequests(data.items);
      })
      .catch((err) => console.error("Error fetching recent requests:", err))
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [userId, reloadKey]);

  // The recent section is hidden entirely until the donor has made a request
  const showRecent = isLoading || recentRequests.length > 0;

  return (
    <div className="w-full max-w-[1180px] mx-auto space-y-[24px]">
      <WelcomeCard user={session?.user} />

      {showRecent && (
        <div className="bg-white border border-[#E4E8ED] rounded-[16px] overflow-hidden">
          {/* Table Header Row */}
          <div className="flex items-center justify-between px-[16px] py-[14px] border-b border-[#E4E8ED]">
            <h3 className="text-[17px] font-[700] text-[#10141C]">Your recent requests</h3>
            <Link
              href="/dashboard/my-donation-requests"
              className="inline-flex items-center gap-[6px] h-[33px] px-[12px] rounded-[9px] border border-[#E4E8ED] bg-white text-[#10141C] hover:border-[#10141C] hover:bg-[#F5F7F9] font-[600] text-[13px] transition-colors"
            >
              View my all request <FiArrowRight className="text-[14px]" />
            </Link>
          </div>

          <DonationRequestsTable
            requests={recentRequests}
            setRequests={setRecentRequests}
            onChanged={() => setReloadKey((k) => k + 1)}
            isLoading={isLoading}
            scope="mine"
          />
        </div>
      )}
    </div>
  );
}
