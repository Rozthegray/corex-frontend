"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Link from "next/link";

export default function CookieConsentModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = Cookies.get("cookie_consent");
    if (!consent) {
      // Delay mounting slightly for a smoother entry animation
      const timer = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    Cookies.set("cookie_consent", "accepted", { expires: 365 });
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t border-slate-200 bg-white p-4 shadow-lg sm:p-6">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Platform Required Storage</p>
          We use strictly necessary session cookies and JWT tokens to authenticate your institutional
          access and maintain rate limits. By continuing to use the Academic Archive, you agree to our{" "}
          <Link href="/legal/cookies" className="text-slate-900 underline hover:text-slate-600">
            Cookie Governance
          </Link>{" "}
          and{" "}
          <Link href="/legal/privacy" className="text-slate-900 underline hover:text-slate-600">
            Privacy Policy
          </Link>.
        </div>

        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row">
          <button
            onClick={handleAccept}
            className="rounded-md bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Acknowledge & Accept
          </button>
        </div>
      </div>
    </div>
  );
}