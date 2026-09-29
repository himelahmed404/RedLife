"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiCreditCard, FiAlertCircle, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Pageshell from "@/components/Pageshell";
import GiveFundModal from "@/components/GiveFundModal";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

const ITEMS_PER_PAGE = 10;

const formatTaka = (value) => `৳ ${Number(value || 0).toLocaleString("en-US")}`;

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";

// YYYY-MM-DD in the viewer's local timezone (createdAt is stored in UTC)
const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString("en-CA") : "");

export default function Funding() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [funds, setFunds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    // Handle the redirect back from Stripe Checkout
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    const canceled = params.get("canceled");

    if (sessionId || canceled) {
      window.history.replaceState(null, "", "/funding");
    }

    const confirmPayment = async () => {
      try {
        const data = await apiFetch("/api/funds/confirm", {
          method: "POST",
          body: { sessionId },
        });
        toast.success(`Thank you! ${formatTaka(data.amount)} added to the fund.`, { id: "fund-confirm" });
      } catch (err) {
        toast.error(err.message, { id: "fund-confirm" });
      }
    };

    const loadFunding = async () => {
      // Record the payment first so it shows up in the list below
      if (sessionId) {
        await confirmPayment();
      } else if (canceled) {
        toast("Payment canceled. No money was taken.", { id: "fund-cancel" });
      }

      try {
        const data = await apiFetch("/api/funds");
        setFunds(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Funding fetch error:", err);
        setError(err.message || "Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    };

    loadFunding();
  }, []);

  const handleGiveFund = () => {
    if (!session?.user) {
      toast.error("Please log in to give fund.");
      router.push("/login");
      return;
    }
    setIsModalOpen(true);
  };

  // ── Stats ──
  const totalRaised = funds.reduce((sum, f) => sum + Number(f.amount || 0), 0);
  const contributors = new Set(funds.map((f) => f.userId || f.email)).size;
  const monthPrefix = formatDate(new Date().toISOString()).slice(0, 7);
  const thisMonth = funds
    .filter((f) => formatDate(f.createdAt).startsWith(monthPrefix))
    .reduce((sum, f) => sum + Number(f.amount || 0), 0);

  const stats = [
    { label: "Total raised", value: formatTaka(totalRaised) },
    { label: "Contributors", value: contributors },
    { label: "This month", value: formatTaka(thisMonth) },
  ];

  // ── Pagination Math ──
  const totalPages = Math.ceil(funds.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentFunds = funds.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <Pageshell>
      <section className="w-full max-w-[1180px] mx-auto px-5 py-[56px] min-h-screen">
        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-[20px] mb-[28px]"
        >
          <div className="max-w-[700px]">
            <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675] mb-[12px]">
              Funding
            </p>
            <h1 className="text-[clamp(23px,3.2vw,33px)] font-[700] text-[#10141C] leading-[1.1] tracking-[-0.02em]">
              Money keeps the calls, tests and bags moving.
            </h1>
            <p className="text-[15px] text-[#5C6675] mt-[12px] leading-relaxed max-w-[500px]">
              Contributions cover screening kits, transport for donors from outer upazilas, and the helpline. Every taka is listed below.
            </p>
          </div>

          <button
            onClick={handleGiveFund}
            className="inline-flex items-center justify-center gap-[8px] h-[50px] px-[28px] bg-[#C1121F] hover:bg-[#A50F1A] text-white rounded-[11px] font-[600] text-[14px] transition-colors shrink-0 self-start md:self-auto"
          >
            <FiCreditCard className="text-[16px]" /> Give fund
          </button>
        </motion.div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-[16px] mb-[26px]">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white border border-[#E4E8ED] rounded-[14px] p-[20px]">
              <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675]">{stat.label}</p>
              {isLoading ? (
                <div className="h-[26px] w-[110px] bg-gray-200 rounded mt-[8px] animate-pulse"></div>
              ) : (
                <p className="text-[24px] font-[700] text-[#10141C] mt-[6px]">{stat.value}</p>
              )}
            </div>
          ))}
        </div>

        {/* ── Error State ── */}
        {!isLoading && error && (
          <div className="border border-red-200 bg-red-50 text-red-700 p-6 rounded-[14px] flex items-center gap-3">
            <FiAlertCircle className="text-xl shrink-0" />
            <p className="text-[14px]">{error}</p>
          </div>
        )}

        {/* ── Contributions Table ── */}
        {!error && (
          <div className="bg-white border border-[#E4E8ED] rounded-[14px] overflow-x-auto">
            <table className="w-full min-w-[620px] text-left">
              <thead>
                <tr className="border-b border-[#E4E8ED] font-mono text-[11px] tracking-[0.1em] uppercase text-[#5C6675]">
                  <th className="font-[500] px-[14px] py-[14px]">Ref</th>
                  <th className="font-[500] px-[14px] py-[14px]">Contributor</th>
                  <th className="font-[500] px-[14px] py-[14px]">Amount</th>
                  <th className="font-[500] px-[14px] py-[14px]">Date</th>
                </tr>
              </thead>
              <tbody>
                {isLoading &&
                  [...Array(5)].map((_, idx) => (
                    <tr key={idx} className="border-b border-[#E4E8ED] last:border-b-0 animate-pulse">
                      <td className="px-[14px] py-[16px]"><div className="h-3 w-12 bg-gray-200 rounded"></div></td>
                      <td className="px-[14px] py-[16px]"><div className="h-4 w-36 bg-gray-200 rounded"></div></td>
                      <td className="px-[14px] py-[16px]"><div className="h-4 w-16 bg-gray-200 rounded"></div></td>
                      <td className="px-[14px] py-[16px]"><div className="h-3 w-20 bg-gray-200 rounded"></div></td>
                    </tr>
                  ))}

                {!isLoading && funds.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-[14px] py-[48px] text-center">
                      <p className="font-[600] text-[16px] text-[#10141C]">No contributions yet</p>
                      <p className="text-[14px] text-[#5C6675] mt-1">Be the first to fund the network.</p>
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  currentFunds.map((fund) => (
                    <tr key={fund._id} className="border-b border-[#E4E8ED] last:border-b-0">
                      <td className="px-[14px] py-[14px] font-mono text-[12px] text-[#5C6675]">{fund.ref}</td>
                      <td className="px-[14px] py-[14px]">
                        <div className="flex items-center gap-[8px]">
                          <span className="w-[30px] h-[30px] rounded-full bg-[#10141C] text-white text-[11px] font-[700] flex items-center justify-center shrink-0">
                            {getInitials(fund.name)}
                          </span>
                          <span className="text-[14px] font-[600] text-[#10141C]">{fund.name}</span>
                        </div>
                      </td>
                      <td className="px-[14px] py-[14px] font-mono text-[13.5px] text-[#10141C]">{formatTaka(fund.amount)}</td>
                      <td className="px-[14px] py-[14px] font-mono text-[13px] text-[#5C6675]">{formatDate(fund.createdAt)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Pagination Controls ── */}
        {!isLoading && !error && totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-4 mt-[24px] font-mono text-[12px] text-[#5C6675]">
            <span>
              Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, funds.length)} of {funds.length} contributions
            </span>

            <div className="flex items-center gap-[6px]">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-[4px] h-[36px] px-[12px] rounded-[9px] border border-[#E4E8ED] bg-white text-[#5C6675] hover:text-[#10141C] hover:border-[#10141C] text-[13px] font-[600] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronLeft className="text-[14px]" /> Prev
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-[4px] h-[36px] px-[12px] rounded-[9px] border border-[#E4E8ED] bg-white text-[#5C6675] hover:text-[#10141C] hover:border-[#10141C] text-[13px] font-[600] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next <FiChevronRight className="text-[14px]" />
              </button>
            </div>
          </div>
        )}
      </section>

      <GiveFundModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={session?.user?.id}
      />
    </Pageshell>
  );
}
