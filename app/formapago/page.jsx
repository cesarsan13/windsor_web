"use client";
import React, { useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { showSwal, confirmSwal, showSwalConfirm } from "../utils/alerts";
import ModalFormaPago from "@/app/formapago/components/ModalFormaPago";
import TablaFormaPago from "@/app/formapago/components/TablaFormaPago";
import Busqueda from "@/app/formapago/components/Busqueda";
import Acciones from "@/app/formapago/components/Acciones";
import { useForm } from "react-hook-form";
import {
  getFormasPago,
  guardaFormaPAgo,
  Imprimir,
  ImprimirExcel,
  storeBatchTipoCobro,
} from "@/app/utils/api/formapago/formapago";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { siguiente } from "@/app/utils/api/formapago/formapago";
import { ReportePDF } from "../utils/ReportesPDF";
import { debounce, permissionsComponents, chunkArray } from "../utils/globalfn";
import { truncateTable, inactiveActiveBaja } from "../utils/GlobalApis";
import ModalProcesarDatos from "../components/modalProcesarDatos";
import * as XLSX from "xlsx";
import VistaPrevia from "@/app/components/VistaPrevia";
import BarraCarga from "../components/BarraCarga";
function FormaPago() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formasPago, setFormasPago] = useState([]);
  const [formaPago, setFormaPago] = useState({});
  const [formaPagosFiltrados, setFormaPagosFiltrados] = useState(null);
  const [bajas, setBajas] = useState(false);
  const [openModal, setModal] = useState(false);
  const [accion, setAccion] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [currentID, setCurrentId] = useState("");
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const [busqueda, setBusqueda] = useState({ tb_id: "", tb_desc: "" });
  const [animateLoading, setAnimateLoading] = useState(false);
  const formasPagoRef = useRef(formasPago);
  const [isLoadingButton, setisLoadingButton] = useState(false);
  const [permissions, setPermissions] = useState({});
  //useState para los datos que se trae del excel
  const [dataJson, setDataJson] = useState([]); 
  const [reload_page, setReloadPage] = useState(false);
  const [porcentaje, setPorcentaje] = useState(0);
  const [cerrarTO, setCerrarTO] = useState(false);
  const [active, setActive] = useState(false);
  const [inactive, setInactive] = useState(false);
  useEffect(() => {
    formasPagoRef.current = formasPago; // Actualiza el ref cuando alumnos cambia
  }, [formasPago]);

  const Buscar = useCallback(() => {
    const { tb_id, tb_desc } = busqueda;
    if (tb_id === "" && tb_desc === "") {
      setFormaPagosFiltrados(formasPagoRef.current);
      return;
    }
    const infoFiltrada = formasPagoRef.current.filter((formapago) => {
      const coincideId = tb_id
        ? formapago["numero"].toString().includes(tb_id)
        : true;
      const coincideDescripcion = tb_desc
        ? formapago.descripcion.toLowerCase().includes(tb_desc.toLowerCase())
        : true;
      return coincideId && coincideDescripcion;
    });
    setFormaPagosFiltrados(infoFiltrada);
  }, [busqueda, formasPago]);

  const debouncedBuscar = useMemo(() => debounce(Buscar, 500), [Buscar]);

    const fetchFormaPagoStatus = async (showMesssage) => {
      const res = await inactiveActiveBaja(session.user.token, "tipo_cobro");
      if (res.status) {
        const { inactive, active } = res.data;
        setActive(active);
        setInactive(inactive);
        showMesssage === true
          ? showSwalConfirm(
              "Estado de las Formas de Pago",
              `Formas de Pago activas: ${active}\nFormas de Pago inactivas: ${inactive}`,
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
    const fetchData = async () => {
      setisLoading(true);
      const { token, permissions } = session.user;
      const es_admin = session.user?.es_admin || false; // Asegúrate de que exista
      const menu_seleccionado = Number(localStorage.getItem("puntoMenu"));
      limpiarBusqueda(EventTarget);
      const data = await getFormasPago(token, bajas);
      await fetchFormaPagoStatus(false);
      setFormasPago(data);
      setFormaPagosFiltrados(data);
      setisLoading(false);
      const permisos = permissionsComponents(es_admin, permissions, session.user.id, menu_seleccionado)
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
      numero: formaPago.numero,
      descripcion: formaPago.descripcion,
      comision: formaPago.comision,
      aplicacion: formaPago.aplicacion,
      cue_banco: formaPago.cue_banco,
    },
  });
  useEffect(() => {
    reset({
      numero: formaPago.numero,
      descripcion: formaPago.descripcion,
      comision: formaPago.comision,
      aplicacion: formaPago.aplicacion,
      cue_banco: formaPago.cue_banco,
    });
  }, [formaPago, reset]);
  
  const limpiarBusqueda = (evt) => {
    evt.preventDefault();
    setBusqueda({ tb_id: "", tb_desc: "" });
  };

  const Alta = async (event) => {
    setCurrentId("");
    const { token } = session.user;
    reset({
      numero: "",
      descripcion: "",
      comision: "",
      aplicacion: "",
      cue_banco: "",
    });
    let siguienteId = await siguiente(token);
    siguienteId = Number(siguienteId) + 1;
    setCurrentId(siguienteId);
    setFormaPago({ numero: siguienteId });
    setModal(!openModal);
    setAccion("Alta");
    showModal(true);

    document.getElementById("descripcion").focus();
  };

  const onSubmitModal = handleSubmit(async (data) => {
    event.preventDefault;
    setisLoadingButton(true);
    const dataj = JSON.stringify(data);
    data.id = currentID;
    let res = null;
    if (accion === "Eliminar") {
      showModal(false);
      const confirmed = await confirmSwal(
        "¿Desea Continuar?",
        "Se eliminara la forma de pago seleccionada",
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
    res = await guardaFormaPAgo(session.user.token, data, accion);
    if (res.status) {
      if (accion === "Alta") {
        const nuevaFormaPago = { currentID, ...data };
        setFormasPago([...formasPago, nuevaFormaPago]);
        if (!bajas) {
          setFormaPagosFiltrados([...formaPagosFiltrados, nuevaFormaPago]);
        }
      }
      if (accion === "Eliminar" || accion === "Editar") {
        const index = formasPago.findIndex((fp) => fp.numero === data.numero);
        if (index !== -1) {
          if (accion === "Eliminar") {
            const fpFiltrados = formasPago.filter(
              (fp) => fp.numero !== data.numero
            );
            setFormasPago(fpFiltrados);
            setFormaPagosFiltrados(fpFiltrados);
          } else {
            if (bajas) {
              const fpFiltrados = formasPago.filter(
                (fp) => fp.numero !== data.numero
              );
              setFormasPago(fpFiltrados);
              setFormaPagosFiltrados(fpFiltrados);
            } else {
              const fpActualizadas = formasPago.map((fp) =>
                fp.numero === currentID ? { ...fp, ...data } : fp
              );
              setFormasPago(fpActualizadas);
              setFormaPagosFiltrados(fpActualizadas);
            }
          }
        }
      }
      showSwal(res.alert_title, res.alert_text, res.alert_icon);
      showModal(false);
    }else{
      showSwal(res.alert_title, res.alert_text, res.alert_icon,"my_modal_3");
    }
    if (accion === "Alta" || accion === "Eliminar") {
      await fetchFormaPagoStatus(false);
    }
    setisLoadingButton(false);
  });
  const procesarDatos = () => {
    showModalProcesa(true);
  }
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
  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVFormaPago").showModal()
      : document.getElementById("modalVFormaPago").close();
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
  const ImprimePDF = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Datos Cajero",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: formaPagosFiltrados,
    };
    Imprimir(configuracion);
  };
  const ImprimeExcel = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Datos Forma Pagos",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: formaPagosFiltrados,
      columns: [
        { header: "Numero", dataKey: "numero" },
        { header: "Descripcion", dataKey: "descripcion" },
        { header: "Comision", dataKey: "comision" },
        { header: "Aplicacion", dataKey: "aplicacion" },
        { header: "Cue. Banco", dataKey: "cue_banco" },
      ],
      nombre: "FormaPagos_",
    };
    ImprimirExcel(configuracion);
  };
  const handleVerClick = () => {
    setAnimateLoading(true);
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Datos Productos",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
    };
    const Enca1 = (doc) => {
      if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalV();
        doc.nextRow(12);
        doc.ImpPosX("No.", 14, doc.tw_ren, 0, "L");
        doc.ImpPosX("Descripcion", 28, doc.tw_ren, 0, "L");
        doc.ImpPosX("Comision", 128, doc.tw_ren, 0, "L");
        doc.ImpPosX("Aplicacion", 152, doc.tw_ren, 0, "L");
        doc.ImpPosX("C. Banco", 182, doc.tw_ren, 0, "L");
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
    formaPagosFiltrados.forEach((producto) => {
      reporte.ImpPosX(producto.numero.toString(), 24, reporte.tw_ren, 0, "R");
      reporte.ImpPosX(
        producto.descripcion.toString(),
        28,
        reporte.tw_ren,
        0,
        "L"
      );
      reporte.ImpPosX(
        producto.comision.toString(),
        138,
        reporte.tw_ren,
        0,
        "R"
      );
      reporte.ImpPosX(
        producto.aplicacion.toString(),
        152,
        reporte.tw_ren,
        0,
        "L"
      );
      reporte.ImpPosX(
        producto.cue_banco.toString(),
        182,
        reporte.tw_ren,
        0,
        "L"
      );
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
    document.getElementById("modalVFormaPago").close();
  };

    const buttonProcess = async () => {
      document.getElementById("cargamodal").showModal();
      event.preventDefault();
      setisLoadingButton(true);
      const { token } = session.user;
      await truncateTable(token, "tipo_cobro");
      const chunks = chunkArray(dataJson, 20);
      let chunksProcesados = 0;
      let numeroChunks = chunks.length;
      for (let chunk of chunks) {
        await storeBatchTipoCobro(token, chunk);
        chunksProcesados++;
        const progreso = (chunksProcesados / numeroChunks) * 100;
        setPorcentaje(Math.round(progreso));
      }
      setCerrarTO(true);
      setDataJson([]);
      showModalProcesa(false);
      showSwal("Éxito", "Los datos se han subido correctamente.", "success");
      await fetchFormaPagoStatus(true);
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
          numero: parseInt(item.Numero || 0),
          descripcion: (item.Descripcion && String(item.Descripcion).trim() !== "") ? String(item.Descripcion).slice(0, 50) : "N/A",
          comision: parseFloat(item.Comision || 0),
          aplicacion: (item.Aplicacion && String(item.Aplicacion).trim() !== "") ? String(item.Aplicacion).slice(0, 30) : "N/A",
          baja: (item.Baja && item.Baja.trim() !== "") ? String(item.Baja).slice(0, 1) : "n",
          cue_banco: (item.Cue_banco && String(item.Cue_banco).trim() !== "") ? String(item.Cue_banco).slice(0, 34) : "N/A",
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
          <td className="w-[50%]">Descripcion</td>
          <td className="w-[10%]">Comision</td>
          <td className="w-[15%]">Aplicacion</td>
          <td className="w-[20%]">Cuenta Banco</td>
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
              {item.descripcion}
            </td>
            <td className="text-right">{item.comision}</td>
            <td className="text-left">{item.aplicacion}</td>
            <td className="text-right">{item.cue_banco}</td>
            <td className="text-left">{item.baja}</td>
          </tr>
        </>
      );
    };
  

  if (status === "loading") {
    return (
      <div className="container skeleton w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  return (
    <>
    <BarraCarga
        porcentaje={porcentaje}
        cerrarTO={cerrarTO}
      />
      <ModalFormaPago
        accion={accion}
        onSubmit={onSubmitModal}
        currentID={currentID}
        errors={errors}
        register={register}
        setFormaPago={setFormaPago}
        formaPago={formaPago}
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
        pdfPreview={pdfPreview}
        pdfData={pdfData}
        PDF={ImprimePDF}
        Excel={ImprimeExcel}
        id={"modalVFormaPago"}
        titulo={"Vista Previa de Formas de Pago"}
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
                permiso_imprime = {permissions.impresion}
                es_admin={session?.user?.es_admin || false}
              />
            </div>

            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
              Formas de Pago
            </h1>
            <h3 className="ml-auto order-3">{`Formas de Pago activas: ${
              active || 0
            }\nFormas de Pago inactivas: ${inactive || 0}`}</h3>
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
              <TablaFormaPago
                session={session}
                isLoading={isLoading}
                formaPagosFiltrados={formaPagosFiltrados}
                showModal={showModal}
                setFormaPago={setFormaPago}
                setAccion={setAccion}
                setCurrentId={setCurrentId}
                permiso_cambio = {permissions.cambios}
                permiso_baja = {permissions.bajas}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default FormaPago;
