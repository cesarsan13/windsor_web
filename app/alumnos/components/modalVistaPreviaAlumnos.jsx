"use client";

import Button from "@/app/components/button";
import Tooltip from "@/app/components/tooltip";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import iconos from "@/app/utils/iconos";

function ModalVistaPreviaAlumnos({ pdfPreview, pdfData, PDF, Excel }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Determinar si el modal debe abrirse
    const isEmptyDataPDF =
      Object.keys(pdfData || {}).length === 0 &&
      (pdfData || {}).constructor === Object;
    setIsModalOpen(pdfPreview && !isEmptyDataPDF);
  }, [pdfPreview, pdfData]);

  // if (!isModalOpen) return; // No renderizar nada si el modal no debe abrirse

  return (
    <dialog id="modalVPAlumno" className="modal">
      <div className="modal-box w-full max-w-4xl h-full">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 dark:text-white text-black"
          onClick={() => document.getElementById("modalVPAlumno").close()}
        >
          ✕
        </button>
        <h3 className="font-bold text-lg mb-5 dark:text-white text-black">
          Vista Previa Alumnos
        </h3>
        <div className="flex flex-row space-x-4">
          <Tooltip Titulo={"Imprimir PDF"} posicion={"tooltip-top"}>
            <button
              className="hover:bg-transparent border-none shadow-md hover:bg-slate-200 dark:hover:bg-neutral-700 bg-transparent text-black dark:text-white rounded-lg btn"
              onClick={PDF}
            >
              <span className="hidden sm:inline">Generar PDF</span>
              <Image src={iconos.imprimir} alt="Imprimir" />
            </button>
          </Tooltip>
          <Tooltip Titulo={"Imprimir Excel"} posicion={"tooltip-top"}>
            <button
              className="hover:bg-transparent border-none shadow-md hover:bg-slate-200 dark:hover:bg-neutral-700 bg-transparent text-black dark:text-white rounded-lg btn"
              onClick={Excel}
            >
              <span className="hidden sm:inline">Generar Excel</span>
              <Image src={iconos.excel} alt="Excel" />
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

export default ModalVistaPreviaAlumnos;
