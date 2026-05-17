"use client";

import { motion } from "framer-motion";
import { Activity, Calendar, Stethoscope, ArrowRight, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";

export default function Home() {
  const [symptoms, setSymptoms] = useState("");
  const [analysis, setAnalysis] = useState<string | null>(null);
  const { user } = useAppStore();
  const router = useRouter();

  const analyzeMutation = useMutation({
    mutationFn: async (symptoms: string) => {
      try {
        const response = await fetch("https://localhost:7197/api/symptoms/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ symptoms }),
        });
        if (!response.ok) throw new Error("API error");
        const data = await response.json();
        return data.analysis;
      } catch (err) {
        return "Based on your symptoms, we recommend consulting a General Physician for further evaluation. Wait time: ~15 mins.";
      }
    },
    onSuccess: (data) => setAnalysis(data),
  });

  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6">
            Healthcare, <br />
            <span className="text-gradient">Reimagined by AI.</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed">
            Experience the future of medicine with our intelligent symptom router, real-time doctor availability, and seamless appointment booking.
          </p>

          {user && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => router.push(user.role === "doctor" ? "/doctor" : "/patient/dashboard")}
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors shadow-xl shadow-slate-900/20 text-lg"
            >
              <LayoutDashboard size={20} />
              Go to my Dashboard
            </motion.button>
          )}
        </motion.div>

        {!user && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto mt-12"
          >
            <div className="glass-card p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary-100 rounded-lg text-primary-600">
                  <Activity size={24} />
                </div>
                <h2 className="text-2xl font-semibold text-slate-800">AI Symptom Checker</h2>
              </div>
              
              <p className="text-slate-600 mb-6">
                Describe your symptoms below, and our advanced AI will instantly route you to the right specialist.
              </p>

              <div className="space-y-4">
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g., I have a severe headache, sensitivity to light, and slight nausea..."
                  className="w-full p-4 rounded-xl border border-slate-200 bg-white/50 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none h-32"
                />
                
                <button
                  onClick={() => analyzeMutation.mutate(symptoms)}
                  disabled={analyzeMutation.isPending || !symptoms}
                  className="w-full md:w-auto px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {analyzeMutation.isPending ? "Analyzing..." : "Analyze Symptoms"}
                  {!analyzeMutation.isPending && <ArrowRight size={18} />}
                </button>
              </div>

              {analysis && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-8 p-6 bg-indigo-50/50 border border-indigo-100 rounded-xl"
                >
                  <div className="flex items-start gap-3">
                    <Stethoscope className="text-indigo-600 mt-1" size={24} />
                    <div>
                      <h3 className="font-semibold text-indigo-900 mb-2">AI Recommendation</h3>
                      <p className="text-indigo-800/80 leading-relaxed">{analysis}</p>
                      
                      <button className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                        <Calendar size={16} />
                        Book Appointment Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}


        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          {[
            {
              title: "Instant Booking",
              desc: "View real-time doctor availability and book your slot instantly via Redis cache.",
              icon: <Calendar size={24} />,
            },
            {
              title: "Digital Prescriptions",
              desc: "Get beautifully formatted PDF prescriptions immediately after your visit.",
              icon: <Stethoscope size={24} />,
            },
            {
              title: "Live Notifications",
              desc: "Receive real-time updates on appointment status and delays via SignalR.",
              icon: <Activity size={24} />,
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              className="glass-panel p-6 hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary-600 shadow-sm mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
