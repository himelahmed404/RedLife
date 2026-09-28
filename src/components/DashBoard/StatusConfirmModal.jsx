"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiAlertCircle } from "react-icons/fi";

export default function StatusConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    statusTarget,
    isProcessing,
}) {
    if (!isOpen || !statusTarget) return null;

    const isDone = statusTarget.newStatus === "done";

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-[16px]">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-[#10141C]/55 backdrop-blur-[2px]"
                />

                {/* Modal Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="relative bg-white rounded-[16px] w-full max-w-[420px] shadow-2xl overflow-hidden z-10"
                >
                    <div className="flex items-center justify-between px-[20px] py-[16px] border-b border-[#E4E8ED]">
                        <div className="flex items-center gap-[8px]">
                            <FiAlertCircle
                                className={`text-[18px] ${isDone ? "text-[#15803D]" : "text-[#C1121F]"}`}
                            />
                            <h3 className="text-[16px] font-[700] text-[#10141C]">
                                Confirm Status Change
                            </h3>
                        </div>
                        <button
                            onClick={onClose}
                            disabled={isProcessing}
                            className="text-[#5C6675] hover:text-[#10141C]"
                        >
                            <FiX className="text-[18px]" />
                        </button>
                    </div>

                    <div className="p-[20px]">
                        <p className="text-[13.5px] text-[#5C6675] leading-relaxed">
                            Are you sure you want to mark the request for{" "}
                            <strong className="text-[#10141C]">
                                {statusTarget.recipientName}
                            </strong>{" "}
                            as{" "}
                            <span
                                className={`font-mono font-bold uppercase ${isDone ? "text-[#15803D]" : "text-[#C1121F]"}`}
                            >
                                {statusTarget.newStatus}
                            </span>
                            ?
                        </p>
                    </div>

                    <div className="flex justify-end gap-[8px] px-[20px] py-[14px] bg-[#F5F7F9] border-t border-[#E4E8ED]">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isProcessing}
                            className="h-[38px] px-[16px] rounded-[9px] border border-[#E4E8ED] bg-white font-[600] text-[13.5px] text-[#10141C] hover:bg-[#F5F7F9]"
                        >
                            Keep current
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={isProcessing}
                            className={`h-[38px] px-[18px] rounded-[9px] font-[600] text-[13.5px] text-white transition-colors disabled:opacity-50 ${isDone
                                    ? "bg-[#15803D] hover:bg-[#126530]"
                                    : "bg-[#C1121F] hover:bg-[#7A0A12]"
                                }`}
                        >
                            {isProcessing
                                ? "Updating..."
                                : `Yes, mark as ${statusTarget.newStatus}`}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
