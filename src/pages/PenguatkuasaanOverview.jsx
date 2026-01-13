import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ReactECharts from "echarts-for-react";
import { useDashboardStore } from "../store/dashboardStore";

import Navigation from "../components/Navigation";
import PageHeader from "../components/PageHeader";
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
    
    const { negeriList, jenisList, data } =
        groupByNegeriJenis(operasi);
    
    return (
        <div className="dashboard min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <div className="p-4 space-y-6">
                <PageHeader title="STATISTIK PENGUATKUASAAN" period="Januari – Mei 2030" />
                
                <div className="penguatkuasaan-section grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* ENFORCEMENT TABLES */}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <EnforcementTable
                        title="AMCP 1984"
                        jenis="AMCP 1984"
                        rows={AMCP}
                        />
                        <EnforcementTable
                        title="APTQ 1986"
                        jenis="APTQ 1986"
                        rows={APTQ}
                        />
                        <EnforcementTable
                        title="APF 2002"
                        jenis="APF 2002"
                        rows={APF}
                        />
                        <EnforcementTable
                        title="AAP 1971"
                        jenis="AAP 1971"
                        rows={AAP}
                        />
                    </div>

                    {/* PINTU MASUK */}
                    <div className="grid grid-cols-2 gap-6">
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

                    {/* LAPANGAN */}
                    <div className="penguatkuasaan-section">
                        <div className="flex items-center justify-between mb-4 text-slate-600">
                            <h2 className="font-semibold text-xl">
                                LAPANGAN PENGUATKUASAAN
                            </h2>
                        </div>

                        <ReactECharts
                            option={getLapanganBarOption(statistik.lapangan)}
                            style={{ height: 280 }}
                        />
                    </div>

                    <div className="penguatkuasaan-section">
                        <div className="flex items-center justify-between mb-4 text-slate-600">
                            <h2 className="font-semibold text-xl">
                                LAPORAN PENGUATKUASAAN MENGIKUT JENIS DAN NEGERI
                            </h2>
                        </div>

                        <ReactECharts
                                option={getNegeriJenisBarOption(
                                  negeriList,
                                  jenisList,
                                  data
                                )}
                                style={{ height: 280 }}
                              />
                    </div>


                    
                </div>
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