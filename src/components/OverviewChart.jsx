import ReactECharts from "echarts-for-react";
import overview from "../data/overview.json";
import { getOverviewBarOption } from "../charts/OverviewBarChart";

export default function OverviewChart() {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="text-sm font-semibold mb-4 text-slate-600">
        Perbandingan Keseluruhan
      </div>

      <ReactECharts
        option={getOverviewBarOption(overview)}
        style={{ height: 300 }}
      />
    </div>
  );
}
