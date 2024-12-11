"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Acciones from "./components/Acciones";
import {
  ImprimirPDF,
  ImprimirExcel,
  getRepDosSel,
} from "../utils/api/Rep_Femac_2/Rep_Femac_2";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import "jspdf-autotable";
import BuscarCat from "../components/BuscarCat";
import { showSwal } from "@/app/utils/alerts";
import VistaPrevia from "../components/VistaPrevia";
import { permissionsComponents } from "../utils/globalfn";
function AlumnosPorClase() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sOrdenar, ssetordenar] = useState("nombre");
  const [FormaRepDosSel, setFormaRepDosSel] = useState([]);
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [animateLoading, setAnimateLoading] = useState(false);
  //guarda el valor
  const [horario1, setHorario1] = useState({});
  const [horario2, setHorario2] = useState({});
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    if (status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {
      setisLoading(true);
      const { token, permissions } = session.user;
      const es_admin = session.user.es_admin;
      const menu_seleccionado = Number(localStorage.getItem("puntoMenu"));
      const permisos = permissionsComponents(es_admin, permissions, session.user.id, menu_seleccionado)
      setPermissions(permisos);
      //const data = await getRepDosSel(token, horario1, horario2, sOrdenar);
      //setFormaRepDosSel(data.data);
      setisLoading(false);
    };
    fetchData();
  }, [session, status, horario1, horario2, sOrdenar]);

  const home = () => {
    router.push("/");
  };
  const CerrarView = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVPAlumnosPorClase").close();

  };

  const ImprimePDF = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Alumnos por clase",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: FormaRepDosSel,
    };
    ImprimirPDF(configuracion);
  };

  const ImprimeExcel = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Alumnos por clase",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: FormaRepDosSel,
      columns: [
        { header: "No.", dataKey: "Num_Renglon" },
        { header: "No. 1", dataKey: "Numero_1" },
        { header: "Nombre", dataKey: "Nombre_1" },
        { header: "Año", dataKey: "Año_Nac_1" },
        { header: "Mes", dataKey: "Mes_Nac_1" },
        { header: "Telefono", dataKey: "Telefono_1" },
        { header: "No. 2", dataKey: "Numero_2" },
        { header: "Nombre", dataKey: "Nombre_2" },
        { header: "Año", dataKey: "Año_Nac_2" },
        { header: "Mes", dataKey: "Mes_Nac_2" },
        { header: "Telefono", dataKey: "Telefono_2" },
      ],
      nombre: "Lista_Alumnos_Por_Clase",
    };
    ImprimirExcel(configuracion);
  };

  const handleCheckChange = (event) => {
    ssetordenar(event.target.value);
  };

  const handleVerClick = async () => {
    setAnimateLoading(true);
    cerrarModalVista();
    if (horario1.numero === undefined) {
      showSwal(
        "Oppss!",
        "Para imprimir, mínimo debe estar seleccionada una fecha de 'Inicio'",
        "error"
      );
      setTimeout(() => {
        setPdfPreview(false);
        setPdfData("");
        setAnimateLoading(false);
        document.getElementById("modalVPAlumnosPorClase").close();
      }, 500);
    } else {
      const data = await getRepDosSel(session.user.token, horario1, horario2, sOrdenar);
      setFormaRepDosSel(data.data);

      const configuracion = {
        Encabezado: {
          Nombre_Aplicacion: "Sistema de Control Escolar",
          Nombre_Reporte: "Reporte de Alumnos por clase",
          Nombre_Usuario: `Usuario: ${session.user.name}`,
        },
        body: data.data,
      };
      const reporte = new ReportePDF(configuracion, "Landscape");
      const { body } = configuracion;
      const Enca1 = (doc) => {
        if (!doc.tiene_encabezado) {
          doc.imprimeEncabezadoPrincipalH();
          doc.nextRow(12);
          doc.ImpPosX("No.", 15, doc.tw_ren, 0, "L"),
            doc.ImpPosX("No. 1", 25, doc.tw_ren, 0, "L"),
            doc.ImpPosX("Nombre", 45, doc.tw_ren, 0, "L"),
            doc.ImpPosX("Año", 120, doc.tw_ren, 0, "L"),
            doc.ImpPosX("Mes", 130, doc.tw_ren, 0, "L"),
            doc.ImpPosX("Telefono", 138, doc.tw_ren, 0, "L"),
            doc.ImpPosX("No. 2", 163, doc.tw_ren, 0, "L"),
            doc.ImpPosX("Nombre", 176, doc.tw_ren, 0, "L"),
            doc.ImpPosX("Año", 250, doc.tw_ren, 0, "L"),
            doc.ImpPosX("Mes", 260, doc.tw_ren, 0, "L"),
            doc.ImpPosX("Telefono", 268, doc.tw_ren, 0, "L"),
            doc.nextRow(4);
          doc.printLineH();
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
          20,
          reporte.tw_ren,
          0,
          "R"
        );
        reporte.ImpPosX(
          reporte1.Numero_1?.toString() ?? "",
          27,
          reporte.tw_ren,
          0,
          "R"
        );
        reporte.ImpPosX(
          reporte1.Nombre_1?.toString() ?? "",
          45,
          reporte.tw_ren,
          35,
          "L"
        );
        reporte.ImpPosX(
          reporte1.Año_Nac_1?.toString().substring(0, 4) ?? "",
          128,
          reporte.tw_ren,
          0,
          "R"
        );
        reporte.ImpPosX(
          reporte1.Mes_Nac_1?.toString().substring(5, 7) ?? "",
          137,
          reporte.tw_ren,
          0,
          "R"
        );
        reporte.ImpPosX(
          reporte1.Telefono_1?.toString() ?? "",
          158,
          reporte.tw_ren,
          0,
          "R"
        );
        reporte.ImpPosX(
          reporte1.Numero_2?.toString() ?? "",
          173,
          reporte.tw_ren,
          0,
          "R"
        );
        reporte.ImpPosX(
          reporte1.Nombre_2?.toString() ?? "",
          176,
          reporte.tw_ren,
          35,
          "L"
        );
        reporte.ImpPosX(
          reporte1.Año_Nac_2?.toString().substring(0, 4) ?? "",
          259,
          reporte.tw_ren,
          0,
          "R"
        );
        reporte.ImpPosX(
          reporte1.Mes_Nac_2?.toString().substring(4, 2) ?? "",
          266,
          reporte.tw_ren,
          0,
          "R"
        );
        reporte.ImpPosX(
          reporte1.Telefono_2?.toString() ?? "",
          289,
          reporte.tw_ren,
          0,
          "R"
        );
        Enca1(reporte);
        if (reporte.tw_ren >= reporte.tw_endRenH) {
          reporte.pageBreakH();
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
      ? document.getElementById("modalVPAlumnosPorClase").showModal()
      : document.getElementById("modalVPAlumnosPorClase").close();
  };
  const cerrarModalVista = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVPAlumnosPorClase").close();
  };
  if (status === "loading") {
    return (
      <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  return (
    <>
      <VistaPrevia
        id={"modalVPAlumnosPorClase"}
        titulo={"Vista Previa de Alumnos Por Clase"}
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
                <Acciones home={home} Ver={handleVerClick} isLoading={animateLoading} permiso_imprime = {permissions.impresion}/>
              </div>
              <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 mx-5">
                Lista de Alumnos por Clase.
              </h1>
            </div>
          </div>
        </div>
        <div className="w-full py-3 flex flex-col gap-y-4 mb-3">
          {/* Fila del formulario de la pagina */}
          <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4  w-1/2 mx-auto ">
            {/*min-[1920px]:w-1/4*/}
            <div className="flex min-[1920px]:flex-row flex-col min-[1920px]:space-x-4 space-y-2">
              <BuscarCat
                table="horarios"
                titulo={"horario 1: "}
                token={session.user.token}
                nameInput={["horario_1", "horario_1_nombre"]}
                fieldsToShow={["numero", "horario"]}
                setItem={setHorario1}
                modalId="modal_horarios"
                alignRight={true}
                inputWidths={{
                  first: "50px",
                  second: "210px",
                }}
                descClassName="md:mt-0 w-full"
                contClassName="flex flex-row md:flex-row justify-start gap-2 sm:flex-row w-full"
              />
              <BuscarCat
                table="horarios"
                titulo={"horario 2: "}
                token={session.user.token}
                nameInput={["horario_2", "horario_2_nombre"]}
                fieldsToShow={["numero", "horario"]}
                setItem={setHorario2}
                modalId="modal_horarios2"
                alignRight={true}
                inputWidths={{
                  first: "50px",
                  second: "210px",
                }}
                descClassName="md:mt-0 w-full"
                contClassName="flex flex-row md:flex-row justify-start gap-2 sm:flex-row w-full"
              />
            </div>
          </div>
          <div className="flex flex-row">
            <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 w-1/2 mx-auto ">
              {/*min-[1920px]:w-1/4*/}
              <div className="flex space-x-4">
                <label className="text-black dark:text-white flex flex-row gap-3 md:flex-row">
                  <span className="text-black dark:text-white">
                    Ordenar por:
                  </span>
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
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AlumnosPorClase;
