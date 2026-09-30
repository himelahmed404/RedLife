"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

// Renders children only for the allowed roles; everyone else goes back to /dashboard.
// (The dashboard layout already handles logged-out users.)
export default function RoleGuard({ allow, children }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const role = session?.user?.role || "donor";
  const isAllowed = allow.includes(role);

  useEffect(() => {
    if (!isPending && session?.user && !isAllowed) {
      router.replace("/dashboard");
    }
  }, [isPending, session?.user, isAllowed, router]);

  if (isPending || !isAllowed) return null;
  return children;
}
