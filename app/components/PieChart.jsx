"use client";
import "chart.js/auto";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const Pie = dynamic(() => import("react-chartjs-2").then((mod) => mod.Pie), {
  ssr: false,
});

const PieChart = ({ sexData, isLoading }) => {
  const { data: session, status } = useSession();

  const data = {
    labels: sexData.map((row) => row.categoria),
    datasets: [
      {
        label: "Total",
        data: sexData.map((item) => item.Cantidad),
        fill: false,
        backgroundColor: [
          "rgb(54, 162, 235)",
          "rgb(255, 99, 132)",
          "rgb(255, 205, 86)",
        ],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
    },
  };

  if (status === "loading" || isLoading === true) {
    return (
      <div className="container skeleton w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }

  return (
    <div className="w-80 h-25 card shadow items-center py-2 bg-base-100">
      <h1 className="font-bold text-white">Diversidad de Alumnos</h1>
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;
