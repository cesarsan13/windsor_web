import React from "react";

function Acciones({ Buscar, Alta }) {
  return (
    <div className="join join-vertical ml-2">
      <div className="tooltip tooltip-top my-1 mb-5" data-tip="Buscar">
        <kbd
          className="kbd hover:cursor-pointer"
          onClick={(evt) => Buscar(evt)}
        >
          <i className="fa-solid fa-magnifying-glass"></i>
        </kbd>
      </div>
      <div className="tooltip tooltip-top my-5" data-tip="Añadir">
        <button className="hover:cursor-pointer btn" onClick={Alta}>
          <kbd className="kbd ">
            <i className="fa-regular fa-square-plus"></i>
          </kbd>
        </button>
      </div>
      <div className="tooltip tooltip-top my-5" data-tip="Regresar">
        <kbd className="kbd hover:cursor-pointer">
          <i className="fas fa-home"></i>
        </kbd>
      </div>
    </div>
  );
}

export default Acciones;
