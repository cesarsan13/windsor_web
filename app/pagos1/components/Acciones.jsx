import React from "react";
import Tooltip from "@/app/components/tooltip";
import { TbLoader3 } from "react-icons/tb";
import Image from "next/image";
import iconos from "@/app/utils/iconos";
function Acciones({
  Documento,
  Recargos,
  Parciales,
  ImprimePDF,
  home,
  Alta,
  muestraRecargos,
  muestraParciales,
  muestraImpresion,
  muestraDocumento,
}) {
  const isAnyLoading = muestraRecargos || muestraParciales || muestraImpresion || muestraDocumento;
  const images = [
    {
      src: iconos.alta,
      alt: "Añadir Pago",
      tooltipTitle: "Nuevo Pago",
      onClick: Alta,
      isLoading: false,
    },
    {
      src: iconos.documento,
      alt: "Documento",
      tooltipTitle: "Documento",
      onClick: Documento,
      isLoading: muestraDocumento,
    },
    {
      src: iconos.recargo,
      alt: "Recargos",
      tooltipTitle: "Recargos",
      onClick: Recargos,
      isLoading: muestraRecargos,
    },
    {
      src: iconos.actualizar_formato,
      alt: "Parciales",
      tooltipTitle: "Parciales",
      onClick: Parciales,
      isLoading: muestraParciales,
    },
    {
      src: iconos.vistaPrevia,
      alt: "Imprimir",
      tooltipTitle: "Imprimir",
      onClick: ImprimePDF,
      isLoading: muestraImpresion
    },
    { src: iconos.salir, alt: "Salir", tooltipTitle: "Salir", onClick: home },
  ];

  const ImageTooltip = ({ src, tooltipTitle, onClick, isLoading, disabled }) => {
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
            <Image src={src} alt={tooltipTitle} className="w-5 h-5 md:w-6 md:h-6" />
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
          src={image.src}
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
