'use client'

import Button from '@/app/components/button';
import Tooltip from '@/app/components/tooltip';
import { Viewer, Worker,SpecialZoomLevel } from '@react-pdf-viewer/core'
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import iconos from '@/app/utils/iconos';

function ModalVistaPreviaRepFemac11Anexo3({ pdfPreview, pdfData, PDF, Excel }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    let suma = 0;
    useEffect(() => {
        const isEmptyDataPDF = Object.keys(pdfData || {}).length === 0 && (pdfData || {}).constructor === Object;
        setIsModalOpen(pdfPreview && !isEmptyDataPDF);
    }, [pdfPreview, pdfData]);    
    const [scale, setScale] = useState(1);
    useEffect(() => {
        const handleResize = () => {
            console.log("window.innerWidth => ",window.innerWidth )
            const newScale = window.innerWidth >= 768 ? SpecialZoomLevel.PageWidth : 1;

            setScale((prevScale) => {
                console.log(`${prevScale} !== ${newScale}`);
                if (prevScale !== newScale) {
                    return newScale;
                }
                return prevScale;
            });
        };

        const debounceResize = () => {
            let timeout;
            return () => {
                clearTimeout(timeout);
                timeout = setTimeout(handleResize, 100);
            };
        };

        const debouncedHandleResize = debounceResize();
        window.addEventListener('resize', debouncedHandleResize);

        handleResize();

        return () => {
            window.removeEventListener('resize', debouncedHandleResize);
        };
    }, []);

    // const [scale, setScale] = useState(1);
    // useEffect(() => {
    //     const handleResize = () => {
    //         if (window.innerWidth >= 768) {
    //             setScale(SpecialZoomLevel.PageWidth);
    //         } else {
    //             setScale(1);
    //         }
    //     };

    //     window.addEventListener('resize', handleResize);
    //     handleResize();
    //     return () => {
    //         window.removeEventListener('resize', handleResize);
    //     };
    // }, []);

    return (
        <dialog id='modalVPRepFemac11Anexo3' className='modal'>
            <div className='modal-box w-full max-w-5xl h-full'>
                <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2 dark:text-white text-black'
                    onClick={() => document.getElementById("modalVPRepFemac11Anexo3").close()}
                >
                    ✕
                </button>
                <h3 className='font-bold text-lg mb-5 dark:text-white text-black'>Vista Previa Reporte Cobranza por Alumno</h3>
                <div className='flex flex-row space-x-4'>
                    <Tooltip Titulo={"Imprimir PDF"} posicion={"tooltip-top"}>
                        <button
                            className="bg-transparent over:bg-slate-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-white rounded-lg btn"
                            onClick={PDF}
                        >
                            <span className="hidden sm:inline">Generar PDF</span>
                            <Image src={iconos.imprimir} alt="Imprimir" className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                    </Tooltip>
                    <Tooltip Titulo={"Imprimir Excel"} posicion={"tooltip-top"}>
                        <button
                            className="bg-transparent over:bg-slate-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-white rounded-lg btn"
                            onClick={Excel}
                        >
                            <span className="hidden sm:inline">Generar Excel</span>
                            <Image src={iconos.excel} alt="Excel" className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                    </Tooltip>
                </div>
                {pdfPreview && pdfData && (
                    <div className='w-full'>
                        <div className='pdf-preview'>
                            <Worker
                                workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
                            >
                                <div className='' style={{ maxHeight: "calc(100vh - 4rem)" }}>
                                    <Viewer fileUrl={pdfData} defaultScale={scale}/>
                                    {/* <Viewer fileUrl={pdfData} /> */}

                                </div>
                            </Worker>
                        </div>
                    </div>
                )}
            </div>
        </dialog>
    )
}

export default ModalVistaPreviaRepFemac11Anexo3