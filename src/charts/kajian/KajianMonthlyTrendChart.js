export const getKajianMonthlyTrendOption = (records) => ({
  tooltip: { trigger: "axis" },
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
      areaStyle: { opacity: 0.12 },
      lineStyle: { width: 3 }
    }
  ]
});
