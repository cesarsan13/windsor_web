"use client";
import "chart.js/auto";
import dynamic from "next/dynamic";
const Pie = dynamic(() => import("react-chartjs-2").then((mod) => mod.Pie), {
  ssr: false,
});
const data = {
  labels: ["January", "February", "March", "April", "May"],
  datasets: [
    {
      label: "GeeksforGeeks Line Chart",
      data: [65, 59, 80, 81, 56],
      fill: false,
      backgroundColor: [
        "rgb(255, 99, 132)",
        "rgb(54, 162, 235)",
        "rgb(255, 205, 86)",
      ],
    },
  ],
};
const PieChart = () => {
  return (
    <div className="w-2/3 h-1/8 card bg-slate-100">
      <h1>Example 1: Line Chart</h1>
      <Pie data={data} />
    </div>
  );
};
export default PieChart;
