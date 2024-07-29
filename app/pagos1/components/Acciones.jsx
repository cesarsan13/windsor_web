import React from "react";
import Tooltip from "@/app/components/tooltip";
import Button from "@/app/components/button";
function Acciones({ Documento, Recargos, Parciales, ImprimePDF, ImprimeExcel, home, Ver, CerrarView }) {
  return (
    <div className="join join-vertical ">
      <Tooltip Titulo={"Documento"} posicion={"tooltip-top"}>
        <Button icono={"fa-solid fa-file"} onClick={Documento}></Button>
      </Tooltip>
      <Tooltip Titulo={"Recargos"} posicion={"tooltip-top"}>
        <Button icono={"fa-solid fa-coins"} onClick={Recargos}></Button>
      </Tooltip>
      <Tooltip Titulo={"Parciales"} posicion={"tooltip-top"}>
        <Button icono={"fa-solid fa-heart-crack"} onClick={Parciales}></Button>
      </Tooltip>
      <Tooltip Titulo={"Imprimir"} posicion={"tooltip-top"}>
        <Button icono={"fas fa-file-pdf"} onClick={ImprimePDF}></Button>
      </Tooltip>
      <Tooltip Titulo={"Excel"} posicion={"tooltip-top"}>
        <Button icono={"fas fa-file-excel"} onClick={ImprimeExcel}></Button>
      </Tooltip>
      <Tooltip Titulo={"Vista Previa"} posicion={"tooltip-top"}>
        <Button icono={"fas fa-eye"} onClick={Ver}></Button>
      </Tooltip>
      <Tooltip Titulo={"Cerrar Vista Previa"} posicion={"tooltip-top"}>
        <Button icono={"fa-solid fa-xmark"} onClick={CerrarView}></Button>
      </Tooltip>
      <Tooltip Titulo={"Inicio"} posicion={"tooltip-top"}>
        <Button icono={"fas fa-home"} onClick={home}></Button>
      </Tooltip>
    </div>
  );
}

export default Acciones;
