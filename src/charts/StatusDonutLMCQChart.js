export const getStatusDonutLMCQOption = (pruf) => ({
  tooltip: { trigger: "item" },
  title: {
    text: 'JUMLAH KESELURUHAN',
    left: 'center',
    top:5
  },
  legend: { bottom: 0 },
  series: [
    {
      type: "pie",
      radius: ["50%", "70%"],
      avoidLabelOverlap: true,
      itemStyle: {
        borderColor: "#fff",
        borderWidth: 1
      },
      label: {
        show: true,
        position: 'outside',
        formatter: '{c}',
        fontSize: 14,
        fontWeight: 'bold'
      },
      data: [
        { name: "Mohon", value: pruf.summary.mohon },
        { name: "Lulus", value: pruf.summary.lulus }        
      ],
      animationDuration: 500
    }
  ]
});
