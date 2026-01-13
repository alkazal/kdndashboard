export const getProgramDistributionOption = (data) => ({
  tooltip: { trigger: "axis" },
  xAxis: {
    type: "category",
    data: Object.values(data).map(d => d.label),
    axisLabel: { rotate: 25 }
  },
  yAxis: { type: "value" },
  series: [
    {
      type: "bar",
      data: Object.values(data).map(d => d.count),
      barWidth: "45%",
      itemStyle: {
        color: "#0d9488",
        borderRadius: [6, 6, 0, 0]
      },
      label: {
        show: true,
        position: 'top',
        formatter: '{c}',
        fontSize: 12,
        fontWeight: 'bold'
      }
    }
  ]
});
