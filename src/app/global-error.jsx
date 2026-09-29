"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";
import "./globals.css";
import StatusScreen, { primaryButtonClass, secondaryButtonClass } from "@/components/StatusScreen";

// Replaces the root layout when it crashes, so it renders its own <html>/<body>
// and a minimal brand header instead of the Navbar.
export default function GlobalError({ error, retry }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-[#10141C] antialiased">
        <title>Something went wrong · RedLife</title>

        <header className="border-b border-[#E4E8ED]">
          <div className="flex items-center w-full max-w-[1180px] mx-auto px-5 h-[68px]">
            <Link href="/" className="flex items-center gap-[10px]">
              <span className="w-[34px] h-[34px] rounded-[10px] bg-[#C1121F] flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2.7 6.9 8a7.2 7.2 0 1 0 10.2 0z" />
                </svg>
              </span>
              <span className="font-bold text-[18px] tracking-tight">
                Red<span className="text-[#C1121F]">Life</span>
              </span>
            </Link>
          </div>
        </header>

        <StatusScreen
          code="500"
          eyebrow="Error · 500 · application error"
          title="RedLife hit an unexpected error."
          description="Something broke while loading the app. Try again, or reload from the home page."
          footnote={error?.digest ? `ref: ${error.digest}` : null}
        >
          <button type="button" onClick={() => retry()} className={primaryButtonClass}>
            Try again
          </button>
          <Link href="/" className={secondaryButtonClass}>
            Back to home
          </Link>
        </StatusScreen>
      </body>
    </html>
  );
}
