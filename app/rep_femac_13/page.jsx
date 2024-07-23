"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { showSwal, confirmSwal } from "../utils/alerts";
import Busqueda from "@/app/rep_femac_13/components/Busqueda";
import Acciones from "@/app/rep_femac_13/components/Acciones";
import { useForm } from "react-hook-form";

import { useSession } from "next-auth/react";
import "jspdf-autotable";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { ReportePDF } from "@/app/utils/ReportesPDF";

function Rep_Femac_13() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [TB_Busqueda, setTB_Busqueda] = useState("");
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const [filtros, setFiltros] = useState({
    fecha: "",
    horario: "",
    horario2: 2,
    orden: "",
  });
  const handleClickVer = () => {
    console.log(filtros);
  };
  if (status === "loading") {
    return (
      <div className="container skeleton w-full max-w-screen-xl shadow-xl rounded-xl"></div>
    );
  }

  return (
    <>
      <div className="container w-full max-w-screen-xl bg-slate-100 shadow-xl rounded-xl px-3">
        <div className="flex justify-start p-3">
          <h1 className="text-4xl font-xthin text-black md:px-12">
            Reporte de Alumnos por clase semanal.
          </h1>
        </div>
        <div className="container grid grid-cols-8 grid-rows-1 h-[calc(100%-20%)]">
          <div className="col-span-1 flex flex-col">
            <Acciones Ver={handleClickVer} />
          </div>
          <div className="col-span-7">
            <div className="flex flex-col h-[calc(100%)]">
              <Busqueda filtros={filtros} setFiltro={setFiltros} />
              {pdfPreview && pdfData && (
                <div className="pdf-preview">
                  <Worker
                    workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
                  >
                    <div style={{ height: "600px" }}>
                      <Viewer fileUrl={pdfData} />
                    </div>
                  </Worker>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Rep_Femac_13;
