"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  getEstadisticasTotales,
  getCumpleañosMes,
  getConsultasInscripcion,
  getConsultasInsXMes
} from "@/app/utils/api/estadisticas/estadisticas";
import { getAlumnoXHorario } from "@/app/utils/api/horarios/horarios";
import { getDataSex } from "@/app/utils/api/alumnos/alumnos";
const menu = require("@/public/home.jpg");
const menu2 = require("@/public/home_movil.jpg");
const CardsHome = React.lazy(() => import("@/app/components/CardsHome"));
const BarChart = React.lazy(() => import("@/app/components/BarChart"));
const PieChart = React.lazy(() => import("@/app/components/PieChart"));
const CardInscritos = React.lazy(() => import("@/app/components/CardInscritos"));
import { formatNumber } from "@/app/utils/globalfn";
const CumpleañerosView = React.lazy(() =>
  import("@/app/components/Cumpleañeros/Cumpleañeros")
);
const AdeudosView = React.lazy(()=>
  import("@/app/components/Adeudos/Adeudos")
);
const SliderControl = React.lazy(() =>
  import("@/app/components/SliderControl")
);
import iconos from "./utils/iconos";
import { Documentos } from "./utils/api/Rep_Femac_7/Rep_Femac_7";
import { formatDate } from "./utils/globalfn";

