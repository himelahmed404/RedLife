"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEdit2, FiSave, FiX, FiMail, FiUser,
  FiPhone, FiDroplet, FiMapPin, FiCamera, FiShield, FiSlash
} from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { uploadImage } from "@/lib/uploadImage";
import { districts, districtByName, upazilasOf } from "@/lib/locations";
import toast from "react-hot-toast";
import Image from "next/image";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// Same look for editable and locked fields; `disabled:` styles handle the locked state
const fieldClass =
  "w-full h-[44px] border border-[#E4E8ED] rounded-[11px] px-[13px] text-[14.5px] text-[#10141C] bg-white outline-none transition-all focus:border-[#C1121F] focus:ring-[3px] focus:ring-[#C1121F]/10 disabled:bg-[#F5F7F9] disabled:text-[#5C6675] disabled:cursor-not-allowed";

const labelClass = "flex items-center gap-[8px] text-[12.5px] font-[600] mb-[8px] text-[#5C6675]";

const formFromUser = (user) => ({
  name: user?.name || "",
  email: user?.email || "",
  number: user?.number || "",
  bloodGroup: user?.bloodGroup || "",
  district: user?.district || "",
  upazila: user?.upazila || "",
  avatarUrl: user?.image || "",
});

export default function ProfilePage() {
  const { data: session, isPending, refetch } = authClient.useSession();

  if (isPending || !session?.user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-[30px] h-[30px] border-[3px] border-[#C1121F] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <ProfileForm user={session.user} refetch={refetch} />;
}

function ProfileForm({ user, refetch }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState(() => formFromUser(user));

  // Account status (admin can block a user from the All users page)
  const isBlocked = user.status === "blocked";

  const upazilaOptions = upazilasOf(districtByName(formData.district)?.id);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // A new district invalidates the chosen upazila
      ...(name === "district" && { upazila: "" }),
    }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await uploadImage(file);
      setFormData((prev) => ({ ...prev, avatarUrl: url }));
      toast.success("Avatar uploaded. Save to keep it.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setFormData(formFromUser(user));
    setIsEditing(false);
  };

  // ── Handle Save Profile API Request ──
  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await apiFetch("/api/profile/update-profile", {
        method: "POST",
        body: {
          name: formData.name,
          image: formData.avatarUrl,
          number: formData.number,
          bloodGroup: formData.bloodGroup,
          district: formData.district,
          upazila: formData.upazila,
        },
      });

      // Pull the saved values into the session so the whole app shows them
      await refetch();
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

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
                <Image src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" width={80} height={80} />
              ) : (
                <FiUser className="text-[32px] text-[#A7B0BF]" />
              )}

              {/* Camera Overlay when editing */}
              {isEditing && (
                <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer transition-opacity hover:bg-black/50">
                  {isUploading ? (
                    <span className="w-[20px] h-[20px] border-[2px] border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <FiCamera className="text-white text-[20px]" />
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    disabled={isUploading}
                    onChange={handleAvatarChange}
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-[20px] md:px-[32px] pt-[56px] pb-[32px]">

          {/* Blocked account notice */}
          {isBlocked && (
            <div className="flex items-start gap-[10px] mb-[24px] p-[14px_16px] rounded-[12px] border border-[#F5C2C7] bg-[#FDF1F2] text-[#7A0A12]">
              <FiSlash className="text-[16px] mt-[2px] shrink-0 text-[#C1121F]" />
              <p className="text-[13.5px] leading-[1.5]">
                <b>Your account is blocked.</b> You cannot create donation requests until an admin reactivates your account.
              </p>
            </div>
          )}

          {/* The form is always shown; fields unlock only in edit mode */}
          <form onSubmit={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">

              {/* Name */}
              <div>
                <label htmlFor="name" className={labelClass}>
                  <FiUser className="text-[14px]" /> Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                  className={fieldClass}
                />
              </div>

              {/* Email (never editable) */}
              <div>
                <label htmlFor="email" className={labelClass}>
                  <FiMail className="text-[14px]" /> Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  title="Email cannot be changed"
                  className={fieldClass}
                />
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="number" className={labelClass}>
                  <FiPhone className="text-[14px]" /> Phone Number
                </label>
                <input
                  id="number"
                  name="number"
                  type="tel"
                  value={formData.number}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Not set"
                  className={fieldClass}
                />
              </div>

              {/* Blood Group */}
              <div>
                <label htmlFor="bloodGroup" className={labelClass}>
                  <FiDroplet className="text-[14px]" /> Blood Group
                </label>
                <select
                  id="bloodGroup"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                  className={fieldClass}
                >
                  <option value="">Select group</option>
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              {/* Location (stored by name) */}
              <div>
                <label htmlFor="district" className={labelClass}>
                  <FiMapPin className="text-[14px]" /> District
                </label>
                <select
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                  className={fieldClass}
                >
                  <option value="">Select district</option>
                  {districts.map((dist) => (
                    <option key={dist.id} value={dist.name}>{dist.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="upazila" className={labelClass}>
                  <FiMapPin className="text-[14px]" /> Upazila
                </label>
                <select
                  id="upazila"
                  name="upazila"
                  value={formData.upazila}
                  onChange={handleChange}
                  disabled={!isEditing || !formData.district}
                  required
                  className={fieldClass}
                >
                  <option value="">
                    {formData.district ? "Select upazila" : "Pick a district first"}
                  </option>
                  {upazilaOptions.map((upz) => (
                    <option key={upz.id} value={upz.name}>{upz.name}</option>
                  ))}
                </select>
              </div>

              {/* Account Status (read-only, managed by admin) */}
              <div>
                <label className={labelClass}>
                  <FiShield className="text-[14px]" /> Account Status
                </label>
                {isBlocked ? (
                  <span className="inline-flex items-center gap-[6px] h-[26px] px-[10px] rounded-full font-mono text-[11px] font-[600] uppercase tracking-[0.05em] text-[#C1121F] bg-[#FDF1F2]">
                    <i className="w-[6px] h-[6px] rounded-full bg-current"></i>
                    blocked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-[6px] h-[26px] px-[10px] rounded-full font-mono text-[11px] font-[600] uppercase tracking-[0.05em] text-[#15803D] bg-[#EDF7F0]">
                    <i className="w-[6px] h-[6px] rounded-full bg-current"></i>
                    active
                  </span>
                )}
                {isEditing && (
                  <span className="block text-[12px] text-[#5C6675] mt-[6px]">
                    Only an admin can change your account status.
                  </span>
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
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="inline-flex items-center justify-center font-semibold text-[14px] text-[#5C6675] hover:text-[#10141C] hover:bg-[#F5F7F9] h-[42px] px-[18px] rounded-[11px] transition-colors disabled:opacity-50"
                  >
                    <FiX className="mr-[6px]" /> Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSaving || isUploading}
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
