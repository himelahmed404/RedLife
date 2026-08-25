"use client";

import React, { useState } from "react";
import { Link } from "@heroui/react";
import { FiUser, FiUpload } from "react-icons/fi";
import { motion } from "framer-motion";
// ── Import Raw JSON Data ──
import rawDistricts from "@/lib/asset/data/districts.json";
import rawUpazilas from "@/lib/asset/data/upazilas.json";
import { authClient } from "@/lib/auth-client";

const RawData = rawDistricts[2].data;
const districtsData = RawData.sort((a, b) => a.name.localeCompare(b.name));
const allUpazilasData = rawUpazilas[2].data;


export default function Register() {
  // Store the ID instead of the string name for better database handling
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [selectedUpazilaId, setSelectedUpazilaId] = useState("");

  // Dynamically filter the upazilas based on the chosen district ID
  const availableUpazilas = selectedDistrictId 
    ? allUpazilasData.filter(upz => upz.district_id === selectedDistrictId)
    : [];

  const handleDistrictChange = (e) => {
    setSelectedDistrictId(e.target.value);
    setSelectedUpazilaId(""); // Reset upazila when district changes
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    
    const Data = new FormData(e.target);
    const FullData = Object.fromEntries(Data.entries());

    console.log("Form Data Submitted:", FullData);

    const { data, error } = await authClient.signUp.email({
      name: FullData.name, // required
      email: FullData.email, // required
      password: FullData.password, // required
      // image: FullData.image,
      callbackURL: "/",
  });

  if (error) {
    console.error("Error during sign-up:", error);
    alert("Sign-up failed. Please try again.");
  } else {
    console.log("Sign-up successful:", data);
    alert("Sign-up successful! Please check your email to confirm your account.");
  }

  }

  return (
    <section className="w-full max-w-[1180px] mx-auto px-5 py-[56px]">
      <div className="max-w-[560px] mx-auto">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white border border-[#E4E8ED] rounded-[14px] p-[28px]"
        >
          <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675] mb-[12px]">
            RedLife account
          </p>
          <h2 className="text-[clamp(23px,3.2vw,33px)] font-bold text-[#10141C] leading-[1.1] tracking-[-0.02em]">
            Join as a donor
          </h2>
          <p className="text-[13.5px] text-[#5C6675] mt-[6px]">
            Takes a minute. You choose every time whether to say yes.
          </p>

          <form 
            onSubmit={handelSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-[16px] mt-[26px]"
          >
            {/* Full Name */}
            <div>
              <label className="block text-[12.5px] font-[600] mb-[6px] text-[#10141C]">Full name</label>
              <input 
                type="text" 
                placeholder="Himel Ahmed" 
                className="w-full h-[44px] border border-[#E4E8ED] rounded-[11px] px-[13px] text-[14.5px] text-[#10141C] placeholder-[#A7B0BF] outline-none transition-all focus:border-[#C1121F] focus:ring-[3px] focus:ring-[#C1121F]/10"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[12.5px] font-[600] mb-[6px] text-[#10141C]">Email</label>
              <input 
                type="email" 
                placeholder="you@mail.com" 
                className="w-full h-[44px] border border-[#E4E8ED] rounded-[11px] px-[13px] text-[14.5px] text-[#10141C] placeholder-[#A7B0BF] outline-none transition-all focus:border-[#C1121F] focus:ring-[3px] focus:ring-[#C1121F]/10"
              />
            </div>

            {/* Avatar Upload (Full Width) */}
            {/* <div className="sm:col-span-2">
              <label className="block text-[12.5px] font-[600] mb-[6px] text-[#10141C]">Avatar</label>
              <div className="flex items-center gap-[12px]">
                <div className="flex items-center justify-center w-[44px] h-[44px] rounded-[11px] border border-dashed border-[#E4E8ED] bg-[#F5F7F9] text-[#5C6675] shrink-0">
                  <FiUser className="text-[18px]" />
                </div>
                <button 
                  type="button"
                  className="inline-flex items-center justify-center gap-2 bg-white border border-[#E4E8ED] hover:border-[#10141C] hover:bg-[#F5F7F9] text-[#10141C] font-semibold text-[13px] h-[33px] px-[12px] rounded-[9px] transition-colors"
                >
                  <FiUpload className="text-[15px]" /> Choose photo
                </button>
              </div>
              <span className="block text-[12px] text-[#5C6675] mt-[5px]">
                JPG or PNG, uploaded to imgBB.
              </span>
            </div> */}

            {/* Blood Group */}
            <div>
              <label className="block text-[12.5px] font-[600] mb-[6px] text-[#10141C]">Blood group</label>
              <select className="w-full h-[44px] border border-[#E4E8ED] rounded-[11px] px-[13px] text-[14.5px] text-[#10141C] bg-white outline-none transition-all focus:border-[#C1121F] focus:ring-[3px] focus:ring-[#C1121F]/10">
                <option value="">Select group</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            {/* District */}
            <div>
              <label className="block text-[12.5px] font-[600] mb-[6px] text-[#10141C]">District</label>
              <select 
                value={selectedDistrictId}
                onChange={handleDistrictChange}
                className="w-full h-[44px] border border-[#E4E8ED] rounded-[11px] px-[13px] text-[14.5px] text-[#10141C] bg-white outline-none transition-all focus:border-[#C1121F] focus:ring-[3px] focus:ring-[#C1121F]/10"
              >
                <option value="">Select district</option>
                {districtsData.map(dist => (
                  <option key={dist.id} value={dist.id}>{dist.name}</option>
                ))}
              </select>
            </div>

            {/* Upazila */}
            <div>
              <label className="block text-[12.5px] font-[600] mb-[6px] text-[#10141C]">Upazila</label>
              <select 
                value={selectedUpazilaId}
                onChange={(e) => setSelectedUpazilaId(e.target.value)}
                disabled={!selectedDistrictId}
                className="w-full h-[44px] border border-[#E4E8ED] rounded-[11px] px-[13px] text-[14.5px] text-[#10141C] bg-white outline-none transition-all focus:border-[#C1121F] focus:ring-[3px] focus:ring-[#C1121F]/10 disabled:bg-[#F5F7F9] disabled:text-[#5C6675] disabled:cursor-not-allowed"
              >
                <option value="">
                  {!selectedDistrictId ? "Pick a district first" : "Select upazila"}
                </option>
                {availableUpazilas.map(upz => (
                  <option key={upz.id} value={upz.id}>{upz.name}</option>
                ))}
              </select>
            </div>
            
            {/* Empty div to match grid flow from original design */}
            <div className="hidden sm:block"></div>

            {/* Password */}
            <div>
              <label className="block text-[12.5px] font-[600] mb-[6px] text-[#10141C]">Password</label>
              <input 
                type="password" 
                placeholder="At least 6 characters" 
                className="w-full h-[44px] border border-[#E4E8ED] rounded-[11px] px-[13px] text-[14.5px] text-[#10141C] placeholder-[#A7B0BF] outline-none transition-all focus:border-[#C1121F] focus:ring-[3px] focus:ring-[#C1121F]/10"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[12.5px] font-[600] mb-[6px] text-[#10141C]">Confirm password</label>
              <input 
                type="password" 
                placeholder="Repeat password" 
                className="w-full h-[44px] border border-[#E4E8ED] rounded-[11px] px-[13px] text-[14.5px] text-[#10141C] placeholder-[#A7B0BF] outline-none transition-all focus:border-[#C1121F] focus:ring-[3px] focus:ring-[#C1121F]/10"
              />
            </div>

            {/* Submit Button */}
            <div className="sm:col-span-2 mt-[26px]">
              <button 
                type="submit" 
                className="flex items-center justify-center w-full font-semibold text-[15.5px] text-white bg-[#C1121F] hover:bg-[#7A0A12] h-[50px] px-[18px] rounded-[11px] transition-colors cursor-pointer"
              >
                Create my donor account
              </button>
            </div>
            
          </form>
        </motion.div>

        {/* Footer Link */}
        <p className="text-[13.5px] text-[#5C6675] text-center mt-[18px]">
          Already registered?{" "}
          <Link href="/login" className="font-[600] text-[#C1121F] hover:text-[#7A0A12] transition-colors">
            Log in
          </Link>
        </p>

      </div>
    </section>
  );
}