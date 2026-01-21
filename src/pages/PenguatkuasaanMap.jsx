import { useMemo, useState } from "react";
import { GoogleMap, InfoWindow, Marker, useLoadScript } from "@react-google-maps/api";
import ReactECharts from "echarts-for-react";
import states from "../../public/maps/states.json"; // copied from uploaded file
import statesPerjawatanInfo from "../data/penguatkuasaan/statesPerjawatanInfo.json";
import laporanData from "../data/penguatkuasaan/laporan.json";
import { useDashboardStore } from "../store/dashboardStore";

const containerStyle = {
  width: "100%",
  height: "calc(100vh - 320px)"
};

const center = {
  lat: 2.5, //2.3933,
  lng: 112.5, //113.4242 // Sawarak, Malaysia center
};

const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#1f2933" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1f2933" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#9ca3af" }] },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#4b5563" }]
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#111827" }]
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#374151" }]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#020617" }]
  }
];

const normalizeStateName = (name = "") =>
  name
    .toUpperCase()
    .replace(/\./g, "")
    .replace(/\s+/g, " ")
    .trim();

const laporanIcon = {
  url:
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%230f766e' stroke-width='1.5'><path fill='%2310b981' d='M12 2c-3.9 0-7 3.07-7 6.96 0 3.82 2.42 7.8 6.5 11.8.28.27.72.27 1 0C16.58 16.76 19 12.78 19 8.96 19 5.07 15.9 2 12 2Z'/><circle cx='12' cy='9' r='3' fill='white' stroke='%230f766e' stroke-width='1.25'/></svg>",
};

const reportPinSvg = {
  path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM13 14h-2v4h2v-4z",
  fillColor: "#10b981", // green fill
  fillOpacity: 0.95,
  strokeColor: "#065f46",
  strokeWeight: 1.25,
  scale: 1.7,
};

