
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Inputs from "@/app/concentradoCalificaciones/components/InputMateria";
import Acciones from "@/app/concentradoCalificaciones/components/AccionesDetalle";
import { useForm } from "react-hook-form";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import DetallesMaterias from "./TablaDetalles";
import {formatDate, formatTime} from "@/app/utils/globalfn"
import {
    getActividadesXHorarioXAlumnoXMateriaXBimestre,
    getActividadesDetalles,
    ImprimirPDFDetalle,
    ImprimirExcel
} from "@/app/utils/api/concentradoCalificaciones/concentradoCalificaciones";
import VistaPrevia from "@/app/components/VistaPrevia";
import { showSwal } from "@/app/utils/alerts";

function Modal_Detalles_Actividades({
    alumnoData,
    materiasReg,
    grupo,
    bimestre,
}){
    const [isLoading, setisLoading] = useState(false);
    const { data: session, status } = useSession();
    const [Actividades, setActividades] = useState({});
    const [matAct, setMatAct] = useState({});
    const [pdfData, setPdfData] = useState("");
    const [pdfPreview, setPdfPreview] = useState(false);
    const [isLoadingFind, setisLoadingFind] = useState(false);
    const [isLoadingPDF, setisLoadingPDF] = useState(false);

    let M = 0;

    let dataEncabezadoDetalles = [];
    let dataCaliAlumnosBodyDetalles = [];

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm();

    const materia = watch("materias");

    const Buscar = handleSubmit(async (data) => {  
        if(data.materias === '0' || data.materias === 0){
            showSwal("Error", "Debes de seleccionar la Materia", "error", "DetallesActividades");
        } else {
            setisLoading(true);
            setisLoadingFind(true);
            M = Number(data.materias);
            try{
                const { token } = session.user;
                const res = await getActividadesXHorarioXAlumnoXMateriaXBimestre(token, grupo, alumnoData.numero, M, bimestre);
                const acres = await getActividadesDetalles(token, M);
                setActividades(res);
                setMatAct(acres);
            } catch (error) { }
            setisLoading(false);
            setisLoadingFind(false);
        }
    });

    const eliminarArreglosDuplicados = (arr) => {
        const arreglosUnicos = [];
        const conjuntosUnicos = new Set();
        arr.forEach(subArray => {
            const cadena = JSON.stringify(subArray);
            if (!conjuntosUnicos.has(cadena)) {
                conjuntosUnicos.add(cadena);
                arreglosUnicos.push(subArray);
            }
        });
        return arreglosUnicos;
    };

    
    const handleVerClick = () => {
        setisLoadingPDF(true);
        if(materia === '0' && Actividades.length == undefined && matAct.length == undefined){
            showSwal("Error", "Debes de realizar la Busqueda", "error", "DetallesActividades");
        } else {
        const resultadoEnc = dataEncabezadoDetalles.filter((item, pos, arr) => 
            arr.findIndex(i => i.descripcion === item.descripcion) === pos
        );
        const resultadoBody = eliminarArreglosDuplicados(dataCaliAlumnosBodyDetalles);

        const MateriaNombre = materiasReg.filter((c) => c.numero === Number(materia));
        
        cerrarModalVista();
        if ( grupo.numero === 0 && bimestre === 0 )
        {
            showSwal('Error', 'Debes de realizar la Busqueda', 'error');
            setTimeout(() => {
              setPdfPreview(false);
              setPdfData("");
              setisLoadingPDF(false);
              document.getElementById("modalVDetCal").close();
            }, 500);
        } else {
            let posicionX = 14; 
            const incrementoX = 27;
            const configuracion = {
              Encabezado: {
                Nombre_Aplicacion: "Sistema de Control Escolar",
                Nombre_Reporte: "Reporte de Concentrado de Calificaciones",
                Nombre_Usuario: `Usuario: ${session.user.name}`,
                Datos_Grupo:  `Alumno: ${alumnoData.nombre}   Bimestre: ${bimestre}   Materia:${MateriaNombre[0].descripcion}`,
              },
              body: resultadoBody
            };

            const reporte = new ReportePDF(configuracion, "Portrait");
            const {body} = configuracion;
            const Enca1 = (doc) => {
                if (!doc.tiene_encabezado) {
                  doc.imprimeEncabezadoPrincipalVConcentradoCal();
                  doc.nextRow(12);
                  
                  resultadoEnc.forEach((desc) => {
                      doc.ImpPosX(desc.descripcion, posicionX, doc.tw_ren, 10);
                      posicionX += incrementoX;
                  });
                  doc.ImpPosX("Promedio", posicionX, doc.tw_ren, 25);
                  doc.nextRow(4);
                  doc.printLineV();
                  doc.nextRow(4);
                  doc.tiene_encabezado = true;
                } else {
                  doc.nextRow(6);
                  doc.tiene_encabezado = true;
                }
              };
            Enca1(reporte);
            let posicionBody = 34;
            body.forEach((valor, idx) => {
                  reporte.ImpPosX(valor, posicionBody, reporte.tw_ren, 0, "R");
                  posicionBody+= incrementoX;
            })
            Enca1(reporte);
              if (reporte.tw_ren >= reporte.tw_endRenH) {
                  reporte.pageBreakH();
                  Enca1(reporte);
              }
            
            setTimeout(() => {
              const pdfData = reporte.doc.output("datauristring");
              setPdfData(pdfData);
              setPdfPreview(true);
              showModalVista(true);
              setisLoadingPDF(false);
            }, 500);
        }
        }
    };
    const ImprimePDF = async () => {
        let fecha_hoy = new Date();

        const resultadoEnc = dataEncabezadoDetalles.filter((item, pos, arr) => 
            arr.findIndex(i => i.descripcion === item.descripcion) === pos
        );
        const resultadoBody = eliminarArreglosDuplicados(dataCaliAlumnosBodyDetalles);

        const MateriaNombre = materiasReg.filter((c) => c.numero === Number(materia));

        const configuracion = {
            Encabezado: {
              Nombre_Aplicacion: "Sistema de Control Escolar",
              Nombre_Reporte: "Reporte de Concentrado de Calificaciones",
              Nombre_Usuario: `Usuario: ${session.user.name}`,
              Datos_Grupo:  `Alumno: ${alumnoData.nombre}   Bimestre: ${bimestre}   Materia:${MateriaNombre[0].descripcion}`,
            },
            body: resultadoBody
          };
          ImprimirPDFDetalle(configuracion, resultadoEnc, fecha_hoy, alumnoData.nombre)
    }

    const ImprimeExcel = async () => {
        const MateriaNombre = materiasReg.filter((c) => c.numero === Number(materia));
        
        let fecha_hoy = new Date();
        const dateStr = formatDate(fecha_hoy);
        const timeStr = formatTime(fecha_hoy);

        const resultadoEnc = dataEncabezadoDetalles.filter((item, pos, arr) => 
            arr.findIndex(i => i.descripcion === item.descripcion) === pos
        );
        const columns = resultadoEnc.map((item, index) => ({
            header: item.descripcion,
            dataKey: index.toString(),
        }));
        columns.push({
            header: "Promedio",
            dataKey: resultadoEnc.length.toString(),
        });

        const ArregloProvisional = [];
        const resultadoBody = eliminarArreglosDuplicados(dataCaliAlumnosBodyDetalles);
        ArregloProvisional.push(resultadoBody);

        const configuracion = {
            Encabezado: {
                Nombre_Aplicacion: "Sistema de Control Escolar",
                Nombre_Reporte: "Reporte de Comentarios",
                Nombre_Usuario: `Usuario: ${session.user.name}`,
                Clase: `Alumno: ${alumnoData.nombre}   Bimestre: ${bimestre}   Materia:${MateriaNombre[0].descripcion}`
            },
            body: ArregloProvisional,
            columns: columns,
            nombre: `ConcentradoCalificaciones_${alumnoData.nombre}_${dateStr.replaceAll("/","")}${timeStr.replaceAll(":","")}`,
        };
        ImprimirExcel(configuracion);
    };

    const cerrarModalVista = () => {
      setPdfPreview(false);
      setPdfData("");
      document.getElementById("modalVDetCal").close();
    };
    
    const showModalVista = (show) => {
    show
      ? document.getElementById("modalVDetCal").showModal()
      : document.getElementById("modalVDetCal").close();
    };
   
    return(
        <>

            <VistaPrevia
                pdfPreview={pdfPreview}
                pdfData={pdfData}
                PDF={ImprimePDF}
                Excel={ImprimeExcel}
                id="modalVDetCal"
                titulo="Vista Previa Detalles Calificaciones"
                CerrarView={cerrarModalVista}
            />

            <dialog id='DetallesActividades' className="modal">
                <div className="modal-box w-full max-w-5xl h-full bg-base-200">
                    <form  encType="multipart/form-data">
                        <div className="sticky -top-6 flex justify-between items-center bg-base-200 w-full h-10 z-10 mb-5">
                            <h3 className="font-bold text-lg text-neutral-600 dark:text-white"> Detalles alumno: {alumnoData.nombre} </h3>
                            <div className="flex space-x-2 items-center">
                            <button
                              className="btn btn-sm btn-circle btn-ghost bg-base-200 dark:bg-[#1d232a] text-neutral-600 dark:text-white"
                              onClick={(event) => {
                                event.preventDefault();
                                document.getElementById("DetallesActividades").close();
                                setActividades({});
                                setMatAct({});
                                reset({
                                  materias: 0,
                                });
                              }}
                            >
                              ✕
                            </button>
                            </div>
                        </div>
                        <fieldset>
                            <div className="flex flex-row justify-center items-center h-full">
                                <div className="order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0">
                                    <Acciones
                                        Buscar={Buscar}
                                        Ver={handleVerClick}
                                        isLoadingFind={isLoadingFind}
                                        isLoadingPDF={isLoadingPDF}
                                    />
                                    </div>

                                    <Inputs
                                        dataType={"int"}
                                        name={"materias"}
                                        tamañolabel={""}
                                        className={"fyo8m-select p-1 grow bg-[#ffffff] "}
                                        Titulo={"Materia: "}
                                        type={"select"}
                                        requerido={true}
                                        errors={errors}
                                        register={register}
                                        message={"Materia Requerido"}
                                        isDisabled={false}
                                        maxLenght={5}
                                        arreglos={materiasReg}
                                    />

                                </div>
                                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 w-full mt-10">
                                    <div className="w-4/5">
                                        <h4 className="font-bold text-lg text-neutral-600 dark:text-white"> Actividades y Evaluaciones</h4>
                                        <DetallesMaterias
                                         isLoading={isLoading}
                                         Actividades = {Actividades}
                                         matAct = {matAct}
                                         AlumnoD = {alumnoData.numero}
                                         materiaD = {M}
                                         bimestre = {bimestre}
                                         dataEncabezadoDetalles = {dataEncabezadoDetalles}
                                         dataCaliAlumnosBodyDetalles={dataCaliAlumnosBodyDetalles}
                                        />
                                    </div>
                                </div>
                        </fieldset>
                    </form>
                </div>
            </dialog>
        </>
    );
}
export default Modal_Detalles_Actividades;