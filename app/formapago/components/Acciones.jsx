import React from "react";

function Acciones({ Buscar }) {
  return (
    <div className="join join-vertical ml-2">
      <div className="tooltip tooltip-top my-1 mb-5" data-tip="Buscar">
        <kbd className="kbd" onClick={(evt) => Buscar(evt)}>
          <i className="fa-solid fa-magnifying-glass"></i>
        </kbd>
      </div>
      <div className="tooltip tooltip-top my-5" data-tip="Añadir">
        <kbd
          className="kbd hover:cursor-pointer"
          onClick={() => document.getElementById("my_modal_3").showModal()}
        >
          <i className="fa-regular fa-square-plus"></i>
        </kbd>
      </div>
      <div className="tooltip tooltip-top my-5" data-tip="Regresar">
        <kbd className="kbd">
          <i className="fas fa-home"></i>
        </kbd>
      </div>
    </div>
  );
}

export default Acciones;
