import { create } from "zustand";

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
