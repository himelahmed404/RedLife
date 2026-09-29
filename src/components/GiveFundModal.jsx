"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FiX, FiCreditCard } from "react-icons/fi";
import { apiFetch } from "@/lib/api";

const PRESET_AMOUNTS = [300, 500, 1000, 2500];
const MIN_AMOUNT = 100;
const MAX_AMOUNT = 500000;

export default function GiveFundModal({ isOpen, onClose, userId }) {
    const [amount, setAmount] = useState("500");
    const [isProcessing, setIsProcessing] = useState(false);


    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const value = Number(amount);

        if (!Number.isInteger(value) || value < MIN_AMOUNT || value > MAX_AMOUNT) {
            toast.error(`Enter a whole amount between ৳${MIN_AMOUNT} and ৳${MAX_AMOUNT.toLocaleString("en-US")}.`);
            return;
        }

        try {
            setIsProcessing(true);
            const data = await apiFetch("/api/funds/create-checkout-session", {
                method: "POST",
                body: { userId, amount: value },
            });
            if (!data?.url) {
                throw new Error("Could not start payment.");
            }
            // Hand off to Stripe's hosted payment page
            window.location.href = data.url;
        } catch (err) {
            toast.error(err.message);
            setIsProcessing(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-[16px]">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={isProcessing ? undefined : onClose}
                    className="absolute inset-0 bg-[#10141C]/55 backdrop-blur-[2px]"
                />

                {/* Modal Card */}
                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="relative bg-white rounded-[16px] w-full max-w-[420px] shadow-2xl overflow-hidden z-10"
                >
                    <div className="flex items-center justify-between px-[20px] py-[16px] border-b border-[#E4E8ED]">
                        <div className="flex items-center gap-[8px]">
                            <FiCreditCard className="text-[18px] text-[#C1121F]" />
                            <h3 className="text-[16px] font-[700] text-[#10141C]">Give fund</h3>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isProcessing}
                            className="text-[#5C6675] hover:text-[#10141C]"
                        >
                            <FiX className="text-[18px]" />
                        </button>
                    </div>

                    <div className="p-[20px]">
                        <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675] mb-[10px]">
                            Choose an amount
                        </p>
                        <div className="grid grid-cols-4 gap-[8px] mb-[16px]">
                            {PRESET_AMOUNTS.map((preset) => {
                                const isActive = Number(amount) === preset;
                                return (
                                    <button
                                        key={preset}
                                        type="button"
                                        onClick={() => setAmount(String(preset))}
                                        className={`h-[40px] rounded-[9px] font-mono text-[13px] font-[600] transition-colors ${
                                            isActive
                                                ? "bg-[#C1121F] text-white"
                                                : "border border-[#E4E8ED] bg-white text-[#10141C] hover:bg-[#F5F7F9]"
                                        }`}
                                    >
                                        ৳{preset.toLocaleString("en-US")}
                                    </button>
                                );
                            })}
                        </div>

                        <label className="block text-[13px] font-[600] text-[#10141C] mb-[6px]">
                            Or enter your own (৳)
                        </label>
                        <input
                            type="number"
                            min={MIN_AMOUNT}
                            max={MAX_AMOUNT}
                            step={1}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full h-[42px] px-[12px] rounded-[9px] border border-[#E4E8ED] font-mono text-[14px] text-[#10141C] outline-none focus:border-[#10141C]"
                        />
                        <p className="text-[12px] text-[#5C6675] mt-[10px] leading-relaxed">
                            You&apos;ll be taken to Stripe&apos;s secure page to pay. Minimum ৳{MIN_AMOUNT}.
                        </p>
                    </div>

                    <div className="flex justify-end gap-[8px] px-[20px] py-[14px] bg-[#F5F7F9] border-t border-[#E4E8ED]">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isProcessing}
                            className="h-[38px] px-[16px] rounded-[9px] border border-[#E4E8ED] bg-white font-[600] text-[13.5px] text-[#10141C] hover:bg-[#F5F7F9]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="h-[38px] px-[16px] rounded-[9px] bg-[#C1121F] hover:bg-[#A50F1A] text-white font-[600] text-[13.5px] disabled:opacity-60"
                        >
                            {isProcessing ? "Redirecting..." : "Continue to payment"}
                        </button>
                    </div>
                </motion.form>
            </div>
        </AnimatePresence>
    );
}
