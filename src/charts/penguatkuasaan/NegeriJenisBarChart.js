export const getNegeriJenisBarOption = (
  negeriList,
  jenisList,
  data,
  highlight = {}
) => ({
  tooltip: { trigger: "axis" },
  legend: {
    bottom: 0,
    textStyle: {
      color: '#FFF' // Set the desired color (e.g., red)
    }
   },
 grid: { 
    left: 60, 
    right: 40, 
    bottom: 30,
    top: 20,
    containLabel: true 
  },

  xAxis: {
    type: "category",
    data: negeriList,
    axisLabel: {
      rotate: 0,
      color: '#FFF'
     }
  },

  yAxis: {
    type: "value",
    axisLabel: {      
      color: '#FFF'
     }
   },

  series: jenisList.map((jenis) => {
    const highlightActive = Boolean(highlight?.negeri || highlight?.jenis);
    return {
      name: jenis,
      type: "bar",
      stack: "total",
      data: negeriList.map((negeri) => {
        const value = data[jenis]?.[negeri] || 0;
        const matchJenis = !highlight?.jenis || highlight.jenis === jenis;
        const matchNegeri = !highlight?.negeri || highlight.negeri === negeri;
        const isMatch = matchJenis && matchNegeri;

        if (!highlightActive) return value;

        return {
          value,
          itemStyle: isMatch
            ? { borderColor: "#facc15", borderWidth: 2, opacity: 1 }
            : { opacity: 0.25 }
        };
      }),
      label: {
        show: true,
        position: "top",
        formatter: "{c}",
        fontSize: 12,
        fontWeight: "bold"
      },
      emphasis: { focus: "series" }
    };
  })
});
