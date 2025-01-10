"use client";
import "chart.js/auto";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const Bar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Bar), {
  ssr: false,
});

const BarChart = ({ hData, isLoading }) => {
  const { data: session, status } = useSession();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      const html = document.documentElement;
      setIsDarkMode(html.classList.contains("dark"));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const generateColors = (length) => {
    const colors = [];
    for (let i = 0; i < length; i++) {
      const r = Math.floor(Math.random() * 255);
      const g = Math.floor(Math.random() * 255);
      const b = Math.floor(Math.random() * 255);
      colors.push(`rgba(${r}, ${g}, ${b}, 0.6)`);
    }
    return colors;
  };

  const data = {
    labels: hData.map((row) => row.horario),
    datasets: [
      {
        label: "Total Alumnos",
        data: hData.map((item) => item.Tot_Alumnos),
        backgroundColor: generateColors(hData.length),
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          color: isDarkMode ? "white" : "black",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDarkMode ? "white" : "black",
        },
        grid: {
          color: isDarkMode ? "rgba(242, 242, 242, 0.2)" : "rgba(29, 35, 42, 0.1)",
        },
      },
      y: {
        ticks: {
          color: isDarkMode ? "white" : "black",
        },
        grid: {
          color: isDarkMode ? "rgba(242, 242, 242, 0.2)" : "rgba(29, 35, 42, 0.1)",
        },
      },
    },
  };


  if (status === "loading" || isLoading) {
    return (
      <div className="container skeleton w-full max-w-screen-xl shadow-xl rounded-xl"></div>
    );
  }

  return (
    <div className="w-full card shadow-md items-center bg-base-200 dark:bg-[#1d232a]">
      <h1 className="font-bold text-black dark:text-white">Alumnos por Horario</h1>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
