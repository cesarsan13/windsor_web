"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Acciones from "@/app/rep_femac_5/components/Acciones";
import Inputs from "@/app/rep_femac_5/components/Inputs";
import { calculaDigitoBvba } from "@/app/utils/globalfn";
import { useForm } from "react-hook-form";
import {
  getReportAltaBajaAlumno,
  Imprimir,
  ImprimirExcel,
} from "@/app/utils/api/rep_femac_5/rep_femac_5";
import ModalVistaPreviaRep5 from "./components/modalVistaPreviaRep5";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { showSwal } from "@/app/utils/alerts";
import "jspdf-autotable";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { ReportePDF } from "@/app/utils/ReportesPDF";

function AltasBajasAlumnos() {
  const router = useRouter();
  const { data: session, status } = useSession();
  let [fecha_ini, setFecha_ini] = useState("");
  let [fecha_fin, setFecha_fin] = useState("");
  let [alumnosFiltrados, setAlumnosFiltrados] = useState([]);
  const [selectedOption, setSelectedOption] = useState("nombre");
  const [selectedOptionAB, setSelectedOptionAB] = useState("alta");
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const [animateLoading, setAnimateLoading] = useState(false);

  const {
    formState: { errors },
  } = useForm({});
  const getPrimerDiaDelMes = () => {
    const fechaActual = new Date();
    return new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1)
      .toISOString()
      .split("T")[0];
  };

  const getUltimoDiaDelMes = () => {
    const fechaActual = new Date();
    return new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];
  };

  useEffect(() => {
    setFecha_ini(getPrimerDiaDelMes());
    setFecha_fin(getUltimoDiaDelMes());
  }, []);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const handleOptionChangeAB = (event) => {
    setSelectedOptionAB(event.target.value);
  };

  const fechaIniFormateada = fecha_ini ? fecha_ini.replace(/-/g, "/") : 0;
  const fechaFinFormateada = fecha_fin ? fecha_fin.replace(/-/g, "/") : 0;

  const formaImprime = async () => {
    const { token } = session.user;
    if (fechaIniFormateada) {
      if (!fechaFinFormateada) {
        fecha_fin = 0;
      }
      const data = await getReportAltaBajaAlumno(
        token,
        selectedOptionAB,
        selectedOption,
        fechaIniFormateada,
        fechaFinFormateada
      );
      return data;
    } else {
      showSwal(
        "Oppss!",
        "Para imprimir, mínimo debe estar seleccionada una fecha de 'Inicio'",
        "error"
      );
      return;
    }
  };

  const ImprimePDF = async () => {
    alumnosFiltrados = await formaImprime();
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Altas Bajas de Alumnos por Periodo",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: alumnosFiltrados,
    };
    Imprimir(configuracion, selectedOptionAB);
  };

  const ImprimeExcel = async () => {
    alumnosFiltrados = await formaImprime();
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Altas Bajas de Alumnos por Periodo",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: alumnosFiltrados,
      columns: [
        { header: "No.", dataKey: "numero" },
        { header: "Nombre", dataKey: "nombre_completo" },
        { header: "Dia", dataKey: "dia" },
        { header: "Mes", dataKey: "mes" },
        { header: "Año", dataKey: "año" },
      ],
      nombre: "Reporte Altas Bajas Alumnos por Periodo",
    };
    ImprimirExcel(configuracion);
  };

  const home = () => {
    router.push("/");
  };

  const handleVerClick = async () => {
    setAnimateLoading(true);
    cerrarModalVista();
    if (fecha_ini === "" || fecha_fin === "") {
      showSwal(
        "Oppss!",
        "Para imprimir, debes seleccionar un rango de fechas",
        "error"
      );
      setTimeout(() => {
        setPdfPreview(false);
        setPdfData("");
        setAnimateLoading(false);
        document.getElementById("modalVRep5").close();
      }, 500);
    } else {
      const alumnosFiltrados = await formaImprime();
      const configuracion = {
        Encabezado: {
          Nombre_Aplicacion: "Sistema de Control Escolar",
          Nombre_Reporte: "Reporte Altas Bajas de Alumnos por Periodo",
          Nombre_Usuario: `Usuario: ${session.user.name}`,
        },
        body: alumnosFiltrados,
      };

      const newPDF = new ReportePDF(configuracion);
      const { body } = configuracion;
      const Enca2 = (doc) => {
        if (!doc.tiene_encabezado) {
          doc.imprimeEncabezadoPrincipalV();
          doc.nextRow(12);
          doc.ImpPosX("No", 15, doc.tw_ren);
          doc.ImpPosX("Nombre", 35, doc.tw_ren);
          doc.ImpPosX("Dia", 150, doc.tw_ren);
          doc.ImpPosX("Mes", 160, doc.tw_ren);
          doc.ImpPosX("Año", 170, doc.tw_ren);
          doc.nextRow(4);
          doc.printLineV();
          doc.nextRow(4);
          doc.tiene_encabezado = true;
        } else {
          doc.nextRow(6);
          doc.tiene_encabezado = true;
        }
      };

      Enca2(newPDF);
      body.forEach((alumno) => {
        const nombre = `${alumno.a_nombre || ""} ${alumno.a_paterno || ""} ${
          alumno.a_materno || ""
        }`;
        const id = calculaDigitoBvba((alumno.numero || "").toString() || "");
        let fecha;
        fecha = new Date(alumno.fecha_nac);
        const diaFor = fecha.getDate().toString().padStart(2, "0");
        const mesFor = (fecha.getMonth() + 1).toString().padStart(2, "0");
        const añoFor = fecha.getFullYear().toString();
        newPDF.ImpPosX(`${alumno.numero}-${id}`, 15, newPDF.tw_ren);
        newPDF.ImpPosX(nombre, 35, newPDF.tw_ren);
        newPDF.ImpPosX(diaFor, 150, newPDF.tw_ren);
        newPDF.ImpPosX(mesFor, 160, newPDF.tw_ren);
        newPDF.ImpPosX(añoFor, 170, newPDF.tw_ren);
        Enca2(newPDF);
        if (newPDF.tw_ren >= newPDF.tw_endRen) {
          newPDF.pageBreak();
          Enca2(newPDF);
        }
      });
      setTimeout(() => {
        const pdfData = newPDF.doc.output("datauristring");
        setPdfData(pdfData);
        setPdfPreview(true);
        showModalVista(true);
        setAnimateLoading(false);
      }, 500);
    }
  };

  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVRep5").showModal()
      : document.getElementById("modalVRep5").close();
  };
  const cerrarModalVista = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVRep5").close();
  };
  if (status === "loading") {
    return (
      <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  return (
    <>
      <ModalVistaPreviaRep5
        pdfPreview={pdfPreview}
        pdfData={pdfData}
        PDF={ImprimePDF}
        Excel={ImprimeExcel}
      />
      <div className="flex flex-col justify-start items-start bg-slate-100 shadow-xl rounded-xl dark:bg-slate-700 h-full max-[420px]:w-full w-11/12">
        <div className="w-full py-3">
          {/* Fila de la cabecera de la pagina */}
          <div className="flex flex-col justify-start p-3 max-[600px]:p-0">
            <div className="flex flex-wrap items-start md:items-center mx-auto">
              <div className="order-2 md:order-1 flex justify-between w-full md:w-auto mb-0">
                <Acciones home={home} Ver={handleVerClick} isLoading={animateLoading}/>
              </div>
              <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 mx-5">
                Altas y Bajas de Alumnos
              </h1>
            </div>
          </div>
        </div>
        <div className="w-full py-3 flex flex-col gap-y-4">
          {/* Fila del formulario de la pagina */}
          <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 min-[1920px]:w-1/4 w-1/2 mx-auto ">
            <div className="flex flex-row max-[499px]:gap-1 gap-4">
              <Inputs
                name={"fecha_ini"}
                tamañolabel={""}
                Titulo={"Fecha Inicial: "}
                type={"date"}
                errors={errors}
                maxLength={15}
                isDisabled={false}
                value={fecha_ini}
                setValue={setFecha_ini}
                onChange={(e) => setFecha_ini(e.target.value)}
                conteClassName="lg:w-fit md:w-fit"
                labelClassName="input input-bordered input-md text-black dark:text-white flex items-center max-[430px]:gap-1 gap-3 w-auto lg:w-fit md:w-full"
                inputClassName="rounded block grow text-black max-[500px]:w-[100px] w-auto dark:text-white border-b-2 border-slate-300 dark:border-slate-700"
              />
              <Inputs
                name={"fecha_fin"}
                tamañolabel={""}
                Titulo={"Fecha Final: "}
                type={"date"}
                errors={errors}
                maxLength={15}
                isDisabled={false}
                value={fecha_fin}
                setValue={setFecha_fin}
                onChange={(e) => setFecha_fin(e.target.value)}
                conteClassName="lg:w-fit md:w-fit"
                labelClassName="input input-bordered input-md text-black dark:text-white flex items-center max-[430px]:gap-1 gap-3 w-auto lg:w-fit md:w-full"
                inputClassName="rounded block grow text-black max-[500px]:w-[100px] w-auto dark:text-white border-b-2 border-slate-300 dark:border-slate-700"
              />
            </div>
          </div>
          <div className="flex flex-row">
            <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 min-[1920px]:w-1/4 w-1/2 mx-auto ">
              <div className="flex space-x-4">
                <label className="text-black dark:text-white max-[499px]:flex-col flex flex-row gap-3 md:flex-row">
                  <div className="flex  flex-row">
                    <span className="text-black dark:text-white">
                      Ordenar por:
                    </span>
                  </div>
                  <div className="flex flex-row  max-[499px]:space-x-4 space-x-4">
                    <label className="flex items-center gap-3">
                      <span className="text-black dark:text-white">Nombre</span>
                      <input
                        type="radio"
                        name="ordenar"
                        value="nombre"
                        onChange={handleOptionChange}
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
                        onChange={handleOptionChange}
                        checked={selectedOption === "numero"}
                        className="radio checked:bg-blue-500"
                      />
                    </label>
                    <label className="flex items-center gap-3">
                      <span className="text-black dark:text-white">
                        Fecha Nacimiento
                      </span>
                      <input
                        type="radio"
                        name="ordenar"
                        value="fecha_nac"
                        onChange={handleOptionChange}
                        checked={selectedOption === "fecha_nac"}
                        className="radio checked:bg-blue-500"
                      />
                    </label>
                  </div>
                </label>
              </div>
            </div>
          </div>
          <div className="flex flex-row">
            <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 min-[1920px]:w-1/4 w-1/2 mx-auto ">
              <div className="flex space-x-4">
                <label
                  className={` input-md text-black dark:text-white flex flex-row items-center gap-3 pl-0`}
                >
                  <label
                    className={` input-md text-black dark:text-white flex items-center gap-3 pl-0`}
                  >
                    <span className="text-black dark:text-white">Altas</span>
                    <input
                      type="radio"
                      name="ordenarAB"
                      value="alta"
                      onChange={handleOptionChangeAB}
                      checked={selectedOptionAB === "alta"}
                      className="radio checked:bg-blue-500"
                    />
                  </label>
                  <label
                    className={` input-md text-black dark:text-white flex items-center gap-3`}
                  >
                    <span className="text-black dark:text-white">Bajas</span>
                    <input
                      type="radio"
                      name="ordenarAB"
                      value="bajas"
                      onChange={handleOptionChangeAB}
                      checked={selectedOptionAB === "bajas"}
                      className="radio checked:bg-blue-500"
                    />
                  </label>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AltasBajasAlumnos;
