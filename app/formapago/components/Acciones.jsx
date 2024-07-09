import React from "react";
function Acciones({ Buscar, Alta, home }) {
  return (
    <div className="join join-vertical ">
      <div
        className="tooltip tooltip-top my-1 mb-5  hover:cursor-pointer "
        data-tip="Buscar"
        onClick={(evt) => Buscar(evt)}
      >
        <button className="btn btn-square  bg-gray-300 hover:bg-gray-500">
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>
      <div
        className="tooltip tooltip-top my-5 hover:cursor-pointer "
        data-tip="Añadir"
        onClick={Alta}
      >
        <button className="btn btn-square  bg-gray-300 hover:bg-gray-500">
          <i className="fa-regular fa-square-plus"></i>
        </button>
      </div>
      <div
        className="tooltip tooltip-top my-5 hover:cursor-pointer "
        data-tip="Regresar"
        onClick={home}
      >
        <button className="btn btn-square bg-gray-300 hover:bg-gray-500">
          <i className="fas fa-home"></i>
        </button>
      </div>
    </div>
  );
}

export default Acciones;
