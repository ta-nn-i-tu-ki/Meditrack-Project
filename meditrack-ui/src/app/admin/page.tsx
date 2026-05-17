"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileDown, ChevronRight, X, Pill, ShieldCheck, AlertTriangle, BookOpen } from "lucide-react";
import { useState } from "react";

interface Disease {
  id: string; name: string; category: string; emoji: string;
  description: string; symptoms: string[];
  causes: string[]; medicines: { name: string; dosage: string; notes: string }[];
  homeRemedies: string[]; warnings: string[]; doctorVisit: string;
}

const DISEASES: Disease[] = [
  { id: "flu", name: "Influenza (Flu)", category: "Respiratory", emoji: "🤧",
    description: "A contagious respiratory illness caused by influenza viruses that infect the nose, throat, and sometimes the lungs.",
    symptoms: ["High fever (100–104°F)", "Body aches and chills", "Severe fatigue", "Sore throat", "Runny or stuffy nose", "Dry cough"],
    causes: ["Influenza A/B virus", "Airborne transmission", "Contact with infected person"],
    medicines: [{ name: "Oseltamivir (Tamiflu)", dosage: "75mg twice daily for 5 days", notes: "Most effective within 48hrs of symptoms" }, { name: "Paracetamol", dosage: "500–1000mg every 6 hrs", notes: "For fever and pain relief" }, { name: "Cetirizine", dosage: "10mg once daily", notes: "For runny nose and sneezing" }],
    homeRemedies: ["Drink warm fluids (ginger tea, broth)", "Rest in a warm, humid room", "Honey and lemon in warm water", "Steam inhalation twice a day"],
    warnings: ["Seek emergency care if breathing is difficult", "Avoid aspirin in children (risk of Reye's syndrome)", "Pregnant women should consult a doctor immediately"],
    doctorVisit: "If fever exceeds 103°F, lasts more than 5 days, or you have difficulty breathing."
  },
  { id: "migraine", name: "Migraine", category: "Neurology", emoji: "🧠",
    description: "A neurological condition characterised by recurrent, throbbing headaches — often on one side of the head — accompanied by nausea and light sensitivity.",
    symptoms: ["Throbbing one-sided headache", "Nausea and vomiting", "Sensitivity to light and sound", "Visual aura (flashing lights)", "Dizziness"],
    causes: ["Hormonal changes", "Stress and anxiety", "Certain foods (chocolate, aged cheese)", "Bright lights or loud sounds", "Sleep disruption"],
    medicines: [{ name: "Sumatriptan", dosage: "50–100mg at onset", notes: "Triptan class — very effective for acute attack" }, { name: "Ibuprofen", dosage: "400–600mg at onset", notes: "NSAID for mild to moderate attacks" }, { name: "Metoclopramide", dosage: "10mg when needed", notes: "For associated nausea and vomiting" }],
    homeRemedies: ["Rest in a dark, quiet room", "Apply cold or warm compress on forehead", "Caffeine in small amounts may help early-stage migraine", "Stay well hydrated"],
    warnings: ["Sudden severe 'thunderclap' headache — call emergency services", "Headache with neck stiffness and fever", "Headache after head injury"],
    doctorVisit: "If migraines occur more than 4 times per month or last longer than 72 hours."
  },
  { id: "hypertension", name: "Hypertension (High BP)", category: "Cardiology", emoji: "❤️",
    description: "A chronic condition where blood pressure in the arteries is persistently elevated, putting strain on the heart and blood vessels.",
    symptoms: ["Often no symptoms (silent killer)", "Headaches (back of head, mornings)", "Dizziness", "Shortness of breath", "Nosebleeds in severe cases"],
    causes: ["High salt diet", "Obesity and physical inactivity", "Genetics and family history", "Stress", "Smoking and excessive alcohol"],
    medicines: [{ name: "Amlodipine", dosage: "5–10mg once daily", notes: "Calcium channel blocker — first-line treatment" }, { name: "Losartan", dosage: "50–100mg once daily", notes: "ARB — especially for diabetic patients" }, { name: "Hydrochlorothiazide", dosage: "12.5–25mg once daily", notes: "Diuretic — reduces fluid retention" }],
    homeRemedies: ["DASH diet (low sodium, high potassium)", "Regular aerobic exercise 30 mins/day", "Reduce alcohol and quit smoking", "Stress management — yoga, meditation"],
    warnings: ["BP above 180/120 is a hypertensive crisis — call emergency", "Never stop medications suddenly", "Monitor BP at home daily"],
    doctorVisit: "Any reading above 140/90 mmHg on two separate occasions."
  },
  { id: "diabetes", name: "Type 2 Diabetes", category: "Endocrinology", emoji: "🩸",
    description: "A metabolic disorder where the body cannot effectively use insulin, leading to elevated blood sugar levels.",
    symptoms: ["Frequent urination", "Excessive thirst", "Unexplained weight loss", "Blurry vision", "Slow-healing wounds", "Tingling in hands/feet"],
    causes: ["Obesity and sedentary lifestyle", "Family history", "Unhealthy diet (high refined sugar)", "Age over 45", "Gestational diabetes history"],
    medicines: [{ name: "Metformin", dosage: "500–1000mg twice daily with food", notes: "First-line medication; reduces liver glucose production" }, { name: "Sitagliptin", dosage: "100mg once daily", notes: "DPP-4 inhibitor; safe with low hypoglycemia risk" }, { name: "Insulin Glargine", dosage: "As prescribed by doctor", notes: "Long-acting insulin for advanced stages" }],
    homeRemedies: ["Low-carb, high-fibre diet", "30 mins of walking daily", "Monitor blood glucose regularly", "Bitter gourd (karela) juice — natural glucose regulation", "Fenugreek seeds soaked overnight"],
    warnings: ["Blood glucose below 70 mg/dL — immediate sugar intake needed", "Wounds that don't heal — risk of gangrene", "Never skip meals while on insulin"],
    doctorVisit: "Immediately if fasting blood sugar is above 126 mg/dL on two tests."
  },
  { id: "asthma", name: "Asthma", category: "Pulmonology", emoji: "🫁",
    description: "A chronic lung condition that inflames and narrows the airways, causing wheezing, breathlessness, and chest tightness.",
    symptoms: ["Wheezing (whistling sound while breathing)", "Shortness of breath", "Chest tightness", "Persistent cough — worse at night", "Triggered by exercise or allergens"],
    causes: ["Allergens (dust, pollen, pet dander)", "Air pollution and smoke", "Respiratory infections", "Cold air or exercise", "Genetic predisposition"],
    medicines: [{ name: "Salbutamol Inhaler", dosage: "2 puffs every 4–6 hours as needed", notes: "Reliever inhaler — fast-acting bronchodilator" }, { name: "Beclomethasone Inhaler", dosage: "100–200mcg twice daily", notes: "Preventer inhaler — reduces airway inflammation" }, { name: "Montelukast", dosage: "10mg once at bedtime", notes: "Leukotriene receptor antagonist for chronic control" }],
    homeRemedies: ["Avoid known triggers (dust, smoke, pets)", "Keep home humidity below 50%", "Breathing exercises (Buteyko technique)", "Warm liquids to ease airways", "Ginger tea with honey"],
    warnings: ["Blue lips or fingernails — call emergency immediately", "Unable to speak full sentences — severe attack", "Reliever inhaler not working — go to ER"],
    doctorVisit: "If you need your reliever inhaler more than 3 times per week."
  },
  { id: "gastritis", name: "Gastritis", category: "Gastroenterology", emoji: "🫃",
    description: "Inflammation of the stomach lining, causing pain, nausea, and indigestion.",
    symptoms: ["Burning stomach pain (worsens on empty stomach)", "Nausea and vomiting", "Bloating and belching", "Indigestion", "Loss of appetite", "Dark tarry stools (severe cases)"],
    causes: ["H. pylori bacterial infection", "Excessive NSAID use (ibuprofen, aspirin)", "Alcohol and spicy food", "Stress", "Bile reflux"],
    medicines: [{ name: "Pantoprazole", dosage: "40mg once daily before breakfast", notes: "PPI — reduces stomach acid production" }, { name: "Clarithromycin + Amoxicillin", dosage: "500mg twice daily for 7 days", notes: "For H. pylori eradication (triple therapy)" }, { name: "Antacid (Gelusil/Digene)", dosage: "2 tablets after meals", notes: "Immediate relief from acidity" }],
    homeRemedies: ["Eat small, frequent meals", "Avoid spicy, oily, and acidic foods", "Ginger tea before meals", "Cold milk for immediate acidity relief", "Avoid lying down immediately after eating"],
    warnings: ["Vomiting blood or coffee-ground coloured vomit — emergency", "Severe sudden abdominal pain — could be perforation", "Unexplained weight loss with gastritis — rule out cancer"],
    doctorVisit: "If pain is severe, persistent for more than 1 week, or you see blood in stool/vomit."
  },
  { id: "uti", name: "Urinary Tract Infection (UTI)", category: "Urology", emoji: "🦠",
    description: "A bacterial infection affecting any part of the urinary system — kidneys, bladder, or urethra.",
    symptoms: ["Burning sensation while urinating", "Frequent urge to urinate", "Cloudy or strong-smelling urine", "Pink or red urine (blood)", "Pelvic pain (in women)", "Fever if infection reaches kidneys"],
    causes: ["E. coli bacteria (most common)", "Poor hygiene", "Sexual activity", "Urinary catheter use", "Kidney stones blocking urine flow"],
    medicines: [{ name: "Nitrofurantoin", dosage: "100mg twice daily for 5 days", notes: "First-line for uncomplicated UTI" }, { name: "Trimethoprim-Sulfamethoxazole", dosage: "160/800mg twice daily for 3 days", notes: "Effective but check local resistance patterns" }, { name: "Phenazopyridine", dosage: "200mg thrice daily after meals", notes: "Urinary analgesic for pain relief (not antibiotic)" }],
    homeRemedies: ["Drink 8–10 glasses of water daily", "Unsweetened cranberry juice", "Avoid caffeine and alcohol", "Urinate immediately after sexual intercourse", "Wear cotton underwear"],
    warnings: ["High fever with back pain — kidney infection, needs urgent care", "UTI in men — always consult doctor", "Recurrent UTIs (>3 per year) — further investigation needed"],
    doctorVisit: "Always consult for antibiotic prescription. Do not self-medicate with leftover antibiotics."
  },
  { id: "anxiety", name: "Anxiety Disorder", category: "Psychiatry", emoji: "🧘",
    description: "A mental health condition characterised by persistent, excessive worry that interferes with daily activities.",
    symptoms: ["Persistent worrying thoughts", "Restlessness and irritability", "Difficulty concentrating", "Muscle tension", "Sleep disturbances", "Rapid heartbeat or panic attacks"],
    causes: ["Genetic predisposition", "Chronic stress", "Trauma or life events", "Medical conditions (thyroid, heart)", "Caffeine or substance misuse"],
    medicines: [{ name: "Sertraline", dosage: "50mg once daily (morning)", notes: "SSRI — takes 4–6 weeks for full effect" }, { name: "Buspirone", dosage: "5–10mg twice or three times daily", notes: "Non-habit-forming anxiolytic" }, { name: "Clonazepam", dosage: "0.25–0.5mg as needed", notes: "Benzodiazepine — short-term only; risk of dependence" }],
    homeRemedies: ["Daily exercise — 30 mins aerobic activity", "Diaphragmatic breathing (4-7-8 technique)", "Journaling thoughts and feelings", "Reduce caffeine intake", "Mindfulness meditation apps (Headspace, Calm)"],
    warnings: ["Never stop SSRIs suddenly — taper under doctor supervision", "Thoughts of self-harm — call emergency or crisis line immediately", "Benzodiazepines can cause dependence — use only as prescribed"],
    doctorVisit: "If anxiety is affecting work, relationships, or quality of life for more than 2 weeks."
  },
];

