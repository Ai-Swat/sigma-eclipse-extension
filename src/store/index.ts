// Store exports

export * from './types';
export * from './settings';

// Placeholder for useSearchStore - stub implementation
import { create } from 'zustand';

interface SearchStore {
  activeAgentThreads: any[];
  searchHash?: string;
  rewriteFollowUp: (args: any) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  activeAgentThreads: [],
  searchHash: undefined,
  rewriteFollowUp: (args: any) => {
    console.log('rewriteFollowUp called with:', args);
  },
}));

// Placeholder for useVirtualKeyboardStore
interface VirtualKeyboardStore {
  height: number;
  isVirtualKeyboardOpen: boolean;
}

export const useVirtualKeyboardStore = create<VirtualKeyboardStore>((set) => ({
  height: 0,
  isVirtualKeyboardOpen: false,
}));

