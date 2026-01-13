export const getCategoryBreakdownOption = (data) => ({
  tooltip: { trigger: "axis" },
  legend: { bottom: 0 },
  grid: { left: 40, right: 20, top: 30, bottom: 60 },
  xAxis: {
    type: "category",
    data: data.breakdown.map(b => b.type)
  },
  yAxis: { type: "value" },
  series: [
    {
      name: "Mohon",
      type: "bar",
      data: data.breakdown.map(b => b.mohon),
      itemStyle: { color: "#94a3b8" }
    },
    {
      name: "Lulus",
      type: "bar",
      data: data.breakdown.map(b => b.lulus),
      itemStyle: { color: "#0d9488" }
    }
  ],
  animationDuration: 600
});
