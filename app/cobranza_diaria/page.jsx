"use client";
import React, { useEffect, useState } from "react";
import TablaCobranzaDiaria from "./components/tablaCobranzaDiaria";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Acciones from "./components/acciones";
import Busqueda from "./components/busqueda";
import {
  Elimina_Comas,
  format_Fecha_String,
  formatDate,
  formatNumber,
  permissionsComponents,
} from "../utils/globalfn";
import {
  getCobranzaDiaria,
  guardarCobranzaDiaria,
  Imprimir,
  ImprimirExcel,
} from "../utils/api/cobranzaDiaria/cobranzaDiaria";
import ModalCobranzaDiaria from "./components/modalCobranzaDiaria";
import { useForm } from "react-hook-form";
import { showSwal } from "../utils/alerts";
import { getFormasPago } from "@/app/utils/api/formapago/formapago";
import { ReportePDF } from "../utils/ReportesPDF";
import ModalVistaPreviaCobranzaDiaria from "./components/modalVistaPreviaCobranzaDiaria";

function Cobranza_Diaria() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [cobranzaDiaria, setCobranzaDiaria] = useState([]);
  const [cobranza, setCobranza] = useState({});
  const date = new Date();
  const dateStr = formatDate(date);
  const [fecha, setFecha] = useState(dateStr.replace(/\//g, "-"));
  const [recibo, setRecibo] = useState("");
  const [accion, setAccion] = useState("");
  const [currentID, setCurrentID] = useState("");
  const [alumno, setAlumno] = useState({});
  const [cheque, setCheque] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [tipoPago, setTipoPago] = useState("");
  const [pdfData, setPdfData] = useState("");
  const [pdfPreview, setPdfPreview] = useState(false);
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    if (status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {};
    fetchData();
  }, [session, status]);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      recibo: cobranza.recibo,
      cue_banco: cobranza.cue_banco,
      referencia: cobranza.referencia,
      importe: formatNumber(cobranza.importe),
    },
  });
  useEffect(() => {
    reset({
      recibo: cobranza.recibo,
      cue_banco: cobranza.cue_banco,
      referencia: cobranza.referencia,
      importe: formatNumber(cobranza.importe),
    });
  }, [cobranza, reset]);
  const showModal = (show) => {
    show
      ? document.getElementById("my_modal_3").showModal()
      : document.getElementById("my_modal_3").close();
  };
  if (status === "loading") {
    return (
      <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  const handleBusqueda = (event) => {
    event.preventDefault;
    setFecha(event.target.value);
  };
  const handleBusquedaChange = (event) => {
    event.preventDefault;
    setRecibo(event.target.value);
  };
  // console.log("cheque", cheque)
  const buscar = async () => {
    setisLoading(true);
    const { token, permissions } = session.user;
    const es_admin = session.user.es_admin;
    const fechaformat = format_Fecha_String(fecha);
    const data = await getCobranzaDiaria(
      token,
      fechaformat,
      cheque,
      recibo,
      alumno.numero
    );
    setCobranzaDiaria(data);
    setisLoading(false);
    const menu_seleccionado = Number(localStorage.getItem("puntoMenu"));
    const permisos = permissionsComponents(
      es_admin,
      permissions,
      session.user.id,
      menu_seleccionado
    );
    setPermissions(permisos);
  };
  const handleBlur = (evt) => {
    if (evt.target.value === "") {
      evt.target.value = 0;
      setValue(evt.target.name, 0);
      return;
    }
    setCobranza((cobranza) => ({
      ...cobranza,
      [evt.target.name]: formatNumber(evt.target.value, 2),
    }));
    setValue(evt.target.name, formatNumber(evt.target.value, 2));
  };
  const handleInputClick = (evt) => {
    evt.preventDefault();
    evt.target.select();
  };
  const onSubmitModal = handleSubmit(async (data) => {
    data.recibo = currentID;
    data.importe = Elimina_Comas(data.importe);
    const res = await guardarCobranzaDiaria(session.user.token, data);
    // data.importe = formatNumber(data.importe)
    if (res.status) {
      if (accion === "Editar") {
        const index = cobranzaDiaria.findIndex((fp) => fp.recibo === currentID);
        if (index !== -1) {
          const actCobranzaDiaria = cobranzaDiaria.map((fp) =>
            fp.recibo === data.recibo ? { ...fp, ...data } : fp
          );
          setCobranzaDiaria(actCobranzaDiaria);
        }
      }
      showSwal(res.alert_title, res.alert_text, res.alert_icon);
      showModal(false);
    } else {
      showSwal(res.alert_title, res.alert_text, res.alert_icon);
      showModal(false);
    }
  });
  const obtenerCuenta = async () => {
    if (
      [2, 3, 4].includes(cobranza.tipo_pago_1) ||
      [2, 3, 4].includes(cobranza.tipo_pago_2)
    ) {
      const { token } = session.user;
      const data = await getFormasPago(token, false);
      const cuenta = data.find((tp) => tp.numero === tipoPago);
      if (cuenta) {
        setValue("cue_banco", cuenta.cue_banco);
      }
    }
  };
  const obtenerImporte = async () => {
    if ([2, 3, 4].includes(cobranza.tipo_pago_1)) {
      const importe = cobranza.importe_pago_1;
      const referencia = cobranza.referencia_1;
      const tp = cobranza.tipo_pago_1;
      setTipoPago(tp);
      setValue("importe", formatNumber(importe));
      setValue("referencia", referencia);
    }
    if ([2, 3, 4].includes(cobranza.tipo_pago_2)) {
      const importe = cobranza.importe_pago_2;
      const referencia = cobranza.referencia_2;
      const tp = cobranza.tipo_pago_2;
      setTipoPago(tp);
      setValue("importe", formatNumber(importe));
      setValue("referencia", referencia);
    }
  };
  const handleVerClick = async () => {
    const { token } = session.user;
    const data = await getFormasPago(token, false);
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Cobranza Diaria",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
    };
    const Enca1 = (doc) => {
      if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalH();
        doc.nextRow(12);
        doc.ImpPosX("Recibo.", 14, doc.tw_ren, 0, "L");
        doc.ImpPosX("TP", 28, doc.tw_ren, 0, "L");
        doc.ImpPosX("Importe", 40, doc.tw_ren, 0, "L");
        doc.ImpPosX("Referencia", 58, doc.tw_ren, 0, "L");
        doc.ImpPosX("TP", 108, doc.tw_ren, 0, "L");
        doc.ImpPosX("Importe", 118, doc.tw_ren, 0, "L");
        doc.ImpPosX("Referencia", 138, doc.tw_ren, 0, "L");
        doc.ImpPosX("TP", 208, doc.tw_ren, 0, "L");
        doc.ImpPosX("Importe", 218, doc.tw_ren, 0, "L");
        doc.ImpPosX("Referencia", 238, doc.tw_ren, 0, "L");
        doc.nextRow(4);
        doc.printLineH();
        doc.nextRow(4);
        doc.tiene_encabezado = true;
      } else {
        doc.nextRow(6);
        doc.tiene_encabezado = true;
      }
    };
    const reporte = new ReportePDF(configuracion, "Landscape");
    Enca1(reporte);
    let sumaTp1 = 0;
    let sumaTp2 = 0;
    let sumaTp3 = 0;
    cobranzaDiaria.forEach((cobranza) => {
      reporte.ImpPosX(cobranza.recibo.toString(), 24, reporte.tw_ren, 0, "R");
      reporte.ImpPosX(
        cobranza.tipo_pago_1.toString(),
        33,
        reporte.tw_ren,
        0,
        "R"
      );
      reporte.ImpPosX(
        formatNumber(cobranza.importe_pago_1.toString(), 2),
        55,
        reporte.tw_ren,
        0,
        "R"
      );
      reporte.ImpPosX(
        cobranza.referencia_1.toString(),
        58,
        reporte.tw_ren,
        0,
        "L"
      );
      reporte.ImpPosX(
        cobranza.tipo_pago_2.toString(),
        113,
        reporte.tw_ren,
        0,
        "R"
      );
      reporte.ImpPosX(
        formatNumber(cobranza.importe_pago_2.toString(), 2),
        128,
        reporte.tw_ren,
        0,
        "R"
      );
      reporte.ImpPosX(
        cobranza.referencia_2.toString(),
        138,
        reporte.tw_ren,
        0,
        "L"
      );
      reporte.ImpPosX(
        cobranza?.cue_banco ? cobranza.cue_banco.toString() : "",
        213,
        reporte.tw_ren,
        0,
        "R"
      );
      reporte.ImpPosX(
        formatNumber(cobranza.importe.toString(), 2),
        228,
        reporte.tw_ren,
        0,
        "R"
      );
      reporte.ImpPosX(
        cobranza?.referencia ? cobranza.referencia.toString() : "",
        238,
        reporte.tw_ren,
        0,
        "L"
      );
      sumaTp1 += cobranza.importe_pago_1;
      sumaTp2 += cobranza.importe_pago_2;
      sumaTp3 += cobranza.importe;
      Enca1(reporte);
      if (reporte.tw_ren >= reporte.tw_endRenH) {
        reporte.pageBreakH();
        Enca1(reporte);
      }
    });
    reporte.nextRow(5);
    reporte.ImpPosX("Total", 14, reporte.tw_ren, 0, "L");
    reporte.ImpPosX(
      formatNumber(sumaTp1.toString(), 2),
      55,
      reporte.tw_ren,
      0,
      "R"
    );
    reporte.ImpPosX(
      formatNumber(sumaTp2.toString(), 2),
      128,
      reporte.tw_ren,
      0,
      "R"
    );
    reporte.ImpPosX(
      formatNumber(sumaTp3.toString(), 2),
      228,
      reporte.tw_ren,
      0,
      "R"
    );
    reporte.nextRow(10);
    reporte.ImpPosX("Detalle de cobros", 14, reporte.tw_ren, 0, "L");
    reporte.nextRow(6);
    data.forEach((tp) => {
      const cobranza = cobranzaDiaria.filter(
        (cobranza) =>
          cobranza.tipo_pago_1 === tp.numero ||
          cobranza.tipo_pago_2 === tp.numero
      );
      const totalTipoPago = cobranza.reduce((acc, cobranza) => {
        let importe = 0;
        if (cobranza.tipo_pago_1 === tp.numero) {
          importe += cobranza.importe_pago_1;
        }
        if (cobranza.tipo_pago_2 === tp.numero) {
          importe += cobranza.importe_pago_2;
        }
        return acc + importe;
      }, 0);
      if (cobranza.length > 0) {
        reporte.ImpPosX(tp.numero.toString(), 29, reporte.tw_ren, 0, "R");
        reporte.ImpPosX(tp.descripcion.toString(), 39, reporte.tw_ren, 0, "L");
        reporte.ImpPosX(
          formatNumber(totalTipoPago.toString(), 2),
          99,
          reporte.tw_ren,
          0,
          "R"
        );
        Enca1(reporte);
      }
    });
    const pdfData = reporte.doc.output("datauristring");
    setPdfData(pdfData);
    setPdfPreview(true);
    showModalVista(true);
  };
  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVPCobranzaDiaria").showModal()
      : document.getElementById("modalVPCobranzaDiaria").close();
  };
  const PDF = async () => {
    const { token } = session.user;
    const data = await getFormasPago(token, false);
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Cobranza Diaria",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: cobranzaDiaria,
      tipoPago: data,
    };
    Imprimir(configuracion);
  };
  const home = () => {
    router.push("/");
  };
  const act_aplica = () => {
    router.push("/act_aplica");
  };
  const ImprimeExcel = async () => {
    const { token } = session.user;
    const formasPago = await getFormasPago(token, false);
    const data = [];
    let sumaTp1 = 0;
    let sumaTp2 = 0;
    let sumaTp3 = 0;
    cobranzaDiaria.forEach((cobranza) => {
      data.push({
        recibo: cobranza.recibo,
        tipo_pago_1: cobranza.tipo_pago_1,
        importe_pago_1: formatNumber(cobranza.importe_pago_1),
        referencia_1: cobranza.referencia_1,
        tipo_pago_2: cobranza.tipo_pago_2,
        importe_pago_2: formatNumber(cobranza.importe_pago_2),
        referencia_2: cobranza.referencia_2,
        cue_banco: cobranza.cue_banco,
        importe: formatNumber(cobranza.importe),
        referencia: cobranza.referencia,
      });
      sumaTp1 += cobranza.importe_pago_1;
      sumaTp2 += cobranza.importe_pago_2;
      sumaTp3 += cobranza.importe;
    });
    data.push({
      recibo: "Total",
      tipo_pago_1: "",
      importe_pago_1: formatNumber(sumaTp1),
      referencia_1: "",
      tipo_pago_2: "",
      importe_pago_2: formatNumber(sumaTp2),
      referencia_2: "",
      cue_banco: "",
      importe: formatNumber(sumaTp3),
      referencia: "",
    });
    data.push({
      recibo: "Detalle de cobros",
      tipo_pago_1: "",
      importe_pago_1: "",
      referencia_1: "",
      tipo_pago_2: "",
      importe_pago_2: "",
      referencia_2: "",
      cue_banco: "",
      importe: "",
      referencia: "",
    });
    formasPago.forEach((tp) => {
      const cobranza = cobranzaDiaria.filter(
        (cobranza) =>
          cobranza.tipo_pago_1 === tp.numero ||
          cobranza.tipo_pago_2 === tp.numero
      );
      const totalTipoPago = cobranza.reduce((acc, cobranza) => {
        let importe = 0;
        if (cobranza.tipo_pago_1 === tp.numero) {
          importe += cobranza.importe_pago_1;
        }
        if (cobranza.tipo_pago_2 === tp.numero) {
          importe += cobranza.importe_pago_2;
        }
        return acc + importe;
      }, 0);
      if (cobranza.length > 0) {
        data.push({
          recibo: tp.numero,
          tipo_pago_1: "",
          importe_pago_1: tp.descripcion,
          referencia_1: "",
          tipo_pago_2: formatNumber(totalTipoPago),
          importe_pago_2: "",
          referencia_2: "",
          cue_banco: "",
          importe: "",
          referencia: "",
        });
      }
    });
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Cobranza Diaria",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: data,
      columns: [
        { header: "Recibo", dataKey: "recibo" },
        { header: "TP", dataKey: "tipo_pago_1" },
        { header: "Impote", dataKey: "importe_pago_1" },
        { header: "Referencia", dataKey: "referencia_1" },
        { header: "TP", dataKey: "tipo_pago_2" },
        { header: "Importe", dataKey: "importe_pago_2" },
        { header: "Referencia", dataKey: "referencia_2" },
        { header: "TP", dataKey: "cue_banco" },
        { header: "Importe", dataKey: "importe" },
        { header: "Referencia", dataKey: "referencia" },
      ],
      nombre: "Cobranza Diaria",
    };
    ImprimirExcel(configuracion);
  };
  return (
    <>
      <ModalVistaPreviaCobranzaDiaria
        pdfData={pdfData}
        pdfPreview={pdfPreview}
        PDF={PDF}
        Excel={ImprimeExcel}
      />
      <ModalCobranzaDiaria
        accion={accion}
        currentID={currentID}
        errors={errors}
        register={register}
        handleBlur={handleBlur}
        onSubmit={onSubmitModal}
        handleInputClick={handleInputClick}
        obtenerCuenta={obtenerCuenta}
        obtenerImporte={obtenerImporte}
      />
      <div className="container h-[80vh] w-full max-w-screen-xl bg-base-200 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden">
        <div className="flex flex-col justify-start p-3">
          <div className="flex flex-wrap md:flex-nowrap items-start md:items-center">
            <div className="order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0">
              <Acciones
                Buscar={buscar}
                actPol={act_aplica}
                home={home}
                imprimir={handleVerClick}
                permiso_alta={permissions.altas}
                permiso_imprime={permissions.impresion}
              />
            </div>
            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
              Cobranza Diaria
            </h1>
          </div>
        </div>
        <div className="flex flex-col items-center h-full">
          <div className="w-full max-w-4xl">
            <Busqueda
              session={session}
              setItem={setAlumno}
              handleBusqueda={handleBusqueda}
              handleBusquedaChange={handleBusquedaChange}
              fecha={fecha}
              setCheque={setCheque}
            />
            <TablaCobranzaDiaria
              cobranzaDiaria={cobranzaDiaria}
              isLoading={isLoading}
              setAccion={setAccion}
              setCobranza={setCobranza}
              setCurrentId={setCurrentID}
              showModal={showModal}
              setTipoPago={setTipoPago}
              permiso_cambio={permissions.cambios}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Cobranza_Diaria;
