"use client";

import { authClient } from "@/lib/auth-client";
import DonorHome from "@/components/DashBoard/DonorHome";
import StaffHome from "@/components/DashBoard/StaffHome";

// /dashboard — donors see their recent requests, admins and volunteers see the staff home.
// (The dashboard layout only renders this once the session has loaded.)
export default function DashboardHome() {
  const { data: session } = authClient.useSession();
  const role = session?.user?.role || "donor";

  return role === "donor" ? <DonorHome /> : <StaffHome />;
}
