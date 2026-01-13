import KPIBlock from "./KPIBlock";
import ReactECharts from "echarts-for-react";

import pp from "../data/pp.json";
import lmc from "../data/lmc.json";
import lmcq from "../data/lmcq.json";
import pruf from "../data/pruf.json";
import monthly from "../data/monthly-breakdown.json";

import { getCategoryBreakdownOption } from "../charts/CategoryBreakdownChart";
import { getStatusDonutOption } from "../charts/StatusDonutChart";
import { getStatusDonutLMCQOption } from "../charts/StatusDonutLMCQChart";
import { getMonthlyTrendOption } from "../charts/MonthlyTrendChart";

const dataMap = {
  PP: pp,
  LMC: lmc,
  LMCQ: lmcq,
  PRUF: pruf
};

export default function KPISection({ category, label, value }) {
  const data = dataMap[category];

  const renderChart = () => {
    // LMCQ (empty / info)
    if (category === "LMCQ") {
      return (
        <ReactECharts
          option={getStatusDonutLMCQOption(data)}
          style={{ height: 300 }}
        />
      );
    }

    // PRUF (status donut)
    if (category === "PRUF") {
      return (
        <ReactECharts
          option={getStatusDonutOption(data)}
          style={{ height: 300 }}
        />
      );
    }

    // PP / LMC (breakdown + monthly)
    return (
      <>
        <ReactECharts
          option={getCategoryBreakdownOption(data)}
          style={{ height: 340 }}
        />

        {/* <div className="mt-4">
          <ReactECharts
            option={getMonthlyTrendOption(monthly[category])}
            style={{ height: 200 }}
          />
        </div> */}
      </>
    );
  };

  return (
    <section className="rounded-xl boxShadow p-6 space-y-4 glass">
      <KPIBlock
        label={label}
        value={value}
        category={category}
        />
      {renderChart()}
    </section>
  );
}
