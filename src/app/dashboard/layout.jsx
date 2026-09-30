'use client';

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import DashboardLayout from "@/components/DashBoard/DashboardLayout";

// Every /dashboard route is private. Role-specific pages add their own <RoleGuard>.
export default function Layout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    // Wait for the session before deciding, so a reload never bounces a logged-in user
    if (!isPending && !session?.user) {
      router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [isPending, session?.user, pathname, router]);

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
