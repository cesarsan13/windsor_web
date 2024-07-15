import React from "react";

function Busqueda({
  setBajas,
  setFiltro,
  limpiarBusqueda,
  Buscar,
  handleBusquedaChange,
  TB_Busqueda,
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
        className="input input-bordered input-md join-item w-full max-w-lg dark:bg-slate-100 "
        placeholder="Buscar..."
        onChange={(event) => handleBusquedaChange(event)}
        onKeyDown={(evt) => handleKeyDown(evt)}
        value={TB_Busqueda}
      />
      <select
        className="select select-bordered join-item dark:bg-slate-100 w-20 md:w-32"
        onChange={(event) => handleFiltroChange(event)}
      >
        <option disabled defaultValue={""}>
          Filtros
        </option>
        <option value={"numero"}>Numero</option>
        <option value={"nombre"}>Nombre</option>
        <option value={"clave_cajero"}>Clave</option>
      </select>
      <div className="tooltip " data-tip="Limpiar">
        <button
          className="btn join-item  bg-blue-500 hover:bg-blue-700 text-white input-bordered"
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
      {}
    </div>
  );
}

export default Busqueda;
