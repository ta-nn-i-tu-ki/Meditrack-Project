"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Users, FileText, Calendar, Clock, X, FilePlus, HeartPulse, FlaskConical, Star, BadgeCheck, Activity } from "lucide-react";
import { useState } from "react";
import { useConsultationStore, type ConsultationRecord } from "@/store/useAppStore";
import { DOCTOR_PROFILES } from "@/lib/doctors";

type Tab = "notes" | "history" | "labs" | "vitals";

const STATIC_PATIENTS = [
  { id: "s1", name: "Eleanor Pena",   time: "09:00 AM", reason: "Annual Checkup",    status: "completed" as const, vitals: { bp: "120/80", hr: "72", temp: "98.6" }, symptoms: ["Healthy"], labs: [{ test: "CBC", result: "Normal", date: "Jan 10", status: "normal" as const }], history: [{ date: "2024-05-10", type: "Vaccination", desc: "Flu Shot" }] },
  { id: "s2", name: "Jacob Jones",    time: "10:30 AM", reason: "Fever & Chills",     status: "completed" as const, vitals: { bp: "130/85", hr: "95", temp: "102.1" }, symptoms: ["102° Fever", "Body Ache"], labs: [{ test: "Rapid Strep", result: "Negative", date: "Today", status: "normal" as const }], history: [{ date: "2023-11-20", type: "Illness", desc: "Strep Throat" }] },
  { id: "s3", name: "Theresa Webb",   time: "01:00 PM", reason: "Severe Migraine",   status: "in-session" as const, vitals: { bp: "145/95", hr: "88", temp: "98.4" }, symptoms: ["Throbbing pain", "Nausea", "Light sensitivity"], labs: [{ test: "Vitamin D", result: "12 ng/mL (Low)", date: "Feb 15", status: "abnormal" as const }, { test: "MRI Brain", result: "Pending", date: "Mar 01", status: "normal" as const }], history: [{ date: "2025-02-15", type: "Consultation", desc: "Frequent headaches." }, { date: "2022-08-01", type: "Surgery", desc: "Appendectomy" }] },
  { id: "s4", name: "Arlene McCoy",   time: "02:30 PM", reason: "Back Pain",         status: "waiting" as const, vitals: { bp: "125/82", hr: "70", temp: "98.1" }, symptoms: ["Lower back pain", "Radiating leg pain"], labs: [{ test: "X-Ray Lumbar", result: "Mild L4-L5 compression", date: "Oct 15", status: "abnormal" as const }], history: [{ date: "2024-10-12", type: "Injury", desc: "Lifted heavy object" }] },
  { id: "s5", name: "Devon Lane",     time: "04:00 PM", reason: "Follow-up",         status: "waiting" as const, vitals: { bp: "118/76", hr: "65", temp: "98.6" }, symptoms: ["Recovering"], labs: [], history: [{ date: "2025-04-10", type: "Consultation", desc: "Bronchitis" }] },
];

function downloadPrescription(c: ConsultationRecord) {
  const text = `MEDITRACK CLINIC\n${"=".repeat(55)}\nDOCTOR-ISSUED PRESCRIPTION\n${"=".repeat(55)}\nDate: ${new Date(c.date).toDateString()}\nDoctor: ${c.doctorName}\nDepartment: ${c.department}\nPatient: ${c.patientName}\n${"─".repeat(55)}\nVITALS\nBP: ${c.vitals.bp}  |  HR: ${c.vitals.hr} bpm  |  Temp: ${c.vitals.temp}°F\n${"─".repeat(55)}\nSYMPTOMS\n${c.symptoms}\n${"─".repeat(55)}\nRx — MEDICINES\n${c.medicines.map(m => `• ${m.name}  |  ${m.dosage}  |  ${m.duration}`).join("\n")}\n${"─".repeat(55)}\nADVICE\n${c.notes}\n${"=".repeat(55)}\n⚠ Reviewed and issued by ${c.doctorName}\n${"=".repeat(55)}`;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
  a.download = `Prescription_${c.patientName.replace(" ", "_")}_${new Date(c.date).toLocaleDateString().replace(/\//g, "-")}.txt`;
  a.click();
}

