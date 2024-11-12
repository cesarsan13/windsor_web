import React from "react";
import {RegresaCalificacionRedondeo, aDec} from "@/app/utils/globalfn";


function DetallesMaterias({
    Actividades,
    matAct,
    bimestre,
    dataEncabezadoDetalles,
    dataCaliAlumnosBodyDetalles

}){

    const calcularCalificacionesMat = (secuencia) => {
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



    return(
        <div className="overflow-y-auto mt-3 h-[calc(55vh)] md:h-[calc(65vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white w-full lg:w-full">
            <table className="table table-xs table-zebra w-full">
                <thead className="sticky top-0 bg-white dark:bg-[#1d232a] z-[2]">
                    <tr>
                        {matAct.length === undefined ? (
                            <th className="w-[45%]">Sin datos</th> 
                        ) : (
                            matAct.map((item, index) => {
                                dataEncabezadoDetalles.push({
                                    descripcion: item.descripcion,
                                    index: index
                            });

                            return(
                                <th key={index} className="w-[20%]">
                                    {item.descripcion}
                                </th>
                            )
                            })
                        )}
                        <th className="w-[45%]">Promedio</th> 

                    </tr>
                </thead>
                <tbody>
                    {matAct.length === undefined ? (
                        <tr>
                            <td className="w-[45%]">Sin datos</td> 
                        </tr>
                    ) : ( 
                        <tr>
                            {matAct.map((activ) => {
                                dataCaliAlumnosBodyDetalles.push(calcularCalificacionesMat(activ.secuencia))
                                return(
                                    <td key={activ.secuencia} className="text-right">{calcularCalificacionesMat(activ.secuencia)}</td> 
                                )
                            })}
                            <td className="text-right">
                                {
                                    (() => {
                                        const promedio = (matAct.reduce((acc, activ) => acc + Number(calcularCalificacionesMat(activ.secuencia) || 0), 0) / matAct.length).toFixed(1);
                                        dataCaliAlumnosBodyDetalles.push(promedio); 
                                        return promedio;
                                    })()
                                }
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
export default DetallesMaterias;