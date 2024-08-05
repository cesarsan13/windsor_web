import React from "react";

function Button({ onClick, icono }) {
  return (
    <button
      className=" w-10 h-10  bg-transparent hover:bg-transparent border-none shadow-none text-black dark:text-white rounded-lg btn"
      onClick={(evt) => onClick(evt)}
    >
      <i className={`${icono} text-lg`}></i>
    </button>
  );
}

export default Button;
