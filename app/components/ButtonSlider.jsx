import React from "react";

function ButtonSlider({ texto, referencia }) {
  return (
    <a
      href={`#${referencia}`}
      className="btn btn-circle  hover:shadow-lg hover:border  hover:bg-slate-900  hover:text-white animate-blink"
    >
      <span className="font-bold">{texto}</span>
    </a>
  );
}

export default ButtonSlider;
