import { useDashboardStore } from "../store/dashboardStore";
import { useMemo } from "react";

export default function EnforcementTable({ title, rows, jenis, operasiData }) {
    const openDrilldown = useDashboardStore((s) => s.openDrilldown);
    const selectedCategory = useDashboardStore((s) => s.selectedCategory);
    
    const {    
        filterNegeri,
        filterJenis
    } = useDashboardStore();

    // Calculate filtered statistics if filters are active
    const filteredRows = useMemo(() => {
        if (!filterNegeri && !filterJenis) return rows;
        if (!operasiData) return rows;

        // Filter operasi data based on negeri and jenis
        const filtered = operasiData.filter(record => {
            const matchNegeri = !filterNegeri || record.NEGERI === filterNegeri;
            const matchJenis = !filterJenis || record.JENIS === filterJenis;
            return matchNegeri && matchJenis && record.JENIS === jenis;
        });

        // Recalculate statistics from filtered data
        const stats = {};
        filtered.forEach(record => {
            const kategori = record.KATEGORI;
            if (kategori) {
                stats[kategori] = (stats[kategori] || 0) + 1;
            }
        });

        return stats;
    }, [rows, operasiData, filterNegeri, filterJenis, jenis]);

    const dataEntries = Object.entries(filteredRows);

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">{title}</h3>
        {(filterNegeri || filterJenis) && (
          <span className="text-xs px-2 py-1 bg-teal-100 text-teal-700 rounded">
            Filtered
          </span>
        )}
      </div>
      <table className="w-full text-sm">
        <tbody>
          {dataEntries.map(([key, value], i) => {
            const rowCategory = `${jenis}_${key}`;
            const isSelected = selectedCategory === rowCategory;

            return (
              <tr
                key={i}
                onClick={() => openDrilldown(rowCategory, { category: key, value: value, jenis: jenis })}
                className={`border-b cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-teal-50 border-teal-200 hover:bg-teal-100'
                    : 'hover:bg-teal-200'
                }`}
              >
                <td className={`py-2 font-medium ${isSelected ? 'text-teal-800' : ''}`}>{key}</td>
                <td className={`py-2 text-right font-semibold ${isSelected ? 'text-teal-800' : ''}`}>{value.toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {dataEntries.length === 0 && (
        <div className="text-sm text-slate-400 mt-4">
          Tiada rekod.
        </div>
      )}
    </div>
  );
}
