import Tooltip from '@/app/components/tooltip';
import iconos from '@/app/utils/iconos';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import Image from 'next/image';
import React from 'react'
import "@react-pdf-viewer/core/lib/styles/index.css";

function ModalVistaPreviaPBoletas({ pdfPreview, pdfData, PDF }) {
    return (
        <dialog id="modalVPAlumno" className="modal">
            <div className='modal-box w-full max-w-4xl h-full'>
                <button
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 dark:text-white text-black"
                    onClick={(evt) => {
                        evt.preventDefault();
                        document.getElementById("modalVPAlumno").close();
                    }}
                >
                    ✕
                </button>
                <h3 className="font-bold text-lg mb-5 dark:text-white text-black">
                    Vista Previa Calificaciones
                </h3>
                <div className="flex flex-row space-x-4">
                    <Tooltip Titulo={"Imprimir PDF"} posicion={"tooltip-top"}>
                        <button
                            className="hover:bg-transparent border-none shadow-md hover:bg-slate-200 dark:hover:bg-neutral-700 bg-transparent text-black dark:text-white rounded-lg btn "
                            onClick={PDF}
                        >
                            <span className="hidden sm:inline ">Generar PDF</span>
                            <Image
                                src={iconos.imprimir}
                                alt="Imprimir"
                                className="w-5 h-5 md:w-6 md:h-6 block dark:hidden"
                            />
                            <Image
                                src={iconos.imprimir_w}
                                alt="Imprimir"
                                className="w-5 h-5 md:w-6 md:h-6 hidden dark:block"
                            />
                        </button>
                    </Tooltip>
                </div>
                {pdfPreview && pdfData && (
                    <div className="w-full">
                        <div className="pdf-preview">
                            <Worker
                                workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
                            >
                                <div className="" style={{ maxHeight: "calc(100vh - 4rem)" }}>
                                    <Viewer fileUrl={pdfData} />
                                </div>
                            </Worker>
                        </div>
                    </div>
                )}
            </div>
        </dialog>
    )
}

export default ModalVistaPreviaPBoletas