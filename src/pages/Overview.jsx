import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import overview from "../data/overview.json";
import KPISection from "../components/KPISection";
import HexCard from "../components/HexCard";
import DrilldownPanel from "../components/DrilldownPanel";
import Navigation from "../components/Navigation";
import PageHeader from "../components/PageHeader";
import { useDashboardStore } from "../store/dashboardStore";

export default function Overview({ currentPage, setCurrentPage, onLogout }) {
  const selectedCategory = useDashboardStore(s => s.selectedCategory);
  useGSAP(() => {
    gsap.from(".kpi-section", {
      opacity: 0,
      y: 20,
      duration: 0.4,
      stagger: 0.15,
      ease: "power2.out"
    });
  }, []);

  return (
    <div className="dashboard min-h-screen px-10 py-2 bg-shiny">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} onLogout={onLogout} />
      <div className={`p-8 space-y-10 ${selectedCategory ? 'mr-96' : ''}`}>
        <PageHeader title="STATISTIK LESEN & PERMIT" period="Januari - Mei 2026" />

      {/* KPI + Charts */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {overview.cards.map((c) => (
          <div key={c.key} className="kpi-section contain-content">
            <KPISection
              category={c.key}
              label={c.label}
              value={c.value}
            />
          </div>
        ))}
      </div>

      {/* Optional: Drilldown Triggers */}
      {/* <div className="grid grid-cols-4 gap-4">
        {overview.cards.map((c) => (
          <HexCard
            key={c.key}
            title={c.key}
            value={c.value}
          />
        ))}
      </div> */}

      {/* Optional: Deep Dive */}
      <DrilldownPanel />
      </div>
    </div>
  );
}
