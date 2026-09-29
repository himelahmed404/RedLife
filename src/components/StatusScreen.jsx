import React from "react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

// ── Quick links shown on the dark "ward board" ──
const DEFAULT_LINKS = [
  { tag: "HM", title: "Home", hint: "Back to the RedLife front page", href: "/" },
  { tag: "RQ", title: "Donation board", hint: "Open blood requests near you", href: "/donation-requests" },
  { tag: "DB", title: "Dashboard", hint: "Your requests, donations and profile", href: "/dashboard" },
  { tag: "JN", title: "Join as a donor", hint: "Register in under a minute", href: "/register" },
];

// Shared layout for 404 / error screens, styled like the home page hero
// (eyebrow + headline + CTAs on the left, dark board on the right).
export default function StatusScreen({
  code,
  eyebrow,
  title,
  description,
  children,
  footnote,
  links = DEFAULT_LINKS,
  compact = false,
}) {
  return (
    <section
      className={`w-full max-w-[1180px] mx-auto ${compact ? "py-[24px]" : "px-5 py-[56px] md:py-[80px]"}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[44px] items-center">

        {/* Left Side: Code token, copy & actions */}
        <div>
          {/* Blood-group style token carrying the status code */}
          <span className="inline-flex flex-col items-center justify-center border-[2px] border-[#C1121F] rounded-[14px] bg-white text-[#C1121F] font-mono font-[700] relative overflow-hidden min-w-[112px] h-[76px] px-[18px] text-[34px] tracking-[-0.02em] pt-[8px] mb-[22px] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[8px] before:bg-[#C1121F]">
            {code}
          </span>

          <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675] mb-3">
            {eyebrow}
          </p>

          <h1 className="text-[clamp(28px,4.4vw,48px)] font-[800] leading-[1.05] tracking-[-0.02em] text-[#10141C]">
            {title}
          </h1>

          <p className="text-[16.5px] text-[#5C6675] mt-[16px] max-w-[480px]">
            {description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-[26px]">
            {children}
          </div>

          {footnote && (
            <p className="font-mono text-[12px] text-[#A7B0BF] mt-[22px] break-all">
              {footnote}
            </p>
          )}
        </div>

        {/* Right Side: The Ward Board with helpful links */}
        <div className="bg-[#10141C] rounded-[16px] p-[6px] text-white">
          <div className="flex items-center justify-between px-[14px] pt-[12px] pb-[10px]">
            <div className="flex items-center gap-2">
              <div className="relative flex h-[7px] w-[7px]">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C1121F] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-[7px] w-[7px] bg-[#C1121F]"></span>
              </div>
              <span className="font-mono text-[12px] text-white tracking-[0.1em]">TRY INSTEAD</span>
            </div>
            <span className="font-mono text-[12px] text-[#69748A]">status {code}</span>
          </div>

          <div className="flex flex-col">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center gap-[12px] px-[14px] py-[12px] rounded-[11px] hover:bg-[#1B2230] transition-colors border-t border-white/5 first:border-transparent"
              >
                <span className="inline-flex flex-col items-center justify-center border-[1.5px] border-white/35 rounded-[9px] bg-transparent text-white font-mono font-[600] relative overflow-hidden flex-none min-w-[44px] h-[34px] text-[13px] pt-[4px] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[4px] before:bg-white/35">
                  {link.tag}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-[600] text-white truncate">{link.title}</p>
                  <p className="font-mono text-[12px] text-[#8C97A8] truncate">{link.hint}</p>
                </div>
                <FiArrowRight className="text-[16px] text-[#69748A] group-hover:text-white transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Shared button styles (match the hero CTAs)
export const primaryButtonClass =
  "inline-flex items-center justify-center gap-2 bg-[#C1121F] hover:bg-[#7A0A12] text-white font-semibold text-[15.5px] h-[50px] px-[26px] rounded-[11px] transition-colors cursor-pointer";

export const secondaryButtonClass =
  "inline-flex items-center justify-center gap-2 bg-white border border-[#E4E8ED] hover:border-[#10141C] hover:bg-[#F5F7F9] text-[#10141C] font-semibold text-[15.5px] h-[50px] px-[26px] rounded-[11px] transition-colors cursor-pointer";
