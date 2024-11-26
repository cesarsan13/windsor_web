import React from "react";
import Image from "next/image";
import iconos from "@/app/utils/iconos";
import { RegresaCalificacionRedondeo, aDec } from "@/app/utils/globalfn";
import NoData from "@/app/components/NoData";
import Loading from "@/app/components/loading";

function TablaConcentradoCal({
    isLoading, 
    materiasEncabezado,
    calificacionesTodosAlumnos,
    materiasReg,
    actividadesReg,
    alumnoReg,
    bimestre,
    showModal,
    setAccion,
    setAlumnoData,
    dataEncabezado,
    dataCaliAlumnosBody,
    dataCaliAlumnosBodyEXCEL
}){
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
                const calificacion = aDec(Number(filtro[0]?.calificacion || 0));
                
                sumatoria = (calificacion).toFixed(1);
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
                        const calPromedio = RegresaCalificacionRedondeo(califSum / filtroActividad.length, "N");
                        sumatoria += calPromedio;

                        evaluaciones++; 
                    }); 
                }
            }
            const sum = isNaN(sumatoria) ? 0 : sumatoria;
            const calMat = (sum / evaluaciones).toFixed(1);
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

    return  !isLoading ? (
        <div className="overflow-y-auto mt-3 h-[calc(55vh)] md:h-[calc(65vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white w-full lg:w-full">
            {alumnoReg.length !== undefined && materiasEncabezado.length !== undefined ? (
                <table className="table table-xs table-zebra w-full">
                    <thead className="sticky top-0 bg-white dark:bg-[#1d232a] z-[2]">
                        <tr>
                            <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
                            <td className="w-[80%]">Alumno</td>
                            {materiasEncabezado.map((item, index) => {
                                const esUltimoDeArea = 
                                (item.area === 1 || item.area === 4) &&
                                (index === materiasEncabezado.length - 1 || materiasEncabezado[index + 1].area !== item.area);
                                if (esUltimoDeArea) {
                                    if (item.area === 1) {
                                        indexEspañol = index + 1;
                                    } else if (item.area === 4) {
                                        indexIngles = index + 1;
                                    }
                                }
                                //Aqui va a guardar los datos que se generan para la impresion del documento pdf
                                dataEncabezado.push({
                                    descripcion: item.descripcion,
                                    esUltimoDeArea: esUltimoDeArea,
                                    promedio: esUltimoDeArea ? `Promedio ${item.area === 1 ? "Español" : "Inglés"}` : null,
                                    idMat: item.numero
                                });
                                if (esUltimoDeArea) {
                                    dataEncabezado.push({
                                        descripcion: `Promedio ${item.area === 1 ? "Español" : "Inglés"}`,
                                        esPromedio: true,
                                        area: item.area,
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
                            })}
                            <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Ver</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alumnoReg.map(alumno => {
                            let num = (alumno.numero).toString();
                            let nom = (alumno.nombre).toString();
                            let alumnoData = [num];
                            let alumnoDataExcel = [num, nom];
                        
                            const alumnoRow = (
                                <tr key={alumno.numero}>
                                    <td className="text-right">{alumno.numero}</td>
                                    <td className="text-left">{alumno.nombre}</td>
                                    {materiasReg.map((materia, idx) => {
                                        if (idx === indexEspañol) {
                                            alumnoData.push((datosEspanol / contadorEspanol).toFixed(1));
                                            alumnoDataExcel.push((datosEspanol / contadorEspanol).toFixed(1));
                                        }
                                        if (idx === indexIngles) {
                                            alumnoData.push((datosIngles / contadorIngles).toFixed(1));
                                            alumnoDataExcel.push((datosIngles / contadorIngles).toFixed(1));
                                        
                                        }
                                        alumnoData.push(calcularCalificaciones(alumno.numero, materia.numero));
                                        alumnoDataExcel.push(calcularCalificaciones(alumno.numero, materia.numero));
                                    
                                        return (
                                            <React.Fragment key={materia.numero}>
                                                {idx === indexEspañol && (
                                                    <td className="text-right font-semibold">
                                                        {(datosEspanol / contadorEspanol).toFixed(1)}
                                                    </td>
                                                )}
                                                {idx === indexIngles && (
                                                    <td className="text-right font-semibold">
                                                        {(datosIngles / contadorIngles).toFixed(1)}
                                                    </td>
                                                )}
                                                <td className="text-right">{calcularCalificaciones(alumno.numero, materia.numero)}</td>
                                            </React.Fragment>
                                        );
                                    })}
                                    <th className="w-[5%] pt-[.10rem] pb-[.10rem]">
                                        <div
                                            className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
                                            data-tip={`Ver`}
                                            onClick={(evt) => tableAction(evt, alumno, `Ver`)}
                                        >
                                            <Image src={iconos.ver} alt="Ver" className="block dark:hidden" />
                                            <Image src={iconos.ver_w} alt="Ver" className="hidden dark:block" />
                                        </div>
                                    </th>
                                </tr>
                            );
                            dataCaliAlumnosBody.push(alumnoData);
                            dataCaliAlumnosBodyEXCEL.push(alumnoDataExcel);
                            return alumnoRow;
                        })}
                    </tbody>
                </table>
            ):(
                <NoData/>
            )}
        </div>
    ) : (
        <Loading></Loading>
    )
}

export default TablaConcentradoCal;