"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "signin" | "register";
}

export default function AuthModal({ isOpen, onClose, initialMode = "signin" }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "register">(initialMode);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const setUser = useAppStore((state) => state.setUser);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mocking authentication
    setUser({ id: "123", email, role, token: "mock-token" });
    onClose();
    if (role === "patient") {
      router.push("/patient/dashboard");
    } else {
      router.push("/doctor");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md overflow-hidden bg-white shadow-2xl rounded-2xl border border-slate-100"
          >
            {/* Header Background */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-primary-600 to-indigo-700 opacity-10" />
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="p-8 pt-10 relative z-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {mode === "signin" ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="text-slate-500 text-sm">
                  {mode === "signin" 
                    ? "Enter your details to access your portal." 
                    : "Join MediTrack to experience modern healthcare."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "register" && (
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>
                )}
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>

                {mode === "register" && (
                  <div className="flex gap-4 mb-4">
                    <button
                      type="button"
                      onClick={() => setRole("patient")}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-all ${
                        role === "patient" ? "bg-primary-50 border-primary-500 text-primary-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      Patient
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("doctor")}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-all ${
                        role === "doctor" ? "bg-primary-50 border-primary-500 text-primary-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      Doctor
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-primary-500/20 mt-6"
                >
                  {mode === "signin" ? "Sign In" : "Register"}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-slate-500">
                {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setMode(mode === "signin" ? "register" : "signin")}
                  className="text-primary-600 font-medium hover:underline"
                >
                  {mode === "signin" ? "Register here" : "Sign in here"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
