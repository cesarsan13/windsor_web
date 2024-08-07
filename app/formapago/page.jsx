"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { showSwal, confirmSwal } from "../utils/alerts";
import ModalFormaPago from "@/app/formapago/components/ModalFormaPago";
import TablaFormaPago from "@/app/formapago/components/TablaFormaPago";
import Busqueda from "@/app/formapago/components/Busqueda";
import Acciones from "@/app/formapago/components/Acciones";
import ModalVistaPreviaFormaPago from "@/app/formapago/components/modalVistaPreviaFormaPago";
import { useForm } from "react-hook-form";
import {
  getFormasPago,
  guardaFormaPAgo,
  Imprimir,
  ImprimirExcel,
} from "@/app/utils/api/formapago/formapago";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { siguiente } from "@/app/utils/api/formapago/formapago";
import { eventNames } from "process";
import { NEXT_CACHE_REVALIDATE_TAG_TOKEN_HEADER } from "next/dist/lib/constants";
import { ReportePDF } from "../utils/ReportesPDF";

function FormaPago() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formasPago, setFormasPago] = useState([]);
  const [formaPago, setFormaPago] = useState({});
  const [formaPagosFiltrados, setFormaPagosFiltrados] = useState([]);
  const [bajas, setBajas] = useState(false);
  const [openModal, setModal] = useState(false);
  const [accion, setAccion] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [currentID, setCurrentId] = useState("");
  const [filtro, setFiltro] = useState("");
  const [TB_Busqueda, setTB_Busqueda] = useState("");
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");

  useEffect(() => {
    if (status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {
      setisLoading(true);
      const { token } = session.user;
      const data = await getFormasPago(token, bajas);
      setFormasPago(data);
      setFormaPagosFiltrados(data);
      if (filtro !== "" && TB_Busqueda !== "") {
        Buscar();
      }
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
      id: formaPago.id,
      descripcion: formaPago.descripcion,
      comision: formaPago.comision,
      aplicacion: formaPago.aplicacion,
      cue_banco: formaPago.cue_banco,
    },
  });
  useEffect(() => {
    reset({
      id: formaPago.id,
      descripcion: formaPago.descripcion,
      comision: formaPago.comision,
      aplicacion: formaPago.aplicacion,
      cue_banco: formaPago.cue_banco,
    });
  }, [formaPago, reset]);
  const Buscar = () => {
    // alert(filtro);
    if (TB_Busqueda === "" || filtro === "") {
      setFormaPagosFiltrados(formasPago);
      return;
    }
    const infoFiltrada = formasPago.filter((formapago) => {
      const valorCampo = formapago[filtro];
      if (typeof valorCampo === "number") {
        return valorCampo.toString().includes(TB_Busqueda);
      }
      return valorCampo
        ?.toString()
        .toLowerCase()
        .includes(TB_Busqueda.toLowerCase());
    });
    setFormaPagosFiltrados(infoFiltrada);
  };

  const limpiarBusqueda = (evt) => {
    evt.preventDefault;
    setTB_Busqueda("");
  };

  const Alta = async (event) => {
    setCurrentId("");
    const { token } = session.user;
    reset({
      id: "",
      descripcion: "",
      comision: "",
      aplicacion: "",
      cue_banco: "",
    });
    let siguienteId = await siguiente(token);
    siguienteId = Number(siguienteId) + 1;
    setCurrentId(siguienteId);
    setFormaPago({ id: siguienteId });
    setModal(!openModal);
    setAccion("Alta");
    showModal(true);

    document.getElementById("descripcion").focus();
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
        "Se eliminara el proveedor seleccionado",
        "warning",
        "Aceptar",
        "Cancelar"
      );
      if (!confirmed) {
        showModal(true);
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
        const index = formasPago.findIndex((fp) => fp.id === data.id);
        if (index !== -1) {
          if (accion === "Eliminar") {
            const fpFiltrados = formasPago.filter((fp) => fp.id !== data.id);
            setFormasPago(fpFiltrados);
            setFormaPagosFiltrados(fpFiltrados);
          } else {
            if (bajas) {
              const fpFiltrados = formasPago.filter((fp) => fp.id !== data.id);
              setFormasPago(fpFiltrados);
              setFormaPagosFiltrados(fpFiltrados);
            } else {
              const fpActualizadas = formasPago.map((fp) =>
                fp.id === currentID ? { ...fp, ...data } : fp
              );
              setFormasPago(fpActualizadas);
              setFormaPagosFiltrados(fpActualizadas);
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
  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVFormaPago").showModal()
      : document.getElementById("modalVFormaPago").close();
  };
  const home = () => {
    router.push("/");
  };
  const handleBusquedaChange = (event) => {
    event.preventDefault;
    setTB_Busqueda(event.target.value);
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
        { header: "Numero", dataKey: "id" },
        { header: "Descripcion", dataKey: "descripcion" },
        { header: "Comision", dataKey: "comision" },
        { header: "Aplicacion", dataKey: "aplicacion" },
        { header: "Cue. Banco", dataKey: "cue_banco" },
      ],
      nombre: "Forma Pagos",
    };
    ImprimirExcel(configuracion);
  };
  const handleVerClick = () => {
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
        doc.ImpPosX("No.", 14, doc.tw_ren);
        doc.ImpPosX("Descripcion", 28, doc.tw_ren);
        doc.ImpPosX("Comision", 128, doc.tw_ren);
        doc.ImpPosX("Aplicacion", 152, doc.tw_ren);
        doc.ImpPosX("C. Banco", 182, doc.tw_ren);
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
      reporte.ImpPosX(producto.id.toString(), 14, reporte.tw_ren);
      reporte.ImpPosX(producto.descripcion.toString(), 28, reporte.tw_ren);
      reporte.ImpPosX(producto.comision.toString(), 128, reporte.tw_ren);
      reporte.ImpPosX(producto.aplicacion.toString(), 152, reporte.tw_ren);
      reporte.ImpPosX(producto.cue_banco.toString(), 182, reporte.tw_ren);
      Enca1(reporte);
      if (reporte.tw_ren >= reporte.tw_endRen) {
        reporte.pageBreak();
        Enca1(reporte);
      }
    });
    const pdfData = reporte.doc.output("datauristring");
    setPdfData(pdfData);
    setPdfPreview(true);
    showModalVista(true);
  };
  const CerrarView = () => {
    setPdfPreview(false);
    setPdfData("");
  };
  if (status === "loading") {
    return (
      <div className="container skeleton w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  return (
    <>
      <ModalFormaPago
        accion={accion}
        onSubmit={onSubmitModal}
        currentID={currentID}
        errors={errors}
        register={register}
        setFormaPago={setFormaPago}
        formaPago={formaPago}
      />
      <ModalVistaPreviaFormaPago
        pdfPreview={pdfPreview}
        pdfData={pdfData}
        PDF={ImprimePDF}
        Excel={ImprimirExcel}
      />

      <div className="container  w-full  max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3 ">
        <div className="flex justify-start p-3 ">
          <h1 className="text-4xl font-xthin text-black dark:text-white md:px-12">
            Formas de Pagos.
          </h1>
        </div>
        <div className="container grid grid-cols-8 grid-rows-1 h-[calc(100%-20%)] ">
          <div className="col-span-1 flex flex-col ">
            <Acciones
              Buscar={Buscar}
              Alta={Alta}
              home={home}
              PDF={ImprimePDF}
              Excel={ImprimeExcel}
              Ver={handleVerClick}
              CerrarView={CerrarView}
            ></Acciones>
          </div>
          <div className="col-span-7  ">
            <div className="flex flex-col h-[calc(100%)]">
              <Busqueda
                setBajas={setBajas}
                setFiltro={setFiltro}
                limpiarBusqueda={limpiarBusqueda}
                Buscar={Buscar}
                handleBusquedaChange={handleBusquedaChange}
                TB_Busqueda={TB_Busqueda}
                setTB_Busqueda={setTB_Busqueda}
              />
              <TablaFormaPago
                isLoading={isLoading}
                formaPagosFiltrados={formaPagosFiltrados}
                showModal={showModal}
                setFormaPago={setFormaPago}
                setAccion={setAccion}
                setCurrentId={setCurrentId}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FormaPago;
