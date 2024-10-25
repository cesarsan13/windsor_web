import React, { useEffect } from "react";
import { soloDecimales, soloEnteros } from "@/app/utils/globalfn";
import iconos from "@/app/utils/iconos";
import Image from "next/image";

function Busqueda({
  setBajas,
  limpiarBusqueda,
  Buscar,
  handleBusquedaChange,
  busqueda,
}) {
  const handleKeyDown = (evt) => {
    if (evt.key !== "Enter") return;
    Buscar();
  };
  
  return (
    <div className="grid grid-cols-5 md:grid-cols-12 gap-2">
      <div className="col-span-1 md:col-span-2 ">
        <input
          id="tb_grupo"
          className="input input-bordered input-sm md:input-md w-full sm:w-full dark:bg-[#191e24] dark:text-neutral-200 text-neutral-600 text-right"
          placeholder="Grupo..."
          onChange={(event) => handleBusquedaChange(event)}
          onKeyDown={(evt) => {
            soloEnteros(evt);
            handleKeyDown(evt);
          }}
          value={busqueda.tb_grupo}
        />
      </div>
      <div className="col-span-1 md:col-span-2">
        <input
          id="tb_materia"
          className="input input-bordered input-sm md:input-md join-item w-full max-w-lg dark:bg-[#191e24] dark:text-neutral-200 text-neutral-600 text-right"
          placeholder="Materia..."
          onChange={(event) => handleBusquedaChange(event)}
          onKeyDown={(evt) => handleKeyDown(evt)}
          value={busqueda.tb_materia}
        />
      </div>
      {/*  */}
      <div className="col-span-3 md:col-span-3 sm:col-span-1">
        <input
          id="tb_profesor"
          className="input input-bordered input-sm md:input-md join-item w-full max-w-lg dark:bg-[#191e24] dark:text-neutral-200 text-neutral-600"
          placeholder="Profesor..."
          onChange={(event) => handleBusquedaChange(event)}
          onKeyDown={(evt) => handleKeyDown(evt)}
          value={busqueda.tb_profesor}
        />
      </div>
      <div className="md:col-span-1">
        <div className=" tooltip" data-tip="Limpiar">
          <button
            className="join-item dark:text-neutral-200 text-neutral-600 border-none  w-5 h-5 md:w-6 md:h-6 mt-4"
            onClick={(evt) => limpiarBusqueda(evt)}
          >
                <Image src={iconos.limpiar} alt="Limpiar" />
                </button>
        </div>
      </div>
      <div className="md:col-span-1">
        <div className="form-control tooltip " data-tip="Ver Bajas">
          <label htmlFor="ch_bajas" className="label cursor-pointer">
            <input
              id="ch_bajas"
              type="checkbox"
              className=" checkbox mx-2 checkbox-md"
              onClick={(evt) => setBajas(evt.target.checked)}
            />
             <button
            className=" join-item  dark:text-neutral-200 text-neutral-600 border-none shadow-none w-5 h-5 md:w-6 md:h-6 mt-1"
            >

              <Image src={iconos.eliminar} alt="Bajas"></Image>
            </button>
            <span className=" text-lg font-xthin text-black hidden sm:inline">Bajas</span>
          </label>
        </div>
      </div>
    </div>

  );
}

export default Busqueda;