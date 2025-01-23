"use client";
import React, { useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { showSwal, confirmSwal, showSwalConfirm } from "../utils/alerts";
import ModalCajeros from "@/app/cajeros/components/modalCajeros";
import TablaCajeros from "./components/tablaCajeros";
import Busqueda from "./components/Busqueda";
import Acciones from "@/app/cajeros/components/Acciones";
import ModalProcesarDatos from "../components/modalProcesarDatos";
import * as XLSX from "xlsx";
import { useForm } from "react-hook-form";
import {
  getCajeros,
  guardaCajero,
  Imprimir,
  ImprimirExcel,
  storeBatchCajero,
} from "@/app/utils/api/cajeros/cajeros";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { siguiente } from "@/app/utils/api/cajeros/cajeros";
import "jspdf-autotable";
import VistaPrevia from "@/app/components/VistaPrevia";
import { ReportePDF } from "../utils/ReportesPDF";
import { debounce, permissionsComponents, chunkArray } from "../utils/globalfn";
import { truncateTable, inactiveActiveBaja } from "../utils/GlobalApis";
import BarraCarga from "../components/BarraCarga";
function Cajeros() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [cajeros, setCajeros] = useState([]); //formasPago
  const [cajero, setCajero] = useState({}); //formaPago
  const [cajerosFiltrados, setCajerosFiltrados] = useState(null);
  const [bajas, setBajas] = useState(false);
  const [openModal, setModal] = useState(false);
  const [accion, setAccion] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [isLoadingButton, setisLoadingButton] = useState(false);
  const [currentID, setCurrentId] = useState("");
  const [pdfPreview, setPdfPreview] = useState(false);
  const [animateLoading, setAnimateLoading] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const cajerosRef = useRef(cajeros);
  const [busqueda, setBusqueda] = useState({
    tb_id: "",
    tb_desc: "",
    tb_correo: "",
    tb_tel: "",
  });
  const [permissions, setPermissions] = useState({});
  //useState para los datos que se trae del excel
  const [dataJson, setDataJson] = useState([]); 
  const [reload_page, setReloadPage] = useState(false);
  const [porcentaje, setPorcentaje] = useState(0);
  const [cerrarTO, setCerrarTO] = useState(false);
  const [active, setActive] = useState(false);
  const [inactive, setInactive] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setisLoading(true);
      let { token, permissions } = session.user;
      const es_admin = session.user?.es_admin || false; // Asegúrate de que exista
      const menuSeleccionado = Number(localStorage.getItem("puntoMenu"));
      limpiarBusqueda();
      const data = await getCajeros(token, bajas);
      await fetchCajerosStatus(false);
      setCajeros(data);
      setCajerosFiltrados(data);
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
  }, [session, status, bajas, reload_page]);

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

  useEffect(() => {
    cajerosRef.current = cajeros;
  }, [cajeros]);
  const Buscar = useCallback(() => {
    const { tb_id, tb_desc, tb_correo, tb_tel } = busqueda;
    if (tb_id === "" && tb_desc === "" && tb_correo === "" && tb_tel === "") {
      setCajerosFiltrados(cajerosRef.current);
      return;
    }
    const infoFiltrada = cajerosRef.current.filter((cajero) => {
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
  }, [busqueda]);

  const fetchCajerosStatus = async (showMesssage) => {
    const res = await inactiveActiveBaja(session.user.token, "cajeros");
    if (res.status) {
      const { inactive, active } = res.data;
      setActive(active);
      setInactive(inactive);
      showMesssage === true
        ? showSwalConfirm(
            "Estado de los cajeros",
            `Cajeros activos: ${active}\nCajeros inactivos: ${inactive}`,
            "info"
          )
        : "";
    }
  };

  const debouncedBuscar = useMemo(() => debounce(Buscar, 500), [Buscar]);
  useEffect(() => {
    debouncedBuscar();
    return () => {
      clearTimeout(debouncedBuscar);
    };
  }, [busqueda, debouncedBuscar]);

  const limpiarBusqueda = (evt) => {
    //evt.preventDefault();
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
    setisLoadingButton(true);
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
        setisLoadingButton(false);
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
    } else {
      showSwal(res.alert_title, res.alert_text, "error", "my_modal_3");
    }
    if (accion === "Alta" || accion === "Eliminar") {
      await fetchCajerosStatus(false);
    }
    setisLoadingButton(false);
  });
  const procesarDatos = () => {
    if (!session.user.es_admin) {
      showSwal(
        "Acción no permitida",
        "Solo los administradores pueden realizar esta acción.",
        "warning"
      );
      return;
    }
  
    showModalProcesa(true);
  };
  const showModalProcesa = (show) => {
    show
      ? document.getElementById("my_modal_4").showModal()
      : document.getElementById("my_modal_4").close();
  };
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
        Nombre_Reporte: "Reporte de Cajeros",
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
        Nombre_Reporte: "Reporte de Cajeros",
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
        Nombre_Reporte: "Reporte de Cajeros",
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

  const buttonProcess = async () => {
    document.getElementById("cargamodal").showModal();
    event.preventDefault();
    setisLoadingButton(true);
    const { token } = session.user;
    await truncateTable(token, "cajeros");
    const chunks = chunkArray(dataJson, 20);
    let chunksProcesados = 0;
    let numeroChunks = chunks.length;
    for (let chunk of chunks) {
      await storeBatchCajero(token, chunk);
      chunksProcesados++;
      const progreso = (chunksProcesados / numeroChunks) * 100;
      setPorcentaje(Math.round(progreso));
    }
    setCerrarTO(true);
    setDataJson([]);
    showModalProcesa(false);
    showSwal("Éxito", "Los datos se han subido correctamente.", "success");
    await fetchCajerosStatus(true);
    setTimeout(() => {
      setReloadPage(!reload_page);
    }, 3500);    
  };

      const handleFileChange = async (e) => {
        const confirmed = await confirmSwal(
          "¿Desea Continuar?",
          "Asegúrate de que las columnas del archivo de excel coincidan exactamente con las columnas de la tabla en la base de datos.",
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
              nombre: (item.Nombre && String(item.Nombre).trim() !== "") ? String(item.Nombre).slice(0, 35) : "N/A",
              direccion: (item.Direccion && String(item.Direccion).trim() !== "") ? String(item.Direccion).slice(0, 50) : "N/A",
              colonia: (item.Colonia && String(item.Colonia).trim() !== "") ? String(item.Colonia).slice(0, 30) : "N/A",
              estado: (item.Estado && String(item.Estado).trim() !== "") ? String(item.Estado).slice(0, 30) : "N/A",
              telefono: (item.Telefono && String(item.Telefono).trim() !== "") ? String(item.Telefono).slice(0, 20) : "N/A",
              fax: (item.Fax && String(item.Fax).trim() !== "") ? String(item.Fax).slice(0, 20) : "N/A",
              mail: (item.Mail && String(item.Mail).trim() !== "") ? String(item.Mail).slice(0, 40) : "N/A",
              clave_cajero: (item.Clave_cajero && item.Clave_cajero.trim() !== "") ? String(item.Clave_cajero).slice(0, 8) : "N/A",
              baja: (item.Baja && item.Baja.trim() !== "") ? String(item.Baja).slice(0, 1) : "n",
            }));
            setDataJson(convertedData);
          };
          reader.readAsArrayBuffer(selectedFile);
        }
      };

      const itemHeaderTable = () => {
        return (
          <>
            <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
            <td className="w-[35%]">Nombre</td>
            <td className="w-[20%]">Direccion</td>
            <td className="w-[30%]">Colonia</td>
            <td className="w-[10%]">Estado</td>
            <td className="w-[15%]">Telefono</td>
            <td className="w-[10%]">Fax</td>
            <td className="w-[10%]">Mail</td>
            <td className="w-[10%]">Clave Cajero</td>
            <td className="w-[10%]">Baja</td>
          </>
        );
      };

      const itemDataTable = (item) => {
        return (
          <>
            <tr key={item.numero} className="hover:cursor-pointer">
              <th
                className={
                  typeof item.numero === "number"
                    ? "text-left"
                    : "text-right"
                }
              >
                {item.numero}
              </th>
              <td className="w-[40%] max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap pt-[.10rem] pb-[.10rem]">
                {item.nombre}
              </td>
              <td className="text-right">{item.direccion}</td>
              <td className="text-left">{item.colonia}</td>
              <td className="text-right">{item.estado}</td>
              <td className="text-right">{item.telefono}</td>
              <td className="text-right">{item.fax}</td>
              <td className="text-right">{item.mail}</td>
              <td className="text-right">{item.clave_cajero}</td>
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
          <BarraCarga
        porcentaje={porcentaje}
        cerrarTO={cerrarTO}
      />
      <ModalCajeros
        accion={accion}
        onSubmit={onSubmitModal}
        currentID={currentID}
        errors={errors}
        register={register}
        setCajero={setCajero}
        cajero={cajero}
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
      <VistaPrevia
        id={"modalVPCajero"}
        titulo={"Vista Previa de Cajeros"}
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
                procesarDatos={procesarDatos}
                animateLoading={animateLoading}
                permiso_alta={permissions.altas}
                permiso_imprime={permissions.impresion}
                es_admin={session?.user?.es_admin || false}
                />
            </div>

            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
              Cajeros
            </h1>
            <h3 className="ml-auto order-3">{`Cajeros activos: ${
              active || 0
            }\nCajeros inactivos: ${inactive || 0}`}</h3>
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
                <TablaCajeros
                  session={session}
                  isLoading={isLoading}
                  cajerosFiltrados={cajerosFiltrados}
                  showModal={showModal}
                  setCajero={setCajero}
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

export default Cajeros;
