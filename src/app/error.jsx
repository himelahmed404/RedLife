"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";
import { FiRefreshCw, FiArrowLeft } from "react-icons/fi";
import Pageshell from "@/components/Pageshell";
import StatusScreen, { primaryButtonClass, secondaryButtonClass } from "@/components/StatusScreen";

export default function Error({ error, retry }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Pageshell>
      <StatusScreen
        code="500"
        eyebrow="Error · 500 · something went wrong"
        title="Something went wrong on our side."
        description="We could not load this page right now. It is usually temporary. Try again, or head back while we sort it out."
        footnote={error?.digest ? `ref: ${error.digest}` : null}
      >
        <button type="button" onClick={() => retry()} className={primaryButtonClass}>
          <FiRefreshCw className="text-lg" /> Try again
        </button>
        <Link href="/" className={secondaryButtonClass}>
          <FiArrowLeft className="text-lg" /> Back to home
        </Link>
      </StatusScreen>
    </Pageshell>
  );
}
