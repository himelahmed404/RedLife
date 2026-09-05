"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowLeft, FiHeart, FiX } from "react-icons/fi";

// ── Mock Data (Replace with API fetch based on route ID) ──
const requestData = {
  id: "RQ-2418",
  patientName: "Sumaiya Akter",
  status: "pending",
  bloodGroup: "O-",
  hospital: "Dhaka Medical College Hospital",
  address: "Zahir Raihan Rd, Dhaka",
  district: "Dhaka",
  upazila: "Dhanmondi",
  date: "2026-08-23",
  time: "09:30",
  requesterName: "Himel Ahmed",
  requesterEmail: "himel@roktosetu.app",
  reason: "Post-surgery transfusion scheduled for tomorrow morning. Two bags needed.",
};

export default function RequestDetailsPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock logged-in user data for the donation modal
  const currentUser = {
    name: "Himel Ahmed",
    email: "himel@roktosetu.app"
  };

  const handleConfirmDonation = () => {
    setIsModalOpen(false);
    alert("Thank you — the requester has your details.");
    // Add actual API call here
  };

  return (
    <div className="w-full max-w-[1180px] mx-auto px-5 py-[32px] min-h-screen">
      
      {/* ── Back Button ── */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-[13px] font-[600] text-[#5C6675] hover:text-[#10141C] hover:bg-[#F5F7F9] h-[33px] px-[12px] rounded-[9px] transition-colors mb-[16px]"
      >
        <FiArrowLeft className="text-[15px]" /> Back to the board
      </button>

      {/* ── Main Layout Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-[20px]">
        
        {/* ── LEFT COLUMN: Request Details ── */}
        <div className="bg-white border border-[#E4E8ED] rounded-[14px] p-[20px] md:p-[28px]">
          
          {/* Header Section */}
          <div className="flex items-start justify-between gap-[16px]">
            <div>
              <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675]">
                {requestData.id}
              </p>
              <h2 className="text-[clamp(24px,4vw,28px)] font-bold text-[#10141C] leading-[1.1] tracking-[-0.02em] mt-[6px]">
                {requestData.patientName}
              </h2>
              <div className="mt-[12px]">
                <span className="inline-flex items-center gap-[6px] h-[25px] px-[10px] rounded-full font-mono text-[11px] font-[500] tracking-[0.05em] uppercase text-[#B45309] bg-[#FDF4E7]">
                  <i className="w-[6px] h-[6px] rounded-full bg-current"></i>
                  {requestData.status}
                </span>
              </div>
            </div>

            {/* Large Blood Token */}
            <span className="inline-flex flex-col items-center justify-center border-[1.5px] border-[#C1121F] rounded-[9px] bg-white text-[#C1121F] font-mono font-[600] relative overflow-hidden flex-none min-w-[92px] h-[82px] text-[30px] pt-[8px] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[4px] before:bg-[#C1121F]">
              <span>{requestData.bloodGroup}</span>
              <span className="text-[9px] tracking-[0.12em] text-[#5C6675] font-[500] mt-[2px]">NEEDED</span>
            </span>
          </div>

          <hr className="border-0 border-t border-[#E4E8ED] my-[24px]" />

          {/* Details Grid */}
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-[16px] gap-x-[32px]">
            <div>
              <dt className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675]">Recipient</dt>
              <dd className="text-[13.5px] text-[#10141C] mt-[6px]">{requestData.patientName}</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675]">Blood group</dt>
              <dd className="text-[13.5px] text-[#10141C] mt-[6px]">{requestData.bloodGroup}</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675]">Hospital</dt>
              <dd className="text-[13.5px] text-[#10141C] mt-[6px]">{requestData.hospital}</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675]">Address</dt>
              <dd className="text-[13.5px] text-[#10141C] mt-[6px]">{requestData.address}</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675]">District</dt>
              <dd className="text-[13.5px] text-[#10141C] mt-[6px]">{requestData.district}</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675]">Upazila</dt>
              <dd className="text-[13.5px] text-[#10141C] mt-[6px]">{requestData.upazila}</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675]">Donation date</dt>
              <dd className="text-[13.5px] text-[#10141C] mt-[6px]">{requestData.date}</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675]">Donation time</dt>
              <dd className="text-[13.5px] text-[#10141C] mt-[6px]">{requestData.time}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675]">Requester</dt>
              <dd className="text-[13.5px] text-[#10141C] mt-[6px]">{requestData.requesterName} · {requestData.requesterEmail}</dd>
            </div>
          </dl>

          <hr className="border-0 border-t border-[#E4E8ED] my-[24px]" />

          {/* Reason Section */}
          <div>
            <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675] mb-[6px]">
              Why blood is needed
            </p>
            <p className="text-[13.5px] text-[#10141C]">
              {requestData.reason}
            </p>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Sidebar Actions ── */}
        <div className="flex flex-col gap-[16px]">
          
          {/* Action Card */}
          <div className="bg-white border border-[#E4E8ED] rounded-[14px] p-[20px]">
            <h3 className="text-[18px] font-[700] text-[#10141C] leading-[1.1] tracking-[-0.02em]">
              Can you go?
            </h3>
            <p className="text-[13.5px] text-[#5C6675] mt-[12px]">
              Committing shares your name and email with the requester so they can call you. Nothing else is shared.
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-[18px] flex items-center justify-center w-full bg-[#C1121F] hover:bg-[#7A0A12] text-white font-[600] text-[15px] h-[50px] rounded-[11px] transition-colors gap-[8px]"
            >
              <FiHeart className="text-[18px]" /> Donate blood
            </button>
          </div>

          {/* Checklist Card */}
          <div className="bg-[#F5F7F9] border border-[#E4E8ED] rounded-[14px] p-[20px]">
            <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675] mb-[6px]">
              Before you donate
            </p>
            <ul className="text-[13.5px] text-[#5C6675] flex flex-col gap-[4px]">
              <li>· 120 days since your last donation</li>
              <li>· 50 kg minimum weight, age 18–57</li>
              <li>· Eat and drink well beforehand — no empty stomach</li>
              <li>· Bring an ID for hospital records</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── MODAL OVERLAY ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-[18px]">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#10141C]/55 backdrop-blur-[2px]"
            />
            
            {/* Modal Sheet */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative bg-white rounded-[16px] w-full max-w-[480px] max-h-[88vh] overflow-y-auto shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-[20px] py-[16px] border-b border-[#E4E8ED] shrink-0">
                <h3 className="text-[18px] font-[700] text-[#10141C] tracking-[-0.02em]">Confirm your donation</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-[33px] h-[33px] flex items-center justify-center text-[#5C6675] hover:text-[#10141C] hover:bg-[#F5F7F9] rounded-[9px] transition-colors"
                >
                  <FiX className="text-[18px]" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-[20px]">
                <p className="text-[13.5px] text-[#5C6675] mb-[18px]">
                  The request moves to <b className="text-[#10141C]">inprogress</b> and leaves the public board.
                </p>
                
                <div className="flex flex-col gap-[16px]">
                  <div>
                    <label className="block text-[12.5px] font-[600] mb-[6px] text-[#10141C]">Donor name</label>
                    <input 
                      type="text" 
                      value={currentUser.name} 
                      readOnly 
                      className="w-full h-[44px] bg-[#F5F7F9] border border-[#E4E8ED] rounded-[11px] px-[13px] text-[14.5px] text-[#5C6675] outline-none cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-[12.5px] font-[600] mb-[6px] text-[#10141C]">Donor email</label>
                    <input 
                      type="email" 
                      value={currentUser.email} 
                      readOnly 
                      className="w-full h-[44px] bg-[#F5F7F9] border border-[#E4E8ED] rounded-[11px] px-[13px] text-[14.5px] text-[#5C6675] outline-none cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-[8px] px-[20px] py-[16px] bg-[#F5F7F9] border-t border-[#E4E8ED] rounded-b-[16px] shrink-0">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="font-[600] text-[14px] text-[#10141C] bg-white border border-[#E4E8ED] hover:border-[#10141C] hover:bg-[#F5F7F9] h-[42px] px-[18px] rounded-[11px] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmDonation}
                  className="font-[600] text-[14px] text-white bg-[#C1121F] hover:bg-[#7A0A12] h-[42px] px-[18px] rounded-[11px] transition-colors"
                >
                  Confirm donation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}