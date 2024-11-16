import React from 'react'
import Tooltip from "@/app/components/tooltip";
import Button from "@/app/components/button";
import Image from "next/image";
import iconos from "@/app/utils/iconos";
function Acciones({ home, Alta }) {
  const images = [
    { srcDark: iconos.salir, srcLight:iconos.salir_w, alt: 'Salir', tooltipTitle: 'Salir', onClick: home },
    { srcDark: iconos.procesa, srcLight:iconos.procesa_w, alt: "Guardar", tooltipTitle: "Cambiar Ciclo", onClick: Alta },
  ];

  const ImageTooltip = ({ srcDark,srcLight, tooltipTitle, onClick }) => {
    return (
      <Tooltip Titulo={tooltipTitle} posicion="tooltip-bottom">
        <Image src={srcDark} alt={tooltipTitle} onClick={onClick} className="w-5 h-5 md:w-6 md:h-6 block dark:hidden" />
        <Image src={srcLight} alt={tooltipTitle} onClick={onClick} className="w-5 h-5 md:w-6 md:h-6 hidden dark:block" />
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
