import {create} from "zustand";
import { persist } from "zustand/middleware";
import type { CountryCode } from "../lib/countries";

// School data changes about twice a year, so browsers keep their copy for a week.
// After updating MongoDB, bump SCHOOL_DATA_VERSION to drop every visitor's cached copy on their next visit.
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
export const SCHOOL_DATA_VERSION = 1;

// Define your state interface
interface State {
  data: any[]; // Adjust type as needed
  // Which country `data` belongs to; null until loaded. Views refetch when it differs from the URL's.
  country: CountryCode | null;
  // When `data` was loaded (ms), so a reload within CACHE_TTL_MS reuses the localStorage copy
  fetchedAt: number;
  loading: boolean;
  error: string | null;
  // Skips the request when the cache is fresh for this country, unless `force` (e.g. Retry)
  fetchData: (country: CountryCode, options?: { force?: boolean }) => Promise<void>;
  setData: (data: any[], country: CountryCode) => void;
  filteredData: any[] | null; // Optional, if you want to store filtered data
  setFilteredData: (data: any[] | null) => void; // Optional, if you want to set filtered dat
  setError: (error: string | null) => void;
}

// Shared by overlapping calls (e.g. Strict Mode running effects twice)
let inFlight: { country: CountryCode; promise: Promise<void> } | null = null;

const useDataStore = create<State>()(
  persist(
    (set, get) => ({
      data: [],
      country: null,
      fetchedAt: 0,
      loading: false,
      error: null,
      setData: (data: any[], country: CountryCode) => set({ data, country, fetchedAt: Date.now() }),
      fetchData: async (country: CountryCode, { force = false } = {}) => {
        // Load the localStorage copy first so a page reload can skip the request
        if (!useDataStore.persist.hasHydrated()) await useDataStore.persist.rehydrate();
        const { data, country: cached, fetchedAt } = get();
        if (!force && cached === country && data.length && Date.now() - fetchedAt < CACHE_TTL_MS) return;
        if (inFlight?.country === country) return inFlight.promise;

        const promise = (async () => {
          set({ loading: true, error: null });
          try {
            const response = await fetch(`/api/universities?country=${country}`);
            if (!response.ok) {
              throw new Error(`Error: ${response.status}`);
            }
            const data: any[] = await response.json();
            set({ data, country, fetchedAt: Date.now(), loading: false });
          } catch (error: any) {
            set({ error: error.message || 'Unknown error', loading: false });
          } finally {
            inFlight = null;
          }
        })();
        inFlight = { country, promise };
        return promise;
      },
      filteredData: null,
      setFilteredData: (data: any[] | null) => set({ filteredData: data }),
      setError: (error: string | null) => set({ error }),
    }),
    {
      name: "finunies-schools",
      version: SCHOOL_DATA_VERSION,
      // A cache from another data version is stale: start empty so fetchData reloads
      migrate: () => ({ data: [], country: null, fetchedAt: 0 }),
      // Only the loaded schools; loading/error/filters are per session
      partialize: ({ data, country, fetchedAt }) => ({ data, country, fetchedAt }),
      // Rehydrated by fetchData after mount so server HTML matches the first client render
      skipHydration: true,
    }
  )
);

export default useDataStore;
