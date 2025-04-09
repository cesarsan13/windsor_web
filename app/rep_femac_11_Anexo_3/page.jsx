"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Acciones from "@/app/rep_femac_11_Anexo_3/components/Acciones";
import { calculaDigitoBvba, formatNumber } from "@/app/utils/globalfn";
import { useForm } from "react-hook-form";
import {
  getReporteCobranzaporAlumno,
  ImprimirPDF,
  ImprimirExcel,
} from "@/app/utils/api/rep_femac_11_Anexo_3/rep_femac_11_Anexo_3";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import BuscarCat from "@/app/components/BuscarCat";
import { showSwal } from "@/app/utils/alerts";
import "jspdf-autotable";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import VistaPrevia from "@/app/components/VistaPrevia";
import { permissionsComponents } from "@/app/utils/globalfn";
import ModalFechas from "@/app/components/modalFechas";

function CobranzaPorAlumno() {
  const router = useRouter();
  const { data: session, status } = useSession();
  let [alumno_ini, setAlumnoIni] = useState("");
  let [alumno_fin, setAlumnoFin] = useState("");
  let [cajero_ini, setCajeroIni] = useState("");
  let [cajero_fin, setCajeroFin] = useState("");
  const [tomaFechas, setTomaFechas] = useState(true);
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const [FormaRepCobranzaporAlumno, setFormaReporteCobranzaporAlumno] = useState([]);
  const [animateLoading, setAnimateLoading] = useState(false);
  const [permissions, setPermissions] = useState({});
  //Modal Fechas
  let [fecha_ini, setFecha_ini] = useState("");
  let [fecha_fin, setFecha_fin] = useState("");
  const [tempFechaIni, setTempFechaIni] = useState("");
  const [tempFechaFin, setTempFechaFin] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAllAlumnos, setSelectedAllAlumnos] = useState(false);

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

  useEffect(() => {
    if (status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {
      let { permissions } = session.user;
      const menuSeleccionado = Number(localStorage.getItem("puntoMenu"));
      const es_admin = session.user.es_admin;
      const permisos = permissionsComponents(
        es_admin,
        permissions,
        session.user.id,
        menuSeleccionado
      );
      setPermissions(permisos);
    };
    fetchData();
  }, [
    session,
    status,
    fecha_ini,
    fecha_fin,
    alumno_ini.numero,
    alumno_fin.numero,
    cajero_ini.numero,
    cajero_fin.numero,
    tomaFechas,
  ]);

  const {
    formState: { errors },
  } = useForm({});

  const home = () => {
    router.push("/");
  };

  const handleVerClick = async () => {
    setAnimateLoading(true);
    cerrarModalVista();
    if (cajero_ini.numero === undefined && selectedAllAlumnos === false) {
      showSwal(
        "Oppss!",
        "Para imprimir, mínimo debe estar seleccionado un Cajero de 'Inicio'",
        "error"
      );
      setTimeout(() => {
        setPdfPreview(false);
        setPdfData("");
        setAnimateLoading(false);
        document.getElementById("modalVPRepFemac11Anexo3").close();
      }, 500);
    } else {
      const fechaIniFormateada = fecha_ini ? fecha_ini.replace(/-/g, "/") : 0;
      const fechaFinFormateada = fecha_fin ? fecha_fin.replace(/-/g, "/") : 0;
      const data = await getReporteCobranzaporAlumno(
        session.user.token,
        fechaIniFormateada,
        fechaFinFormateada,
        alumno_ini.numero,
        alumno_fin.numero,
        cajero_ini.numero,
        cajero_fin.numero,
        tomaFechas,
        selectedAllAlumnos
      );
      setFormaReporteCobranzaporAlumno(data);

      const configuracion = {
        Encabezado: {
          Nombre_Aplicacion: "Sistema de Control Escolar",
          Nombre_Reporte: "Reporte Cobranza por Alumno(s)",
          Nombre_Usuario: `Usuario: ${session.user.name}`,
        },
        body: data,
      };

      const reporte = new ReportePDF(configuracion);
      const { body } = configuracion;
      const Enca1 = (doc) => {
        if (!doc.tiene_encabezado) {
          doc.imprimeEncabezadoPrincipalV();
          doc.nextRow(8);
          if (tomaFechas === true) {
            if (fecha_fin == "") {
              doc.ImpPosX(
                `Reporte de cobranza del ${fecha_ini} `,
                15,
                doc.tw_ren
              ),
                doc.nextRow(5);
            } else {
              doc.ImpPosX(
                `Reporte de cobranza del ${fecha_ini} al ${fecha_fin}`,
                15,
                doc.tw_ren
              ),
                doc.nextRow(5);
            }
          }
          if (cajero_fin.numero === undefined) {
            doc.ImpPosX(
              `Cajero seleccionado: ${cajero_ini.numero} `,
              15,
              doc.tw_ren
            ),
              doc.nextRow(10);
          } else {
            doc.ImpPosX(
              `Cajeros seleccionado de ${cajero_ini.numero} al ${cajero_fin.numero}`,
              15,
              doc.tw_ren
            ),
              doc.nextRow(10);
          }
          doc.ImpPosX("No.", 15, doc.tw_ren),
            doc.ImpPosX("Nombre", 40, doc.tw_ren),
            doc.nextRow(5);
          doc.ImpPosX("Producto", 15, doc.tw_ren),
            doc.ImpPosX("Descripcion", 30, doc.tw_ren),
            doc.ImpPosX("Documento", 70, doc.tw_ren),
            doc.ImpPosX("Fecha P", 90, doc.tw_ren),
            doc.ImpPosX("Importe", 110, doc.tw_ren),
            doc.ImpPosX("Recibo", 130, doc.tw_ren),
            doc.ImpPosX("Pago 1", 143, doc.tw_ren),
            doc.ImpPosX("Pago 2", 163, doc.tw_ren),
            doc.ImpPosX("Cajero", 183, doc.tw_ren),
            doc.nextRow(4);
          doc.printLineV();
          doc.nextRow(4);
          doc.tiene_encabezado = true;
        } else {
          doc.nextRow(6);
          doc.tiene_encabezado = true;
        }
      };
      let alumno_Ant = "";
      let total_importe = 0;
      let total_general = 0;

      const Cambia_Alumno = (doc, total_importe) => {
        doc.ImpPosX(
          `TOTAL: ${formatNumber(total_importe)}` || "",
          122,
          doc.tw_ren,
          0,
          "R"
        );
        doc.nextRow(8);
      };

      Enca1(reporte);
      body.forEach((reporte2) => {
        reporte.setFontSize(9);
        let tipoPago2 = " ";
        let nombre = " ";

        if (reporte2.nombre === null) {
          nombre = " ";
        } else {
          nombre = reporte2.nombre;
        }
        if (reporte2.desc_Tipo_Pago_2 === null) {
          tipoPago2 = " ";
        } else {
          tipoPago2 = reporte2.desc_Tipo_Pago_2;
        }
        if (reporte2.id_al !== alumno_Ant && alumno_Ant !== "") {
          Cambia_Alumno(reporte, total_importe);
          total_importe = 0;
        }
        if (reporte2.id_al !== alumno_Ant && reporte2.id_al != null) {
          reporte.ImpPosX(
            reporte2.id_al + "-" + calculaDigitoBvba(reporte2.id_al.toString()),
            25,
            reporte.tw_ren,
            0,
            "R"
          );
          reporte.ImpPosX(reporte2.nom_al.toString(), 40, reporte.tw_ren);
          Enca1(reporte);
          if (reporte.tw_ren >= reporte.tw_endRen) {
            reporte.pageBreak();
            Enca1(reporte);
          }
        }

        reporte.ImpPosX(
          reporte2.articulo.toString(),
          15,
          reporte.tw_ren,
          0,
          "L"
        );
        reporte.ImpPosX(
          reporte2.descripcion.toString(),
          30,
          reporte.tw_ren,
          0,
          "L"
        );
        reporte.ImpPosX(
          reporte2.numero_doc.toString(),
          87,
          reporte.tw_ren,
          0,
          "R"
        );
        reporte.ImpPosX(reporte2.fecha.toString(), 90, reporte.tw_ren, 0, "L");
        reporte.ImpPosX(
          formatNumber(reporte2.importe),
          122,
          reporte.tw_ren,
          0,
          "R"
        );
        reporte.ImpPosX(
          reporte2.recibo.toString(),
          140,
          reporte.tw_ren,
          0,
          "R"
        );
        reporte.ImpPosX(
          reporte2.desc_Tipo_Pago_1.toString(),
          143,
          reporte.tw_ren,
          0,
          "L"
        );
        reporte.ImpPosX(tipoPago2.toString(), 163, reporte.tw_ren, 0, "L");
        reporte.ImpPosX(nombre.toString(), 183, reporte.tw_ren, 0, "L");

        Enca1(reporte);
        if (reporte.tw_ren >= reporte.tw_endRen) {
          reporte.pageBreak();
          Enca1(reporte);
        }
        total_importe = total_importe + reporte2.importe;
        total_general = total_general + reporte2.importe;
        alumno_Ant = reporte2.id_al;
      });
      Cambia_Alumno(reporte, total_importe);

      reporte.ImpPosX(
        `TOTAL IMPORTE: ${formatNumber(total_general)}` || "",
        122,
        reporte.tw_ren,
        0,
        "R"
      );
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
      ? document.getElementById("modalVPRepFemac11Anexo3").showModal()
      : document.getElementById("modalVPRepFemac11Anexo3").close();
  };

  const cerrarModalVista = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVPRepFemac11Anexo3").close();
  };

  const ImprimePDF = async () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Cobranza por Alumno(s)",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: FormaRepCobranzaporAlumno,
    };
    ImprimirPDF(
      configuracion,
      fecha_ini,
      fecha_fin,
      cajero_ini,
      cajero_fin,
      tomaFechas
    );
  };

  const ImprimeExcel = async () => {
    let detallefecha = "";
    let detallecajero = "";
    if (tomaFechas === true) {
      if (fecha_fin == "") {
        detallefecha = `Reporte de cobranza del ${fecha_ini}`;
      } else {
        detallefecha = `Reporte de cobranza del ${fecha_ini} al ${fecha_fin}`;
      }
    }
    if (cajero_fin.numero === undefined) {
      detallecajero = `Cajero seleccionado: ${cajero_ini.numero}`;
    } else {
      detallecajero = `Cajeros seleccionado de ${cajero_ini.numero} al ${cajero_fin.numero}`;
    }

    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Cobranza por Alumno(s)",
        Nombre_Usuario: `${session.user.name}`,
        Clase: detallefecha,
        Profesor: detallecajero,
        FechaE: "",
      },
      body: FormaRepCobranzaporAlumno,
      columns: [
        { header: "No.", dataKey: "id_al" },
        { header: "Nombre", dataKey: "nom_al" },
        { header: "", dataKey: "" },
        { header: "", dataKey: "" },
        { header: "", dataKey: "" },
        { header: "", dataKey: "" },
        { header: "", dataKey: "" },
        { header: "", dataKey: "" },
        { header: "", dataKey: "" },
      ],
      columns2: [
        { header: "Producto", dataKey: "articulo" },
        { header: "Descripcion", dataKey: "descripcion" },
        { header: "Documento", dataKey: "numero_doc" },
        { header: "Fecha P", dataKey: "fecha" },
        { header: "Importe", dataKey: "importe" },
        { header: "Recibo", dataKey: "recibo" },
        { header: "Pago 1", dataKey: "desc_Tipo_Pago_1" },
        { header: "Pago 2", dataKey: "desc_Tipo_Pago_2" },
        { header: "Cajero", dataKey: "nombre" },
      ],
      nombre: "Reporte de Cobranza por Alumno(s)",
    };
    ImprimirExcel(
      configuracion,
      fecha_ini,
      fecha_fin,
      cajero_ini,
      cajero_fin,
      tomaFechas
    );
  };

  const CerrarView = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVPRepFemac11Anexo3").close();
  };

  const handleCloseModal = () => setModalOpen(false);
  const handleSelectDates = () => {
    setFecha_ini(tempFechaIni);
    setFecha_fin(tempFechaFin);
    setModalOpen(false);
  };
  const handleOpenModal = () => {
    setTempFechaIni(fecha_ini);
    setTempFechaFin(fecha_fin);
    setModalOpen(true);
  };

  if (status === "loading") {
    return (
      <div className="container skeleton w-full max-w-screen-xl shadow-xl rounded-xl"></div>
    );
  }

  return (
    <>
      <VistaPrevia
        id={"modalVPRepFemac11Anexo3"}
        titulo={"Vista Previa de Cobranza por Alumno"}
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
                <Acciones
                  home={home}
                  Ver={handleVerClick}
                  isLoading={animateLoading}
                  permiso_imprime={permissions.impresion}
                />
              </div>
              <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 mx-5">
                Reporte Cobranza por Alumno
              </h1>
            </div>
          </div>
        </div>
        <div className="w-full py-3 flex flex-col gap-y-4">
          {/* Fila del formulario de la pagina */}
          <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 min-[1300px]:w-1/3 min-[1920px]:w-1/4 w-1/2 mx-auto space-y-4">
            <div className="flex flex-row w-full">
              <div className="max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 min-[1920px]:w-1/4 w-1/2 pl-4">
                <div className="flex items-center justify-start gap-4">
                  <input
                    type="date"
                    value={fecha_ini}
                    onChange={(e) => setFecha_ini(e.target.value)}
                    className="border p-2 rounded"
                  />
                  <button
                    onClick={handleOpenModal}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    📅
                  </button>
                  <input
                    type="date"
                    value={fecha_fin}
                    onChange={(e) => setFecha_fin(e.target.value)}
                    className="border p-2 rounded"
                  />
                </div>

                {modalOpen && (
                  <ModalFechas
                    tempFechaIni={tempFechaIni}
                    setTempFechaIni={setTempFechaIni}
                    tempFechaFin={tempFechaFin}
                    setTempFechaFin={setTempFechaFin}
                    handleSelectDates={handleSelectDates}
                    handleCloseModal={handleCloseModal}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-row">
            <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 min-[1300px]:w-1/3 min-[1920px]:w-1/4 w-1/2 mx-auto ">
            <div className="col-span-full md:col-span-full lg:col-span-full">
                <div className="w-full pl-4 p-1">
                  <BuscarCat
                    table="cajeros"
                    itemData={[]}
                    fieldsToShow={["numero", "nombre"]}
                    nameInput={["numero", "nombre"]}
                    titulo={"Cajero Inicio: "}
                    setItem={setCajeroIni}
                    token={session.user.token}
                    modalId="modal_cajeros1"
                    inputWidths={{ first: "109px", second: "300px" }}
                    descClassName="md:mt-0 w-full"
                  />
                </div>
              </div>
              <div className="col-span-full md:col-span-full lg:col-span-full">
                <div className="w-full pl-4 p-1">
                  <BuscarCat
                    table="cajeros"
                    itemData={[]}
                    fieldsToShow={["numero", "nombre"]}
                    nameInput={["numero", "nombre"]}
                    titulo={"Cajero Fin: "}
                    setItem={setCajeroFin}
                    token={session.user.token}
                    modalId="modal_cajeros2"
                    inputWidths={{ first: "109px", second: "300px" }}
                    descClassName="md:mt-0 w-full"
                  />
                </div>
              </div>
              <div className="col-span-full md:col-span-full lg:col-span-full">
                <div className="w-full pl-4 p-1">
                  <BuscarCat
                    deshabilitado={selectedAllAlumnos === true}
                    table="alumnos"
                    itemData={[]}
                    fieldsToShow={["numero", "nombre_completo"]}
                    nameInput={["numero", "nombre_completo"]}
                    titulo={"Alumno Inicio: "}
                    setItem={setAlumnoIni}
                    token={session.user.token}
                    modalId="modal_alumnos1"
                    inputWidths={{ first: "109px", second: "300px" }}
                    descClassName="md:mt-0 w-full"
                  />
                </div>
              </div>
              <div className="col-span-full md:col-span-full lg:col-span-full">
                <div className="w-full pl-4 p-1">
                  <BuscarCat
                    deshabilitado={selectedAllAlumnos === true}
                    table="alumnos"
                    itemData={[]}
                    fieldsToShow={["numero", "nombre_completo"]}
                    nameInput={["numero", "nombre_completo"]}
                    titulo={"Alumno Fin: "}
                    setItem={setAlumnoFin}
                    token={session.user.token}
                    modalId="modal_alumnos2"
                    descClassName="md:mt-0 w-full"
                    inputWidths={{ first: "109px", second: "300px" }}
                  />
                </div>
              </div>
              <div className="flex flex-row max-[499px]:gap-1 gap-4">
                <div className="lg:w-fit md:w-fit">
                  <div className="tooltip " data-tip="Tomar Fechas">
                    <label
                      htmlFor="ch_tomaFechas"
                      className="label cursor-pointer flex justify-start space-x-2"
                    >
                      <input
                        id="ch_tomaFechas"
                        type="checkbox"
                        className="checkbox checkbox-md"
                        defaultChecked={true}
                        onClick={(evt) => setTomaFechas(evt.target.checked)}
                      />
                      <span className="fa-regular fa-calendar block sm:hidden md:hidden lg:hidden xl:hidden  text-neutral-600 dark:text-neutral-200"></span>
                      <span className="label-text font-bold md:block hidden text-neutral-600 dark:text-neutral-200">
                        Toma Fechas
                      </span>
                    </label>
                  </div>
                  <div className="tooltip" data-tip="Toma todos los Alumnos">
                    <label
                      htmlFor="ch_SelectedAllAlumnos"
                      className="label cursor-pointer flex justify-start space-x-2"
                    >
                      <input
                        id="ch_selectedAllAlumnos"
                        type="checkbox"
                        className="checkbox checkbox-md"
                        defaultChecked={false}
                        onClick={(evt) => setSelectedAllAlumnos(evt.target.checked)}
                      />
                      <span className="label-text font-bold md:block hidden text-neutral-600 dark:text-neutral-200">
                        Toma todos los Alumnos
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

export default CobranzaPorAlumno;
