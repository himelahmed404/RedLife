"use client";

import React from "react";
import { Link } from "@heroui/react";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import { motion } from "framer-motion";

export default function ContactHome() {
  return (
    <section className="w-full max-w-[1180px] mx-auto mt-20 px-5 mb-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="rounded-[14px] border border-[#E4E8ED] bg-white overflow-hidden grid grid-cols-1 md:grid-cols-2"
      >
        
        {/* Left Side: Emergency Info (Dark Block) */}
        <div className="bg-[#10141C] text-white p-[32px]">
          <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#69748A] mb-[12px]">
            Contact us
          </p>
          <h2 className="text-[clamp(23px,3.2vw,33px)] font-bold text-white leading-[1.1] tracking-[-0.02em]">
            Need blood in the next few hours?
          </h2>
          <p className="text-[13.5px] mt-[12px] text-[#A7B0BF] leading-relaxed">
            Call the helpline first — a volunteer will post the request for you and start calling matched donors while you are still at the hospital.
          </p>
          
          <div className="flex flex-col gap-[12px] mt-[26px]">
            <Link href="tel:01700000000" className="flex items-center gap-[12px] group">
              <span className="text-[#C1121F] group-hover:text-white transition-colors">
                <FiPhone className="text-[17px]" />
              </span>
              <span className="font-mono text-[#A7B0BF] group-hover:text-white transition-colors">
                01700-000000
              </span>
            </Link>
            
            <div className="flex items-center gap-[12px]">
              <span className="text-[#C1121F]">
                <FiMail className="text-[17px]" />
              </span>
              <span className="font-mono text-[13.5px] text-[#A7B0BF]">
                help@redlife.app
              </span>
            </div>
            
            <div className="flex items-center gap-[12px]">
              <span className="text-[#C1121F]">
                <FiMapPin className="text-[17px]" />
              </span>
              <span className="text-[13.5px] text-[#A7B0BF]">
                Chashara, Narayanganj
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-[32px] bg-white">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              alert("Message sent. We call back within 10 minutes.");
            }} 
            className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]"
          >
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-[12.5px] font-[600] mb-[6px] text-[#10141C]">
                Your name
              </label>
              <input 
                id="name"
                type="text" 
                placeholder="Full name" 
                className="w-full h-[44px] border border-[#E4E8ED] rounded-[11px] px-[13px] text-[14.5px] text-[#10141C] placeholder-[#A7B0BF] outline-none transition-all focus:border-[#C1121F] focus:ring-[3px] focus:ring-[#C1121F]/10"
              />
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-[12.5px] font-[600] mb-[6px] text-[#10141C]">
                Phone
              </label>
              <input 
                id="phone"
                type="tel" 
                placeholder="01XXXXXXXXX" 
                className="w-full h-[44px] border border-[#E4E8ED] rounded-[11px] px-[13px] text-[14.5px] text-[#10141C] placeholder-[#A7B0BF] outline-none transition-all focus:border-[#C1121F] focus:ring-[3px] focus:ring-[#C1121F]/10"
              />
            </div>

            {/* Message Field (Spans full width) */}
            <div className="sm:col-span-2">
              <label htmlFor="message" className="block text-[12.5px] font-[600] mb-[6px] text-[#10141C]">
                How can we help?
              </label>
              <textarea 
                id="message"
                rows="4" 
                placeholder="Which hospital, which blood group, and when it is needed." 
                className="w-full py-[12px] border border-[#E4E8ED] rounded-[11px] px-[13px] text-[14.5px] text-[#10141C] placeholder-[#A7B0BF] outline-none transition-all resize-y focus:border-[#C1121F] focus:ring-[3px] focus:ring-[#C1121F]/10"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="sm:col-span-2 mt-[2px]">
              <button 
                type="submit" 
                className="inline-flex items-center justify-center font-semibold text-[14px] text-white bg-[#C1121F] hover:bg-[#7A0A12] h-[42px] px-[18px] rounded-[11px] transition-colors cursor-pointer"
              >
                Send message
              </button>
            </div>
          </form>
        </div>

      </motion.div>
    </section>
  );
}