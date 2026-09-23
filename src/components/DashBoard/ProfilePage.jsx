"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEdit2, FiSave, FiX, FiMail, FiUser,
  FiPhone, FiDroplet, FiMapPin, FiCamera
} from "react-icons/fi";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    bloodGroup: "",
    avatarUrl: "",
    district: "",
    upazila: ""
  });

  // Populate state once session loads
  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
        number: session.user.number || "Not Found",
        bloodGroup: session.user.bloodGroup || "Not Found",
        district: session.user.district || "Not Found",
        upazila: session.user.upazila || "Not Found",
        avatarUrl: session.user.image || "",
      });
    }
  }, [session]);

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });  
  };

  // Handle Save
  // ── Handle Save Profile API Request ──
  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Send the custom API request to your backend server
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/profile/update-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          name: formData.name,
          email: formData.email,
          image: formData.avatarUrl,
          number: formData.number,
          bloodGroup: formData.bloodGroup,
          district: formData.district,
          upazila: formData.upazila,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Error updating profile:", result.message);
        throw new Error(result.message || "Failed to update profile");
      }

      console.log("Profile updated successfully!");
      setIsEditing(false);
      
      // Optional: Force better-auth to refetch the session so the UI updates immediately
      // await authClient.getSession({ fetchOptions: { force: true } });

    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-[30px] h-[30px] border-[3px] border-[#C1121F] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[880px] mx-auto">

      {/* Header Row */}
      <div className="flex flex-wrap items-end justify-between gap-[16px] mb-6">
        <div>
          <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675] mb-[6px]">
            Settings
          </p>
          <h2 className="text-[clamp(24px,3vw,28px)] font-bold text-[#10141C] leading-[1.1] tracking-[-0.02em]">
            My Profile
          </h2>
        </div>

        {/* Toggle Edit Button (Hidden while editing) */}
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center justify-center gap-[8px] bg-white border border-[#E4E8ED] hover:border-[#10141C] hover:bg-[#F5F7F9] text-[#10141C] font-semibold text-[14px] h-[42px] px-[18px] rounded-[11px] transition-colors"
          >
            <FiEdit2 className="text-[15px]" /> Edit Profile
          </button>
        )}
      </div>

      {/* Main Card */}
      <motion.div
        layout
        className="bg-white border border-[#E4E8ED] rounded-[16px] overflow-hidden"
      >
        {/* Cover Photo Area (Aesthetic touch) */}
        <div className="h-[120px] bg-gradient-to-r from-[#10141C] to-[#2A3446] relative">
          {/* Avatar positioning */}
          <div className="absolute -bottom-[40px] left-[32px]">
            <div className="relative w-[80px] h-[80px] rounded-full border-[4px] border-white bg-[#F5F7F9] flex items-center justify-center overflow-hidden">
              {formData.avatarUrl ? (
                <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <FiUser className="text-[32px] text-[#A7B0BF]" />
              )}

              {/* Camera Overlay when editing */}
              {isEditing && (
                <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer transition-opacity hover:bg-black/50">
                  <FiCamera className="text-white text-[20px]" />
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                    // Add your ImgBB upload logic here if they change it
                    alert("Hook up ImgBB upload here!");
                  }} />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-[32px] pt-[56px] pb-[32px]">
          
          <form onSubmit={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">

              {/* Name */}
              <div>
                <label className="flex items-center gap-[8px] text-[12.5px] font-[600] mb-[8px] text-[#5C6675]">
                  <FiUser className="text-[14px]" /> Full Name
                </label>
                {isEditing ? (
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full h-[44px] border border-[#E4E8ED] rounded-[11px] px-[13px] text-[14.5px] text-[#10141C] outline-none transition-all focus:border-[#C1121F] focus:ring-[3px] focus:ring-[#C1121F]/10"
                  />
                ) : (
                  <p className="text-[15px] font-[600] text-[#10141C]">{formData.name}</p>
                )}
              </div>

              {/* Email (ALWAYS DISABLED) */}
              <div>
                <label className="flex items-center gap-[8px] text-[12.5px] font-[600] mb-[8px] text-[#5C6675]">
                  <FiMail className="text-[14px]" /> Email Address
                </label>
                {isEditing ? (
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full h-[44px] border border-[#E4E8ED] rounded-[11px] px-[13px] text-[14.5px] bg-[#F5F7F9] text-[#A7B0BF] outline-none cursor-not-allowed"
                    title="Email cannot be changed"
                  />
                ) : (
                  <p className="text-[15px] text-[#10141C]">{formData.email}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="flex items-center gap-[8px] text-[12.5px] font-[600] mb-[8px] text-[#5C6675]">
                  <FiPhone className="text-[14px]" /> Phone Number
                </label>
                {isEditing ? (
                  <input
                    name="number"
                    type="tel"
                    value={formData.number}
                    onChange={handleChange}
                    className="w-full h-[44px] border border-[#E4E8ED] rounded-[11px] px-[13px] text-[14.5px] text-[#10141C] outline-none transition-all focus:border-[#C1121F] focus:ring-[3px] focus:ring-[#C1121F]/10"
                  />
                ) : (
                  <p className="text-[15px] text-[#10141C]">{formData.number}</p>
                )}
              </div>

              {/* Blood Group */}
              <div>
                <label className="flex items-center gap-[8px] text-[12.5px] font-[600] mb-[8px] text-[#5C6675]">
                  <FiDroplet className="text-[14px]" /> Blood Group
                </label>
                {isEditing ? (
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full h-[44px] border border-[#E4E8ED] rounded-[11px] px-[13px] text-[14.5px] text-[#10141C] bg-white outline-none transition-all focus:border-[#C1121F] focus:ring-[3px] focus:ring-[#C1121F]/10"
                  >
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                ) : (
                  <span className="inline-flex flex-col items-center justify-center border-[1.5px] border-[#C1121F] rounded-[7px] bg-white text-[#C1121F] font-mono font-[600] relative overflow-hidden h-[28px] px-[10px] text-[13px] pt-[2px] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-[#C1121F]">
                    {formData.bloodGroup}
                  </span>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="flex items-center gap-[8px] text-[12.5px] font-[600] mb-[8px] text-[#5C6675]">
                  <FiMapPin className="text-[14px]" /> District
                </label>
                {isEditing ? (
                  <input
                    name="district"
                    type="text"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full h-[44px] border border-[#E4E8ED] rounded-[11px] px-[13px] text-[14.5px] text-[#10141C] outline-none transition-all focus:border-[#C1121F] focus:ring-[3px] focus:ring-[#C1121F]/10"
                  />
                ) : (
                  <p className="text-[15px] text-[#10141C]">{formData.district}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-[8px] text-[12.5px] font-[600] mb-[8px] text-[#5C6675]">
                  <FiMapPin className="text-[14px]" /> Upazila
                </label>
                {isEditing ? (
                  <input
                    name="upazila"
                    type="text"
                    value={formData.upazila}
                    onChange={handleChange}
                    className="w-full h-[44px] border border-[#E4E8ED] rounded-[11px] px-[13px] text-[14.5px] text-[#10141C] outline-none transition-all focus:border-[#C1121F] focus:ring-[3px] focus:ring-[#C1121F]/10"
                  />
                ) : (
                  <p className="text-[15px] text-[#10141C]">{formData.upazila}</p>
                )}
              </div>


            </div>




            {/* Edit Mode Action Buttons */}
            <AnimatePresence>
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 32 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="flex items-center justify-end gap-[12px] pt-[24px] border-t border-[#E4E8ED] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                    className="inline-flex items-center justify-center font-semibold text-[14px] text-[#5C6675] hover:text-[#10141C] hover:bg-[#F5F7F9] h-[42px] px-[18px] rounded-[11px] transition-colors disabled:opacity-50"
                  >
                    <FiX className="mr-[6px]" /> Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center justify-center font-semibold text-[14px] text-white bg-[#C1121F] hover:bg-[#7A0A12] h-[42px] px-[24px] rounded-[11px] transition-colors disabled:bg-[#A7B0BF] disabled:cursor-not-allowed"
                  >
                    {isSaving ? "Saving..." : <><FiSave className="mr-[8px]" /> Save Changes</>}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </form>
        </div>
      </motion.div>
    </div>
  );
}