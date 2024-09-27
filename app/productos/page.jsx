"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { showSwal, confirmSwal } from "../utils/alerts";
import ModalProductos from "@/app/productos/components/modalProductos";
import TablaProductos from "@/app/productos/components/tablaProductos";
import Busqueda from "@/app/productos/components/Busqueda";
import Acciones from "@/app/productos/components/Acciones";
import ModalVistaPreviaProductos from "./components/modalVistaPreviaProductos";
import { useForm } from "react-hook-form";
import {
  getProductos,
  guardarProductos,
  getLastProduct,
  Imprimir,
  ImprimirExcel,
} from "@/app/utils/api/productos/productos";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { ReportePDF } from "../utils/ReportesPDF";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
function Productos() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [productos, setProductos] = useState([]);
  const [producto, setProducto] = useState({});
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [bajas, setBajas] = useState(false);
  const [openModal, setModal] = useState(false);
  const [accion, setAccion] = useState("");
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
      console.log(token);
      const data = await getProductos(token, bajas);
      setProductos(data);
      setProductosFiltrados(data);
      setisLoading(false);
    };
    fetchData();
  }, [session, status, bajas]);

  useEffect(() => {
    Buscar();
  }, [busqueda]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      numero: producto.numero,
      descripcion: producto.descripcion,
      costo: producto.costo,
      frecuencia: producto.frecuencia,
      por_recargo: producto.por_recargo,
      aplicacion: producto.aplicacion,
      iva: producto.iva,
      cond_1: producto.cond_1,
      cam_precio: producto.cam_precio,
      ref: producto.ref,
    },
  });
  useEffect(() => {
    reset({
      numero: producto.numero,
      descripcion: producto.descripcion,
      costo: producto.costo,
      frecuencia: producto.frecuencia,
      por_recargo: producto.por_recargo,
      aplicacion: producto.aplicacion,
      iva: producto.iva,
      cond_1: producto.cond_1,
      cam_precio: producto.cam_precio,
      ref: producto.ref,
    });
  }, [producto, reset]);

  const Buscar = () => {
    const { tb_id, tb_desc } = busqueda;
    if (tb_id === "" && tb_desc === "") {
      setProductosFiltrados(productos);
      return;
    }
    const infoFiltrada = productos.filter((producto) => {
      const coincideId = tb_id ? producto["numero"].toString().includes(tb_id) : true;
      const coincideDescripcion = tb_desc
        ? producto["descripcion"]
          .toString()
          .toLowerCase()
          .includes(tb_desc.toLowerCase())
        : true;
      return coincideId && coincideDescripcion;
    });
    setProductosFiltrados(infoFiltrada);
  };

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
    // setCurrentId("");
    // const { token } = session.user;
    reset({
      numero: "",
      descripcion: "",
      costo: 0,
      frecuencia: "",
      por_recargo: 0,
      aplicacion: "",
      iva: 0,
      cond_1: 0,
      cam_precio: false,
      ref: "",
    });
    // let siguienteId = await getLastProduct(token);
    // siguienteId = parseInt(siguienteId, 10) + 1;
    setNum("");
    setCurrentId("");
    setDisableNum(false);
    // setProducto({ numero: "" });
    setModal(!openModal);
    setAccion("Alta");
    showModal(true);

    document.getElementById("descripcion").focus();
  };
  const Elimina_Comas = (data) => {
    const convertir = (producto) => {
      const productoConvertido = { ...producto };

      for (const key in productoConvertido) {
        if (
          typeof productoConvertido[key] === "string" &&
          productoConvertido[key].match(/^\d{1,3}(,\d{3})*(\.\d+)?$/)
        ) {
          productoConvertido[key] = parseFloat(
            productoConvertido[key].replace(/,/g, "")
          );
        }
      }

      return productoConvertido;
    };

    if (Array.isArray(data)) {
      return data.map(convertir);
    } else {
      return convertir(data);
    }
  };

  const onSubmitModal = handleSubmit(async (data) => {
    event.preventDefault;
    const dataj = JSON.stringify(data);
    // data.numero = currentID;
    let res = null;
    if (accion === "Eliminar") {
      showModal(false);
      const confirmed = await confirmSwal(
        "¿Desea Continuar?",
        "Se eliminara el producto seleccionado",
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
    res = await guardarProductos(session.user.token, data, accion);
    if (res.status) {
      if (accion === "Alta") {
        const nuevosProductos = { currentID, ...data };
        setProductos([...productos, nuevosProductos]);
        if (!bajas) {
          setProductosFiltrados([...productosFiltrados, nuevosProductos]);
        }
      }
      if (accion === "Eliminar" || accion === "Editar") {
        const index = productos.findIndex((p) => p.numero === data.numero);
        if (index !== -1) {
          if (accion === "Eliminar") {
            const pFiltrados = productos.filter((p) => p.numero !== data.numero);
            setProductos(pFiltrados);
            setProductosFiltrados(pFiltrados);
          } else {
            if (bajas) {
              const pFiltrados = productos.filter((p) => p.numero !== data.numero);
              setProductos(pFiltrados);
              setProductosFiltrados(pFiltrados);
            } else {
              const pActualizadas = productos.map((p) =>
                p.numero === currentID ? { ...p, ...data } : p
              );
              setProductos(pActualizadas);
              setProductosFiltrados(pActualizadas);
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

    };
  });
  const formatValidationErrors = (errors) => {
    let errorMessages = [];
    for (const field in errors) {
      if (errors.hasOwnProperty(field)) {
        const fieldErrors = errors[field];
        if (Array.isArray(fieldErrors)) {
          errorMessages.push(`${field}: ${fieldErrors.join(", ")}`);
        }
      }
    }
    return errorMessages.join("\n");
  };
  const limpiarBusqueda = (evt) => {
    evt.preventDefault;
    setBusqueda({ tb_id: "", tb_desc: "" });
  };

  const imprimirPDF = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Datos Productos",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: productosFiltrados,
    };
    Imprimir(configuracion);
  };

  const imprimirEXCEL = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Datos Productos",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: productosFiltrados,
      columns: [
        { header: "Numero", dataKey: "numero" },
        { header: "Descripcion", dataKey: "descripcion" },
        { header: "Costo", dataKey: "costo" },
        { header: "Frecuencia", dataKey: "frecuencia" },
        { header: "Recargo", dataKey: "por_recargo" },
        { header: "Aplicacion", dataKey: "aplicacion" },
        { header: "IVA", dataKey: "iva" },
        { header: "Condicion", dataKey: "cond_1" },
        { header: "Cambio Precio", dataKey: "cam_precio" },
        { header: "Referencia", dataKey: "ref" },
      ],
      nombre: "Productos",
    };
    ImprimirExcel(configuracion);
  };
  const showModal = (show) => {
    show
      ? document.getElementById("my_modal_3").showModal()
      : document.getElementById("my_modal_3").close();
  };
  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVProducto").showModal()
      : document.getElementById("modalVProducto").close();
  };
  const home = () => {
    router.push("/");
  };
  const handleBusquedaChange = (event) => {
    event.preventDefault;
    setBusqueda((estadoPrevio) => ({
      ...estadoPrevio,
      [event.target.id]: event.target.value,
    }));
  };
  const handleVerClick = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Datos Productos",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
    };
    const Enca1 = (doc) => {
      if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalH();
        doc.nextRow(12);
        doc.ImpPosX("No.", 14, doc.tw_ren);
        doc.ImpPosX("Descripcion", 28, doc.tw_ren);
        doc.ImpPosX("Costo", 80, doc.tw_ren);
        doc.ImpPosX("Frecuencia", 100, doc.tw_ren);
        doc.ImpPosX("Recargo", 130, doc.tw_ren);
        doc.ImpPosX("Aplicacion", 150, doc.tw_ren);
        doc.ImpPosX("IVA", 175, doc.tw_ren);
        doc.ImpPosX("Condicion", 190, doc.tw_ren);
        doc.ImpPosX("Cambio Precio", 215, doc.tw_ren);
        doc.ImpPosX("Referencia", 250, doc.tw_ren);
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
    productosFiltrados.forEach((producto) => {
      reporte.ImpPosX(producto.numero.toString(), 24, reporte.tw_ren, 0, "R");
      reporte.ImpPosX(producto.descripcion.toString(), 28, reporte.tw_ren, 25, "L");
      reporte.ImpPosX(producto.costo.toString(), 93, reporte.tw_ren, 0, "R");
      reporte.ImpPosX(producto.frecuencia.toString(), 100, reporte.tw_ren, 0, "L");
      reporte.ImpPosX(producto.por_recargo.toString(), 143, reporte.tw_ren, 0, "R");
      reporte.ImpPosX(producto.aplicacion.toString(), 150, reporte.tw_ren, 0, "L");
      reporte.ImpPosX(producto.iva.toString(), 183, reporte.tw_ren, 0, "R");
      reporte.ImpPosX(producto.cond_1.toString(), 203, reporte.tw_ren, 0, "R");
      const cam_precio = producto.cam_precio ? "Si" : "No";
      reporte.ImpPosX(cam_precio.toString(), 215, reporte.tw_ren, 0, "L");
      reporte.ImpPosX(producto.ref.toString(), 250, reporte.tw_ren, 0, "L");
      Enca1(reporte);
      if (reporte.tw_ren >= reporte.tw_endRenH) {
        reporte.pageBreakH();
        Enca1(reporte);
      }
    });
    const pdfData = reporte.doc.output("datauristring");
    setPdfData(pdfData);
    setPdfPreview(true);
    showModalVista(true);
  };
  const CerrarView = () => {
    setPdfPreview(false);
    setPdfData("");
  };
  const tableAction = (acc, id) => {
    const producto = productos.find((producto) => producto.numero === id);
    if (producto) {
      setProducto(producto);
      setAccion(acc);
      setDisableNum(true);
      setNum(id);
      setCurrentId(id);
      showModal(true);
    }
  };
  if (status === "loading") {
    return (
      <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  return (
    <>
      <ModalProductos
        accion={accion}
        onSubmit={onSubmitModal}
        currentID={currentID}
        errors={errors}
        register={register}
        setProducto={setProducto}
        producto={producto}
        formatNumber={formatNumber}
        setValue={setValue}
        watch={watch}
        disabledNum={disabledNum}
        num={num}
        setNum={setNum}
      />
      <ModalVistaPreviaProductos
        pdfPreview={pdfPreview}
        pdfData={pdfData}
        PDF={imprimirPDF}
        Excel={ImprimirExcel}
      />
     <div className="container h-[80vh] w-full max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3 overflow-x-auto">
        <div className="flex flex-col justify-start p-3">
          <div className="flex flex-wrap md:flex-nowrap items-start md:items-center">
            <div className="order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0">
              <Acciones
                Buscar={Buscar}
                Alta={Alta}
                home={home}
                Ver={handleVerClick}
              />
            </div>

            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around w-2/12">
            Productos
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
              <TablaProductos
                isLoading={isLoading}
                productosFiltrados={productosFiltrados}
                showModal={showModal}
                setProducto={setProducto}
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

export default Productos;
