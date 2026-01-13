import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ReactECharts from "echarts-for-react";

import Navigation from "../components/Navigation";
import PageHeader from "../components/PageHeader";
import KPIBlock from "../components/KPIBlock";
import DrilldownPanel from "../components/DrilldownPanel";

// JSON data
import overview from "../data/kajian/overview.json";
import kajianBreakdown from "../data/kajian/kajian-breakdown.json";
import knp from "../data/kajian/knp.json";
import larangan from "../data/kajian/larangan.json";

// Charts
import { getOverviewTotalOption } from "../charts/kajian/OverviewTotalChart";
import { getHQNegeriOption } from "../charts/kajian/KajianHQNegeriChart";
import { getKNPBahasaOption } from "../charts/kajian/KNPBahasaChart";
import { getLaranganSummaryOption } from "../charts/kajian/LaranganSummaryChart";

export default function KajianOverview({ currentPage, setCurrentPage }) {
  useGSAP(() => {
    gsap.from(".kajian-section", {
      opacity: 0,
      y: 20,
      duration: 0.4,
      stagger: 0.15,
      ease: "power2.out"
    });
  }, []);

  return (
    <div className="dashboard min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="p-4 space-y-6">
        <PageHeader title="STATISTIK KAJIAN & PERINTAH LARANGAN" period={overview.period} />

      {/* Total Kajian */}
      <div className="kajian-section grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-600 rounded-xl shadow p-4">
          <div className="text-xl font-semibold mb-0 text-slate-950">
            JUMLAH NASKHAH DIKAJI
          </div>

          <ReactECharts
            option={getOverviewTotalOption(
              overview.jumlah_dikaji
            )}
            style={{ height: 200 }}
          />
        </div>

        <div className="bg-slate-600 rounded-xl shadow p-4">
          <div className="text-xl font-semibold mb-3 text-slate-950">
            PERINTAH LARANGAN
          </div>

          <div className="grid grid-cols-2 gap-4">
            <KPIBlock
              label="JUMLAH PERINTAH LARANGAN KESELURUHAN"
              value={larangan.jumlah_keseluruhan}
              category="LARANGAN_TOTAL"
            />
            <KPIBlock
              label="JUMLAH PERINTAH LARANGAN TAHUN 2023"
              value={larangan.tahun_semasa}
              category="LARANGAN_TAHUN"
            />
          </div>

          <div className="mt-4">
            <ReactECharts
              option={getLaranganSummaryOption(
                larangan.jumlah_keseluruhan
              )}
              style={{ height: 50 }}
            />
          </div>
        </div>
                  
        {/* KNT / KNB / KNR */}
        <div className="kajian-section">
        <div className="flex items-center justify-between mb-4 text-slate-600">
          <h2 className="font-semibold text-xl">
            KAJIAN NASKHAH (HQ vs NEGERI)
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {Object.entries(kajianBreakdown).map(
            ([key, item]) => (
              <KPIBlock
                key={key}
                label={item.label}
                value={item.jumlah}
                category={key}
              />
            )
          )}
        </div>

        <ReactECharts
          option={getHQNegeriOption(kajianBreakdown)}
          style={{ height: 230 }}
        />
        </div>

        {/* KNP */}
        <div className="kajian-section">
            <div className="flex items-center justify-between mb-4 text-slate-600">
                <h2 className="font-semibold text-xl">
                    KAJIAN NASKHAH PERMIT (HQ SAHAJA)
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <KPIBlock
                label="JUMLAH KNP"
                value={knp.jumlah}
                category="KNP"
            />

            <ReactECharts
                option={getKNPBahasaOption(knp)}
                style={{ height: 300 }}
            />
            </div>
        </div>
                  
      </div>

      

      {/* Drilldown Panel */}
      <DrilldownPanel />
      </div>
    </div>
  );
}
