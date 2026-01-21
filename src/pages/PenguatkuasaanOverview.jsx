import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ReactECharts from "echarts-for-react";
import { useState } from "react";
import { useDashboardStore } from "../store/dashboardStore";

import Navigation from "../components/Navigation";
import PageHeader from "../components/PageHeader";
import StatesList from "../components/StatesList";
import AMCP from "../data/penguatkuasaan/statistikAMCP.json";
import APTQ from "../data/penguatkuasaan/statistikAPTQ.json";
import APF from "../data/penguatkuasaan/statistikAPF.json";
import AAP from "../data/penguatkuasaan/statistikAAP.json";
import EnforcementTable from "../components/EnforcementTable";
import DrilldownPanel from "../components/DrilldownPanel";
import LaporanDetail from "../components/LaporanDetail";

import statistik from "../data/penguatkuasaan/statistik.json";
import { getLapanganBarOption } from "../charts/penguatkuasaan/LapanganBarChart";
import { getPintuMasukDonutOption } from "../charts/penguatkuasaan/PintuMasukDonut";
import { getPintuMasukStackedOption } from "../charts/penguatkuasaan/PintuMasukStacked";

import operasi from "../data/penguatkuasaan/laporan.json";
import { groupByNegeriJenis } from "../utils/groupByNegeriJenis";
import { getNegeriJenisBarOption } from "../charts/penguatkuasaan/NegeriJenisBarChart";

import PenguatkuasaanMap from "./PenguatkuasaanMap";

export default function PenguatkuasaanOverview({ currentPage, setCurrentPage }) {
     useGSAP(() => {
        gsap.from(".penguatkuasaan-section", {
          opacity: 0,
          y: 20,
          duration: 0.4,
          stagger: 0.15,
          ease: "power2.out"
        });
     }, []);

    const { setChartFilter, clearChartFilter } =
        useDashboardStore();
    
    const { negeriList, jenisList, data } =
        groupByNegeriJenis(operasi);
    
    const onEvents = {
        click: (params) => {
        if (!params.name || !params.seriesName) return;

        setChartFilter({
            negeri: params.name,
            jenis: params.seriesName
        });
        }
    };

    const [showMap, setShowMap] = useState(false);
    const [showLaporanLayer, setShowLaporanLayer] = useState(false);
    
    return (
        <div className="dashboard min-h-screen bg-gray-50 dark:bg-gray-900 px-5 py-2">
            <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <div className="p-4 space-y-6">
                <StatesList onStateSelect={(state) => console.log('Selected state:', state)} />
                
                <PageHeader
                    title="STATISTIK PENGUATKUASAAN"
                    period="Januari – Mei 2026"
                    onCOPClick={() => setShowMap((v) => !v)}
                    copActive={showMap}
                    onLaporanClick={() => {
                        setShowMap(true);
                        setShowLaporanLayer(true);
                    }}
                    laporanActive={showLaporanLayer}
                />
                
                {/* MAP VIEW */}
                {showMap && (
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <PenguatkuasaanMap
                        embedded
                        showLaporanLayer={showLaporanLayer}
                        onToggleLaporanLayer={() => setShowLaporanLayer((v) => !v)}
                    />
                </div>
                )}

                {/* DASHBOARD VIEW */}
                {!showMap && (
                <>
                    <div className="penguatkuasaan-section grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* ENFORCEMENT TABLES */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <EnforcementTable
                            title="AMCP 1984"
                            jenis="AMCP 1984"
                            rows={AMCP}
                            operasiData={operasi}
                            />
                            <EnforcementTable
                            title="APTQ 1986"
                            jenis="APTQ 1986"
                            rows={APTQ}
                            operasiData={operasi}
                            />
                            <EnforcementTable
                            title="APF 2002"
                            jenis="APF 2002"
                            rows={APF}
                            operasiData={operasi}
                            />
                            <EnforcementTable
                            title="AAP 1971"
                            jenis="AAP 1971"
                            rows={AAP}
                            operasiData={operasi}
                            />
                        </div>

                        {/* PINTU MASUK */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl shadow p-6">
                                <h2 className="font-semibold mb-4">PINTU MASUK</h2>

                                <ReactECharts
                                option={getPintuMasukDonutOption(statistik.pintu_masuk)}
                                style={{ height: 280 }}
                                />
                            </div>

                            <div className="bg-white rounded-xl shadow p-6">
                                <h2 className="font-semibold mb-4">PINTU MASUK (Utama vs Sekunder)</h2>

                                <ReactECharts
                                option={getPintuMasukStackedOption(
                                    statistik.pintu_masuk_utama,
                                    statistik.pintu_masuk_sekunder
                                )}
                                style={{ height: 280 }}
                                />
                            </div>
                        </div>

                    </div>
                    
                    <div className="penguatkuasaan-section grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* LAPANGAN */}
                        {/* <div className="penguatkuasaan-section lapangan-chart"> */}
                            <div className="dark:bg-gray-800 rounded-xl shadow p-6">
                                <h2 className="font-semibold mb-4 text-lg text-slate-700 dark:text-slate-200">
                                    LAPANGAN PENGUATKUASAAN
                                </h2>

                                    <ReactECharts
                                        option={getLapanganBarOption(statistik.lapangan)}
                                        style={{ height: 220 }}
                                        opts={{ renderer: 'canvas' }}
                                    />
                            </div>
                        {/* </div> */}
                    
                        {/* LAPORAN NEGERI JENIS */}
                        <div className="penguatkuasaan-section">
                            <div className="dark:bg-gray-800 rounded-xl shadow p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-semibold text-lg text-slate-600 dark:text-slate-200">
                                        LAPORAN NEGERI & AKTA
                                    </h2>
                                    {(useDashboardStore.getState().filterNegeri || useDashboardStore.getState().filterJenis) && (
                                        <button
                                            onClick={clearChartFilter}
                                            className="text-xs px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded transition"
                                        >
                                            Clear Filter
                                        </button>
                                    )}
                                </div>

                                <ReactECharts
                                    option={getNegeriJenisBarOption(
                                        negeriList,
                                        jenisList,
                                        data
                                    )}
                                    onEvents={onEvents}
                                    style={{ height: 200 }}
                                />
                            </div>
                        </div>
                        
                        </div>
                </>
                )}

                <DrilldownPanel />
                <LaporanDetailModal />
            </div>
        </div>
            
  );
}

function LaporanDetailModal() {
  const { selectedLaporan, closeLaporanDetail } = useDashboardStore();
  
  return selectedLaporan ? (
    <LaporanDetail 
      record={selectedLaporan} 
      onClose={closeLaporanDetail} 
    />
  ) : null;
}