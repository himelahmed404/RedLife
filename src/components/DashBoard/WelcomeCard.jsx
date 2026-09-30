import React from "react";
import Image from "next/image";

const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

// Welcome section shared by every role's dashboard home
export default function WelcomeCard({ user }) {
  return (
    <div className="bg-white border border-[#E4E8ED] rounded-[16px] p-[20px] md:p-[28px] flex flex-wrap items-center justify-between gap-[20px]">
      {/* Left: Avatar + Greeting */}
      <div className="flex items-center gap-[16px]">
        {user?.image ? (
          <Image
            src={user.image}
            alt="Profile" width={80} height={80}
            className="w-[50px] h-[50px] rounded-full object-cover shrink-0 border border-[#E4E8ED]"
          />
        ) : (
          <div className="w-[50px] h-[50px] rounded-full bg-[#10141C] text-white flex items-center justify-center font-bold text-[18px] shrink-0">
            {getInitials(user?.name)}
          </div>
        )}
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#5C6675] mb-[2px]">
            Welcome back
          </p>
          <h2 className="text-[24px] md:text-[26px] font-bold text-[#10141C] tracking-[-0.02em]">
            {user?.name || "Donor"}
          </h2>
          <p className="text-[13px] text-[#5C6675]">
            {user?.district && user?.upazila
              ? `${user.upazila}, ${user.district}`
              : "Location not set"}
          </p>
        </div>
      </div>

      {/* Right: Blood Group & Eligibility Status */}
      <div className="flex items-center gap-[16px]">
        <div className="inline-flex flex-col items-center justify-center border-[1.5px] border-[#C1121F] rounded-[9px] bg-white text-[#C1121F] font-mono font-[700] relative overflow-hidden min-w-[60px] h-[48px] text-[19px] pt-[4px] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[4px] before:bg-[#C1121F]">
          {user?.bloodGroup || "—"}
        </div>
        <div>
          <p className="text-[14px] font-[600] text-[#10141C] flex items-center gap-[5px]">
            <span className="w-[7px] h-[7px] rounded-full bg-[#15803D]"></span>
            Eligible to donate
          </p>
          <p className="font-mono text-[12px] text-[#5C6675]">
            Ready for immediate requests
          </p>
        </div>
      </div>
    </div>
  );
}
