"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Acciones from "@/app/rep_femac_13/components/Acciones";
import VistaPrevia from "../components/VistaPrevia";
import {
  getRepASem,
  ImprimirExcel,
} from "../utils/api/Rep_Femac_13/Rep_Femac_13";
import { useSession } from "next-auth/react";
import "jspdf-autotable";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import BuscarCat from "../components/BuscarCat";
import { formatDate, permissionsComponents } from "../utils/globalfn";
import { showSwal } from "@/app/utils/alerts";

function Rep_Femac_13() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const date = new Date();
  const dateStr = formatDate(date);
  const [fecha, setFecha] = useState(dateStr.replace(/\//g, "-"));
  const [FormaRepASem, setFormaRepASem] = useState([]);
  const [Formahorario, setFormahorario] = useState([]);
  const [horario, setHorario] = useState({});
  const [sOrdenar, ssetordenar] = useState("nombre");
  const [animateLoading, setAnimateLoading] = useState(false);
  const [permissions, setPermissions] = useState({});


  useEffect(() => {
    if (status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {
      const { token, permissions } = session.user;
      const es_admin = session.user.es_admin;
      const data = await getRepASem(token, horario, sOrdenar);
      setFormaRepASem(data.data);
      const permisos = permissionsComponents(es_admin, permissions, session.user.id, 1);
      setPermissions(permisos);
    };
    fetchData();
  }, [session, status, horario, sOrdenar]);

  const handleCheckChange = (event) => {
    ssetordenar(event.target.value);
  };

  const home = () => {
    router.push("/");
  };

  const handleClickVer = () => {
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
        document.getElementById("modalVPRepFemac13").close();
      }, 500);
    } else {
      const configuracion = {
        Encabezado: {
          Nombre_Aplicacion: "Sistema de Control Escolar",
          Nombre_Reporte: "Lista de Alumnos por Clase Semanal",
          Nombre_Usuario: `Usuario: ${session.user.name}`,
        },
        body: FormaRepASem,
      };
      const reporte = new ReportePDF(configuracion);
      const { body } = configuracion;
      const Enca1 = (doc) => {
        if (!doc.tiene_encabezado) {
          doc.imprimeEncabezadoPrincipalV();
          doc.nextRow(8);
          doc.ImpPosX(`Clase: ${horario.horario}`, 15, doc.tw_ren),
            doc.nextRow(5);
          doc.ImpPosX(
            "Profesor: _________________________________________",
            15,
            doc.tw_ren
          ),
            doc.nextRow(5);
          doc.ImpPosX(`Fecha emisión: ${fecha}`, 15, doc.tw_ren),
            doc.nextRow(10);
          doc.ImpPosX("No.", 15, doc.tw_ren),
            doc.ImpPosX("No. A", 25, doc.tw_ren),
            doc.ImpPosX("Nombre", 35, doc.tw_ren),
            doc.ImpPosX("Año", 120, doc.tw_ren),
            doc.ImpPosX("Mes", 130, doc.tw_ren),
            doc.ImpPosX("OBSERVACIONES", 145, doc.tw_ren),
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
          reporte1.Num_Renglon?.toString() ?? "",
          19,
          reporte.tw_ren,
          0,
          "R"
        );
        reporte.ImpPosX(
          reporte1.Numero_1?.toString() ?? "",
          29,
          reporte.tw_ren,
          0,
          "R"
        );
        reporte.ImpPosX(
          reporte1.Nombre_1?.toString() ?? "",
          35,
          reporte.tw_ren,
          0,
          "L"
        );
        reporte.ImpPosX(
          reporte1.Año_Nac_1?.toString().substring(0, 4) ?? "",
          129,
          reporte.tw_ren,
          0,
          "R"
        );
        reporte.ImpPosX(
          reporte1.Mes_Nac_1?.toString().substring(4, 2) ?? "",
          138,
          reporte.tw_ren,
          0,
          "R"
        );
        reporte.ImpPosX(
          reporte1.Observaciones?.toString() ?? "",
          145,
          reporte.tw_ren,
          0,
          "L"
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
      ? document.getElementById("modalVPRepFemac13").showModal()
      : document.getElementById("modalVPRepFemac13").close();
  };
  const cerrarModalVista = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVPRepFemac13").close();
  };
  const CerrarView = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVPRepFemac13").close();
  };
  const ImprimePDF = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Lista de Alumnos por Clase Semanal",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: FormaRepASem,
    };

    const reporte = new ReportePDF(configuracion);

    const { body } = configuracion;
    const Enca1 = (doc) => {
      if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalV();
        doc.nextRow(8);
        doc.ImpPosX(`Clase: ${horario.horario}`, 15, doc.tw_ren),
          doc.nextRow(5);
        doc.ImpPosX(
          "Profesor: _________________________________________",
          15,
          doc.tw_ren
        ),
          doc.nextRow(5);
        doc.ImpPosX(`Fecha emisión: ${fecha}`, 15, doc.tw_ren), doc.nextRow(10);
        doc.ImpPosX("No.", 15, doc.tw_ren),
          doc.ImpPosX("No. A", 25, doc.tw_ren),
          doc.ImpPosX("Nombre", 35, doc.tw_ren),
          doc.ImpPosX("Año", 120, doc.tw_ren),
          doc.ImpPosX("Mes", 130, doc.tw_ren),
          doc.ImpPosX("OBSERVACIONES", 145, doc.tw_ren),
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
        reporte1.Num_Renglon?.toString() ?? "",
        19,
        reporte.tw_ren,
        0,
        "R"
      );
      reporte.ImpPosX(
        reporte1.Numero_1?.toString() ?? "",
        29,
        reporte.tw_ren,
        0,
        "R"
      );
      reporte.ImpPosX(
        reporte1.Nombre_1?.toString() ?? "",
        35,
        reporte.tw_ren,
        0,
        "L"
      );
      reporte.ImpPosX(
        reporte1.Año_Nac_1?.toString().substring(0, 4) ?? "",
        129,
        reporte.tw_ren,
        0,
        "R"
      );
      reporte.ImpPosX(
        reporte1.Mes_Nac_1?.toString().substring(4, 2) ?? "",
        138,
        reporte.tw_ren,
        0,
        "R"
      );
      reporte.ImpPosX(
        reporte1.Observaciones?.toString() ?? "",
        145,
        reporte.tw_ren,
        0,
        "L"
      );
      Enca1(reporte);
      if (reporte.tw_ren >= reporte.tw_endRen) {
        reporte.pageBreak();
        Enca1(reporte);
      }
    });
    reporte.guardaReporte("RepAlumSem");
  };

  const ImprimeExcel = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Lista de Alumnos por Clase Semanal",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
        Clase: `Clase: ${horario.horario}`,
        Profesor: "Profesor: ",
        FechaE: `Fecha: ${fecha}`,
      },
      body: FormaRepASem,

      columns: [
        { header: "No.", dataKey: "Num_Renglon" },
        { header: "No. A", dataKey: "Numero_1" },
        { header: "Nombre", dataKey: "Nombre_1" },
        { header: "Año", dataKey: "Año_Nac_1" },
        { header: "Mes", dataKey: "Mes_Nac_1" },
        { header: "OBSERVACIONES" },
      ],
      nombre: "RepAlumSem",
    };
    ImprimirExcel(configuracion);
  };

  if (status === "loading") {
    return (
      <div className="container skeleton w-full max-w-screen-xl shadow-xl rounded-xl"></div>
    );
  }

  return (
    <>
      <VistaPrevia
        id={"modalVPRepFemac13"}
        titulo={"Vista Previa de Alumnos por Clase Semanal"}
        pdfPreview={pdfPreview}
        pdfData={pdfData}
        PDF={ImprimePDF}
        Excel={ImprimeExcel}
        CerrarView={CerrarView}
      />
      <div className="flex flex-col justify-start items-start bg-base-200 shadow-xl rounded-xl dark:bg-slate-700 h-full max-[420px]:w-full w-11/12">
        <div className="w-full py-3">
          {/* Fila de la cabecera de la pagina */}
          <div className="flex flex-col justify-start p-3 max-[600px]:p-0">
            <div className="flex flex-wrap items-start md:items-center mx-auto">
              <div className="order-2 md:order-1 flex justify-between w-full md:w-auto mb-0">
                <Acciones home={home} Ver={handleClickVer} isLoading={animateLoading} permiso_imprime={permissions.impresion}/>
              </div>
              <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 mx-5">
                Reporte de Alumnos por Clase Semanal
              </h1>
            </div>
          </div>
        </div>
        <div className="w-full py-3 flex flex-col gap-y-4">
          {/* Fila del formulario de la pagina */}
          <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 min-[1920px]:w-1/4 w-1/2 mx-auto ">
            <div className="flex flex-row max-[499px]:gap-1 gap-4">
              <div className="lg:w-fit md:w-fit">
                <label className="input input-bordered input-md text-black dark:text-white flex items-center gap-3 w-auto lg:w-fit md:w-full">
                  Fecha emisión
                  <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="rounded block grow text-black max-[500px]:w-[100px] w-auto dark:text-white border-b-2 border-slate-300 dark:border-slate-700 "
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="flex flex-row">
            <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 min-[1920px]:w-1/4 w-1/2 mx-auto ">
              <div className="col-span-full md:col-span-full lg:col-span-full">
                <div className="w-full">
                  <BuscarCat
                    table="horarios"
                    titulo={"horario: "}
                    token={session.user.token}
                    nameInput={["horario", "horario_nombre"]}
                    fieldsToShow={["numero", "horario"]}
                    setItem={setHorario}
                    modalId="modal_horarios"
                    descClassName="md:mt-0 w-full"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row">
            <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 min-[1920px]:w-1/4 w-1/2 mx-auto ">
              <div className="flex space-x-4">
                <label className="flex items-center gap-3">
                  <span className="text-black dark:text-white">Nombre</span>
                  <input
                    type="radio"
                    name="ordenar"
                    value="nombre"
                    onChange={handleCheckChange}
                    checked={sOrdenar === "nombre"}
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
                    checked={sOrdenar === "numero"}
                    className="radio checked:bg-blue-500"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Rep_Femac_13;
