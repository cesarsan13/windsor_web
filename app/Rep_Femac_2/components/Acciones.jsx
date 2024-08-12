import React from "react";
import Tooltip from "@/app/components/tooltip";
import Button from "@/app/components/button";
function Acciones({Ver, home }) {
  return (
    <div className="join join-horizontal justify-around md:join-vertical">
      <Tooltip Titulo={"Vista Previa"} posicion={"tooltip-top"}>
        <Button icono={"fas fa-eye"} onClick={Ver}></Button>
      </Tooltip>
      <Tooltip Titulo={"Inicio"} posicion={"tooltip-top"}>
        <Button icono={"fas fa-home"} onClick={home}></Button>
      </Tooltip>
    </div>
  );
}

export default Acciones;
