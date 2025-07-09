import {create} from "zustand";

// Define your state interface
interface State {
  data: any[]; // Adjust type as needed
  loading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  setData: (data: any[]) => void;
  filteredData: any[] | null; // Optional, if you want to store filtered data
  setFilteredData: (data: any[] | null) => void; // Optional, if you want to set filtered dat
  setError: (error: string | null) => void;
}

const useDataStore = create<State>((set) => ({
  data: [],
  loading: false,
  error: null,
  setData: (data: any[]) => set({ data }),
  fetchData: async () => {
    set({ loading: true, error: null });
    try {
        console.log('Fetching universities from API...');
      const response = await fetch('/api/universities');
      if (!response.ok) {
        console.log( 'Response not OK:', response.status);
        throw new Error(`Error: ${response.status}`);
      }
      const data: any[] = await response.json();
      set({ data: data, loading: false });
    } catch (error: any) {
    
      set({ error: error.message || 'Unknown error', loading: false });
    }
  },
  filteredData: [],
  setFilteredData: (data: any[] | null) => set({ filteredData: data }),
  setError: (error: string | null) => set({ error }),
 })
);

export default useDataStore;
