import React, { useState } from "react";

function Busqueda({
  setBajas,
  setFiltro,
  limpiarBusqueda,
  Buscar,
  handleBusquedaChange,
  TB_Busqueda,
}) {
  const [fecha, setFecha] = useState("2024-07-17");

  const handleFiltroChange = (event) => {
    const selectedValue = event.target.value;
    setFiltro(selectedValue);
  };
  const handleKeyDown = (evt) => {
    if (evt.key !== "Enter") return;
    Buscar();
  };

  return (
    <div style={{ padding: '10px', width: '350px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label>Fecha emisión</label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          style={{ color: 'black' }}
        />
      </div>
      <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center' }}>
        <label>Horario</label>
        <input type="text" style={{ marginLeft: '10px', width: '50px' }} />
        <select style={{ marginLeft: '10px' }}>
          <option>.</option>
        </select>
        <input
          id="TB_Busqueda"
          style={{ marginLeft: '10px', backgroundColor: '#00FFFF', width: '150px' }}
          onChange={(event) => handleBusquedaChange(event)}
          onKeyDown={(evt) => handleKeyDown(evt)}
          value={TB_Busqueda}
        />
      </div>
      <div style={{ marginTop: '10px' }}>
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
            value="numero"
            onChange={(event) => handleFiltroChange(event)}
          />
          Número
        </label>
      </div>
    </div>
  );
}

export default Busqueda;
