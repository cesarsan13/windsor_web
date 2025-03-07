import React, { useState } from "react";

function Busqueda({
  filtros,
  setFiltro,
  Buscar,
  handleBusquedaChange,
  TB_Busqueda,
}) {
  const handleFiltroChange = (event) => {
    const selectedValue = event.target.value;
    const name = event.target.attributes.name.value;
    setFiltro((filtros) => ({
      ...filtros,
      [name]: selectedValue,
    }));
  };
  const handleKeyDown = (evt) => {
    if (evt.key !== "Enter") return;
    Buscar();
  };

  return (
    <div className=" p-3 w-80 font-sans">
      <div className=" flex justify-between items-center">
        <label>Fecha emisión</label>
        <input
          name="fecha"
          type="date"
          value={filtros.fecha}
          onChange={(e) => handleFiltroChange(e)}
          style={{ color: "black" }}
        />
      </div>
      <div className=" flex mt-3 items-center">
        <label>Horario</label>
        <input
          type="text"
          className="ml-2 w-14"
          name="horario"
          id="horario"
          onChange={(evt) => handleFiltroChange(evt)}
          value={filtros.horario}
        />
        <select className="ml-2">
          <option>.</option>
        </select>
        <input
          id="TB_Busqueda"
          className="ml-2 bg-sky-400 w-40"
          onChange={(event) => handleBusquedaChange(event)}
          onKeyDown={(evt) => handleKeyDown(evt)}
          value={TB_Busqueda}
        />
      </div>
      <div style={{ marginTop: "10px" }}>
        <label>Ordenado por: </label>
        <label>
          <input
            type="radio"
            name="orden"
            value="nombre"
            onChange={(event) => handleFiltroChange(event)}
          />
          Nombre
        </label>
        <label>
          <input
            type="radio"
            name="orden"
            value="id"
            onChange={(event) => handleFiltroChange(event)}
          />
          Número
        </label>
      </div>
    </div>
  );
}

export default Busqueda;
