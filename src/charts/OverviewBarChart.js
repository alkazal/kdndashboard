export const getOverviewBarOption = (overview) => ({
  grid: { left: 40, right: 20, top: 30, bottom: 40 },
  tooltip: { trigger: "axis" },
  xAxis: {
    type: "category",
    data: overview.cards.map(c => c.key),
    axisTick: { show: false }
  },
  yAxis: {
    type: "value",
    axisLabel: {
      fontSize: 11,
      color: '#FFF'
    },
    splitLine: { lineStyle: { opacity: 0.3 } }
  },
  series: [
    {
      type: "bar",
      data: overview.cards.map(c => c.value),
      barWidth: "45%",
      itemStyle: {
        color: "#0d9488",
        borderRadius: [6, 6, 0, 0]
      },
      animationDuration: 500
    }
  ]
});
