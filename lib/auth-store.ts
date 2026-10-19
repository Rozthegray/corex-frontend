import { create } from "zustand";
import Cookies from "js-cookie";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  matric_number?: string;
  role: "student" | "president" | "superadmin";
  account_type: "free" | "pro" | "scholar";
  level: "ND I" | "ND II" | "HND I" | "HND II";
  pathway: string;
  tokens_remaining: number;
  pdf_quota_remaining: number;
  history_summary?: {
    total_chat_sessions: number;
    mock_exams_attempted: number;
  };
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  setAuth: (user: UserProfile, token: string) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: Cookies.get("access_token") || null,

  setAuth: (user, token) => {
    Cookies.set("access_token", token, {
      expires: 8,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    set({ user, token });
  },

  updateUser: (updates) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    }));
  },

  clearAuth: () => {
    Cookies.remove("access_token");
    set({ user: null, token: null });
  },
}));

// Fallback default export to prevent import resolution mismatches
export default useAuthStore;