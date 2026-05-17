import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  user: { id: string; email: string; role: string; token: string } | null;
  setUser: (user: any) => void;
  logout: () => void;
}

export const useAppStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

// ─── Shared Consultation Store ───────────────────────────────────
export interface ConsultationRecord {
  id: string;
  patientName: string;
  date: string;       // ISO string
  doctorName: string;
  department: string;
  symptoms: string;
  vitals: { bp: string; hr: string; temp: string };
  medicines: { name: string; dosage: string; duration: string }[];
  notes: string;
  status: "pending" | "reviewed";
}

interface ConsultationState {
  consultations: ConsultationRecord[];
  addConsultation: (c: ConsultationRecord) => void;
  markReviewed: (id: string) => void;
}

export const useConsultationStore = create<ConsultationState>()(
  persist(
    (set) => ({
      consultations: [],
      addConsultation: (c) =>
        set((state) => ({ consultations: [c, ...state.consultations] })),
      markReviewed: (id) =>
        set((state) => ({
          consultations: state.consultations.map((c) =>
            c.id === id ? { ...c, status: "reviewed" } : c
          ),
        })),
    }),
    { name: "meditrack-consultations" }
  )
);
