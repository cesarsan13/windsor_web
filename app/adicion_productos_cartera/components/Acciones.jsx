import React, { useState } from 'react';
import Tooltip from "@/app/components/tooltip";
import { TbLoader3 } from "react-icons/tb"; // Icono de carga
import Image from "next/image";
import iconos from "@/app/utils/iconos";

function Acciones({ home, BRef, Bproceso, isLoadingRef, isLoadingProc }) {
  const isAnyLoading = isLoadingRef || isLoadingProc;

  const images = [
    { srcDark: iconos.editar, srcLight: iconos.editar_w, alt: "Act. Ref.", tooltipTitle: "Act. Ref.", onClick: BRef, isLoading: isLoadingRef },
    { srcDark: iconos.procesa, srcLight:iconos.procesa_w, alt: "Proceso", tooltipTitle: "Proceso", onClick: Bproceso, isLoading: isLoadingProc },
    { srcDark: iconos.salir, srcLight:iconos.salir_w, alt: 'Salir', tooltipTitle: 'Salir', onClick: home, isLoading: false },
  ];

  const ImageTooltip = ({ srcDark, srcLight, tooltipTitle, onClick, isLoading, disabled }) => {
    return (
      <Tooltip Titulo={tooltipTitle} posicion="tooltip-bottom">
        <button
          className="w-6 h-5 bg-transparent hover:bg-transparent border-none shadow-none text-black dark:text-white rounded-lg"
          onClick={onClick}
          disabled={disabled}
        >
          {isLoading ? (
            <TbLoader3 className="animate-spin text-2xl" />
          ) : (
            <>
              <Image src={srcDark} alt={tooltipTitle} className="w-5 h-5 md:w-6 md:h-6 block dark:hidden" />
              <Image src={srcLight} alt={tooltipTitle} className="w-5 h-5 md:w-6 md:h-6 hidden dark:block" />
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
          srcLight={image.srcLight}
          srcDark={image.srcDark}
          tooltipTitle={image.tooltipTitle}
          onClick={image.onClick}
          isLoading={image.isLoading}
          disabled={isAnyLoading}
        />
      ))}
    </div>
  );
}

export default Acciones;
