"use client";

import React, { useState, useEffect } from "react";
import { FiUsers, FiDroplet } from "react-icons/fi";
import { TbCurrencyTaka } from "react-icons/tb";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

import WelcomeCard from "@/components/DashBoard/WelcomeCard";
import RequestsChart from "@/components/DashBoard/RequestsChart";
import StatusChip from "@/components/DashBoard/StatusChip";

const RANGES = [
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
];

const STATUS_ORDER = ["pending", "inprogress", "done", "canceled"];

// 1,284 · 12.9K · 4.2M
const compact = (n) =>
  new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n || 0);

// Dashboard home for admins and volunteers
export default function StaffHome() {
  const { data: session } = authClient.useSession();
  const [range, setRange] = useState("daily");
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let ignore = false;

    apiFetch(`/api/dashboard/stats?range=${range}`)
      .then((data) => {
        if (!ignore) setStats(data);
      })
      .catch((err) => {
        console.error("Stats error:", err);
        toast.error("Could not load dashboard stats.");
      });

    return () => {
      ignore = true;
    };
  }, [range]);

  const tiles = [
    { label: "Total donors", value: compact(stats?.totalDonors), icon: FiUsers, color: "text-[#C1121F] bg-[#FDF1F2]" },
    { label: "Total funding", value: `৳ ${compact(stats?.totalFunding)}`, icon: TbCurrencyTaka, color: "text-[#15803D] bg-[#EDF7F0]" },
    { label: "Total blood donation requests", value: compact(stats?.totalRequests), icon: FiDroplet, color: "text-[#0E7490] bg-[#EAF7FA]" },
  ];

  const statusMax = Math.max(1, ...STATUS_ORDER.map((s) => stats?.statusCounts?.[s] || 0));

  return (
    <div className="w-full max-w-[1180px] mx-auto space-y-[24px]">
      <WelcomeCard user={session?.user} />

      {/* ── Stat tiles ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-[12px]">
        {tiles.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white border border-[#E4E8ED] rounded-[14px] p-[18px] flex items-center gap-[14px]"
          >
            <span className={`w-[44px] h-[44px] rounded-[12px] flex items-center justify-center shrink-0 ${color}`}>
              <Icon className="text-[20px]" />
            </span>
            <div className="min-w-0">
              <p className="text-[26px] font-bold text-[#10141C] leading-none">
                {stats ? value : "—"}
              </p>
              <p className="text-[13px] text-[#5C6675] mt-[6px]">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-[16px] items-start">
        {/* ── Requests over time ── */}
        <div className="bg-white border border-[#E4E8ED] rounded-[14px] p-[18px] min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-[12px] mb-[16px]">
            <div>
              <h3 className="text-[17px] font-[700] text-[#10141C]">Donation requests</h3>
              <p className="text-[13px] text-[#5C6675] mt-[2px]">
                New requests per {range === "daily" ? "day, last 14 days" : range === "weekly" ? "week, last 12 weeks" : "month, last 12 months"}
              </p>
            </div>

            {/* Range toggle */}
            <div className="inline-flex p-[3px] rounded-[10px] bg-[#F5F7F9] border border-[#E4E8ED]" role="group" aria-label="Chart range">
              {RANGES.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setRange(r.key)}
                  aria-pressed={range === r.key}
                  className={`h-[30px] px-[12px] rounded-[8px] text-[13px] font-[600] transition-colors ${range === r.key
                    ? "bg-white text-[#10141C] shadow-[0_1px_2px_rgba(16,20,28,0.08)]"
                    : "text-[#5C6675] hover:text-[#10141C]"
                    }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <RequestsChart series={stats?.series} range={stats?.range || range} />
        </div>

        {/* ── Status breakdown (bar list: each row is labelled, so color carries no identity) ── */}
        <div className="bg-white border border-[#E4E8ED] rounded-[14px] p-[18px]">
          <h3 className="text-[17px] font-[700] text-[#10141C]">By status</h3>
          <p className="text-[13px] text-[#5C6675] mt-[2px] mb-[18px]">All requests right now</p>

          <ul className="flex flex-col gap-[16px]">
            {STATUS_ORDER.map((status) => {
              const count = stats?.statusCounts?.[status] || 0;
              return (
                <li key={status}>
                  <div className="flex items-center justify-between mb-[7px]">
                    <StatusChip status={status} />
                    <span className="text-[14px] font-[600] text-[#10141C]">{stats ? count : "—"}</span>
                  </div>
                  <div className="h-[8px] rounded-full bg-[#F1F3F6] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#5C6675] transition-[width] duration-500"
                      style={{ width: `${(count / statusMax) * 100}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
