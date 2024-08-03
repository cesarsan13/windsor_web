import Tooltip from '@/app/components/tooltip';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import React, { useEffect, useState } from 'react'

function modalVistaPreviaRepFlujo01({ pdfPreview, pdfData, PDF, Excel }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // Determinar si el modal debe abrirse
        const isEmptyDataPDF = Object.keys(pdfData || {}).length === 0 && (pdfData || {}).constructor === Object;
        setIsModalOpen(pdfPreview && !isEmptyDataPDF);
    }, [pdfPreview, pdfData]);
    return (
        <dialog className='modal' id='modalVPRepFlujo01'>
            <div className='modal-box w-full max-w-4xl h-full'>
                <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2 dark:text-white text-black'
                    onClick={() => document.getElementById("modalVPRepFlujo01").close()}
                >
                    ✕
                </button>
                <h3 className='font-bold text-lg mb-5 dark:text-white text-black'>Vista Previa Adeudos Pendientes</h3>
                <div className="flex flex-row space-x-4">
                    <Tooltip Titulo={"Imprimir PDF"} posicion={"tooltip-top"}>
                        <button
                            className="hover:bg-transparent border-none shadow-md hover:bg-slate-200 dark:hover:bg-neutral-700 bg-transparent text-black dark:text-white rounded-lg btn"
                            onClick={PDF}
                        >
                            Imprimir PDF<i className="fa-solid fa-file-pdf"></i>
                        </button>
                    </Tooltip>
                    <Tooltip Titulo={"Imprimir Excel"} posicion={"tooltip-top"}>
                        <button
                            className="hover:bg-transparent border-none shadow-md hover:bg-slate-200 dark:hover:bg-neutral-700 bg-transparent text-black dark:text-white rounded-lg btn"
                            onClick={Excel}
                        >
                            Imprimir Excel<i className="fa-solid fa-file-excel"></i>
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

export default modalVistaPreviaRepFlujo01
