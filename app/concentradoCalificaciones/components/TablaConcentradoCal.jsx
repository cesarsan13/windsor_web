import React, { useState } from "react";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/NoData";
import Image from "next/image";
import iconos from "@/app/utils/iconos";
import { formatNumber, globalVariables, loadGlobalVariables, soloDecimales } from "@/app/utils/globalfn";
import { showSwal } from "@/app/utils/alerts";

function TablaConcentradoCal({
    materiasEncabezado,
    calificacionesTodosAlumnos,
    materiasReg,
    actividadesReg,
    alumnoReg,
    bimestre
}){

    function RegresaCalificacionRedondeo(twxCalifica, txwRedondea0) {
        // Inicializar la variable de retorno
        let resultado = 0;
    
        // Redondear a 2 decimales
        twxCalifica = Math.round(twxCalifica * 100) / 100;
    
        if (txwRedondea0 === "S") {
            // Condicionales de redondeo exacto
            if (twxCalifica > 9.49) {
                twxCalifica = 10;
            } else if (twxCalifica > 8.99 && twxCalifica < 9.5) {
                twxCalifica = 9;
            } else if (twxCalifica > 8.49 && twxCalifica < 9) {
                twxCalifica = 9;
            } else if (twxCalifica > 7.99 && twxCalifica < 8.5) {
                twxCalifica = 8;
            } else if (twxCalifica > 7.49 && twxCalifica < 8) {
                twxCalifica = 8;
            } else if (twxCalifica > 6.99 && twxCalifica < 7.5) {
                twxCalifica = 7;
            } else if (twxCalifica > 6.49 && twxCalifica < 7) {
                twxCalifica = 7;
            } else if (twxCalifica > 5.99 && twxCalifica < 6.5) {
                twxCalifica = 6;
            } else if (twxCalifica < 6) {
                twxCalifica = 5;
            }
            resultado = twxCalifica;
        } else {
            // Nuevo redondeo (versión 2013)
            const txwMult = twxCalifica * 10;
            const txwStrin = txwMult.toString();
            const posPunto = txwStrin.indexOf(".");
            let txwEnt;
    
            if (posPunto > -1) {
                txwEnt = parseInt(txwStrin.substring(0, posPunto), 10);
            } else {
                txwEnt = parseInt(txwStrin, 10);
            }
    
            resultado = txwEnt / 10;
        }
    
        return resultado;
    }

    const calcularCalificaciones = (alumnonumero, materianumero) => {
        console.log("alumno", alumnonumero);
        let sumatoria = 0;
        let evaluaciones = 0;

        // Verificar si se evalúa por actividades
        const materia = materiasReg.find(m => m.numero === materianumero);
        if (!materia || materia.actividad === "No") {
            console.log("entra al no");
            // Calificación sin actividades
            const filtro = calificacionesTodosAlumnos.filter(cal => 
                cal.numero === alumnonumero && cal.materia === materianumero && cal.bimestre === bimestre
            );
            console.log("filtro no", filtro);
            sumatoria = filtro.reduce((acc, cal) => acc + cal.calificacion, 0);
            evaluaciones = filtro.length;
        } else {
            // Calificación con actividades
            console.log("entra al si");
            const actividades = actividadesReg.filter(act => act.materia === materianumero);
            console.log("actividades si", actividades);
            if (actividades.length > 0) {
                actividades.forEach(actividad => {
                    console.log("actividades", actividad);
                    const filtroActividad = calificacionesTodosAlumnos.filter(cal => 
                        cal.numero === alumnonumero && 
                        cal.materia === materianumero && 
                        cal.bimestre === bimestre && 
                        cal.actividad === actividad.secuencia && 
                        cal.unidad <= actividad[`EB${bimestre}`]
                    );
                    console.log("filtro act", filtroActividad);

                    if (filtroActividad.length > 0) {
                        console.log("filtro actividad mayor a 0", filtroActividad);
                        const califSum = filtroActividad.reduce((acc, cal) => acc + cal.calificacion, 0);
                        sumatoria += RegresaCalificacionRedondeo(califSum / filtroActividad.length, "N");
                        evaluaciones++;
                        console.log("sumatoria dentro de if", sumatoria);
                    }
                });
            }
        }
        
        // Si no hay evaluaciones válidas, devuelve vacío en lugar de cero
        //return evaluaciones === 0 ? "" : (sumatoria / evaluaciones).toFixed(1);
        return (sumatoria / evaluaciones).toFixed(1);
    };
   
    return  (
        <div className="overflow-y-auto mt-3 h-[calc(55vh)] md:h-[calc(65vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white w-full lg:w-full">
            <table className="table table-xs table-zebra w-full">
                <thead className="sticky top-0 bg-white dark:bg-[#1d232a] z-[2]">
                    <tr>
                        <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
                        <td className="w-[80%]">Alumno</td>

                        {materiasEncabezado.length > 0 ? (
                            materiasEncabezado.map((item, index) => {
                                const esUltimoDeArea = 
                                    (item.area === 1 || item.area === 4) &&
                                    (index === materiasEncabezado.length - 1 || materiasEncabezado[index + 1].area !== item.area);
                            
                                return (
                                    <React.Fragment key={index}>
                                        <th id={item.numero} className="w-[20%]">
                                            {item.descripcion}
                                        </th>
                                        {esUltimoDeArea && (
                                            <th className="w-[20%] text-left font-semibold">
                                                {`Promedio ${item.area === 1 ? "Español" : "Inglés"}`}
                                            </th>
                                        )}
                                    </React.Fragment>
                                );
                            })
                        ) : (
                            <td className="w-[45%]">Sin datos</td>
                        )}

                        <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Editar</th>
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
                                <td>{alumno.numero}</td>
                                <td>{alumno.nombre}</td>
                                {materiasReg.map(materia => (
                                    <td key={materia.numero}>
                                        {
                                        calcularCalificaciones(alumno.numero, materia.numero)
                                        
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default TablaConcentradoCal;