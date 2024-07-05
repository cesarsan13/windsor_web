import React from "react";

function Busqueda({
  setBajas,
  setFiltro,
  handleFiltroChange,
  limpiarBusqueda,
}) {
  return (
    <div className="join w-full flex justify-start h-1/8">
      <input
        id="TB_Busqueda"
        className="input input-bordered input-md join-item w-full md:w-3/6 dark:bg-slate-100 "
        placeholder="Buscar..."
      />
      <select
        className="select select-bordered join-item dark:bg-slate-100"
        onChange={handleFiltroChange}
      >
        <option disabled defaultValue={true}>
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
          className="btn btn-square btn-outline bg-gray-100 "
          onClick={limpiarBusqueda}
        >
          <i className="fa-solid fa-broom"></i>
        </button>
      </div>
      <div className="form-control">
        <label htmlFor="" className="label cursor-pointer">
          <input
            type="checkbox"
            className=" checkbox mx-2 checkbox-md"
            onClick={(evt) => setBajas(evt.target.checked)}
          />
          <span className="label-text font-bold">Bajas</span>
        </label>
      </div>
    </div>
  );
}

export default Busqueda;
