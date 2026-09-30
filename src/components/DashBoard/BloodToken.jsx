import React from "react";

// Blood group "bag tag" used in the request tables
export default function BloodToken({ group }) {
  return (
    <span className="inline-flex flex-col items-center justify-center border-[1.5px] border-[#C1121F] rounded-[8px] bg-white text-[#C1121F] font-mono font-[600] relative overflow-hidden min-w-[42px] h-[32px] text-[13px] pt-[3px] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3.5px] before:bg-[#C1121F]">
      {group || "—"}
    </span>
  );
}
