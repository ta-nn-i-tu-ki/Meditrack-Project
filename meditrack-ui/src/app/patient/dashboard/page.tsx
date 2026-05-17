"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, FileText, Send, Activity, User } from "lucide-react";
import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";

export default function PatientDashboard() {
  const { user } = useAppStore();
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", content: "Hello! I am your AI Health Assistant. How are you feeling today?" }
  ]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setMessages(prev => [...prev, { role: "user", content: chatInput }]);
    setChatInput("");
    
    // Mock AI Response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "ai", 
        content: "I've noted those symptoms. Based on our AI analysis, it's recommended you book a consultation with a General Physician. Would you like me to find an available slot for you?" 
      }]);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user?.email?.split('@')[0] || 'Patient'}</h1>
        <p className="text-slate-600 mt-2">Here is your health overview and upcoming appointments.</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Upcoming & Chat */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Upcoming Appointment */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 bg-gradient-to-br from-white to-primary-50/50 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 rounded-full blur-3xl opacity-60 -mr-10 -mt-10" />
            <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <Calendar className="text-primary-600" size={24} />
              Next Appointment
            </h2>
            
            <div className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-xl p-5 shadow-sm border border-slate-100 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center text-primary-700">
                  <User size={28} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg">Dr. Sarah Jenkins</h3>
                  <p className="text-slate-500">General Physician</p>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 text-center sm:text-right">
                <div className="flex items-center justify-center sm:justify-end gap-2 text-primary-600 font-medium bg-primary-50 px-4 py-2 rounded-lg">
                  <Clock size={18} />
                  <span>Starts in 2h 45m</span>
                </div>
                <p className="text-sm text-slate-400 mt-2">Today at 2:30 PM</p>
              </div>
            </div>
            
            <div className="mt-6 flex gap-4">
              <button className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20">
                Join Consultation
              </button>
              <button className="px-6 py-2 bg-white text-slate-600 border border-slate-200 rounded-lg font-medium hover:bg-slate-50 transition-colors">
                Reschedule
              </button>
            </div>
          </motion.div>

          {/* Interactive AI Chat */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel flex flex-col h-[500px]"
          >
            <div className="p-4 border-b border-slate-200 bg-white/50 flex items-center gap-3">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                <Activity size={20} />
              </div>
              <h2 className="font-semibold text-slate-800">AI Health Assistant</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-primary-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-700 shadow-sm rounded-bl-none'}`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-4 bg-white/50 border-t border-slate-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Describe your symptoms or ask a question..."
                  className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                />
                <button 
                  onClick={handleSendMessage}
                  className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Right Column: Health Timeline */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel p-6 h-fit"
        >
          <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <FileText className="text-indigo-600" size={24} />
            Health History
          </h2>

          <div className="relative border-l-2 border-slate-100 ml-3 space-y-8 pb-4">
            {[
              { date: "Oct 12, 2025", type: "Prescription Issued", doctor: "Dr. Smith", desc: "Antibiotics for Strep Throat" },
              { date: "Sep 28, 2025", type: "Consultation", doctor: "Dr. Jenkins", desc: "Routine Checkup. All clear." },
              { date: "Jun 15, 2025", type: "Lab Results", doctor: "Pathology Dept", desc: "Complete Blood Count - Normal" }
            ].map((event, i) => (
              <div key={i} className="relative pl-6">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-primary-500 ring-4 ring-white" />
                <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">{event.date}</span>
                <h3 className="font-semibold text-slate-900 mt-1">{event.type}</h3>
                <p className="text-sm text-slate-500 mt-1">{event.doctor}</p>
                <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-600">
                  {event.desc}
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
            View All Records
          </button>
        </motion.div>

      </div>
    </div>
  );
}
