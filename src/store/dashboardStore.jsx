import { create } from "zustand";

export const useDashboardStore = create((set) => ({
  selectedCategory: null,
  selectedLaporan: null,

  filterNegeri: null,
  filterJenis: null,

  openDrilldown: (category) =>
    set({ selectedCategory: category }),

  closeDrilldown: () =>
    set({ selectedCategory: null }),

  setCategory: (category) =>
    set({ selectedCategory: category }),

  openLaporanDetail: (laporan) =>
    set({ selectedLaporan: laporan }),

  closeLaporanDetail: () =>
    set({ selectedLaporan: null }),

  setChartFilter: ({ negeri, jenis }) =>
    set({
      filterNegeri: negeri,
      filterJenis: jenis
    }),

  clearChartFilter: () =>
    set({
      filterNegeri: null,
      filterJenis: null
    })
  
}));
