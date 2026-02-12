import { create } from "zustand";

export const useDashboardStore = create((set) => ({
  selectedCategory: null,
  selectedLaporan: null,
  selectedPerjawatan: null,

  filterNegeri: null,
  filterJenis: null,

  mapViewOpen: false,
  showPenjawatanMarkers: true,
  penjawatanStateFilter: "",
  penjawatanFocusState: null,

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
    }),

  setMapViewOpen: (value) =>
    set({ mapViewOpen: Boolean(value) }),

  setShowPenjawatanMarkers: (value) =>
    set({ showPenjawatanMarkers: Boolean(value) }),

  setPenjawatanStateFilter: (value) =>
    set({ penjawatanStateFilter: value || "" }),

  setPenjawatanFocusState: (value) =>
    set({ penjawatanFocusState: value || null })
  
}));
