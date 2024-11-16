import React from 'react'
import Tooltip from "@/app/components/tooltip";
import Button from "@/app/components/button";
import { TbLoader3 } from "react-icons/tb";
import Image from "next/image";
import iconos from "@/app/utils/iconos";
function Acciones({ home, Alta, Buscar, isLoading, isDisabledSave, Ver }) {
  const images = [
    { srcDark: iconos.buscar, srcLigth:iconos.buscar_w, alt: "Buscar", tooltipTitle: "Buscar", onClick: Buscar, isLoading: isLoading },
    { srcDark: iconos.guardar,srcLigth:iconos.guardar_w, alt: "Guardar", tooltipTitle: "Guardar", onClick: Alta, isLoading: isDisabledSave },
    { srcDark: iconos.vistaPrevia,srcLigth:iconos.vistaPrevia_w, alt: 'Vista previa', tooltipTitle: 'Vista previa', onClick: Ver },
    { srcDark: iconos.salir, alt: 'Salir', srcLigth:iconos.salir_w, tooltipTitle: 'Salir', onClick: home, isLoading: false },
  ];

  const ImageTooltip = ({ srcDark,srcLigth, tooltipTitle, onClick, isLoading }) => {
    return (
      <Tooltip Titulo={tooltipTitle} posicion="tooltip-bottom">
        <button
          className="w-6 h-5 bg-transparent hover:bg-transparent border-none shadow-none text-black dark:text-white rounded-lg"
          onClick={onClick}
        >
          {isLoading ? (
            <TbLoader3 className="animate-spin text-2xl" />
          ) : (
            <>
              <Image src={srcDark} alt={tooltipTitle} className="w-5 h-5 md:w-6 md:h-6  block dark:hidden" />
              <Image src={srcLigth} alt={tooltipTitle} className="w-5 h-5 md:w-6 md:h-6 hidden dark:block" />
            </>
          )}
        </button>
      </Tooltip>
    );
  };

  return (
    <div className="grid grid-flow-col gap-5 justify-around w-full">
      {images.map((image, idx) => (
        <ImageTooltip
          key={idx}
          srcDark={image.srcDark}
          srcLigth={image.srcLigth}
          tooltipTitle={image.tooltipTitle}
          onClick={image.onClick}
          isLoading={image.isLoading}
        />
      ))}
    </div>
  );
}

export default Acciones
