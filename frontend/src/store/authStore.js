import { create } from "zustand";
import { persist } from "zustand/middleware";

// Persists user + token to localStorage so login survives page refresh

const useAuthStore = create(
  persist(
    (set) => ({
      user:  null,   // { _id, name, email, role, collegeId, placementStatus }
      token: null,

      setAuth: (user, token) => set({ user, token }),

      logout: () => set({ user: null, token: null }),

      updateUser: (updates) =>
        set((state) => ({ user: { ...state.user, ...updates } })),
    }),
    {
      name: "KnowUrDrive-auth",   // localStorage key
    }
  )
);

export default useAuthStore;