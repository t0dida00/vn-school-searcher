import {create} from "zustand";

// Define your state interface
interface State {
  points: any[]; // Adjust type as needed
  setPoints: (points: any[]) => void;
  selectedPoint: any; // Optional selected point
  setSelectedPoint: (point: any) => void; // Optional setter for selected point
  isOpen: boolean; // Optional state for dialog open
  setIsOpen: (isOpen: boolean) => void; // Optional setter for dialog
}

const useStore = create<State>((set) => ({
  points: [], 
 setPoints: (points) => set({ points }),
  selectedPoint: undefined,
  setSelectedPoint: (point) => set({ selectedPoint: point}),
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
 })
);

export default useStore;
