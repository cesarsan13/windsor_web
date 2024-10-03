"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
const menu = require("@/public/home.jpg");
const menu2 = require("@/public/home_movil.jpg");
import { getEstadisticasTotales } from "@/app/utils/api/estadisticas/estadisticas";
import { getAlumnoXHorario } from "@/app/utils/api/horarios/horarios";
import { getDataSex } from "@/app/utils/api/alumnos/alumnos";
import CardsHome from "@/app/components/CardsHome";
import LineChart from "@/app/components/LineChart";
import BarChart from "@/app/components/BarChart";
import PieChart from "@/app/components/PieChart";
export default function Home() {
  const { data: session, status } = useSession();
  const [totalAlumnos, setTotalAlumnos] = useState("");
  const [totalCursos, setTotalCursos] = useState("");
  const [totalAlPorGrado, setAlPorGrado] = useState("");
  const [horarioCantidadAlumnos, setHorarioCantidadAlumnos] = useState("");
  const [hData, setHData] = useState([]);
  const [sexData, setSexData] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    if (status === "loading" || !session) {
      return;
    }
    const fetchChart = async () => {
      setisLoading(true);
      const { token } = session.user;
      const [res, dataAlHor, DataAlSex] = await Promise.all([
        getEstadisticasTotales(token),
        getAlumnoXHorario(token),
        getDataSex(token),
      ]);
      // console.log(res);
      const totalEstudiantes = res.promedio_alumnos_por_curso.reduce(
        (acc, cur) => acc + cur.total_estudiantes,
        0
      );
      const totalGrados = res.promedio_alumnos_por_curso.length;
      const promedioTotal =
        totalGrados > 0 ? Math.round(totalEstudiantes / totalGrados) : 0;
      setTotalAlumnos(res.total_alumnos);
      setTotalCursos(res.total_cursos);
      setHData(dataAlHor);
      setSexData(DataAlSex);
      setAlPorGrado(promedioTotal);
      setHorarioCantidadAlumnos(res.horarios_populares);
      setisLoading(false);
    };
    fetchChart();
  }, [session, status]);

  if (status === "loading" || isLoading === true) {
    return (
      <div className="container skeleton w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  return (
    <main className="flex flex-col items-center justify-between h-[80vh] w-full max-w-screen-xl">
      <div className="carousel w-full ">
        <div id="slide1" className="carousel-item relative w-full">
          <Image
            alt="Menu"
            src={menu}
            className="hidden md:block h-full w-full "
            width={""}
            height={""}
          />

          <Image
            alt="Menu"
            src={menu2}
            className="w-full h-full md:hidden"
            width={""}
            height={""}
          />

          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <a href="#slide2" className="btn btn-circle">
              ❮
            </a>
            <a href="#slide2" className="btn btn-circle">
              ❯
            </a>
          </div>
        </div>
        <div id="slide2" className="carousel-item relative w-full">
          <div className="container">
            <div className="grid gap-10">
              <div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 place-content-start">
                  < CardsHome
                    titulo={`Total de Alumnos`}
                    value={totalAlumnos}
                    descripcion={`Alumnos inscritos en la institución.`}
                  />
                  < CardsHome
                    titulo={`Total de Grados`}
                    value={totalCursos}
                    descripcion={`Grados disponibles para los estudiantes.`}
                  />
                  < CardsHome
                    titulo={`Promedio Alumnos por Grado`}
                    value={totalAlPorGrado}
                    descripcion={`Reflejando la carga educativa.`}
                  />
                  < CardsHome
                    titulo={`Grado con más Alumnos`}
                    value={horarioCantidadAlumnos?.horario || "N/A"}
                    descripcion={horarioCantidadAlumnos
                      ? `Con ${horarioCantidadAlumnos.total_estudiantes} alumnos cursandolo`
                      : "No hay información disponible."}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center">
                <BarChart
                  hData={hData}
                  isLoading={isLoading}
                />
                <PieChart
                  sexData={sexData}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <a href="#slide1" className="btn btn-circle">
              ❮
            </a>
            <a href="#slide1" className="btn btn-circle">
              ❯
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
