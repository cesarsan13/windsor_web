
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";


function DetallesMaterias({
    Actividades,
    matAct,
    bimestre,

}){

    console.log("Act", Actividades, "matA", matAct);
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

    function aDec(value) {
        return isNaN(value) ? 0 : Number(value);
    }
    
    {/*const calcularCalificacionesMat = (secuencia) => {
        let sumatoria = 0;
        let evaluaciones = 0;
        //let a = 0;
        //let aa = 0;

        const actividades = matAct.filter(act => act.secuencia === secuencia);
        if (actividades.length === 0) {
            evaluaciones = 0
            sumatoria = 0
        } else {
            actividades.forEach(actividad => {
                const filtroActividad = Actividades.filter(cal => 
                    cal.actividad === actividad.secuencia && 
                    cal.unidad <= actividad[`EB${bimestre}`]
                );
                const califSum = filtroActividad.reduce((acc, cal) => acc + Number(cal.calificacion), 0);
                sumatoria += RegresaCalificacionRedondeo(califSum / filtroActividad.length, "N");
                evaluaciones++; 
            });
            const calMat = (sumatoria / evaluaciones).toFixed(1);
            return evaluaciones === 0 ? 0 : calMat;
        }
    }*/}

    const calcularCalificacionesMat = (secuencia) => {
        let sumatoria = 0;
        let evaluaciones = 0;
        const actividades = matAct.filter(act => act.secuencia === secuencia);
        if (actividades.length === 0) {
            return 0;
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
                        matAct.map((item, index) => (
                            <th key={index} className="w-[20%]">
                                {item.descripcion}
                            </th>
                        ))
                    )}
                     <th className="w-[45%]">Promedio</th> 
                </tr>
            </thead>
            {/*<tbody>
            { matAct.length === undefined? (
                <tr>
                    <td className="w-[45%]"> sin datos </td> 
                </tr>
            ) : ( 
                matAct.map((activ) => (
                    <td className="text-right">{calcularCalificacionesMat(activ.secuencia)}</td> 
                ))           
               
            )}
            </tbody>*/}
            <tbody>
                {matAct.length === undefined ? (
                    <tr>
                        <td className="w-[45%]">Sin datos</td> 
                    </tr>
                ) : ( 
                    <tr>
                        {matAct.map((activ) => (
                            <td key={activ.secuencia} className="text-right">{calcularCalificacionesMat(activ.secuencia)}</td> 
                        ))}
                        <td className="text-right">
                            {(
                                matAct.reduce((acc, activ) => acc + parseFloat(calcularCalificacionesMat(activ.secuencia) || 0), 0) 
                                / matAct.length
                            ).toFixed(1)}
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
 );
}
export default DetallesMaterias;