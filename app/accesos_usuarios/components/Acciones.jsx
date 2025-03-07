import Tooltip from '@/app/components/tooltip';
import iconos from '@/app/utils/iconos'
import Image from 'next/image';
import React from 'react'
import { TbLoader3 } from 'react-icons/tb';

function Acciones({ home }) {
    const images = [
        {
            srcLight: iconos.salir_w,
            srcDark: iconos.salir,
            alt: "Salir",
            tooltipTitle: "Salir",
            onClick: home,
        }
    ]
    const ImageTooltip = ({ srcLight, srcDark, tooltipTitle, onClick, animateLoading }) => {
        return (
            <Tooltip Titulo={tooltipTitle} posicion="tooltip-bottom">
                <button
                    className="w-6 h-5 bg-transparent hover:bg-transparent border-none shadow-none text-black dark:text-white rounded-lg"
                    onClick={onClick}
                >
                    {animateLoading ? (
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
                    animateLoading={idx === 2 && animateLoading}
                />
            ))}
        </div>
    )
}

export default Acciones
