import React from "react";

function Button({ onClick, icono }) {
  return (
    <button
      className=" w-10 h-10  bg-blue-500 hover:bg-blue-700 text-white rounded-lg btn"
      onClick={(evt) => onClick(evt)}
    >
      <i className={`${icono}`}></i>
    </button>
  );
}

export default Button;
