"use client";

import React from "react";
import { motion } from "framer-motion";

// ── Timeline Configuration Array ──
const STEPS = [
  {
    id: "1",
    title: "A request is posted",
    status: "pending",
    chipColor: "text-[#B45309] bg-[#FDF4E7]",
    description: "Recipient, hospital, blood group and the hour it is needed. It sits on the public board.",
  },
  {
    id: "2",
    title: "A donor commits",
    status: "inprogress",
    chipColor: "text-[#0E7490] bg-[#EAF7FA]",
    description: "One tap claims it. The requester sees the donor's name and email straight away.",
  },
  {
    id: "3",
    title: "Blood is given",
    status: "done",
    chipColor: "text-[#15803D] bg-[#EDF7F0]",
    description: "The requester marks it done. The 120-day clock starts so nobody is asked twice too soon.",
  },
  {
    id: "4",
    title: "Or it is called off",
    status: "canceled",
    chipColor: "text-[#64748B] bg-[#F1F5F9]",
    description: "Plans change. Cancelling clears the request instead of leaving it stale.",
  },
];

export default function ProcessSteps() {
  return (
    <section className="bg-[#F5F7F9] border-y border-[#E4E8ED] py-[68px]">
      <div className="w-full max-w-[1180px] mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[44px]">
          
          {/* Left Side: Header & Context */}
          <div>
            <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675] mb-[12px]">
              The four states of a request
            </p>
            <h2 className="text-[clamp(23px,3.2vw,33px)] font-bold text-[#10141C] leading-[1.1] tracking-[-0.02em]">
              Everyone sees the same status, at the same time.
            </h2>
            <p className="text-[#5C6675] mt-[18px] max-w-[420px] leading-relaxed">
              No group-chat guesswork about whether someone already went. A request carries exactly one status, visible to the requester, the donor and the volunteer on duty.
            </p>
          </div>

          {/* Right Side: Timeline Steps */}
          <div className="flex flex-col gap-[28px]">
            {STEPS.map((step, index) => (
              <motion.div 
                key={step.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative pl-[34px] before:content-[''] before:absolute before:left-[11px] before:top-[26px] before:bottom-[-22px] before:w-[1px] before:bg-[#E4E8ED] last:before:hidden"
              >
                {/* Timeline Dot */}
                <span className="absolute left-0 top-[2px] w-[23px] h-[23px] rounded-full border-[1.5px] border-[#E4E8ED] bg-white flex items-center justify-center font-mono text-[10px] text-[#5C6675]">
                  {step.id}
                </span>
                
                {/* Step Header (Title + Status Chip) */}
                <div className="flex items-center gap-[8px] mb-[6px]">
                  <h3 className="text-[18px] font-bold text-[#10141C] leading-[1.1]">
                    {step.title}
                  </h3>
                  
                  {/* Status Chip */}
                  <span className={`inline-flex items-center gap-[6px] h-[25px] px-[10px] rounded-full font-mono text-[11px] font-medium tracking-[0.05em] uppercase ${step.chipColor}`}>
                    <i className="w-[6px] h-[6px] rounded-full bg-current"></i>
                    {step.status}
                  </span>
                </div>
                
                {/* Step Description */}
                <p className="text-[13.5px] text-[#5C6675]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
}