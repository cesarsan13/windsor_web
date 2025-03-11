

import React, { useState} from "react";
import { useSession } from "next-auth/react";
import Acciones from "@/app/concentradoCalificaciones/components/AccionesDetalle";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import {formatDate, formatTime} from "@/app/utils/globalfn"
import {
    getActividadesXHorarioXAlumnoXMateriaXBimestre,
    getActividadesDetalles,
    ImprimirPDFDetalle,
    ImprimirExcelCC
} from "@/app/utils/api/concentradoCalificaciones/concentradoCalificaciones";
import VistaPrevia from "@/app/components/VistaPrevia";
import { showSwal } from "@/app/utils/alerts";
import {RegresaCalificacionRedondeo} from "@/app/utils/globalfn";
import Loading from "@/app/components/loading";

function Modal_Detalles_Actividades({
    alumnoData,
    materiasReg,
    grupo,
    bimestre,
    accion
}){
    const [isLoading, setisLoading] = useState(false);
    const { data: session } = useSession();
    const [Actividades, setActividades] = useState({});
    const [matAct, setMatAct] = useState([]);
    const [pdfData, setPdfData] = useState("");
    const [pdfPreview, setPdfPreview] = useState(false);
    const [isLoadingFind, setisLoadingFind] = useState(false);
    const [isLoadingPDF, setisLoadingPDF] = useState(false);
    const [dataEncabezadoDetalles, setdataEncabezadoDetalles] = useState([]);
    const [resultadoImpresion, setresultadoImpresion] = useState({});

    const BuscarCalificaciones = async () => {
        setisLoadingFind(true);
        setisLoading(true);
        const { token } = session.user;
        const resultData = {};
        
        if (accion === `Ver`) {
            await Promise.all(
                materiasReg.map(async (mat) => {
                    let index = 0;
                    let M = Number(mat.numero);
                    const Actividades = await getActividadesXHorarioXAlumnoXMateriaXBimestre(token, grupo, alumnoData.numero, M, bimestre);
                    const matAct = await getActividadesDetalles(token, M);
                    let dataEncabezadoDetalles = matAct.map(item => ({
                        descripcion: item.descripcion,
                        index: index++,
                    }));
                    let dataCaliAlumnosBodyDetalles = await Promise.all(
                        matAct.map(async (item) => {
                            const cal = await calcularCalificacionesMat(item.secuencia, Actividades, matAct);
                            return cal;
                        })
                    );
                    const promedio = dataCaliAlumnosBodyDetalles.reduce((acc, num) => Number(acc) + Number(num), 0) / dataCaliAlumnosBodyDetalles.length;
                    dataCaliAlumnosBodyDetalles.push((promedio).toFixed(1));  
                    dataEncabezadoDetalles.push({descripcion: "Promedio",index: index++,});
                    resultData[mat.descripcion] = [dataEncabezadoDetalles, dataCaliAlumnosBodyDetalles];
                })
            );
        }
        setresultadoImpresion(resultData);
        setisLoading(false);
        setisLoadingFind(false);
    }; 

    const calcularCalificacionesMat = async (secuencia, Actividades, matAct) => {
            let sumatoria = 0;
            let evaluaciones = 0;
            const actividades = matAct.filter(act => act.secuencia === secuencia);
            if (actividades.length === 0){
                return 0.0;
            } else {
            if (Actividades.length > 1) {
                for (const actividad of actividades) {
                    const filtroActividad = Actividades.filter(cal =>
                        cal.actividad === secuencia &&
                        cal.unidad <= actividad[`EB${bimestre}`]
                    );
                    if (filtroActividad.length > 0) {
                        const califSum = filtroActividad.reduce((acc, cal) => acc + Number(cal.calificacion), 0);
                        sumatoria += RegresaCalificacionRedondeo(califSum / filtroActividad.length, "N");
                        evaluaciones++;
                    }
                }
                return evaluaciones === 0 ? 0 : (sumatoria / evaluaciones).toFixed(1);
            }else if (Actividades.length === 1){
                let cal = RegresaCalificacionRedondeo(Number(Actividades[0].calificacion), "N");
                return(cal.toFixed(1));
            } else {
                let cal = RegresaCalificacionRedondeo(Number(0), "N");
                 return(cal.toFixed(1));
            }   
        }
    };

    const handleVerClick = () => {
        if(accion !== "Ver" || Object.keys(resultadoImpresion).length === 0 || Array.isArray(resultadoImpresion)){
            showSwal("Error", "Debes de realizar la Busqueda", "error", "DetallesActividades");
        } else {
            setisLoadingPDF(true);
            const incrementoX = 27;
            const configuracion = {
              Encabezado: {
                Nombre_Aplicacion: "Sistema de Control Escolar",
                Nombre_Reporte: "Reporte de Concentrado de Calificaciones",
                Nombre_Usuario: `Usuario: ${session.user.name}`,
                Datos_Grupo:  `Alumno: ${alumnoData.nombre}   Bimestre: ${bimestre} `,
              },
              body: resultadoImpresion
            };

            const reporte = new ReportePDF(configuracion, "Portrait");
            const {body} = configuracion;
            const Enca1 = (doc) => {
                if (!doc.tiene_encabezado) {
                    doc.imprimeEncabezadoPrincipalVConcentradoCal();
                    doc.nextRow(12);
                    doc.ImpPosX("Materias", 14, doc.tw_ren, 10);
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
            
            Object.entries(body).forEach(([materia, mat], index) => {
                reporte.ImpPosX(materia.toString(),14, reporte.tw_ren,0);
                let posicionBodyMat = 14;
                let posicionBodyCal = 34;
                Enca1(reporte);
                if (reporte.tw_ren >= reporte.tw_endRen) {
                    reporte.pageBreak();
                    Enca1(reporte);
                }
                mat[0].forEach((mat) => {
                    reporte.ImpPosX(mat.descripcion.toString(),posicionBodyMat, reporte.tw_ren, 10);
                    posicionBodyMat+= incrementoX;
                });
                Enca1(reporte);
                if (reporte.tw_ren >= reporte.tw_endRen) {
                    reporte.pageBreak();
                    Enca1(reporte);
                }
                mat[1].forEach((mat1) => {
                    reporte.ImpPosX(mat1.toString(),posicionBodyCal, reporte.tw_ren,0, "R");
                    posicionBodyCal+= incrementoX; 
                });
                Enca1(reporte);
                if (reporte.tw_ren >= reporte.tw_endRen) {
                    reporte.pageBreak();
                    Enca1(reporte);
                }  
            });
            
            setTimeout(() => {
              const pdfData = reporte.doc.output("datauristring");
              setPdfData(pdfData);
              setPdfPreview(true);
              showModalVista(true);
              setisLoadingPDF(false);
            }, 500);
        }
    };
    const ImprimePDF = async () => {
        let fecha_hoy = new Date();
        const configuracion = {
            Encabezado: {
              Nombre_Aplicacion: "Sistema de Control Escolar",
              Nombre_Reporte: "Reporte de Concentrado de Calificaciones",
              Nombre_Usuario: `Usuario: ${session.user.name}`,
              Datos_Grupo:  `Alumno: ${alumnoData.nombre}   Bimestre: ${bimestre}`,
            },
            body: resultadoImpresion
          };
          ImprimirPDFDetalle(configuracion, dataEncabezadoDetalles, fecha_hoy, alumnoData.nombre)
    }

    const ImprimeExcel = async () => {
        let fecha_hoy = new Date();
        const dateStr = formatDate(fecha_hoy);
        const timeStr = formatTime(fecha_hoy);

        const configuracion = {
            Encabezado: {
                Nombre_Aplicacion: "Sistema de Control Escolar",
                Nombre_Reporte: "Reporte de Concentrado de Calificaciones",
                Nombre_Usuario: `Usuario: ${session.user.name}`,
                Clase: `Alumno: ${alumnoData.nombre}   Bimestre: ${bimestre}`
            },
            body: resultadoImpresion,
            nombre: `ConcentradoCalificaciones_${alumnoData.nombre}_${dateStr.replaceAll("/","")}${timeStr.replaceAll(":","")}`,
        };
        ImprimirExcelCC(configuracion);
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
                            
                            <div className=" tooltip flex space-x-2 items-center">
                            <Acciones
                                Buscar={BuscarCalificaciones}
                                Ver={handleVerClick}
                                isLoadingPDF={isLoadingPDF}
                                isLoadingFind={isLoadingFind}
                            />
                            <button
                              className="btn btn-sm btn-circle btn-ghost bg-base-200 dark:bg-[#1d232a] text-neutral-600 dark:text-white"
                              onClick={(event) => {
                                event.preventDefault();
                                document.getElementById("DetallesActividades").close();
                                setActividades({});
                                setMatAct({});
                                setresultadoImpresion({});
                              }}
                            >
                              ✕
                            </button>
                            </div>
                        </div>
                        <fieldset>
                            <div> 
                                {!isLoading ? (
                                Object.entries(resultadoImpresion).map(([materia, mat], index) => (
                                    <div key={`mat_${index}`} className="collapse collapse-plus bg-base-200">
                                        <input type="radio" name="materia"/>
                                        <div className="collapse-title text-xl font-medium  text-neutral-600 dark:text-white"> {materia} </div>
                                        <div className="collapse-content flex">
                                            <div className="md:w-2/6 sm:w-5/6">
                                                {mat[0].map((mat) => {  
                                                    return <h4 key={`desc_${index}_${Math.random(1)}_${mat.descripcion}`} className="font-semibold text-black dark:text-white">{mat.descripcion}</h4> 
                                                })}
                                            </div>
                                            <div className="md:w-1/6 sm:w-1/6">
                                                {mat[1].map((mat1) => {
                                                    return <h4 key={`cal_${index}_${Math.random(1)}_${mat1}`} className="text-black dark:text-white"> {mat1}</h4>
                                                })}
                                            </div>
                                        </div> 
                                    </div> 
                                ))
                            ):(
                                <Loading/>
                            )}
                            </div>
                        </fieldset>
                    </form>
                </div>
            </dialog>
        </>
    );
}
export default Modal_Detalles_Actividades;