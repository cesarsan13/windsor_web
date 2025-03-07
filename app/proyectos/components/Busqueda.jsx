import React from "react";
import iconos from "@/app/utils/iconos";
import Image from "next/image";

function Busqueda({
    handleBusquedaChange, 
    evtBuscar, 
    busqueda, 
    limpiarBusqueda 
}){
    const handleKeyDown = (evt) => {
        if (evt.key !== "Enter") return;
        evtBuscar();
      };

    return(
        <div className="grid grid-cols-5 md:grid-cols-12 gap-2">
            <div className="col-span-2 md:col-span-4">
                <input
                  className="input input-bordered input-sm md:input-md w-full sm:w-full dark:bg-[#191e24] dark:text-neutral-200 text-neutral-600 text-left"        
                  placeholder="Nombre..."
                  id="nombre"
                  onChange={(event)=>handleBusquedaChange(event)}
                  onKeyDown={(evt)=>{
                      handleKeyDown(evt)
                  }}
                  value={busqueda.nombre}
                />
            </div>
            <div className="col-span-2 md:col-span-2">
                <input
                  className="input input-bordered input-sm md:input-md w-full sm:w-full dark:bg-[#191e24] dark:text-neutral-200 text-neutral-600 text-left"        
                  placeholder="Host..."
                  id="host"
                  onChange={(event)=>handleBusquedaChange(event)}
                  onKeyDown={(evt)=>{
                        handleKeyDown(evt)
                  }}
                  value={busqueda.host}
                />
            </div>
            <div className="md:col-span-1">
        <div className="tooltip" data-tip="Limpiar">
            <button
              className="join-item   dark:text-neutral-200 text-neutral-600 border-none shadow-none  w-5 h-5 md:w-6 md:h-6 mt-4"
              onClick={(evt) => limpiarBusqueda(evt)}
            >
                  <Image src={iconos.limpiar} alt="Limpiar" className="block dark:hidden" />
                  <Image src={iconos.limpiar_w} alt="Limpiar" className="hidden dark:block" />
            </button>
          </div>
        </div>
        </div>
    );
}
export default Busqueda;