"use client";

import React, { useState, useEffect, useRef } from "react";
import { Link } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { FiGrid, FiLogOut } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

// ── Link Configuration Array ──
const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Donation requests", href: "/donation-requests" },
    { label: "Funding", href: "/funding" }
];

export default function AppNavbar() {
    const pathname = usePathname();
    const router = useRouter();
    const dropdownRef = useRef(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // ── Live Auth State ──
    const { 
        data: session, 
        isPending, 
        error 
    } = authClient.useSession(); 

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };  
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Actual Logout Logic
    const handleLogout = async () => {
        setIsDropdownOpen(false);
        await authClient.signOut();
        router.push("/"); // Redirect to login after signing out
    };

    return (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E4E8ED]">
            <nav className="flex items-center justify-between w-full max-w-[1180px] mx-auto px-5 h-[68px]">
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

                {/* Center Links */}
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
                                        : "text-[#5C6675] hover:text-[#10141C] hover:bg-[#F5F7F9]" 
                                }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Right Action Area (Auth State) */}
                <div className="flex items-center gap-2">
                    {isPending ? (
                        /* Loading State (Prevents UI jumping while checking session) */
                        <div className="w-[100px] h-[42px] bg-[#F5F7F9] rounded-[11px] animate-pulse"></div>
                    ) : session?.user ? (
                        /* Logged In State: User Dropdown */
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 border border-[#E4E8ED] bg-white rounded-full p-1 pr-3.5 hover:bg-[#F5F7F9] hover:border-[#10141C] transition-colors outline-none cursor-pointer"
                            >
                                {session.user.image ? (
                                    <Image src={session.user.image} alt="Avatar" width={100} height={100} className="w-7 h-7 rounded-full object-cover" />
                                ) : (
                                    <div className="w-7 h-7 rounded-full bg-[#10141C] text-white flex items-center justify-center text-[12px] font-bold shrink-0">
                                        {session.user.name.charAt(0)}
                                    </div>
                                )}
                                <span className="text-[14px] font-semibold text-[#10141C]">
                                    {session.user.name.split(" ")[0]}
                                </span>
                            </button>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.15, ease: "easeOut" }}
                                        className="absolute right-0 top-[calc(100%+8px)] w-[210px] bg-white border border-[#E4E8ED] rounded-[12px] shadow-[0_12px_32px_rgba(16,20,28,0.13)] p-[6px] flex flex-col z-50 origin-top-right"
                                    >
                                        <div className="px-[10px] py-[8px]">
                                            <p className="text-[14.5px] font-semibold text-[#10141C] leading-tight truncate">
                                                {session.user.name}
                                            </p>
                                            <p className="font-mono text-[12px] text-[#5C6675] mt-[2px] capitalize">
                                                {session.user.role || "Donor"}
                                            </p>
                                        </div>
                                        
                                        <div className="h-[1px] bg-[#E4E8ED] my-[4px] mx-[4px]"></div>
                                        
                                        <Link 
                                            href="/dashboard" 
                                            className="flex items-center gap-[10px] px-[10px] py-[9px] text-[13.5px] text-[#10141C] hover:bg-[#F5F7F9] rounded-[8px] transition-colors cursor-pointer w-full"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <FiGrid className="text-[16px] text-[#5C6675]" /> Dashboard
                                        </Link>
                                        
                                        <button 
                                            onClick={handleLogout} 
                                            className="flex items-center gap-[10px] px-[10px] py-[9px] text-[13.5px] text-[#C1121F] hover:bg-[#FDF1F2] rounded-[8px] transition-colors w-full text-left outline-none cursor-pointer"
                                        >
                                            <FiLogOut className="text-[16px]" /> Log out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        /* Logged Out State: Login / Register */
                        <>
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
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}