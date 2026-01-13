import { useDashboardStore } from "../store/dashboardStore";

export default function EnforcementTable({ title, rows, jenis }) {
  const openDrilldown = useDashboardStore((s) => s.openDrilldown);
  const selectedCategory = useDashboardStore((s) => s.selectedCategory);

  // Convert object to array of key-value pairs for display
  const dataEntries = Object.entries(rows);

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="font-semibold mb-4">{title}</h3>
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
                    : 'hover:bg-slate-50'
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
