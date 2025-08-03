import { useStore as useMainStore } from './store';

// Re-export the main store
export const useStore = useMainStore;

// Selectors for easier access
export const useUser = () => useStore((state) => state.user);
export const useProgress = () => useStore((state) => state.progress);
export const useCurrentSection = () => useStore((state) => state.currentSection);
export const useSetCurrentSection = () => useStore((state) => state.setCurrentSection);
export const useAudioSettings = () => useStore((state) => state.audioSettings);
export const useMascotAnimation = () => useStore((state) => state.currentSection); // Using currentSection as mascotAnimation for now 