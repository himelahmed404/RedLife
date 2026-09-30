"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowLeft, FiHeart, FiX, FiAlertCircle } from "react-icons/fi";
import Pageshell from "@/components/Pageshell";
import PrivateRoute from "@/components/PrivateRoute";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import StatusChip from "@/components/DashBoard/StatusChip";
import toast from "react-hot-toast";

// Private page: logged-out visitors are sent to /login and brought back here
export default function RequestDetailsPage() {
  return (
    <PrivateRoute>
      <RequestDetails />
    </PrivateRoute>
  );
}

function RequestDetails() {
  const router = useRouter();
  const params = useParams();
  const requestId = params?.slug;

  const { data: session } = authClient.useSession();

  const [requestData, setRequestData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Fetch Single Request ──
  useEffect(() => {
    if (!requestId) return;

    const fetchRequestDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await apiFetch(`/api/donation-requests/detail/${requestId}`);
        setRequestData(data);
      } catch (err) {
        console.error("Details fetch error:", err);
        setError(err.message || "Failed to load request details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequestDetails();
  }, [requestId]);

  // ── Commit Donation Handler ──
  const handleConfirmDonation = async () => {
    try {
      setIsSubmitting(true);

      const payload = {
        status: "inprogress",
        donorName: session.user.name,
        donorEmail: session.user.email,
        donorId: session.user.id,
      };

      await apiFetch(`/api/donation-requests/status/${requestId}`, {
        method: "PATCH",
        body: payload,
      });

      // Update state locally
      setRequestData((prev) => ({
        ...prev,
        ...payload,
      }));

      setIsModalOpen(false);
      toast.success("Thank you! You have committed to this donation. The requester has been notified.");
    } catch (err) {
      toast.error(err.message || "Something went wrong while confirming donation.");
    } finally {
      setIsSubmitting(false);
    }
  };


  const isPending = requestData?.status === "pending";
  const isOwnRequest =
    session?.user?.id &&
    (session.user.id === requestData?.userId || session.user.email === requestData?.requesterEmail);

  return (
    <Pageshell>
      <div className="w-full max-w-[1180px] mx-auto px-5 py-8 min-h-screen">
        {/* ── Back Button ── */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#5C6675] hover:text-[#10141C] hover:bg-[#F5F7F9] h-8 px-3 rounded-[9px] transition-colors mb-6 cursor-pointer"
        >
          <FiArrowLeft className="text-[15px]" /> Back to board
        </button>

        {/* ── Loading Skeleton ── */}
        {isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 animate-pulse">
            <div className="bg-white border border-[#E4E8ED] rounded-[14px] p-7 space-y-6">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-8 w-60 bg-gray-200 rounded"></div>
              <div className="h-40 bg-gray-100 rounded-lg"></div>
            </div>
            <div className="bg-white border border-[#E4E8ED] rounded-[14px] p-6 h-64"></div>
          </div>
        )}

        {/* ── Error State ── */}
        {!isLoading && error && (
          <div className="bg-red-50 border border-red-200 rounded-[14px] p-6 text-red-700 flex items-center gap-3">
            <FiAlertCircle className="text-xl shrink-0" />
            <p className="text-[14px]">{error}</p>
          </div>
        )}

        {/* ── Content View ── */}
        {!isLoading && !error && requestData && (
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5 items-start">
            {/* ── LEFT COLUMN: Request Details ── */}
            <div className="bg-white border border-[#E4E8ED] rounded-[14px] p-5 md:p-7">
              {/* Header Section */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675]">
                    {requestData._id?.slice(-8).toUpperCase()}
                  </p>
                  <h2 className="text-[clamp(24px,4vw,28px)] font-bold text-[#10141C] leading-[1.1] tracking-[-0.02em] mt-1.5">
                    {requestData.recipientName}
                  </h2>
                  <div className="mt-3">
                    <StatusChip status={requestData.status} label={requestData.status === "inprogress" ? "in progress" : undefined} />
                  </div>
                </div>

                {/* Large Blood Token */}
                <span className="inline-flex flex-col items-center justify-center border-[1.5px] border-[#C1121F] rounded-[9px] bg-white text-[#C1121F] font-mono font-semibold relative overflow-hidden shrink-0 min-w-[90px] h-[82px] text-[30px] pt-2 before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-[#C1121F]">
                  <span>{requestData.bloodGroup}</span>
                  <span className="text-[9px] tracking-[0.12em] text-[#5C6675] font-medium mt-0.5">
                    NEEDED
                  </span>
                </span>
              </div>

              <hr className="border-0 border-t border-[#E4E8ED] my-6" />

              {/* Details Grid */}
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                <div>
                  <dt className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675]">Recipient</dt>
                  <dd className="text-[13.5px] text-[#10141C] mt-1.5">{requestData.recipientName}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675]">Blood group</dt>
                  <dd className="text-[13.5px] text-[#10141C] mt-1.5">{requestData.bloodGroup}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675]">Hospital</dt>
                  <dd className="text-[13.5px] text-[#10141C] mt-1.5">{requestData.hospitalName || "Not specified"}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675]">Address</dt>
                  <dd className="text-[13.5px] text-[#10141C] mt-1.5">{requestData.address || "Not specified"}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675]">District</dt>
                  <dd className="text-[13.5px] text-[#10141C] mt-1.5">{requestData.districtName || "—"}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675]">Upazila</dt>
                  <dd className="text-[13.5px] text-[#10141C] mt-1.5">{requestData.upazilaName || "—"}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675]">Donation date</dt>
                  <dd className="text-[13.5px] text-[#10141C] mt-1.5">{requestData.donationDate}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675]">Donation time</dt>
                  <dd className="text-[13.5px] text-[#10141C] mt-1.5">{requestData.donationTime}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675]">Requester</dt>
                  <dd className="text-[13.5px] text-[#10141C] mt-1.5">
                    {requestData.requesterName} · {requestData.requesterEmail}
                  </dd>
                </div>

                {requestData.donorName && (
                  <div className="sm:col-span-2 p-3.5 bg-[#F5F7F9] border border-[#E4E8ED] rounded-[10px] mt-2">
                    <dt className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#0E7490]">
                      Committed Donor
                    </dt>
                    <dd className="text-[13.5px] text-[#10141C] mt-1 font-semibold">
                      {requestData.donorName} ({requestData.donorEmail})
                    </dd>
                  </div>
                )}
              </dl>

              <hr className="border-0 border-t border-[#E4E8ED] my-6" />

              {/* Message / Reason Section */}
              <div>
                <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675] mb-1.5">
                  Why blood is needed
                </p>
                <p className="text-[13.5px] text-[#10141C] leading-relaxed">
                  {requestData.message || "No additional notes provided by the requester."}
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

                {isPending && !isOwnRequest && (
                  <>
                    {/* A mismatch is a heads-up, not a block: the hospital does the final cross-match */}
                    {session?.user?.bloodGroup && session.user.bloodGroup !== requestData.bloodGroup && (
                      <div className="mt-3 p-3 rounded-[9px] bg-[#FDF4E7] border border-[#F5DDB8] text-[13px] text-[#B45309]">
                        Your profile blood group ({session.user.bloodGroup}) is different from the requested group ({requestData.bloodGroup}). Only commit if you know you are a compatible donor.
                      </div>
                    )}
                    <p className="text-[13.5px] text-[#5C6675] mt-3">
                      Committing shares your name and email with the requester so they can contact you directly.
                    </p>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="mt-4 flex items-center justify-center w-full bg-[#C1121F] hover:bg-[#7A0A12] text-white font-semibold text-[15px] h-12 rounded-[11px] transition-colors gap-2 cursor-pointer"
                    >
                      <FiHeart className="text-[18px]" /> Donate blood
                    </button>
                  </>
                )}

                {isPending && isOwnRequest && (
                  <p className="text-[13px] text-[#5C6675] mt-3 bg-[#F5F7F9] p-3 rounded-[9px]">
                    You created this donation request. Wait for a donor to commit or manage it via your dashboard.
                  </p>
                )}

                {!isPending && (
                  <div className="mt-3 p-3 rounded-[9px] bg-[#F5F7F9] text-[13px] text-[#5C6675]">
                    This request is currently marked as <b className="text-[#10141C] capitalize">{requestData.status}</b> and is no longer open for commitments.
                  </div>
                )}
              </div>

              {/* Guidelines Card */}
              <div className="bg-[#F5F7F9] border border-[#E4E8ED] rounded-[14px] p-5">
                <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675] mb-2">
                  Before you donate
                </p>
                <ul className="text-[13.5px] text-[#5C6675] flex flex-col gap-1.5">
                  <li>· 120 days since your last donation</li>
                  <li>· 50 kg minimum weight, age 18–57</li>
                  <li>· Eat and drink well beforehand</li>
                  <li>· Bring official government or student ID</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ── MODAL OVERLAY ── */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => !isSubmitting && setIsModalOpen(false)}
                className="absolute inset-0 bg-[#10141C]/55 backdrop-blur-[2px]"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="relative bg-white rounded-[16px] w-full max-w-[460px] shadow-2xl flex flex-col overflow-hidden"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#E4E8ED] shrink-0">
                  <h3 className="text-[18px] font-bold text-[#10141C] tracking-[-0.02em]">
                    Confirm your donation
                  </h3>
                  <button
                    disabled={isSubmitting}
                    onClick={() => setIsModalOpen(false)}
                    className="w-8 h-8 flex items-center justify-center text-[#5C6675] hover:text-[#10141C] hover:bg-[#F5F7F9] rounded-[9px] transition-colors"
                  >
                    <FiX className="text-[18px]" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-5">
                  <p className="text-[13.5px] text-[#5C6675] mb-4">
                    The request will move to <b className="text-[#10141C]">inprogress</b> and leave the public board so other donors don&apos;t overlap.
                  </p>

                  <div className="flex flex-col gap-3.5">
                    <div>
                      <label className="block text-[12.5px] font-semibold mb-1.5 text-[#10141C]">
                        Donor name
                      </label>
                      <input
                        type="text"
                        value={session?.user?.name || ""}
                        readOnly
                        className="w-full h-10 bg-[#F5F7F9] border border-[#E4E8ED] rounded-[10px] px-3 text-[14px] text-[#5C6675] outline-none cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-[12.5px] font-semibold mb-1.5 text-[#10141C]">
                        Donor email
                      </label>
                      <input
                        type="email"
                        value={session?.user?.email || ""}
                        readOnly
                        className="w-full h-10 bg-[#F5F7F9] border border-[#E4E8ED] rounded-[10px] px-3 text-[14px] text-[#5C6675] outline-none cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-2 px-5 py-4 bg-[#F5F7F9] border-t border-[#E4E8ED] shrink-0">
                  <button
                    disabled={isSubmitting}
                    onClick={() => setIsModalOpen(false)}
                    className="font-semibold text-[13.5px] text-[#10141C] bg-white border border-[#E4E8ED] hover:border-[#10141C] hover:bg-[#F5F7F9] h-10 px-4 rounded-[10px] transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isSubmitting}
                    onClick={handleConfirmDonation}
                    className="font-semibold text-[13.5px] text-white bg-[#C1121F] hover:bg-[#7A0A12] h-10 px-4 rounded-[10px] transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? "Confirming..." : "Confirm donation"}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </Pageshell>
  );
}