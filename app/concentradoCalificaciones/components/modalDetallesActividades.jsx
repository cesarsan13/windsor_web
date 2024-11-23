

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Inputs from "@/app/concentradoCalificaciones/components/InputMateria";
import Acciones from "@/app/concentradoCalificaciones/components/AccionesDetalle";
import { useForm } from "react-hook-form";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import {formatDate, formatTime} from "@/app/utils/globalfn"
import {
    getActividadesXHorarioXAlumnoXMateriaXBimestre,
    getActividadesDetalles,
    ImprimirPDFDetalle,
    ImprimirExcel
} from "@/app/utils/api/concentradoCalificaciones/concentradoCalificaciones";
import VistaPrevia from "@/app/components/VistaPrevia";
import { showSwal } from "@/app/utils/alerts";
import {RegresaCalificacionRedondeo, aDec} from "@/app/utils/globalfn";

function Modal_Detalles_Actividades({
    alumnoData,
    materiasReg,
    grupo,
    bimestre,
    accion
}){
    const [isLoading, setisLoading] = useState(false);
    const { data: session, status } = useSession();
    const [Actividades, setActividades] = useState({});
    const [matAct, setMatAct] = useState([]);
    const [pdfData, setPdfData] = useState("");
    const [materia, setMateria] = useState("");
    const [pdfPreview, setPdfPreview] = useState(false);
    const [isLoadingFind, setisLoadingFind] = useState(false);
    const [isLoadingPDF, setisLoadingPDF] = useState(false);
    const [selected, setSelected] = useState(1);
    const [dataEncabezadoDetalles, setdataEncabezadoDetalles] = useState([]);
    const [dataCaliAlumnosBodyDetalles, setdataCaliAlumnosBodyDetalles] = useState([]);
    const [resultadoImpresion, setresultadoImpresion] = useState({});
    let M = 0;

    const Buscar2 = async (materiaid) => {
        setMateria(materiaid);
        console.log(materia, materiaid);
        setisLoading(true);
        setisLoadingFind(true);
        M = Number(materiaid);
        try{
            const { token } = session.user;
            const res = await getActividadesXHorarioXAlumnoXMateriaXBimestre(token, grupo, alumnoData.numero, M, bimestre);
            const acres = await getActividadesDetalles(token, M);
            setActividades(res);
            setMatAct(acres);
        } catch (error) { }
        setisLoading(false);
        setisLoadingFind(false);
    };

    const BuscarCalificaciones = async () => {
        setisLoadingFind(true);
        setisLoading(true);
        console.log(grupo, alumnoData.numero, bimestre);
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
                    console.log("info",dataCaliAlumnosBodyDetalles);
    
                    const promedio = dataCaliAlumnosBodyDetalles.reduce((acc, num) => Number(acc) + Number(num), 0) / dataCaliAlumnosBodyDetalles.length;
                    dataCaliAlumnosBodyDetalles.push((promedio).toFixed(1));
    
                    resultData[mat.descripcion] = [dataEncabezadoDetalles, dataCaliAlumnosBodyDetalles];
                })
            );
        }
        setresultadoImpresion(resultData);
        console.log("estomanda", resultadoImpresion, resultData);
        setisLoading(false);
        setisLoadingFind(false);
        //return resultData;
    }; 

    const calcularCalificacionesMat = async (secuencia, Actividades, matAct) => {
            let sumatoria = 0;
            let evaluaciones = 0;
    
            const actividades = matAct.filter(act => act.secuencia === secuencia);
            console.log("act", actividades);
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
                
            }else{
                let cal = RegresaCalificacionRedondeo(Number(Actividades[0].calificacion), "N");
                 return(cal.toFixed(1));
            }   
        }
    };
    

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
        //const MateriaNombre = materiasReg.filter((c) => c.numero === Number(materia));
        //Materia:${MateriaNombre[0].descripcion}
        console.log(dataEncabezadoDetalles, dataCaliAlumnosBodyDetalles);
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
                Datos_Grupo:  `Alumno: ${alumnoData.nombre}   Bimestre: ${bimestre} `,
              },
              body: dataCaliAlumnosBodyDetalles
            };

            const reporte = new ReportePDF(configuracion, "Portrait");
            const {body} = configuracion;
            const Enca1 = (doc) => {
                if (!doc.tiene_encabezado) {
                  doc.imprimeEncabezadoPrincipalVConcentradoCal();
                  doc.nextRow(12);
                  
                  dataEncabezadoDetalles.forEach((desc) => {
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
        console.log(dataEncabezadoDetalles, dataCaliAlumnosBodyDetalles);
        //const resultadoEnc = dataEncabezadoDetalles.filter((item, pos, arr) => 
        //    arr.findIndex(i => i.descripcion === item.descripcion) === pos
        //);
        //const resultadoBody = eliminarArreglosDuplicados(dataCaliAlumnosBodyDetalles);

        const MateriaNombre = materiasReg.filter((c) => c.numero === Number(materia));

        const configuracion = {
            Encabezado: {
              Nombre_Aplicacion: "Sistema de Control Escolar",
              Nombre_Reporte: "Reporte de Concentrado de Calificaciones",
              Nombre_Usuario: `Usuario: ${session.user.name}`,
              Datos_Grupo:  `Alumno: ${alumnoData.nombre}   Bimestre: ${bimestre}   Materia:${MateriaNombre[0].descripcion}`,
            },
            body: dataCaliAlumnosBodyDetalles
          };
          ImprimirPDFDetalle(configuracion, dataEncabezadoDetalles, fecha_hoy, alumnoData.nombre)
    }

    const ImprimeExcel = async () => {
        const MateriaNombre = materiasReg.filter((c) => c.numero === Number(materia));
        
        let fecha_hoy = new Date();
        const dateStr = formatDate(fecha_hoy);
        const timeStr = formatTime(fecha_hoy);

        //const resultadoEnc = dataEncabezadoDetalles.filter((item, pos, arr) => 
        //  arr.findIndex(i => i.descripcion === item.descripcion) === pos
        //);
        const columns = dataEncabezadoDetalles.map((item, index) => ({
            header: item.descripcion,
            dataKey: index.toString(),
        }));
        columns.push({
            header: "Promedio",
            dataKey: dataEncabezadoDetalles.length.toString(),
        });

        const ArregloProvisional = [];
        //const resultadoBody = eliminarArreglosDuplicados(dataCaliAlumnosBodyDetalles);
        ArregloProvisional.push(dataCaliAlumnosBodyDetalles);

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


    const calcularCalificacionesMat1 = (secuencia) => {
        let sumatoria = 0;
        let evaluaciones = 0;
        const actividades = matAct.filter(act => act.secuencia === secuencia);
        if (actividades.length === 0) {
            return 0;
        } else {
            if (Actividades.length === 1) {
                
                actividades.forEach(actividad => {
                    const filtroActividad = Actividades.filter(cal => 
                        cal.actividad === 0 && 
                        cal.unidad <= actividad[`EB${bimestre}`]
                    );
                    sumatoria = aDec(Number(filtroActividad[0]?.calificacion || 0));                    
                    evaluaciones = 1;
                
                });
                //const calMat = (sumatoria / evaluaciones).toFixed(1);
                //return evaluaciones === 0 ? 0 : calMat;

            } else {
            actividades.forEach(actividad => {
                const filtroActividad = Actividades.filter(cal => 
                    cal.actividad === secuencia && 
                    cal.unidad <= actividad[`EB${bimestre}`]
                );
                const califSum = filtroActividad.reduce((acc, cal) => acc + Number(cal.calificacion), 0);
                sumatoria += filtroActividad.length > 0 ? RegresaCalificacionRedondeo(califSum / filtroActividad.length, "N") : 0;
                evaluaciones++; 
            });
            }
            const calMat = (sumatoria / evaluaciones).toFixed(1);
            return evaluaciones === 0 ? 0 : calMat;
        }
    }
    console.log(resultadoImpresion);

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
                                <div> 
                                { accion === `Ver` && (Array.isArray(resultadoImpresion)) && resultadoImpresion.length !== 0 ?(
                                    resultadoImpresion.map((grupo, index) => {
                                        //const [materias, promedios] = grupo;
                                        return(
                                            <div key={`mat_${index}`} className="collapse collapse-plus bg-base-200">
                                                <input type="radio" name="materia"/>
                                                <div className="collapse-title text-xl font-medium  text-neutral-600 dark:text-white"> {index} </div>
                                                <div className="collapse-content flex">
                                                <div className="md:w-2/6 sm:w-5/6">
                                                    {grupo[0].map((mat) => {
                                                        
                                                            <h4 key={`desc_${mat}`} className="font-semibold text-black dark:text-white">{mat}</h4> 
                                                    })}
                                                <h4 className="font-bold text-black dark:text-white">PROMEDIO</h4>
                                                </div>
                                                <div className="md:w-1/6 sm:w-1/6">
                                                {grupo[1].map((mat) => { 
                                                    <h4 key={`cal_`} className="text-black dark:text-white"> {mat}</h4>
                                                })}
                                                </div>
                                            </div> 
                                          </div>
                                        )
                                    })
                                ): (
                                    <div/>
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