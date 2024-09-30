"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Acciones from "@/app/rep_femac_1/components/Acciones";

import {
  ImprimirPDF,
  ImprimirExcel,
} from "@/app/utils/api/rep_femac_1/rep_femac_1";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import BuscarCat from "@/app/components/BuscarCat";
import { getreportAlumn } from "@/app/utils/api/rep_femac_1/rep_femac_1";
import { showSwal } from "@/app/utils/alerts";
import "jspdf-autotable";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import { calculaDigitoBvba } from "@/app/utils/globalfn";
import ModalVistaPreviaRelacionGeneralAlumnos from "./components/ModalVistaPreviaRelacionGeneralAlumnos";

function AlumnosPorClase() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [alumnos1, setAlumnos1] = useState({});
  const [alumnos2, setAlumnos2] = useState({});
  const [alumnosFiltrados, setAlumnosFiltrados] = useState([]);
  const [bajas, setBajas] = useState(false);
  const [selectedOption, setSelectedOption] = useState("nombre");
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");

  const handleCheckChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const alumno1V = alumnos1 === undefined ? 0 : alumnos1.numero;
  const alumno2V = alumnos2 === undefined ? 0 : alumnos2.numero;

  useEffect(() => {
    if (status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {
      const { token } = session.user;
      const data = await getreportAlumn(
        token,
        bajas,
        selectedOption,
        alumno1V,
        alumno2V
      );
      setAlumnosFiltrados(data);
    };
    fetchData();
  }, [session, status, bajas, selectedOption, alumno1V, alumno2V]);

  const ImprimePDF = async () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Relación General de Alumnos",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: alumnosFiltrados,
    };
    ImprimirPDF(configuracion);
  };

  const ImprimeExcel = async () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Relación General de Alumnos",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: alumnosFiltrados,
      columns: [
        { header: "No", dataKey: "numero" },
        { header: "Nombre", dataKey: "nombre_completo" },
        { header: "Estatus", dataKey: "estatus" },
        { header: "Fecha", dataKey: "fecha_nac" },
        { header: "Horario", dataKey: "horario_1_nombre" },
        { header: "Telefono", dataKey: "telefono1" },
      ],
      nombre: "Relación General de Alumnos",
    };
    ImprimirExcel(configuracion);
  };

  const home = () => {
    router.push("/");
  };

  const handleVerClick = async () => {
    if (alumnos1.numero === undefined) {
      showSwal(
        "Oppss!",
        "Para imprimir, mínimo debe estar seleccionado un Alumno de 'Inicio'",
        "error"
      );
    } else {
      const configuracion = {
        Encabezado: {
          Nombre_Aplicacion: "Sistema de Control Escolar",
          Nombre_Reporte: "Reporte Relación General de Alumnos",
          Nombre_Usuario: `Usuario: ${session.user.name}`,
        },
        body: alumnosFiltrados,
      };

      const newPDF = new ReportePDF(configuracion, "Portrait");
      const { body } = configuracion;
      const Enca1 = (doc) => {
        if (!doc.tiene_encabezado) {
          doc.imprimeEncabezadoPrincipalV();
          doc.nextRow(12);
          doc.ImpPosX("No", 15, doc.tw_ren, 0, "L");
          doc.ImpPosX("Nombre", 25, doc.tw_ren, 0, "L");
          doc.ImpPosX("Estatus", 110, doc.tw_ren, 0, "L");
          doc.ImpPosX("Fecha", 125, doc.tw_ren, 0, "L");
          doc.ImpPosX("Horario", 147, doc.tw_ren, 0, "L");
          doc.ImpPosX("Teléfono", 178, doc.tw_ren, 0, "L");
          doc.nextRow(4);
          doc.printLineV();
          doc.nextRow(4);
          doc.tiene_encabezado = true;
        } else {
          doc.nextRow(6);
          doc.tiene_encabezado = true;
        }
      };

      Enca1(newPDF);
      body.forEach((alumno) => {
        const numero = calculaDigitoBvba((alumno.numero || "").toString() || "");
        const nombre = `${alumno.a_nombre || ""} ${alumno.a_paterno || ""} ${alumno.a_materno || ""
          }`.substring(0, 50);
        const estatus = (alumno.estatus || "").toString().substring(0, 12);
        const fecha_nac = (alumno.fecha_nac || "").toString().substring(0, 15);
        const horario_1_nombre = (alumno.horario_1_nombre || "")
          .toString()
          .substring(0, 15);
        const telefono = (alumno.telefono1 || "").toString().substring(0, 15);
        newPDF.ImpPosX(`${alumno.numero}-${numero}`, 23, newPDF.tw_ren, 0, "R");
        newPDF.ImpPosX(nombre, 25, newPDF.tw_ren, 0, "L");
        newPDF.ImpPosX(estatus, 110, newPDF.tw_ren, 0, "L");
        newPDF.ImpPosX(fecha_nac, 125, newPDF.tw_ren, 0, "L");
        newPDF.ImpPosX(horario_1_nombre, 147, newPDF.tw_ren, 0, "L");
        newPDF.ImpPosX(telefono, 200, newPDF.tw_ren, 0, "R");
        if (alumno.baja === "*") {
          newPDF.tw_ren += 5;
          const fecha_baja = (alumno.fecha_baja || "")
            .toString()
            .substring(0, 15);
          newPDF.ImpPosX(`Fecha de Baja: ${fecha_baja}`, 25, newPDF.tw_ren, 0, "L");
        }
        Enca1(newPDF);
        if (newPDF.tw_ren >= newPDF.tw_endRen) {
          newPDF.pageBreak();
          Enca1(newPDF);
        }
      });
      const pdfData = newPDF.doc.output("datauristring");
      setPdfData(pdfData);
      setPdfPreview(true);
      showModalVista(true);
    }
  };

  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVPRelacionGeneralAlumnos").showModal()
      : document.getElementById("modalVPRelacionGeneralAlumnos").close();
  };

  if (status === "loading") {
    return (
      <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  return (
    <>
      <ModalVistaPreviaRelacionGeneralAlumnos
        pdfPreview={pdfPreview}
        pdfData={pdfData}
        PDF={ImprimePDF}
        Excel={ImprimeExcel}
      />
      <div className="container h-[80vh] w-full max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden">
        <div className="flex flex-col justify-start p-3">
          <div className="flex flex-wrap md:flex-nowrap items-start md:items-center">
            <div className="order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0">
              <Acciones
                home={home}
                Ver={handleVerClick}
              />
            </div>
            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around w-auto">
              Relación General de Alumnos
            </h1>
          </div>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-8 md:grid-rows-1 h-full">
          <div className="col-span-7">
            <div className="flex flex-col h-full space-y-4">
              <BuscarCat
                table="alumnos"
                fieldsToShow={["numero", "nombre_completo"]}
                nameInput={["numero", "nombre_completo"]}
                titulo={"Inicio: "}
                setItem={setAlumnos1}
                token={session.user.token}
                modalId="modal_alumnos1"
                alignRight={true}
                inputWidths={{ first: "100px", second: "300px" }}
              />
              <BuscarCat
                table="alumnos"
                fieldsToShow={["numero", "nombre_completo"]}
                nameInput={["numero", "nombre_completo"]}
                titulo={"Fin:"}
                setItem={setAlumnos2}
                token={session.user.token}
                modalId="modal_alumnos2"
                alignRight={true}
                inputWidths={{ first: "100px", second: "300px" }}

              />
              <div className="col-8 flex flex-col">
                <div className="flex space-x-4">
                  <label className="text-black dark:text-white flex flex-col md:flex-row space-x-4">
                    <span className="text-black dark:text-white flex items-center gap-3">Ordenar por:</span>
                    <label className="flex items-center gap-3">
                      <span className="text-black dark:text-white">Nombre</span>
                      <input
                        type="radio"
                        name="ordenar"
                        value="nombre"
                        onChange={handleCheckChange}
                        checked={selectedOption === "nombre"}
                        className="radio checked:bg-blue-500"
                      />
                    </label>
                    <label className="flex items-center gap-3">
                      <span className="text-black dark:text-white">Número</span>
                      <input
                        type="radio"
                        name="ordenar"
                        value="numero"
                        onChange={handleCheckChange}
                        checked={selectedOption === "numero"}
                        className="radio checked:bg-blue-500"
                      />
                    </label>
                  </label>
                  <div className="tooltip" data-tip="Ver Bajas">
                    <label
                      htmlFor="ch_bajas"
                      className="label cursor-pointer flex items-center space-x-2">
                      <input
                        id="ch_bajas"
                        type="checkbox"
                        className="checkbox checkbox-md"
                        onClick={(evt) => setBajas(evt.target.checked)} />
                      <span className="label-text font-bold hidden sm:block text-neutral-600 dark:text-neutral-200">
                        Incluir bajas
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AlumnosPorClase;
