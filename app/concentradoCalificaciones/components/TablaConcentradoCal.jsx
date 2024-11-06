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
    bimestre,
    showModal,
    setAccion,
    setAlumnoData
}){
    const [editMode, setEditMode] = useState(null);
    let indexIngles = 0;
    let indexEspañol = 0;
    let contadorEspanol = 0;
    let contadorIngles = 0;
    let datosEspanol = 0;
    let datosIngles = 0;

    const tableAction = async (evt, alumno, accion) => {
        showModal(true);
        setAccion(accion);
        setAlumnoData(alumno);
    };

    function aDec(value) {
        return isNaN(value) ? 0 : Number(value);
    }

    console.log(materiasReg);
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
                                
                                {/*{materiasReg.map(materia => (
                                    
                                    <td key={materia.numero}>
                                        {
                                        calcularCalificaciones(alumno.numero, materia.numero)
                                        }
                                    </td>
                                ))}*/}

                                {materiasReg.map((materia, idx) => (
                                <React.Fragment key={materia.numero}>
                                    {idx === indexEspañol && (
                                        <td className="text-right font-semibold">{(datosEspanol/contadorEspanol).toFixed(1)}</td>
                                    )}
                                    {idx === indexIngles && (
                                        <td className="text-right font-semibold">{(datosIngles/contadorIngles).toFixed(1)}</td>
                                    )}
                                    <td className="text-right">{calcularCalificaciones(alumno.numero, materia.numero)}</td>
                                </React.Fragment>
                                ))} 

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