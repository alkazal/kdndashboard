export const getHQNegeriOption = (data) => ({
  tooltip: { trigger: "axis" },
  legend: { bottom: 20 },
  title: {
    text: 'KAJIAN NASKHAH (HQ vs NEGERI)',
  },
  xAxis: {
    type: "category",
    data: Object.keys(data)
  },
  yAxis: { type: "value" },
  series: [
    {
      name: "HQ",
      type: "bar",
      stack: "total",
      data: Object.values(data).map(d => d.hq),
      itemStyle: { color: "#94a3b8" }
    },
    {
      name: "Negeri",
      type: "bar",
      stack: "total",
      data: Object.values(data).map(d => d.negeri),
      itemStyle: { color: "#0d9488" }
    },
  ],
  label: {
        show: true,
        position: 'top',
        formatter: '{c}',
        fontSize: 12,
        fontWeight: 'bold'
      }
});

export const getKajianHQNegeriPieOption = (data) => ({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    data: ['HQ', 'Negeri']
  },
  series: [
    {
      name: 'Kajian Naskhah',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['60%', '50%'],
      avoidLabelOverlap: false,
      label: {
        show: true,
        position: 'outside',
        formatter: '{c}',
        fontSize: 14,
        fontWeight: 'bold'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '18',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: true
      },
      data: [
        { value: data.hq, name: 'HQ', itemStyle: { color: '#0d9488' } },
        { value: data.negeri, name: 'Negeri', itemStyle: { color: '#3b82f6' } }
      ]
    }
  ]
});
