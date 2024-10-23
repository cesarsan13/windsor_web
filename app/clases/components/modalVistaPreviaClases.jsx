import Tooltip from "@/app/components/tooltip";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import React, { useEffect, useState } from "react";
import "@react-pdf-viewer/core/lib/styles/index.css";
import Image from "next/image";
import iconos from "@/app/utils/iconos";

function ModalVistaPreviaClases({ pdfPreview, pdfData, PDF, Excel }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const isEmptyDataPDF =
      Object.keys(pdfData || {}).length === 0 &&
      (pdfData || {}).constructor === Object;
    setIsModalOpen(pdfPreview && !isEmptyDataPDF);
  }, [pdfPreview, pdfData]);  //
  return (
    <dialog id="modalVPClase" className="modal">
      <div className="modal-box w-full max-w-4xl h-full">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 dark:text-white text-black"
          onClick={() => document.getElementById("modalVPClase").close()}
        >
          ✕
        </button>
        <h3 className="font-bold text-lg mb-5 dark:text-white text-black">
          Vista Previa Clases
        </h3>
        <div className="flex flex-row space-x-4">
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
              <Image src={iconos.excel} alt="Excel" className="w-5 h-5 md:w-6 md:h-6"/>
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
  );
}

export default ModalVistaPreviaClases;
