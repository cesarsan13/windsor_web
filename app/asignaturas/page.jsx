"use client";
import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { showSwal, confirmSwal } from "../utils/alerts";
import ModalAsignaturas from "@/app/asignaturas/components/modalAsignaturas";
import TablaAsignaturas from "@/app/asignaturas/components/tablaAsignaturas";
import Busqueda from "@/app/asignaturas/components/Busqueda";
import Acciones from "@/app/asignaturas/components/Acciones";
import ModalVistaPreviaAsignaturas from "./components/modalVistaPreviaAsignaturas";
import VistaPrevia from "@/app/components/VistaPrevia";
import { soloDecimales, soloEnteros, snToBool } from "@/app/utils/globalfn";
import { useForm } from "react-hook-form";
import {
  getAsignaturas,
  filtroAsignaturas,
  guardarAsinatura,
  getLastSubject,
  Imprimir,
  ImprimirExcel,
} from "@/app/utils/api/asignaturas/asignaturas";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { debounce } from "../utils/globalfn";

function Asignaturas() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [asignaturas, setAsignaturas] = useState([]);
  const [asignatura, setAsignatura] = useState({});
  const [asignaturasFiltrados, setAsignaturasFiltrados] = useState([]);
  const [bajas, setBajas] = useState(false);
  const [openModal, setModal] = useState(false);
  const [accion, setAccion] = useState("");
  const [animateLoading, setAnimateLoading] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [currentID, setCurrentId] = useState("");
  const [filtro, setFiltro] = useState("id");
  // const [TB_Busqueda, setTB_Busqueda] = useState("");
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const [busqueda, setBusqueda] = useState({ tb_id: "", tb_desc: "" });
  const [disabledNum, setDisableNum] = useState(false);
  const [num, setNum] = useState("");

  useEffect(() => {
    if (status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {
      setisLoading(true);
      const { token } = session.user;
      // console.log(token);
      const data = await getAsignaturas(token, bajas);
      setAsignaturas(data);
      setAsignaturasFiltrados(data);
      setisLoading(false);
    };
    fetchData();
  }, [session, status, bajas]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      numero: asignatura.numero,
      descripcion: asignatura.descripcion,
      evaluaciones: asignatura.evaluaciones,
      actividad: asignatura.actividad,
      area: asignatura.area,
      orden: asignatura.orden,
      lenguaje: asignatura.lenguaje,
      caso_evaluar: asignatura.caso_evaluar,
    },
  });
  useEffect(() => {
    reset({
      numero: asignatura.numero,
      descripcion: asignatura.descripcion,
      evaluaciones: asignatura.evaluaciones,
      actividad: asignatura.actividad,
      area: asignatura.area,
      orden: asignatura.orden,
      lenguaje: asignatura.lenguaje,
      caso_evaluar: asignatura.caso_evaluar,
    });
  }, [asignatura, reset]);

  const Buscar = useCallback(() => {
    const { tb_id, tb_desc } = busqueda;
    if (tb_id === "" && tb_desc === "") {
      setAsignaturasFiltrados(asignaturas);
      return;
    }
    const infoFiltrada = asignaturas.filter((asignatura) => {
      const coincideId = tb_id
        ? asignatura["numero"].toString().includes(tb_id)
        : true;
      const coincideDescripcion = tb_desc
        ? asignatura["descripcion"]
            .toString()
            .toLowerCase()
            .includes(tb_desc.toLowerCase())
        : true;
      return coincideId && coincideDescripcion;
    });
    setAsignaturasFiltrados(infoFiltrada);
  }, [busqueda, asignaturas]);

  useEffect(() => {
    const debouncedBuscar = debounce(Buscar, 300);
    debouncedBuscar();
    return () => {
      clearTimeout(debouncedBuscar);
    };
  }, [busqueda, Buscar]);

  const formatNumber = (num) => {
    if (!num) return "";
    const numStr = typeof num === "string" ? num : num.toString();
    const floatNum = parseFloat(
      numStr.replace(/,/g, "").replace(/[^\d.-]/g, "")
    );
    if (isNaN(floatNum)) return "";
    return floatNum.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const Alta = async (event) => {
    const { token } = session.user;
    setCurrentId("");
    reset({
      numero: 0,
      descripcion: "",
      evaluaciones: 0,
      actividad: snToBool(""),
      area: 0,
      orden: 0,
      lenguaje: "",
      caso_evaluar: "",
    });
    setDisableNum(false);
    setAsignatura({ numero: "" });
    setModal(!openModal);
    setAccion("Alta");
    showModal(true);

    document.getElementById("descripcion").focus();
  };

  const Elimina_Comas = (data) => {
    const convertir = (asignatura) => {
      const asignaturaConvertido = { ...asignatura };

      for (const key in asignaturaConvertido) {
        if (
          typeof asignaturaConvertido[key] === "string" &&
          asignaturaConvertido[key].match(/^\d{1,3}(,\d{3})*(\.\d+)?$/)
        ) {
          asignaturaConvertido[key] = parseFloat(
            asignaturaConvertido[key].replace(/,/g, "")
          );
        }
      }

      return asignaturaConvertido;
    };

    if (Array.isArray(data)) {
      return data.map(convertir);
    } else {
      return convertir(data);
    }
  };
  const ConvertSNtoBool = (string) => {
    if (string == "Si") {
      return true;
    } else {
      return true;
    }
  };
  const onSubmitModal = handleSubmit(async (data) => {
    event.preventDefault;
    const dataj = JSON.stringify(data);
    let res = null;
    if (accion === "Eliminar") {
      showModal(false);
      const confirmed = await confirmSwal(
        "¿Desea Continuar?",
        "Se eliminara la asignatura seleccionada",
        "warning",
        "Aceptar",
        "Cancelar"
      );
      if (!confirmed) {
        showModal(true);
        return;
      }
    }
    data.numero = num || currentID;
    data = await Elimina_Comas(data);
    res = await guardarAsinatura(session.user.token, data, accion, data.numero);

    if (res.status) {
      if (accion === "Alta") {
        data.numero = res.data;
        const nuevasAsignaturas = { currentID, ...data };
        setAsignaturas([...asignaturas, nuevasAsignaturas]);
        if (!bajas) {
          setAsignaturasFiltrados([...asignaturasFiltrados, nuevasAsignaturas]);
        }
      }
      if (accion === "Eliminar" || accion === "Editar") {
        const index = asignaturas.findIndex((p) => p.numero === data.numero);
        if (index !== -1) {
          if (accion === "Eliminar") {
            const aFiltrados = asignaturas.filter(
              (p) => p.numero !== data.numero
            );
            setAsignaturas(aFiltrados);
            setAsignaturasFiltrados(aFiltrados);
          } else {
            if (bajas) {
              const aFiltrados = asignaturas.filter(
                (p) => p.numero !== data.numero
              );
              setAsignaturas(aFiltrados);
              setAsignaturasFiltrados(aFiltrados);
            } else {
              const aActualizadas = asignaturas.map((p) =>
                p.numero === currentID ? { ...p, ...data } : p
              );
              setAsignaturas(aActualizadas);
              setAsignaturasFiltrados(aActualizadas);
            }
          }
        }
      }
      showSwal(res.alert_title, res.alert_text, res.alert_icon);
      showModal(false);
    } else {
      // const alertText = res.alert_text ? formatValidationErrors(res.alert_text) : "Error desconocido";
      // console.log(alertText);
      showModal(false);
      const confirmed = await confirmSwal(
        res.alert_title,
        res.alert_text,
        res.alert_icon,
        "Aceptar",
        "Cancelar"
      );
      if (!confirmed) {
        showModal(true);
        return;
      } else {
        showModal(true);
        return;
      }
    }
  });
  const limpiarBusqueda = (evt) => {
    evt.preventDefault();
    setBusqueda({ tb_id: "", tb_desc: "" });
  };
  const showModal = (show) => {
    show
      ? document.getElementById("my_modal_3").showModal()
      : document.getElementById("my_modal_3").close();
  };
  const showModalVista = (show) => {
    if (show) {
      document.getElementById("modalVAsignatura").showModal();
    }
  };
  const cerrarModalVista = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVAsignatura").close();
  };
  const home = () => {
    router.push("/");
  };
  const handleBusquedaChange = (event) => {
    setBusqueda((estadoPrevio) => ({
      ...estadoPrevio,
      [event.target.id]: event.target.value,
    }));
  };
  const handleVerClick = () => {
    setAnimateLoading(true);
    cerrarModalVista();
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Datos Asignaturas",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
    };
    const Enca1 = (doc) => {
      if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalH();
        doc.nextRow(12);
        doc.ImpPosX("No.", 14, doc.tw_ren);
        doc.ImpPosX("Asignatura", 28, doc.tw_ren);
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
    asignaturasFiltrados.forEach((asignatura) => {
      reporte.ImpPosX(asignatura.numero.toString(), 24, reporte.tw_ren, 0, "R");
      reporte.ImpPosX(
        asignatura.descripcion.toString(),
        28,
        reporte.tw_ren,
        25,
        "L"
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

    // const pdfData = reporte.doc.output("datauristring");
    // setPdfData(pdfData);
    // setPdfPreview(true);
    // setAnimateLoading(true);
    // showModalVista(true);
  };
  const tableAction = (acc, id) => {
    const asignatura = asignaturas.find(
      (asignatura) => asignatura.numero === id
    );
    if (asignatura) {
      asignatura.actividad = snToBool(asignatura.actividad);
      setAsignatura(asignatura);
      setAccion(acc);
      setDisableNum(true);
      setNum(id);
      setCurrentId(id);
      showModal(true);
    }
  };
  const imprimirPDF = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Datos Asignaturas",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: asignaturasFiltrados,
    };
    Imprimir(configuracion);
  };
  const imprimirEXCEL = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Datos Asignaturas",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: asignaturasFiltrados,
      columns: [
        { header: "Numero", dataKey: "numero" },
        { header: "Descripcion", dataKey: "descripcion" },
      ],
      nombre: "Asignaturas",
    };
    ImprimirExcel(configuracion);
  };
  if (status === "loading") {
    return (
      <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  return (
    <>
      <ModalAsignaturas
        accion={accion}
        onSubmit={onSubmitModal}
        currentID={currentID}
        errors={errors}
        register={register}
        setProducto={setAsignatura}
        producto={asignatura}
        formatNumber={formatNumber}
        setValue={setValue}
        watch={watch}
        disabledNum={disabledNum}
        num={num}
        // setNum={setNum}
        getValues={getValues}
      />
      <VistaPrevia
        id={"modalVAsignatura"}
        titulo={"Vista Previa de Asignaturas"}
        pdfPreview={pdfPreview}
        pdfData={pdfData}
        PDF={imprimirPDF}
        Excel={imprimirEXCEL}
        CerrarView={cerrarModalVista}
      />
      <div className="container h-[80vh] w-full max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden">
        <div className="flex flex-col justify-start p-3">
          <div className="flex flex-wrap md:flex-nowrap items-start md:items-center">
            <div className="order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0">
              <Acciones
                Buscar={Buscar}
                Alta={Alta}
                home={home}
                Ver={handleVerClick}
                isLoading={animateLoading}
              />
            </div>

            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
              Asignaturas
            </h1>
          </div>
        </div>
        <div className="flex flex-col items-center h-full">
          <div className="w-full max-w-4xl">
            <Busqueda
              setBajas={setBajas}
              limpiarBusqueda={limpiarBusqueda}
              Buscar={Buscar}
              handleBusquedaChange={handleBusquedaChange}
              busqueda={busqueda}
            />
            <TablaAsignaturas
              isLoading={isLoading}
              asignaturasFiltrados={asignaturasFiltrados}
              showModal={showModal}
              setAsignatura={setAsignatura}
              setAccion={setAccion}
              setCurrentId={setCurrentId}
              formatNumber={formatNumber}
              tableAction={tableAction}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Asignaturas;
