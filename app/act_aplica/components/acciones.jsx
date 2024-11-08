import Tooltip from '@/app/components/tooltip'
import iconos from '@/app/utils/iconos'
import Image from 'next/image'
import React from 'react'
import { TbLoader3 } from 'react-icons/tb'

function Acciones({ home, cobranzaD, ver, Alta }) {
    const images = [
        {
            src: iconos.alta,
            alt: "Alta",
            tooltipTitle: "Alta",
            onClick: Alta,
            animateLoading: false,
        },
        {
            src: iconos.vistaPrevia,
            alt: "Vista previa",
            tooltipTitle: "Vista previa",
            onClick: ver,
            animateLoading: false,
        },
        {
            src: iconos.salir,
            alt: "Salir",
            tooltipTitle: "Salir",
            onClick: home,
            animateLoading: false,
        },
        {
            src: iconos.salir,
            alt: "Regresar a cobranza diaria",
            tooltipTitle: "Regresar a cobranza diaria",
            onClick: cobranzaD,
            animateLoading: false,
        },
    ]
    const ImageTooltip = ({ src, tooltipTitle, onClick, animateLoading }) => {
        return (
            <Tooltip Titulo={tooltipTitle} posicion="tooltip-bottom">
                <button
                    className="w-6 h-5 bg-transparent hover:bg-transparent border-none shadow-none text-black dark:text-white rounded-lg"
                    onClick={onClick}
                >
                    {animateLoading ? (
                        <TbLoader3 className="animate-spin text-2xl" />
                    ) : (
                        <Image
                            src={src}
                            alt={tooltipTitle}
                            className="w-5 h-5 md:w-6 md:h-6"
                        />
                    )}
                </button>
            </Tooltip>
        )
    }
    return (
        <div className="grid grid-flow-col gap-5 justify-around w-full">
        {images.map((image, idx) => (
            <ImageTooltip
                key={idx}
                src={image.src}
                {...image}
                animateLoading={image.animateLoading}
            />
        ))}
    </div>
    )
}

export default Acciones
