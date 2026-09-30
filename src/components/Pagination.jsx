import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Page numbers to show: first, last, and two either side of the current page
const pageWindow = (page, totalPages) => {
  const pages = [];
  for (let n = 1; n <= totalPages; n++) {
    if (n === 1 || n === totalPages || Math.abs(n - page) <= 2) {
      pages.push(n);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }
  return pages;
};

const navButtonClass =
  "inline-flex items-center gap-[4px] h-[36px] px-[12px] rounded-[9px] border border-[#E4E8ED] bg-white text-[#5C6675] hover:text-[#10141C] hover:border-[#10141C] text-[13px] font-[600] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#E4E8ED] disabled:hover:text-[#5C6675] transition-colors";

export default function Pagination({ page, totalPages, onChange, summary, className = "" }) {
  return (
    <div className={`flex flex-wrap items-center justify-between gap-4 font-mono text-[12px] text-[#5C6675] ${className}`}>
      <span>{summary}</span>

      <div className="flex items-center gap-[6px]">
        <button
          type="button"
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className={navButtonClass}
        >
          <FiChevronLeft className="text-[14px]" /> Prev
        </button>

        <div className="hidden sm:flex items-center gap-[4px]">
          {pageWindow(page, totalPages).map((n, i) =>
            n === "…" ? (
              <span key={`gap-${i}`} className="w-[24px] text-center">…</span>
            ) : (
              <button
                key={n}
                type="button"
                onClick={() => onChange(n)}
                aria-current={n === page ? "page" : undefined}
                className={`w-[36px] h-[36px] rounded-[9px] text-[13px] font-[600] transition-colors ${n === page
                  ? "bg-[#C1121F] text-white"
                  : "border border-[#E4E8ED] bg-white text-[#5C6675] hover:text-[#10141C] hover:bg-[#F5F7F9]"
                  }`}
              >
                {n}
              </button>
            )
          )}
        </div>

        {/* Phones: compact "2 / 5" instead of the number row */}
        <span className="sm:hidden px-[6px]">{page} / {totalPages}</span>

        <button
          type="button"
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
          className={navButtonClass}
        >
          Next <FiChevronRight className="text-[14px]" />
        </button>
      </div>
    </div>
  );
}
