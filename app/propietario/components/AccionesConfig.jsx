import React from 'react'
import Tooltip from "@/app/components/tooltip";
import { TbLoader3 } from "react-icons/tb";
import Image from "next/image";
import iconos from "@/app/utils/iconos";
function Acciones({ Alta }) { 
  const images = [
    { 
      srcLight: iconos.alta_w,
      srcDark: iconos.alta,
      alt: "Alta", 
      tooltipTitle: "Alta", 
      onClick: Alta,
      isLoading: false
    },
   
  ];

  const ImageTooltip = ({ srcLight, srcDark, tooltipTitle, onClick, isLoading }) => {
    return (
      <Tooltip Titulo={tooltipTitle} posicion="tooltip-bottom">
        <button
          className="w-6 h-5 bg-transparent hover:bg-transparent border-none shadow-none text-black dark:text-white rounded-lg"
          type = "button"
          onClick={onClick}
        >
          {isLoading ? (
            <TbLoader3 className="animate-spin text-2xl" />
          ) : (
            <>
            <Image
              src={srcDark}
              alt={tooltipTitle}

              className="w-5 h-5 md:w-6 md:h-6 block dark:hidden"
            />
            <Image
              src={srcLight}
              alt={tooltipTitle}
              className="w-5 h-5 md:w-6 md:h-6 hidden dark:block"
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
          srcLight={image.srcLight}
          srcDark={image.srcDark}
          tooltipTitle={image.tooltipTitle}
          onClick={image.onClick}
          isLoading={image.isLoading}
        />
      ))}
    </div>
  );
}

export default Acciones
