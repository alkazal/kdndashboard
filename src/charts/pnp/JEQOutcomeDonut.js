export const getJEQOutcomeOption = (jeq) => ({
  tooltip: { trigger: "item" },
  legend: { bottom: 0 },
  series: [
    {
      type: "pie",
      radius: ["45%", "70%"],
      avoidLabelOverlap: true,
      itemStyle: {
        borderColor: "#fff",
        borderWidth: 1
      },
      label: {
        show: true,
        position: 'outside',
        formatter: '{b}: {c}',
        fontSize: 12,
        fontWeight: 'bold'
      },
      data: [
        { name: "Tiada Perakuan / Rosak", value: jeq.tiada_perakuan_rosak },
        { name: "Diganti", value: jeq.diganti }
      ]
    }
  ]
});
