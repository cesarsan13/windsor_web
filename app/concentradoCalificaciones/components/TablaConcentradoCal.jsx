import React, { useEffect, useState } from "react";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/NoData";
import Image from "next/image";
import iconos from "@/app/utils/iconos";
import { RegresaCalificacionRedondeo, aDec } from "@/app/utils/globalfn";


function TablaConcentradoCal({
    materiasEncabezado,
    calificacionesTodosAlumnos,
    materiasReg,
    actividadesReg,
    alumnoReg,
    bimestre,
    showModal,
    setAccion,
    setAlumnoData,
    setDataEncabezado,
    setDataCaliAlumnosBody
}){
    let indexIngles = 0;
    let indexEspañol = 0;
    let contadorEspanol = 0;
    let contadorIngles = 0;
    let datosEspanol = 0;
    let datosIngles = 0;

    const datosEncabezado = [];
    const datosCaliAlumnosBody = [];

    

    useEffect(() => {
      const fetchData = async () => {
          setDataEncabezado = datosEncabezado;
          setDataCaliAlumnosBody = datosCaliAlumnosBody;
      };
      fetchData();
    }, [datosEncabezado, datosCaliAlumnosBody]);

    const tableAction = async (evt, alumno, accion) => {
        showModal(true);
        setAccion(accion);
        setAlumnoData(alumno);
    };

    const calcularCalificaciones = (alumnonumero, materianumero) => {
        let sumatoria = 0;
        let evaluaciones = 0;
        let a = 0;
        let aa = 0;

        if (materiasEncabezado.length > 0){
            const materia = materiasReg.find(m => m.numero === materianumero);
            if (materia.actividad === "No") {
                const filtro = calificacionesTodosAlumnos.filter(cal => 
                    cal.numero === alumnonumero && 
                    cal.materia === materianumero && 
                    cal.actividad === 0 && 
                    cal.bimestre === bimestre
                );
                sumatoria = aDec(Number(filtro[0]?.calificacion || 0));
                evaluaciones = materia ? filtro.length : 0;
            } else {
                const actividades = actividadesReg.filter(act => act.materia === materianumero);
                if (actividades.length === 0) {
                    evaluaciones = 0
                    sumatoria = 0
                } else {
                    actividades.forEach(actividad => {
                        const filtroActividad = calificacionesTodosAlumnos.filter(cal => 
                            cal.numero === alumnonumero && 
                            cal.materia === materianumero && 
                            cal.bimestre === bimestre && 
                            cal.actividad === actividad.secuencia && 
                            cal.unidad <= actividad[`EB${bimestre}`]
                        );
                        const califSum = filtroActividad.reduce((acc, cal) => acc + Number(cal.calificacion), 0);
                        sumatoria += RegresaCalificacionRedondeo(califSum / filtroActividad.length, "N");
                        evaluaciones++; 
                    });
                }
            }
            const calMat = (sumatoria / evaluaciones).toFixed(1);
            if (materia.area === 1) {
                a += calMat;
                datosEspanol += Number(calMat);
                contadorEspanol++; 
            } else if (materia.area === 4) {
                aa += calMat;
                datosIngles += Number(calMat);  
                contadorIngles++;
            }
            return evaluaciones === 0 ? 0 : calMat;
        }
    };
   
    return  (
        <div className="overflow-y-auto mt-3 h-[calc(55vh)] md:h-[calc(65vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white w-full lg:w-full">
            <table className="table table-xs table-zebra w-full">
                <thead className="sticky top-0 bg-white dark:bg-[#1d232a] z-[2]">
                    <tr>
                        <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
                        <td className="w-[80%]">Alumno</td>
                        {materiasEncabezado.length === undefined ? (
                            <td className="w-[45%]">Sin datos</td> 
                        ) :(
                            materiasEncabezado.map((item, index) => {
                                const esUltimoDeArea = 
                                (item.area === 1 || item.area === 4) &&
                                (index === materiasEncabezado.length - 1 || materiasEncabezado[index + 1].area !== item.area);
                                
                                if (esUltimoDeArea) {
                                    if (item.area === 1) {
                                        indexEspañol = index + 1; // +1 porque el índice del promedio se agrega después de la última columna del área
                                    } else if (item.area === 4) {
                                        indexIngles = index + 1;
                                    }
                                }
                                //Aqui va a guardar los datos que se generan para la impresion del documento pdf
                                
                                datosEncabezado.push({
                                    descripcion: item.descripcion,
                                    esUltimoDeArea: esUltimoDeArea,
                                    promedio: esUltimoDeArea ? `Promedio ${item.area === 1 ? "Español" : "Inglés"}` : null,
                                    index: index
                                });

                                if (esUltimoDeArea) {
                                    datosEncabezado.push({
                                        descripcion: `Promedio ${item.area === 1 ? "Español" : "Inglés"}`,
                                        esPromedio: true, // Esto indica que es un promedio
                                        area: item.area
                                    });
                                }

                                return (
                                    <React.Fragment key={index}>
                                        <th id={index} className="w-[20%]">
                                            {item.descripcion}
                                        </th>
                                        {esUltimoDeArea && (
                                            <th 
                                                className="w-[20%] text-left font-semibold"
                                            >
                                                {`Promedio ${item.area === 1 ? "Español" : "Inglés"}`}
                                            </th>
                                        )}
                                    </React.Fragment>
                                );
                                
                            })
                        )}

                        <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Ver</th>
                    </tr>
                </thead>
                <tbody>  
                    {alumnoReg.length === undefined ? (
                        <tr>
                            <td className="w-[45%]"> sin datos </td> 
                        </tr>
                    ) : (
                        alumnoReg.map(alumno => (
                            <tr key={alumno.numero}>
                                <td className="text-right">{alumno.numero}</td>
                                <td className="text-left">{alumno.nombre}</td>
                                
                                {materiasReg.map((materia, idx) => {
                                    //Aqui va a guardar los datos que se generan para la impresion del documento pdf
                                    if (idx === indexEspañol ){
                                        datosCaliAlumnosBody.push((datosEspanol/contadorEspanol).toFixed(1))
                                    }
                                    if (idx === indexIngles){
                                        datosCaliAlumnosBody.push((datosIngles/contadorIngles).toFixed(1))
                                    }
                                    datosCaliAlumnosBody.push(calcularCalificaciones(alumno.numero, materia.numero))


                                return(
                                <React.Fragment key={materia.numero}>
                                    {idx === indexEspañol && (
                                        <td className="text-right font-semibold">{(datosEspanol/contadorEspanol).toFixed(1)}</td>
                                    )}
                                    {idx === indexIngles && (
                                        <td className="text-right font-semibold">{(datosIngles/contadorIngles).toFixed(1)}</td>
                                    )}
                                    <td className="text-right">{calcularCalificaciones(alumno.numero, materia.numero)}</td>
                                </React.Fragment>
                                );
                                })} 

                                 <th className="w-[5%] pt-[.10rem] pb-[.10rem]">
                                  <div
                                    className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
                                    data-tip={`Editar`}
                                    onClick={(evt) => tableAction(evt, alumno, `Editar`)}
                                  >
                                    <Image src={iconos.editar} alt="Editar" />
                                  </div>
                                </th>
                                
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default TablaConcentradoCal;