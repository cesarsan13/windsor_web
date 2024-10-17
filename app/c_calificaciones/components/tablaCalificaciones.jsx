import React, { useState } from "react";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/noData";
import Image from "next/image";
import iconos from "@/app/utils/iconos";
import { formatNumber, globalVariables, loadGlobalVariables, soloDecimales } from "@/app/utils/globalfn";
import { showSwal } from "@/app/utils/alerts";

function TablaCalificaciones({
    calificacionesFiltrados,
    isLoading,
    setCalificacion,
    setAccion,
    setCurrentId,
    calificaciones,
    setCalificaciones,
    setCalificacionesFiltrados,
}) {
    console.log('arreglo de filtrados', calificacionesFiltrados);
    const [editMode, setEditMode] = useState(null);
    const [editedCalificaciones, setEditedCalificaciones] = useState({});

    const handleEditChange = (numero, value) => {
        let newValue = parseFloat(value);
        loadGlobalVariables();
        if (globalVariables.vg_caso_evaluar === 'CALIFICACIÓN') {
            if (newValue > 10) {
                showSwal("WARNING!", "El máximo valor permitido es 10", "info");
                newValue = 0;
            }
        } else {
            if (newValue > 40) {
                showSwal("WARNING!", "El máximo valor permitido es 40", "info");
                newValue = 0;
            }
        }
        setEditedCalificaciones((prev) => ({
            ...prev,
            [numero]: newValue,
        }));
    };

    const tableAction = (evt, calificacion, accion) => {
        setCalificacion(calificacion);
        setAccion(accion);
        setCurrentId(calificacion.numero);
        if (accion === "Editar") {
            setEditMode(calificacion.numero);
        } else {
            setEditMode(null);
        }
    };

    const saveCalificacion = (numero) => {
        loadGlobalVariables();
        const index = calificaciones.findIndex((fp) => fp.numero === numero);
        if (index !== -1) {
            const fpFiltrados = calificaciones.map((fp) =>
                fp.numero === numero ? { ...fp, calificacion: formatNumber(editedCalificaciones[numero]) } : fp
            );
            setCalificaciones(fpFiltrados);
            setCalificacionesFiltrados(fpFiltrados);
        }
        setEditMode(null);
    };

    return !isLoading ? (
        <div className="overflow-y-auto mt-3 h-[calc(55vh)] md:h-[calc(65vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white w-full lg:w-full">
            {calificacionesFiltrados.length > 0 ? (
                <table className="table table-xs table-zebra w-full">
                    <thead className="sticky top-0 bg-white dark:bg-[#1d232a] z-[2]">
                        <tr>
                            <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
                            <td className="w-[45%]">Alumno</td>
                            <td className="w-[25%] hidden sm:table-cell">Calificación</td>
                            <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Editar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {calificacionesFiltrados.map((item, index) => (
                            <tr key={`${item.numero}-${index}`} className="hover:cursor-pointer">
                                <th className="w-[5%]">{item.numero}</th>
                                <td className="w-[45%]"> {item.nombre} </td>
                                <td className="w-[25%]">
                                    {editMode === item.numero ? (
                                        <input
                                            type="number"
                                            value={editedCalificaciones[item.numero] || item.calificacion || ""}
                                            onChange={(e) => handleEditChange(item.numero, e.target.value)}
                                            className="input input-bordered w-full"
                                        />
                                    ) : (
                                        item.calificacion || "N/A"
                                    )}
                                </td>
                                <th className="w-[5%] pt-[.10rem] pb-[.10rem]">
                                    {editMode === item.numero ? (
                                        <>
                                            <button
                                                className="btn btn-xs"
                                                onClick={() => saveCalificacion(item.numero)}
                                            >
                                                Guardar
                                            </button>
                                            <button
                                                className="btn btn-xs"
                                                onClick={() => setEditMode(null)}
                                            >
                                                Cancelar
                                            </button>
                                        </>
                                    ) : (
                                        <div
                                            className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
                                            data-tip={`Editar`}
                                            onClick={(evt) => tableAction(evt, item, "Editar")}
                                        >
                                            <Image src={iconos.editar} alt="Editar" />
                                        </div>
                                    )}
                                </th>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <NoData />
            )}
        </div>
    ) : (
        <Loading />
    );
}

export default TablaCalificaciones;
