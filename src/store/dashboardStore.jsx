import { create } from "zustand";

export const useDashboardStore = create((set) => ({
  selectedCategory: null,
  selectedLaporan: null,
  selectedPerjawatan: null,

  filterNegeri: null,
  filterJenis: null,

  openDrilldown: (category) =>
    set({ selectedCategory: category, selectedPerjawatan: null }),

  closeDrilldown: () =>
    set({ selectedCategory: null, selectedPerjawatan: null }),

  setCategory: (category) =>
    set({ selectedCategory: category, selectedPerjawatan: null }),

  openPerjawatanPanel: (payload) =>
    set({ selectedPerjawatan: payload, selectedCategory: null }),

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
