"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { showSwal, confirmSwal } from "../utils/alerts";
import ModalHorario from "@/app/horarios/components/ModalHorario";
import TablaHorarios from "@/app/horarios/components/tablaHorarios";
import Busqueda from "@/app/horarios/components/Busqueda";
import Acciones from "@/app/horarios/components/Acciones";
import { useForm } from "react-hook-form";
import {
  getHorarios,
  guardarHorario,
  Imprimir,
  ImprimirExcel,
} from "@/app/utils/api/horarios/horarios";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getUltimoHorario } from "@/app/utils/api/horarios/horarios";
import { getProductos } from "../utils/api/productos/productos";
import ModalVistaPreviaHorarios from "./components/modalVistaPreviaHorarios";
import { ReportePDF } from "../utils/ReportesPDF";

function Horarios() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [horarios, setHorarios] = useState([]);
  const [horario, setHorario] = useState({});
  const [horariosFiltrados, setHorariosFiltrados] = useState([]);
  const [bajas, setBajas] = useState(false);
  const [openModal, setModal] = useState(false);
  const [accion, setAccion] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [currentID, setCurrentId] = useState("");
  const [filtro, setFiltro] = useState("");
  const [dia, setDia] = useState("");
  // const [TB_Busqueda, setTB_Busqueda] = useState("");
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const [busqueda, setBusqueda] = useState({ tb_id: "", tb_desc: "" });

  useEffect(() => {
    if (status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {
      setisLoading(true);
      const { token } = session.user;
      const data = await getHorarios(token, bajas);
      setHorarios(data);
      setHorariosFiltrados(data);
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
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      numero: horario.numero,
      cancha: horario.cancha,
      dia: horario.dia,
      horario: horario.horario,
      max_niños: horario.max_niños,
      sexo: horario.sexo,
      edad_ini: horario.edad_ini,
      edad_fin: horario.edad_fin,
    },
  });
  useEffect(() => {
    reset({
      numero: horario.numero,
      cancha: horario.cancha,
      dia: horario.dia,
      horario: horario.horario,
      max_niños: horario.max_niños,
      sexo: horario.sexo,
      edad_ini: horario.edad_ini,
      edad_fin: horario.edad_fin,
    });
  }, [horario, reset]);
  const Buscar = () => {
    const { tb_id, tb_desc } = busqueda;
    if (tb_id === "" && tb_desc === "") {
      setHorariosFiltrados(horarios);
      return;
    }
    const infoFiltrada = horarios.filter((horario) => {
      const coincideId = tb_id ? horario["numero"].toString().includes(tb_id) : true;
      const coincideDescripcion = tb_desc
        ? horario["horario"]
          .toString()
          .toLowerCase()
          .includes(tb_desc.toLowerCase())
        : true;
      return coincideId && coincideDescripcion;
    });
    setHorariosFiltrados(infoFiltrada);
  };
  const limpiarBusqueda = (evt) => {
    evt.preventDefault;
    setBusqueda({ tb_id: "", tb_desc: "" });
  };
  const Alta = async (event) => {
    setCurrentId("");
    const { token } = session.user;
    reset({
      numero: "",
      cancha: "",
      dia: "",
      horario: "",
      max_niños: "",
      sexo: "",
      edad_ini: "",
      edad_fin: "",
    });
    let siguienteId = await getUltimoHorario(token);
    siguienteId = Number(siguienteId);
    setCurrentId(siguienteId);
    setHorario({ numero: siguienteId });
    setModal(!openModal);
    setAccion("Alta");
    showModal(true);

    document.getElementById("cancha").focus();
  };
  const onSubmitModal = handleSubmit(async (data) => {
    event.preventDefault;
    data.numero = currentID;
    let res = null;
    if (accion === "Eliminar") {
      showModal(false);
      const confirmed = await confirmSwal(
        "¿Desea Continuar?",
        "Se eliminara el horario seleccionado",
        "warning",
        "Aceptar",
        "Cancelar"
      );
      if (!confirmed) {
        showModal(true);
        return;
      }
    }
    if (Array.isArray(dia)) {
      data.dia = dia.join("/");
    } else {
      data.dia = dia;
    }
    res = await guardarHorario(session.user.token, data, accion);
    if (res.status) {
      if (accion === "Alta") {
        const nuevaHorario = { currentID, ...data };
        setHorarios([...horarios, nuevaHorario]);
        if (!bajas) {
          setHorariosFiltrados([...horariosFiltrados, nuevaHorario]);
        }
      }
      if (accion === "Eliminar" || accion === "Editar") {
        const index = horarios.findIndex((fp) => fp.numero === data.numero);
        if (index !== -1) {
          if (accion === "Eliminar") {
            const fpFiltrados = horarios.filter((fp) => fp.numero !== data.numero);
            setHorarios(fpFiltrados);
            setHorariosFiltrados(fpFiltrados);
          } else {
            if (bajas) {
              const fpFiltrados = horarios.filter(
                (fp) => fp.numero !== data.numero
              );
              setHorarios(fpFiltrados);
              setHorariosFiltrados(fpFiltrados);
            } else {
              const fpActualizadas = horarios.map((fp) =>
                fp.numero === currentID ? { ...fp, ...data } : fp
              );
              setHorarios(fpActualizadas);
              setHorariosFiltrados(fpActualizadas);
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
      [event.target.numero]: event.target.value,
    }));
  };
  if (status === "loading") {
    return (
      <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  const ImprimePDF = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Datos Horario",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: horariosFiltrados,
    };
    Imprimir(configuracion);
  };
  const ImprimeExcel = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Datos Horario",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: horariosFiltrados,
      columns: [
        { header: "Numero", dataKey: "numero" },
        { header: "Cancha", dataKey: "cancha" },
        { header: "Dia", dataKey: "dia" },
        { header: "Horario", dataKey: "horario" },
        { header: "Niños", dataKey: "max_niños" },
        { header: "Sexo", dataKey: "sexo" },
        { header: "Edad Ini", dataKey: "edad_ini" },
        { header: "Edad Fin", dataKey: "edad_fin" },
      ],
      nombre: "Horarios",
    };
    ImprimirExcel(configuracion);
  };
  const handleVerClick = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Datos Horario",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
    };
    const Enca1 = (doc) => {
      if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalV();
        doc.nextRow(12);
        doc.ImpPosX("Numero", 14, doc.tw_ren);
        doc.ImpPosX("Cancha", 28, doc.tw_ren);
        doc.ImpPosX("Dia", 42, doc.tw_ren);
        doc.ImpPosX("Horario", 82, doc.tw_ren);
        doc.ImpPosX("Niños", 114, doc.tw_ren);
        doc.ImpPosX("Sexo", 134, doc.tw_ren);
        doc.ImpPosX("Edad Ini", 154, doc.tw_ren);
        doc.ImpPosX("Edad Fin", 174, doc.tw_ren);
        doc.nextRow(4);
        doc.printLineV();
        doc.nextRow(4);
        doc.tiene_encabezado = true;
      } else {
        doc.nextRow(6);
        doc.tiene_encabezado = true;
      }
    };
    const reporte = new ReportePDF(configuracion)
    Enca1(reporte);
    horariosFiltrados.forEach((horario) => {
      reporte.ImpPosX(horario.numero.toString(), 24, reporte.tw_ren,0,"R")
      reporte.ImpPosX(horario.cancha.toString(), 38, reporte.tw_ren,0,"R")
      reporte.ImpPosX(horario.dia.toString(), 42, reporte.tw_ren)
      reporte.ImpPosX(horario.horario.toString(), 82, reporte.tw_ren)
      reporte.ImpPosX(horario.max_niños.toString(), 124, reporte.tw_ren,0,"R")
      reporte.ImpPosX(horario.sexo.toString(), 134, reporte.tw_ren)
      reporte.ImpPosX(horario.edad_ini.toString(), 164, reporte.tw_ren,0,"R")
      reporte.ImpPosX(horario.edad_fin.toString(), 184, reporte.tw_ren,0,"R")
      Enca1(reporte);
      if (reporte.tw_ren >= reporte.tw_endRen) {
        reporte.pageBreak();
        Enca1(reporte);
      }
    })
    const pdfData = reporte.doc.output("datauristring");
    setPdfData(pdfData);
    setPdfPreview(true);
    showModalVista(true)
  }
  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVPHorarios").showModal()
      : document.getElementById("modalVPHorarios").close();
  }
  if (status === "loading") {
    return (
      <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  return (
    <>
      <ModalHorario
        accion={accion}
        onSubmit={onSubmitModal}
        currentID={currentID}
        errors={errors}
        register={register}
        setHorarios={setHorario}
        horarios={horario}
        control={control}
        setDia={setDia}
      />
      <ModalVistaPreviaHorarios pdfData={pdfData} pdfPreview={pdfPreview} PDF={ImprimePDF} Excel={ImprimeExcel} />
      <div className="container h-[80vh] w-full max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden">
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

            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
              Horarios
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
              <TablaHorarios
                isLoading={isLoading}
                HorariosFiltrados={horariosFiltrados}
                showModal={showModal}
                setHorario={setHorario}
                setAccion={setAccion}
                setCurrentId={setCurrentId}
              />
            </div>
          </div>
        </div>
    </>

  );
}

export default Horarios;
