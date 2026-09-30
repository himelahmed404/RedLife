"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiMapPin, FiCalendar, FiClock, FiEye, FiAlertCircle } from "react-icons/fi";
import { FaRegHospital } from "react-icons/fa";
import Pageshell from "@/components/Pageshell";
import { apiFetch } from "@/lib/api";
import Pagination from "@/components/Pagination";

const ITEMS_PER_PAGE = 9;

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

export default function DonationRequests() {
  const [requests, setRequests] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Public board: the server returns one page of pending requests
  useEffect(() => {
    let ignore = false;

    apiFetch(`/api/pending-donation-requests?page=${currentPage}&limit=${ITEMS_PER_PAGE}`)
      .then((data) => {
        if (ignore) return;
        setRequests(data.items);
        setTotal(data.total);
        setTotalPages(data.totalPages);
        setError(null);
      })
      .catch((err) => {
        console.error("Open Board fetch error:", err);
        if (!ignore) setError(err.message || "Something went wrong.");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [currentPage]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setIsLoading(true);
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  return (
    <Pageshell>
      <section className="w-full max-w-[1180px] mx-auto px-5 py-[56px] min-h-screen">
        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-[44px] max-w-[600px]"
        >
          <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675] mb-[12px]">
            Open Board
          </p>
          <h1 className="text-[clamp(23px,3.2vw,33px)] font-[700] text-[#10141C] leading-[1.1] tracking-[-0.02em]">
            {isLoading ? "Checking active requests..." : `${total} requests are waiting for a donor.`}
          </h1>
          <p className="text-[15px] text-[#5C6675] mt-[12px] leading-relaxed">
            Only pending requests appear here. The moment someone commits, the request leaves the board so two people never show up for the same bag.
          </p>
        </motion.div>

        {/* ── Loading Skeleton ── */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
            {[...Array(6)].map((_, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#E4E8ED] rounded-[14px] p-[20px] animate-pulse space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="h-3 w-16 bg-gray-200 rounded"></div>
                    <div className="h-5 w-32 bg-gray-200 rounded"></div>
                  </div>
                  <div className="w-[44px] h-[34px] bg-gray-200 rounded-[9px]"></div>
                </div>
                <div className="space-y-2 pt-2">
                  <div className="h-4 w-4/5 bg-gray-100 rounded"></div>
                  <div className="h-4 w-3/5 bg-gray-100 rounded"></div>
                  <div className="h-4 w-1/2 bg-gray-100 rounded"></div>
                </div>
                <div className="h-[42px] w-full bg-gray-100 rounded-[11px] mt-4"></div>
              </div>
            ))}
          </div>
        )}

        {/* ── Error State ── */}
        {!isLoading && error && (
          <div className="border border-red-200 bg-red-50 text-red-700 p-6 rounded-[14px] flex items-center gap-3">
            <FiAlertCircle className="text-xl shrink-0" />
            <p className="text-[14px]">{error}</p>
          </div>
        )}

        {/* ── Empty State ── */}
        {!isLoading && !error && requests.length === 0 && (
          <div className="bg-white border border-[#E4E8ED] rounded-[14px] p-[48px] text-center max-w-[500px] mx-auto">
            <p className="font-[600] text-[16px] text-[#10141C]">No pending donation requests</p>
            <p className="text-[14px] text-[#5C6675] mt-1">
              All posted requests have already found donors or been fulfilled. Check back soon.
            </p>
          </div>
        )}

        {/* ── Requests Grid ── */}
        {!isLoading && !error && requests.length > 0 && (
          <>
            <motion.div
              key={currentPage}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]"
            >
              {requests.map((req) => {
                const locationText = req.upazilaName
                  ? `${req.upazilaName}, ${req.districtName}`
                  : req.address || "Location not specified";

                return (
                  <motion.div
                    key={req._id}
                    variants={cardVariants}
                    className="bg-white border border-[#E4E8ED] rounded-[14px] p-[20px] hover:border-[#10141C]/20 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Row: ID, Name & Blood Token */}
                      <div className="flex items-start justify-between mb-[20px]">
                        <div>
                          <p className="font-mono text-[11px] text-[#5C6675] tracking-[0.05em] uppercase">
                            {req._id?.slice(-8).toUpperCase()}
                          </p>
                          <h3 className="text-[17px] font-[700] text-[#10141C] mt-[4px] leading-tight">
                            {req.recipientName}
                          </h3>
                        </div>

                        {/* Blood Group Token */}
                        <span className="inline-flex flex-col items-center justify-center border-[1.5px] border-[#C1121F] rounded-[9px] bg-white text-[#C1121F] font-mono font-[600] relative overflow-hidden shrink-0 min-w-[44px] h-[34px] text-[14px] pt-[4px] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[4px] before:bg-[#C1121F]">
                          <span>{req.bloodGroup}</span>
                        </span>
                      </div>

                      {/* Middle Row: Info List */}
                      <div className="flex flex-col gap-[10px] mb-[20px]">
                        <div className="flex items-center gap-[10px] text-[13.5px] text-[#5C6675]">
                          <FiMapPin className="text-[15px] shrink-0" />
                          <span className="truncate">{locationText}</span>
                        </div>
                        <div className="flex items-center gap-[10px] text-[13.5px] text-[#5C6675]">
                          <FaRegHospital className="text-[15px] shrink-0" />
                          <span className="truncate">{req.hospitalName || "Not specified"}</span>
                        </div>
                        <div className="flex items-center gap-[16px] text-[13.5px] text-[#5C6675]">
                          <div className="flex items-center gap-[8px]">
                            <FiCalendar className="text-[15px] shrink-0" />
                            <span>{req.donationDate}</span>
                          </div>
                          <div className="flex items-center gap-[8px]">
                            <FiClock className="text-[15px] shrink-0" />
                            <span>{req.donationTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row: View Action */}
                    <Link
                      href={`/donation-requests/${req._id}`}
                      className="flex items-center justify-center gap-[8px] w-full h-[42px] bg-[#FDF1F2] hover:bg-[#FAE3E5] text-[#C1121F] rounded-[11px] font-[600] text-[14px] transition-colors cursor-pointer mt-auto"
                    >
                      <FiEye className="text-[16px]" /> View request
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* ── Pagination Controls ── */}
            {totalPages > 1 && (
              <Pagination
                page={currentPage}
                totalPages={totalPages}
                onChange={handlePageChange}
                summary={`Showing ${startIndex + 1}–${Math.min(startIndex + ITEMS_PER_PAGE, total)} of ${total} requests`}
                className="mt-[36px] pt-[20px] border-t border-[#E4E8ED]"
              />
            )}
          </>
        )}
      </section>
    </Pageshell>
  );
}