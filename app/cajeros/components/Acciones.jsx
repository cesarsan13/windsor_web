import React from "react";
import Tooltip from "@/app/components/tooltip";
import Button from "@/app/components/button";

function Acciones({ Buscar, Alta, home, Ver }) {
  return (
    <div className="flex justify-between w-full">
      <Tooltip Titulo={"Buscar"} posicion={"tooltip-bottom"}>
        <Button icono={"fa-solid fa-magnifying-glass"} onClick={Buscar} className="w-full mx-1" />
      </Tooltip>
      <Tooltip Titulo={"Alta"} posicion={"tooltip-bottom"}>
        <Button icono={"fa-regular fa-square-plus"} onClick={Alta} className="w-full mx-1" />
      </Tooltip>
      <Tooltip Titulo={"Vista Previa"} posicion={"tooltip-bottom"}>
        <Button icono={"fas fa-eye"} onClick={Ver} className="w-full mx-1" />
      </Tooltip>
      <Tooltip Titulo={"Inicio"} posicion={"tooltip-bottom"}>
        <Button icono={"fas fa-home"} onClick={home} className="w-full mx-1" />
      </Tooltip>
    </div>
  );
}

export default Acciones;
