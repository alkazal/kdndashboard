export const getLapanganBarOption = (data) => ({
  tooltip: { 
    trigger: "axis",
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: { 
    left: 60, 
    right: 40, 
    bottom: 0,
    top: 20,
    containLabel: true 
  },
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
    axisLabel: {       
      rotate: 8,
      fontSize: 11,
      color: '#FFF'
    }
  },
  yAxis: { 
    type: "value",
    axisLabel: {
      fontSize: 11,
      color: '#FFF'
    }
  },
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
      barWidth: "50%",
      itemStyle: {
        color: "#14b8a6",
        borderRadius: [6, 6, 0, 0]
      },
      animationDuration: 900,
      animationDelay: (idx) => idx * 120,
      animationEasing: "cubicOut",
      label: {
        show: true,
        position: 'top',
        formatter: '{c}',
        fontSize: 12,
        fontWeight: 'bold',
        // color: '#334155'
      }
    }
  ]
});
