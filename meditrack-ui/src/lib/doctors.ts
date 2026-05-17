// ============================================================
// MediTrack Doctor Database
// ============================================================
export interface DoctorProfile {
  id: string;
  name: string;
  specialty: string;
  degree: string;
  experience: string;
  hospital: string;
  rating: number;
  patients: number;
  about: string;
  avatar: string; // initials color
  available: boolean;
  consultationFee: number;
  languages: string[];
  symptoms: string[]; // keywords to detect this doctor
}

export const DOCTOR_PROFILES: DoctorProfile[] = [
  {
    id: "d1", name: "Dr. Sarah Jenkins", specialty: "General Medicine",
    degree: "MBBS, MD (Internal Medicine)", experience: "12 years",
    hospital: "MediTrack Central Hospital", rating: 4.8, patients: 3200,
    about: "Dr. Jenkins is an experienced general physician specialising in preventive care, chronic disease management, and routine health checkups.",
    avatar: "bg-indigo-500", available: true, consultationFee: 500,
    languages: ["English", "Hindi"],
    symptoms: ["fever", "cold", "flu", "fatigue", "weakness", "general", "checkup", "cough", "throat", "body ache"],
  },
  {
    id: "d2", name: "Dr. Rajiv Mehta", specialty: "Cardiology",
    degree: "MBBS, MD, DM (Cardiology)", experience: "18 years",
    hospital: "Heart & Vascular Institute", rating: 4.9, patients: 5100,
    about: "Dr. Mehta is a leading interventional cardiologist with expertise in heart disease, ECG interpretation, angioplasty, and cardiac rehabilitation.",
    avatar: "bg-red-500", available: true, consultationFee: 1200,
    languages: ["English", "Hindi", "Gujarati"],
    symptoms: ["chest pain", "heart", "palpitation", "shortness of breath", "hypertension", "blood pressure"],
  },
  {
    id: "d3", name: "Dr. Ananya Sharma", specialty: "Neurology",
    degree: "MBBS, MD, DM (Neurology)", experience: "14 years",
    hospital: "NeuroSciCare Institute", rating: 4.7, patients: 2800,
    about: "Dr. Sharma specialises in headache disorders, epilepsy, stroke management, and neurodegenerative conditions.",
    avatar: "bg-purple-500", available: true, consultationFee: 1000,
    languages: ["English", "Hindi"],
    symptoms: ["headache", "migraine", "dizziness", "numbness", "seizure", "memory", "confusion", "nerve"],
  },
  {
    id: "d4", name: "Dr. Priya Nair", specialty: "Orthopedics",
    degree: "MBBS, MS (Orthopedics)", experience: "10 years",
    hospital: "BonesCare Surgical Centre", rating: 4.6, patients: 2100,
    about: "Dr. Nair is an orthopaedic surgeon specialising in joint replacement, sports injuries, fractures, and spine disorders.",
    avatar: "bg-orange-500", available: false, consultationFee: 900,
    languages: ["English", "Malayalam", "Tamil"],
    symptoms: ["joint", "knee", "back", "bone", "fracture", "sprain", "shoulder", "spine", "arthritis"],
  },
  {
    id: "d5", name: "Dr. Meera Patel", specialty: "Gynecology & Obstetrics",
    degree: "MBBS, MD (OB-GYN)", experience: "15 years",
    hospital: "Women's Wellness Centre", rating: 4.9, patients: 4700,
    about: "Dr. Patel is a dedicated obstetrician and gynaecologist providing care for pregnancy, hormonal disorders, PCOD, and reproductive health.",
    avatar: "bg-pink-500", available: true, consultationFee: 1100,
    languages: ["English", "Hindi", "Gujarati"],
    symptoms: ["pregnancy", "menstrual", "period", "pcod", "pcos", "hormonal", "vaginal", "uterus", "ovary"],
  },
  {
    id: "d6", name: "Dr. Arun Gupta", specialty: "Pulmonology",
    degree: "MBBS, MD (Chest & TB)", experience: "11 years",
    hospital: "BreathEasy Lung Clinic", rating: 4.7, patients: 1900,
    about: "Dr. Gupta specialises in asthma, COPD, respiratory infections, sleep apnoea, and lung function testing.",
    avatar: "bg-cyan-500", available: true, consultationFee: 800,
    languages: ["English", "Hindi"],
    symptoms: ["breathing", "asthma", "cough", "wheezing", "lung", "breathless", "phlegm", "sputum", "tb"],
  },
  {
    id: "d7", name: "Dr. Neha Kapoor", specialty: "Gastroenterology",
    degree: "MBBS, MD, DM (Gastro)", experience: "9 years",
    hospital: "DigestiCare Hospital", rating: 4.5, patients: 1600,
    about: "Dr. Kapoor specialises in digestive disorders, endoscopy, liver disease, IBS, IBD, and nutrition-related health.",
    avatar: "bg-yellow-600", available: true, consultationFee: 950,
    languages: ["English", "Hindi", "Punjabi"],
    symptoms: ["stomach", "abdomen", "nausea", "vomiting", "diarrhea", "constipation", "acidity", "liver", "indigestion"],
  },
  {
    id: "d8", name: "Dr. Kiran Reddy", specialty: "Pediatrics",
    degree: "MBBS, MD (Pediatrics)", experience: "13 years",
    hospital: "ChildFirst Children's Hospital", rating: 4.9, patients: 6200,
    about: "Dr. Reddy is a compassionate paediatrician providing comprehensive care for newborns, infants, and children up to 18 years.",
    avatar: "bg-teal-500", available: true, consultationFee: 700,
    languages: ["English", "Hindi", "Telugu"],
    symptoms: ["child", "baby", "infant", "kid", "toddler", "newborn", "vaccination", "growth", "pediatric"],
  },
  {
    id: "d9", name: "Dr. Sameer Joshi", specialty: "Dermatology",
    degree: "MBBS, MD (Dermatology)", experience: "8 years",
    hospital: "SkinCare Aesthetic Centre", rating: 4.6, patients: 2400,
    about: "Dr. Joshi specialises in acne, eczema, psoriasis, hair loss, cosmetic dermatology, and skin cancer screening.",
    avatar: "bg-emerald-500", available: true, consultationFee: 850,
    languages: ["English", "Hindi", "Marathi"],
    symptoms: ["skin", "rash", "acne", "eczema", "itching", "hives", "allergy", "dermatitis", "hair loss"],
  },
  {
    id: "d10", name: "Dr. Rahul Verma", specialty: "ENT",
    degree: "MBBS, MS (ENT)", experience: "10 years",
    hospital: "HearClear ENT Clinic", rating: 4.7, patients: 2000,
    about: "Dr. Verma specialises in ear, nose and throat disorders, sinusitis, hearing loss, tonsillectomy, and nasal reconstruction.",
    avatar: "bg-blue-500", available: true, consultationFee: 750,
    languages: ["English", "Hindi"],
    symptoms: ["ear", "nose", "throat", "sinus", "tonsil", "hearing", "sneezing", "runny nose", "ent"],
  },
  {
    id: "d11", name: "Dr. Meenakshi Rao", specialty: "Ophthalmology",
    degree: "MBBS, MS (Ophthalmology)", experience: "16 years",
    hospital: "ClearVision Eye Hospital", rating: 4.8, patients: 3500,
    about: "Dr. Rao is an expert in cataract surgery, LASIK, glaucoma, diabetic retinopathy, and paediatric eye care.",
    avatar: "bg-violet-500", available: false, consultationFee: 1000,
    languages: ["English", "Telugu", "Tamil"],
    symptoms: ["eye", "vision", "blur", "cataract", "glaucoma", "retina", "conjunctivitis", "red eye"],
  },
  {
    id: "d12", name: "Dr. Faisal Khan", specialty: "Psychiatry",
    degree: "MBBS, MD (Psychiatry)", experience: "12 years",
    hospital: "MindWell Mental Health Centre", rating: 4.8, patients: 1800,
    about: "Dr. Khan is a compassionate psychiatrist providing evidence-based treatment for anxiety, depression, OCD, PTSD, and addiction.",
    avatar: "bg-slate-500", available: true, consultationFee: 1300,
    languages: ["English", "Hindi", "Urdu"],
    symptoms: ["anxiety", "depression", "stress", "mental", "mood", "insomnia", "sleep disorder", "panic", "ocd"],
  },
];

export function suggestDoctor(symptoms: string): DoctorProfile {
  const lower = symptoms.toLowerCase();
  for (const doc of DOCTOR_PROFILES) {
    if (doc.symptoms.some(kw => lower.includes(kw))) return doc;
  }
  return DOCTOR_PROFILES[0]; // fallback to general
}
