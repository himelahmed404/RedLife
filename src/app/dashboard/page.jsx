"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

// /dashboard → forwards to the signed-in user's role workspace.
// (The dashboard layout already handles the not-logged-in redirect.)
export default function DashboardIndex() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (!session?.user) return;
    const role = String(session.user.role || "donor").toLowerCase();
    router.replace(`/dashboard/${role}`);
  }, [session, router]);

  return (
    <div className="flex flex-col items-center justify-center py-[80px]">
      <div className="w-[30px] h-[30px] border-[3px] border-[#C1121F] border-t-transparent rounded-full animate-spin mb-3"></div>
      <p className="font-mono text-[12px] text-[#5C6675]">Opening your workspace...</p>
    </div>
  );
}
