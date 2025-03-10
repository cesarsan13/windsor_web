import React from 'react'
import { useState, useEffect } from "react";
import {
    getConsultasInscripcion,
    getConsultasInsXMes
  } from "@/app/utils/api/estadisticas/estadisticas";

function CardsHome({ titulo, value, descripcion, valueImp, mes/*,setItem*/ }) {
    const [mesSeleccionado, setMesSeleccionado] = useState("");
    // Manejar el cambio del select
    // const handleChange = (event) => {
    //     setItem(event.target.value);
    //     setMesSeleccionado(event.target.value); // Actualiza el estado con el valor seleccionado
    // };

    return (
        <div className="w-full card  bg-transparent  items-center p-5 mb-4">
            <div className="w-full sticky top-0 flex justify-center ">
                <div className="grid grid-flow-row text-neutral-600 dark:text-white">
                    {/* <div className="stats shadow bg-base-200 dark:bg-[#1d232a]"> */}
                    <h1 className="font-bold text-black my-4">Alumnos inscritos del mes de {mes}</h1>
                        {/* <label
                            className={`input input-bordered  input-sm md:input-md flex items-center gap-3  text-black dark:text-white`}
                        >
                            <div className="stats">
                                <select name="meses" id="meses" className="fyo8m-select p-1.5 grow bg-[#ffffff] "
                                value={mesSeleccionado} // Enlaza el valor al estado
                                onChange={handleChange} // Llama a la función cuando cambie
                                >
                                    <option value="">Seleccione un mes</option>
                                    <option value="1">Enero</option>
                                    <option value="2">Febrero</option>
                                    <option value="3">Marzo</option>
                                    <option value="4">Abril</option>
                                    <option value="5">Mayo</option>
                                    <option value="6">Junio</option>
                                    <option value="7">Julio</option>
                                    <option value="8">Agosto</option>
                                    <option value="9">Septiembre</option>
                                    <option value="10">Octubre</option>
                                    <option value="11">Noviembre</option>
                                    <option value="12">Diciembre</option>
                                </select>
                            </div>
                        </label> */}
                        <div className="stats shadow bg-base-200 dark:bg-[#1d232a] ">
                            <div className="stat">
                                <div className="stat-title text-sm truncate text-neutral-600 dark:text-white">{titulo}</div>
                                <div className="stat-value text-xl md:text-4xl text-neutral-600 dark:text-white">{value || "0"}</div>
                                <div className="stat-desc text-xs md:text-sm truncate text-neutral-600 dark:text-white">
                                    {descripcion}
                                </div>
                                <div className="stat-value text-xl md:text-4xl text-neutral-600 dark:text-white">${valueImp || "0"}</div>
                            </div>
                        </div>
                    {/* </div> */}
                </div>
            </div>
        </div>
        
    )
}

export default CardsHome;