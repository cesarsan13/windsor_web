import React from "react";

function ButtonSlider({ texto, referencia }) {
  return (
    <a
      href={`#${referencia}`}
      className="btn btn-circle bg-transparent border-none shadow-none hover:shadow-lg hover:border  hover:bg-slate-900 text-transparent hover:text-white"
    >
      <span className="font-bold">{texto}</span>
    </a>
  );
}

export default ButtonSlider;
