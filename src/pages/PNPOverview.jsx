import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ReactECharts from "echarts-for-react";

import KPIBlock from "../components/KPIBlock";
import DrilldownPanel from "../components/DrilldownPanel";

import overview from "../data/pnp/overview.json";
import programs from "../data/pnp/program-breakdown.json";
import jeq from "../data/pnp/jeq.json";

import { getProgramDistributionOption } from "../charts/pnp/ProgramDistributionBar";
import { getJEQOutcomeOption } from "../charts/pnp/JEQOutcomeDonut";

import Navigation from "../components/Navigation";
import PageHeader from "../components/PageHeader";
import { useDashboardStore } from "../store/dashboardStore";

export default function PNPOverview({ currentPage, setCurrentPage }) {
  const selectedCategory = useDashboardStore(s => s.selectedCategory);
  useGSAP(() => {
    gsap.from(".pnp-section", {
      opacity: 0,
      y: 20,
      duration: 0.4,
      stagger: 0.15
    });
  }, []);

    return (
      <div className="dashboard min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />

            <div className={`p-8 space-y-10 ${selectedCategory ? 'mr-96' : ''}`}>
            <PageHeader title="STATISTIK PENDIDIKAN & PENCEGAHAN (PNP)" period="Januari - Mei 2026" />

            {/* Total KPI - Program Breakdown */}
            <div className="pnp-section">
                <h2 className="font-semibold mb-4 text-2xl  text-slate-600">COMMUNITY BASED PGROGRAMME (CBP)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                        <KPIBlock
                        label="JUMLAH PROGRAM CBP"
                        value={overview.jumlah_program}
                        category="PNP_TOTAL"                        
                        />

                    {Object.entries(programs).map(([key, program]) => (
                        <KPIBlock
                            key={key}
                            label={program.label}
                            value={program.count}
                            category={`PNP_${key}`}
                        />
                    ))}
                </div>
            </div>

            {/* Programme Distribution and JEQ Focus */}
            <div className="pnp-section grid grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Programme Distribution - takes 2 columns */}
                <div className="lg:col-span-2">
                    <div className="bg-zinc-950 rounded-xl shadow p-6">
                        <h2 className="font-semibold mb-4 text-xl text-white">
                        AGIHAN PROGRAM PNP
                        </h2>
                        <ReactECharts
                        option={getProgramDistributionOption(programs)}
                        style={{ height: 320 }}
                        />
                    </div>
                </div>

                {/* JEQ Focus - takes 1 column */}
                    <div className="lg:col-span-1">
                        <h2 className="font-semibold mb-4 text-xl text-slate-600">
                            JOM EXCHANGE AL-QUR'AN (JEQ)
                        </h2>
                    <div className=" rounded-xl shadow p-6 grid grid-cols-2 gap-4">
                        <div className="grid grid-cols-1 gap-4 mb-4">
                            <KPIBlock
                            label="TIADA PERAKUAN / ROSAK"
                            value={jeq.tiada_perakuan_rosak}
                            category="JEQ_ROSAK"
                            />
                            <KPIBlock
                            label="DIGANTI"
                            value={jeq.diganti}
                            category="JEQ_GANTI"
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-4 mb-4">
                        <ReactECharts
                            option={getJEQOutcomeOption(jeq)}
                            style={{ height: 320 }}
                                />
                        </div>
                    </div>
                </div>
            </div>

            {/* Drilldown */}
            <DrilldownPanel />
        </div>
    </div>
  );
}