export default function Home() {
  const { data: session, status } = useSession();
  const [totalAlumnos, setTotalAlumnos] = useState("");
  const [totalAlumnosXMes, setTotalAlumnosXMes] = useState("0");
  const [totalImporteXmes, setTotalImporteXmes] = useState("0");
  const [totalCursos, setTotalCursos] = useState("");
  const [totalAlPorGrado, setAlPorGrado] = useState("");
  const [horarioCantidadAlumnos, setHorarioCantidadAlumnos] = useState("");
  const [hData, setHData] = useState([]);
  const [sexData, setSexData] = useState([]);
  const [Cumpleañeros, setCumpleañeros] = useState([]);
  const [Inscritos, setInscritos] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [mesActual, setMesActual] = useState("");
  const [mesActualNum, setMesActualNum] = useState("");
  const [añoActual, setAñoActual] = useState("");
  let [mesSelect, setMesSelect] = useState("");
  const [adeudos,setAdeudos]=useState([]);
  useEffect(() => {
    if (status === "loading" || !session || dataLoaded) {
      return;
    }
    const fetchChart = async () => {
      setisLoading(true);

      // Crear una nueva fecha
      const fecha = new Date();
      // Obtener el nombre del mes en español
      const nombreMes = fecha.toLocaleString("es-ES", { month: "long" });
      // Capitalizar la primera letra
      setMesActual(nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1));
      
      // Los meses comienzan desde 0, así que sumamos 1
      const mes = fecha.getMonth() + 1; 
      setMesActualNum(mes);
      const año = fecha.getFullYear();
      setAñoActual(año);
      console.log(`mes => ${mes}`);
      console.log(`año => ${año}`);

      const { token } = session.user;
      const [res, dataAlHor, DataAlSex, cumpleañerosMes,Adeudos] = await Promise.all([
        getEstadisticasTotales(token),
        getAlumnoXHorario(token),
        getDataSex(token),
        getCumpleañosMes(token),
        Documentos(token,formatDate(fecha).replace(/\//g, "-"),false)
      ]);
      // const fechaHoy = formatDate(fecha).replace(/\//g, "-")
      // const AdeudosMes = Adeudos.documentos.filter((adeudo)=>adeudo.fecha === fechaHoy)
      setAdeudos(Adeudos)
      // console.log(res);
      // console.log("alumnsInscritos => ",alumnsInscritos);
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
      setCumpleañeros(cumpleañerosMes);
      setHorarioCantidadAlumnos(res.horarios_populares);
      // setInscritos(alumnsInscritos);
      // const objectFormat = {
      //   Alumnos: alumnsInscritos.data_alumnos,
      //   Detalles: alumnsInscritos.data_detalle,
      //   Productos: alumnsInscritos.data_productos,
      //   Horarios: alumnsInscritos.data_horarios,
      //   Fecha: `${año}/${mes}/01`
      // }
      // const totalesIns = await getConsultasInsXMes(objectFormat);
      // console.log("Totales => ",totalesIns);'
      // const formData = new FormData();
      // const fecha2 = new Date(año, mes, 0); // El día 0 retorna el último día del mes anterior
      // let ultDia = fecha2.getDate(); // Retorna el día (número) del último día
      // const fechaIni = `${añoActual}/${mesActualNum}/01`;
      // const fechaFin = `${añoActual}/${mesActualNum}/${ultDia}`;
      // formData.append("fecha_ini", fechaIni);
      // formData.append("fecha_fin", fechaFin);
      // console.log(`Fechas a enviar1 ${fechaIni} y ${fechaFin}`)
      // console.log(`Fechas a enviar2 ${año}/${mes}/01 y ${año}/${mes}/${ultDia}`)
      const totalesIns = await getConsultasInsXMes(token);
      console.log("Totales => ",totalesIns);
      setTotalAlumnosXMes(totalesIns.data[0].alumnos);
      setTotalImporteXmes(formatNumber(totalesIns.data[0].importe));
      setisLoading(false);
      setDataLoaded(true);
    };
    fetchChart();
  }, [session, status]);



  // useEffect(() => {
  //   // if (status === "loading" || !session || dataLoaded) {
  //   //   return;
  //   // }
  //   const fetchIns = async () => {
  //     const { token } = session.user;
  //     if (mesSelect < 10){
  //       mesSelect = "0"+mesSelect;
  //     }

  //     const formData = new FormData();
  //     const fecha2 = new Date(añoActual, mesSelect, 0); // El día 0 retorna el último día del mes anterior
  //     let ultDia = fecha2.getDate(); // Retorna el día (número) del último día
  //     const fecha3 = new Date(añoActual, mesActualNum, 0); // El día 0 retorna el último día del mes anterior
  //     let ultDia2 = fecha3.getDate(); // Retorna el día (número) del último día
  //     const mesInicio = mesSelect || mesActualNum;
  //     const fechaIni = `${añoActual}/${mesInicio}/01`;
  //     const fechaFin = `${añoActual}/${mesInicio}/${ultDia || ultDia2}`;
  //     formData.append("fecha_ini", fechaIni);
  //     formData.append("fecha_fin", fechaFin);
  //     console.log(`Fechas a enviar ${añoActual}/${mesSelect}/01 y ${añoActual}/${mesSelect}/${ultDia}`);
  //     console.log("Form Data => ",formData);
  //     const totalesIns = await getConsultasInsXMes(token,formData);
  //     console.log("Totales => ",totalesIns);
  //   }
  //   fetchIns();
  // }, [session,mesSelect,añoActual,mesActualNum]);

  if (status === "loading" || isLoading === true) {
    return (
      <div className="container skeleton w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  return (
    <main className="flex flex-col items-center justify-between h-[80vh] w-full max-w-screen-xl">
      <Image
        src={iconos.fondoHome}
        alt="Background"
        layout="fill"
        objectPosition="center"
        className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none" // Agregado pointer-events-none
      />
      <div className="carousel w-full ">
        <div id="slide1" className="carousel-item relative w-full">
          <div className="container">
            <div className="grid gap-10">
              <div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 place-content-start">
                  <CardsHome
                    titulo={`Total de Alumnos`}
                    value={totalAlumnos}
                    descripcion={`Alumnos inscritos en la institución.`}
                  />
                  <CardsHome
                    titulo={`Total de Grados`}
                    value={totalCursos}
                    descripcion={`Grados disponibles para los estudiantes.`}
                  />
                  <CardsHome
                    titulo={`Promedio Alumnos por Grado`}
                    value={totalAlPorGrado}
                    descripcion={`Reflejando la carga educativa.`}
                  />
                  <CardsHome
                    titulo={`Grado con más Alumnos`}
                    value={horarioCantidadAlumnos?.horario || "N/A"}
                    descripcion={
                      horarioCantidadAlumnos
                        ? `Con ${horarioCantidadAlumnos.total_estudiantes} alumnos cursandolo`
                        : "No hay información disponible."
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center">
                <BarChart hData={hData} isLoading={isLoading} />
                <PieChart sexData={sexData} isLoading={isLoading} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4  justify-items-center">
                <CumpleañerosView
                  cumpleañeros={Cumpleañeros}
                  mesActual={mesActual}
                ></CumpleañerosView>
                <AdeudosView
                adeudos={adeudos}
                mesActual={mesActual}
                ></AdeudosView>
                {/* <div className="grid gap-4 w-full card  items-center p-5 mb-4">
                  <div className="card w-full h-full bg-base-100 shadow-lg rounded-lg">
                    Hola
                  </div>
                  <div className="card w-full h-full bg-base-100 shadow-lg rounded-lg">
                    mudno
                  </div>
                  <div className="card w-full h-full bg-base-100 shadow-lg rounded-lg">
                    .
                  </div>
                </div> */}
                
                <CardInscritos
                    titulo={`Total de Alumnos`}
                    value={totalAlumnosXMes}
                    descripcion={`Importe Generado.`}
                    valueImp={totalImporteXmes}
                    setItem={setMesSelect}
                  />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4  justify-items-center">
                  
                </div>
            </div>
          </div>
          <SliderControl
            text1={"❮"}
            text2={"❯"}
            ref1={"slide2"}
            ref2={"slide2"}
          ></SliderControl>
        </div>
        <div id="slide2" className="carousel-item relative w-full">
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

          <SliderControl
            text1={"❮"}
            text2={"❯"}
            ref1={"slide1"}
            ref2={"slide1"}
          ></SliderControl>
        </div>
      </div>
    </main>
  );
}
