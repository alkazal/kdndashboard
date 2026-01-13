export const getKNPBahasaOption = (knp) => ({
  title: {
    text: 'NASKHAH KNP MENGIKUT BAHASA',
    //subtext: 'Fake Data',
    left: 'center'
  },
  tooltip: { trigger: "item" },
  // legend: {
  //   top: '5%',
  //   itemGap: 10
  // },
  legend: {
    bottom: 0,
    left: 'center',
    orient: 'horizontal',
    itemGap: 5
  },
  series: [
    {
      type: "pie",
      radius: ["40%", "70%"],
      data: Object.entries(knp.bahasa).map(([k, v]) => ({
        name: k,
        value: v
      })),
      label: {
        show: true,
        position: 'inside',
        formatter: '{c}',
        fontSize: 14,
        fontWeight: 'bold'
      },
    }
  ]
});
