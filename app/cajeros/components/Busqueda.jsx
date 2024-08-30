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
      <div className="col-span-1 md:col-span-1/2 ">
        <input
          id="tb_id"
          className="input input-bordered input-sm md:input-md w-full sm:w-full dark:bg-[#191e24] dark:text-neutral-200 text-neutral-600 text-right"
          placeholder="Num..."
          onChange={(event) => handleBusquedaChange(event)}
          onKeyDown={(evt) => {
            soloEnteros(evt);
            handleKeyDown(evt);
          }}
          value={busqueda.tb_id}
        />
      </div>
      <div className="col-span-4 md:col-span-3">
        <input
          id="tb_desc"
          className="input input-bordered input-sm md:input-md join-item w-full max-w-lg dark:bg-[#191e24] dark:text-neutral-200 text-neutral-600"
          placeholder="Nombre..."
          onChange={(event) => handleBusquedaChange(event)}
          onKeyDown={(evt) => handleKeyDown(evt)}
          value={busqueda.tb_desc}
        />
      </div>
      {/*  */}
      <div className="col-span-2 md:col-span-2 sm:col-span-1">
        <input
          id="tb_tel"
          className="input input-bordered input-sm md:input-md join-item w-full max-w-lg dark:bg-[#191e24] dark:text-neutral-200 text-neutral-600"
          placeholder="Telefono..."
          onChange={(event) => handleBusquedaChange(event)}
          onKeyDown={(evt) => handleKeyDown(evt)}
          value={busqueda.tb_tel}
        />
      </div>
      <div className="col-span-3 md:col-span-3">
        <input
          id="tb_correo"
          className="input input-bordered input-sm md:input-md join-item w-full max-w-lg dark:bg-[#191e24] dark:text-neutral-200 text-neutral-600"
          placeholder="Correo..."
          onChange={(event) => handleBusquedaChange(event)}
          onKeyDown={(evt) => handleKeyDown(evt)}
          value={busqueda.tb_correo}
        />
      </div>
      <div className="md:col-span-1">
        <div className=" tooltip" data-tip="Limpiar">
          <button
            className="join-item dark:text-neutral-200 text-neutral-600 border-none  w-6 h-6 md:w-8 md:h-8 mt-2"
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
            <span className="fas fa-trash block sm:hidden md:hidden lg:hidden xl:hidden text-neutral-600 dark:text-neutral-200"></span>
            <span className="label-text font-bold md:block hidden text-neutral-600 dark:text-neutral-200 mt-2">
              Bajas
            </span>
          </label>
        </div>
      </div>
    </div>

  );
}

export default Busqueda;