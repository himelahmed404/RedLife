"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

// Wraps a public-site page that needs a logged-in user.
// It waits for the session first, so reloading never bounces a logged-in user to /login.
export default function PrivateRoute({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [isPending, session?.user, pathname, router]);

  if (isPending || !session?.user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="w-[30px] h-[30px] border-[3px] border-[#C1121F] border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="font-mono text-[12px] text-[#5C6675]">Checking your account...</p>
      </div>
    );
  }

  return children;
}
