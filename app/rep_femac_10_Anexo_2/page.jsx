"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Acciones from "./components/Acciones";
import Inputs from "@/app/rep_femac_10_Anexo_2/components/textComponent";
import { calculaDigitoBvba, formatDate } from "../utils/globalfn";
import { useForm } from "react-hook-form";
import { getReporteEstadodeCuenta, ImprimirExcel, ImprimirPDF } from "../utils/api/rep_femac_10_Anexo_2/rep_femac_10_Anexo_2";
import { formatNumber } from "../utils/globalfn";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import BuscarCat from "@/app/components/BuscarCat";
import "jspdf-autotable";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import ModalVistaPreviaRepFemac10Anexo2 from "./components/modalVistaPreviaRepFemac10Anexo2";

function EstadodeCuenta() {
  const router = useRouter();
  const { data: session, status } = useSession();
  let [fecha_ini, setFecha_ini] = useState("");
  let [fecha_fin, setFecha_fin] = useState("");
  let [alumno_ini, setAlumnoIni] = useState("");
  let [alumno_fin, setAlumnoFin] = useState("");
  const [tomaFechas, setTomaFechas] = useState(true);
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const [FormaRepEstadodeCuenta, setFormaReporteEstadodeCuenta] = useState([]);

  const getPrimerDiaDelMes = () => {
    const fechaActual = new Date();
    return new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1)
      .toISOString()
      .split('T')[0];
  };

  const getUltimoDiaDelMes = () => {
    const fechaActual = new Date();
    return new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0)
      .toISOString()
      .split('T')[0];
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
      const { token } = session.user;
      console.log(fecha_ini,
        fecha_fin,
        alumno_ini.numero,
        alumno_fin.numero,
        tomaFechas);
      const data = await getReporteEstadodeCuenta(
        token,
        fecha_ini,
        fecha_fin,
        alumno_ini.numero,
        alumno_fin.numero,
        tomaFechas
      );
      setFormaReporteEstadodeCuenta(data);
    };
    fetchData();
  }, [
    session,
    status,
    fecha_ini,
    fecha_fin,
    alumno_ini.numero,
    alumno_fin.numero,
    tomaFechas,
  ]);

  const {
    formState: { errors },
  } = useForm({});

  const home = () => {
    router.push("/");
  };

  const handleVerClick = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Estado de Cuenta",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: FormaRepEstadodeCuenta,
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
              `Reporte del ${fecha_ini} `,
              15,
              doc.tw_ren,
              0,
              "L"
            ),
              doc.nextRow(5);
          } else {
            doc.ImpPosX(
              `Reporte del ${fecha_ini} al ${fecha_fin}`,
              15,
              doc.tw_ren,
              0,
              "L"
            ),
              doc.nextRow(5);
          }
        }
          doc.nextRow(5);
          doc.ImpPosX("No.", 15, doc.tw_ren, 0, "L"),
          doc.ImpPosX("Nombre", 30, doc.tw_ren, 0, "L"),
          doc.ImpPosX("Cursa", 100, doc.tw_ren, 0, "L"),
          doc.ImpPosX("Fecha Nac", 135, doc.tw_ren, 0, "L"),
          doc.ImpPosX("Fecha Insc", 155, doc.tw_ren, 0, "L"),
          doc.nextRow(5);
          doc.ImpPosX("Documento", 15, doc.tw_ren, 0, "L"),
          doc.ImpPosX("producto", 35, doc.tw_ren, 0, "L"),
          doc.ImpPosX("Descripcion", 53, doc.tw_ren, 0, "L"),
          doc.ImpPosX("Fecha P", 130, doc.tw_ren, 0, "L"),
          doc.ImpPosX("Importe", 165, doc.tw_ren, 0, "L"),
          doc.ImpPosX("Recibo", 185, doc.tw_ren, 0, "L"),
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
      doc.ImpPosX(`TOTAL: ${formatNumber(total_importe)}` || "", 176, doc.tw_ren, 0, "R");
      doc.nextRow(8);
    };

    Enca1(reporte);
    body.forEach((reporte2) => {
      let tipoPago2 = " ";

      if (reporte2.desc_Tipo_Pago_2 === null) {
        tipoPago2 = " ";
      } else {
        tipoPago2 = reporte2.desc_Tipo_Pago_2;
      }

      if (reporte2.id_al !== alumno_Ant && alumno_Ant !== "") {
        Cambia_Alumno(reporte, total_importe);
        total_importe = 0;
      }

      if (reporte2.id_al !== alumno_Ant) {
        reporte.ImpPosX(reporte2.id_al + "-" + calculaDigitoBvba(reporte2.id_al.toString()), 15, reporte.tw_ren, 0, "L");
        reporte.ImpPosX(reporte2.nom_al.toString(), 30, reporte.tw_ren, 0, "L");
        reporte.ImpPosX(reporte2.horario_nom.toString(), 100, reporte.tw_ren, 0, "L");
        reporte.ImpPosX(reporte2.fecha_nac_al.toString(), 135, reporte.tw_ren, 0, "L");
        reporte.ImpPosX(reporte2.fecha_ins_al.toString(), 155, reporte.tw_ren, 0, "L");
        Enca1(reporte);
        if (reporte.tw_ren >= reporte.tw_endRen) {
          reporte.pageBreak();
          Enca1(reporte);
        }
      }
      reporte.ImpPosX(reporte2.numero_doc.toString(), 33, reporte.tw_ren, 0, "R");
      reporte.ImpPosX(reporte2.articulo.toString(), 49, reporte.tw_ren, 0, "R");
      reporte.ImpPosX(reporte2.descripcion.toString(), 53, reporte.tw_ren, 0, "L");
      
      reporte.ImpPosX(reporte2.fecha.toString(), 130, reporte.tw_ren, 0, "L");
      reporte.ImpPosX(formatNumber(reporte2.importe), 176, reporte.tw_ren, 0, "R");
      reporte.ImpPosX(reporte2.recibo.toString(), 195, reporte.tw_ren, 0, "R");

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
      176, reporte.tw_ren, 0, "R"
    );

    const pdfData = reporte.doc.output("datauristring");
    setPdfData(pdfData);
    setPdfPreview(true);
    showModalVista(true);
  };

  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVPRepFemac10Anexo2").showModal()
      : document.getElementById("modalVPRepFemac10Anexo2").close();
  };

  const ImprimePDF = async () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Estado de Cuenta",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: FormaRepEstadodeCuenta,
    };
    ImprimirPDF(
      configuracion,
      fecha_ini,
      fecha_fin,
      tomaFechas
    );
  };

  const ImprimeExcel = async () => {
    let detallefecha = "";
    let detallecajero = "";
    if (tomaFechas === true) {
      if (fecha_fin == "") {
        detallefecha = `Reporte del ${fecha_ini}`;
      } else {
        detallefecha = `Reporte del ${fecha_ini} al ${fecha_fin}`;
      }
    }

    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Estado de Cuenta",
        Nombre_Usuario: `${session.user.name}`,
        Clase: detallefecha,
        Profesor: detallecajero,
        FechaE: "",
      },
      body: FormaRepEstadodeCuenta,
      columns: [
        { header: "No.", dataKey: "id_al" },
        { header: "Nombre", dataKey: "nom_al" },
        { header: "Cursa", dataKey: "horario_nom" },
        { header: "Fecha Nac", dataKey: "fecha_nac_al" },
        { header: "Fecha Ins", dataKey: "fecha_ins_al" },
      ],
      columns2: [
        { header: "Documento", dataKey: "numero_doc" },
        { header: "Producto", dataKey: "articulo" },
        { header: "Descripcion", dataKey: "descripcion" },
        
        { header: "Fecha P", dataKey: "fecha" },
        { header: "Importe", dataKey: "importe" },
        { header: "Recibo", dataKey: "recibo" }
      ],
      nombre: `Reporte Estado de Cuenta del dia ${fecha_ini} al ${fecha_fin}`,
    };
    ImprimirExcel(
      configuracion,
      fecha_ini,
      fecha_fin,
      tomaFechas
    );
  };

  if (status === "loading") {
    return (
      <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  return (
    <>
      <ModalVistaPreviaRepFemac10Anexo2
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
            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
              Relación Estado de Cuenta
            </h1>
          </div>
        </div>
          <div className="col-span-7">
          <div className='flex flex-col h-[calc(85%)] overflow-y-auto'>
            <div className="flex flex-col md:flex-row gap-4">
              <div className='w-11/12 md:w-4/12 lg:w-3/12'>
                <Inputs
                name={"fecha_ini"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Fecha Inicial: "}
                type={"date"}
                errors={errors}
                maxLength={11}
                isDisabled={false}
                value={fecha_ini}
                setValue={setFecha_ini}>

                </Inputs>
              </div>
              <div className='w-11/12 md:w-4/12 lg:w-3/12'>
                <Inputs
                name={"fecha_fin"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Fecha Final: "}
                type={"date"}
                errors={errors}
                maxLength={11}
                isDisabled={false}
                value={fecha_fin}
                setValue={setFecha_fin}
                ></Inputs>
              </div>
              </div>
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
                    <span className="fa-regular fa-calendar block sm:hidden md:hidden lg:hidden xl:hidden text-neutral-600 dark:text-neutral-200"></span>
                    <span className="label-text font-bold hidden sm:block text-neutral-600 dark:text-neutral-200">
                      Toma Fechas
                    </span>
                  </label>
                </div>
              
                <div className="p-2">
                <BuscarCat
                  table="alumnos"
                  itemData={[]}
                  fieldsToShow={["numero", "nombre_completo"]}
                  nameInput={["numero", "nombre_completo"]}
                  titulo={"Alumno Inicio: "}
                  setItem={setAlumnoIni}
                  token={session.user.token}
                  modalId="modal_alumnos1"
                  inputWidths={{ first: "100px", second: "300px" }}
                />
                </div>
                <div className="p-2">
                <BuscarCat
                  table="alumnos"
                  itemData={[]}
                  fieldsToShow={["numero", "nombre_completo"]}
                  nameInput={["numero", "nombre_completo"]}
                  titulo={"Alumno Fin: "}
                  setItem={setAlumnoFin}
                  token={session.user.token}
                  modalId="modal_alumnos2"
                  inputWidths={{ first: "115px", second: "300px" }}
                />
                </div>
            </div>
          </div>
        </div>
    </>
  );
}

export default EstadodeCuenta;
