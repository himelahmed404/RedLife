"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiSearch, FiMapPin, FiMail, FiPhone, FiAlertCircle, FiUserX } from "react-icons/fi";
import Pageshell from "@/components/Pageshell";
import { apiFetch } from "@/lib/api";

// ── Imports for Location Data ──
import { districts as districtsData, upazilasOf } from "@/lib/locations";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const selectClass =
  "w-full h-[44px] border border-[#E4E8ED] rounded-[11px] px-[13px] text-[14.5px] text-[#10141C] bg-white outline-none transition-all focus:border-[#C1121F] focus:ring-[3px] focus:ring-[#C1121F]/10 disabled:bg-[#F5F7F9] disabled:text-[#A7B0BF] disabled:cursor-not-allowed";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function SearchDonors() {
  const [bloodGroup, setBloodGroup] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [selectedUpazilaId, setSelectedUpazilaId] = useState("");

  const [donors, setDonors] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  const availableUpazilas = upazilasOf(selectedDistrictId);

  const handleDistrictChange = (e) => {
    setSelectedDistrictId(e.target.value);
    setSelectedUpazilaId("");
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    // Users store district/upazila by name, so search by name too
    const districtObj = districtsData.find((d) => d.id === selectedDistrictId);
    const upazilaObj = availableUpazilas.find((u) => u.id === selectedUpazilaId);

    const params = new URLSearchParams();
    if (bloodGroup) params.set("bloodGroup", bloodGroup);
    if (districtObj) params.set("district", districtObj.name);
    if (upazilaObj) params.set("upazila", upazilaObj.name);

    try {
      setIsLoading(true);
      setError(null);

      const data = await apiFetch(`/api/donors/search?${params.toString()}`);
      setDonors(Array.isArray(data) ? data : []);
      setHasSearched(true);
    } catch (err) {
      console.error("Donor search error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Pageshell>
      <section className="w-full max-w-[1180px] mx-auto px-5 py-[56px] min-h-screen">
        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-[28px]"
        >
          <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675] mb-[12px]">
            Donor register
          </p>
          <h1 className="text-[clamp(23px,3.2vw,33px)] font-[700] text-[#10141C] leading-[1.1] tracking-[-0.02em]">
            Search by group, then narrow to your upazila.
          </h1>
        </motion.div>

        {/* ── Search Form ── */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white border border-[#E4E8ED] rounded-[16px] p-[20px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px] items-end"
        >
          <div>
            <label className="block text-[12.5px] font-[600] mb-[6px] text-[#10141C]">
              Blood group
            </label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className={selectClass}
            >
              <option value="">Any group</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[12.5px] font-[600] mb-[6px] text-[#10141C]">
              District
            </label>
            <select
              value={selectedDistrictId}
              onChange={handleDistrictChange}
              className={selectClass}
            >
              <option value="">Any district</option>
              {districtsData.map((dist) => (
                <option key={dist.id} value={dist.id}>{dist.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[12.5px] font-[600] mb-[6px] text-[#10141C]">
              Upazila
            </label>
            <select
              value={selectedUpazilaId}
              onChange={(e) => setSelectedUpazilaId(e.target.value)}
              disabled={!selectedDistrictId}
              className={selectClass}
            >
              <option value="">
                {!selectedDistrictId ? "Pick a district first" : "Any upazila"}
              </option>
              {availableUpazilas.map((upz) => (
                <option key={upz.id} value={upz.id}>{upz.name}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-[8px] font-semibold text-[14.5px] text-white bg-[#C1121F] hover:bg-[#7A0A12] disabled:bg-[#A7B0BF] disabled:cursor-not-allowed h-[44px] px-[22px] rounded-[11px] transition-colors cursor-pointer"
          >
            <FiSearch className="text-[16px]" />
            {isLoading ? "Searching..." : "Search donors"}
          </button>
        </motion.form>

        {/* ── Results Area ── */}
        <div className="mt-[28px]">
          {/* Loading Skeleton */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
              {[...Array(6)].map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-[#E4E8ED] rounded-[14px] p-[20px] animate-pulse space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-[44px] h-[44px] bg-gray-200 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                        <div className="h-3 w-20 bg-gray-100 rounded"></div>
                      </div>
                    </div>
                    <div className="w-[44px] h-[34px] bg-gray-200 rounded-[9px]"></div>
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="h-4 w-4/5 bg-gray-100 rounded"></div>
                    <div className="h-4 w-3/5 bg-gray-100 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {!isLoading && error && (
            <div className="border border-red-200 bg-red-50 text-red-700 p-6 rounded-[14px] flex items-center gap-3">
              <FiAlertCircle className="text-xl shrink-0" />
              <p className="text-[14px]">{error}</p>
            </div>
          )}

          {/* Initial State (before any search) */}
          {!isLoading && !error && !hasSearched && (
            <div className="bg-white border border-[#E4E8ED] rounded-[16px] py-[44px] px-[24px] flex flex-col items-center text-center">
              <span className="w-[46px] h-[46px] rounded-[11px] bg-[#FDF1F2] text-[#C1121F] flex items-center justify-center mb-[16px]">
                <FiSearch className="text-[18px]" />
              </span>
              <p className="font-[700] text-[17px] text-[#10141C]">Set your filters to see donors</p>
              <p className="text-[14px] text-[#5C6675] mt-[6px]">
                Nothing is listed until you search — donor contact details are not browsable.
              </p>
            </div>
          )}

          {/* No Results */}
          {!isLoading && !error && hasSearched && donors.length === 0 && (
            <div className="bg-white border border-[#E4E8ED] rounded-[16px] py-[44px] px-[24px] flex flex-col items-center text-center">
              <span className="w-[46px] h-[46px] rounded-[11px] bg-[#F5F7F9] text-[#5C6675] flex items-center justify-center mb-[16px]">
                <FiUserX className="text-[18px]" />
              </span>
              <p className="font-[700] text-[17px] text-[#10141C]">No donors match these filters</p>
              <p className="text-[14px] text-[#5C6675] mt-[6px]">
                Try widening the search — pick &quot;Any upazila&quot; or search the whole district.
              </p>
            </div>
          )}

          {/* Results Grid */}
          {!isLoading && !error && hasSearched && donors.length > 0 && (
            <>
              <p className="font-mono text-[12px] text-[#5C6675] mb-[14px]">
                {donors.length} {donors.length === 1 ? "donor" : "donors"} found
              </p>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]"
              >
                {donors.map((donor) => {
                  const locationText = [donor.upazila, donor.district].filter(Boolean).join(", ") || "Location not set";

                  return (
                    <motion.div
                      key={donor._id}
                      variants={cardVariants}
                      className="bg-white border border-[#E4E8ED] rounded-[14px] p-[20px] hover:border-[#10141C]/20 transition-colors"
                    >
                      {/* Top Row: Avatar, Name & Blood Token */}
                      <div className="flex items-start justify-between gap-3 mb-[18px]">
                        <div className="flex items-center gap-[12px] min-w-0">
                          {donor.image ? (
                            <Image
                              src={donor.image}
                              alt={donor.name || "Donor"}
                              width={100}
                              height={100}
                              className="w-[44px] h-[44px] rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-[44px] h-[44px] rounded-full bg-[#10141C] text-white flex items-center justify-center text-[15px] font-bold shrink-0">
                              {donor.name?.charAt(0) || "?"}
                            </div>
                          )}
                          <div className="min-w-0">
                            <h3 className="text-[16px] font-[700] text-[#10141C] leading-tight truncate">
                              {donor.name}
                            </h3>
                            <p className="flex items-center gap-[6px] text-[13px] text-[#5C6675] mt-[3px]">
                              <FiMapPin className="text-[13px] shrink-0" />
                              <span className="truncate">{locationText}</span>
                            </p>
                          </div>
                        </div>

                        {/* Blood Group Token */}
                        <span className="inline-flex flex-col items-center justify-center border-[1.5px] border-[#C1121F] rounded-[9px] bg-white text-[#C1121F] font-mono font-[600] relative overflow-hidden shrink-0 min-w-[44px] h-[34px] text-[14px] pt-[4px] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[4px] before:bg-[#C1121F]">
                          <span>{donor.bloodGroup}</span>
                        </span>
                      </div>

                      {/* Contact Actions */}
                      <div className="flex flex-col gap-[8px]">
                        {donor.number && (
                          <a
                            href={`tel:${donor.number}`}
                            className="flex items-center justify-center gap-[8px] w-full h-[42px] bg-[#FDF1F2] hover:bg-[#FAE3E5] text-[#C1121F] rounded-[11px] font-[600] text-[14px] transition-colors"
                          >
                            <FiPhone className="text-[15px]" /> {donor.number}
                          </a>
                        )}
                        {donor.email && (
                          <a
                            href={`mailto:${donor.email}`}
                            className="flex items-center justify-center gap-[8px] w-full h-[42px] border border-[#E4E8ED] hover:bg-[#F5F7F9] text-[#10141C] rounded-[11px] font-[600] text-[14px] transition-colors min-w-0"
                          >
                            <FiMail className="text-[15px] shrink-0" />
                            <span className="truncate">{donor.email}</span>
                          </a>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </>
          )}
        </div>
      </section>
    </Pageshell>
  );
}
