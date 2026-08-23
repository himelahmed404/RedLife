"use client";

import React from "react";
import { Link } from "@heroui/react";
import { FiArrowRight, FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";

// ── Dummy Data for the Ward Board ──
const BOARD_REQUESTS = [
  { id: 1, bloodGroup: "O-", name: "Sumaiya Akter", location: "Dhanmondi, Dhaka · Dhaka Medical College Hospital", date: "needed today", dateColor: "text-[#FF6B76]" },
  { id: 2, bloodGroup: "O+", name: "Shirin Sultana", location: "Kaliakair, Gazipur · Tongi General Hospital", date: "08-25", dateColor: "text-[#8C97A8]" },
  { id: 3, bloodGroup: "A-", name: "Jubayer Alam", location: "Pahartali, Chattogram · Chattogram Medical College", date: "08-26", dateColor: "text-[#8C97A8]" },
  { id: 4, bloodGroup: "B-", name: "Tahmina Begum", location: "Sadar, Sylhet · Sylhet MAG Osmani Hospital", date: "08-27", dateColor: "text-[#8C97A8]" },
];

export default function Hero() {
  return (
    <section className="w-full max-w-[1180px] mx-auto px-5 py-[56px] overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[44px] items-center">
        
        {/* Left Side: Copy & CTAs (Simple Fade-Up) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675] mb-3">
            Bangladesh · 64 districts · 495 upazilas
          </p>
          
          <h1 className="text-[clamp(32px,5vw,56px)] font-[800] leading-[1.03] tracking-[-0.02em] text-[#10141C]">
            The nearest match is almost always a stranger nearby.
          </h1>
          
          <p className="text-[17px] text-[#5C6675] mt-[18px] max-w-[480px]">
            RedLife keeps a register of willing donors sorted by blood group and upazila, so a family in crisis makes one search instead of forty phone calls.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-[26px]">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-[#C1121F] hover:bg-[#7A0A12] text-white font-semibold text-[15.5px] h-[50px] px-[26px] rounded-[11px] transition-colors"
            >
              Join as a donor <FiArrowRight className="text-lg" />
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center justify-center gap-2 bg-white border border-[#E4E8ED] hover:border-[#10141C] hover:bg-[#F5F7F9] text-[#10141C] font-semibold text-[15.5px] h-[50px] px-[26px] rounded-[11px] transition-colors"
            >
              <FiSearch className="text-lg" /> Search donors
            </Link>
          </div>
          
          {/* Stats Row */}
          <div className="flex flex-wrap gap-[40px] mt-[36px]">
            <div>
              <p className="text-[26px] font-[700] tracking-[-0.02em] leading-[1.1] text-[#10141C]">4,182</p>
              <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675] mt-[6px]">registered donors</p>
            </div>
            <div>
              <p className="text-[26px] font-[700] tracking-[-0.02em] leading-[1.1] text-[#10141C]">1,306</p>
              <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675] mt-[6px]">requests fulfilled</p>
            </div>
            <div>
              <p className="text-[26px] font-[700] tracking-[-0.02em] leading-[1.1] text-[#10141C]">৳2.4L</p>
              <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675] mt-[6px]">funded by donors</p>
            </div>
          </div>
        </motion.div>

        {/* Right Side: The Ward Board (Simple Fade-Up with slight delay) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[#10141C] rounded-[16px] p-[6px] text-white"
        >
          {/* Board Header */}
          <div className="flex items-center justify-between px-[14px] pt-[12px] pb-[10px]">
            <div className="flex items-center gap-2">
              <div className="relative flex h-[7px] w-[7px]">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C1121F] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-[7px] w-[7px] bg-[#C1121F]"></span>
              </div>
              <span className="font-mono text-[12px] text-white tracking-[0.1em]">OPEN NOW</span>
            </div>
            <span className="font-mono text-[12px] text-[#69748A]">updated 2 min ago</span>
          </div>

          {/* Board Rows */}
          <div className="flex flex-col">
            {BOARD_REQUESTS.map((req) => (
              <Link
                key={req.id}
                href="/donation-requests"
                className="flex items-center gap-[12px] px-[14px] py-[12px] rounded-[11px] hover:bg-[#1B2230] transition-colors border-t border-white/5 first:border-transparent cursor-pointer"
              >
                <span className="inline-flex flex-col items-center justify-center border-[1.5px] border-white/35 rounded-[9px] bg-transparent text-white font-mono font-[600] relative overflow-hidden flex-none min-w-[44px] h-[34px] text-[14px] pt-[4px] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[4px] before:bg-white/35">
                  <span>{req.bloodGroup}</span>
                </span>
                
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-[600] text-white truncate">{req.name}</p>
                  <p className="font-mono text-[12px] text-[#8C97A8] truncate">{req.location}</p>
                </div>
                
                <span className={`font-mono text-[12px] whitespace-nowrap ${req.dateColor}`}>
                  {req.date}
                </span>
              </Link>
            ))}
          </div>

          {/* Board Footer */}
          <div className="p-[12px]">
            <Link
              href="/donation-requests"
              className="flex items-center justify-center w-full bg-transparent border border-white/20 hover:bg-white/10 text-white font-semibold text-[14px] h-[42px] rounded-[11px] transition-colors"
            >
              See all open requests
            </Link>
          </div>
          
        </motion.div>
      </div>
    </section>
  );
}