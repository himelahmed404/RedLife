"use client";

import React, { useState } from "react";
import { Link } from "@heroui/react";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client"; // Adjust path if necessary

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  // ── Form Submission Handler ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      console.error("Login failed:", error);
      alert(error.message); 
    } else {
      console.log("Login successful!", data);
    }

    setIsLoading(false);
  };

  return (
    <section className="w-full max-w-[1180px] mx-auto px-5 py-[56px]">
      <div className="max-w-[520px] mx-auto">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white border border-[#E4E8ED] rounded-[14px] p-[28px]"
        >
          <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5C6675] mb-[12px]">
            RedLife account
          </p>
          <h2 className="text-[clamp(23px,3.2vw,33px)] font-bold text-[#10141C] leading-[1.1] tracking-[-0.02em]">
            Log in
          </h2>
          <p className="text-[13.5px] text-[#5C6675] mt-[6px]">
            Use the email you registered with.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-[16px] mt-[26px]">
            {/* Email */}
            <div>
              <label className="block text-[12.5px] font-[600] mb-[6px] text-[#10141C]">
                Email
              </label>
              <input 
                name="email"
                type="email" 
                placeholder="you@mail.com" 
                required
                className="w-full h-[44px] border border-[#E4E8ED] rounded-[11px] px-[13px] text-[14.5px] text-[#10141C] placeholder-[#A7B0BF] outline-none transition-all focus:border-[#C1121F] focus:ring-[3px] focus:ring-[#C1121F]/10"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[12.5px] font-[600] mb-[6px] text-[#10141C]">
                Password
              </label>
              <input 
                name="password"
                type="password" 
                placeholder="Enter your password" 
                required
                className="w-full h-[44px] border border-[#E4E8ED] rounded-[11px] px-[13px] text-[14.5px] text-[#10141C] placeholder-[#A7B0BF] outline-none transition-all focus:border-[#C1121F] focus:ring-[3px] focus:ring-[#C1121F]/10"
              />
            </div>

            {/* Submit Button */}
            <div className="mt-[10px]">
              <button 
                type="submit" 
                disabled={isLoading}
                className="flex items-center justify-center w-full font-semibold text-[15.5px] text-white bg-[#C1121F] hover:bg-[#7A0A12] disabled:bg-[#A7B0BF] disabled:cursor-not-allowed h-[50px] px-[18px] rounded-[11px] transition-colors cursor-pointer"
              >
                {isLoading ? "Logging in..." : "Log in"}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Footer Link */}
        <p className="text-[13.5px] text-[#5C6675] text-center mt-[18px]">
          New here?{" "}
          <Link href="/register" className="font-[600] text-[#C1121F] hover:text-[#7A0A12] transition-colors">
            Create an account
          </Link>
        </p>

      </div>
    </section>
  );
}