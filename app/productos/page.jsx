"use client";
import React, { useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { showSwal, confirmSwal, showSwalConfirm } from "../utils/alerts";
import ModalProductos from "@/app/productos/components/modalProductos";
import ModalProcesarDatos from "@/app/components/modalProcesarDatos";
import TablaProductos from "@/app/productos/components/tablaProductos";
import Busqueda from "@/app/productos/components/Busqueda";
import Acciones from "@/app/productos/components/Acciones";
import VistaPrevia from "@/app/components/VistaPrevia";
import { useForm } from "react-hook-form";
import {
  chunkArray,
  debounce,
  permissionsComponents,
} from "@/app/utils/globalfn";
import {
  getProductos,
  guardarProductos,
  getLastProduct,
  Imprimir,
  ImprimirExcel,
  storeBatchProduct,
} from "@/app/utils/api/productos/productos";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { ReportePDF } from "../utils/ReportesPDF";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { truncateTable, inactiveActiveBaja } from "../utils/GlobalApis";
import BarraCarga from "@/app/components/BarraCarga";
function Productos() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [productos, setProductos] = useState([]);
  const [producto, setProducto] = useState({});
  const [productosFiltrados, setProductosFiltrados] = useState(null);
  const [bajas, setBajas] = useState(false);
  const [openModal, setModal] = useState(false);
  const [accion, setAccion] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [isLoadingButton, setisLoadingButton] = useState(false);
  const [currentID, setCurrentId] = useState("");
  const [filtro, setFiltro] = useState("id");
  // const [TB_Busqueda, setTB_Busqueda] = useState("");
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const [busqueda, setBusqueda] = useState({ tb_id: "", tb_desc: "" });
  const [disabledNum, setDisableNum] = useState(false);
  const [num, setNum] = useState("");
  const [animateLoading, setAnimateLoading] = useState(false);
  const [permissions, setPermissions] = useState({});
  const productosRef = useRef(productos);
  //useState para los datos que se trae del excel
  const [dataJson, setDataJson] = useState([]);
  const [reload_page, setReloadPage] = useState(false);
  const [porcentaje, setPorcentaje] = useState(0);
  const [cerrarTO, setCerrarTO] = useState(false);
  // console.log(dataJson);

  useEffect(() => {
    productosRef.current = productos;
  }, [productos]);

  const Buscar = useCallback(() => {
    const { tb_id, tb_desc } = busqueda;
    if (tb_id === "" && tb_desc === "") {
      setProductosFiltrados(productosRef.current);
      return;
    }
    const infoFiltrada = productosRef.current.filter((producto) => {
      const coincideId = tb_id
        ? producto["numero"].toString().includes(tb_id)
        : true;
      const coincideDescripcion = tb_desc
        ? producto["descripcion"]
            .toString()
            .toLowerCase()
            .includes(tb_desc.toLowerCase())
        : true;
      return coincideId && coincideDescripcion;
    });
    setProductosFiltrados(infoFiltrada);
  }, [busqueda]);

  const debouncedBuscar = useMemo(() => debounce(Buscar, 500), [Buscar]);

  useEffect(() => {
    debouncedBuscar();
    return () => {
      clearTimeout(debouncedBuscar);
    };
  }, [busqueda, debouncedBuscar]);

  useEffect(() => {
    const fetchData = async () => {
      setisLoading(true);
      let { token, permissions } = session.user;
      const es_admin = session.user.es_admin;
      const menuSeleccionado = Number(localStorage.getItem("puntoMenu"));

      const data = await getProductos(token, bajas);
      setProductos(data);
      setProductosFiltrados(data);
      setisLoading(false);
      const permisos = permissionsComponents(
        es_admin,
        permissions,
        session.user.id,
        menuSeleccionado
      );
      setPermissions(permisos);
    };
    if (status === "loading" || !session) {
      return;
    }
    fetchData();
  }, [session, status, bajas, reload_page]);

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
    setProducto({});
    setNum("");
    setCurrentId("");
    setDisableNum(false);
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
    setisLoadingButton(true);
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
        setisLoadingButton(false);
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
            const pFiltrados = productos.filter(
              (p) => p.numero !== data.numero
            );
            setProductos(pFiltrados);
            setProductosFiltrados(pFiltrados);
          } else {
            if (bajas) {
              const pFiltrados = productos.filter(
                (p) => p.numero !== data.numero
              );
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
      showSwal(res.alert_title, res.alert_text, "error", "my_modal_3");
    }
    setisLoadingButton(false);
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

  const procesarDatos = () => {
    showModalProcesa(true);
  };

  const showModal = (show) => {
    show
      ? document.getElementById("my_modal_3").showModal()
      : document.getElementById("my_modal_3").close();
  };

  const showModalProcesa = (show) => {
    show
      ? document.getElementById("my_modal_4").showModal()
      : document.getElementById("my_modal_4").close();
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
    setAnimateLoading(true);
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
      reporte.ImpPosX(
        producto.descripcion.toString(),
        28,
        reporte.tw_ren,
        25,
        "L"
      );
      reporte.ImpPosX(producto.costo.toString(), 93, reporte.tw_ren, 0, "R");
      reporte.ImpPosX(
        producto.frecuencia.toString(),
        100,
        reporte.tw_ren,
        0,
        "L"
      );
      reporte.ImpPosX(
        producto.por_recargo.toString(),
        143,
        reporte.tw_ren,
        0,
        "R"
      );
      reporte.ImpPosX(
        producto.aplicacion.toString(),
        150,
        reporte.tw_ren,
        0,
        "L"
      );
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
    setTimeout(() => {
      const pdfData = reporte.doc.output("datauristring");
      setPdfData(pdfData);
      setPdfPreview(true);
      showModalVista(true);
      setAnimateLoading(false);
    }, 500);
  };

  const CerrarView = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVProducto").close();
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

  useEffect(() => {
    const fetchData = async () => {
      const res = await inactiveActiveBaja(session.user.token, "productos");
      if (res.status) {
        const { inactive, active } = res.data;
        showSwalConfirm(
          "Estado de los productos",
          `Productos activos: ${active}\nProductos inactivos: ${inactive}`,
          "info"
        );
      }
    };
    if (status === "loading" || !session) {
      return;
    }
    fetchData();
  }, [reload_page]);

  const buttonProcess = async () => {
    document.getElementById("cargamodal").showModal();
    event.preventDefault();
    setisLoadingButton(true);
    const { token } = session.user;
    await truncateTable(token, "productos");
    const chunks = chunkArray(dataJson, 20);
    let allErrors = "";
    let chunksProcesados = 0;
    let numeroChunks = chunks.length;
    for (let chunk of chunks) {
      const res = await storeBatchProduct(token, chunk);
      chunksProcesados++;
      const progreso = (chunksProcesados / numeroChunks) * 100;
      setPorcentaje(Math.round(progreso));
      if (!res.status) {
        allErrors += res.alert_text;
      }
    }
    setCerrarTO(true);
    setisLoadingButton(false);
    setDataJson([]);
    setPorcentaje(0);
    if (allErrors) {
      showSwalConfirm("Error", allErrors, "error", "my_modal_4");
    } else {
      showSwal(
        "Éxito",
        "Todos los productos se insertaron correctamente.",
        "success"
        // "my_modal_4"
      );
      showModalProcesa(false);
    }
    setTimeout(() => {
      setReloadPage(!reload_page);
    }, 3500);
  };

  const handleFileChange = async (e) => {
    const confirmed = await confirmSwal(
      "¿Desea Continuar?",
      "Por favor, verifica que las columnas del archivo de Excel coincidan exactamente con las columnas de la tabla en la base de datos y que no contengan espacios en blanco.",
      "warning",
      "Aceptar",
      "Cancelar",
      "my_modal_4"
    );
    if (!confirmed) {
      return;
    }
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        // console.log(jsonData);
        const convertedData = jsonData.map((item) => {
          return {
            numero: String(item.Numero || 0).trim(),
            descripcion:
              item.Descripcion && String(item.Descripcion).trim() !== ""
                ? String(item.Descripcion).slice(0, 255)
                : "N/A",
            costo: parseFloat(item.Costo || 0),
            frecuencia:
              item.Frecuencia && String(item.Frecuencia).trim() !== ""
                ? String(item.Frecuencia).slice(0, 20)
                : "N/A",
            por_recargo: parseFloat(item.Por_Recargo || 0),
            aplicacion:
              item.Aplicacion && String(item.Aplicacion).trim() !== ""
                ? String(item.Aplicacion).slice(0, 25)
                : "N/A",
            iva: parseFloat(item.IVA || 0),
            cond_1: parseInt(item.Cond_1 || 0),
            cam_precio: item.Cam_Precio ? 1 : 0,
            ref:
              item.Ref && item.Ref.trim() !== ""
                ? String(item.Ref).slice(0, 20)
                : "N/A",
            baja:
              item.Baja && item.Baja.trim() !== ""
                ? String(item.Baja).slice(0, 1)
                : "n",
          };
        });
        console.log(convertedData);
        setDataJson(convertedData);
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const itemHeaderTable = () => {
    return (
      <>
        <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
        <td className="w-[40%]">Descripcion</td>
        <td className="w-[15%]">Costo</td>
        <td className="w-[15%]">Frecuencia</td>
        <td className="w-[10%]">Recargo</td>
        <td className="w-[15%]">Aplicacion</td>
        <td className="w-[10%]">IVA</td>
        <td className="w-[10%]">Condición</td>
        <td className="w-[10%]">Cambia Precio</td>
        <td className="w-[10%]">Referencia</td>
        <td className="w-[10%]">Baja</td>
      </>
    );
  };

  const itemDataTable = (item) => {
    return (
      <>
        <tr key={item.numero} className="hover:cursor-pointer">
          <th
            className={
              typeof item.numero === "number" ? "text-left" : "text-right"
            }
          >
            {item.numero}
          </th>
          <td className="w-[40%] max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap pt-[.10rem] pb-[.10rem]">
            {item.descripcion}
          </td>
          <td className="text-right">{formatNumber(item.costo)}</td>
          <td className="text-left">{item.frecuencia}</td>
          <td className="text-right">{item.por_recargo}</td>
          <td className="text-right">{item.aplicacion}</td>
          <td className="text-right">{item.iva}</td>
          <td className="text-right">{item.cond_1}</td>
          <td className="text-right">{item.cam_precio}</td>
          <td className="text-left">{item.ref}</td>
          <td className="text-left">{item.baja}</td>
        </tr>
      </>
    );
  };

  if (status === "loading") {
    return (
      <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  return (
    <>
      <BarraCarga porcentaje={porcentaje} cerrarTO={cerrarTO} />
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
        productos={productos}
        isLoadingButton={isLoadingButton}
      />
      <ModalProcesarDatos
        id_modal={"my_modal_4"}
        session={session}
        buttonProcess={buttonProcess}
        isLoadingButton={isLoadingButton}
        isLoading={isLoading}
        title={"Procesar Datos desde Excel."}
        setDataJson={setDataJson}
        dataJson={dataJson}
        handleFileChange={handleFileChange}
        itemHeaderTable={itemHeaderTable}
        itemDataTable={itemDataTable}
        //clase para mover al tamaño del modal a preferencia (max-w-4xl)
        classModal={"modal-box w-full max-w-4xl h-full bg-base-200"}
      />
      <VistaPrevia
        id={"modalVProducto"}
        titulo={"Vista Previa de Productos"}
        pdfPreview={pdfPreview}
        pdfData={pdfData}
        PDF={imprimirPDF}
        Excel={imprimirEXCEL}
        CerrarView={CerrarView}
      />
      <div className="container h-[80vh] w-full max-w-screen-xl bg-base-200 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden">
        <div className="flex flex-col justify-start p-3">
          <div className="flex flex-wrap md:flex-nowrap items-start md:items-center">
            <div className="order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0">
              <Acciones
                Buscar={Buscar}
                Alta={Alta}
                home={home}
                Ver={handleVerClick}
                procesarDatos={procesarDatos}
                animateLoading={animateLoading}
                permiso_alta={permissions.altas}
                permiso_imprime={permissions.impresion}
              />
            </div>

            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
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
            {status === "loading" || !session ? (
              <></>
            ) : (
              <TablaProductos
                isLoading={isLoading}
                productosFiltrados={productosFiltrados}
                showModal={showModal}
                setProducto={setProducto}
                setAccion={setAccion}
                setCurrentId={setCurrentId}
                formatNumber={formatNumber}
                tableAction={tableAction}
                session={session}
                permiso_cambio={permissions.cambios}
                permiso_baja={permissions.bajas}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Productos;
