"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { Coins, GraduationCap, Compass, ShieldCheck } from "lucide-react";

interface UserProfileData {
  full_name: string;
  matric_number: string;
  level: string;
  pathway: string;
  account_type: string;
  tokens_remaining: number;
  pdf_quota_remaining: number;
}

export default function StudentStatusBar() {
  const [profile, setProfile] = useState<UserProfileData | null>(null);

  useEffect(() => {
    apiClient.get("/user/profile")
      .then((res) => setProfile(res.data))
      .catch((err) => console.error("Could not fetch user academic status", err));
  }, []);

  if (!profile) return null;

  return (
    <div className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-white px-6 py-2.5 text-xs text-slate-700 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Academic Level */}
        <div className="flex items-center gap-1.5 font-medium">
          <GraduationCap className="h-4 w-4 text-slate-500" />
          <span className="rounded bg-slate-100 px-2 py-0.5 font-semibold text-slate-800">
            {profile.level}
          </span>
        </div>

        {/* Pathway */}
        <div className="hidden items-center gap-1.5 md:flex">
          <Compass className="h-4 w-4 text-slate-500" />
          <span className="text-slate-600">{profile.pathway}</span>
        </div>
      </div>

      <div className="flex items-center gap-5">
        {/* Token Balance */}
        <div className="flex items-center gap-1.5">
          <Coins className="h-4 w-4 text-amber-500" />
          <span>Tokens:</span>
          <span className="font-mono font-bold text-slate-900">
            {profile.tokens_remaining.toLocaleString()}
          </span>
        </div>

        {/* Account Tier */}
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span className="uppercase tracking-wider font-semibold text-emerald-700">
            {profile.account_type}
          </span>
        </div>
      </div>
    </div>
  );
}