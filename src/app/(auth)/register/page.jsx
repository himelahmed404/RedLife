"use client";

import React, { useState } from "react";
import { Link } from "@heroui/react";
import { FiUser, FiUpload } from "react-icons/fi";
import { motion } from "framer-motion";

// ── Imports ──
import rawDistricts from "@/lib/asset/data/districts.json";
import rawUpazilas from "@/lib/asset/data/upazilas.json";
import { authClient } from "@/lib/auth-client"; 

// Extract the actual arrays
const districtsData = rawDistricts[2].data;
const allUpazilasData = rawUpazilas[2].data;

export default function Register() {
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [selectedUpazilaId, setSelectedUpazilaId] = useState("");
  
  // States for Image Upload and Form Submission
  const [avatarUrl, setAvatarUrl] = useState(""); 
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const availableUpazilas = selectedDistrictId 
    ? allUpazilasData.filter(upz => upz.district_id === selectedDistrictId)
    : [];

  const handleDistrictChange = (e) => {
    setSelectedDistrictId(e.target.value);
    setSelectedUpazilaId(""); 
  };

  // ── Image Upload Handler (Runs immediately on file selection) ──
  const handleImageChange = async (e) => {
    const imageFile = e.target.files[0];
    if (!imageFile) return;

    setIsUploadingImage(true);

    const imgBBApiKey = "1848a46100134ec086d5ea2b99d3f3fa";
    const imgBBFormData = new FormData();
    imgBBFormData.append("image", imageFile);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgBBApiKey}`, {
        method: "POST",
        body: imgBBFormData,
      });
      
      const result = await response.json();
      
      if (result.success) {
        setAvatarUrl(result.data.url); // Save the hosted URL to state
      } else {
        alert("Image upload failed. Please try again.");
      }
    } catch (error) {
      console.error("ImgBB Upload Error:", error);
      alert("Network error during image upload.");
    } finally {
      setIsUploadingImage(false); // Stop the loading spinner
    }
  };

  // ── Final Form Submission Handler ──
  const handelSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const Data = new FormData(e.target);
    const FullData = Object.fromEntries(Data.entries());

    // Call better-auth sign up directly using the pre-uploaded avatarUrl
    const { data, error } = await authClient.signUp.email({
      name: FullData.name, 
      email: FullData.email, 
      password: FullData.password, 
      image: avatarUrl, // Uses the URL generated during file selection
      callbackURL: "/",
    });

    if (error) {
      console.error("Sign up failed:", error);
      alert(error.message);
    } else {
      console.log("Sign up successful!", data);
      // Optional: Redirect to dashboard here
    }
    
    setIsSubmitting(false);
  };

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

          <form onSubmit={handelSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-[16px] mt-[26px]">
            {/* Full Name */}
            <div>
              <label className="block text-[12.5px] font-[600] mb-[6px] text-[#10141C]">Full name</label>
              <input 
                name="name" 
                type="text" 
                placeholder="Himel Ahmed" 
                required
                className="w-full h-[44px] border border-[#E4E8ED] rounded-[11px] px-[13px] text-[14.5px] text-[#10141C] placeholder-[#A7B0BF] outline-none transition-all focus:border-[#C1121F] focus:ring-[3px] focus:ring-[#C1121F]/10"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[12.5px] font-[600] mb-[6px] text-[#10141C]">Email</label>
              <input 
                name="email" 
                type="email" 
                placeholder="you@mail.com" 
                required
                className="w-full h-[44px] border border-[#E4E8ED] rounded-[11px] px-[13px] text-[14.5px] text-[#10141C] placeholder-[#A7B0BF] outline-none transition-all focus:border-[#C1121F] focus:ring-[3px] focus:ring-[#C1121F]/10"
              />
            </div>

            {/* Avatar Upload with Live Preview & Spinner */}
            <div className="sm:col-span-2">
              <label className="block text-[12.5px] font-[600] mb-[6px] text-[#10141C]">Avatar</label>
              <div className="flex items-center gap-[12px]">
                
                {/* Preview Box */}
                <div className="flex items-center justify-center w-[44px] h-[44px] rounded-[11px] border border-dashed border-[#E4E8ED] bg-[#F5F7F9] text-[#5C6675] shrink-0 overflow-hidden relative">
                  {isUploadingImage ? (
                    <div className="w-[18px] h-[18px] border-[2px] border-[#C1121F] border-t-transparent rounded-full animate-spin"></div>
                  ) : avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <FiUser className="text-[18px]" />
                  )}
                </div>

                {/* Upload Button */}
                <label className={`inline-flex items-center justify-center gap-2 bg-white border border-[#E4E8ED] hover:border-[#10141C] hover:bg-[#F5F7F9] text-[#10141C] font-semibold text-[13px] h-[33px] px-[12px] rounded-[9px] transition-colors ${isUploadingImage ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
                  <FiUpload className="text-[15px]" /> {avatarUrl ? "Change photo" : "Choose photo"}
                  <input 
                    type="file" 
                    accept="image/jpeg, image/png" 
                    className="hidden" 
                    onChange={handleImageChange}
                    disabled={isUploadingImage}
                  />
                </label>
              </div>
              <span className="block text-[12px] text-[#5C6675] mt-[5px]">
                JPG or PNG, uploaded to imgBB.
              </span>
            </div>

            {/* Blood Group */}
            <div>
              <label className="block text-[12.5px] font-[600] mb-[6px] text-[#10141C]">Blood group</label>
              <select name="bloodGroup" required className="w-full h-[44px] border border-[#E4E8ED] rounded-[11px] px-[13px] text-[14.5px] text-[#10141C] bg-white outline-none transition-all focus:border-[#C1121F] focus:ring-[3px] focus:ring-[#C1121F]/10">
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
                name="districtId" 
                value={selectedDistrictId}
                onChange={handleDistrictChange}
                required
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
              <label className="block text-[12.5px] font-semibold mb-1.5 text-[#10141C]">Upazila</label>
              <select 
                name="upazilaId" 
                value={selectedUpazilaId}
                onChange={(e) => setSelectedUpazilaId(e.target.value)}
                disabled={!selectedDistrictId}
                required
                className="w-full h-11 border border-[#E4E8ED] rounded-[11px] px-[13px] text-[14.5px] text-[#10141C] bg-white outline-none transition-all focus:border-[#C1121F] focus:ring-[3px] focus:ring-[#C1121F]/10 disabled:bg-[#F5F7F9] disabled:text-[#5C6675] disabled:cursor-not-allowed"
              >
                <option value="">
                  {!selectedDistrictId ? "Pick a district first" : "Select upazila"}
                </option>
                {availableUpazilas.map(upz => (
                  <option key={upz.id} value={upz.id}>{upz.name}</option>
                ))}
              </select>
            </div>
            
            <div className="hidden sm:block"></div>

            {/* Password */}
            <div>
              <label className="block text-[12.5px] font-[600] mb-[6px] text-[#10141C]">Password</label>
              <input 
                name="password" 
                type="password" 
                placeholder="At least 6 characters" 
                required
                minLength={6}
                className="w-full h-[44px] border border-[#E4E8ED] rounded-[11px] px-[13px] text-[14.5px] text-[#10141C] placeholder-[#A7B0BF] outline-none transition-all focus:border-[#C1121F] focus:ring-[3px] focus:ring-[#C1121F]/10"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[12.5px] font-[600] mb-[6px] text-[#10141C]">Confirm password</label>
              <input 
                name="confirmPassword" 
                type="password" 
                placeholder="Repeat password" 
                required
                className="w-full h-[44px] border border-[#E4E8ED] rounded-[11px] px-[13px] text-[14.5px] text-[#10141C] placeholder-[#A7B0BF] outline-none transition-all focus:border-[#C1121F] focus:ring-[3px] focus:ring-[#C1121F]/10"
              />
            </div>

            {/* Submit Button */}
            <div className="sm:col-span-2 mt-[26px]">
              <button 
                type="submit" 
                disabled={isSubmitting || isUploadingImage}
                className="flex items-center justify-center w-full font-semibold text-[15.5px] text-white bg-[#C1121F] hover:bg-[#7A0A12] disabled:bg-[#A7B0BF] disabled:cursor-not-allowed h-[50px] px-[18px] rounded-[11px] transition-colors cursor-pointer"
              >
                {isSubmitting ? "Processing..." : "Create my donor account"}
              </button>
            </div>
            
          </form>
        </motion.div>

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