"use client";
import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { showSwal, confirmSwal } from "../utils/alerts";
import ModalCajeros from "@/app/cajeros/components/modalCajeros";
import TablaCajeros from "./components/tablaCajeros";
import Busqueda from "./components/Busqueda";
import Acciones from "@/app/cajeros/components/Acciones";
import { useForm } from "react-hook-form";
import {
  getCajeros,
  guardaCajero,
  Imprimir,
  ImprimirExcel,
} from "@/app/utils/api/cajeros/cajeros";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { siguiente } from "@/app/utils/api/cajeros/cajeros";
import "jspdf-autotable";
import ModalVistaPreviaCajeros from "./components/modalVistaPreviaCajeros";
import VistaPrevia from "@/app/components/VistaPrevia";
import { ReportePDF } from "../utils/ReportesPDF";
import { debounce } from "../utils/globalfn";

function Cajeros() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [cajeros, setCajeros] = useState([]); //formasPago
  const [cajero, setCajero] = useState({}); //formaPago
  const [cajerosFiltrados, setCajerosFiltrados] = useState([]);
  const [bajas, setBajas] = useState(false);
  const [openModal, setModal] = useState(false);
  const [accion, setAccion] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [currentID, setCurrentId] = useState("");
  const [pdfPreview, setPdfPreview] = useState(false);
  const [animateLoading, setAnimateLoading] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const [busqueda, setBusqueda] = useState({
    tb_id: "",
    tb_desc: "",
    tb_correo: "",
    tb_tel: "",
  });

  useEffect(() => {
    if (status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {
      setisLoading(true);
      const { token } = session.user;
      const data = await getCajeros(token, bajas);
      setCajeros(data);
      setCajerosFiltrados(data);
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
      numero: cajero.numero,
      nombre: cajero.nombre,
      direccion: cajero.direccion,
      colonia: cajero.colonia,
      telefono: cajero.telefono,
      estado: cajero.estado,
      fax: cajero.fax,
      mail: cajero.mail,
      clave_cajero: cajero.clave_cajero,
    },
  });
  useEffect(() => {
    reset({
      numero: cajero.numero,
      nombre: cajero.nombre,
      direccion: cajero.direccion,
      colonia: cajero.colonia,
      telefono: cajero.telefono,
      estado: cajero.estado,
      fax: cajero.fax,
      mail: cajero.mail,
      clave_cajero: cajero.clave_cajero,
    });
  }, [cajero, reset]);
  const Buscar = useCallback(() => {
    const { tb_id, tb_desc, tb_correo, tb_tel } = busqueda;
    if (tb_id === "" && tb_desc === "" && tb_correo === "" && tb_tel === "") {
      setCajerosFiltrados(cajeros);
      return;
    }
    const infoFiltrada = cajeros.filter((cajero) => {
      const coincideNumero = tb_id
        ? cajero["numero"].toString().includes(tb_id)
        : true;
      const coincideNombre = tb_desc
        ? cajero["nombre"]
            .toString()
            .toLowerCase()
            .includes(tb_desc.toLowerCase())
        : true;
      const coincideCorreo = tb_correo
        ? cajero["mail"]
            .toString()
            .toLowerCase()
            .includes(tb_correo.toLowerCase())
        : true;
      const coincideTelefono = tb_tel
        ? cajero["telefono"].toString().includes(tb_tel)
        : true;
      return (
        coincideNumero && coincideNombre && coincideCorreo && coincideTelefono
      );
    });
    setCajerosFiltrados(infoFiltrada);
  }, [busqueda, cajeros]);

  useEffect(() => {
    const debouncedBuscar = debounce(Buscar, 300);
    debouncedBuscar();
    return () => {
      clearTimeout(debouncedBuscar);
    };
  }, [busqueda, Buscar]);

  const limpiarBusqueda = (evt) => {
    evt.preventDefault();
    setBusqueda({ tb_id: "", tb_desc: "", tb_correo: "", tb_tel: "" });
  };

  const Alta = async (event) => {
    setCurrentId("");
    const { token } = session.user;
    reset({
      numero: "",
      nombre: "",
      direccion: "",
      colonia: "",
      estado: "",
      telefono: "",
      fax: "",
      mail: "",
      clave_cajero: "",
    });
    let siguienteId = await siguiente(token);
    siguienteId = Number(siguienteId) + 1;
    setCurrentId(siguienteId);
    setCajero({ numero: siguienteId });
    setModal(!openModal);
    setAccion("Alta");
    showModal(true);

    document.getElementById("nombre").focus();
  };

  const onSubmitModal = handleSubmit(async (data) => {
    event.preventDefault;
    // const dataj = JSON.stringify(data);
    data.id = currentID;
    let res = null;
    if (accion === "Eliminar") {
      showModal(false);
      const confirmed = await confirmSwal(
        "¿Desea Continuar?",
        "Se eliminara el cajero seleccionado",
        "warning",
        "Aceptar",
        "Cancelar"
      );
      if (!confirmed) {
        showModal(true);
        return;
      }
      // showModal(true);
    }
    res = await guardaCajero(session.user.token, data, accion);
    if (res.status) {
      if (accion === "Alta") {
        const nuevaCajero = { currentID, ...data };
        setCajeros([...cajeros, nuevaCajero]);
        if (!bajas) {
          setCajerosFiltrados([...cajerosFiltrados, nuevaCajero]);
        }
      }
      if (accion === "Eliminar" || accion === "Editar") {
        const index = cajeros.findIndex((c) => c.numero === data.numero);
        if (index !== -1) {
          if (accion === "Eliminar") {
            const cFiltrados = cajeros.filter((c) => c.numero !== data.numero);
            setCajeros(cFiltrados);
            setCajerosFiltrados(cFiltrados);
          } else {
            if (bajas) {
              const cFiltrados = cajeros.filter(
                (c) => c.numero !== data.numero
              );
              setCajeros(cFiltrados);
              setCajerosFiltrados(cFiltrados);
            } else {
              const cActualizadas = cajeros.map((c) =>
                c.numero === currentID ? { ...c, ...data } : c
              );
              setCajeros(cActualizadas);
              setCajerosFiltrados(cActualizadas);
            }
          }
        }
      }
      showSwal(res.alert_title, res.alert_text, res.alert_icon);
      showModal(false);
    }
  });
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
    setBusqueda((estadoPrevio) => ({
      ...estadoPrevio,
      [event.target.id]: event.target.value,
    }));
  };
  const ImprimePDF = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Datos Cajero",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: cajerosFiltrados,
    };
    Imprimir(configuracion);
  };
  const ImprimeExcel = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Datos Cajeros",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: cajerosFiltrados,
      columns: [
        { header: "Numero", dataKey: "numero" },
        { header: "Nombre", dataKey: "nombre" },
        { header: "Clave Cajero", dataKey: "clave_cajero" },
        { header: "Telefono", dataKey: "telefono" },
        { header: "Correo", dataKey: "mail" },
      ],
      nombre: "Cajeros",
    };
    ImprimirExcel(configuracion);
  };
  const handleVerClick = () => {
    setAnimateLoading(true);
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Datos Cajero",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
    };
    const Enca1 = (doc) => {
      if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalV();
        doc.nextRow(12);
        doc.ImpPosX("No.", 14, doc.tw_ren, 0, "L");
        doc.ImpPosX("Nombre", 28, doc.tw_ren, 0, "L");
        doc.ImpPosX("Clave", 97, doc.tw_ren, 0, "L");
        doc.ImpPosX("Telefono", 112, doc.tw_ren, 0, "L");
        doc.ImpPosX("Correo", 142, doc.tw_ren, 0, "L");
        doc.nextRow(4);
        doc.printLineV();
        doc.nextRow(4);
        doc.tiene_encabezado = true;
      } else {
        doc.nextRow(6);
        doc.tiene_encabezado = true;
      }
    };
    const reporte = new ReportePDF(configuracion);
    Enca1(reporte);
    cajerosFiltrados.forEach((cajero) => {
      reporte.ImpPosX(cajero.numero.toString(), 24, reporte.tw_ren, 0, "R");
      reporte.ImpPosX(cajero.nombre.toString(), 28, reporte.tw_ren, 0, "L");
      reporte.ImpPosX(
        cajero.clave_cajero.toString(),
        97,
        reporte.tw_ren,
        0,
        "L"
      );
      reporte.ImpPosX(cajero.telefono.toString(), 112, reporte.tw_ren, 0, "L");
      reporte.ImpPosX(cajero.mail.toString(), 142, reporte.tw_ren, 0, "L");
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
  };

  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVPCajero").showModal()
      : document.getElementById("modalVPCajero").close();
  };

  const CerrarView = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVPCajero").close();
  };

  if (status === "loading") {
    return (
      <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  return (
    <>
      <ModalCajeros
        accion={accion}
        onSubmit={onSubmitModal}
        currentID={currentID}
        errors={errors}
        register={register}
        setCajero={setCajero}
        cajero={cajero}
      />
      <VistaPrevia
        id={"modalVPCajero"}
        titulo={"Vista Previa de Cajeros"}
        pdfPreview={pdfPreview}
        pdfData={pdfData}
        PDF={ImprimePDF}
        Excel={ImprimeExcel}
        CerrarView={CerrarView}
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
                animateLoading={animateLoading}
              />
            </div>

            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
              Cajeros
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
            <TablaCajeros
              isLoading={isLoading}
              cajerosFiltrados={cajerosFiltrados}
              showModal={showModal}
              setCajero={setCajero}
              setAccion={setAccion}
              setCurrentId={setCurrentId}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Cajeros;
