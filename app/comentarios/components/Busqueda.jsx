import React from "react";
import { soloEnteros } from "@/app/utils/globalfn";

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
    <div className="grid grid-cols-3 md:grid-cols-12 gap-2">
      <div className="col-span-1 md:col-span-2">
        <input
          id="tb_numero"
          className="input input-bordered text-right input-md join-item w-full max-w-lg dark:bg-[#191e24] dark:text-neutral-200 text-neutral-600"
          placeholder="Id..."
          onChange={(event) => handleBusquedaChange(event)}
          onKeyDown={(evt) => {
            soloEnteros(evt);
            handleKeyDown(evt);
          }}
          value={busqueda.tb_numero}
        />
      </div>
      <div className="col-span-2 md:col-span-4">
        <input
          id="tb_comentario1"
          className="input input-bordered input-md join-item w-full max-w-lg dark:bg-[#191e24] dark:text-neutral-200 text-neutral-600"
          placeholder="Comentario 1..."
          onChange={(event) => handleBusquedaChange(event)}
          onKeyDown={(evt) => handleKeyDown(evt)}
          value={busqueda.tb_comentario1}
        />
      </div>
      <div className="md:col-span-1">
      <div className="tooltip" data-tip="Limpiar">
        <button
          className="btn btn-square join-item input input-sm  dark:bg-[#191e24] dark:text-neutral-200 text-neutral-600 border-none shadow-none "
          onClick={(evt) => limpiarBusqueda(evt)}
        >
          <i className="fa-solid fa-broom"></i>
        </button>
      </div>
      </div>
      <div className="md:col-span-1">
      <div className="form-control tooltip" data-tip="Ver Bajas">
        <label htmlFor="ch_bajas" className="label cursor-pointer">
          <input
            id="ch_bajas"
            type="checkbox"
            className=" checkbox mx-2 checkbox-md"
            onClick={(evt) => setBajas(evt.target.checked)}
          />
          <span className="fas fa-trash block sm:hidden md:hidden lg:hidden xl:hidden  text-neutral-600 dark:text-neutral-200"></span>
          <span className="label-text font-bold md:block hidden  text-neutral-600 dark:text-neutral-200">
            Bajas
          </span>
        </label>
      </div>
      </div>
    </div>
  );
}

export default Busqueda;
