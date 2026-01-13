export const getPintuMasukDonutOption = (data) => ({
  legend: {
    orient: 'horizontal',
    top: 120,
    left: 'left',
    itemGap: 5
  },
  tooltip: { trigger: "item" },
  series: [
    {
      type: "pie",
      radius: ["55%", "75%"],
      label: {
        show: true,
        position: 'outside',
        formatter: '{c}',
        fontSize: 14,
        fontWeight: 'bold'
      },
      data: [
        {
          name: "PEMERIKSAAN",
          value: data.jumlah_pemeriksaan
        },
        {
          name: "KONSAINAN/ BUNGKUSAN DIPERIKSA",
          value: data.jumlah_konsainan
        }
      ]
    }
  ]
});
