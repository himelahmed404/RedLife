import React from "react";
import { Link } from "@heroui/react";

// ── Link Configuration Arrays ──
const DONATE_LINKS = [
  { label: "Open requests", href: "/donation-requests" },
  { label: "Find a donor", href: "/search" },
  { label: "Become a donor", href: "/register" },
  { label: "Fund the network", href: "/funding" },
];

const INFO_LINKS = [
  { label: "Eligibility checklist", href: "#" },
  { label: "120-day donation gap", href: "#" },
  { label: "Safety and screening", href: "#" },
  { label: "Contact us", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-[#10141C] text-[#A7B0BF] mt-[80px]">
      <div className="max-w-[1180px] mx-auto px-5 py-[56px]">
        {/* Top Section: Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-[40px]">
          
          {/* Brand & Description (Takes up 2 columns on tablet/desktop) */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-[10px] cursor-pointer">
              <div className="w-[34px] h-[34px] rounded-[10px] bg-[#C1121F] flex items-center justify-center shrink-0">
                <svg width="24px" height="24px" viewBox="0 -4 24 32" fill="none" xmlns="http://www.w3.org/2000/svg" color="#fff">
                  <path d="M20 14C20 9.58172 12 2 12 2C12 2 4 9.58172 4 14C4 18.4183 7.58172 22 12 22C16.4183 22 20 18.4183 20 14Z" fill="#fff" stroke="#ffffff" strokeWidth="1.5"></path>
                </svg>
              </div>
              <p className="font-bold text-[18px] text-white tracking-tight">
                Red<span className="text-[#C1121F]">Life</span>
              </p>
            </Link>
            
            <p className="text-[13.5px] mt-3 max-w-[360px] leading-relaxed">
              A donor register for Bangladesh, organised by upazila so the nearest match is always the first call.
            </p>
            
            <p className="font-mono text-[12px] mt-[18px] text-[#69748A]">
              24/7 HELPLINE · 01700-000000
            </p>
          </div>

          {/* Column 2: Donate Links */}
          <div>
            <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#69748A] mb-3">
              Donate
            </p>
            <ul className="flex flex-col gap-2">
              {DONATE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href} 
                    className="text-[14px] text-[#A7B0BF] hover:text-white transition-colors cursor-pointer"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Info Links */}
          <div>
            <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#69748A] mb-3">
              Know before you give
            </p>
            <ul className="flex flex-col gap-2">
              {INFO_LINKS.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href} 
                    className="text-[14px] text-[#A7B0BF] hover:text-white transition-colors cursor-pointer"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-t border-white/10 my-8" />

        {/* Bottom Section: Copyright */}
        <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[12px] text-[#69748A]">
          <span>© 2026 RedLife · Dhaka, Bangladesh</span>
          <span>Blood is never bought or sold here.</span>
        </div>
      </div>
    </footer>
  );
}