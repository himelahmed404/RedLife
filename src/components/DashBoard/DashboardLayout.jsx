"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  FiGrid, FiUsers, FiList, FiPlusCircle, FiUser, 
  FiMonitor, FiDollarSign, FiLogOut 
} from "react-icons/fi";
import { authClient } from "@/lib/auth-client"; 

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  // ── Session State ──
  const { data: session, isPending } = authClient.useSession();

  // Protect route if not logged in
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  // Helper to get initials
  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
  };

  // ── Role-Based Link Configurations ──
  const userRole = session?.user?.role || "donor";

  const adminLinks = [
    { label: "Dashboard", shortLabel: "Home", href: "/dashboard", icon: FiGrid },
    { label: "All users", shortLabel: "Users", href: "/dashboard/all-users", icon: FiUsers },
    { label: "All blood donation requests", shortLabel: "All requests", href: "/dashboard/all-blood-donation-request", icon: FiList },
    { label: "Create donation request", shortLabel: "Create", href: "/dashboard/create-donation-request", icon: FiPlusCircle },
    { label: "Profile", shortLabel: "Profile", href: "/dashboard/profile", icon: FiUser },
  ];

  const volunteerLinks = [
    { label: "Dashboard", shortLabel: "Home", href: "/dashboard", icon: FiGrid },
    { label: "All blood donation requests", shortLabel: "All requests", href: "/dashboard/all-blood-donation-request", icon: FiList },
    { label: "Create donation request", shortLabel: "Create", href: "/dashboard/create-donation-request", icon: FiPlusCircle },
    { label: "Profile", shortLabel: "Profile", href: "/dashboard/profile", icon: FiUser },
  ];

  const donorLinks = [
    { label: "Dashboard", shortLabel: "Home", href: "/dashboard", icon: FiGrid },
    { label: "My donation requests", shortLabel: "My requests", href: "/dashboard/my-donation-requests", icon: FiList },
    { label: "Create donation request", shortLabel: "Create", href: "/dashboard/create-donation-request", icon: FiPlusCircle },
    { label: "Profile", shortLabel: "Profile", href: "/dashboard/profile", icon: FiUser },
  ];

  const publicLinks = [
    { label: "Donation board", shortLabel: "Board", href: "/donation-requests", icon: FiMonitor },
    { label: "Funding", shortLabel: "Funds", href: "/funding", icon: FiDollarSign },
  ];

  // ── Determine Active Workspace ──
  let workspaceLinks = donorLinks;
  let workspaceTitle = "donor workspace";

  if (userRole === "admin") {
    workspaceLinks = adminLinks;
    workspaceTitle = "admin workspace";
  } else if (userRole === "volunteer") {
    workspaceLinks = volunteerLinks;
    workspaceTitle = "volunteer workspace";
  }

  // Prevent flashing content while checking session
  if (isPending || !session?.user) {
    return <div className="min-h-screen bg-[#F5F7F9] flex items-center justify-center">Loading workspace...</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#F5F7F9] text-[#10141C] font-sans">
      
      {/* ── SIDEBAR ── */}
      <aside className="w-[78px] lg:w-[254px] flex-none bg-[#10141C] text-white flex flex-col sticky top-0 h-screen overflow-y-auto transition-all duration-300">
        
        {/* Brand Logo */}
        <div className="p-[12px]">
          <Link href="/" className="flex items-center justify-center lg:justify-start gap-[10px] cursor-pointer">
            <div className="w-[34px] h-[34px] rounded-[10px] bg-[#C1121F] flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2.7 6.9 8a7.2 7.2 0 1 0 10.2 0z"/>
              </svg>
            </div>
            <p className="hidden lg:block font-bold text-[18px] tracking-tight">
              Red<span className="text-[#C1121F]">Life</span>
            </p>
          </Link>
        </div>

        {/* Workspace Links */}
        <p className="font-mono text-[8px] lg:text-[10px] tracking-[0.1em] lg:tracking-[0.14em] uppercase text-[#69748A] py-[15px] lg:py-[16px] px-[4px] lg:px-[13px] text-center lg:text-left mt-[10px]">
          <span className="hidden lg:block">{workspaceTitle}</span>
          <span className="block lg:hidden">{userRole}</span>
        </p>
        <nav className="flex flex-col gap-[4px] px-[8px] lg:px-[10px]">
          {workspaceLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`flex flex-col lg:flex-row items-center gap-[4px] lg:gap-[11px] p-[9px] lg:py-[10px] lg:px-[13px] rounded-[10px] cursor-pointer transition-colors ${
                  isActive 
                    ? "bg-[#C1121F] text-white" 
                    : "text-[#A7B0BF] hover:bg-[#1B2230] hover:text-white"
                }`}
              >
                <Icon className="text-[17px] shrink-0" />
                <span className="hidden lg:block text-[14.5px] font-[500] leading-tight truncate">{link.label}</span>
                <span className="block lg:hidden text-[9.5px] leading-[1.15] text-center">{link.shortLabel}</span>
              </Link>
            );
          })}
        </nav>

        {/* Public Site Links */}
        <p className="font-mono text-[8px] lg:text-[10px] tracking-[0.1em] lg:tracking-[0.14em] uppercase text-[#69748A] py-[15px] lg:py-[16px] px-[4px] lg:px-[13px] text-center lg:text-left mt-auto lg:mt-[10px]">
          <span className="hidden lg:block">Public site</span>
          <span className="block lg:hidden">Site</span>
        </p>
        <nav className="flex flex-col gap-[4px] px-[8px] lg:px-[10px]">
          {publicLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className="flex flex-col lg:flex-row items-center gap-[4px] lg:gap-[11px] p-[9px] lg:py-[10px] lg:px-[13px] rounded-[10px] cursor-pointer transition-colors text-[#A7B0BF] hover:bg-[#1B2230] hover:text-white"
              >
                <Icon className="text-[17px] shrink-0" />
                <span className="hidden lg:block text-[14.5px] font-[500] leading-tight truncate">{link.label}</span>
                <span className="block lg:hidden text-[9.5px] leading-[1.15] text-center">{link.shortLabel}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="mt-auto p-[8px] lg:p-[12px]">
          <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-[10px] p-[8px] lg:p-[10px] rounded-[12px] bg-[#1B2230]">
            
            {/* Avatar */}
            {session.user.image ? (
                <img src={session.user.image} alt="Avatar" className="w-[30px] lg:w-[36px] h-[30px] lg:h-[36px] rounded-full object-cover shrink-0" />
            ) : (
                <div className="w-[30px] lg:w-[36px] h-[30px] lg:h-[36px] rounded-full bg-[#10141C] text-white flex items-center justify-center text-[11px] lg:text-[13px] font-bold shrink-0">
                    {getInitials(session.user.name)}
                </div>
            )}
            
            {/* Info (Hidden on mobile) */}
            <div className="hidden lg:block min-w-0 flex-1">
              <p className="text-[13.5px] font-[600] text-white truncate">{session.user.name}</p>
              <p className="font-mono text-[12px] text-[#69748A] truncate">{session.user.email}</p>
            </div>
            
            {/* Logout Button */}
            <button 
              onClick={handleLogout} 
              title="Log out"
              className="text-[#8C97A8] hover:text-white transition-colors p-1"
            >
              <FiLogOut className="text-[16px] lg:text-[18px]" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-1 min-w-0 flex flex-col">
        
        {/* Topbar */}
        <header className="h-[62px] bg-white border-b border-[#E4E8ED] flex items-center justify-between px-[16px] lg:px-[28px] shrink-0">
          <span className="font-mono text-[12px] text-[#5C6675] truncate">{pathname}</span>
          <div className="flex items-center gap-[8px]">
            <span className="inline-flex items-center justify-center h-[25px] px-[10px] rounded-full font-mono text-[11px] font-[500] tracking-[0.05em] uppercase text-[#10141C] bg-[#F5F7F9]">
              {userRole}
            </span>
            <Link 
              href="/" 
              className="inline-flex items-center justify-center font-semibold text-[13px] text-[#10141C] bg-white border border-[#E4E8ED] hover:border-[#10141C] hover:bg-[#F5F7F9] h-[33px] px-[12px] rounded-[9px] transition-colors"
            >
              View site
            </Link>
          </div>
        </header>

        {/* Page Content Injection */}
        <main className="p-[16px] lg:p-[28px] flex-1 overflow-y-auto">
          {children}
        </main>
        
      </div>
    </div>
  );
}