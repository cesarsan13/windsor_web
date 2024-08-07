import React from "react";
import Tooltip from "@/app/components/tooltip";
import Button from "@/app/components/button";
import { FaSpinner } from "react-icons/fa";
import { LuLoader2 } from "react-icons/lu";
import { TbLoader3 } from "react-icons/tb";
function Acciones({ home, Ver, isLoading }) {
  return (
    <div className="join join-vertical ">
      <Tooltip Titulo={"Vista Previa"} posicion={"tooltip-top"}>
        <button
          className=" w-10 h-10  bg-transparent hover:bg-transparent border-none shadow-none text-black dark:text-white rounded-lg btn"
          onClick={(evt) => Ver(evt)}
        >
          {isLoading ? (
            <TbLoader3 className="animate-spin -mx-2 text-4xl" />
          ) : (
            <i className={`fas fa-eye text-lg`}></i>
          )}
        </button>
      </Tooltip>
      <Tooltip Titulo={"Inicio"} posicion={"tooltip-top"}>
        <Button icono={"fas fa-home"} onClick={home}></Button>
      </Tooltip>
    </div>
  );
}

export default Acciones;
