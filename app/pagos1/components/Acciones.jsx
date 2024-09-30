import React from "react";
import Tooltip from "@/app/components/tooltip";
import Button from "@/app/components/button";
import Image from "next/image";
import iconos from "@/app/utils/iconos";
function Acciones({ Documento, Recargos, Parciales, ImprimePDF, ImprimeExcel, home, Ver, CerrarView }) {
  const images = [
    { src: iconos.documento, alt: 'Documento', tooltipTitle: 'Documento', onClick: Documento },
    { src: iconos.recargo, alt: 'Recargos', tooltipTitle: 'Recargos', onClick: Recargos },
    { src: iconos.actualizar_formato, alt: 'Parciales', tooltipTitle: 'Parciales', onClick: Parciales },
    { src: iconos.vistaPrevia, alt: 'Imprimir', tooltipTitle: 'Imprimir', onClick: ImprimePDF },
    { src: iconos.salir, alt: 'Salir', tooltipTitle: 'Salir', onClick: home },
  ];
  const ImageTooltip = ({ src, tooltipTitle, onClick }) => {
    return (
      <Tooltip Titulo={tooltipTitle} posicion="tooltip-bottom">
        <Image src={src} alt={tooltipTitle} onClick={onClick} className="w-5 h-5 md:w-6 md:h-6" />
      </Tooltip>
    );
  };
  return (
    // <div className="join join-vertical ">
    //   <Tooltip Titulo={"Documento"} posicion={"tooltip-top"}>
    //     <Button icono={"fa-solid fa-file"} onClick={Documento}></Button>
    //   </Tooltip>
    //   <Tooltip Titulo={"Recargos"} posicion={"tooltip-top"}>
    //     <Button icono={"fa-solid fa-coins"} onClick={Recargos}></Button>
    //   </Tooltip>
    //   <Tooltip Titulo={"Parciales"} posicion={"tooltip-top"}>
    //     <Button icono={"fa-solid fa-heart-crack"} onClick={Parciales}></Button>
    //   </Tooltip>
    //   <Tooltip Titulo={"Imprimir"} posicion={"tooltip-top"}>
    //     <Button icono={"fas fa-file-pdf"} onClick={ImprimePDF}></Button>
    //   </Tooltip>
    //   <Tooltip Titulo={"Inicio"} posicion={"tooltip-top"}>
    //     <Button icono={"fas fa-home"} onClick={home}></Button>
    //   </Tooltip>
    // </div>
    <div className="grid grid-flow-col gap-5 justify-around w-full">
      {images.map((image, idx) => (
        <ImageTooltip key={idx} src={image.src} {...image} />
      ))}
    </div>
  );
}



export default Acciones;
