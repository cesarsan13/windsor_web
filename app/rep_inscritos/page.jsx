"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Acciones from "@/app/rep_inscritos/components/Acciones";
import { useForm } from "react-hook-form";
import {
  getConsultasInscripcion,
  Imprimir,
  ImprimirExcel,
  verImprimir,
} from "@/app/utils/api/rep_inscritos/rep_inscritos";
import { formatDate, permissionsComponents } from "@/app/utils/globalfn";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import "jspdf-autotable";
import VistaPrevia from "@/app/components/VistaPrevia";
import ModalFechas from "@/app/components/modalFechas";

function AltasBajasAlumnos() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const date = new Date();
  const dateStr = formatDate(date);
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [animateLoading, setAnimateLoading] = useState(false);
  const [permissions, setPermissions] = useState({});
  //Modal Fechas
  let [fecha_ini, setFecha_ini] = useState(dateStr.replace(/\//g, "-"));
  let [fecha_fin, setFecha_fin] = useState(dateStr.replace(/\//g, "-"));
  const [tempFechaIni, setTempFechaIni] = useState("");
  const [tempFechaFin, setTempFechaFin] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const {
    formState: { errors },
  } = useForm({});

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
    let { permissions } = session.user;
    const es_admin = session.user.es_admin;
    const menuSeleccionado = Number(localStorage.getItem("puntoMenu"));
    const permisos = permissionsComponents(
      es_admin,
      permissions,
      session.user.id,
      menuSeleccionado
    );
    setPermissions(permisos);
  }, [session, status]);

  const handleVerClick = async () => {
    setisLoading(true);
    setAnimateLoading(true);
    cerrarModalVista();
    const { token } = session.user;
    const res = await getConsultasInscripcion(token);
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Relación de Recibos",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      bodyAlumnos: res.data_alumnos,
      bodyDetalles: res.data_detalle,
      bodyProductos: res.data_productos,
      bodyHorarios: res.data_horarios,
      fecha_ini: fecha_ini,
      fecha_fin: fecha_fin,
    };
    setTimeout(async () => {
      const pdfData = await verImprimir(configuracion);
      setPdfData(pdfData);
      setPdfPreview(true);
      showModalVista(true);
      setAnimateLoading(false);
    }, 500);
  };

  const ImprimePDF = async () => {
    const { token } = session.user;
    const res = await getConsultasInscripcion(token);
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Relación de Recibos",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      bodyAlumnos: res.data_alumnos,
      bodyDetalles: res.data_detalle,
      bodyProductos: res.data_productos,
      bodyHorarios: res.data_horarios,
      fecha_ini: fecha_ini,
      fecha_fin: fecha_fin,
    };
    Imprimir(configuracion);
  };

  const ImprimeExcel = async () => {
    const { token } = session.user;
    const res = await getConsultasInscripcion(token);
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Relación de Recibos",
        Nombre_Usuario: `${session.user.name}`,
      },
      bodyAlumnos: res.data_alumnos,
      bodyDetalles: res.data_detalle,
      bodyProductos: res.data_productos,
      bodyHorarios: res.data_horarios,
      fecha_ini: fecha_ini,
      fecha_fin: fecha_fin,
      columns: [
        { header: "No.", dataKey: "numero" },
        { header: "Nombre", dataKey: "nombre" },
        { header: "Grado", dataKey: "horario" },
        { header: "Fecha", dataKey: "fecha_inscripcion" },
        { header: "Importe", dataKey: "det_inscripcion" },
      ],
      nombre: "Reporte Alumnos Inscritos",
    };
    ImprimirExcel(configuracion);
  };

  const home = () => {
    router.push("/");
  };

  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVPRepInsc").showModal()
      : document.getElementById("modalVPRepInsc").close();
  };

  const cerrarModalVista = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVPRepInsc").close();
  };
  const CerrarView = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVPRepInsc").close();
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
      <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  return (
    <>
      <VistaPrevia
        id={"modalVPRepInsc"}
        titulo={"Vista Previa Relación de Alumnos Inscritos"}
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
                Relación de Alumnos Inscritos
              </h1>
            </div>
          </div>
        </div>
        <div className="w-full py-3 flex flex-col gap-y-4">
          {/* Fila del formulario de la pagina */}
          <div className="w-full flex justify-center">
            <div className="flex items-center gap-4">
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
    </>
  );
}

export default AltasBajasAlumnos;
