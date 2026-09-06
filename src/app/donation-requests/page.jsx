"use client";

import React from "react";
import { Link } from "@heroui/react";
import { motion } from "framer-motion";
import { FiMapPin, FiCalendar, FiClock, FiEye } from "react-icons/fi";
import { FaRegHospital } from "react-icons/fa";
import Pageshell from "@/components/Pageshell";


const REQUESTS_DATA = [
  {
    id: "RQ-2418",
    patientName: "Sumaiya Akter",
    bloodGroup: "O-",
    location: "Dhanmondi, Dhaka",
    hospital: "Dhaka Medical College Hospital",
    date: "2026-08-23",
    time: "09:30",
  },
  {
    id: "RQ-2410",
    patientName: "Shirin Sultana",
    bloodGroup: "O+",
    location: "Kaliakair, Gazipur",
    hospital: "Tongi General Hospital",
    date: "2026-08-25",
    time: "10:00",
  },
  {
    id: "RQ-2409",
    patientName: "Jubayer Alam",
    bloodGroup: "A-",
    location: "Pahartali, Chattogram",
    hospital: "Chattogram Medical College",
    date: "2026-08-26",
    time: "08:00",
  },
  {
    id: "RQ-2405",
    patientName: "Tahmina Begum",
    bloodGroup: "B-",
    location: "Sadar, Sylhet",
    hospital: "Sylhet MAG Osmani Hospital",
    date: "2026-08-27",
    time: "13:30",
  },
];


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function DonationRequests() {
  return (
    <Pageshell>
      <section className="w-full max-w-[1180px] mx-auto px-5 py-[56px] min-h-screen">

        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-[44px] max-w-[600px]"
        >
          <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675] mb-[12px]">
            Open Board
          </p>
          <h1 className="text-[clamp(23px,3.2vw,33px)] font-[700] text-[#10141C] leading-[1.1] tracking-[-0.02em]">
            {REQUESTS_DATA.length} requests are waiting for a donor.
          </h1>
          <p className="text-[15px] text-[#5C6675] mt-[12px] leading-relaxed">
            Only pending requests appear here. The moment someone commits, the request leaves the board so two people never show up for the same bag.
          </p>
        </motion.div>

        {/* ── Requests Grid ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]"
        >
          {REQUESTS_DATA.map((req) => (
            <motion.div
              key={req.id}
              variants={cardVariants}
              className="bg-white border border-[#E4E8ED] rounded-[14px] p-[20px] hover:border-[#10141C]/20 transition-colors"
            >
              {/* Top Row: ID, Name & Blood Token */}
              <div className="flex items-start justify-between mb-[20px]">
                <div>
                  <p className="font-mono text-[11px] text-[#5C6675] tracking-[0.05em] uppercase">
                    {req.id}
                  </p>
                  <h3 className="text-[17px] font-[700] text-[#10141C] mt-[4px] leading-tight">
                    {req.patientName}
                  </h3>
                </div>

                {/* Blood Token */}
                <span className="inline-flex flex-col items-center justify-center border-[1.5px] border-[#C1121F] rounded-[9px] bg-white text-[#C1121F] font-mono font-[600] relative overflow-hidden flex-none min-w-[44px] h-[34px] text-[14px] pt-[4px] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[4px] before:bg-[#C1121F]">
                  <span>{req.bloodGroup}</span>
                </span>
              </div>

              {/* Middle Row: Info List */}
              <div className="flex flex-col gap-[10px] mb-[20px]">
                <div className="flex items-center gap-[10px] text-[13.5px] text-[#5C6675]">
                  <FiMapPin className="text-[15px] shrink-0" />
                  <span className="truncate">{req.location}</span>
                </div>
                <div className="flex items-center gap-[10px] text-[13.5px] text-[#5C6675]">
                  <FaRegHospital className="text-[15px] shrink-0" />
                  <span className="truncate">{req.hospital}</span>
                </div>
                <div className="flex items-center gap-[16px] text-[13.5px] text-[#5C6675]">
                  <div className="flex items-center gap-[8px]">
                    <FiCalendar className="text-[15px] shrink-0" />
                    <span>{req.date}</span>
                  </div>
                  <div className="flex items-center gap-[8px]">
                    <FiClock className="text-[15px] shrink-0" />
                    <span>{req.time}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Row: View Action */}
              <Link
                href={`/donation-requests/${req.id}`}
                className="flex items-center justify-center gap-[8px] w-full h-[42px] bg-[#FDF1F2] hover:bg-[#FAE3E5] text-[#C1121F] rounded-[11px] font-[600] text-[14px] transition-colors cursor-pointer"
              >
                <FiEye className="text-[16px]" /> View request
              </Link>
            </motion.div>
          ))}
        </motion.div>

      </section>
    </Pageshell>
  );
}