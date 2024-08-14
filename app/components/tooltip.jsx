import React from "react";

function Tooltip({ children, Titulo, posicion }) {
  return (
    <div
      className={`tooltip ${posicion}   hover:cursor-pointer `}
      data-tip={Titulo}
    >
      {children}
    </div>
  );
}

export default Tooltip;
