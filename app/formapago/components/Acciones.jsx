import React from "react";
function Acciones({ Buscar, Alta, home }) {
  return (
    <div className="join join-vertical ">
      <div
        className="tooltip tooltip-top my-1 mb-5  hover:cursor-pointer "
        data-tip="Buscar"
        onClick={(evt) => Buscar(evt)}
      >
        <button className="btn btn-square  bg-blue-500 hover:bg-blue-700 text-white">
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>
      <div
        className="tooltip tooltip-top my-5 hover:cursor-pointer "
        data-tip="Añadir"
        onClick={Alta}
      >
        <button className="btn btn-square  bg-blue-500 hover:bg-blue-700 text-white">
          <i className="fa-regular fa-square-plus"></i>
        </button>
      </div>
      <div
        className="tooltip tooltip-top my-5 hover:cursor-pointer "
        data-tip="Regresar"
        onClick={home}
      >
        <button className="btn btn-square bg-blue-500 hover:bg-blue-700 text-white">
          <i className="fas fa-home"></i>
        </button>
      </div>
    </div>
  );
}

export default Acciones;
