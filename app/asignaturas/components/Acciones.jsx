import React from "react";
import Tooltip from "@/app/components/tooltip";
import Button from "@/app/components/button";
import Image from "next/image";
import iconos from "@/app/utils/iconos";
import { TbLoader3 } from "react-icons/tb"; // Icono de carga


function Acciones({ Buscar, Alta, home, Ver, isLoading }) {
  const images = [
    { src: iconos.buscar, alt: 'Buscar', tooltipTitle: 'Buscar', onClick: Buscar },
    { src: iconos.alta, alt: 'Alta', tooltipTitle: 'Alta', onClick: Alta},
    { src: iconos.vistaPrevia, alt: 'Vista previa', tooltipTitle: 'Vista previa', onClick: Ver },
    { src: iconos.salir, alt: 'Salir', tooltipTitle: 'Salir', onClick: home },
  ];

  const ImageTooltip = ({ src, tooltipTitle, onClick, isLoading }) => {
    return (
      <Tooltip Titulo={tooltipTitle} posicion="tooltip-bottom">
        {/* <Image src={src} alt={tooltipTitle} onClick={onClick} className="w-5 h-5 md:w-6 md:h-6"/> */}
        <button
          className="w-6 h-5 bg-transparent hover:bg-transparent border-none shadow-none text-black dark:text-white rounded-lg"
          onClick={onClick}
        >
          {isLoading ? (
            <TbLoader3 className="animate-spin text-2xl" />
          ) : (
            <Image src={src} alt={tooltipTitle} className="w-5 h-5 md:w-6 md:h-6" />
          )}
        </button>
      </Tooltip>
    );
  };

  return (
    <div className="grid grid-flow-col gap-5 justify-around w-full">
      {images.map((image,idx) => (
        // <ImageTooltip key={idx} src={image.src} {...image} />
        <ImageTooltip key={idx} src={image.src} {...image} isLoading={idx === 2 && isLoading} />
      ))}
    </div>
  );
}

export default Acciones;
