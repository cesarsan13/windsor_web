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
    <div className="grid grid-cols-3 md:grid-cols-12 gap-2">
      <div className="col-span-1 md:col-span-2">
        <input
          id="tb_id"
          className="input input-bordered input-md max-w-xs w-full dark:bg-[#191e24] dark:text-neutral-200 text-neutral-600 text-right"
          placeholder="Id..."
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
          className="input input-bordered input-md join-item w-full max-w-lg dark:bg-[#191e24] dark:text-neutral-200 text-neutral-600"
          placeholder="Descripcion..."
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
    // <div className="join w-full max-w-3/4 flex justify-start items-center h-1/8 p-1">
    //   <input
    //     id="TB_Busqueda"
    //     className="input input-bordered input-md join-item w-full max-w-lg dark:bg-[#191e24] dark:text-neutral-200 text-neutral-600"
    //     placeholder="Buscar..."
    //     onChange={(event) => handleBusquedaChange(event)}
    //     onKeyDown={(evt) => handleKeyDown(evt)}
    //     value={TB_Busqueda}
    //   />
    //   <select
    //     className="select select-bordered join-item dark:bg-[#191e24] dark:text-neutral-200 w-20 md:w-32 text-neutral-600"
    //     onChange={(event) => handleFiltroChange(event)}
    //   >
    //     <option  defaultValue={""}>
    //       Filtros
    //     </option>
    //     <option value="id">Número</option>
    //     <option value="nombre">Nombre</option>
    //   </select>
    //   <div className="tooltip" data-tip="Limpiar">
    //     <button
    //       className="btn btn-square join-item input input-sm  dark:bg-[#191e24] dark:text-neutral-200 text-neutral-600 border-none shadow-none "
    //       onClick={(evt) => limpiarBusqueda(evt)}
    //     >
    //       <i className="fa-solid fa-broom"></i>
    //     </button>
    //   </div>
    //   <div className="form-control tooltip" data-tip="Ver Bajas">
    //     <label htmlFor="ch_bajas" className="label cursor-pointer">
    //       <input
    //         id="ch_bajas"
    //         type="checkbox"
    //         className="checkbox mx-2 checkbox-md"
    //         onClick={(evt) => setBajas(evt.target.checked)}
    //       />
    //       <span className="fa-solid fa-trash block sm:hidden md:hidden lg:hidden xl:hidden text-neutral-600 dark:text-neutral-200"></span>
    //       <span className="label-text font-bold md:block hidden text-neutral-600 dark:text-neutral-200">
    //         Bajas
    //       </span>
    //     </label>
    //   </div>

    // </div>
  );
}

export default Busqueda;
