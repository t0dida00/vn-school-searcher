import { useEffect } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  ids: string[];
  toggle: (id: string) => void;
}

const useSavedStore = create<State>()(
  persist(
    (set) => ({
      ids: [],
      toggle: (id) => set((s) => ({ ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id] })),
    }),
    // Rehydrated in an effect so server HTML (always "not saved") matches the first client render
    { name: "finunies-saved", skipHydration: true }
  )
);

/** Saved school ids, loaded from localStorage after mount */
export function useSavedIds() {
  useEffect(() => {
    if (!useSavedStore.persist.hasHydrated()) useSavedStore.persist.rehydrate();
  }, []);
  return useSavedStore((s) => s.ids);
}

export default useSavedStore;
