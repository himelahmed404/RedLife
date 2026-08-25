"use client";

import React from "react";
import { Link } from "@heroui/react";
import { FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";

// ── Blood Group Data Array ──
const DONOR_GROUPS = [
  { group: "A+", donors: "612 donors", region: "Dhaka leads" },
  { group: "A-", donors: "388 donors", region: "Narayanganj leads" },
  { group: "B+", donors: "540 donors", region: "Dhaka leads" },
  { group: "B-", donors: "197 donors", region: "Gazipur leads" },
  { group: "AB+", donors: "214 donors", region: "Dhaka leads" },
  { group: "AB-", donors: "96 donors", region: "Sylhet leads" },
  { group: "O+", donors: "1104 donors", region: "Dhaka leads" },
  { group: "O-", donors: "421 donors", region: "Chattogram leads" },
];

export default function DonorGroups() {
  return (
    <section className="w-full max-w-[1180px] mx-auto px-5 py-[56px]">
      
      {/* Header Row */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap items-end justify-between gap-[16px] mb-[18px]"
      >
        <div>
          <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675] mb-[12px]">
            Donors on call
          </p>
          <h2 className="text-[clamp(23px,3.2vw,33px)] font-bold text-[#10141C] leading-[1.1] tracking-[-0.02em]">
            Pick a group, see who is nearby.
          </h2>
        </div>
        
        <Link
          href="/search"
          className="inline-flex items-center justify-center gap-2 bg-white border border-[#E4E8ED] hover:border-[#10141C] hover:bg-[#F5F7F9] text-[#10141C] font-semibold text-[14px] h-[42px] px-[18px] rounded-[11px] transition-colors"
        >
          Open the search <FiArrowRight className="text-[16px]" />
        </Link>
      </motion.div>

      {/* Grid of Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-[16px]"
      >
        {DONOR_GROUPS.map((item) => (
          <Link
            key={item.group}
            href="/search"
            className="block bg-white border border-[#E4E8ED] hover:border-[#C1121F] rounded-[14px] p-5 w-full transition-colors cursor-pointer"
          >
            {/* Medium Blood Token */}
            <span className="inline-flex flex-col items-center justify-center border-[1.5px] border-[#C1121F] rounded-[9px] bg-white text-[#C1121F] font-mono font-[600] relative overflow-hidden flex-none min-w-[60px] h-[48px] text-[19px] pt-[4px] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[4px] before:bg-[#C1121F]">
              <span>{item.group}</span>
            </span>
            
            <p className="font-mono text-[12px] text-[#5C6675] mt-[12px]">
              {item.donors}
            </p>
            <p className="text-[13.5px] font-[600] text-[#10141C]">
              {item.region}
            </p>
          </Link>
        ))}
      </motion.div>
      
    </section>
  );
}