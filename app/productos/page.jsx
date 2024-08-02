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
import '@react-pdf-viewer/core/lib/styles/index.css';
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
  const [TB_Busqueda, setTB_Busqueda] = useState("");
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");

  useEffect(() => {
    if (status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {
      setisLoading(true);
      const { token } = session.user;
      const data = await getProductos(token, bajas);
      setProductos(data);
      setProductosFiltrados(data);
      if (filtro !== "" && TB_Busqueda !== "") {
        Buscar();
      }
      setisLoading(false);
    };
    fetchData();
  }, [session, status, bajas]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: producto.id,
      descripcion: producto.descripcion,
      costo: producto.costo,
      frecuencia: producto.frecuencia,
      pro_recargo: producto.pro_recargo,
      aplicacion: producto.aplicacion,
      iva: producto.iva,
      cond_1: producto.cond_1,
      cam_precio: producto.cam_precio,
      ref: producto.ref,
    },
  });
  useEffect(() => {
    reset({
      id: producto.id,
      descripcion: producto.descripcion,
      costo: producto.costo,
      frecuencia: producto.frecuencia,
      pro_recargo: producto.pro_recargo,
      aplicacion: producto.aplicacion,
      iva: producto.iva,
      cond_1: producto.cond_1,
      cam_precio: producto.cam_precio,
      ref: producto.ref,
    });
  }, [producto, reset]);

  const Buscar = () => {
    if (TB_Busqueda === "" || filtro === "") {
      setProductosFiltrados(productos);
      return;
    }
    const infoFiltrada = productos.filter((producto) => {
      const valorCampo = producto[filtro];
      if (typeof valorCampo === "number") {
        return valorCampo.toString().includes(TB_Busqueda);
      }
      return valorCampo
        ?.toString()
        .toLowerCase()
        .includes(TB_Busqueda.toLowerCase());
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
    setCurrentId("");
    const { token } = session.user;
    reset({
      id: "",
      descripcion: "",
      costo: 0,
      frecuencia: "",
      pro_recargo: 0,
      aplicacion: "",
      iva: 0,
      cond_1: 0,
      cam_precio: false,
      ref: "",
    });
    let siguienteId = await getLastProduct(token);
    siguienteId = Number(siguienteId + 1);
    setCurrentId(siguienteId);
    setProducto({ id: siguienteId });
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
    data.id = currentID;
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
        const index = productos.findIndex((p) => p.id === data.id);
        if (index !== -1) {
          if (accion === "Eliminar") {
            const pFiltrados = productos.filter((p) => p.id !== data.id);
            setProductos(pFiltrados);
            setProductosFiltrados(pFiltrados);
          } else {
            if (bajas) {
              const pFiltrados = productos.filter((p) => p.id !== data.id);
              setProductos(pFiltrados);
              setProductosFiltrados(pFiltrados);
            } else {
              const pActualizadas = productos.map((p) =>
                p.id === currentID ? { ...p, ...data } : p
              );
              setProductos(pActualizadas);
              setProductosFiltrados(pActualizadas);
            }
          }
        }
      }
      showSwal(res.alert_title, res.alert_text, res.alert_icon);
      showModal(false);
    }
  });
  const limpiarBusqueda = (evt) => {
    evt.preventDefault;
    setTB_Busqueda("");
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
        { header: "Numero", dataKey: "id" },
        { header: "Descripcion", dataKey: "descripcion" },
        { header: "Costo", dataKey: "costo" },
        { header: "Frecuencia", dataKey: "frecuencia" },
        { header: "Recargo", dataKey: "pro_recargo" },
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
  }
  const home = () => {
    router.push("/");
  };
  const handleBusquedaChange = (event) => {
    event.preventDefault;
    setTB_Busqueda(event.target.value);
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
    const reporte = new ReportePDF(configuracion, "Landscape")
    Enca1(reporte);
    productosFiltrados.forEach((producto) => {
      reporte.ImpPosX(producto.id.toString(), 14, reporte.tw_ren);
      reporte.ImpPosX(producto.descripcion.toString(), 28, reporte.tw_ren);
      reporte.ImpPosX(producto.costo.toString(), 80, reporte.tw_ren);
      reporte.ImpPosX(producto.frecuencia.toString(), 100, reporte.tw_ren);
      reporte.ImpPosX(producto.pro_recargo.toString(), 130, reporte.tw_ren);
      reporte.ImpPosX(producto.aplicacion.toString(), 150, reporte.tw_ren);
      reporte.ImpPosX(producto.iva.toString(), 175, reporte.tw_ren);
      reporte.ImpPosX(producto.cond_1.toString(), 190, reporte.tw_ren);
      const cam_precio = producto.cam_precio ? "Si" : "No";
      reporte.ImpPosX(cam_precio.toString(), 215, reporte.tw_ren);
      console.log(cam_precio);
      reporte.ImpPosX(producto.ref.toString(), 250, reporte.tw_ren);
      Enca1(reporte);
      if (reporte.tw_ren >= reporte.tw_endRenH) {
        reporte.pageBreakH();
        Enca1(reporte);
      }
    })
    const pdfData = reporte.doc.output("datauristring")
    setPdfData(pdfData)
    setPdfPreview(true)
    showModalVista(true)
  }
  const CerrarView = () => {
    setPdfPreview(false);
    setPdfData('');
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
      />
      <ModalVistaPreviaProductos pdfPreview={pdfPreview} pdfData={pdfData} PDF={imprimirPDF} Excel={ImprimirExcel}/>      
      <div className="container  w-full  max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3 ">
        <div className="flex justify-start p-3 ">
          <h1 className="text-4xl font-xthin text-black dark:text-white md:px-12">
            Productos.
          </h1>
        </div>
        <div className="container grid grid-cols-8 grid-rows-1 h-[calc(100%-20%)] ">
          <div className="col-span-1 flex flex-col ">
            <Acciones
              Buscar={Buscar}
              Alta={Alta}
              home={home}
              imprimirEXCEL={imprimirEXCEL}
              imprimirPDF={imprimirPDF}
              Ver={handleVerClick}
              CerrarView={CerrarView}
            ></Acciones>
          </div>
          <div className="col-span-7  ">
            <div className="flex flex-col h-[calc(100%)]">
              <Busqueda
                setBajas={setBajas}
                setFiltro={setFiltro}
                limpiarBusqueda={limpiarBusqueda}
                Buscar={Buscar}
                handleBusquedaChange={handleBusquedaChange}
                TB_Busqueda={TB_Busqueda}
                setTB_Busqueda={setTB_Busqueda}
              />
                <TablaProductos
                  isLoading={isLoading}
                  productosFiltrados={productosFiltrados}
                  showModal={showModal}
                  setProducto={setProducto}
                  setAccion={setAccion}
                  setCurrentId={setCurrentId}
                  formatNumber={formatNumber}
                />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Productos;
