import React from "react";
import Tooltip from "@/app/components/tooltip";
import Button from "@/app/components/button";
function Acciones({ Buscar, Alta, home, imprimir, excel }) {
    return (
        <div className="join join-horizontal justify-around md:join-vertical">
        <Tooltip Titulo={"Buscar"} posicion={"tooltip-top"}>
        <Button
        icono={"fa-solid fa-magnifying-glass"}
        onClick={Buscar}
        ></Button>
        </Tooltip>
        <Tooltip Titulo={"Alta"} posicion={"tooltip-top"}>
        <Button icono={"fa-regular fa-square-plus"} onClick={Alta}></Button>
        </Tooltip>
        <Tooltip Titulo={"Inicio"} posicion={"tooltip-top"}>
        <Button icono={"fas fa-home"} onClick={home}></Button>
        </Tooltip>
    </div>
    );
}

export default Acciones;
