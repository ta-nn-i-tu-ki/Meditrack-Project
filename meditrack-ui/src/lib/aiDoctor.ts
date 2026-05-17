import { DOCTOR_PROFILES } from "./doctors";

export interface Vitals {
  BloodPressure: string;
  HeartRate: string;
  Temperature: string;
}

export interface PrescriptionResult {
  recommendedDepartment: string;
  suggestedDoctor: string;
  doctorId: string;
  medicines: { name: string; dosage: string; duration: string }[];
  notes: string;
}

// ── Simple markdown bold renderer ────────────────────────────────
// Used by the patient dashboard to render **bold** in AI responses.
// Exported so the UI can use it directly.
export function renderMarkdownText(text: string): string {
  return text; // Raw text; the UI component handles rendering
}

// ── Fallback Rule Engine (used when API is unavailable) ──────────
interface SpecialtyRule {
  keywords: string[];
  doctorId: string;
  medicines: { name: string; dosage: string; duration: string }[];
  notes: string;
}

const FALLBACK_RULES: SpecialtyRule[] = [
  { keywords: ["chest","heart","palpitation","breathless"], doctorId: "d2",
    medicines: [{ name: "Aspirin", dosage: "75mg once daily", duration: "30 days" }, { name: "Metoprolol", dosage: "25mg once daily", duration: "30 days" }],
    notes: "Avoid strenuous activity. Monitor BP daily. Seek emergency care for sudden severe pain." },
  { keywords: ["headache","migraine","throbbing","head"], doctorId: "d3",
    medicines: [{ name: "Sumatriptan", dosage: "50mg at onset", duration: "As needed" }, { name: "Paracetamol", dosage: "500mg every 6hrs", duration: "3 days" }],
    notes: "Rest in a dark quiet room. Stay hydrated. Identify and avoid triggers." },
  { keywords: ["knee","back","joint","bone","fracture","sprain","shoulder"], doctorId: "d4",
    medicines: [{ name: "Ibuprofen", dosage: "400mg three times daily with food", duration: "7 days" }, { name: "Diclofenac Gel", dosage: "Apply 3 times daily", duration: "10 days" }],
    notes: "Rest and apply ice. Avoid heavy lifting. Consider physiotherapy." },
  { keywords: ["pregnancy","menstrual","period","pcod","pcos","hormonal"], doctorId: "d5",
    medicines: [{ name: "Folic Acid", dosage: "5mg once daily", duration: "90 days" }, { name: "Iron Supplement", dosage: "200mg once daily", duration: "60 days" }],
    notes: "Maintain balanced diet. Reduce caffeine. Follow up with regular blood tests." },
  { keywords: ["cough","asthma","wheeze","lung","breathing","breathless"], doctorId: "d6",
    medicines: [{ name: "Salbutamol Inhaler", dosage: "2 puffs every 4-6 hrs", duration: "As needed" }, { name: "Montelukast", dosage: "10mg once daily", duration: "14 days" }],
    notes: "Avoid allergens and smoke. Stay in well-ventilated areas." },
  { keywords: ["stomach","abdomen","nausea","vomiting","diarrhea","acidity","bloating"], doctorId: "d7",
    medicines: [{ name: "Pantoprazole", dosage: "40mg before breakfast", duration: "14 days" }, { name: "Ondansetron", dosage: "4mg every 8hrs", duration: "3 days" }],
    notes: "Eat small frequent meals. Avoid spicy/oily food. Stay hydrated." },
  { keywords: ["child","baby","infant","kid","toddler","son","daughter"], doctorId: "d8",
    medicines: [{ name: "Paracetamol Syrup", dosage: "10mg/kg every 6hrs", duration: "3 days" }, { name: "ORS", dosage: "After every loose stool", duration: "Until recovered" }],
    notes: "Keep child hydrated. Monitor temperature. Watch for danger signs." },
  { keywords: ["skin","rash","acne","eczema","itching","hives","allergy"], doctorId: "d9",
    medicines: [{ name: "Cetirizine", dosage: "10mg once daily", duration: "7 days" }, { name: "Hydrocortisone Cream 1%", dosage: "Apply twice daily", duration: "7 days" }],
    notes: "Avoid scratching. Wear loose cotton clothing. Use fragrance-free products." },
  { keywords: ["ear","nose","sinus","tonsil","throat","cold","runny"], doctorId: "d10",
    medicines: [{ name: "Amoxicillin", dosage: "500mg twice daily", duration: "5 days" }, { name: "Xylometazoline Nasal Spray", dosage: "2 sprays twice daily", duration: "3 days" }],
    notes: "Steam inhalation twice daily. Gargle with warm salt water. Stay hydrated." },
  { keywords: ["eye","vision","blur","conjunctivitis","red eye"], doctorId: "d11",
    medicines: [{ name: "Moxifloxacin Eye Drops", dosage: "1 drop 4 times daily", duration: "5 days" }, { name: "Lubricant Eye Drops", dosage: "As needed", duration: "Ongoing" }],
    notes: "Do not rub eyes. Wash hands before applying drops. Avoid contact lenses during infection." },
  { keywords: ["anxiety","depression","stress","mental","insomnia","sleep","panic"], doctorId: "d12",
    medicines: [{ name: "Sertraline", dosage: "50mg once daily", duration: "6 weeks minimum" }, { name: "Melatonin", dosage: "5mg at bedtime", duration: "30 days" }],
    notes: "You are not alone. Regular exercise and mindfulness help significantly. Never stop medications abruptly." },
];

