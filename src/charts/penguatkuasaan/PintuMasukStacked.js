export const getPintuMasukStackedOption = (utama, sekunder) => ({
  tooltip: { trigger: "axis" },
  legend: { bottom: 0 },
  xAxis: {
    type: "category",
    data: ["Pemeriksaan", "Konsainan"]
  },
  yAxis: { type: "value" },
  series: [
    {
      name: "Utama",
      type: "bar",
      stack: "total",
      data: [
        utama.pemeriksaan,
        utama.konsainan
      ],
      itemStyle: { color: "#2563eb" }
    },
    {
      name: "Sekunder",
      type: "bar",
      stack: "total",
      data: [
        sekunder.pemeriksaan,
        sekunder.konsainan
      ],
      itemStyle: { color: "#22c55e" }
    }
  ]
});
