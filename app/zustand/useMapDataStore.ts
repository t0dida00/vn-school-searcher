import { create } from "zustand";
import type { CountryCode } from "../lib/countries";
import { COUNTRY_MAPS } from "../map/countryMaps";

// The map's schools: the slim GeoJSON bundled with the app (COUNTRY_MAPS[country].loadSchools), not the
// API's full documents, which the university list keeps in useDataStore. A school's details load when its
// dialog opens (useSchoolDetails).
interface State {
  data: any[];
  country: CountryCode | null;
  loading: boolean;
  error: string | null;
  load: (country: CountryCode) => Promise<void>;
  // The map search's matches; null means no search, so the map shows `data`
  filteredData: any[] | null;
  setFilteredData: (data: any[] | null) => void;
}

const useMapDataStore = create<State>((set, get) => ({
  data: [],
  country: null,
  loading: false,
  error: null,
  load: async (country) => {
    if (get().country === country && get().data.length) return;
    set({ loading: true, error: null, data: [], country, filteredData: null });
    try {
      const data = await COUNTRY_MAPS[country].loadSchools();
      // Navigated to another country while this one loaded
      if (get().country === country) set({ data, loading: false });
    } catch (error: any) {
      if (get().country === country) set({ error: error?.message || "Couldn't load schools", loading: false });
    }
  },
  filteredData: null,
  setFilteredData: (filteredData) => set({ filteredData }),
}));

export default useMapDataStore;
