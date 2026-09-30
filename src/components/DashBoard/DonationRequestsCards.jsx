"use client";

import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import toast from "react-hot-toast";

import DonationRequestsTable from "@/components/DashBoard/DonationRequestsTable";
import Pagination from "@/components/Pagination";

const STATUS_TABS = ["all", "pending", "inprogress", "done", "canceled"];
const PAGE_SIZE = 8;

const EMPTY_PAGE = { items: [], total: 0, totalPages: 1, counts: {} };

// scope "mine": /dashboard/my-donation-requests
// scope "all":  /dashboard/all-blood-donation-request (admin + volunteer)
export default function DonationRequestsCards({ scope = "mine", eyebrow, title }) {
  const { data: session } = authClient.useSession();
  const [data, setData] = useState(EMPTY_PAGE);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);

  const userId = session?.user?.id;
  const endpoint = scope === "all"
    ? "/api/all-blood-donation-requests"
    : "/api/my-donation-requests";

  // ── Fetch one page (server does the filtering and paging) ──
  useEffect(() => {
    if (!userId) return;
    let ignore = false;

    const params = new URLSearchParams({ page, limit: PAGE_SIZE });
    if (activeFilter !== "all") params.set("status", activeFilter);

    apiFetch(`${endpoint}?${params}`)
      .then((result) => {
        if (ignore) return;
        // A delete can empty the last page; step back instead of showing nothing
        if (result.items.length === 0 && page > result.totalPages) {
          setPage(result.totalPages);
          return;
        }
        setData(result);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Fetch requests error:", err);
        toast.error("Could not load donation requests.");
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [endpoint, userId, activeFilter, page, reloadKey]);

  const changeFilter = (tab) => {
    setActiveFilter(tab);
    setPage(1);
    setIsLoading(true);
  };

  const changePage = (nextPage) => {
    setPage(nextPage);
    setIsLoading(true);
  };

  // The table edits rows in place; this keeps its updates pointed at the current page
  const setItems = (updater) =>
    setData((prev) => ({ ...prev, items: updater(prev.items) }));

  const start = data.total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, data.total);

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
                onClick={() => changeFilter(tab)}
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
                  {data.counts[tab] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Table View */}
        <DonationRequestsTable
          requests={data.items}
          setRequests={setItems}
          onChanged={() => setReloadKey((k) => k + 1)}
          isLoading={isLoading}
          scope={scope}
        />

        {/* Pagination Footer */}
        <Pagination
          page={page}
          totalPages={data.totalPages}
          onChange={changePage}
          summary={`showing ${start}–${end} of ${data.total} requests`}
          className="p-[12px_16px] border-t border-[#E4E8ED]"
        />
      </div>
    </div>
  );
}
