import Tooltip from '@/app/components/tooltip';
import iconos from '@/app/utils/iconos';
import Image from 'next/image';
import React from 'react'
import { TbLoader3 } from 'react-icons/tb';

function Acciones({ Buscar, home, Ver, BoletasGrupo, isLoadingBoletasGrupo,isLoadingVistaPrevia }) {
    const images = [
        { src: iconos.buscar, alt: 'Buscar', tooltipTitle: 'Buscar', onClick: Buscar, isLoading: false },
        { src: iconos.vistaPrevia, alt: 'Vista previa', tooltipTitle: 'Vista previa', onClick: Ver, isLoading: isLoadingVistaPrevia },
        { src: iconos.imprimir, alt: 'Imprimir Boletas de Grupo', tooltipTitle: 'Imprimir Boletas de Grupo', onClick: BoletasGrupo, isLoading: isLoadingBoletasGrupo },
        { src: iconos.salir, alt: 'Salir', tooltipTitle: 'Salir', onClick: home, isLoading: false },
    ];
    const ImageTooltip = ({ src, tooltipTitle, onClick, isLoading }) => {
        return (
            <Tooltip Titulo={tooltipTitle} posicion="tooltip-bottom">
                <button
                    className="w-6 h-5 bg-transparent hover:bg-transparent border-none shadow-none text-black dark:text-white rounded-lg"
                    onClick={onClick}
                >
                    {isLoading ? (
                        <TbLoader3 className="animate-spin text-2xl" />
                    ) : (
                        <Image src={src} alt={tooltipTitle} className="w-5 h-5 md:w-6 md:h-6" />
                    )}
                </button>
            </Tooltip>
        );
    }
    return (
        <div className="grid grid-flow-col gap-5 justify-around w-full">
            {images.map((image, idx) => (
                <ImageTooltip key={idx} src={image.src} onClick={image.onClick} tooltipTitle={image.tooltipTitle} isLoading={image.isLoading} />
            ))}
        </div>
    )
}

export default Acciones
