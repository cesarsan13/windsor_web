import React from 'react'
import Tooltip from "@/app/components/tooltip";
import Button from "@/app/components/button";
import Image from "next/image";
import iconos from "@/app/utils/iconos";
function Acciones({ home, Alta, Buscar }) {
  const images = [
    { src: iconos.salir, alt: 'Salir', tooltipTitle: 'Salir', onClick: home },
    { src: iconos.buscar, alt: "Buscar", tooltipTitle: "Buscar", onClick: Buscar },
    { src: iconos.guardar, alt: "Guardar", tooltipTitle: "Guardar", onClick: Alta },
  ];

  const ImageTooltip = ({ src, tooltipTitle, onClick }) => {
    return (
      <Tooltip Titulo={tooltipTitle} posicion="tooltip-bottom">
        <Image src={src} alt={tooltipTitle} onClick={onClick} className="w-5 h-5 md:w-6 md:h-6" />
      </Tooltip>
    );
  };

  return (
    <div className="grid grid-flow-col gap-5 justify-around w-full">
      {images.map((image, idx) => (
        <ImageTooltip key={idx} src={image.src} {...image} />
      ))}
    </div>
  );
}

export default Acciones
