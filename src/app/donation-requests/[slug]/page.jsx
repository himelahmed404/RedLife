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
    <div className="w-full max-w-295 mx-auto px-5 py-8 min-h-screen">
      
      {/* ── Back Button ── */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#5C6675] hover:text-[#10141C] hover:bg-[#F5F7F9] h-8.25 px-3 rounded-[9px] transition-colors mb-4"
      >
        <FiArrowLeft className="text-[15px]" /> Back to the board
      </button>

      {/* ── Main Layout Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5">
        
        {/* ── LEFT COLUMN: Request Details ── */}
        <div className="bg-white border border-[#E4E8ED] rounded-[14px] p-5 md:p-7">
          
          {/* Header Section */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675]">
                {requestData.id}
              </p>
              <h2 className="text-[clamp(24px,4vw,28px)] font-bold text-[#10141C] leading-[1.1] tracking-[-0.02em] mt-1.5">
                {requestData.patientName}
              </h2>
              <div className="mt-3">
                <span className="inline-flex items-center gap-1.5 h-6.25 px-2.5 rounded-full font-mono text-[11px] font-medium tracking-wider uppercase text-[#B45309] bg-[#FDF4E7]">
                  <i className="w-1.5 h-1.5 rounded-full bg-current"></i>
                  {requestData.status}
                </span>
              </div>
            </div>

            {/* Large Blood Token */}
            <span className="inline-flex flex-col items-center justify-center border-[1.5px] border-[#C1121F] rounded-[9px] bg-white text-[#C1121F] font-mono font-semibold relative overflow-hidden flex-none min-w-23 h-20.5 text-[30px] pt-2 before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-[#C1121F]">
              <span>{requestData.bloodGroup}</span>
              <span className="text-[9px] tracking-[0.12em] text-[#5C6675] font-medium mt-0.5">NEEDED</span>
            </span>
          </div>

          <hr className="border-0 border-t border-[#E4E8ED] my-6" />

          {/* Details Grid */}
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
            <div>
              <dt className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675]">Recipient</dt>
              <dd className="text-[13.5px] text-[#10141C] mt-1.5">{requestData.patientName}</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675]">Blood group</dt>
              <dd className="text-[13.5px] text-[#10141C] mt-1.5">{requestData.bloodGroup}</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675]">Hospital</dt>
              <dd className="text-[13.5px] text-[#10141C] mt-1.5">{requestData.hospital}</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675]">Address</dt>
              <dd className="text-[13.5px] text-[#10141C] mt-1.5">{requestData.address}</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675]">District</dt>
              <dd className="text-[13.5px] text-[#10141C] mt-1.5">{requestData.district}</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675]">Upazila</dt>
              <dd className="text-[13.5px] text-[#10141C] mt-1.5">{requestData.upazila}</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675]">Donation date</dt>
              <dd className="text-[13.5px] text-[#10141C] mt-1.5">{requestData.date}</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675]">Donation time</dt>
              <dd className="text-[13.5px] text-[#10141C] mt-1.5">{requestData.time}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675]">Requester</dt>
              <dd className="text-[13.5px] text-[#10141C] mt-1.5">{requestData.requesterName} · {requestData.requesterEmail}</dd>
            </div>
          </dl>

          <hr className="border-0 border-t border-[#E4E8ED] my-6" />

          {/* Reason Section */}
          <div>
            <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675] mb-1.5">
              Why blood is needed
            </p>
            <p className="text-[13.5px] text-[#10141C]">
              {requestData.reason}
            </p>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Sidebar Actions ── */}
        <div className="flex flex-col gap-4">
          
          {/* Action Card */}
          <div className="bg-white border border-[#E4E8ED] rounded-[14px] p-5">
            <h3 className="text-[18px] font-bold text-[#10141C] leading-[1.1] tracking-[-0.02em]">
              Can you go?
            </h3>
            <p className="text-[13.5px] text-[#5C6675] mt-3">
              Committing shares your name and email with the requester so they can call you. Nothing else is shared.
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-4.5 flex items-center justify-center w-full bg-[#C1121F] hover:bg-[#7A0A12] text-white font-semibold text-[15px] h-12.5 rounded-[11px] transition-colors gap-2"
            >
              <FiHeart className="text-[18px]" /> Donate blood
            </button>
          </div>

          {/* Checklist Card */}
          <div className="bg-[#F5F7F9] border border-[#E4E8ED] rounded-[14px] p-5">
            <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675] mb-1.5">
              Before you donate
            </p>
            <ul className="text-[13.5px] text-[#5C6675] flex flex-col gap-1">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4.5">
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
              className="relative bg-white rounded-4xl w-full max-w-120 max-h-[88vh] overflow-y-auto shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#E4E8ED] shrink-0">
                <h3 className="text-[18px] font-bold text-[#10141C] tracking-[-0.02em]">Confirm your donation</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-8.25 h-8.25 flex items-center justify-center text-[#5C6675] hover:text-[#10141C] hover:bg-[#F5F7F9] rounded-[9px] transition-colors"
                >
                  <FiX className="text-[18px]" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5">
                <p className="text-[13.5px] text-[#5C6675] mb-4.5">
                  The request moves to <b className="text-[#10141C]">inprogress</b> and leaves the public board.
                </p>
                
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-[12.5px] font-semibold mb-1.5 text-[#10141C]">Donor name</label>
                    <input 
                      type="text" 
                      value={currentUser.name} 
                      readOnly 
                      className="w-full h-11 bg-[#F5F7F9] border border-[#E4E8ED] rounded-[11px] px-3.25 text-[14.5px] text-[#5C6675] outline-none cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-[12.5px] font-semibold mb-1.5 text-[#10141C]">Donor email</label>
                    <input 
                      type="email" 
                      value={currentUser.email} 
                      readOnly 
                      className="w-full h-11 bg-[#F5F7F9] border border-[#E4E8ED] rounded-[11px] px-3.25 text-[14.5px] text-[#5C6675] outline-none cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-2 px-5 py-4 bg-[#F5F7F9] border-t border-[#E4E8ED] rounded-b-4xl shrink-0">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="font-semibold text-[14px] text-[#10141C] bg-white border border-[#E4E8ED] hover:border-[#10141C] hover:bg-[#F5F7F9] h-10.5 px-4.5 rounded-[11px] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmDonation}
                  className="font-semibold text-[14px] text-white bg-[#C1121F] hover:bg-[#7A0A12] h-10.5 px-4.5 rounded-[11px] transition-colors"
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