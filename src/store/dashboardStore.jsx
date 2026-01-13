import { create } from "zustand";

export const useDashboardStore = create((set) => ({
  selectedCategory: null,
  selectedLaporan: null,
  openDrilldown: (category) => set({ selectedCategory: category }),
  closeDrilldown: () => set({ selectedCategory: null }),
  setCategory: (category) => set({ selectedCategory: category }),
  openLaporanDetail: (laporan) => set({ selectedLaporan: laporan }),
  closeLaporanDetail: () => set({ selectedLaporan: null })
}));
