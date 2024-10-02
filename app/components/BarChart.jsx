"use client";
import "chart.js/auto";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { getAlumnoXHorario } from "@/app/utils/api/horarios/horarios";
import { scales } from "chart.js/auto";

const Bar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Bar), {
  ssr: false,
});
const BarChart = () => {
  const { data: session, status } = useSession();
  const [hData, setHData] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  useEffect(() => {
    if (status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {
      setisLoading(true);
      const { token } = session.user;
      const data = await getAlumnoXHorario(token);
      console.log(data);
      setHData(data);
      setisLoading(false);
    };
    fetchData();
  }, [session, status]);

  const data = {
    labels: hData.map((row) => row.horario),
    datasets: [
      {
        label: "Total Alumnos",
        data: hData.map((item) => item.Tot_Alumnos),
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      },
    ],
  };

  return (
    <div className="w-full  card shadow-md  bg-base-100 items-center">
      <h1 className="font-bold">Alumnos por Horario</h1>
      <Bar data={data} />
    </div>
  );
};
export default BarChart;
