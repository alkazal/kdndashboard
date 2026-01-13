export const getOverviewTotalOption = (value) => ({
  series: [
    {
      type: "gauge",
      startAngle: 180,
      endAngle: 0,
      min: 0,
      max: 8000,
      progress: { show: true, width: 12 },
      axisLine: { lineStyle: { width: 12 } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      detail: {
        valueAnimation: true,
        fontSize: 28,
        offsetCenter: [0, "50%"]
      },
      data: [{ value }]
    }
  ]
});
