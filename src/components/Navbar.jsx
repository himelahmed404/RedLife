"use client";

import React from "react";
import { Link } from "@heroui/react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

// ── Link Configuration Array ──
const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Donation requests", href: "/donation-requests" },
    { label: "Search Donors", href: "/search-donors" }
];

export default function AppNavbar() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E4E8ED]">
            <nav className="flex items-center justify-between w-full max-w-295 mx-auto px-5 h-17">
                {/* Brand Logo */}
                <Link href="/" className="flex items-center gap-[10px] cursor-pointer">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-[34px] h-[34px] rounded-[10px] bg-[#C1121F] flex items-center justify-center shrink-0"
                    >
                        <svg width="24px" height="24px" viewBox="0 -4 24 32" fill="none" xmlns="http://www.w3.org/2000/svg" color="#fff">
                            <path d="M20 14C20 9.58172 12 2 12 2C12 2 4 9.58172 4 14C4 18.4183 7.58172 22 12 22C16.4183 22 20 18.4183 20 14Z" fill="#fff" stroke="#ffffff" strokeWidth="1.5"></path>
                        </svg>
                    </motion.div>
                    <p className="font-bold text-[18px] text-[#10141C] tracking-tight">
                        Red<span className="text-[#C1121F]">Life</span>
                    </p>
                </Link>

                {/* Center Links (Dynamically styled based on active route) */}
                <div className="hidden sm:flex items-center gap-1">
                    {NAV_LINKS.map((link) => {
                        const isActive = pathname === link.href;

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-[14.5px] font-medium px-3 py-2 rounded-[9px] transition-colors ${
                                    isActive
                                        ? "text-[#C1121F] bg-[#FDF1F2]" 
                                        : "text-[#2a2e35] hover:text-[#10141C] hover:bg-[#F5F7F9]" 
                                }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2">
                    <Link
                        href="/login"
                        className="hidden sm:flex items-center justify-center font-semibold text-[14px] text-[#5C6675] hover:text-[#10141C] hover:bg-[#F5F7F9] px-[18px] h-[42px] rounded-[11px] transition-colors"
                    >
                        Log in
                    </Link>

                    <Link
                        href="/register"
                        className="flex items-center justify-center font-semibold text-[14px] text-white bg-[#C1121F] hover:bg-[#7A0A12] h-[42px] px-[18px] rounded-[11px] transition-colors"
                    >
                        Join as a donor
                    </Link>
                </div>
            </nav>
        </header>
    );
}