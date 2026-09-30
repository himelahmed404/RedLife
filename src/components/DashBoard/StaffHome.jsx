"use client";

import React from "react";
import { authClient } from "@/lib/auth-client";

import WelcomeCard from "@/components/DashBoard/WelcomeCard";

// Dashboard home for admins and volunteers
export default function StaffHome() {
  const { data: session } = authClient.useSession();

  return (
    <div className="w-full max-w-[1180px] mx-auto space-y-[24px]">
      <WelcomeCard user={session?.user} />
    </div>
  );
}
