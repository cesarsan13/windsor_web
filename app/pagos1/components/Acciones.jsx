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
      srcLight: iconos.alta_w,
      srcDark: iconos.alta,
      alt: "Añadir Pago",
      tooltipTitle: "Nuevo Pago",
      onClick: Alta,
      isLoading: false,
    },
    {
      srcLight: iconos.documento_w,
      srcDark: iconos.documento,
      alt: "Documento",
      tooltipTitle: "Documento",
      onClick: Documento,
      isLoading: muestraDocumento,
    },
    {
      srcLight: iconos.recargo_w,
      srcDark: iconos.recargo,
      alt: "Recargos",
      tooltipTitle: "Recargos",
      onClick: Recargos,
      isLoading: muestraRecargos,
    },
    {
      srcLight: iconos.actualizar_formato_w,
      srcDark: iconos.actualizar_formato,
      alt: "Parciales",
      tooltipTitle: "Parciales",
      onClick: Parciales,
      isLoading: muestraParciales,
    },
    {
      srcLight: iconos.vistaPrevia_w,
      srcDark: iconos.vistaPrevia,
      alt: "Imprimir",
      tooltipTitle: "Imprimir",
      onClick: ImprimePDF,
      isLoading: muestraImpresion
    },
    { srcLight: iconos.salir_w, srcDark:iconos.salir, alt: "Salir", tooltipTitle: "Salir", onClick: home },
  ];

  const ImageTooltip = ({ srcLight, srcDark, tooltipTitle, onClick, isLoading, disabled }) => {
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
                className="w-5 h-5 md:w-6 md:h-6 block dark:hidden"/>
              <Image
                src={srcLight}
                alt={tooltipTitle}
                className="w-5 h-5 md:w-6 md:h-6 hidden dark:block" />
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
