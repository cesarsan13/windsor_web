"use client";
import "chart.js/auto";
import dynamic from "next/dynamic";
const Line = dynamic(() => import("react-chartjs-2").then((mod) => mod.Line), {
  ssr: false,
});
const data = {
  labels: ["January", "February", "March", "April", "May"],
  datasets: [
    {
      label: "GeeksforGeeks Line Chart",
      data: [65, 59, 80, 81, 56],
      fill: false,
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1,
    },
  ],
};
const LineChart = () => {
  return (
    <div className="w-full card bg-base-100">
      <h1>Example 1: Line Chart</h1>
      <Line data={data} />
    </div>
  );
};
export default LineChart;
