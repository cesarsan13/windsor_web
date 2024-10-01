"use client";
import "chart.js/auto";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { getDataSex } from "@/app/utils/api/alumnos/alumnos";
import { useState } from "react";
const Pie = dynamic(() => import("react-chartjs-2").then((mod) => mod.Pie), {
  ssr: false,
});
const PieChart = () => {
  const { data: session, status } = useSession();
  const [sexData, setSexData] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  useEffect(() => {
    if (status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {
      setisLoading(true);
      const { token } = session.user;
      const data = await getDataSex(token);
      console.log(data);
      setSexData(data);
      setisLoading(false);
    };
    fetchData();
  }, [session, status]);

  const data = {
    labels: sexData.map((row) => row.categoria),
    datasets: [
      {
        label: "Diversidad de Alumnos",
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
  return (
    <div className="w-2/3 h-1/8 card bg-slate-100">
      <h1>Grafica de Diversidad de Alumnos</h1>
      <Pie data={data} />
    </div>
  );
};
export default PieChart;
