"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Activity, HeartPulse, FileDown, Calendar, CheckCircle, Star, Users, Search, ArrowLeft, Stethoscope, ClipboardList } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { getAiDoctorResponse, type Vitals, type PrescriptionResult } from "@/lib/aiDoctor";
import { DOCTOR_PROFILES, type DoctorProfile } from "@/lib/doctors";
import { useConsultationStore } from "@/store/useAppStore";

type Message = { role: "user" | "model"; content: string };
type View = "select" | "chat";

const STAGES = [
  "Chief Complaint",
  "Onset & Duration",
  "Severity",
  "Associated Symptoms",
  "Medical History",
  "Current Medications",
  "Allergies & Lifestyle",
  "Assessment Complete",
];

// Simple markdown bold renderer: **text** → <strong>text</strong>
function renderMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|---)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (part === "---") {
      return <hr key={i} className="my-2 border-slate-200" />;
    }
    return <span key={i}>{part}</span>;
  });
}

export default function PatientDashboard() {
  const [view, setView] = useState<View>("select");
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile | null>(null);
  const [search, setSearch] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [vitals, setVitals] = useState<Vitals>({ BloodPressure: "", HeartRate: "", Temperature: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [prescription, setPrescription] = useState<PrescriptionResult | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const addConsultation = useConsultationStore(s => s.addConsultation);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const startChat = (doc: DoctorProfile) => {
    setSelectedDoctor(doc);
    setPrescription(null);
    setMessages([{ role: "model", content: `Hello! I'm ${doc.name}, your ${doc.specialty} specialist. How can I help you today? Please describe your symptoms.` }]);
    setView("chat");
  };

  const handleSend = async () => {
    if (!chatInput.trim() || isLoading) return;
    const userMsg = chatInput.trim();
    const newHistory: Message[] = [...messages, { role: "user", content: userMsg }];
    setMessages(newHistory);
    setChatInput("");
    setIsLoading(true);
    try {
      const result = await getAiDoctorResponse(messages, vitals, userMsg, selectedDoctor?.id);
      setMessages([...newHistory, { role: "model", content: result.text }]);
      if (result.prescription) {
        setPrescription(result.prescription);
        addConsultation({
          id: Date.now().toString(),
          patientName: "Demo Patient",
          date: new Date().toISOString(),
          doctorName: result.prescription.suggestedDoctor,
          department: result.prescription.recommendedDepartment,
          symptoms: newHistory.filter(m => m.role === "user").map(m => m.content).join("; "),
          vitals: { bp: vitals.BloodPressure || "N/A", hr: vitals.HeartRate || "N/A", temp: vitals.Temperature || "N/A" },
          medicines: result.prescription.medicines,
          notes: result.prescription.notes,
          status: "pending",
        });
      }
    } catch {
      setMessages([...newHistory, { role: "model", content: "I encountered a technical issue. Please try again." }]);
    } finally { setIsLoading(false); }
  };

  const downloadDoc = (type: "prescription" | "appointment") => {
    if (!prescription) return;
    const symptoms = messages.filter(m => m.role === "user").map(m => m.content).join("; ");
    const ref = "AP-" + Math.floor(Math.random() * 90000 + 10000);
    const appt = new Date(Date.now() + 86400000);
    const content = type === "prescription"
      ? `MEDITRACK CLINIC\n${"=".repeat(55)}\nPROVISIONAL PRESCRIPTION\n${"=".repeat(55)}\nDate: ${new Date().toDateString()}\nDoctor: ${prescription.suggestedDoctor}\nDepartment: ${prescription.recommendedDepartment}\n${"─".repeat(55)}\nPATIENT VITALS\nBlood Pressure : ${vitals.BloodPressure || "N/A"}\nHeart Rate     : ${vitals.HeartRate || "N/A"} bpm\nTemperature    : ${vitals.Temperature || "N/A"} °F\n${"─".repeat(55)}\nREPORTED SYMPTOMS\n${symptoms}\n${"─".repeat(55)}\nRx — MEDICINES\n${prescription.medicines.map(m => `• ${m.name}  |  Dose: ${m.dosage}  |  Duration: ${m.duration}`).join("\n")}\n${"─".repeat(55)}\nADVICE\n${prescription.notes}\n${"=".repeat(55)}\n⚠ DISCLAIMER: AI-assisted provisional prescription.\nAlways consult a licensed physician before taking medication.\n${"=".repeat(55)}`
      : `MEDITRACK CLINIC\n${"=".repeat(55)}\nAPPOINTMENT CONFIRMATION\n${"=".repeat(55)}\nRef No: ${ref}\nIssued: ${new Date().toDateString()}\n${"─".repeat(55)}\nDoctor      : ${prescription.suggestedDoctor}\nDepartment  : ${prescription.recommendedDepartment}\nDate & Time : ${appt.toDateString()} at 10:00 AM\n${"─".repeat(55)}\nINSTRUCTIONS\n• Arrive 15 minutes early.\n• Carry a valid government-issued ID.\n• Bring all previous medical reports.\n${"=".repeat(55)}\nMediTrack Clinic | support@meditrack.com | +1 800 123 4567\n${"=".repeat(55)}`;
    const blob = new Blob([content], { type: "text/plain" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `${type === "prescription" ? "Prescription" : "Appointment"}_${Date.now()}.txt`;
    a.click();
  };

  const filtered = DOCTOR_PROFILES.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty.toLowerCase().includes(search.toLowerCase())
  );
  const specialties = [...new Set(DOCTOR_PROFILES.map(d => d.specialty))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <AnimatePresence mode="wait">
        {/* ── Doctor Selection View ── */}
        {view === "select" && (
          <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900">Patient Portal</h1>
              <p className="text-slate-500 mt-1">Choose a specialist to begin your AI-powered consultation.</p>
            </div>

            {/* Vitals Banner */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-5 mb-8">
              <h2 className="text-sm font-semibold text-indigo-800 mb-3 flex items-center gap-2"><HeartPulse size={16} /> Enter Vitals Before Consulting (Optional)</h2>
              <div className="grid grid-cols-3 gap-4">
                {[["Blood Pressure (mmHg)", "BloodPressure", "120/80"], ["Heart Rate (bpm)", "HeartRate", "72"], ["Temperature (°F)", "Temperature", "98.6"]].map(([label, key, ph]) => (
                  <div key={key}><label className="block text-xs text-slate-500 mb-1">{label}</label>
                    <input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none" placeholder={`e.g. ${ph}`}
                      value={(vitals as any)[key]} onChange={e => setVitals({ ...vitals, [key]: e.target.value })} />
                  </div>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                placeholder="Search by doctor name or specialty..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {/* Doctor Cards */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((doc, i) => (
                <motion.div key={doc.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-2xl ${doc.avatar} flex items-center justify-center text-white text-xl font-bold shrink-0`}>
                      {doc.name.split(" ")[1]?.charAt(0) ?? "D"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 text-base">{doc.name}</h3>
                      <p className="text-indigo-600 text-xs font-semibold">{doc.specialty}</p>
                      <p className="text-slate-400 text-xs mt-0.5 truncate">{doc.degree}</p>
                    </div>
                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${doc.available ? "bg-emerald-400" : "bg-slate-300"}`} title={doc.available ? "Available" : "Unavailable"} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                    <span className="flex items-center gap-1"><Star size={12} className="text-amber-400 fill-amber-400" />{doc.rating}</span>
                    <span className="flex items-center gap-1"><Users size={12} />{doc.patients.toLocaleString()} patients</span>
                    <span>{doc.experience}</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4">{doc.about}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800">₹{doc.consultationFee} <span className="text-xs font-normal text-slate-400">/ consult</span></span>
                    <button onClick={() => startChat(doc)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-1.5">
                      <Stethoscope size={13} /> Consult Now
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Chat View ── */}
        {view === "chat" && selectedDoctor && (
          <motion.div key="chat" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
            className="grid lg:grid-cols-3 gap-6">

            {/* Doctor Info Sidebar */}
            <div className="space-y-4">
              <button onClick={() => setView("select")} className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-2">
                <ArrowLeft size={16} /> Back to Doctors
              </button>
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className={`w-16 h-16 rounded-2xl ${selectedDoctor.avatar} flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3`}>
                  {selectedDoctor.name.split(" ")[1]?.charAt(0) ?? "D"}
                </div>
                <h2 className="font-bold text-slate-900 text-center text-base">{selectedDoctor.name}</h2>
                <p className="text-indigo-600 text-xs text-center font-semibold mt-0.5">{selectedDoctor.specialty}</p>
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between"><span className="text-slate-400 text-xs">Degree</span><span className="text-xs font-medium text-right max-w-[140px]">{selectedDoctor.degree}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400 text-xs">Experience</span><span className="text-xs font-medium">{selectedDoctor.experience}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400 text-xs">Hospital</span><span className="text-xs font-medium text-right max-w-[140px]">{selectedDoctor.hospital}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400 text-xs">Rating</span><span className="text-xs font-medium flex items-center gap-1"><Star size={11} className="text-amber-400 fill-amber-400" />{selectedDoctor.rating}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400 text-xs">Languages</span><span className="text-xs font-medium">{selectedDoctor.languages.join(", ")}</span></div>
                </div>
                <p className="text-xs text-slate-500 mt-4 leading-relaxed">{selectedDoctor.about}</p>
              </div>

              {/* Vitals in sidebar */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
                <h3 className="text-xs font-bold text-indigo-700 mb-3 flex items-center gap-1"><HeartPulse size={13} /> Your Vitals</h3>
                {[["BP", vitals.BloodPressure, "mmHg"], ["HR", vitals.HeartRate, "bpm"], ["Temp", vitals.Temperature, "°F"]].map(([label, val, unit]) => (
                  <div key={label} className="flex justify-between text-xs mb-1">
                    <span className="text-indigo-600 font-medium">{label}</span>
                    <span className="text-slate-700">{val || "—"} {val ? unit : ""}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat */}
            <div className="lg:col-span-2 flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden" style={{ height: 700 }}>
              {/* Header */}
              <div className="p-4 bg-gradient-to-r from-indigo-600 to-blue-600">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full ${selectedDoctor.avatar} flex items-center justify-center text-white font-bold`}>
                    {selectedDoctor.name.split(" ")[1]?.charAt(0) ?? "D"}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-semibold text-white text-sm">{selectedDoctor.name}</h2>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      <p className="text-blue-100 text-xs">{selectedDoctor.specialty} • AI Consultation</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-200 text-[10px] mb-1 flex items-center gap-1 justify-end">
                      <ClipboardList size={11} />
                      Step {Math.min(messages.filter(m=>m.role==="user").length + 1, 7)} of 7
                    </p>
                    <p className="text-white text-[10px] font-semibold">
                      {STAGES[Math.min(messages.filter(m=>m.role==="user").length, STAGES.length - 1)]}
                    </p>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-white/20 rounded-full h-1.5">
                  <div
                    className="bg-white rounded-full h-1.5 transition-all duration-500"
                    style={{ width: `${Math.min((messages.filter(m=>m.role==="user").length / 7) * 100, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-blue-200 mt-1">
                  <span>Start</span>
                  <span>Assessment Complete</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50">
                {messages.map((msg, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-2`}>
                    {msg.role === "model" && (
                      <div className={`w-8 h-8 rounded-full ${selectedDoctor.avatar} flex items-center justify-center text-white font-bold text-xs shrink-0 mt-1`}>
                        {selectedDoctor.name.split(" ")[1]?.charAt(0) ?? "D"}
                      </div>
                    )}
                    <div className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === "user" ? "bg-indigo-600 text-white rounded-br-sm" : "bg-white border border-slate-100 text-slate-700 rounded-bl-sm"}`}>
                      <p className="whitespace-pre-wrap">{msg.role === "model" ? renderMarkdown(msg.content) : msg.content}</p>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex justify-start gap-2">
                    <div className={`w-8 h-8 rounded-full ${selectedDoctor.avatar} flex items-center justify-center text-white text-xs`}>
                      {selectedDoctor.name.split(" ")[1]?.charAt(0) ?? "D"}
                    </div>
                    <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5 items-center">
                      {[0, 0.2, 0.4].map((d, i) => <div key={i} className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: `${d}s` }} />)}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {prescription && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-emerald-50 border-t border-emerald-100 px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-emerald-800 text-sm">
                      <CheckCircle size={16} className="text-emerald-500" />
                      <span><strong>Consultation Complete!</strong> Documents ready.</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => downloadDoc("prescription")}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-200 text-emerald-700 rounded-lg text-xs font-semibold hover:bg-emerald-100 transition-colors">
                        <FileDown size={13} /> Download Rx
                      </button>
                      <button onClick={() => downloadDoc("appointment")}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors">
                        <Calendar size={13} /> Appointment Letter
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="p-3 bg-white border-t border-slate-200">
                <div className="flex gap-2">
                  <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()}
                    placeholder={`Message ${selectedDoctor.name}...`}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 focus:bg-white outline-none transition-all"
                    disabled={isLoading} />
                  <button onClick={handleSend} disabled={isLoading} className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
