"use client";
import React, { useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { showSwal, confirmSwal, showSwalConfirm} from "../utils/alerts";
import ModalAsignaturas from "@/app/asignaturas/components/modalAsignaturas";
import TablaAsignaturas from "@/app/asignaturas/components/tablaAsignaturas";
import Busqueda from "@/app/asignaturas/components/Busqueda";
import Acciones from "@/app/asignaturas/components/Acciones";
import VistaPrevia from "@/app/components/VistaPrevia";
import { snToBool } from "@/app/utils/globalfn";
import { useForm } from "react-hook-form";
import {
  getAsignaturas,
  filtroAsignaturas,
  guardarAsinatura,
  getLastSubject,
  Imprimir,
  ImprimirExcel,
  storeBatchAsignatura,
} from "@/app/utils/api/asignaturas/asignaturas";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { debounce, permissionsComponents, chunkArray, validateString } from "@/app/utils/globalfn";
import ModalProcesarDatos from "../components/modalProcesarDatos";
import { truncateTable, inactiveActiveBaja } from "../utils/GlobalApis";
import BarraCarga from "../components/BarraCarga";

function Asignaturas() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [asignaturas, setAsignaturas] = useState([]);
  const [asignatura, setAsignatura] = useState({});
  const [asignaturasFiltrados, setAsignaturasFiltrados] = useState(null);
  const [bajas, setBajas] = useState(false);
  const [openModal, setModal] = useState(false);
  const [accion, setAccion] = useState("");
  const [animateLoading, setAnimateLoading] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [currentID, setCurrentId] = useState("");
  const [filtro, setFiltro] = useState("id");
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const [busqueda, setBusqueda] = useState({ tb_id: "", tb_desc: "" });
  const [disabledNum, setDisableNum] = useState(false);
  const [num, setNum] = useState("");
  const asignaturasRef = useRef(asignaturas)
  const [isLoadingButton, setisLoadingButton] = useState(false);
  const [permissions, setPermissions] = useState({});
  const [dataJson, setDataJson] = useState([]); 
  const [reload_page, setReloadPage] = useState(false)
  const [porcentaje, setPorcentaje] = useState(0);
  const [cerrarTO, setCerrarTO] = useState(false);
  const [active, setActive] = useState(false);
  const [inactive, setInactive] = useState(false);
  const MAX_LENGTHS = {
    descripcion: 100,
    evaluaciones: 20,
    actividad: 10,
    area: 20,
    orden: 20,
    lenguaje:15, 
    caso_evaluar:15,
    fecha_seg:10,
    hora_seg:10,
    cve_seg:10,
  };

  useEffect(() => {
    const fetchData = async () => {
      setisLoading(true);
      const { token, permissions } = session.user;
      const es_admin = session.user?.es_admin || false; // Asegúrate de que exista
      const menuSeleccionado = Number(localStorage.getItem("puntoMenu"));
      limpiarBusqueda();
      const data = await getAsignaturas(token, bajas);
      await fetchAsignaturaStatus(false);
      setAsignaturas(data);
      setAsignaturasFiltrados(data);
      const permisos = permissionsComponents(es_admin, permissions, session.user.id, menuSeleccionado);
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
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      numero: asignatura.numero,
      descripcion: asignatura.descripcion,
      evaluaciones: asignatura.evaluaciones,
      actividad: asignatura.actividad,
      area: asignatura.area,
      orden: asignatura.orden,
      lenguaje: asignatura.lenguaje,
      caso_evaluar: asignatura.caso_evaluar,
    },
  });
  useEffect(() => {
    reset({
      numero: asignatura.numero,
      descripcion: asignatura.descripcion,
      evaluaciones: asignatura.evaluaciones,
      actividad: asignatura.actividad,
      area: asignatura.area,
      orden: asignatura.orden,
      lenguaje: asignatura.lenguaje,
      caso_evaluar: asignatura.caso_evaluar,
    });
  }, [asignatura, reset]);

  useEffect(() => {
    asignaturasRef.current = asignaturas;
  }, [asignaturas]);

  const Buscar = useCallback(() => {
    const { tb_id, tb_desc } = busqueda;
    if (tb_id === "" && tb_desc === "") {
      setAsignaturasFiltrados(asignaturasRef.current);
      return;
    }
    const infoFiltrada = asignaturasRef.current.filter((asignatura) => {
      const coincideId = tb_id
        ? asignatura["numero"].toString().includes(tb_id)
        : true;
      const coincideDescripcion = tb_desc
        ? asignatura["descripcion"]
          .toString()
          .toLowerCase()
          .includes(tb_desc.toLowerCase())
        : true;
      return coincideId && coincideDescripcion;
    });
    setAsignaturasFiltrados(infoFiltrada);
  }, [busqueda]);

  const debouncedBuscar = useMemo(() => debounce(Buscar, 500), [Buscar]);

  const fetchAsignaturaStatus = async (showMesssage) => {
      const res = await inactiveActiveBaja(session.user.token, "asignaturas");
      if (res.status) {
        const { inactive, active } = res.data;
        setActive(active);
        setInactive(inactive);
        showMesssage === true
          ? showSwalConfirm(
              "Estado de las asignaturas",
              `Asignaturas activas: ${active}\nAsignaturas inactivas: ${inactive}`,
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
    const { token } = session.user;
    setCurrentId("");
    reset({
      numero: 0,
      descripcion: "",
      evaluaciones: 0,
      actividad: snToBool(""),
      area: 0,
      orden: 0,
      lenguaje: "",
      caso_evaluar: "",
    });
    setDisableNum(false);
    setAsignatura({ numero: "" });
    setModal(!openModal);
    setAccion("Alta");
    showModal(true);

    document.getElementById("descripcion").focus();
  };

  const Elimina_Comas = (data) => {
    const convertir = (asignatura) => {
      const asignaturaConvertido = { ...asignatura };

      for (const key in asignaturaConvertido) {
        if (
          typeof asignaturaConvertido[key] === "string" &&
          asignaturaConvertido[key].match(/^\d{1,3}(,\d{3})*(\.\d+)?$/)
        ) {
          asignaturaConvertido[key] = parseFloat(
            asignaturaConvertido[key].replace(/,/g, "")
          );
        }
      }

      return asignaturaConvertido;
    };

    if (Array.isArray(data)) {
      return data.map(convertir);
    } else {
      return convertir(data);
    }
  };
  const ConvertSNtoBool = (string) => {
    if (string == "Si") {
      return true;
    } else {
      return true;
    }
  };
  const onSubmitModal = handleSubmit(async (data) => {
    event.preventDefault;
    setisLoadingButton(true);
    const dataj = JSON.stringify(data);
    let res = null;
    if (accion === "Eliminar") {
      showModal(false);
      const confirmed = await confirmSwal(
        "¿Desea Continuar?",
        "Se eliminara la asignatura seleccionada",
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
    res = await guardarAsinatura(session.user.token, data, accion, data.numero);

    if (res.status) {
      if (accion === "Alta") {
        data.numero = res.data;
        const nuevasAsignaturas = { currentID, ...data };
        setAsignaturas([...asignaturas, nuevasAsignaturas]);
        if (!bajas) {
          setAsignaturasFiltrados([...asignaturasFiltrados, nuevasAsignaturas]);
        }
      }
      if (accion === "Eliminar" || accion === "Editar") {
        const index = asignaturas.findIndex((p) => p.numero === data.numero);
        if (index !== -1) {
          if (accion === "Eliminar") {
            const aFiltrados = asignaturas.filter(
              (p) => p.numero !== data.numero
            );
            setAsignaturas(aFiltrados);
            setAsignaturasFiltrados(aFiltrados);
          } else {
            if (bajas) {
              const aFiltrados = asignaturas.filter(
                (p) => p.numero !== data.numero
              );
              setAsignaturas(aFiltrados);
              setAsignaturasFiltrados(aFiltrados);
            } else {
              const aActualizadas = asignaturas.map((p) =>
                p.numero === currentID ? { ...p, ...data } : p
              );
              setAsignaturas(aActualizadas);
              setAsignaturasFiltrados(aActualizadas);
            }
          }
        }
      }
      showSwal(res.alert_title, res.alert_text, res.alert_icon);
      showModal(false);
    } else {
      showSwal(res.alert_title, res.alert_text, "error", "my_modal_3");
    }
    if (accion === "Alta" || accion === "Eliminar") {
      await fetchAsignaturaStatus(false);
    }
    setisLoadingButton(false);
  });
  const limpiarBusqueda = (evt) => {
    //evt.preventDefault();
    setBusqueda({ tb_id: "", tb_desc: "" });
  };
  const showModal = (show) => {
    show
      ? document.getElementById("my_modal_3").showModal()
      : document.getElementById("my_modal_3").close();
  };
  const showModalVista = (show) => {
    if (show) {
      document.getElementById("modalVAsignatura").showModal();
    }
  };
  const cerrarModalVista = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVAsignatura").close();
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
  const handleVerClick = () => {
    setAnimateLoading(true);
    cerrarModalVista();
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Datos Asignaturas",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
    };
    const Enca1 = (doc) => {
      if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalH();
        doc.nextRow(12);
        doc.ImpPosX("No.", 14, doc.tw_ren);
        doc.ImpPosX("Asignatura", 28, doc.tw_ren);
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
    asignaturasFiltrados.forEach((asignatura) => {
      reporte.ImpPosX(asignatura.numero.toString(), 24, reporte.tw_ren, 0, "R");
      reporte.ImpPosX(
        asignatura.descripcion.toString(),
        28,
        reporte.tw_ren,
        25,
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

    // const pdfData = reporte.doc.output("datauristring");
    // setPdfData(pdfData);
    // setPdfPreview(true);
    // setAnimateLoading(true);
    // showModalVista(true);
  };
  const tableAction = (acc, id) => {
    const asignatura = asignaturas.find(
      (asignatura) => asignatura.numero === id
    );
    if (asignatura) {
      asignatura.actividad = snToBool(asignatura.actividad);
      setAsignatura(asignatura);
      setAccion(acc);
      setDisableNum(true);
      setNum(id);
      setCurrentId(id);
      showModal(true);
    }
  };
  const imprimirPDF = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Datos Asignaturas",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: asignaturasFiltrados,
    };
    Imprimir(configuracion);
  };
  const imprimirEXCEL = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Datos Asignaturas",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: asignaturasFiltrados,
      columns: [
        { header: "Numero", dataKey: "numero" },
        { header: "Descripcion", dataKey: "descripcion" },
      ],
      nombre: "Asignaturas",
    };
    ImprimirExcel(configuracion);
  };

  //Procesa datos
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
    await truncateTable(token, "asignaturas");
    const chunks = chunkArray(dataJson, 20);
    let chunksProcesados = 0;
    let numeroChunks = chunks.length;

    for (let chunk of chunks) {
      const res = await storeBatchAsignatura(token, chunk);
      chunksProcesados++;
      const progreso = (chunksProcesados / numeroChunks) * 100;
      setPorcentaje(Math.round(progreso));
    }
    setCerrarTO(true);
    setisLoadingButton(false);
    setDataJson([]);
    setPorcentaje(0);
  
    showSwal(
      "Éxito",
      "Todos las Asignaturas se insertaron correctamente.",
      "success"
    );
    showModalProcesa(false);

    await fetchAsignaturaStatus(true);
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
              numero: parseInt(item.Numero|| 0),
              descripcion: validateString(
                MAX_LENGTHS,
                "descripcion",
                (typeof item.Descripcion === "string" ? item.Descripcion.trim() : "N/A") ||
                  "N/A"
              ),
              fecha_seg: validateString(
                MAX_LENGTHS,
                "fecha_seg",
                (typeof item.Fecha_Seg === "string" ? item.Fecha_Seg.trim() : "N/A") ||
                  "N/A"
              ),
              hora_seg: validateString(
                MAX_LENGTHS,
                "hora_seg",
                (typeof item.Hora_Seg === "string" ? item.Hora_Seg.trim() : "N/A") ||
                  "N/A"
              ),
              cve_seg: validateString(
                MAX_LENGTHS,
                "cve_seg",
                (typeof item.Cve_Seg === "string" ? item.Cve_Seg.trim() : "N/A") ||
                  "N/A"
              ),
              baja: validateString(
                MAX_LENGTHS,
                "baja",
                (typeof item.Baja === "string" ? item.Baja.trim() : "n") || "n"
              ),
              evaluaciones:validateString(
                MAX_LENGTHS,
                "evaluaciones",
                (typeof item.Evaluaciones === "string" ? item.Evaluaciones.trim() : "n") || "n"
              ),
              actividad: validateString(
                MAX_LENGTHS,
                "actividad",
                (typeof item.Actividad === "string" ? item.Actividad.trim() : "n") || "n"
              ),
              area: validateString(
                MAX_LENGTHS,
                "area",
                (typeof item.Area === "string" ? item.Area.trim() : "n") || "n"
              ),
              orden: validateString(
                MAX_LENGTHS,
                "orden",
                (typeof item.Orden === "string" ? item.Orden.trim() : "n") || "n"
              ),
              lenguaje:validateString(
                MAX_LENGTHS,
                "lenguaje",
                (typeof item.Lenguaje === "string" ? item.Lenguaje.trim() : "n") || "n"
              ),
              caso_evaluar:validateString(
                MAX_LENGTHS,
                "caso_evaluar",
                (typeof item.Caso_Evaluar === "string" ? item.Caso_Evaluar.trim() : "n") || "n"
              ),
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
          <td className="w-[40%]">Descripcion</td>
          <td className="w-[15%]">Fecha Seg</td>
          <td className="w-[15%]">Hora Seg</td>
          <td className="w-[15%]">Cve Seg</td>
          <td className="w-[10%]">Baja</td>
          <td className="w-[10%]">Evaluaciones</td>
          <td className="w-[10%]">Actividad</td>
          <td className="w-[10%]">Area</td>
          <td className="w-[10%]">Orden</td>
          <td className="w-[10%]">Lenguaje</td>
          <td className="w-[10%]">Caso Evaluar</td>
        </>
      );
    };
  
    const itemDataTable = (item) => {
      return (
        <>
          <tr key={item.numero} className="hover:cursor-pointer">
            <th className="text-left">{item.numero}</th>
            <td>{item.descripcion}</td>
            <td>{item.fecha_seg}</td>
            <td>{item.hora_seg}</td>
            <td>{item.cve_seg}</td>
            <td>{item.baja}</td>
            <td>{item.evaluaciones}</td>
            <td>{item.actividad}</td>
            <td>{item.area}</td>
            <td>{item.orden}</td>
            <td>{item.lenguaje}</td>
            <td>{item.caso_evaluar}</td>
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
      <ModalAsignaturas
        accion={accion}
        onSubmit={onSubmitModal}
        currentID={currentID}
        errors={errors}
        register={register}
        setProducto={setAsignatura}
        producto={asignatura}
        formatNumber={formatNumber}
        setValue={setValue}
        watch={watch}
        disabledNum={disabledNum}
        num={num}
        // setNum={setNum}
        getValues={getValues}
        isLoadingButton={isLoadingButton}
      />
      <VistaPrevia
        id={"modalVAsignatura"}
        titulo={"Vista Previa de Asignaturas"}
        pdfPreview={pdfPreview}
        pdfData={pdfData}
        PDF={imprimirPDF}
        Excel={imprimirEXCEL}
        CerrarView={cerrarModalVista}
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
                isLoading={animateLoading}
                permiso_alta={permissions.altas}
                permiso_imprime={permissions.impresion}
                es_admin={session?.user?.es_admin || false}
              />
            </div>

            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
              Asignaturas
            </h1>
            <h3 className="ml-auto order-3">{`Asignatuas activas: ${
              active || 0
            }\nAsignaturas inactivas: ${inactive || 0}`}</h3>
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
                <TablaAsignaturas
                  session={session}
                  isLoading={isLoading}
                  asignaturasFiltrados={asignaturasFiltrados}
                  showModal={showModal}
                  setAsignatura={setAsignatura}
                  setAccion={setAccion}
                  setCurrentId={setCurrentId}
                  formatNumber={formatNumber}
                  tableAction={tableAction}
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

export default Asignaturas;
