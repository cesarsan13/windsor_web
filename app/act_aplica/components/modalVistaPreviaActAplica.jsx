import Tooltip from '@/app/components/tooltip';
import iconos from '@/app/utils/iconos';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import Image from 'next/image';
import React from 'react'

function ModalVistaPreviaActAplica({ pdfPreview, pdfData, PDF,Excel }) {
    return (
        <dialog id="modalVPActAplica" className="modal">
            <div className='modal-box w-full max-w-4xl h-full'>
                <button
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 dark:text-white text-black"
                    onClick={(evt) => {
                        evt.preventDefault();
                        document.getElementById("modalVPActAplica").close();
                    }}
                >
                    ✕
                </button>
                <h3 className="font-bold text-lg mb-5 dark:text-white text-black">
                    Vista Previa Cobranza Diaria
                </h3>
                <div className="flex flex-row space-x-4">
                    <Tooltip Titulo={"Imprimir PDF"} posicion={"tooltip-top"}>
                        <button
                            className="hover:bg-transparent border-none shadow-md hover:bg-slate-200 dark:hover:bg-neutral-700 bg-transparent text-black dark:text-white rounded-lg btn "
                            onClick={PDF}
                        >
                            <span className="hidden sm:inline ">Generar PDF</span>
                            <Image src={iconos.imprimir} alt="Imprimir" className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                    </Tooltip>
                    <Tooltip Titulo={"Imprimir Excel"} posicion={"tooltip-top"}>
                        <button
                            className="hover:bg-transparent border-none shadow-md hover:bg-slate-200 dark:hover:bg-neutral-700 bg-transparent text-black dark:text-white rounded-lg btn "
                            onClick={Excel}
                        >
                            <span className="hidden sm:inline ">Generar Excel</span>
                            <Image src={iconos.excel} alt="Imprimir" className="w-5 h-5 md:w-6 md:h-6" />
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

export default ModalVistaPreviaActAplica
