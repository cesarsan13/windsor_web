import React from "react";

function Busqueda({ setBajas, handleFiltroChange, limpiarBusqueda, Buscar }) {
  const handleKeyDown = (evt) => {
    if (evt.key !== "Enter") return;
    Buscar(evt);
  };
  return (
    <div className="join w-full flex justify-start h-1/8 p-1">
      <input
        id="TB_Busqueda"
        className="input input-bordered input-md join-item w-full md:w-3/6 dark:bg-slate-100 "
        placeholder="Buscar..."
        onKeyDown={(evt) => handleKeyDown(evt)}
      />
      <select
        className="select select-bordered join-item dark:bg-slate-100"
        onChange={handleFiltroChange}
      >
        <option disabled selected>
          Filtros
        </option>
        <option value={"id"}>Numero</option>
        <option value={"descripcion"}>Descripcion</option>
        <option value={"comision"}>Comision</option>
        <option value={"aplicacion"}>Aplicacion</option>
        <option value={"cue_banco"}>Cuenta Banco</option>
      </select>
      <div className="tooltip " data-tip="Limpiar">
        <button
          className="btn btn-square join-item bg-gray-300 hover:bg-gray-500 input-bordered"
          onClick={limpiarBusqueda}
        >
          <i className="fa-solid fa-broom"></i>
        </button>
      </div>
      <div className="form-control tooltip" data-tip="Ver Bajas">
        <label htmlFor="ch_bajas" className="label cursor-pointer">
          <input
            id="ch_bajas"
            type="checkbox"
            className=" checkbox mx-2 checkbox-md"
            onClick={(evt) => setBajas(evt.target.checked)}
          />
          <span className="fas fa-trash block sm:hidden md:hidden lg:hidden xl:hidden"></span>
          <span className="label-text font-bold md:block hidden ">Bajas</span>
        </label>
      </div>
    </div>
  );
}

export default Busqueda;