function fallbackDetect(text: string): SpecialtyRule {
  const lower = text.toLowerCase();
  for (const rule of FALLBACK_RULES) {
    if (rule.keywords.some(k => lower.includes(k))) return rule;
  }
  return FALLBACK_RULES[0];
}

// ── Fallback Stage Engine ─────────────────────────────────────────
const FOLLOW_UP_QUESTIONS = [
  (complaint: string) =>
    `Thank you for sharing that. To understand your condition better:\n\n📅 **When did this ${complaint} first start?** Was the onset sudden (within hours) or did it develop gradually?\n\nAlso — is it **constant** throughout the day, or does it come and go?`,
  () =>
    `Understood. A few more questions:\n\n📊 **On a scale of 1–10, how severe is the discomfort?** (1 = barely noticeable, 10 = worst ever)\n\nIs it **affecting your daily activities** — work, sleep, or eating?`,
  (complaint: string) =>
    `Got it. Besides the ${complaint}, are you also experiencing any of the following?\n\n• Fever or chills\n• Nausea or vomiting\n• Fatigue or weakness\n• Dizziness or lightheadedness\n• Any other unusual symptom\n\nPlease mention anything, even if it seems unrelated.`,
  () =>
    `Very helpful. Now about your **medical background**:\n\n🏥 Do you have any existing conditions such as:\n• Diabetes, Hypertension, Thyroid, Asthma, or Heart disease?\n• Any previous surgeries or hospitalisations?\n• Any chronic conditions you are currently being treated for?`,
  () =>
    `Important — **are you currently taking any medications**, including:\n\n💊 Prescription drugs, over-the-counter medicines, vitamins, supplements, or herbal remedies?\n\nIf yes, please list them with the dose if you know it.`,
  () =>
    `Almost done — just a couple more:\n\n⚠️ **Are you allergic to any medications, foods, or substances?**\n\nAnd briefly — **do you smoke, drink alcohol, or have any significant dietary habits** I should know about? This helps me recommend the safest treatment.`,
];

