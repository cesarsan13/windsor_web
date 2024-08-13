import React, { useState } from "react";

function Busqueda({ setBajas, limpiarBusqueda, Buscar }) {
  const [busquedaNumero, setBusquedaNumero] = useState("");
  const [busquedaNombre, setBusquedaNombre] = useState("");

  const handleKeyDown = (evt) => {
    if (evt.key !== "Enter") return;
    Buscar(busquedaNumero, busquedaNombre);
  };

  const handleBusquedaNumeroChange = (event) => {
    setBusquedaNumero(event.target.value);
  };

  const handleBusquedaNombreChange = (event) => {
    setBusquedaNombre(event.target.value);
  };

  return (
<div className="join w-full max-w-3/4 flex justify-start items-center h-1/8 p-1 space-x-2">
  {/* Campo de búsqueda por número */}
  <input
    id="TB_Busqueda_Numero"
    className="input input-bordered input-md join-item w-2/6 max-w-36 dark:bg-[#191e24] dark:text-neutral-200 text-neutral-600 border-gray-300 border rounded-md shadow-md"
    placeholder="Buscar Número"
    onChange={handleBusquedaNumeroChange}
    onKeyDown={handleKeyDown}
    value={busquedaNumero}
  />

  {/* Campo de búsqueda por nombre */}
  <input
    id="TB_Busqueda_Nombre"
    className="input input-bordered input-md join-item w-4/6 max-w-60 dark:bg-[#191e24] dark:text-neutral-200 text-neutral-600 border-gray-300 border rounded-md shadow-md"
    placeholder="Buscar Nombre"
    onChange={handleBusquedaNombreChange}
    onKeyDown={handleKeyDown}
    value={busquedaNombre}
  />

  <div className="tooltip" data-tip="Limpiar">
    <button
      className="btn btn-square join-item input input-sm dark:bg-[#191e24] dark:text-neutral-200 text-neutral-600 border-none shadow-none"
          onClick={(evt) => limpiarBusqueda(evt)}

    >
      <i className="fa-solid fa-broom"></i>
    </button>
  </div>

  <div className="form-control tooltip" data-tip="Ver Bajas">
    <label htmlFor="ch_bajas" className="label cursor-pointer">
      <input
        id="ch_bajas"
        type="checkbox"
        className="checkbox mx-2 checkbox-md"
        onChange={(evt) => setBajas(evt.target.checked)}
      />
      <span className="fa-solid fa-trash block sm:hidden md:hidden lg:hidden xl:hidden text-neutral-600 dark:text-neutral-200"></span>
      <span className="label-text font-bold md:block hidden text-neutral-600 dark:text-neutral-200">
        Bajas
      </span>
    </label>
  </div>
</div>

  );
}

export default Busqueda;
