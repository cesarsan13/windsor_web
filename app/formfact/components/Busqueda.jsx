import React from "react";

function Busqueda({
  setBajas,
  setFiltro,
  limpiarBusqueda,
  Buscar,
  handleBusquedaChange,
  TB_Busqueda,
  setFormato,
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
        className="input input-bordered input-md join-item w-full max-w-lg dark:bg-[#191e24] dark:text-neutral-200 text-neutral-600 "
        placeholder="Buscar..."
        onChange={(event) => handleBusquedaChange(event)}
        onKeyDown={(evt) => handleKeyDown(evt)}
        value={TB_Busqueda}
      />
      <select
        className="select select-bordered join-item dark:bg-[#191e24] dark:text-neutral-200 w-20 md:w-32 text-neutral-600"
        onChange={(event) => handleFiltroChange(event)}
      >
        <option disabled defaultValue={""}>
          Filtros
        </option>
        <option value={"numero"}>Numero</option>
        <option value={"nombre"}>Nombre</option>
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
          <span className="fa-solid fa-trash block sm:hidden md:hidden lg:hidden xl:hidden text-neutral-600 dark:text-neutral-200"></span>
          <span className="label-text font-bold md:block hidden text-neutral-600 dark:text-neutral-200">
            Bajas
          </span>
        </label>
      </div>
      <div className="ml-2 p-2 flex justify-between">
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Facturas</span>
            <input
              type="radio"
              name="r_tipo"
              className="radio checked:bg-blue-500"
              value={"Facturas"}
              onChange={(evt) => setFormato(evt.target.value)}
              defaultChecked
            />
          </label>
        </div>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Recibo</span>
            <input
              type="radio"
              name="r_tipo"
              className="radio checked:bg-blue-500"
              onChange={(evt) => setFormato(evt.target.value)}
              value={"Recibo"}
            />
          </label>
        </div>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Credencial</span>
            <input
              type="radio"
              name="r_tipo"
              value={"Credencial"}
              className="radio checked:bg-blue-500"
              onChange={(evt) => setFormato(evt.target.value)}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

export default Busqueda;
