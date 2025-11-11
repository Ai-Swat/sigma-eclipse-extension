import { create } from 'zustand';

interface SettingsStore {
  isExtension: boolean;
  isWidget: boolean;
  setIsExtension: (value: boolean) => void;
  setIsWidget: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  isExtension: true, // Default to extension mode
  isWidget: false,
  setIsExtension: (value) => set({ isExtension: value }),
  setIsWidget: (value) => set({ isWidget: value }),
}));

