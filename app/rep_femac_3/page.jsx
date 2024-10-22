"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Acciones from "@/app/rep_femac_3/components/Acciones";
import ModalVistaPreviaRepFemac3 from "./components/modalVistaPreviaRepFemac3";
import {
  getAlumnosPorMes,
  Imprimir,
  ImprimirExcel,
} from "@/app/utils/api/rep_femac_3/rep_femac_3";
import { useSession } from "next-auth/react";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import "jspdf-autotable";
import BuscarCat from "../components/BuscarCat";
import { showSwal } from "@/app/utils/alerts";
import { animator } from "chart.js";

function Rep_Femac_3() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sOrdenar, ssetordenar] = useState("nombre");
  const [FormaRepDosSel, setFormaRepDosSel] = useState([]);
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [animateLoading, setAnimateLoading] = useState(false);
  const [horario, setHorario] = useState({});
  const [token, setToken] = useState("");

  useEffect(() => {
    if (status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {
      setisLoading(true);
      const { token } = session.user;
      setToken(token);
      const data = await getAlumnosPorMes(token, horario, sOrdenar);
      setFormaRepDosSel(data.data);
      setisLoading(false);
    };
    fetchData();
  }, [session, status, horario, sOrdenar]);

  const home = () => {
    router.push("/");
  };

  const ImprimePDF = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Alumnos por clase mensual",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: FormaRepDosSel,
    };
    Imprimir(configuracion);
  };

  const ImprimeExcel = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Alumnos por clase mensual",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: FormaRepDosSel,
      columns: [
        { header: "No.", dataKey: "Num_Renglon" },
        { header: "No. 1", dataKey: "Numero_1" },
        { header: "Nombre", dataKey: "Nombre_1" },
        { header: "Año", dataKey: "Año_Nac_1" },
        { header: "Mes", dataKey: "Mes_Nac_1" },
      ],
      nombre: "ReportePorMes",
    };
    ImprimirExcel(configuracion);
  };

  const handleCheckChange = (event) => {
    ssetordenar(event.target.value);
  };

  const handleVerClick = () => {
    setAnimateLoading(true);
    cerrarModalVista();
    if (horario.numero === undefined) {
      showSwal(
        "Oppss!",
        "Para imprimir, debes seleccionar el horario",
        "error"
      );
      setTimeout(() => {
        setPdfPreview(false);
        setPdfData("");
        setAnimateLoading(false);
        document.getElementById("modalVPRepFemac3").close();
      }, 500);
    } else {
      const configuracion = {
        Encabezado: {
          Nombre_Aplicacion: "Lista de Alumnos por clase mensual",
          Nombre_Reporte: "Reporte de Alumnos",
          Nombre_Usuario: `Usuario: ${session.user.name}`,
        },
        body: FormaRepDosSel,
      };

      const reporte = new ReportePDF(configuracion, "Portrait");
      const { body } = configuracion;
      const Enca1 = (doc) => {
        if (!doc.tiene_encabezado) {
          doc.imprimeEncabezadoPrincipalV();
          doc.nextRow(12);
          doc.ImpPosX("No.", 15, doc.tw_ren, 0, "R"),
            doc.ImpPosX("No. 1", 25, doc.tw_ren, 0, "R"),
            doc.ImpPosX("Nombre", 35, doc.tw_ren, 0, "L"),
            doc.ImpPosX("Año", 130, doc.tw_ren, 0, "R"),
            doc.ImpPosX("Mes", 140, doc.tw_ren, 0, "R"),
            doc.nextRow(4);
          doc.printLineV();
          doc.nextRow(4);
          doc.tiene_encabezado = true;
        } else {
          doc.nextRow(6);
          doc.tiene_encabezado = true;
        }
      };

      Enca1(reporte);

      body.forEach((reporte1) => {
        reporte.ImpPosX(
          reporte1.Num_Renglon.toString() !== "0"
            ? reporte1.Num_Renglon.toString()
            : "",
          15,
          reporte.tw_ren,
          0,
          "R"
        );
        reporte.ImpPosX(
          reporte1.Numero_1.toString() !== "0"
            ? reporte1.Numero_1.toString()
            : "",
          25,
          reporte.tw_ren,
          0,
          "R"
        );
        reporte.ImpPosX(
          reporte1.Nombre_1.toString() !== "0"
            ? reporte1.Nombre_1.toString()
            : "",
          35,
          reporte.tw_ren,
          0,
          "L"
        );
        reporte.ImpPosX(
          reporte1.Año_Nac_1.toString().substring(0, 4) !== "0"
            ? reporte1.Año_Nac_1.toString().substring(0, 4)
            : "",
          130,
          reporte.tw_ren,
          0,
          "R"
        );
        reporte.ImpPosX(
          reporte1.Mes_Nac_1.toString().substring(4, 2) !== "0"
            ? reporte1.Mes_Nac_1.toString().substring(4, 2)
            : "",
          140,
          reporte.tw_ren,
          0,
          "R"
        );

        Enca1(reporte);
        if (reporte.tw_ren >= reporte.tw_endRen) {
          reporte.pageBreak();
          Enca1(reporte);
        }
      });

      setTimeout(() => {
        const pdfData = reporte.doc.output("datauristring");
        setPdfData(pdfData);
        setPdfPreview(true);
        showModalVista(true);
        setAnimateLoading(false);
      }, 500);
    }
  };

  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVPRepFemac3").showModal()
      : document.getElementById("modalVPRepFemac3").close();
  };
  const cerrarModalVista = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVPRepFemac3").close();
  };
  return (
    <>
      <ModalVistaPreviaRepFemac3
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
                Reporte Lista de Alumnos por Clase Mensual
              </h1>
            </div>
          </div>
        </div>
        <div className="w-full py-3 flex flex-col gap-y-4">
          {/* Fila del formulario de la pagina */}
          <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 min-[1920px]:w-1/4 w-1/2 mx-auto ">
            <div className="col-span-full md:col-span-full lg:col-span-full">
              <div className="w-full">
                <BuscarCat
                  table={"horarios"}
                  titulo={"Horario: "}
                  token={token}
                  nameInput={["horario_1", "horario_1_nombre"]}
                  fieldsToShow={["numero", "horario"]}
                  setItem={setHorario}
                  modalId={"modal_horarios"}
                  descClassName="md:mt-0 w-full"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-row">
            <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 min-[1920px]:w-1/4 w-1/2 mx-auto ">
              <div className="flex space-x-4">
                <label className="text-black dark:text-white flex flex-row md:flex-row space-x-4">
                  <span className="text-black dark:text-white  flex items-center gap-3">
                    Ordenar por:
                  </span>
                  <label className="flex items-center gap-3">
                    <span className="text-black dark:text-white">Nombre</span>
                    <input
                      type="radio"
                      name="options"
                      value="nombre"
                      checked={sOrdenar === "nombre"}
                      onChange={handleCheckChange}
                      className="radio checked:bg-blue-500"
                    />
                  </label>

                  <label className="flex items-center gap-3">
                    <span className="text-black dark:text-white">Número</span>
                    <input
                      type="radio"
                      name="options"
                      value="id"
                      checked={sOrdenar === "id"}
                      onChange={handleCheckChange}
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

export default Rep_Femac_3;
