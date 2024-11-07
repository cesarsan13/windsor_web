"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { showSwal, confirmSwal } from "@/app/utils/alerts";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import {
    getMateriasPorGrupo, 
    getInfoActividadesXGrupo, 
    getActividadesReg, 
    getMateriasReg, 
    getAlumno, 
} from "@/app/utils/api/concentradoCalificaciones/concentradoCalificaciones";
import Inputs from "@/app/concentradoCalificaciones/components/Inputs";
import Modal_Detalles_Actividades from "./components/modalDetallesActividades";
import Acciones from "@/app/concentradoCalificaciones/components/Acciones";
import BuscarCat from "@/app/components/BuscarCat";
import TablaConcentradoCal from "@/app/concentradoCalificaciones/components/TablaConcentradoCal";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "jspdf-autotable";
import ModalVistaPreviaConcentradoCal from "./components/ModalVistaPreviaConcentradoCal";


function ConcentradoCalificaciones() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [grupo, setGrupo] = useState({"numero": 0});
    const [isLoading, setisLoading] = useState(false);
    //const [isDisabledSave, setIsDisabledSave] = useState(true);
    const [materiasEncabezado, setMateriasEncabezado] = useState({});
    const [calificacionesTodosAlumnos, setCalificacionesTodosAlumnos] = useState({});
    const [materiasReg, setMateriasReg] = useState({});
    const [actividadesReg, setActividadesReg] = useState({});
    const [alumnoReg, setAlumnoReg] = useState({});
    const [bimestre, setBimestre] = useState(0);
    const [accion, setAccion] = useState("");
    const [alumnoData, setAlumnoData] = useState({});
    const [animateLoading, setAnimateLoading] = useState(false);
    const [pdfPreview, setPdfPreview] = useState(false);
    const [pdfData, setPdfData] = useState("");
    //const [dataEncabezado, setDataEncabezado] = useState([]);
    const [ dataCaliAlumnosBody, setDataCaliAlumnosBody] = useState([]);

    const dataEncabezado = [];

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const showModal = (show) => {
        show
          ? document.getElementById("DetallesActividades").showModal()
          : document.getElementById("DetallesActividades").close();
      };

    const Buscar = handleSubmit(async (data) => {
        
        if (grupo.numero === 0 && data.bimestre === '0'){
            showSwal('Error', 'Debes de seleccionar el grupo y el bimestre', 'error');
        }
        else {
        const {token} = session.user;
        let b = data.bimestre;
        setBimestre(Number(b));
        try{
            const [materiasEncabezado, matAlumnos, alumno, materias, actividades] = 
              await Promise.all([
                getMateriasPorGrupo(token, grupo.numero),
                getInfoActividadesXGrupo(token, grupo.numero, b),
                getAlumno(token, grupo.numero),
                getMateriasReg(token, grupo.numero),
                getActividadesReg(token),
            ]);
                setMateriasEncabezado(materiasEncabezado);
                setCalificacionesTodosAlumnos(matAlumnos);
                setAlumnoReg(alumno);
                setMateriasReg(materias);
                setActividadesReg(actividades);
        } catch (error) { }
        };
    });

    const handleVerClick = () => {
        setAnimateLoading(true);
        cerrarModalVista();
        console.log(grupo.numero, bimestre);
        console.log("body", dataCaliAlumnosBody);
        if (grupo.numero === 0 && bimestre === 0){
            showSwal('Error', 'Debes de seleccionar el grupo y el bimestre', 'error');
            setTimeout(() => {
              setPdfPreview(false);
              setPdfData("");
              setAnimateLoading(false);
              document.getElementById("modalVConCal").close();
            }, 500);
        }
        else {
            console.log(dataEncabezado);
            let posicionX = 45; 
            const incrementoX = 25;

            const configuracion = {
              Encabezado: {
                Nombre_Aplicacion: "Sistema de Control Escolar",
                Nombre_Reporte: "Reporte Altas Bajas de Alumnos por Periodo",
                Nombre_Usuario: `Usuario: ${session.user.name}`,
              },
            };
            const Enca1 = (doc) => {
                if (!doc.tiene_encabezado) {
                  doc.imprimeEncabezadoPrincipalH();
                  doc.nextRow(12);
                  doc.ImpPosX('Num.', 14, doc.tw_ren);
                  doc.ImpPosX('Alumno', 28, doc.tw_ren);
                  //datosEncabezado.forEach((desc) => {
                  //  doc.ImpPosX(desc.descripcion.toString(), 45, doc.tw_ren);
                  //});
                  dataEncabezado.forEach((desc) => {
                      doc.ImpPosX(desc.descripcion, posicionX, doc.tw_ren);
                      posicionX += incrementoX;
                  });
                  doc.nextRow(4);
                  doc.printLineH();
                  doc.nextRow(4);
                  doc.tiene_encabezado = true;
                } else {
                  doc.nextRow(6);
                  doc.tiene_encabezado = true;
                }
              };
              const reporte = new ReportePDF(configuracion, "Landscape");
              Enca1(reporte);
            
            setTimeout(() => {
              const pdfData = reporte.doc.output("datauristring");
              setPdfData(pdfData);
              setPdfPreview(true);
              showModalVista(true);
              setAnimateLoading(false);
            }, 500);
        }

    };

    const ImprimePDF = async () => {
        const configuracion = {
            Encabezado: {
                Nombre_Aplicacion: "Sistema de Control Escolar",
                Nombre_Reporte: "Reporte de Concentrado de Calificaciones",
                Nombre_Usuario: `Usuario: ${session.user.name}`,
            },
            body: "",
        };
        Imprimir(configuracion)
    };

    const ImprimeExcel = async () => {};

    const showModalVista = (show) => {
    show
      ? document.getElementById("modalVConCal").showModal()
      : document.getElementById("modalVConCal").close();
    };
    const cerrarModalVista = () => {
      setPdfPreview(false);
      setPdfData("");
      document.getElementById("modalVConCal").close();
    };
    

  const home = () => {
    router.push("/");
  };

    if (status === "loading") {
        return (
            <div className="container skeleton w-full max-w-screen-xl shadow-xl rounded-xl"></div>
        );
    }

    return(
        <>
           <Modal_Detalles_Actividades
                alumnoData = {alumnoData}
                materiasReg = {materiasReg}
                grupo = {grupo.numero}
                bimestre = {bimestre}
            />
            <ModalVistaPreviaConcentradoCal
                pdfPreview={pdfPreview}
                pdfData={pdfData}
                PDF={ImprimePDF}
                Excel={ImprimeExcel}
            />

            <div className="container h-[80vh] w-full max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden">
                <div className="flex flex-col justify-start p-3">
                    <div className="flex flex-wrap md:flex-nowrap items-start md:items-center"> 
                        <div className="order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0">
                            <Acciones
                                home={home}
                                Buscar={Buscar}
                                Ver={handleVerClick}
                                isLoading={isLoading}  
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
                            bimestre={bimestre}
                            showModal={showModal}
                            setAccion={setAccion}
                            setAlumnoData = {setAlumnoData}
                            setDataEncabezado = {dataEncabezado}
                            setDataCaliAlumnosBody = {setDataCaliAlumnosBody}

                        />
                    </div>
                </div>
            </div>
        </>
    );
}
export default  ConcentradoCalificaciones;