const CATEGORIES = ["All", ...Array.from(new Set(DISEASES.map(d => d.category)))];

export default function DiseasePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<Disease | null>(null);

  const filtered = DISEASES.filter(d =>
    (category === "All" || d.category === category) &&
    (d.name.toLowerCase().includes(search.toLowerCase()) || d.category.toLowerCase().includes(search.toLowerCase()) || d.symptoms.some(s => s.toLowerCase().includes(search.toLowerCase())))
  );

  const downloadGuide = (d: Disease) => {
    const text = `MEDITRACK — DISEASE GUIDE\n${"=".repeat(60)}\n${d.emoji} ${d.name.toUpperCase()}\nCategory: ${d.category}\n${"=".repeat(60)}\nDESCRIPTION\n${d.description}\n${"─".repeat(60)}\nSYMPTOMS\n${d.symptoms.map(s => `• ${s}`).join("\n")}\n${"─".repeat(60)}\nCAUSES\n${d.causes.map(c => `• ${c}`).join("\n")}\n${"─".repeat(60)}\nRx — MEDICINES (Consult doctor before use)\n${d.medicines.map(m => `• ${m.name}\n  Dose: ${m.dosage}\n  Note: ${m.notes}`).join("\n")}\n${"─".repeat(60)}\nHOME REMEDIES\n${d.homeRemedies.map(r => `• ${r}`).join("\n")}\n${"─".repeat(60)}\n⚠ WARNINGS\n${d.warnings.map(w => `• ${w}`).join("\n")}\n${"─".repeat(60)}\nWHEN TO SEE A DOCTOR\n${d.doctorVisit}\n${"=".repeat(60)}\nMediTrack Disease Guide | support@meditrack.com\n${"=".repeat(60)}`;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    a.download = `${d.name.replace(/ /g,"_")}_Guide.txt`; a.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Disease Encyclopedia</h1>
        <p className="text-slate-500 mt-1">Search any condition for symptoms, medications, and care guides. Available 24/7 when your doctor is offline.</p>
      </div>

      {/* Search + Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
            placeholder="Search disease, symptom, or category..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${category === cat ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Disease Grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {filtered.map((d, i) => (
          <motion.div key={d.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            onClick={() => setSelected(d)}
            className="bg-white border border-slate-200 rounded-2xl p-5 cursor-pointer hover:shadow-md hover:border-indigo-200 transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className="text-3xl">{d.emoji}</div>
              <span className="text-[10px] font-bold uppercase text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">{d.category}</span>
            </div>
            <h3 className="font-bold text-slate-900 mb-1">{d.name}</h3>
            <p className="text-xs text-slate-500 line-clamp-2 mb-3">{d.description}</p>
            <div className="flex flex-wrap gap-1 mb-4">{d.symptoms.slice(0, 3).map((s, si) => <span key={si} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{s}</span>)}</div>
            <div className="flex items-center justify-between text-xs text-indigo-600 font-semibold group-hover:gap-2 transition-all">
              <span>View Full Guide</span><ChevronRight size={14} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Disease Detail Drawer */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl z-[110] flex flex-col border-l border-slate-200 overflow-hidden">
              <div className="p-5 border-b flex items-center justify-between bg-gradient-to-r from-indigo-50 to-blue-50">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{selected.emoji}</span>
                  <div><h2 className="font-bold text-slate-900 text-lg">{selected.name}</h2><p className="text-indigo-600 text-xs font-semibold">{selected.category}</p></div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => downloadGuide(selected)} className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors"><FileDown size={13} /> Download Guide</button>
                  <button onClick={() => setSelected(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={18} /></button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                <p className="text-slate-600 text-sm leading-relaxed">{selected.description}</p>

                {/* Symptoms */}
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                  <h3 className="font-bold text-amber-800 text-sm mb-3 flex items-center gap-2"><AlertTriangle size={16} /> Common Symptoms</h3>
                  <div className="grid grid-cols-2 gap-1.5">{selected.symptoms.map((s,i)=><div key={i} className="flex items-center gap-2 text-xs text-amber-700"><div className="w-1.5 h-1.5 bg-amber-400 rounded-full shrink-0"/>{s}</div>)}</div>
                </div>

                {/* Medicines */}
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                  <h3 className="font-bold text-blue-800 text-sm mb-3 flex items-center gap-2"><Pill size={16} /> Recommended Medicines</h3>
                  <div className="space-y-3">{selected.medicines.map((m,i)=>(
                    <div key={i} className="bg-white rounded-xl p-3 border border-blue-100">
                      <div className="flex items-start justify-between"><p className="font-bold text-slate-800 text-sm">{m.name}</p><span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-mono">{m.dosage}</span></div>
                      <p className="text-xs text-slate-400 mt-1">{m.notes}</p>
                    </div>
                  ))}</div>
                  <p className="text-xs text-blue-600 mt-3 font-medium">⚠ Always consult a doctor before taking any medication.</p>
                </div>

                {/* Home Remedies */}
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                  <h3 className="font-bold text-emerald-800 text-sm mb-3 flex items-center gap-2"><ShieldCheck size={16} /> Home Remedies & Self-Care</h3>
                  <div className="space-y-1.5">{selected.homeRemedies.map((r,i)=><div key={i} className="flex items-start gap-2 text-xs text-emerald-700"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1 shrink-0"/>{r}</div>)}</div>
                </div>

                {/* Warnings */}
                <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
                  <h3 className="font-bold text-red-800 text-sm mb-3 flex items-center gap-2"><AlertTriangle size={16} /> Red Flag Warnings</h3>
                  <div className="space-y-1.5">{selected.warnings.map((w,i)=><div key={i} className="flex items-start gap-2 text-xs text-red-700"><div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1 shrink-0"/>{w}</div>)}</div>
                </div>

                {/* When to see a doctor */}
                <div className="bg-slate-900 rounded-2xl p-4">
                  <h3 className="font-bold text-white text-sm mb-2 flex items-center gap-2"><BookOpen size={16} /> When to See a Doctor</h3>
                  <p className="text-slate-300 text-xs leading-relaxed">{selected.doctorVisit}</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
