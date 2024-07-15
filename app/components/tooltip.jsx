import React from "react";

function Tooltip({ children, Titulo, posicion }) {
  return (
    <div
      className={`tooltip ${posicion} my-1 mb-5  hover:cursor-pointer `}
      data-tip={Titulo}
    >
      {children}
    </div>
  );
}

export default Tooltip;
