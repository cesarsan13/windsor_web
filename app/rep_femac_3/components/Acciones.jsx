import React from "react";
import Tooltip from "@/app/components/tooltip";
import Button from "@/app/components/button";
function Acciones({ Buscar, Alta, home, imprimir, excel, Ver }) {
  return (
    <div className="join join-vertical ">
      <Tooltip Titulo={"Imprimir"} posicion={"tooltip-top"}>
        <Button icono={"fa-solid fa-file-pdf"} onClick={imprimir}></Button>
      </Tooltip>
      <Tooltip Titulo={"Excel"} posicion={"tooltip-top"}>
        <Button icono={"fas fa-file-excel"} onClick={excel}></Button>
      </Tooltip>
      <Tooltip Titulo={"Inicio"} posicion={"tooltip-top"}>
        <Button icono={"fas fa-home"} onClick={home}></Button>
      </Tooltip>
      <Tooltip Titulo={"Vista Previa"} posicion={"tooltip-top"}>
        <Button icono={"fas fa-eye"} onClick={Ver}></Button>
      </Tooltip>
    </div>
  );
}

export default Acciones;