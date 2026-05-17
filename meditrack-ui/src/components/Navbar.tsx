"use client";

import Link from "next/link";
import { User, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import AuthModal from "./AuthModal";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "register">("signin");
  const { user, logout } = useAppStore();
  const router = useRouter();

  const handleOpenAuth = (mode: "signin" | "register") => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <>
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-primary-500/20">
                  M
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-500">
                  MediTrack
                </span>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Home</Link>
              <Link href="/doctor" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Doctor Portal</Link>
              <Link href="/admin" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Admin Dashboard</Link>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-700 hidden sm:block">
                    Hello, {user.email.split("@")[0]}
                  </span>
                  <Link 
                    href={user.role === "doctor" ? "/doctor" : "/patient/dashboard"}
                    className="p-2 text-slate-500 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                  >
                    <LayoutDashboard size={20} />
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => handleOpenAuth("signin")}
                    className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors hidden sm:block"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => handleOpenAuth("register")}
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-lg shadow-slate-900/20"
                  >
                    <User size={16} />
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        initialMode={authMode} 
      />
    </>
  );
}
