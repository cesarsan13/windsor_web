"use client";
import React, { useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { showSwal, confirmSwal } from "../utils/alerts";
import ModalComentarios from "./components/ModalComentarios";
import TablaComentarios from "./components/TablaComentarios";
import Busqueda from "./components/Busqueda";
import Acciones from "./components/Acciones";
import { useForm } from "react-hook-form";
import {
  getComentarios,
  guardaComentarios,
  ImprimirPDF,
  ImprimirExcel,
} from "../utils/api/comentarios/comentarios";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { siguiente } from "@/app/utils/api/comentarios/comentarios";
import "jspdf-autotable";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import "@react-pdf-viewer/core/lib/styles/index.css";
import VistaPrevia from "@/app/components/VistaPrevia";
import { debounce, permissionsComponents } from "@/app/utils/globalfn";

function Comentarios() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formasComentarios, setFormasComentarios] = useState([]);
  const [formaComentarios, setFormaComentarios] = useState({});
  const [formaComentariosFiltrados, setFormaComentariosFiltrados] =
    useState(null);
  const [bajas, setBajas] = useState(false);
  const [openModal, setModal] = useState(false);
  const [accion, setAccion] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [isLoadingButton, setisLoadingButton] = useState(false);
  const [currentID, setCurrentId] = useState("");
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const [animateLoading, setAnimateLoading] = useState(false);
  const comentariosRef = useRef(formasComentarios);
  const [permissions, setPermissions] = useState({});
  const [busqueda, setBusqueda] = useState({
    tb_numero: "",
    tb_comentario1: "",
  });
  useEffect(() => {
    comentariosRef.current = formasComentarios; // Actualiza el ref cuando alumnos cambia
  }, [formasComentarios]);
  const Buscar = useCallback(() => {
    const { tb_numero, tb_comentario1 } = busqueda;

    if (tb_numero === "" && tb_comentario1 === "") {
      setFormaComentariosFiltrados(comentariosRef.current);
      return;
    }
    const infoFiltrada = comentariosRef.current.filter((formaComentarios) => {
      const coincideID = tb_numero
        ? formaComentarios["numero"].toString().includes(tb_numero)
        : true;
      const coincideComentario1 = tb_comentario1
        ? formaComentarios["comentario_1"]
            .toString()
            .toLowerCase()
            .includes(tb_comentario1.toLowerCase())
        : true;
      return coincideID && coincideComentario1;
    });
    setFormaComentariosFiltrados(infoFiltrada);
  }, [busqueda]);

  const debouncedBuscar = useMemo(() => debounce(Buscar, 500), [Buscar]);

  useEffect(() => {
    debouncedBuscar();
    return () => {
      clearTimeout(debouncedBuscar);
    };
  }, [busqueda, debouncedBuscar]);

  useEffect(() => {
    const debouncedBuscar = debounce(Buscar, 500);
    debouncedBuscar();
    return () => {
      clearTimeout(debouncedBuscar);
    };
  }, [busqueda, Buscar]);

  useEffect(() => {
    const fetchData = async () => {
      setisLoading(true);
      let { token, permissions } = session.user;
      const es_admin = session.user.es_admin;
      const menuSeleccionado = Number(localStorage.getItem("puntoMenu"));
      const data = await getComentarios(token, bajas);
      setFormasComentarios(data);
      setFormaComentariosFiltrados(data);
      const permisos = permissionsComponents(
        es_admin,
        permissions,
        session.user.id,
        menuSeleccionado
      );
      setPermissions(permisos);
      setisLoading(false);
    };
    if (status === "loading" || !session) {
      return;
    }
    fetchData();
  }, [session, status, bajas]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      numero: formaComentarios.numero,
      comentario_1: formaComentarios.comentario_1,
      comentario_2: formaComentarios.comentario_2,
      comentario_3: formaComentarios.comentario_3,
      generales: formaComentarios.generales,
    },
  });
  useEffect(() => {
    reset({
      numero: formaComentarios.numero,
      comentario_1: formaComentarios.comentario_1,
      comentario_2: formaComentarios.comentario_2,
      comentario_3: formaComentarios.comentario_3,
      generales: formaComentarios.generales,
    });
  }, [formaComentarios, reset]);

  const limpiarBusqueda = (evt) => {
    evt.preventDefault();
    setBusqueda({ tb_numero: "", tb_comentario1: "" });
  };

  const handleVerClick = () => {
    setAnimateLoading(true);
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Comentarios",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: formaComentariosFiltrados,
    };

    const orientacion = "Landscape";
    const reporte = new ReportePDF(configuracion, orientacion);
    const { body } = configuracion;
    const Enca1 = (doc) => {
      if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalH();
        doc.nextRow(12);
        doc.ImpPosX("Id", 15, doc.tw_ren);
        doc.ImpPosX("Comentario 1", 30, doc.tw_ren);
        doc.ImpPosX("Comentario 2", 110, doc.tw_ren);
        doc.ImpPosX("Comentario 3", 190, doc.tw_ren);
        doc.ImpPosX("Generales", 270, doc.tw_ren);

        doc.nextRow(4);
        doc.printLineH();
        doc.nextRow(4);
        doc.tiene_encabezado = true;
      } else {
        doc.nextRow(6);
        doc.tiene_encabezado = true;
      }
    };

    Enca1(reporte);
    body.forEach((comentarios) => {
      reporte.ImpPosX(
        comentarios.numero.toString(),
        20,
        reporte.tw_ren,
        0,
        "R"
      );
      reporte.ImpPosX(
        comentarios.comentario_1.toString(),
        30,
        reporte.tw_ren,
        35,
        "L"
      );
      reporte.ImpPosX(
        comentarios.comentario_2.toString(),
        110,
        reporte.tw_ren,
        35,
        "L"
      );
      reporte.ImpPosX(
        comentarios.comentario_3.toString(),
        190,
        reporte.tw_ren,
        35,
        "L"
      );
      let resultado =
        comentarios.generales == 1
          ? "Si"
          : comentarios.generales == 0
          ? "No"
          : "No valido";
      reporte.ImpPosX(resultado.toString(), 270, reporte.tw_ren, 0, "L");
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

  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVPComentario").showModal()
      : document.getElementById("modalVPComentario").close();
  };

  const CerrarView = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVPComentario").close();
  };

  const Alta = async (event) => {
    setCurrentId("");
    const { token } = session.user;
    reset({
      numero: "",
      comentario_1: "",
      comentario_2: "",
      comentario_3: "",
      generales: "",
    });
    setFormaComentarios({ numero: "" });
    setModal(!openModal);
    setAccion("Alta");
    showModal(true);
    document.getElementById("comentario_1").focus();
  };

  const ImprimePDF = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Comentarios",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: formaComentariosFiltrados,
    };
    ImprimirPDF(configuracion);
  };

  const ImprimeExcel = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Comentarios",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },

      body: formaComentariosFiltrados,
      columns: [
        { header: "Id", dataKey: "numero" },
        { header: "Comentario 1", dataKey: "comentario_1" },
        { header: "Comentario 2", dataKey: "comentario_2" },
        { header: "Comentario 3", dataKey: "comentario_3" },
        { header: "Generales", dataKey: "generales" },
      ],

      nombre: "Comentarios_",
    };
    ImprimirExcel(configuracion);
  };

  const onSubmitModal = handleSubmit(async (data) => {
    event.preventDefault();
    setisLoadingButton(true);
    const dataj = JSON.stringify(data);
    accion === "Alta" ? (data.numero = "") : (data.numero = currentID);
    // data.numero = currentID;
    let res = null;
    if (accion === "Eliminar") {
      showModal(false);
      const confirmed = await confirmSwal(
        "¿Desea Continuar?",
        "Se eliminara el comentario seleccionado",
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
    res = await guardaComentarios(session.user.token, data, accion);
    console.log("Res => ", res);
    if (res.status) {
      if (accion === "Alta") {
        data.numero = res.data;
        setCurrentId(data.numero);
        const nuevaFormaComentarios = { currentID, ...data };
        setFormasComentarios([...formasComentarios, nuevaFormaComentarios]);
        if (!bajas) {
          setFormaComentariosFiltrados([
            ...formaComentariosFiltrados,
            nuevaFormaComentarios,
          ]);
        }
      }
      if (accion === "Eliminar" || accion === "Editar") {
        const index = formasComentarios.findIndex(
          (fp) => fp.numero === data.numero
        );
        if (index !== -1) {
          if (accion === "Eliminar") {
            const fpFiltrados = formasComentarios.filter(
              (fp) => fp.numero !== data.numero
            );
            setFormasComentarios(fpFiltrados);
            setFormaComentariosFiltrados(fpFiltrados);
          } else {
            if (bajas) {
              const fpFiltrados = formasComentarios.filter(
                (fp) => fp.numero !== data.numero
              );
              setFormasComentarios(fpFiltrados);
              setFormaComentariosFiltrados(fpFiltrados);
            } else {
              const fpActualizadas = formasComentarios.map((fp) =>
                fp.numero === currentID ? { ...fp, ...data } : fp
              );
              setFormasComentarios(fpActualizadas);
              setFormaComentariosFiltrados(fpActualizadas);
            }
          }
        }
      }
      showSwal(res.alert_title, res.alert_text, res.alert_icon);
      showModal(false);
    } else {
      showSwal(res.alert_title, res.alert_text, res.alert_icon, "my_modal_3");
    }
    setisLoadingButton(false);
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

  if (status === "loading") {
    return (
      <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  return (
    <>
      <ModalComentarios
        accion={accion}
        onSubmit={onSubmitModal}
        currentID={currentID}
        errors={errors}
        register={register}
        setFormaComentarios={setFormaComentarios}
        formaComentarios={formaComentarios}
        isLoadingButton={isLoadingButton}
      />
      <VistaPrevia
        id={"modalVPComentario"}
        titulo={"Vista Previa de Comentarios"}
        pdfPreview={pdfPreview}
        pdfData={pdfData}
        PDF={ImprimePDF}
        Excel={ImprimeExcel}
        CerrarView={CerrarView}
      />

      <div className="container h-[80vh] w-full max-w-screen-xl bg-base-200 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden">
        <div className="flex flex-col justify-start p-3">
          <div className="flex flex-wrap md:flex-nowrap items-start md:items-center">
            <div className="order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0">
              <Acciones
                Buscar={Buscar}
                Alta={Alta}
                // ImprimePDF={ImprimePDF}
                // ImprimeExcel={ImprimeExcel}
                home={home}
                Ver={handleVerClick}
                // CerrarView={CerrarView}
                animateLoading={animateLoading}
                permiso_alta={permissions.altas}
                permiso_imprime={permissions.impresion}
              ></Acciones>
            </div>

            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
              Comentarios.
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
            {status === "loading" ||
              (!session ? (
                <></>
              ) : (
                <TablaComentarios
                  isLoading={isLoading}
                  session={session}
                  formaComentariosFiltrados={formaComentariosFiltrados}
                  showModal={showModal}
                  setFormaComentarios={setFormaComentarios}
                  setAccion={setAccion}
                  setCurrentId={setCurrentId}
                  permiso_cambio={permissions.cambios}
                  permiso_baja={permissions.bajas}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Comentarios;