export default function PenguatkuasaanMap({ embedded = false, showLaporanLayer = false, onToggleLaporanLayer }) {
  const [selectedState, setSelectedState] = useState(null);
  const [selectedLaporan, setSelectedLaporan] = useState(null);
  const [showStateMarkers, setShowStateMarkers] = useState(true);
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    jenis: "",
    kategori: "",
    negeri: "",
    statusKes: ""
  });
  const { openPerjawatanPanel, openLaporanDetail } = useDashboardStore();

  const perjawatanSummary = useMemo(() => {
    return statesPerjawatanInfo.reduce((acc, item) => {
      const key = normalizeStateName(item.state);
      if (!acc[key]) {
        acc[key] = { jawatan: 0, isi: 0, kosong: 0 };
      }

      acc[key].jawatan += Number(item.jawatan || 0);
      acc[key].isi += Number(item.isi || 0);
      acc[key].kosong += Number(item.kosong || 0);
      return acc;
    }, {});
  }, []);

  const filterOptions = useMemo(() => ({
    jenis: [...new Set(laporanData.map(l => l.JENIS).filter(Boolean))],
    kategori: [...new Set(laporanData.map(l => l.KATEGORI).filter(Boolean))],
    negeri: [...new Set(laporanData.map(l => l.NEGERI).filter(Boolean))],
    statusKes: [...new Set(laporanData.map(l => l["STATUS KES"]).filter(Boolean))]
  }), []);

  const laporanMarkers = useMemo(() =>
    laporanData
      .filter((l) => {
        if (!l.LATITUDE || !l.LONGITUDE) return false;
        
        // Date range filter
        if (filters.dateFrom && l.TARIKH < filters.dateFrom) return false;
        if (filters.dateTo && l.TARIKH > filters.dateTo) return false;
        
        // Field filters
        if (filters.jenis && l.JENIS !== filters.jenis) return false;
        if (filters.kategori && l.KATEGORI !== filters.kategori) return false;
        if (filters.negeri && l.NEGERI !== filters.negeri) return false;
        if (filters.statusKes && l["STATUS KES"] !== filters.statusKes) return false;
        
        return true;
      })
      .map((l) => ({
        id: l.ID,
        position: { lat: Number(l.LATITUDE), lng: Number(l.LONGITUDE) },
        title: `${l.NEGERI} – ${l.LOKASI}`,
        icon: reportPinSvg,
        record: l
      })),
  [filters]);

  const filteredStats = useMemo(() => {
    const statusCount = {};
    laporanMarkers.forEach(m => {
      const status = m.record["STATUS KES"] || "Tidak Dikenali";
      statusCount[status] = (statusCount[status] || 0) + 1;
    });
    return {
      total: laporanMarkers.length,
      byStatus: statusCount
    };
  }, [laporanMarkers]);

  const chartOption = useMemo(() => ({
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      show: false
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#fff',
          borderWidth: 1
        },
        label: {
          show: true,
          fontSize: 9,
          color: '#000',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 11,
            fontWeight: 'bold'
          }
        },
        data: Object.entries(filteredStats.byStatus).map(([status, count]) => ({
          name: status,
          value: count
        }))
      }
    ]
  }), [filteredStats]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  if (!isLoaded) {
    return <div className="p-8">Memuatkan peta…</div>;
  }

  return (
    <div className="h-full relative">
      {!embedded && (
        <div className="flex items-center justify-between p-4 bg-white border-b">
          <h2 className="font-bold">
            Peta Penguatkuasaan Mengikut Negeri
          </h2>
        </div>
      )}

      <div className="absolute top-3 right-3 z-10 space-y-2 w-100">
        <label className="flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 px-3 py-2 rounded shadow text-sm text-gray-200 dark:text-gray-100">
          <input
            type="checkbox"
            checked={showStateMarkers}
            onChange={() => setShowStateMarkers(v => !v)}
            className="h-4 w-4"
          />
          Papar Negeri
        </label>

        <label className="flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 px-3 py-2 rounded shadow text-sm text-gray-200 dark:text-gray-100">
          <input
            type="checkbox"
            checked={showLaporanLayer}
            onChange={() => onToggleLaporanLayer && onToggleLaporanLayer()}
            className="h-4 w-4"
          />
          Papar Laporan
        </label>

        {showLaporanLayer && (
          <div className="bg-white/90 dark:bg-gray-800/90 px-3 py-3 rounded shadow space-y-2">
            <div className="text-xs font-semibold text-gray-200 dark:text-gray-200">TAPIS LAPORAN</div>
            
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters(f => ({ ...f, dateFrom: e.target.value }))}
                placeholder="Dari"
                className="text-xs px-2 py-1 rounded border dark:bg-gray-700 dark:text-gray-100"
              />
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters(f => ({ ...f, dateTo: e.target.value }))}
                placeholder="Hingga"
                className="text-xs px-2 py-1 rounded border dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            <select
              value={filters.jenis}
              onChange={(e) => setFilters(f => ({ ...f, jenis: e.target.value }))}
              className="w-full text-xs px-2 py-1 rounded border dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">Semua Jenis</option>
              {filterOptions.jenis.map(j => <option key={j} value={j}>{j}</option>)}
            </select>

            <select
              value={filters.kategori}
              onChange={(e) => setFilters(f => ({ ...f, kategori: e.target.value }))}
              className="w-full text-xs px-2 py-1 rounded border dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">Semua Kategori</option>
              {filterOptions.kategori.map(k => <option key={k} value={k}>{k}</option>)}
            </select>

            <select
              value={filters.negeri}
              onChange={(e) => setFilters(f => ({ ...f, negeri: e.target.value }))}
              className="w-full text-xs px-2 py-1 rounded border dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">Semua Negeri</option>
              {filterOptions.negeri.map(n => <option key={n} value={n}>{n}</option>)}
            </select>

            <select
              value={filters.statusKes}
              onChange={(e) => setFilters(f => ({ ...f, statusKes: e.target.value }))}
              className="w-full text-xs px-2 py-1 rounded border dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">Semua Status</option>
              {filterOptions.statusKes.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <button
              onClick={() => setFilters({ dateFrom: "", dateTo: "", jenis: "", kategori: "", negeri: "", statusKes: "" })}
              className="w-full text-xs px-2 py-1 bg-red-600 text-blue-950 rounded hover:bg-red-500"
            >
              Reset Filter
            </button>

            {/* Stats Summary */}
            <div className="pt-2 border-t border-gray-300 dark:border-gray-600">
              <div className="text-xs font-semibold text-gray-200 dark:text-gray-200 mb-2">KEPUTUSAN DITAPIS</div>
              <div className="bg-indigo-600 text-white rounded p-2 text-center mb-2">
                <div className="text-lg font-bold">{filteredStats.total}</div>
                <div className="text-xs">Jumlah Laporan</div>
              </div>

              {filteredStats.total > 0 && (
                <div>
                  <div className="text-xs text-gray-200 dark:text-gray-300 mb-1">Pecahan Status Kes:</div>
                  <ReactECharts
                    option={chartOption}
                    style={{ height: 140, width: '100%' }}
                    opts={{ renderer: 'canvas' }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Map */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={6}
        options={{
          styles: darkMapStyle,
          disableDefaultUI: true,
          zoomControl: true
        }}
      >
        {showStateMarkers && states.map((state) => {
          const position = {
            lat: Number(state.lat),
            lng: Number(state.long)
          };

          const summary = perjawatanSummary[normalizeStateName(state.name)];

          return (
            <Marker
              key={state.id}
              position={position}
              title={state.name}
              onClick={() =>
                setSelectedState({
                  name: state.name,
                  position,
                  summary
                })
              }
            />
          );
        })}

        {showLaporanLayer &&
          laporanMarkers.map((laporan) => (
            <Marker
              key={`laporan-${laporan.id}`}
              position={laporan.position}
              title={laporan.title}
              label="L"
              icon={laporan.icon}
              onClick={() => setSelectedLaporan(laporan)}
            />
          ))}

        {selectedState && (
          <InfoWindow
            position={selectedState.position}
            onCloseClick={() => setSelectedState(null)}
          >
                <div className="space-y-2 text-gray-800">
                <h3 className="font-semibold text-lg text-black">STATUS PENJAWATAN</h3>
              <div className="font-semibold text-sm text-blue-950">{selectedState.name}</div>
              {selectedState.summary ? (
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-gray-100 rounded p-2 text-center">
                    <div className="text-[11px] text-gray-500">Jawatan</div>
                    <div className="font-semibold">{selectedState.summary.jawatan}</div>
                  </div>
                  <div className="bg-green-900 rounded p-2 text-center">
                    <div className="text-[11px] text-gray-600">Isi</div>
                    <div className="font-semibold">{selectedState.summary.isi}</div>
                  </div>
                  <div className="bg-red-900 rounded p-2 text-center">
                    <div className="text-[11px] text-gray-600">Kosong</div>
                    <div className="font-semibold">{selectedState.summary.kosong}</div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-500">Data perjawatan tidak tersedia.</div>
              )}

              <button
                type="button"
                className="w-full rounded text-indigo-800 text-xs font-semibold py-2 hover:bg-indigo-500"
                onClick={() => {
                  const key = normalizeStateName(selectedState.name);
                  const summary = perjawatanSummary[key];
                  const rows = statesPerjawatanInfo.filter(
                    (item) => normalizeStateName(item.state) === key
                  );

                  openPerjawatanPanel({
                    stateName: selectedState.name,
                    summary,
                    rows
                  });
                    //setSelectedState(null);
                }}
              >
                View Details
              </button>
            </div>
          </InfoWindow>
        )}

        {selectedLaporan && (
          <InfoWindow
            position={selectedLaporan.position}
            onCloseClick={() => setSelectedLaporan(null)}
            // New Header Prop for the Title
            headerContent={
              <div className="font-bold text-base text-indigo-900">
                Laporan: {selectedLaporan.record.NEGERI}
              </div>
            }
          >
            <div className="min-w-50 space-y-3 p-1 text-gray-800">
              {/* Body Content */}
              <div className="flex flex-col gap-1">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Lokasi</div>
                <div className="text-sm font-medium text-blue-950 leading-tight">
                  {selectedLaporan.record.LOKASI}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 border-t border-gray-100 pt-2">
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Aktiviti</div>
                  <div className="text-xs text-blue-900">{selectedLaporan.record.AKTIVITI}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase mt-2">Butiran</div>
                  <div className="text-xs text-blue-900">{selectedLaporan.record["BUTIRAN AKTIVITI"]}</div>
                </div>
                <div className="align-middle">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Status</div>
                  <div className="text-xs font-semibold text-indigo-700">
                    {selectedLaporan.record["STATUS KES"]}
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="w-full mt-2 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold py-2.5 transition-colors hover:bg-indigo-600 hover:text-white"
                onClick={() => openLaporanDetail(selectedLaporan.record)}
              >
                View Full Details
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
