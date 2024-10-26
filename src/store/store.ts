import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// type for store
type MainStore = {
  verifyToken: string | null;
  //setting token during signup
  setVerifyToken: (token: string | null) => void;

  //clearing token after registration
  clearVerifyToken: () => void;
};

export const useTokenStore = create<MainStore>()(
  persist(
    (set) => ({
      verifyToken: null,

      // Actions to update the state
      setVerifyToken: (token) => set({ verifyToken: token }),
      clearVerifyToken: () => set({ verifyToken: null }),
    }),
    {
      // unique name for the storage key
      name: "verification-storage",

      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
