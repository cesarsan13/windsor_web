import React from 'react'
import Tooltip from "@/app/components/tooltip";
import Button from "@/app/components/button";
function Acciones({ ImprimePDF, ImprimeExcel, home,Ver, CerrarView }) {
    return (
        <div className='join join-vertical '>
            <Tooltip Titulo={"Imprimir"} posicion={"tooltip-top"}>
                <Button icono={"fas fa-file-pdf"} onClick={ImprimePDF}></Button>
            </Tooltip>
            <Tooltip Titulo={"Excel"} posicion={"tooltip-top"}>
                <Button icono={"fas fa-file-excel"} onClick={ImprimeExcel}></Button>
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
    )
}

export default Acciones
