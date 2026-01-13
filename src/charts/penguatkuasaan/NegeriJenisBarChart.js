export const getNegeriJenisBarOption = (
  negeriList,
  jenisList,
  data
) => ({
  tooltip: { trigger: "axis" },
  legend: { bottom: 0 },
  grid: { left: 40, right: 20, bottom: 60 },

  xAxis: {
    type: "category",
    data: negeriList,
    axisLabel: { rotate: 0 }
  },

  yAxis: { type: "value" },

  series: jenisList.map((jenis) => ({
    name: jenis,
    type: "bar",
    stack: "total",
    data: negeriList.map(
      (negeri) => data[jenis]?.[negeri] || 0
      ),
    label: {
        show: true,
        position: 'top',
        formatter: '{c}',
        fontSize: 12,
        fontWeight: 'bold'
      },
    emphasis: { focus: "series" }
  }))
});
