'use client';

import React, { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import DashboardLayout from "@/components/DashBoard/DashboardLayout";

export default function Layout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  
  const isRedirecting = useRef(false);

  const rawRole = session?.user?.role || "donor";
  const currentRole = String(rawRole).toLowerCase();

  useEffect(() => {
    // Wait until Better-Auth session resolves
    if (isPending) return;

    // 1. Not logged in -> redirect to login
    if (!session?.user) {
      if (!isRedirecting.current) {
        isRedirecting.current = true;
        router.replace("/login");
      }
      return;
    }

    // 2. Determine target role from current URL
    let targetRole = null;
    if (pathname.startsWith("/dashboard/admin")) targetRole = "admin";
    else if (pathname.startsWith("/dashboard/volunteer")) targetRole = "volunteer";
    else if (pathname.startsWith("/dashboard/donor")) targetRole = "donor";

    // 3. If there is a role mismatch, redirect cleanly once
    if (targetRole && targetRole !== currentRole) {
      if (!isRedirecting.current) {
        isRedirecting.current = true;
        // Redirect to user's matching workspace
        router.replace(`/dashboard/${currentRole}`);
      }
      return;
    }

    // Reset redirect lock once successfully on an authorized path
    isRedirecting.current = false;
  }, [pathname, isPending, session?.user?.id, currentRole, router]);

  // Initial load: show spinner only when session is first loading
  if (isPending) {
    return (
      <div className="min-h-screen bg-[#F5F7F9] flex flex-col items-center justify-center">
        <div className="w-[30px] h-[30px] border-[3px] border-[#C1121F] border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="font-mono text-[12px] text-[#5C6675]">Verifying workspace...</p>
      </div>
    );
  }

  // Not logged in fallback
  if (!session?.user) {
    return null;
  }

  // Pass session directly into DashboardLayout so it doesn't need to re-fetch
  return (
    <DashboardLayout session={session}>
      {children}
    </DashboardLayout>
  );
}