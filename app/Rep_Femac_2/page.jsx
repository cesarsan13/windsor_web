"use client"
import React from "react"
import { useRouter } from "next/navigation";
import Acciones from "./components/Acciones";
import Inputs from "./components/Inputs";
import ImpElementos from "./components/ImpElementos";
import { useForm } from "react-hook-form";
import { 
  ImprimirPDF,
  ImprimirExcel,
  getHorariosAPC,
} from "../utils/api/Rep_Femac_2/Rep_Femac_2";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

function AlumnosPorClase(){
  const router = useRouter();
  const {data: session, status} = useSession();
  const [isLoading, setisLoading] = useState(false);
  const [formaHorarioAPC, setFormaHorarioAPC] = useState([]);
  const [shorario1, ssethorario1] = useState('');
  const [shorario2, ssethorario2] = useState('');
  const [sOrdenar, ssetordenar] = useState('');


  useEffect(()=> {
    if(status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {
      setisLoading(true);
      const { token } = session.user;
      const data = await getHorariosAPC(token);
      setFormaHorarioAPC(data);

      setisLoading(false);
    };
    fetchData();
  }, [session, status]);


  const ImprimePDF = () => {
    const configuracion = {
      Encabezado:{
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Alumnos por clase",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      //body: formaComentariosFiltrados
    }
    ImprimirPDF(configuracion)
  }

  const ImprimeExcel = () => {
    const configuracion = {
      Encabezado:{
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Alumnos por clase",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      
      //body: formaComentariosFiltrados,
      columns:[
        { header: "Nombre", dataKey: "nombre" },
        { header: "Id", dataKey: "id" },
        { header: "Año", dataKey: "fecha_nac" },
        { header: "mes", dataKey: "fecha_nac" },
        { header: "Telefono", dataKey: "telefono_1" },
    ],

    nombre: "Comentarios"
  }
  ImprimirExcel(configuracion)
}

  const home = () => {
    router.push("/");
  };

  const handleSelectionChange = (event) =>{
    event.preventDefault;
    ssetordenar(event.target.value);
    ssethorario2(event.target.value);
    ssethorario1(event.target.value);
    console.log(event.target.value);
  }

  const handleCheckChange = (event) =>{
    event.preventDefault;
    ssetordenar(event.target.value);
    console.log(event.target.value);
  }
  
  if (status === "loading") {
    return (
      <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  return (
    <>
      <div className="container  w-full  max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3 ">
        <div className="flex justify-start p-3 ">
          <h1 className="text-4xl font-xthin text-black dark:text-white md:px-12">
          Lista de Alumnos por clase.
          </h1>
        </div>
        <div className="container grid grid-cols-8 grid-rows-1 h-[calc(100%-20%)] ">
          <div className="col-span-1 flex flex-col ">
            <Acciones ImprimePDF={ImprimePDF} ImprimeExcel={ImprimeExcel} home={home}></Acciones>
          </div>
        
        <div className="col-span-7 ">
            <ImpElementos
              setFormaHorarioAPC={formaHorarioAPC}
              sOrdenar={sOrdenar}
              shorario1={shorario1}
              shorario2={shorario2}
              handleSelectionChange = {handleSelectionChange}
              handleCheckChange = {handleCheckChange}
            />
        </div>
        </div>
      </div>
    </>
  );

}

export default AlumnosPorClase;