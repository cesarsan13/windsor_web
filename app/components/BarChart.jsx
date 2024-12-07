"use client";
import "chart.js/auto";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";


const Bar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Bar), {
  ssr: false,
});

const BarChart = ({ hData, isLoading }) => {
  const { data: session, status } = useSession();
  // const [hData, setHData] = useState([]);
  // const [isLoading, setisLoading] = useState(false);

  // useEffect(() => {
  //   if (status === "loading" || !session) {
  //     return;
  //   }
  //   const fetchData = async () => {
  //     setisLoading(true);
  //     const { token } = session.user;
  //     const data = await getAlumnoXHorario(token);
  //     setHData(data);
  //     setisLoading(false);
  //   };
  //   fetchData();
  // }, [session, status]);

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
        backgroundColor: generateColors(hData.length), // Colores para cada barra
      },
    ],
  };

  if (status === "loading" || isLoading === true) {
    return (
      <div className="container skeleton w-full max-w-screen-xl shadow-xl rounded-xl"></div>
    );
  }

  return (
    <div className="w-full card shadow-md bg-base-100 items-center">
      <h1 className="font-bold">Alumnos por Horario</h1>
      <Bar data={data} />
    </div>
  );
};

export default BarChart;
