"use client";
import React, { useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { showSwal, confirmSwal, showSwalConfirm } from "../utils/alerts";
import ModalComentarios from "./components/ModalComentarios";
const TablaComentarios = React.lazy(() => import( "./components/TablaComentarios"));
import Busqueda from "./components/Busqueda";
import Acciones from "./components/Acciones";
import { useForm } from "react-hook-form";
import {
  getComentarios,
  guardaComentarios,
  ImprimirPDF,
  ImprimirExcel,
  storeBatchComentarios
} from "../utils/api/comentarios/comentarios";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import "jspdf-autotable";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import "@react-pdf-viewer/core/lib/styles/index.css";
import VistaPrevia from "@/app/components/VistaPrevia";
import { debounce, permissionsComponents, chunkArray, validateString } from "@/app/utils/globalfn";
import ModalProcesarDatos from "../components/modalProcesarDatos";
import * as XLSX from "xlsx";
import BarraCarga from "../components/BarraCarga";
import { truncateTable, inactiveActiveBaja } from "@/app/utils/GlobalApis";

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
  const [dataJson, setDataJson] = useState([]); 
  const [reload_page, setReloadPage] = useState(false);
  const [porcentaje, setPorcentaje] = useState(0);
  const [cerrarTO, setCerrarTO] = useState(false);
  const [active, setActive] = useState(false);
  const [inactive, setInactive] = useState(false);
  const MAX_LENGTHS = {
    comentario_1: 50,
    comentario_2: 50,
    comentario_3: 50,
    baja: 1,
    generales:1,
  };

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

const fetchComentarioStatus = async (showMesssage) => {
    const res = await inactiveActiveBaja(session.user.token, "comentarios");
    if (res.status) {
      const { inactive, active } = res.data;
      setActive(active);
      setInactive(inactive);
      showMesssage === true
        ? showSwalConfirm(
            "Estado de los comentarios",
            `Comentarios activos: ${active}\nComentarios inactivos: ${inactive}`,
            "info"
          )
        : "";
    }
  };

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
      const es_admin = session.user?.es_admin || false; // Asegúrate de que exista
      const menuSeleccionado = Number(localStorage.getItem("puntoMenu"));
      const data = await getComentarios(token, bajas);
      await fetchComentarioStatus(false);
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
  }, [session, status, bajas, reload_page]);

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
    // console.log("Res => ", res);
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
    if(accion === "Alta"|| accion === "Eliminar") {
      await fetchComentarioStatus(false);
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

  const procesarDatos = () => {
    showModalProcesa(true);
  }
  const showModalProcesa = (show) => {
    show
      ? document.getElementById("my_modal_4").showModal()
      : document.getElementById("my_modal_4").close();
  };
  const buttonProcess = async () => {
    document.getElementById("cargamodal").showModal();
    event.preventDefault();
    setisLoadingButton(true);
    const { token } = session.user;
    await truncateTable(token, "comentarios");
    const chunks = chunkArray(dataJson, 20);
    let chunksProcesados = 0;
    let numeroChunks = chunks.length;

    for (let chunk of chunks) {
      const res = await storeBatchComentarios(token, chunk);
      chunksProcesados++;
      const progreso = (chunksProcesados / numeroChunks) * 100;
      setPorcentaje(Math.round(progreso));
    }
    setCerrarTO(true);
    setisLoadingButton(false);
    setDataJson([]);
    setPorcentaje(0);
    showSwal("Éxito", "Los datos se han subido correctamente.", "success");
    showModalProcesa(false);
    
    await fetchComentarioStatus(true);
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
        const convertedData = jsonData.map(item => ({
          numero: item.Numero || 0,
          comentario_1: validateString(
            MAX_LENGTHS,
            "comentario_1",
            (typeof item.Comentario_1 === "string"
              ? item.Comentario_1.trim()
              : "N/A") || "N/A"
          ),
          comentario_2:validateString(
            MAX_LENGTHS,
            "comentario_2",
            (typeof item.Comentario_2 === "string"
              ? item.Comentario_2.trim()
              : "N/A") || "N/A"
          ),
          comentario_3: validateString(
            MAX_LENGTHS,
            "comentario_3",
            (typeof item.Comentario_3 === "string"
              ? item.Comentario_3.trim()
              : "N/A") || "N/A"
          ),
          baja: validateString(
            MAX_LENGTHS,
            "baja",
            (typeof item.Baja === "string" ? item.Baja.trim() : "n") || "n"
          ),
          generales: isNaN(parseInt(item.Generales)) ? 0 : parseInt(item.Generales)
        }));
        setDataJson(convertedData);
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const itemHeaderTable = () => {
    return (
      <>
        <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">No.</td>
        <td className="w-[35%]">Comentario 1</td>
        <td className="w-[35%]">Comentario 2</td>
        <td className="w-[35%]">Comentario 3</td>
        <td className="w-[10%]">Baja</td>
        <td className="w-[10%]">Generales</td>
      </>
    );
  };

  const itemDataTable = (item) => {
    return (
      <>
        <tr key={item.numero} className="hover:cursor-pointer">
          <th className="text-left">{item.numero} </th>
          <td>{item.comentario_1}</td>
          <td>{item.comentario_2}</td>
          <td>{item.comentario_3}</td>
          <td>{item.baja}</td>
          <td>{item.generales}</td>
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
      <BarraCarga
        porcentaje={porcentaje}
        cerrarTO={cerrarTO}
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
                home={home}
                Ver={handleVerClick}
                procesarDatos ={procesarDatos}
                animateLoading={animateLoading}
                permiso_alta={permissions.altas}
                permiso_imprime={permissions.impresion}
                es_admin={session?.user?.es_admin || false}
              ></Acciones>
            </div>

            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
              Comentarios.
            </h1>
            <h3 className="ml-auto order-3">{`Comentarios activos: ${
              active || 0
            }\nComentarios inactivos: ${inactive || 0}`}</h3>
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
