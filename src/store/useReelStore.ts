import { create } from 'zustand';

interface ReelState {
    text: string;
    fontSize: number;
    backgroundColor: string;
    textColor: string;
    duration: number; // in seconds

    // Actions
    setText: (text: string) => void;
    setFontSize: (size: number) => void;
    setBackgroundColor: (color: string) => void;
    setTextColor: (color: string) => void;
    setDuration: (duration: number) => void;
    reset: () => void;
}

const initialState = {
    text: "Reels Maker",
    fontSize: 72,
    backgroundColor: "#000000",
    textColor: "#ffffff",
    duration: 5,
};

export const useReelStore = create<ReelState>((set) => ({
    ...initialState,

    setText: (text) => set({ text }),
    setFontSize: (fontSize) => set({ fontSize }),
    setBackgroundColor: (backgroundColor) => set({ backgroundColor }),
    setTextColor: (textColor) => set({ textColor }),
    setDuration: (duration) => set({ duration }),
    reset: () => set(initialState),
}));
