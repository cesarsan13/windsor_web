import React, { useState } from "react";
import Tooltip from "@/app/components/tooltip";
import Button from "@/app/components/button";
import { TbLoader3 } from "react-icons/tb";
import Image from "next/image";
import iconos from "@/app/utils/iconos";

function Acciones({ home, Bproceso, isLoading,permiso_alta }) {
  const isAnyLoading = isLoading;
  const images = [
    { srcDark: iconos.procesa, srcLight:iconos.procesa_w, alt: "Proceso", tooltipTitle: "Proceso", onClick: Bproceso, isLoading: isLoading,permission: permiso_alta, },
    { srcDark: iconos.salir, srcLight:iconos.salir_w, alt: 'Salir', tooltipTitle: 'Salir', onClick: home, isLoading: false,permission: true, },
  ];

  const ImageTooltip = ({
    srcDark,
    srcLight,
    tooltipTitle,
    onClick,
    isLoading,
    disabled,
    permission,
  }) => {
    if (!permission) return null;
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
              <Image
                src={srcDark}
                alt={tooltipTitle}
                className="w-5 h-5 md:w-6 md:h-6 dark:hidden block"
              />
              <Image
              src={srcLight}
              alt={tooltipTitle}
              className="w-5 h-5 md:w-6 md:h-6 dark:block hidden"
            />
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
          srcLight={image.srcLight}
          tooltipTitle={image.tooltipTitle}
          onClick={image.onClick}
          isLoading={image.isLoading}
          disabled={isAnyLoading}
          permission={image.permission}
        />
      ))}
    </div>
  );
}

export default Acciones;
