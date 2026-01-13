export const getMonthlyTrendOption = (records) => ({
  tooltip: { trigger: "axis" },
  grid: { left: 40, right: 20, top: 30, bottom: 40 },
  xAxis: {
    type: "category",
    data: records.map(r => r.month)
  },
  yAxis: { type: "value" },
  series: [
    {
      type: "line",
      smooth: true,
      data: records.map(r => r.count),
      lineStyle: { width: 3, color: "#0d9488" },
      itemStyle: { color: "#0d9488" },
      areaStyle: { opacity: 0.1 },
      animationDuration: 600
    }
  ]
});
