"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Users, FileText, Calendar as CalendarIcon, Clock, X, FilePlus, HeartPulse } from "lucide-react";
import { useState } from "react";

interface Patient {
  id: string;
  name: string;
  time: string;
  reason: string;
  status: "waiting" | "in-session" | "completed";
  symptoms: string[];
}

export default function DoctorPortal() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const schedule: Patient[] = [
    { id: "1", name: "Eleanor Pena", time: "09:00 AM", reason: "Annual Checkup", status: "completed", symptoms: ["Healthy"] },
    { id: "2", name: "Jacob Jones", time: "10:30 AM", reason: "Fever & Chills", status: "completed", symptoms: ["102° Fever", "Body Ache"] },
    { id: "3", name: "Theresa Webb", time: "01:00 PM", reason: "Severe Migraine", status: "in-session", symptoms: ["Throbbing pain", "Nausea", "Light sensitivity"] },
    { id: "4", name: "Arlene McCoy", time: "02:30 PM", reason: "Back Pain", status: "waiting", symptoms: ["Lower back pain", "Radiating leg pain"] },
    { id: "5", name: "Devon Lane", time: "04:00 PM", reason: "Follow-up", status: "waiting", symptoms: ["Recovering"] },
  ];

  const handleGeneratePrescription = () => {
    setGeneratingPdf(true);
    setTimeout(() => {
      setGeneratingPdf(false);
      alert("Prescription PDF Generated successfully via QuestPDF!");
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-3xl font-bold text-slate-900">Dr. Sarah Jenkins</h1>
        <p className="text-slate-600 mt-2">Manage your appointments, patients, and prescriptions.</p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">
        {[
          { title: "Today's Appointments", value: "12", icon: <CalendarIcon size={20} className="text-blue-600" /> },
          { title: "Total Patients", value: "840", icon: <Users size={20} className="text-indigo-600" /> },
          { title: "Prescriptions Issued", value: "1,204", icon: <FileText size={20} className="text-purple-600" /> },
          { title: "Next Available Slot", value: "2:30 PM", icon: <Clock size={20} className="text-emerald-600" /> },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-medium text-slate-500">{stat.title}</h3>
              <div className="p-2 bg-slate-50 rounded-lg">{stat.icon}</div>
            </div>
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8 relative z-10">
        
        {/* Interactive Schedule Timeline */}
        <div className="lg:col-span-2 glass-panel p-6 h-[600px] overflow-y-auto">
          <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <Clock className="text-indigo-600" size={20} />
            Today's Schedule
          </h2>
          
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            {schedule.map((patient, i) => (
              <motion.div 
                key={patient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedPatient(patient)}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group cursor-pointer"
              >
                {/* Timeline dot */}
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-50 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${
                  patient.status === 'completed' ? 'bg-emerald-500' :
                  patient.status === 'in-session' ? 'bg-indigo-500 ring-4 ring-indigo-100 animate-pulse' :
                  'bg-slate-300'
                }`}>
                  <CalendarIcon size={16} className="text-white" />
                </div>
                
                {/* Event Card */}
                <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-4 rounded-xl border transition-all ${
                  selectedPatient?.id === patient.id ? 'bg-primary-50 border-primary-300 ring-2 ring-primary-500/20' : 'bg-white border-slate-200 hover:border-primary-300 hover:shadow-md'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500">{patient.time}</span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                      patient.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                      patient.status === 'in-session' ? 'bg-indigo-100 text-indigo-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {patient.status}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-900">{patient.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{patient.reason}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Quick Action / Notice Board */}
        <div className="glass-panel p-6 h-[600px] flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Urgent Notifications</h2>
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl mb-4">
              <div className="flex gap-3">
                <HeartPulse className="text-amber-500 shrink-0" />
                <div>
                  <h4 className="font-semibold text-amber-900">Lab Results Ready</h4>
                  <p className="text-sm text-amber-800/80 mt-1">Blood work for Theresa Webb has been uploaded to her file.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-slate-900 rounded-xl text-white text-center">
            <h3 className="font-semibold mb-2">AI Diagnosis Assistant</h3>
            <p className="text-sm text-slate-400 mb-4">Need a second opinion? Ask our LLM agent to analyze the current patient's symptoms.</p>
            <button className="w-full py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-lg text-sm font-medium">
              Open Assistant
            </button>
          </div>
        </div>
      </div>

      {/* Patient Details Slide-over Drawer */}
      <AnimatePresence>
        {selectedPatient && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPatient(null)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[110] border-l border-slate-200 flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h2 className="text-xl font-semibold text-slate-800">Patient Details</h2>
                <button 
                  onClick={() => setSelectedPatient(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 flex-1 overflow-y-auto">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 text-xl font-bold">
                    {selectedPatient.name.charAt(0)}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">{selectedPatient.name}</h1>
                    <p className="text-slate-500">ID: {selectedPatient.id} • {selectedPatient.reason}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">AI Symptom Analysis</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPatient.symptoms.map((sym, i) => (
                      <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-100">
                        {sym}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Consultation Notes</h3>
                  <textarea 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 min-h-[150px] resize-none"
                    placeholder="Type your clinical notes here..."
                  />
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-white">
                <button 
                  onClick={handleGeneratePrescription}
                  disabled={generatingPdf}
                  className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {generatingPdf ? (
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <FilePlus size={20} />
                      Generate PDF Prescription
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
