import React from "react";
import { soloEnteros } from "@/app/utils/globalfn";
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
    if (evt.key === "Enter") {
        evt.preventDefault(); 
        const div = document.getElementById("div_busqueda");
        const inputs = Array.from(
            div.querySelectorAll("input[id='tb_id'], input[id='tb_desc']")
        );
        const currentIndex = inputs.indexOf(evt.target);
        if (currentIndex !== -1) {
            if (currentIndex < inputs.length - 1) {
                inputs[currentIndex + 1].focus(); 
            } else {
              Buscar();
            }
        }
    }
  };

  return (
    <div className="grid grid-cols-3 md:grid-cols-12 gap-2" id="div_busqueda">
      <div className="col-span-1 md:col-span-1/2">
        <input
          id="tb_id"
          className="input input-bordered input-sm md:input-md w-full sm:w-full dark:bg-[#191e24] dark:text-neutral-200 text-neutral-600 text-right"
          placeholder="Número..."
          onChange={(event) => handleBusquedaChange(event)}
          onKeyDown={(evt) => {
            soloEnteros(evt);
            handleKeyDown(evt);
          }}
          value={busqueda.tb_id}
        />
      </div>
      <div className="col-span-2 md:col-span-4">
        <input
          id="tb_desc"
          className="input input-bordered input-sm md:input-md w-full sm:w-full dark:bg-[#191e24] dark:text-neutral-200 text-neutral-600 text-left"
          placeholder="Sub Menú..."
          onChange={(event) => handleBusquedaChange(event)}
          onKeyDown={(evt) => handleKeyDown(evt)}
          value={busqueda.tb_desc}
        />
      </div>
      <div className="md:col-span-1">
        <div className=" tooltip" data-tip="Limpiar">
          <button
            className="join-item dark:text-neutral-200 text-neutral-600 border-none  w-5 h-5 md:w-6 md:h-6 mt-4"
            onClick={(evt) => limpiarBusqueda(evt)}
          >
            <Image src={iconos.limpiar} alt="Limpiar" className="block dark:hidden" />
            <Image src={iconos.limpiar_w} alt="Limpiar" className="hidden dark:block" />
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
              <Image src={iconos.eliminar} alt="Bajas" className="block dark:hidden"></Image>
              <Image src={iconos.eliminar_w} alt="Bajas" className="hidden dark:block"></Image>
            </button>
            <span className=" text-lg font-xthin text-neutral-600 dark:text-white hidden sm:inline">Bajas</span>
          </label>
        </div>
      </div>
    </div>
  );
}

export default Busqueda;
