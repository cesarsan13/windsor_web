import React from "react";
import Tooltip from "@/app/components/tooltip";
import Button from "@/app/components/button";
function Acciones({
  Buscar,
  Alta,
  home,
  PDF,
  Excel,
  Ver,
  CerrarView
}) {
  return (
    <div className="join join-vertical ">
      <Tooltip Titulo={"Buscar"} posicion={"tooltip-top"}>
        <Button
          icono={"fa-solid fa-magnifying-glass"}
          onClick={Buscar}
        ></Button>
      </Tooltip>
      <Tooltip Titulo={"Alta"} posicion={"tooltip-top"}>
        <Button icono={"fa-regular fa-square-plus"} onClick={Alta}></Button>
      </Tooltip>
      <Tooltip Titulo={"Imprimir PDF"} posicion={"tooltip-top"}>
        <Button icono={"fa-solid fa-file-pdf"} onClick={PDF}></Button>
      </Tooltip>
      <Tooltip Titulo={"Imprimir Excel"} posicion={"tooltip-top"}>
        <Button icono={"fa-solid fa-file-excel"} onClick={Excel}></Button>
      </Tooltip>
      <Tooltip Titulo={"Inicio"} posicion={"tooltip-top"}>
        <Button icono={"fas fa-home"} onClick={home}></Button>
      </Tooltip>
      <Tooltip Titulo={"Vista Previa"} posicion={"tooltip-top"}>
        <Button icono={"fas fa-eye"} onClick={Ver}></Button>
      </Tooltip>
      <Tooltip Titulo={"Cerrar Vista Previa"} posicion={"tooltip-top"}>
        <Button icono={"fa-solid fa-xmark"} onClick={CerrarView}></Button>
      </Tooltip>
    </div>
  );
}

export default Acciones;
