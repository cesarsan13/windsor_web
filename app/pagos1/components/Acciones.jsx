import React from "react";
import Tooltip from "@/app/components/tooltip";
import { TbLoader3 } from "react-icons/tb";
import Image from "next/image";
import iconos from "@/app/utils/iconos";
import { permission } from "process";
function Acciones({
  Documento,
  Recargos,
  Parciales,
  ImprimePDF,
  home,
  Alta,
  // procesarDatos,
  muestraRecargos,
  muestraParciales,
  muestraImpresion,
  muestraDocumento,
  permiso_alta,
  permiso_imprime,
}) {
  const isAnyLoading = muestraRecargos || muestraParciales || muestraImpresion || muestraDocumento ;
  const images = [
    {
      srcLight: iconos.alta_w,
      srcDark: iconos.alta,
      alt: "Añadir Pago",
      tooltipTitle: "Nuevo Pago",
      onClick: Alta,
      isLoading: false,
      permission: permiso_alta,
    },
    {
      srcLight: iconos.documento_w,
      srcDark: iconos.documento,
      alt: "Documento",
      tooltipTitle: "Documento",
      onClick: Documento,
      isLoading: muestraDocumento,
      permission: permiso_alta,
    },
    {
      srcLight: iconos.recargo_w,
      srcDark: iconos.recargo,
      alt: "Recargos",
      tooltipTitle: "Recargos",
      onClick: Recargos,
      isLoading: muestraRecargos,
      permission: permiso_alta,
    },
    {
      srcLight: iconos.actualizar_formato_w,
      srcDark: iconos.actualizar_formato,
      alt: "Parciales",
      tooltipTitle: "Parciales",
      onClick: Parciales,
      isLoading: muestraParciales,
      permission: permiso_alta,
    },
    {
      srcLight: iconos.vistaPrevia_w,
      srcDark: iconos.vistaPrevia,
      alt: "Imprimir",
      tooltipTitle: "Imprimir",
      onClick: ImprimePDF,
      isLoading: muestraImpresion,
      permission: permiso_imprime,
    },
    // {
    //   srcLight:iconos.procesa_w,
    //   srcDark:iconos.procesa,
    //   alt:"Procesar datos desde un archivo excel",
    //   tooltipTitle:"Procesar datos desde un archivo excel",
    //   onClick: procesarDatos,
    //   permission:true
    // },
    { srcLight: iconos.salir_w, 
      srcDark: iconos.salir, 
      alt: "Salir", 
      tooltipTitle: "Salir", 
      onClick: home, 
      permission: true 
    },
  ];

  const ImageTooltip = ({ srcLight, srcDark, tooltipTitle, onClick, isLoading, disabled, permission }) => {
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
                className="w-5 h-5 md:w-6 md:h-6 block dark:hidden" />
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
          permission={image.permission}
        />
      ))}
    </div>
  );
}

export default Acciones;
