import { useEffect, useRef } from "react";
import gsap from "gsap";
import ReactECharts from "echarts-for-react";
import { XMarkIcon, PrinterIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { useDashboardStore } from "../store/dashboardStore";

import pp from "../data/pp.json";
import lmc from "../data/lmc.json";
import lmcq from "../data/lmcq.json";
import pruf from "../data/pruf.json";
import monthly from "../data/monthly-breakdown.json";
import overview from "../data/overview.json";
import laporan from "../data/penguatkuasaan/laporan.json";

// Kajian data
import knt from "../data/kajian/knt.json";
import knb from "../data/kajian/knb.json";
import knr from "../data/kajian/knr.json";
import knp from "../data/kajian/knp.json";
import larangan from "../data/kajian/larangan.json";
import kajianMonthly from "../data/kajian/monthly-breakdown.json";

// Charts
import { getMonthlyTrendOption } from "../charts/MonthlyTrendChart";
import { getKajianHQNegeriPieOption } from "../charts/kajian/KajianHQNegeriChart";
import { getStatusKESDonutOption } from "../charts/penguatkuasaan/StatusKESDonut";

const dataMap = {
  PP: pp,
  LMC: lmc,
  LMCQ: lmcq,
  PRUF: pruf,
  KNT: knt,
  KNB: knb,
  KNR: knr,
  KNP: knp,
  LARANGAN_TOTAL: larangan,
  LARANGAN_TAHUN: larangan
};

const kajianCategoryLabels = {
  KNT: "KAJIAN NASKHAH TEKS",
  KNB: "KAJIAN NASKHAH BUKU",
  KNR: "KAJIAN NASKHAH RUJUKAN",
  KNP: "KAJIAN NASKHAH PERMIT",
  LARANGAN_TOTAL: "PERINTAH LARANGAN KESELURUHAN",
  LARANGAN_TAHUN: "PERINTAH LARANGAN TAHUN 2023"
};

export default function DrilldownPanel() {
  const panelRef = useRef(null);
  const { selectedCategory, closeDrilldown, openLaporanDetail, filterNegeri } = useDashboardStore();

  // Get category label - check Kajian labels first, then main overview
  const categoryData = overview.cards?.find(c => c.key === selectedCategory);
  const categoryLabel = categoryData ? categoryData.label : (kajianCategoryLabels[selectedCategory] || selectedCategory);

  useEffect(() => {
    if (selectedCategory) {
      gsap.from(panelRef.current, {
        x: 500,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out"
      });
    }
  }, [selectedCategory]);

  if (!selectedCategory) return null;

  const data = dataMap[selectedCategory];
  const monthlyData = monthly[selectedCategory] || kajianMonthly[selectedCategory];

  /* ---------------------------
     Table Renderer
  ----------------------------*/
  const renderTable = () => {
    // Handle KNP specifically (HQ only with language breakdown)
    if (selectedCategory === "KNP") {
      return (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-slate-500 border-b">
              <th className="py-2">Bahasa</th>
              <th className="py-2 text-right">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data.bahasa).map(([bahasa, jumlah]) => (
              <tr key={bahasa} className="border-b last:border-0">
                <td className="py-2">{bahasa}</td>
                <td className="py-2 text-right font-medium">{jumlah}</td>
              </tr>
            ))}
            <tr>
              <td className="py-2 font-semibold">Jumlah Keseluruhan</td>
              <td className="py-2 text-right font-bold">{data.jumlah}</td>
            </tr>
          </tbody>
        </table>
      );
    }

    // Handle other Kajian categories (KNT, KNB, KNR) - shows both pie chart and table
    if (["KNT", "KNB", "KNR"].includes(selectedCategory)) {
      return (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-slate-500 border-b">
              <th className="py-2">Kategori</th>
              <th className="py-2 text-right">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">HQ</td>
              <td className="py-2 text-right font-medium">{data.hq || 0}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Negeri</td>
              <td className="py-2 text-right font-medium">{data.negeri || 0}</td>
            </tr>
            <tr>
              <td className="py-2 font-semibold">Jumlah Keseluruhan</td>
              <td className="py-2 text-right font-bold">{data.jumlah || 0}</td>
            </tr>
          </tbody>
        </table>
      );
    }

    // Handle Larangan categories
    if (selectedCategory === "LARANGAN_TOTAL" || selectedCategory === "LARANGAN_TAHUN") {
      const value = selectedCategory === "LARANGAN_TOTAL" ? data.jumlah_keseluruhan : data.tahun_semasa;
      const label = selectedCategory === "LARANGAN_TOTAL" ? "Jumlah Keseluruhan" : "Tahun Semasa (2023)";

      return (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-slate-500 border-b">
              <th className="py-2">Kategori</th>
              <th className="py-2 text-right">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2">{label}</td>
              <td className="py-2 text-right font-bold">{value}</td>
            </tr>
          </tbody>
        </table>
      );
    }

    // Original logic for main dashboard categories
    if (selectedCategory === "PRUF" || selectedCategory === "LMCQ") {
      return (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-slate-500 border-b">
              <th className="py-2">Status</th>
              <th className="py-2 text-right">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data.summary).map(([k, v]) => (
              <tr key={k} className="border-b last:border-0">
                <td className="py-2 capitalize">{k}</td>
                <td className="py-2 text-right font-medium">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    // Handle enforcement categories (e.g., "AMCP 1984_OPERASI")
    if (selectedCategory.includes("_")) {
      const [jenis, kategori] = selectedCategory.split("_");
      const filteredData = laporan.filter(item => {
        const matchJenis = item.JENIS === jenis && item.KATEGORI === kategori;
        const matchNegeri = !filterNegeri || item.NEGERI === filterNegeri;
        return matchJenis && matchNegeri;
      });

      return (
        <div className="space-y-4">
          {/* <div className="text-sm text-red-500 font-bold">
            ENFORCEMENT DEBUG: {selectedCategory} | Filtered: {filteredData.length} | Laporan total: {laporan.length}
          </div> */}
          <div className="text-sm text-slate-200">
            Menunjukkan {filteredData.length} rekod untuk <span className="ml-2 px-2 py-1 bg-teal-600 text-white rounded text-xs">{jenis} - {kategori}</span>
            {filterNegeri && <span className="ml-2 px-2 py-1 bg-teal-600 text-white rounded text-xs">{filterNegeri}</span>}
          </div>

          {/* Pie Chart by STATUS KES */}
          {filteredData.length > 0 && (
            <div className="mt-6">
              <div className="text-sm font-semibold mb-3 text-slate-200">
                Pecahan Status Kes
              </div>
              <ReactECharts
                option={getStatusKESDonutOption(filteredData)}
                style={{ height: 280 }}
              />
            </div>
          )}
          {filteredData.length > 0 ? (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left text-slate-500 border-b">
                  <th className="py-2">Tarikh</th>
                  <th className="py-2">Negeri</th>
                  {/* <th className="py-2">Lokasi</th> */}
                  <th className="py-2">Aktiviti</th>
                  {/* <th className="py-2">Status Kes</th> */}
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="py-2 align-top">{item.TARIKH}</td>
                    <td className="py-2">{item.NEGERI}</td>
                    {/* <td className="py-2">{item.LOKASI}</td> */}
                    <td className="py-2 px-2"><span className="font-medium">{item["BUTIRAN AKTIVITI"]}</span><br /><span className="text-balance">{item.LOKASI}</span><br/><span className="px-2 py-1 bg-green-700 text-white rounded text-xs">STATUS - {item["STATUS KES"]}</span></td>
                    {/* <td className="py-2">{item["STATUS KES"]}</td> */}
                    <td className="py-2">
                      <button
                        onClick={() => openLaporanDetail(item)}
                        className="text-primary hover:underline text-sm"
                      >
                        Lihat Laporan
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-sm text-slate-400">
              Tiada rekod dijumpai.
            </div>
          )}
        </div>
      );
    }

    return (
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left text-slate-500 border-b">
            <th className="py-2">Jenis</th>
            <th className="py-2 text-right">Mohon</th>
            <th className="py-2 text-right">Lulus</th>
          </tr>
        </thead>
        <tbody>
          {data.breakdown.map((row) => (
            <tr key={row.type} className="border-b last:border-0">
              <td className="py-2">{row.type}</td>
              <td className="py-2 text-right">{row.mohon}</td>
              <td className="py-2 text-right font-medium">{row.lulus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div
      ref={panelRef}
      className="fixed right-0 top-0 h-full w-lg bg-white shadow-xl p-6 z-50 overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">
          {categoryLabel} – Trend & Data
        </h2>

        <button
          onClick={closeDrilldown}
          className="text-slate-500 hover:text-black"
        >
            <XMarkIcon className="w-6 h-6" />
              </button>

        </div>

      {/* Pie Chart for KNT, KNB, KNR */}
      {["KNT", "KNB", "KNR"].includes(selectedCategory) && (
        <div className="mt-8">
          <div className="text-sm font-semibold mb-3 text-slate-200">
            Pecahan HQ vs Negeri
          </div>
          <ReactECharts
            option={getKajianHQNegeriPieOption(data)}
            style={{ height: 300 }}
          />
        </div>
      )}

      {/* Monthly Trend */}
      {monthlyData && (
        <ReactECharts
          option={getMonthlyTrendOption(monthlyData)}
          style={{ height: 260 }}
        />
      )}

      {/* Table */}
      <div className="mt-8">
        <div className="text-sm font-semibold mb-3 text-slate-200">
          Data Terperinci
        </div>
        {renderTable()}
      </div>
    </div>
  );
}
