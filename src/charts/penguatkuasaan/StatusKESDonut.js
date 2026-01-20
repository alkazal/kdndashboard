export function getStatusKESDonutOption(laporan) {
  // Group laporan data by STATUS KES
  const statusCount = {};
  
  laporan.forEach(item => {
    const status = item["STATUS KES"] || "Tidak Diketahui";
    statusCount[status] = (statusCount[status] || 0) + 1;
  });

  const data = Object.entries(statusCount).map(([name, value]) => ({
    name,
    value
  }));

  return {
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)"
    },
    legend: {
      orient: "vertical",
      left: "left",
      textStyle: {
        color: "#64748b"
      }
    },
    series: [
      {
        name: "STATUS KES",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: [4, 4],
          borderColor: "#fff",
          borderWidth: 2
        },
        label: {
            show: true,
            position: 'outside',
            formatter: '{c}',
            fontSize: 14,
            fontWeight: 'bold'
        },
        emphasis: {
          label: {
            show: true
          }
        },
        labelLine: {
          show: true
        },
        data: data,
        colors: [
          "#3b82f6",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
          "#ec4899",
          "#14b8a6",
          "#f97316"
        ]
      }
    ]
  };
}
