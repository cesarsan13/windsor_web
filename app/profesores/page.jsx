"use client";
import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { showSwal, confirmSwal, showSwalAndWait } from "@/app/utils/alerts";
import ModalProfesores from "@/app/profesores/components/ModalProfesores";
import VistaPrevia from "@/app/components/VistaPrevia";
import TablaProfesores from "@/app/profesores/components/TablaProfesores";
import Busqueda from "@/app/profesores/components/Busqueda";
import Acciones from "@/app/profesores/components/Acciones";
import { useForm } from "react-hook-form";
import {
  getProfesores,
  guardaProfesor,
  ImprimirPDF,
  siguiente,
  ImprimirExcel,
} from "@/app/utils/api/profesores/profesores";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import "jspdf-autotable";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { debounce } from "../utils/globalfn";
function Profesores() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [profesores, setProfesores] = useState([]);
  const [profesor, setProfesor] = useState({});
  const [profesoresFiltrados, setProfesoresFiltrados] = useState([]);
  const [bajas, setBajas] = useState(false);
  const [openModal, setModal] = useState(false);
  const [accion, setAccion] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [isLoadingButton, setisLoadingButton] = useState(false);
  const [currentID, setCurrentId] = useState("");
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const [busqueda, setBusqueda] = useState({
    tb_numero: "",
    tb_nombre: "",
  });
  const [animateLoading, setAnimateLoading] = useState(false);

  useEffect(() => {
    if (status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {
      setisLoading(true);
      const { token } = session.user;
      const data = await getProfesores(token, bajas);
      setProfesores(data);
      setProfesoresFiltrados(data);
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
      numero: profesor.numero,
      nombre: profesor.nombre,
      nombre_completo: profesor.nombre_completo,
      ap_paterno: profesor.ap_paterno,
      ap_materno: profesor.ap_materno,
      direccion: profesor.direccion,
      colonia: profesor.colonia,
      ciudad: profesor.ciudad,
      estado: profesor.estado,
      cp: profesor.cp,
      pais: profesor.pais,
      rfc: profesor.rfc,
      telefono_1: profesor.telefono_1,
      telefono_2: profesor.telefono_2,
      fax: profesor.fax,
      celular: profesor.celular,
      email: profesor.email,
      contraseña: "",
    },
  });

  useEffect(() => {
    reset({
      numero: profesor.numero,
      nombre: profesor.nombre,
      nombre_completo: profesor.nombre_completo,
      ap_paterno: profesor.ap_paterno,
      ap_materno: profesor.ap_materno,
      direccion: profesor.direccion,
      colonia: profesor.colonia,
      ciudad: profesor.ciudad,
      estado: profesor.estado,
      cp: profesor.cp,
      pais: profesor.pais,
      rfc: profesor.rfc,
      telefono_1: profesor.telefono_1,
      telefono_2: profesor.telefono_2,
      fax: profesor.fax,
      celular: profesor.celular,
      email: profesor.email,
      contraseña: "",
    });
  }, [profesor, reset]);

  const Buscar = useCallback(() => {
    const { tb_numero, tb_nombre } = busqueda;
    if (tb_numero === "" && tb_nombre === "") {
      setProfesoresFiltrados(profesores);
      return;
    }
    const infoFiltrada = profesores.filter((profesor) => {
      const coincideID = tb_numero
        ? profesor["numero"].toString().includes(tb_numero)
        : true;
      const coincideNombre = tb_nombre
        ? profesor["nombre"]
          .toString()
          .toLowerCase()
          .includes(tb_nombre.toLowerCase())
        : true;
      return coincideID && coincideNombre;
    });
    setProfesoresFiltrados(infoFiltrada);
  }, [busqueda, profesores]);

  useEffect(() => {
    const debouncedBuscar = debounce(Buscar, 500);
    debouncedBuscar();
    return () => {
      clearTimeout(debouncedBuscar);
    };
  }, [busqueda, Buscar]);

  const limpiarBusqueda = (evt) => {
    evt.preventDefault();
    setBusqueda({ tb_numero: "", tb_nombre: "" });
  };

  const handleVerClick = () => {
    setAnimateLoading(true);
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Profesores",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: profesoresFiltrados,
    };

    const orientacion = "Landscape";
    const reporte = new ReportePDF(configuracion, orientacion);
    const { body } = configuracion;
    const Enca1 = (doc) => {
      if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalH();
        doc.nextRow(12);
        doc.ImpPosX("Numero", 15, doc.tw_ren);
        doc.ImpPosX("Nombre", 40, doc.tw_ren);
        doc.ImpPosX("Dirección", 110, doc.tw_ren);
        doc.ImpPosX("Colonia", 140, doc.tw_ren);
        doc.ImpPosX("Ciudad", 170, doc.tw_ren);
        doc.ImpPosX("Estado", 215, doc.tw_ren);
        doc.ImpPosX("C.P.", 240, doc.tw_ren);
        doc.nextRow(4);
        doc.ImpPosX("Email", 15, doc.tw_ren);
        doc.ImpPosX("Telefono1", 140, doc.tw_ren);
        doc.ImpPosX("Telefono2", 170, doc.tw_ren);
        doc.ImpPosX("Celular", 200, doc.tw_ren);
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
    body.forEach((profesores) => {
      reporte.ImpPosX(profesores.numero.toString(), 20, reporte.tw_ren, 0, "R");
      reporte.ImpPosX(
        profesores.nombre_completo.toString(),
        40,
        reporte.tw_ren,
        0,
        "L"
      );
      reporte.ImpPosX(
        profesores.direccion.toString(),
        110,
        reporte.tw_ren,
        0,
        "L"
      );
      reporte.ImpPosX(
        profesores.colonia.toString(),
        140,
        reporte.tw_ren,
        0,
        "L"
      );
      reporte.ImpPosX(
        profesores.ciudad.toString(),
        170,
        reporte.tw_ren,
        0,
        "L"
      );
      reporte.ImpPosX(
        profesores.estado.toString(),
        215,
        reporte.tw_ren,
        0,
        "L"
      );
      reporte.ImpPosX(profesores.cp.toString(), 240, reporte.tw_ren, 0, "L");
      reporte.nextRow(4);
      reporte.ImpPosX(profesores.email.toString(), 15, reporte.tw_ren, 0, "L");
      reporte.ImpPosX(
        profesores.telefono_1.toString(),
        140,
        reporte.tw_ren,
        12,
        "L"
      );
      reporte.ImpPosX(
        profesores.telefono_2.toString(),
        170,
        reporte.tw_ren,
        12,
        "L"
      );
      reporte.ImpPosX(
        profesores.celular.toString(),
        200,
        reporte.tw_ren,
        12,
        "L"
      );
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
      ? document.getElementById("modalVPProfesor").showModal()
      : document.getElementById("modalVPProfesor").close();
  };

  const CerrarView = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVPProfesor").close();
  };

  const Alta = async (event) => {
    setCurrentId("");
    const { token } = session.user;
    reset({
      numero: "",
      nombre: "",
      nombre_completo: "",
      ap_paterno: "",
      ap_materno: "",
      direccion: "",
      colonia: "",
      ciudad: "",
      estado: "",
      cp: "",
      pais: "",
      rfc: "",
      telefono_1: "",
      telefono_2: "",
      fax: "",
      celular: "",
      email: "",
      contraseña: "",
    });
    let siguienteId = await siguiente(token);
    siguienteId = Number(siguienteId) + 1;
    setCurrentId(siguienteId);
    setProfesor({ numero: siguienteId });
    setModal(!openModal);
    setAccion("Alta");
    showModal(true);

    document.getElementById("nombre").focus();
  };

  const ImprimePDF = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Profesores",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: profesoresFiltrados,
    };
    ImprimirPDF(configuracion);
  };

  const ImprimeExcel = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Profesores",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: profesoresFiltrados,
      columns: [
        { header: "Numero", dataKey: "numero" },
        { header: "Nombre", dataKey: "nombre_completo" },
        { header: "Dirección", dataKey: "direccion" },
        { header: "Colonia", dataKey: "colonia" },
        { header: "Telefono1", dataKey: "telefono_1" },
        { header: "Telefono2", dataKey: "telefono_2" },
        { header: "Ciudad", dataKey: "ciudad" },
        { header: "Estado", dataKey: "estado" },
        { header: "Celular", dataKey: "celular" },
        { header: "C.P.", dataKey: "cp" },
      ],
      nombre: "Profesores",
    };
    ImprimirExcel(configuracion);
  };

  const onSubmitModal = handleSubmit(async (data) => {
    event.preventDefault();
    setisLoadingButton(true);
    data.numero = currentID;
    let res = null;
    if (accion === "Eliminar") {
      showModal(false);
      const confirmed = await confirmSwal(
        "¿Desea Continuar?",
        "Se eliminara el profesor seleccionado",
        "warning",
        "Aceptar",
        "Cancelar"
      );
      if (!confirmed) {
        showModal(true);
        return;
      }
    }
    data.nombre_completo = `${data.nombre} ${data.ap_paterno} ${data.ap_materno}`
    res = await guardaProfesor(session.user.token, data, accion);
    if (res.status) {
      if (accion === "Alta") {
        const nuevaProfesor = { currentID, ...data };
        setProfesores([...profesores, nuevaProfesor]);
        if (!bajas) {
          setProfesoresFiltrados([...profesoresFiltrados, nuevaProfesor]);
        }
      }
      if (accion === "Eliminar" || accion === "Editar") {
        const index = profesores.findIndex((fp) => fp.numero === data.numero);
        if (index !== -1) {
          if (accion === "Eliminar") {
            const fpFiltrados = profesores.filter(
              (fp) => fp.numero !== data.numero
            );
            setProfesores(fpFiltrados);
            setProfesoresFiltrados(fpFiltrados);
          } else {
            if (bajas) {
              const fpFiltrados = profesores.filter(
                (fp) => fp.numero !== data.numero
              );
              setProfesores(fpFiltrados);
              setProfesoresFiltrados(fpFiltrados);
            } else {
              const fpActualizadas = profesores.map((fp) =>
                fp.numero === currentID ? { ...fp, ...data } : fp
              );
              setProfesores(fpActualizadas);
              setProfesoresFiltrados(fpActualizadas);
            }
          }
        }
      }
      showModal(false);
      showSwal(res.alert_title, res.alert_text, res.alert_icon);
    } else {
      showModal(false);
      await showSwalAndWait(res.alert_title, res.alert_text, res.alert_icon);
      showModal(true);
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
      <ModalProfesores
        accion={accion}
        onSubmit={onSubmitModal}
        currentID={currentID}
        errors={errors}
        register={register}
        setProfesor={setProfesor}
        profesor={profesor}
        isLoadingButton={isLoadingButton}
      />
      <VistaPrevia
        pdfPreview={pdfPreview}
        pdfData={pdfData}
        PDF={ImprimePDF}
        Excel={ImprimeExcel}
        id="modalVPProfesor"
        titulo="Vista Previa de Profesores"
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
                animateLoading={animateLoading}
              ></Acciones>
            </div>

            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
              Profesores.
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
            <TablaProfesores
              session={session}
              isLoading={isLoading}
              profesoresFiltrados={profesoresFiltrados}
              showModal={showModal}
              setProfesor={setProfesor}
              setAccion={setAccion}
              setCurrentId={setCurrentId}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Profesores;
