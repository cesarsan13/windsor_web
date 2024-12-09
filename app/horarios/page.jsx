"use client";
import React, { useCallback, useMemo, useRef } from "react";
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
import VistaPrevia from "@/app/components/VistaPrevia";
import { ReportePDF } from "../utils/ReportesPDF";
import { debounce, permissionsComponents } from "../utils/globalfn";

function Horarios() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [horarios, setHorarios] = useState(null);
  const [horario, setHorario] = useState({});
  const [horariosFiltrados, setHorariosFiltrados] = useState(null);
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
  const [animateLoading, setAnimateLoading] = useState(false);
  const [busqueda, setBusqueda] = useState({ tb_id: "", tb_desc: "" });
  const horariosRef = useRef(horarios)
  const [isLoadingButton, setisLoadingButton] = useState(false);
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    horariosRef.current = horarios
  }, [horarios])
  const Buscar = useCallback(() => {
    const { tb_id, tb_desc } = busqueda;
    if (tb_id === "" && tb_desc === "") {
      setHorariosFiltrados(horariosRef.current);
      return;
    }
    const infoFiltrada = horariosRef.current.filter((horario) => {
      const coincideId = tb_id
        ? horario["numero"].toString().includes(tb_id)
        : true;
      const coincideDescripcion = tb_desc
        ? horario["horario"]
          .toString()
          .toLowerCase()
          .includes(tb_desc.toLowerCase())
        : true;
      return coincideId && coincideDescripcion;
    });
    setHorariosFiltrados(infoFiltrada);
  }, [busqueda]);

  const debouncedBuscar = useMemo(() => debounce(Buscar, 500), [Buscar])

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
      const data = await getHorarios(token, bajas);
      setHorarios(data);
      setHorariosFiltrados(data);
      console.log("permisos:",permissions)
      const permisos = permissionsComponents(es_admin, permissions, session.user.id, menuSeleccionado);
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
      salon: horario.salon,
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
      salon: horario.salon,
    });
  }, [horario, reset]);

  const limpiarBusqueda = (evt) => {
    evt.preventDefault();
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
      salon: "",
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
    setisLoadingButton(true);
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
        setisLoadingButton(false);
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
            const fpFiltrados = horarios.filter(
              (fp) => fp.numero !== data.numero
            );
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
    } else {
      showSwal(res.alert_title, res.alert_text, "error", "my_modal_horario");
    }
    setisLoadingButton(false);
  });
  const showModal = (show) => {
    show
      ? document.getElementById("my_modal_horario").showModal()
      : document.getElementById("my_modal_horario").close();
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
        { header: "Horario", dataKey: "horario" },
        { header: "Salón", dataKey: "salon" },
        { header: "Dia", dataKey: "dia" },
        { header: "Cancha", dataKey: "cancha" },
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
    setAnimateLoading(true);
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
        doc.nextRow(12);
        doc.ImpPosX("Numero", 14, doc.tw_ren);
        doc.ImpPosX("Horario", 28, doc.tw_ren);
        doc.ImpPosX("Salón", 62, doc.tw_ren);
        doc.ImpPosX("Dia", 90, doc.tw_ren);
        doc.ImpPosX("Cancha", 117, doc.tw_ren);
        doc.ImpPosX("Niños", 134, doc.tw_ren);
        doc.ImpPosX("Sexo", 149, doc.tw_ren);
        doc.ImpPosX("Edad Ini", 164, doc.tw_ren);
        doc.ImpPosX("Edad Fin", 184, doc.tw_ren);
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
    horariosFiltrados.forEach((horario) => {
      reporte.ImpPosX(horario.numero.toString(), 24, reporte.tw_ren, 0, "R");
      reporte.ImpPosX(horario.horario.toString(), 28, reporte.tw_ren);
      reporte.ImpPosX(horario.salon.toString(), 62, reporte.tw_ren);
      reporte.ImpPosX(horario.dia.toString(), 90, reporte.tw_ren);
      reporte.ImpPosX(horario.cancha.toString(), 127, reporte.tw_ren, 0, "R");
      reporte.ImpPosX(
        horario.max_niños.toString(),
        144,
        reporte.tw_ren,
        0,
        "R"
      );
      reporte.ImpPosX(horario.sexo.toString(), 149, reporte.tw_ren);
      reporte.ImpPosX(horario.edad_ini.toString(), 174, reporte.tw_ren, 0, "R");
      reporte.ImpPosX(horario.edad_fin.toString(), 194, reporte.tw_ren, 0, "R");
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
  const CerrarView = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVPHorarios").close();
  };
  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVPHorarios").showModal()
      : document.getElementById("modalVPHorarios").close();
  };
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
        isLoadingButton={isLoadingButton}
      />
      <VistaPrevia
        id="modalVPHorarios"
        titulo={"Vista Previa de Horarios"}
        pdfData={pdfData}
        pdfPreview={pdfPreview}
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
                home={home}
                animateLoading={animateLoading}
                Ver={handleVerClick}
                permiso_alta={permissions.altas}
                permiso_imprime={permissions.impresion}
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
            {status === "loading" || (!session) ?
              (<></>) : (<TablaHorarios
                isLoading={isLoading}
                HorariosFiltrados={horariosFiltrados}
                showModal={showModal}
                setHorario={setHorario}
                setAccion={setAccion}
                setCurrentId={setCurrentId}
                session={session}
                permiso_cambio={permissions.cambios}
                permiso_baja={permissions.bajas}
              />)}
          </div>
        </div>
      </div>
    </>
  );
}

export default Horarios;
