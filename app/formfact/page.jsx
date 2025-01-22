"use client";
import React, { useTransition, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { showSwal, confirmSwal, showSwalConfirm } from "../utils/alerts";
import ModalFormFact from "@/app/formfact/components/modalFormFact";
import ModalProcesarDatos from "@/app/components/modalProcesarDatos";
import TablaFormFact from "@/app/formfact/components/tablaFormFact";
import Busqueda from "@/app/formfact/components/Busqueda";
import Acciones from "@/app/formfact/components/Acciones";
import { useForm } from "react-hook-form";
import { getPropertyData } from "@/app/utils/api/formfact/formfact";
import {
  getFacturasFormato,
  getFormFact,
  guardaFormFact,
  storeBatchFormFact,
} from "@/app/utils/api/formfact/formfact";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { siguiente } from "@/app/utils/api/formfact/formfact";
import "jspdf-autotable";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import ConfigReporte from "./components/configReporte";
import {
  chunkArray,
  debounce,
  permissionsComponents,
  validateString,
} from "@/app/utils/globalfn";
import * as XLSX from "xlsx";
import { truncateTable } from "@/app/utils/GlobalApis";
import BarraCarga from "@/app/components/BarraCarga";
function FormFact() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formFacts, setFormFacts] = useState([]); //formasPago
  const [formFact, setFormFact] = useState({}); //formaPago
  const [formFactsFiltrados, setFormFactsFiltrados] = useState(null);
  const [bajas, setBajas] = useState(false);
  const [openModal, setModal] = useState(false);
  const [accion, setAccion] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [currentID, setCurrentId] = useState("");
  const [formato, setFormato] = useState("");
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const [showSheet, setShowSheet] = useState(false);
  const [labels, setLabels] = useState([]);
  const [propertyData, setPropertyData] = useState({});
  const [busqueda, setBusqueda] = useState({ tb_id: "", tb_desc: "" });
  const formFactsRef = useRef(formFacts);
  const [isLoadingButton, setisLoadingButton] = useState(false);
  const [animateLoading, setAnimateLoading] = useState(false);
  const [permissions, setPermissions] = useState({});
  const [dataJson, setDataJson] = useState([]);
  const [reload_page, setReloadPage] = useState(false);
  const [porcentaje, setPorcentaje] = useState(0);
  const [cerrarTO, setCerrarTO] = useState(false);
  const [configuracion, setConfiguracion] = useState({
    Encabezado: {
      Nombre_Aplicacion: "Sistema de Control Escolar",
      Nombre_Reporte: "Reporte Alumnos Mensual",
      Nombre_Usuario: `Usuario: ${"prueb"}`,
    },
    body: {},
  });
  const MAX_LENGTHS = {
    nombre_forma: 50,
    baja: 1,
  };
  useEffect(() => {
    formFactsRef.current = formFacts;
  }, [formFacts]);
  useEffect(() => {
    if (formato === "") {
      return;
    }
    const data = getPropertyData(formato);
    setPropertyData(data);
  }, [formato]);

  useEffect(() => {
    const fetchData = async () => {
      setisLoading(true);
      let { token, permissions } = session.user;
      const es_admin = session.user.es_admin;
      const menuSeleccionado = Number(localStorage.getItem("puntoMenu"));
      const data = await getFormFact(token, bajas);
      setFormFacts(data);
      setFormFactsFiltrados(data);
      setisLoading(false);
      const permisos = permissionsComponents(
        es_admin,
        permissions,
        session.user.id,
        menuSeleccionado
      );
      setPermissions(permisos);
    };
    if (status === "loading" || !session) {
      return;
    }
    fetchData();
    setFormato("Facturas");
  }, [session, status, bajas, reload_page]);

  useEffect(() => {
    const reporte = new ReportePDF(configuracion, "portrait");
    reporte.imprimeEncabezadoPrincipalV();

    const pdfData = reporte.doc.output("datauristring");
    setPdfData(pdfData);
    setPdfPreview(true);
  }, [configuracion]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      numero_forma: formFact.numero_forma,
      nombre_forma: formFact.nombre_forma,
      longitud: formFact.longitud,
    },
  });
  useEffect(() => {
    reset({
      numero_forma: formFact.numero_forma,
      nombre_forma: formFact.nombre_forma,
      longitud: formFact.longitud,
    });
  }, [formFact, reset]);

  const Buscar = useCallback(() => {
    const { tb_id, tb_desc } = busqueda;
    if (tb_id === "" && tb_desc === "") {
      setFormFactsFiltrados(formFactsRef.current);
      return;
    }
    const infoFiltrada = formFactsRef.current.filter((formFact) => {
      const coincideId = tb_id
        ? formFact["numero_forma"].toString().includes(tb_id)
        : true;
      const coincideDescripcion = tb_desc
        ? formFact.nombre_forma.toLowerCase().includes(tb_desc.toLowerCase())
        : true;
      return coincideId && coincideDescripcion;
    });
    setFormFactsFiltrados(infoFiltrada);
  }, [busqueda]);

  const debouncedBuscar = useMemo(() => debounce(Buscar, 500), [Buscar]);

  useEffect(() => {
    debouncedBuscar();
    return () => {
      clearTimeout(debouncedBuscar);
    };
  }, [busqueda, debouncedBuscar]);

  const limpiarBusqueda = (evt) => {
    evt.preventDefault();
    setBusqueda({ tb_id: "", tb_desc: "" });
  };
  const Alta = async (event) => {
    setCurrentId("");
    const { token } = session.user;
    reset({
      numero_forma: "",
      nombre_forma: "",
      longitud: "",
    });
    let siguienteId = await siguiente(token);
    siguienteId = Number(siguienteId) + 1;
    setCurrentId(siguienteId);
    setFormFact({ numero_forma: siguienteId });
    setModal(!openModal);
    setAccion("Alta");
    showModal(true);

    document.getElementById("nombre_forma").focus();
  };
  const onSubmitModal = handleSubmit(async (data) => {
    setisLoadingButton(true);
    event.preventDefault;
    const dataj = JSON.stringify(data);
    data.id = currentID;
    let res = null;
    if (accion === "Eliminar") {
      showModal(false);
      const confirmed = await confirmSwal(
        "¿Desea Continuar?",
        "Se eliminara el forma factura seleccionado",
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
    res = await guardaFormFact(session.user.token, data, accion);
    if (res.status) {
      if (accion === "Alta") {
        const nuevaFormFact = { currentID, ...data };
        setFormFacts([...formFacts, nuevaFormFact]);
        if (!bajas) {
          setFormFactsFiltrados([...formFactsFiltrados, nuevaFormFact]);
        }
      }
      if (accion === "Eliminar" || accion === "Editar") {
        const index = formFacts.findIndex(
          (c) => c.numero_forma === data.numero_forma
        );
        if (index !== -1) {
          if (accion === "Eliminar") {
            const formFiltrados = formFacts.filter(
              (c) => c.numero_forma !== data.numero_forma
            );
            setFormFacts(formFiltrados);
            setFormFactsFiltrados(formFiltrados);
          } else {
            if (bajas) {
              const formFiltrados = formFacts.filter(
                (c) => c.numero_forma !== data.numero_forma
              );
              setFormFacts(formFiltrados);
              setFormFactsFiltrados(formFiltrados);
            } else {
              const formActualizadas = formFacts.map((c) =>
                c.numero_forma === currentID ? { ...c, ...data } : c
              );
              setFormFacts(formActualizadas);
              setFormFactsFiltrados(formActualizadas);
            }
          }
        }
      }
      showSwal(res.alert_title, res.alert_text, res.alert_icon);
      showModal(false);
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

  const fetchFacturasFormato = async (id) => {
    const { token } = session.user;
    const facturas = await getFacturasFormato(token, id);
    setLabels(facturas);
  };

  const procesarDatos = () => {
    showModalProcesa(true);
  };

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
    await truncateTable(token, "facturas_formas");
    const chunks = chunkArray(dataJson, 20);
    let allErrors = "";
    let chunksProcesados = 0;
    let numeroChunks = chunks.length;
    for (let chunk of chunks) {
      const res = await storeBatchFormFact(token, chunk);
      chunksProcesados++;
      const progreso = (chunksProcesados / numeroChunks) * 100;
      setPorcentaje(Math.round(progreso));
      if (!res.status) {
        allErrors += res.alert_text;
      }
    }
    setCerrarTO(true);
    setisLoadingButton(false);
    setDataJson([]);
    setPorcentaje(0);
    if (allErrors) {
      showSwalConfirm("Error", allErrors, "error", "my_modal_4");
    } else {
      showModalProcesa(false);
      showSwal(
        "Éxito",
        "Todos los factura formas se insertaron correctamente.",
        "success"
        // "my_modal_4"
      );
    }
    setReloadPage(!reload_page);
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
        console.log("data", jsonData);
        const convertedData = jsonData.map((item) => ({
          numero_forma: item.Numero_Forma || 0,
          nombre_forma: validateString(
            MAX_LENGTHS,
            "nombre_forma",
            item.Nombre_Forma || ""
          ),
          longitud: parseFloat(item.Longitud || 0),
          baja: validateString(MAX_LENGTHS, "baja", item.Baja || "n"),
        }));
        setDataJson(convertedData);
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const itemHeaderTable = () => {
    return (
      <>
        <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem] text-right">Núm.</td>
        <td className="w-[30%]">Nombre</td>
        <td className="w-[20%] text-right">longitud</td>
        <td className="w-[10%]">Baja</td>
      </>
    );
  };

  const itemDataTable = (item) => {
    return (
      <>
        <tr key={item.numero_forma} className="hover:cursor-pointer">
          <th className="text-right">{item.numero_forma}</th>
          <td className="w-[40%] max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap pt-[.10rem] pb-[.10rem] text-left">
            {item.nombre_forma}
          </td>
          <td className="text-right">{item.longitud}</td>
          <td className="text-left">{item.baja}</td>
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
      <BarraCarga porcentaje={porcentaje} cerrarTO={cerrarTO} />
      <ModalFormFact
        accion={accion}
        onSubmit={onSubmitModal}
        currentID={currentID}
        errors={errors}
        register={register}
        setFormFact={setFormFact}
        formFact={formFact}
        isLoadingButton={isLoadingButton}
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
      <div className="container h-[80vh] w-full max-w-screen-xl bg-base-200 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden">
        <div className="flex flex-col justify-start p-3">
          <div className="flex flex-wrap md:flex-nowrap items-start md:items-center">
            <div className="order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0">
              <Acciones
                Buscar={Buscar}
                Alta={Alta}
                procesarDatos={procesarDatos}
                home={home}
                permiso_alta={permissions.altas}
              />
            </div>
            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-16">
              Formas Facturas
            </h1>
          </div>
        </div>

        <div className="flex flex-col items-center h-full">
          <div className="w-full max-w-4xl overflow-scroll">
            <Busqueda
              setBajas={setBajas}
              limpiarBusqueda={limpiarBusqueda}
              Buscar={Buscar}
              handleBusquedaChange={handleBusquedaChange}
              setFormato={setFormato}
              busqueda={busqueda}
            />
            {showSheet ? (
              <ConfigReporte
                labels={labels}
                setLabels={setLabels}
                formato={formato}
                propertyData={propertyData}
                setShowSheet={setShowSheet}
                currentID={currentID}
              ></ConfigReporte>
            ) : status === "loading" || !session ? (
              <></>
            ) : (
              <TablaFormFact
                isLoading={isLoading}
                formFactsFiltrados={formFactsFiltrados}
                showModal={showModal}
                setFormFact={setFormFact}
                setAccion={setAccion}
                setCurrentId={setCurrentId}
                setShowSheet={setShowSheet}
                fetchFacturasFormato={fetchFacturasFormato}
                formato={formato}
                session={session}
                permiso_cambio={permissions.cambios}
                permiso_baja={permissions.bajas}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default FormFact;
