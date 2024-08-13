import React from "react";

function Busqueda({
  setBajas,
  setFiltro,
  limpiarBusqueda,
  Buscar,
  handleBusquedaChange,
  TB_Busqueda,
  setTB_Busqueda,
}) {
  const handleFiltroChange = (event) => {
    const selectedValue = event.target.value;
    setFiltro(selectedValue);
  };
  const handleKeyDown = (evt) => {
    if (evt.key !== "Enter") return;
    Buscar();
  };
  return (
    <div className="join w-full max-w-3/4 flex justify-start items-center h-1/8 p-1">
      <input
        id="TB_Busqueda"
        className="input input-bordered input-md join-item w-full max-w-lg dark:bg-[#191e24] dark:text-neutral-200 text-neutral-600"
        placeholder="Buscar..."
        onChange={(event) => handleBusquedaChange(event)}
        onKeyDown={(evt) => handleKeyDown(evt)}
        value={TB_Busqueda}
      />
      <select
        className="select select-bordered join-item dark:bg-[#191e24] dark:text-neutral-200 w-20 md:w-32 text-neutral-600 "
        onChange={(event) => handleFiltroChange(event)}
        defaultValue="id"
      >
        <option disabled defaultValue={""}>
          Filtros
        </option>
        <option value={"id"}>Numero</option>
        <option value={"descripcion"}>Descripcion</option>
        <option value={"comision"}>Comision</option>
        <option value={"aplicacion"}>Aplicacion</option>
        <option value={"cue_banco"}>Cuenta Banco</option>
      </select>
      <div className="tooltip" data-tip="Limpiar">
        <button
          className="btn btn-square join-item input input-sm  dark:bg-[#191e24] dark:text-neutral-200 text-neutral-600 border-none shadow-none "
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
            className=" checkbox mx-2 checkbox-md"
            onClick={(evt) => setBajas(evt.target.checked)}
          />
          <span className="fas fa-trash block sm:hidden md:hidden lg:hidden xl:hidden text-neutral-600 dark:text-neutral-200"></span>
          <span className="label-text font-bold md:block hidden text-neutral-600 dark:text-neutral-200">
            Bajas
          </span>
        </label>
      </div>
    </div>
  );
}

export default Busqueda;
