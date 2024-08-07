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

  const alumno1V = alumnos1 === undefined ? 0 : alumnos1.id;
  const alumno2V = alumnos2 === undefined ? 0 : alumnos2.id;

  useEffect(() => {
    if (status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {
      const { token } = session.user;
      console.log(alumno1V, alumno2V);
      const data = await getreportAlumn(
        token,
        bajas,
        selectedOption,
        alumno1V,
        alumno2V
      );
      setAlumnosFiltrados(data);
      console.log(alumnosFiltrados);
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
        { header: "No", dataKey: "id" },
        { header: "Nombre", dataKey: "nombre_completo" },
        { header: "Estatus", dataKey: "estatus" },
        { header: "Fecha", dataKey: "fecha_nac" },
        { header: "Horario", dataKey: "horario_1_nombre" },
        { header: "Telefono", dataKey: "telefono_1" },
      ],
      nombre: "Relación General de Alumnos",
    };
    ImprimirExcel(configuracion);
  };

  const home = () => {
    router.push("/");
  };

  const handleVerClick = async () => {
    if (alumnos1.id === undefined) {
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
          doc.ImpPosX("No", 15, doc.tw_ren);
          doc.ImpPosX("Nombre", 25, doc.tw_ren);
          doc.ImpPosX("Estatus", 105, doc.tw_ren);
          doc.ImpPosX("Fecha", 125, doc.tw_ren);
          doc.ImpPosX("Horario", 150, doc.tw_ren);
          doc.ImpPosX("Teléfono", 175, doc.tw_ren);
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
        const id = calculaDigitoBvba((alumno.id || "").toString() || "");
        const nombre = `${alumno.a_nombre || ""} ${alumno.a_paterno || ""} ${
          alumno.a_materno || ""
        }`.substring(0, 50);
        const estatus = (alumno.estatus || "").toString().substring(0, 12);
        const fecha_nac = (alumno.fecha_nac || "").toString().substring(0, 15);
        const horario_1_nombre = (alumno.horario_1_nombre || "")
          .toString()
          .substring(0, 15);
        const telefono = (alumno.telefono_1 || "").toString().substring(0, 15);
        newPDF.ImpPosX(`${alumno.id}-${id}`, 15, newPDF.tw_ren);
        newPDF.ImpPosX(nombre, 25, newPDF.tw_ren);
        newPDF.ImpPosX(estatus, 105, newPDF.tw_ren);
        newPDF.ImpPosX(fecha_nac, 125, newPDF.tw_ren);
        newPDF.ImpPosX(horario_1_nombre, 150, newPDF.tw_ren);
        newPDF.ImpPosX(telefono, 175, newPDF.tw_ren);
        if (alumno.baja === "*") {
          newPDF.tw_ren += 5;
          const fecha_baja = (alumno.fecha_baja || "")
            .toString()
            .substring(0, 15);
          newPDF.ImpPosX(`Fecha de Baja: ${fecha_baja}`, 5, newPDF.tw_ren);
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
      <div className="container w-full max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3">
        <div className="flex justify-start p-3">
          <h1 className="text-4xl font-xthin text-black dark:text-white md:px-12">
            Relación General de Alumnos
          </h1>
        </div>
        <div className="container grid grid-cols-8 grid-rows-1 h-[calc(100%-20%)]">
          <div className="col-span-1 flex flex-col">
            <Acciones home={home} Ver={handleVerClick} />
          </div>
          <div className="col-span-7">
            <div className="flex flex-col h-full space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-full max-w-sm p-4 border dark:border-gray-300 border-black rounded-lg">
                  <h2 className="text-lg font-bold mb-4 dark:text-white text-black">
                    Ordenado por...
                  </h2>
                  <div className="flex flex-col space-y-2">
                    <label className="flex items-center space-x-2 dark:text-white text-black">
                      <input
                        type="radio"
                        name="options"
                        value="nombre"
                        checked={selectedOption === "nombre"}
                        onChange={handleCheckChange}
                        className="form-radio"
                      />
                      <span>Nombre</span>
                    </label>
                    <label className="flex items-center space-x-2 dark:text-white text-black">
                      <input
                        type="radio"
                        name="options"
                        value="id"
                        checked={selectedOption === "id"}
                        onChange={handleCheckChange}
                        className="form-radio"
                      />
                      <span>Número</span>
                    </label>
                  </div>
                </div>

                <div className="tooltip" data-tip="Ver Bajas">
                  <label
                    htmlFor="ch_bajas"
                    className="label cursor-pointer flex items-center space-x-2"
                  >
                    <input
                      id="ch_bajas"
                      type="checkbox"
                      className="checkbox checkbox-md"
                      onClick={(evt) => setBajas(evt.target.checked)}
                    />
                    <span className="label-text font-bold hidden sm:block text-neutral-600 dark:text-neutral-200">
                      Incluir bajas
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                  <BuscarCat
                    table="alumnos"
                    fieldsToShow={["id", "nombre_completo"]}
                    nameInput={["id", "nombre_completo"]}
                    titulo={"Inicio: "}
                    setItem={setAlumnos1}
                    token={session.user.token}
                    modalId="modal_alumnos1"
                  />
                  <BuscarCat
                    table="alumnos"
                    fieldsToShow={["id", "nombre_completo"]}
                    nameInput={["id", "nombre_completo"]}
                    titulo={"Fin: "}
                    setItem={setAlumnos2}
                    token={session.user.token}
                    modalId="modal_alumnos2"
                  />
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