function buildFallbackFinal(
  history: { role: string; content: string }[],
  vitals: Vitals,
  rule: SpecialtyRule
): { text: string; prescription: PrescriptionResult } {
  const userMessages = history.filter(m => m.role === "user");
  const doctor = DOCTOR_PROFILES.find(d => d.id === rule.doctorId) ?? DOCTOR_PROFILES[0];
  const vitalsText = vitals.BloodPressure
    ? `BP: ${vitals.BloodPressure} | HR: ${vitals.HeartRate} bpm | Temp: ${vitals.Temperature}°F`
    : "Not recorded";

  const text = `Thank you for your patience. I now have a complete picture of your health. Here is my **clinical assessment**:

---

**🩺 Clinical Summary**
• **Chief Complaint:** ${userMessages[0]?.content ?? "—"}
• **Onset:** ${userMessages[1]?.content ?? "—"}
• **Severity:** ${userMessages[2]?.content ?? "—"}
• **Associated Symptoms:** ${userMessages[3]?.content ?? "—"}
• **Medical History:** ${userMessages[4]?.content ?? "—"}
• **Current Medications:** ${userMessages[5]?.content ?? "None"}
• **Allergies / Lifestyle:** ${userMessages[6]?.content ?? "None"}
• **Vitals:** ${vitalsText}

---

**🏥 Specialist Recommendation**
Based on your complete history, I am referring you to **${doctor.specialty}**.
Your specialist: **${doctor.name}** (${doctor.degree})

---

**💊 Provisional Prescription (Rx)**

${rule.medicines.map((m, i) => `${i + 1}. **${m.name}**\n   • Dose: ${m.dosage}\n   • Duration: ${m.duration}`).join("\n\n")}

---

**📋 Advice**
${rule.notes}

---

⚠️ *This is an AI-assisted provisional recommendation. Your assigned doctor will review and confirm this at your appointment.*

✅ Your **Prescription** and **Appointment Letter** are ready to download below.`;

  return {
    text,
    prescription: {
      recommendedDepartment: doctor.specialty,
      suggestedDoctor: doctor.name,
      doctorId: doctor.id,
      medicines: rule.medicines,
      notes: rule.notes,
    },
  };
}

// ── Main Export ──────────────────────────────────────────────────
export async function getAiDoctorResponse(
  history: { role: string; content: string }[],
  vitals: Vitals,
  newMessage: string,
  fixedDoctorId?: string
): Promise<{ text: string; prescription?: PrescriptionResult }> {
  const updatedHistory = [...history, { role: "user", content: newMessage }];
  const userTurnCount = history.filter(m => m.role === "user").length;

  // ── Try the NVIDIA LLM via server-side API route ─────────────
  try {
    const res = await fetch("/api/consult", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: updatedHistory, vitals }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.text) {
        return { text: data.text, prescription: data.prescription ?? undefined };
      }
    }
    // If API returned an error, fall through to fallback
    console.warn("NVIDIA API unavailable, using fallback engine.");
  } catch (err) {
    console.warn("Fetch to /api/consult failed, using fallback engine:", err);
  }

  // ── Fallback: Local rule-based engine ────────────────────────
  await new Promise(r => setTimeout(r, 800 + Math.random() * 600));

  const allUserText = updatedHistory.filter(m => m.role === "user").map(m => m.content).join(" ");
  const chiefComplaint = history.filter(m => m.role === "user")[0]?.content ?? newMessage;

  if (userTurnCount === 0) {
    let reply = "Thank you for consulting me today. I want to conduct a thorough assessment before making any recommendations — I'll ask you a series of questions.\n\n";
    const [sys] = (vitals.BloodPressure || "0/0").split("/").map(Number);
    if (!isNaN(sys) && sys >= 140) reply += `⚠️ I've noted your BP (${vitals.BloodPressure} mmHg) is elevated — I'll factor this in.\n\n`;
    const hr = parseInt(vitals.HeartRate || "0");
    if (!isNaN(hr) && hr > 100) reply += `⚠️ Your heart rate (${vitals.HeartRate} bpm) is elevated — I'll keep this in mind.\n\n`;
    const temp = parseFloat(vitals.Temperature || "0");
    if (!isNaN(temp) && temp >= 101) reply += `🌡️ You appear to have a fever (${vitals.Temperature}°F) — noted.\n\n`;
    reply += FOLLOW_UP_QUESTIONS[0](chiefComplaint);
    return { text: reply };
  }

  if (userTurnCount >= 1 && userTurnCount <= 5) {
    const q = FOLLOW_UP_QUESTIONS[userTurnCount](chiefComplaint);
    return { text: q };
  }

  // Final: provide full assessment
  const rule = fixedDoctorId
    ? FALLBACK_RULES.find(r => r.doctorId === fixedDoctorId) ?? fallbackDetect(allUserText)
    : fallbackDetect(allUserText);

  return buildFallbackFinal(updatedHistory, vitals, rule);
}
