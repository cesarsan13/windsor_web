"use client";
import React from "react";
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
import { siguiente } from "../utils/api/comentarios/comentarios";
import "jspdf-autotable";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import "@react-pdf-viewer/core/lib/styles/index.css";
import ModalVistaPreviaComentarios from "./components/modalVistaPreviaComentarios";

function Comentarios() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formasComentarios, setFormasComentarios] = useState([]);
  const [formaComentarios, setFormaComentarios] = useState({});
  const [formaComentariosFiltrados, setFormaComentariosFiltrados] = useState([]);
  const [bajas, setBajas] = useState(false);
  const [openModal, setModal] = useState(false);
  const [accion, setAccion] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [currentID, setCurrentId] = useState("");
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const [busqueda, setBusqueda] = useState({ tb_id: "", tb_comentario1: "" });
useEffect(() => {
  if (status === "loading" || !session) {
    return;
  }
  const fetchData = async () => {
    setisLoading(true);
    const { token } = session.user;
    const data = await getComentarios(token, bajas);
    setFormasComentarios(data);
    setFormaComentariosFiltrados(data);
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
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: formaComentarios.id,
      comentario_1: formaComentarios.comentario_1,
      comentario_2: formaComentarios.comentario_2,
      comentario_3: formaComentarios.comentario_3,
      generales: formaComentarios.generales,
    },
  });
  useEffect(() => {
    reset({
      id: formaComentarios.id,
      comentario_1: formaComentarios.comentario_1,
      comentario_2: formaComentarios.comentario_2,
      comentario_3: formaComentarios.comentario_3,
      generales: formaComentarios.generales,
    });
  }, [formaComentarios, reset]);
  const Buscar = () => {
    const {tb_id, tb_comentario1} = busqueda;

    if (tb_id === "" && tb_comentario1 === ""){
      setFormaComentariosFiltrados(formasComentarios);
      return;
    }
    const infoFiltrada = formasComentarios.filter((formaComentarios) => {
      const coincideID = tb_id ? formaComentarios["id"].toString().includes(tb_id) : true;
      const coincideComentario1 = tb_comentario1 ?
        formaComentarios["comentario_1"]
        .toString()
        .toLowerCase()
        .includes(tb_comentario1.toLowerCase())
        : true;
      return coincideID && coincideComentario1;
    });
    setFormaComentariosFiltrados(infoFiltrada);
  };
  const limpiarBusqueda = (evt) => {
    evt.preventDefault;
    setBusqueda({ tb_id: "", tb_comentario1: "" });
  };

  const handleVerClick = () => {
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
        doc.ImpPosX("id", 15, doc.tw_ren);
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
      reporte.ImpPosX(comentarios.id.toString(), 15, reporte.tw_ren, 10);
      reporte.ImpPosX(
        comentarios.comentario_1.toString(),
        30,
        reporte.tw_ren,
        40
      );
      reporte.ImpPosX(
        comentarios.comentario_2.toString(),
        110,
        reporte.tw_ren,
        40
      );
      reporte.ImpPosX(
        comentarios.comentario_3.toString(),
        190,
        reporte.tw_ren,
        40
      );
      reporte.ImpPosX(comentarios.generales.toString(), 270, reporte.tw_ren, 5);
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

  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVPComentario").showModal()
      : document.getElementById("modalVPComentario").close();
  };

  const CerrarView = () => {
    setPdfPreview(false);
    setPdfData("");
  };

  const Alta = async (event) => {
    setCurrentId("");
    const { token } = session.user;
    reset({
      id: "",
      comentario_1: "",
      comentario_2: "",
      comentario_3: "",
      generales: "",
    });
    let siguienteId = await siguiente(token);
    siguienteId = Number(siguienteId) + 1;
    setCurrentId(siguienteId);
    setFormaComentarios({ id: siguienteId });
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
        { header: "Id", dataKey: "id" },
        { header: "Comentario 1", dataKey: "comentario_1" },
        { header: "Comentario 2", dataKey: "comentario_2" },
        { header: "Comentario 3", dataKey: "comentario_3" },
        { header: "Generales", dataKey: "generales" },
      ],

      nombre: "Comentarios",
    };
    ImprimirExcel(configuracion);
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
        "Se eliminara el comentario seleccionado",
        "warning",
        "Aceptar",
        "Cancelar"
      );
      if (!confirmed) {
        showModal(true);
        return;
      }
    }
    res = await guardaComentarios(session.user.token, data, accion);
    if (res.status) {
      if (accion === "Alta") {
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
        const index = formasComentarios.findIndex((fp) => fp.id === data.id);
        if (index !== -1) {
          if (accion === "Eliminar") {
            const fpFiltrados = formasComentarios.filter(
              (fp) => fp.id !== data.id
            );
            setFormasComentarios(fpFiltrados);
            setFormaComentariosFiltrados(fpFiltrados);
          } else {
            if (bajas) {
              const fpFiltrados = formasComentarios.filter(
                (fp) => fp.id !== data.id
              );
              setFormasComentarios(fpFiltrados);
              setFormaComentariosFiltrados(fpFiltrados);
            } else {
              const fpActualizadas = formasComentarios.map((fp) =>
                fp.id === currentID ? { ...fp, ...data } : fp
              );
              setFormasComentarios(fpActualizadas);
              setFormaComentariosFiltrados(fpActualizadas);
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
      />
      <ModalVistaPreviaComentarios
        pdfPreview={pdfPreview}
        pdfData={pdfData}
        PDF={ImprimePDF}
        Excel={ImprimeExcel}
      />

      <div className="container h-[80vh] w-full  max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3 overflow-y-auto">
        <div className="flex justify-start p-3 ">
          <h1 className="text-4xl font-xthin text-black dark:text-white md:px-12">
            Comentarios.
          </h1>
        </div>
        <div className="flex flex-col md:grid md:grid-cols-8 md:grid-rows-1 h-full">
        <div className="md:col-span-1 flex flex-col">
            <Acciones
              Buscar={Buscar}
              Alta={Alta}
              ImprimePDF={ImprimePDF}
              ImprimeExcel={ImprimeExcel}
              home={home}
              Ver={handleVerClick}
              CerrarView={CerrarView}
            ></Acciones>
          </div>
          <div className="md:col-span-7">
          <div className="flex flex-col h-full">
              <Busqueda
                setBajas={setBajas}
                limpiarBusqueda={limpiarBusqueda}
                Buscar={Buscar}
                handleBusquedaChange={handleBusquedaChange}
                busqueda={busqueda}
              />
              <div className="overflow-x-auto">
              <TablaComentarios
                isLoading={isLoading}
                formaComentariosFiltrados={formaComentariosFiltrados}
                showModal={showModal}
                setFormaComentarios={setFormaComentarios}
                setAccion={setAccion}
                setCurrentId={setCurrentId}
              />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Comentarios;
