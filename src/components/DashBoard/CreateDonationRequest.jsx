"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiCheckCircle, FiSlash } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

// ── Imports for Location Data ──
import { districts as districtsData, upazilasOf } from "@/lib/locations";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";


export default function CreateDonationRequest() {
    const router = useRouter();
    const { data: session } = authClient.useSession();

    const [selectedDistrictId, setSelectedDistrictId] = useState("");
    const [selectedUpazilaId, setSelectedUpazilaId] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Only active users can create donation requests
    const isBlocked = session?.user?.status === "blocked";

    const availableUpazilas = upazilasOf(selectedDistrictId);

    const handleDistrictChange = (e) => {
        setSelectedDistrictId(e.target.value);
        setSelectedUpazilaId("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isBlocked) {
            toast.error("Your account is blocked. Blocked users cannot create donation requests.");
            return;
        }
        setIsSubmitting(true);

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        // Look up readable names for database storage
        const districtObj = districtsData.find(d => d.id === selectedDistrictId);
        const upazilaObj = availableUpazilas.find(u => u.id === selectedUpazilaId);

        const payload = {
            ...data,
            districtName: districtObj?.name || "",
            upazilaName: upazilaObj?.name || "",
            requesterName: session?.user?.name,
            requesterEmail: session?.user?.email,
            userId: session?.user?.id,
            donorId: null, // Initially no donor assigned
            status: "pending"
        };

        try {
            await apiFetch("/api/create-donation-request", {
                method: "POST",
                body: payload,
            });

            toast.success("Request posted to the board successfully!");
            router.push("/dashboard/my-donation-requests");
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to post request.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-[880px] mx-auto">

            {/* Page Header */}
            <div className="mb-[24px]">
                <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675] mb-[6px]">
                    New request
                </p>
                <h2 className="text-[clamp(24px,3vw,28px)] font-bold text-[#10141C] leading-[1.1] tracking-[-0.02em]">
                    Tell donors exactly where to go.
                </h2>
            </div>

            {isBlocked ? (
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white border border-[#E4E8ED] rounded-[16px] p-[24px] md:p-[32px] flex flex-col items-center text-center"
                >
                    <span className="w-[48px] h-[48px] rounded-full bg-[#FDF1F2] text-[#C1121F] flex items-center justify-center mb-[14px]">
                        <FiSlash className="text-[22px]" />
                    </span>
                    <span className="inline-flex items-center gap-[6px] h-[25px] px-[10px] rounded-full font-mono text-[11px] font-[600] tracking-[0.05em] uppercase text-[#C1121F] bg-[#FDF1F2] mb-[12px]">
                        <i className="w-[6px] h-[6px] rounded-full bg-current"></i>
                        blocked
                    </span>
                    <h3 className="text-[18px] font-bold text-[#10141C] mb-[6px]">
                        Your account is blocked.
                    </h3>
                    <p className="text-[14px] text-[#5C6675] max-w-[420px]">
                        Blocked users cannot create donation requests. Please contact an admin to get your account reactivated.
                    </p>
                </motion.div>
            ) : (
            <>
            {/* Form Card */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white border border-[#E4E8ED] rounded-[16px] p-[24px] md:p-[32px]"
            >
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-[24px] gap-y-[20px]">

                    {/* ── Requester Info (Read-Only) ── */}
                    <div>
                        <label className="block text-[12.5px] font-[600] mb-[6px] text-[#10141C]">
                            Requester name
                        </label>
                        <input
                            type="text"
                            value={session?.user?.name || "Loading..."}
                            readOnly
                            className="w-full h-[44px] bg-[#F5F7F9] border border-[#E4E8ED] rounded-[11px] px-[13px] text-[14.5px] text-[#5C6675] outline-none cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-[12.5px] font-[600] mb-[6px] text-[#10141C]">
                            Requester email
                        </label>
                        <input
                            type="email"
                            value={session?.user?.email || "Loading..."}
                            readOnly
                            className="w-full h-[44px] bg-[#F5F7F9] border border-[#E4E8ED] rounded-[11px] px-[13px] text-[14.5px] text-[#5C6675] outline-none cursor-not-allowed"
                        />
                    </div>

                    {/* Divider */}
                    <div className="md:col-span-2">
                        <hr className="border-t border-[#E4E8ED] my-[4px]" />
                    </div>

                    {/* ── Recipient & Blood Info ── */}
                    <div>
                        <label className="block text-[12.5px] font-[600] mb-[6px] text-[#10141C]">
                            Recipient name
                        </label>
                        <input
                            name="recipientName"
                            type="text"
                            placeholder="Who is receiving the blood"
                            required
                            className="w-full h-[44px] border border-[#E4E8ED] rounded-[11px] px-[13px] text-[14.5px] text-[#10141C] placeholder-[#A7B0BF] outline-none transition-all focus:border-[#C1121F] focus:ring-[3px] focus:ring-[#C1121F]/10"
                        />
                    </div>

                    <div>
                        <label className="block text-[12.5px] font-[600] mb-[6px] text-[#10141C]">
                            Blood group
                        </label>
                        <select
                            name="bloodGroup"
                            required
                            className="w-full h-[44px] border border-[#E4E8ED] rounded-[11px] px-[13px] text-[14.5px] text-[#10141C] bg-white outline-none transition-all focus:border-[#C1121F] focus:ring-[3px] focus:ring-[#C1121F]/10"
                        >
                            <option value="">Select group</option>
                            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                                <option key={bg} value={bg}>{bg}</option>
                            ))}
                        </select>
                    </div>

                    {/* ── Location Info ── */}
                    <div>
                        <label className="block text-[12.5px] font-[600] mb-[6px] text-[#10141C]">
                            Recipient district
                        </label>
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

                    <div>
                        <label className="block text-[12.5px] font-[600] mb-[6px] text-[#10141C]">
                            Recipient upazila
                        </label>
                        <select
                            name="upazilaId"
                            value={selectedUpazilaId}
                            onChange={(e) => setSelectedUpazilaId(e.target.value)}
                            disabled={!selectedDistrictId}
                            required
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

                    <div>
                        <label className="block text-[12.5px] font-[600] mb-[6px] text-[#10141C]">
                            Hospital name
                        </label>
                        <input
                            name="hospitalName"
                            type="text"
                            placeholder="Dhaka Medical College Hospital"
                            required
                            className="w-full h-[44px] border border-[#E4E8ED] rounded-[11px] px-[13px] text-[14.5px] text-[#10141C] placeholder-[#A7B0BF] outline-none transition-all focus:border-[#C1121F] focus:ring-[3px] focus:ring-[#C1121F]/10"
                        />
                    </div>

                    <div>
                        <label className="block text-[12.5px] font-[600] mb-[6px] text-[#10141C]">
                            Full address
                        </label>
                        <input
                            name="address"
                            type="text"
                            placeholder="Zahir Raihan Rd, Dhaka"
                            required
                            className="w-full h-[44px] border border-[#E4E8ED] rounded-[11px] px-[13px] text-[14.5px] text-[#10141C] placeholder-[#A7B0BF] outline-none transition-all focus:border-[#C1121F] focus:ring-[3px] focus:ring-[#C1121F]/10"
                        />
                        <span className="block text-[12px] text-[#5C6675] mt-[5px]">
                            Street and area, as a driver would need it.
                        </span>
                    </div>

                    {/* ── Schedule Info ── */}
                    <div>
                        <label className="block text-[12.5px] font-[600] mb-[6px] text-[#10141C]">
                            Donation date
                        </label>
                        <input
                            name="donationDate"
                            type="date"
                            required
                            className="w-full h-[44px] border border-[#E4E8ED] rounded-[11px] px-[13px] text-[14.5px] text-[#10141C] placeholder-[#A7B0BF] outline-none transition-all focus:border-[#C1121F] focus:ring-[3px] focus:ring-[#C1121F]/10"
                        />
                    </div>

                    <div>
                        <label className="block text-[12.5px] font-[600] mb-[6px] text-[#10141C]">
                            Donation time
                        </label>
                        <input
                            name="donationTime"
                            type="time"
                            required
                            className="w-full h-[44px] border border-[#E4E8ED] rounded-[11px] px-[13px] text-[14.5px] text-[#10141C] placeholder-[#A7B0BF] outline-none transition-all focus:border-[#C1121F] focus:ring-[3px] focus:ring-[#C1121F]/10"
                        />
                    </div>

                    {/* ── Request Message ── */}
                    <div className="md:col-span-2">
                        <label className="block text-[12.5px] font-[600] mb-[6px] text-[#10141C]">
                            Request message
                        </label>
                        <textarea
                            name="message"
                            rows="4"
                            placeholder="Explain the situation for the donor."
                            required
                            className="w-full min-h-[100px] border border-[#E4E8ED] rounded-[11px] px-[13px] py-[12px] text-[14.5px] text-[#10141C] placeholder-[#A7B0BF] outline-none transition-all focus:border-[#C1121F] focus:ring-[3px] focus:ring-[#C1121F]/10 resize-y"
                        ></textarea>
                        <span className="block text-[12px] text-[#5C6675] mt-[5px]">
                            Why the blood is needed, and how many bags.
                        </span>
                    </div>

                    {/* ── Submit Action ── */}
                    <div className="md:col-span-2 flex flex-col sm:flex-row items-center gap-[16px] mt-[12px]">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full sm:w-auto inline-flex items-center justify-center font-semibold text-[15px] text-white bg-[#C1121F] hover:bg-[#7A0A12] disabled:bg-[#A7B0BF] disabled:cursor-not-allowed h-[50px] px-[26px] rounded-[11px] transition-colors"
                        >
                            {isSubmitting ? "Posting..." : "Request blood"}
                        </button>
                        <span className="flex items-center gap-[6px] font-mono text-[12px] text-[#5C6675]">
                            posts as
                            <span className="inline-flex items-center gap-[6px] h-[25px] px-[10px] rounded-full font-mono text-[11px] font-[500] tracking-[0.05em] uppercase text-[#B45309] bg-[#FDF4E7]">
                                <i className="w-[6px] h-[6px] rounded-full bg-current"></i>
                                pending
                            </span>
                        </span>
                    </div>

                </form>
            </motion.div>
            </>
            )}
        </div>
    );
}