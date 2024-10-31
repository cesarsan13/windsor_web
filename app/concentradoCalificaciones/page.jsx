"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { showSwal, confirmSwal } from "@/app/utils/alerts";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import {getMateriasPorGrupo, getInfoActividadesXGrupo, getActividadesReg, getMateriasReg, getAlumno, getActividadesXHorarioXAlumnoXMateriaXBimestre} from "@/app/utils/api/concentradoCalificaciones/concentradoCalificaciones";
import Inputs from "@/app/concentradoCalificaciones/components/Inputs";
import Acciones from "@/app/concentradoCalificaciones/components/Acciones";
import BuscarCat from "@/app/components/BuscarCat";
import TablaConcentradoCal from "@/app/concentradoCalificaciones/components/TablaConcentradoCal";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "jspdf-autotable";


function ConcentradoCalificaciones() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [grupo, setGrupo] = useState({"numero": 0});
    const [isLoading, setisLoading] = useState(false);
    const [isDisabledSave, setIsDisabledSave] = useState(true);
    const [materiasEncabezado, setMateriasEncabezado] = useState({});
    const [calificacionesTodosAlumnos, setCalificacionesTodosAlumnos] = useState({});
    const [materiasReg, setMateriasReg] = useState({});
    const [actividadesReg, setActividadesReg] = useState({});
    const [alumnoReg, setAlumnoReg] = useState({});
    let bimestre = 0;
    let idAlumno = 0;
    let idMateria = 0;
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    bimestre = watch('bimestre');

    console.log("grupo", grupo.numero);

    useEffect(() => {
        if (status === "loading" || !session) {
            return;
          }           

        const fetchData1 = async () => {  
            const {token} = session.user;

            const [ materias, actividades] =
              await Promise.all([
                getMateriasReg(token),
                getActividadesReg(token),
            ]);
                setMateriasReg(materias);
                setActividadesReg(actividades);
            };
            
        fetchData1();
        //console.log(materiasEncabezado, calificacionesTodosAlumnos);
    }, [session, status, bimestre, grupo]);


    useEffect(() => {
        if (status === "loading" || !session) {
            return;
          } 
          
          
        const fetchData2 = async () => {  
            const {token} = session.user;

            const [materiasEncabezado, matAlumnos, alumno] = //detalleCalAlumno
              await Promise.all([
                getMateriasPorGrupo(token, grupo.numero),
                getInfoActividadesXGrupo(token, grupo.numero, bimestre),
                getAlumno(token, grupo.numero)
                //getActividadesXHorarioXAlumnoXMateriaXBimestre(token, grupo.numero, idAlumno, idMateria, bimestre)
            ]);
                console.log("a", alumno);
                setMateriasEncabezado(materiasEncabezado);
                setCalificacionesTodosAlumnos(matAlumnos);
                setAlumnoReg(alumno);
                //setCalificacionesDesgloseAlumno(detalleCalAlumno);
                
            };
            
        fetchData2();
        //console.log(materiasEncabezado, calificacionesTodosAlumnos);
    }, [session, status, bimestre, grupo]);

    
    //const Buscar = handleSubmit(async (data) => {});

  const handleVerClick = () => {};

  const home = () => {
    router.push("/");
  };

    if (status === "loading") {
        return (
            <div className="container skeleton w-full max-w-screen-xl shadow-xl rounded-xl"></div>
        );
    }
    return(
        <div className="container h-[80vh] w-full max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden">
            <div className="flex flex-col justify-start p-3">
                <div className="flex flex-wrap md:flex-nowrap items-start md:items-center"> 
                    <div className="order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0">
                        <Acciones
                            home={home}
                            Ver={handleVerClick}
                        />
                    </div>
                    <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
                        Concentrado de Calificaciones.
                    </h1>
                </div> 
            </div>
            <div className="flex flex-col items-center h-full">
                <div className="w-full max-w-4xl">
                    {/*<div className="flex flex-row justify-center space-x-4 w-[calc(100%)]">*/}
                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 w-full">
                        
                        <BuscarCat
                            table="horarios"
                            itemData={[]}
                            fieldsToShow={["numero", "horario"]}
                            nameInput={["numero", "horario"]}
                            titulo={"Asignatura: "}
                            setItem={setGrupo}
                            token={session.user.token}
                            modalId="modal_horario1"
                            alignRight={"text-right"}
                            inputWidths={{ contdef: "180px", first: "70px", second: "150px" }}
                        />

                        <Inputs
                            dataType={"int"}
                            name={"bimestre"}
                            tamañolabel={""}
                            className={"fyo8m-select p-1 grow bg-[#ffffff] "}
                            Titulo={"Bimestre: "}
                            type={"select"}
                            requerido={true}
                            errors={errors}
                            register={register}
                            message={"Bimestre Requerido"}
                            isDisabled={false}
                            maxLenght={5}
                            arreglos={[
                                { id: 1, descripcion: "1" },
                                { id: 2, descripcion: "2" },
                                { id: 3, descripcion: "3" },
                                { id: 4, descripcion: "4" },
                                { id: 5, descripcion: "5" },
                            ]}
                        />
                        
                    </div> 
                    <TablaConcentradoCal
                          materiasEncabezado = {materiasEncabezado}
                          calificacionesTodosAlumnos={calificacionesTodosAlumnos}
                          materiasReg = {materiasReg}
                          actividadesReg = {actividadesReg}
                          alumnoReg = {alumnoReg}
                    />
                </div>
            </div>
        </div>
    );
}
export default  ConcentradoCalificaciones;