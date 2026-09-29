"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";
import { FiRefreshCw, FiGrid } from "react-icons/fi";
import StatusScreen, { primaryButtonClass, secondaryButtonClass } from "@/components/StatusScreen";

// Renders inside the dashboard layout, so the sidebar stays visible.
const DASHBOARD_LINKS = [
  { tag: "DB", title: "Dashboard home", hint: "Back to your workspace", href: "/dashboard" },
  { tag: "RQ", title: "Donation board", hint: "Open blood requests near you", href: "/donation-requests" },
  { tag: "HM", title: "Public site", hint: "RedLife front page", href: "/" },
];

export default function DashboardError({ error, retry }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusScreen
      compact
      code="500"
      eyebrow="Workspace · something went wrong"
      title="This part of your dashboard failed to load."
      description="Your data is safe. Try loading it again, or jump back to your dashboard home."
      footnote={error?.digest ? `ref: ${error.digest}` : null}
      links={DASHBOARD_LINKS}
    >
      <button type="button" onClick={() => retry()} className={primaryButtonClass}>
        <FiRefreshCw className="text-lg" /> Try again
      </button>
      <Link href="/dashboard" className={secondaryButtonClass}>
        <FiGrid className="text-lg" /> Dashboard home
      </Link>
    </StatusScreen>
  );
}