export default function DoctorPortal() {
  const [activeDoctor, setActiveDoctor] = useState(DOCTOR_PROFILES[0]);
  const [selectedPatient, setSelectedPatient] = useState<typeof STATIC_PATIENTS[0] | null>(null);
  const [selectedConsult, setSelectedConsult] = useState<ConsultationRecord | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("notes");
  const [notes, setNotes] = useState("");
  const [prescribedMeds, setPrescribedMeds] = useState([{ name: "", dosage: "", duration: "" }]);
  const { consultations, markReviewed } = useConsultationStore();
  const aiConsultations = consultations.filter(c => c.doctorName === activeDoctor.name || c.department === activeDoctor.specialty);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Doctor Selector */}
      <div className="mb-8 overflow-x-auto pb-2">
        <div className="flex gap-3 min-w-max">
          {DOCTOR_PROFILES.map(doc => (
            <button key={doc.id} onClick={() => setActiveDoctor(doc)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all whitespace-nowrap ${activeDoctor.id === doc.id ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20" : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"}`}>
              <div className={`w-6 h-6 rounded-full ${doc.avatar} flex items-center justify-center text-white text-[10px] font-bold`}>{doc.name.split(" ")[1]?.charAt(0)}</div>
              {doc.name.split(" ").slice(1).join(" ")}
            </button>
          ))}
        </div>
      </div>

      {/* Active Doctor Profile Card */}
      <motion.div key={activeDoctor.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 mb-8 text-white shadow-xl shadow-indigo-500/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className={`w-20 h-20 rounded-2xl ${activeDoctor.avatar} border-4 border-white/30 flex items-center justify-center text-white text-3xl font-bold shrink-0`}>
            {activeDoctor.name.split(" ")[1]?.charAt(0) ?? "D"}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2"><h1 className="text-2xl font-bold">{activeDoctor.name}</h1><BadgeCheck size={20} className="text-blue-200" /></div>
            <p className="text-blue-100 font-medium">{activeDoctor.specialty}</p>
            <p className="text-blue-200 text-sm">{activeDoctor.degree}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm">
              <span className="flex items-center gap-1 text-blue-100"><Star size={14} className="fill-amber-300 text-amber-300" />{activeDoctor.rating} rating</span>
              <span className="flex items-center gap-1 text-blue-100"><Users size={14} />{activeDoctor.patients.toLocaleString()} patients</span>
              <span className="flex items-center gap-1 text-blue-100"><Clock size={14} />{activeDoctor.experience} exp.</span>
              <span className="flex items-center gap-1 text-blue-100"><Activity size={14} />{activeDoctor.hospital}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">₹{activeDoctor.consultationFee}</div>
            <div className="text-blue-200 text-xs">per consultation</div>
            <div className={`mt-2 px-3 py-1 rounded-full text-xs font-bold ${activeDoctor.available ? "bg-emerald-400/20 text-emerald-200" : "bg-slate-400/20 text-slate-300"}`}>
              {activeDoctor.available ? "● Available" : "○ Unavailable"}
            </div>
          </div>
        </div>
        <p className="text-blue-100 text-sm mt-4 leading-relaxed">{activeDoctor.about}</p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { title: "Today's Appointments", value: STATIC_PATIENTS.length.toString(), icon: <Calendar size={18} className="text-blue-600" /> },
          { title: "AI Consultations", value: aiConsultations.length.toString(), icon: <Activity size={18} className="text-indigo-600" /> },
          { title: "Total Patients", value: activeDoctor.patients.toLocaleString(), icon: <Users size={18} className="text-purple-600" /> },
          { title: "Pending Reviews", value: aiConsultations.filter(c => c.status === "pending").length.toString(), icon: <HeartPulse size={18} className="text-red-500" /> },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}
            className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2"><p className="text-xs text-slate-500">{stat.title}</p><div className="p-1.5 bg-slate-50 rounded-lg">{stat.icon}</div></div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center gap-2">
            <Clock size={18} className="text-indigo-500" />
            <h2 className="font-semibold text-slate-800">Today's Schedule</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {STATIC_PATIENTS.map(p => (
              <div key={p.id} onClick={() => { setSelectedPatient(p); setSelectedConsult(null); setActiveTab("notes"); }}
                className={`p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors ${selectedPatient?.id === p.id ? "bg-indigo-50" : ""}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-600 text-sm">{p.name.charAt(0)}</div>
                  <div><p className="font-medium text-slate-800 text-sm">{p.name}</p><p className="text-xs text-slate-400">{p.time} • {p.reason}</p></div>
                </div>
                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${p.status === "completed" ? "bg-emerald-100 text-emerald-700" : p.status === "in-session" ? "bg-indigo-100 text-indigo-700 animate-pulse" : "bg-slate-100 text-slate-500"}`}>{p.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Consultations from Patient Portal */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2"><Activity size={18} className="text-purple-500" /><h2 className="font-semibold text-slate-800">AI Consultation Inbox</h2></div>
            {aiConsultations.filter(c => c.status === "pending").length > 0 && (
              <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{aiConsultations.filter(c => c.status === "pending").length} new</span>
            )}
          </div>
          {aiConsultations.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              <Activity size={32} className="mx-auto mb-2 text-slate-300" />
              No AI consultations yet. Patients can consult from the Patient Portal.
            </div>
          ) : (
            <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
              {aiConsultations.map(c => (
                <div key={c.id} onClick={() => { setSelectedConsult(c); setSelectedPatient(null); }}
                  className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${selectedConsult?.id === c.id ? "bg-purple-50" : ""}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-slate-800 text-sm">{c.patientName}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{new Date(c.date).toLocaleString()}</p>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">Symptoms: {c.symptoms}</p>
                    </div>
                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${c.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>{c.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Static Patient Drawer */}
      <AnimatePresence>
        {selectedPatient && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedPatient(null)} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-[110] flex flex-col border-l border-slate-200">
              <div className="p-5 border-b flex items-center justify-between bg-slate-50">
                <h2 className="font-semibold text-slate-800">Patient Record</h2>
                <button onClick={() => setSelectedPatient(null)} className="p-1.5 hover:bg-slate-200 rounded-full transition-colors"><X size={18} /></button>
              </div>
              <div className="p-5 border-b flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 text-xl font-bold">{selectedPatient.name.charAt(0)}</div>
                <div><h3 className="text-xl font-bold text-slate-900">{selectedPatient.name}</h3><p className="text-slate-400 text-sm">{selectedPatient.reason}</p></div>
              </div>
              <div className="flex border-b px-5">
                {(["notes","history","labs","vitals"] as Tab[]).map(t => (
                  <button key={t} onClick={() => setActiveTab(t)} className={`py-3 px-3 text-xs font-semibold capitalize border-b-2 transition-colors ${activeTab === t ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}>{t}</button>
                ))}
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                {activeTab === "notes" && (
                  <div className="space-y-4">
                    <div><p className="text-xs font-bold text-slate-400 uppercase mb-2">Symptoms</p><div className="flex flex-wrap gap-2">{selectedPatient.symptoms.map((s, i) => <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs border border-indigo-100">{s}</span>)}</div></div>
                    <div><p className="text-xs font-bold text-slate-400 uppercase mb-2">Notes</p><textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-400 min-h-[100px] resize-none" placeholder="Clinical notes..." /></div>
                    <div><p className="text-xs font-bold text-slate-400 uppercase mb-2">Prescription</p>
                      <div className="space-y-2">
                        {prescribedMeds.map((m, idx) => (
                          <div key={idx} className="flex gap-2">
                            <input placeholder="Medicine" className="flex-1 p-2 border rounded-lg text-xs" value={m.name} onChange={e => { const n=[...prescribedMeds]; n[idx].name=e.target.value; setPrescribedMeds(n); }} />
                            <input placeholder="Dosage" className="w-1/4 p-2 border rounded-lg text-xs" value={m.dosage} onChange={e => { const n=[...prescribedMeds]; n[idx].dosage=e.target.value; setPrescribedMeds(n); }} />
                            <input placeholder="Duration" className="w-1/4 p-2 border rounded-lg text-xs" value={m.duration} onChange={e => { const n=[...prescribedMeds]; n[idx].duration=e.target.value; setPrescribedMeds(n); }} />
                          </div>
                        ))}
                        <button onClick={() => setPrescribedMeds([...prescribedMeds, { name:"", dosage:"", duration:"" }])} className="text-indigo-600 text-xs hover:underline">+ Add Medicine</button>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "history" && <div className="space-y-3">{selectedPatient.history.map((h,i)=><div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl"><div className="flex justify-between mb-1"><span className="font-semibold text-sm text-slate-800">{h.type}</span><span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{h.date}</span></div><p className="text-xs text-slate-500">{h.desc}</p></div>)}</div>}
                {activeTab === "labs" && <div className="space-y-3">{selectedPatient.labs.length === 0 ? <p className="text-sm text-slate-400">No lab results.</p> : selectedPatient.labs.map((l,i)=><div key={i} className={`p-3 border rounded-xl flex items-center justify-between ${l.status==="abnormal"?"border-red-200 bg-red-50":"border-slate-200 bg-white"}`}><div className="flex items-center gap-2"><FlaskConical size={16} className={l.status==="abnormal"?"text-red-500":"text-slate-400"} /><div><p className="font-semibold text-sm text-slate-800">{l.test}</p><p className="text-xs text-slate-400">{l.date}</p></div></div><span className={`text-sm font-medium ${l.status==="abnormal"?"text-red-600":"text-slate-700"}`}>{l.result}</span></div>)}</div>}
                {activeTab === "vitals" && <div className="grid grid-cols-2 gap-3">{[["Blood Pressure",selectedPatient.vitals.bp,"mmHg"],["Heart Rate",selectedPatient.vitals.hr,"bpm"],["Temperature",selectedPatient.vitals.temp,"°F"]].map(([label,val,unit])=><div key={label} className="p-4 bg-white border border-slate-200 rounded-xl"><p className="text-xs text-slate-400 uppercase font-bold mb-1">{label}</p><p className="text-2xl font-bold text-slate-800">{val}<span className="text-xs font-normal text-slate-400 ml-1">{unit}</span></p></div>)}</div>}
              </div>
              <div className="p-5 border-t bg-white">
                <button onClick={() => { const rec: ConsultationRecord = { id: "static-"+Date.now(), patientName: selectedPatient.name, date: new Date().toISOString(), doctorName: activeDoctor.name, department: activeDoctor.specialty, symptoms: selectedPatient.symptoms.join(", "), vitals: selectedPatient.vitals, medicines: prescribedMeds.filter(m=>m.name), notes, status: "reviewed" }; downloadPrescription(rec); }}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2">
                  <FilePlus size={18} /> Issue & Download Prescription PDF
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* AI Consultation Drawer */}
      <AnimatePresence>
        {selectedConsult && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedConsult(null)} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-[110] flex flex-col border-l border-slate-200">
              <div className="p-5 border-b flex items-center justify-between bg-purple-50">
                <div><h2 className="font-semibold text-slate-800">AI Consultation Review</h2><p className="text-xs text-slate-400">{new Date(selectedConsult.date).toLocaleString()}</p></div>
                <button onClick={() => setSelectedConsult(null)} className="p-1.5 hover:bg-slate-200 rounded-full"><X size={18} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <div className="p-4 bg-white border border-slate-200 rounded-xl">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">Patient</p>
                  <p className="font-bold text-slate-800">{selectedConsult.patientName}</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">Vitals</p>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div><p className="text-slate-400 text-xs">BP</p><p className="font-bold">{selectedConsult.vitals.bp}</p></div>
                    <div><p className="text-slate-400 text-xs">HR</p><p className="font-bold">{selectedConsult.vitals.hr} bpm</p></div>
                    <div><p className="text-slate-400 text-xs">Temp</p><p className="font-bold">{selectedConsult.vitals.temp}°F</p></div>
                  </div>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">Symptoms</p>
                  <p className="text-sm text-slate-700">{selectedConsult.symptoms}</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">AI Prescribed Medicines</p>
                  <div className="space-y-2">{selectedConsult.medicines.map((m,i)=><div key={i} className="flex items-center justify-between text-sm"><span className="font-medium text-slate-800">{m.name}</span><span className="text-slate-400 text-xs">{m.dosage} • {m.duration}</span></div>)}</div>
                </div>
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                  <p className="text-xs font-bold text-amber-700 uppercase mb-1">AI Advice</p>
                  <p className="text-sm text-amber-800">{selectedConsult.notes}</p>
                </div>
              </div>
              <div className="p-5 border-t bg-white flex gap-3">
                <button onClick={() => { markReviewed(selectedConsult.id); setSelectedConsult(null); }}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition-colors">Mark Reviewed</button>
                <button onClick={() => downloadPrescription(selectedConsult)}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2">
                  <FilePlus size={16} /> Download Prescription
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
