"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { showSwal, confirmSwal } from "../utils/alerts";
import ModalProductos from "@/app/productos/components/modalProductos";
import TablaProductos from "@/app/productos/components/tablaProductos";
import Busqueda from "@/app/productos/components/Busqueda";
import Acciones from "@/app/productos/components/Acciones";
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
  const [filtro, setFiltro] = useState("");
  const [TB_Busqueda, setTB_Busqueda] = useState("");

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
    console.log(data);
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
    console.log(data);
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
  const home = () => {
    router.push("/");
  };
  const handleBusquedaChange = (event) => {
    event.preventDefault;
    setTB_Busqueda(event.target.value);
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
      <div className="container  w-full  max-w-screen-xl bg-slate-100 shadow-xl rounded-xl px-3 ">
        <div className="flex justify-start p-3 ">
          <h1 className="text-4xl font-xthin text-black md:px-12">
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
