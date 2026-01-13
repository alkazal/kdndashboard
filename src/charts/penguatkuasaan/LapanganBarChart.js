export const getLapanganBarOption = (data) => ({
  tooltip: { trigger: "axis" },
  grid: { left: 40, right: 20, bottom: 40 },
  xAxis: {
    type: "category",
    data: [
      "Pemeriksaan",
      "Operasi",
      "Operasi Bersepadu",
      "Premis Diperiksa",
      "Naskhah Ditahan",
      "Filem Dirampas"
    ],
    axisLabel: { rotate: 25 }
  },
  yAxis: { type: "value" },
  series: [
    {
      type: "bar",
      data: [
        data.pemeriksaan,
        data.operasi,
        data.operasi_bersepadu,
        data.premis_diperiksa,
        data.naskhah_ditahan,
        data.filem_dirampas
      ],
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
