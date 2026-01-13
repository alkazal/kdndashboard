export const getLaranganSummaryOption = (value) => ({
  series: [
    {
      type: "bar",
      data: [value],
      barWidth: "40%",
      itemStyle: { color: "#dc2626" }
    }
  ]
});
