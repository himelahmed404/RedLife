import React from "react";

const STATUS_STYLES = {
  pending: "text-[#B45309] bg-[#FDF4E7]",
  inprogress: "text-[#0E7490] bg-[#EAF7FA]",
  done: "text-[#15803D] bg-[#EDF7F0]",
  canceled: "text-[#64748B] bg-[#F1F5F9]",
};

// `label` lets a page reword a status (e.g. "donated" instead of "done")
export default function StatusChip({ status = "pending", label }) {
  return (
    <span
      className={`inline-flex items-center gap-[6px] h-[24px] px-[10px] rounded-full font-mono text-[11px] font-[600] uppercase tracking-[0.05em] ${STATUS_STYLES[status] || STATUS_STYLES.pending}`}
    >
      <i className="w-[6px] h-[6px] rounded-full bg-current"></i>
      {label || status}
    </span>
  );
}
