"use client"
import React from "react"
import { useRouter } from "next/navigation";
import Acciones from "./components/Acciones";
import Inputs from "./components/Inputs";
import { useForm } from "react-hook-form";
import { 
  ImprimirPDF,
  ImprimirExcel,
  getHorariosAPC,
} from "../utils/api/alumnosporclase/alumnosporclase";
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


  useEffect(()=> {
    if(status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {
      setisLoading(true);
      const { token } = session.user;
      const data = await getHorariosAPC(token);
      console.log(data);
      setFormaHorarioAPC(data);

      setisLoading(false);
    };
    fetchData();
  }, [session, status]);


  const {
    formState: { errors },
  } = useForm({
    defaultValues: {
      numero: formaHorarioAPC.numero,
      horario: formaHorarioAPC.horario,
    },
  });


  const ImprimePDF = () => {
    const configuracion = {
      Encabezado:{
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Comentarios",
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
        Nombre_Reporte: "Reporte de Comentarios",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      
      //body: formaComentariosFiltrados,
      columns:[
      { header: "Id", dataKey: "id" },
      { header: "Comentario 1", dataKey: "comentario_1" },
      { header: "Comentario 2", dataKey: "comentario_2" },
      { header: "Comentario 3", dataKey: "comentario_3" },
      { header: "Generales", dataKey: "generales" },
    ],

    nombre: "Comentarios"
  }
  ImprimirExcel(configuracion)
}

  const home = () => {
    router.push("/");
  };
  
  if (status === "loading") {
    return (
      <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  return (
    <>
      <div className="container  w-full  max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl shadow-xl rounded-xl px-3 ">
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
            <div className="flex flex-row h-[calc(100%)] gap-4">
           <Inputs
            dataType={"string"}
            name={"Grado1"}
            tamañolabel={"w-10/10"}
            className={" w-1/6 grow text-right"}
            Titulo={"Grado 1:"}
            type={"select"}
            requerido={true}
            isNumero={false}
            errors={errors}
            message={"Grado 1 requerido"}
            maxLength={50}
            setFormaHorarioAPC={formaHorarioAPC}
          />
          <Inputs
            name={"Grado2"}
            tamañolabel={"w-10/10"}
            className={" w-1/6 grow text-right"}
            Titulo={"Grado 2:"}
            type={"select"}
            requerido={true}
            isNumero={false}
            errors={errors}
            message={"Grado 2 requerido"}
            maxLength={50}
            setFormaHorarioAPC={formaHorarioAPC}
          /> 
          </div>
        </div>
        </div>
      </div>
    </>
  );

}

export default AlumnosPorClase;