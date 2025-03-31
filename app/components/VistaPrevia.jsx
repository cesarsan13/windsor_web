import React, { useState } from "react";
import Tooltip from "@/app/components/tooltip";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import Image from "next/image";
import iconos from "@/app/utils/iconos";
import "@react-pdf-viewer/core/lib/styles/index.css";

function VistaPrevia({
  id,
  titulo,
  pdfPreview,
  pdfData,
  excelPreviewData = [],
  PDF,
  Excel,
  CerrarView,
  seeExcel = true,
  seePDF = true,
}) {
  const [modoVista, setModoVista] = useState(`${seePDF ? "pdf" : "excel"}`);

  return (
    <dialog id={id} className="modal">
      <div className="modal-box w-full max-w-6xl h-full bg-base-200 overflow-y-auto">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 dark:text-white text-black"
          onClick={(evt) => CerrarView(evt)}
        >
          ✕
        </button>
        <h3 className="font-bold text-lg mb-5 dark:text-white text-black">
          {titulo}
        </h3>
        <div className="flex flex-row justify-between mb-4 items-center flex-wrap gap-2">
          <div className="flex flex-row gap-2">
            {excelPreviewData.length > 0 && (
              <>
                <Tooltip Titulo={"Ver PDF"} posicion={"tooltip-top"}>
                  <div className={`${seePDF ? "" : "hidden"}`}>
                    <button
                      className={`btn ${
                        modoVista === "pdf" ? "btn-outline" : "btn-ghost"
                      }`}
                      onClick={() => setModoVista("pdf")}
                    >
                      <Image
                        src={iconos.imprimir}
                        alt="PDF"
                        className="w-5 h-5 md:w-6 md:h-6 block dark:hidden"
                      />
                      <Image
                        src={iconos.imprimir_w}
                        alt="PDF"
                        className="w-5 h-5 md:w-6 md:h-6 hidden dark:block"
                      />
                      <span className="hidden sm:inline ml-2">Ver PDF</span>
                    </button>
                  </div>
                </Tooltip>
                <Tooltip Titulo={"Ver Excel"} posicion={"tooltip-top"}>
                  <div className={`${seeExcel ? "" : "hidden"}`}>
                    <button
                      className={`btn ${
                        modoVista === "excel" ? "btn-outline" : "btn-ghost"
                      }`}
                      onClick={() => setModoVista("excel")}
                    >
                      <Image
                        src={iconos.excel}
                        alt="Excel"
                        className="w-5 h-5 md:w-6 md:h-6 block dark:hidden"
                      />
                      <Image
                        src={iconos.excel_w}
                        alt="Excel"
                        className="w-5 h-5 md:w-6 md:h-6 hidden dark:block"
                      />
                      <span className="hidden sm:inline ml-2">Ver Excel</span>
                    </button>
                  </div>
                </Tooltip>
              </>
            )}
          </div>
          <div className="flex flex-row gap-2">
            <Tooltip Titulo={"Generar PDF"} posicion={"tooltip-top"}>
              <div className={`${seePDF ? "" : "hidden"}`}>
                <button
                  className="btn bg-transparent text-black dark:text-white hover:bg-slate-200 dark:hover:bg-neutral-700 border-none shadow-md"
                  onClick={PDF}
                >
                  <Image
                    src={iconos.imprimir}
                    alt="PDF"
                    className="w-5 h-5 md:w-6 md:h-6 block dark:hidden"
                  />
                  <Image
                    src={iconos.imprimir_w}
                    alt="PDF"
                    className="w-5 h-5 md:w-6 md:h-6 hidden dark:block"
                  />
                  <span className="hidden sm:inline ml-2">Generar PDF</span>
                </button>
              </div>
            </Tooltip>

            <Tooltip Titulo={"Generar Excel"} posicion={"tooltip-top"}>
              <div className={`${seeExcel ? "" : "hidden"}`}>
                <button
                  className="btn bg-transparent text-black dark:text-white hover:bg-slate-200 dark:hover:bg-neutral-700 border-none shadow-md"
                  onClick={Excel}
                >
                  <Image
                    src={iconos.excel}
                    alt="Excel"
                    className="w-5 h-5 md:w-6 md:h-6 block dark:hidden"
                  />
                  <Image
                    src={iconos.excel_w}
                    alt="Excel"
                    className="w-5 h-5 md:w-6 md:h-6 hidden dark:block"
                  />
                  <span className="hidden sm:inline ml-2">Generar Excel</span>
                </button>
              </div>
            </Tooltip>
          </div>
        </div>

        {modoVista === "pdf" && pdfPreview && pdfData && (
          <div className="w-full bg-base-200">
            <Worker
              workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
            >
              <div style={{ maxHeight: "calc(100vh - 4rem)" }}>
                <Viewer fileUrl={pdfData} />
              </div>
            </Worker>
          </div>
        )}

        {modoVista === "excel" && excelPreviewData.length > 0 && (
          <div className="w-full bg-base-200">
            <Worker
              workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
            >
              <div style={{ maxHeight: "calc(100vh - 4rem)" }}>
                <Viewer fileUrl={excelPreviewData} />
              </div>
            </Worker>
          </div>
        )}
      </div>
    </dialog>
  );
}

export default VistaPrevia;
