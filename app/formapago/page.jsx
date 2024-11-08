"use client";
import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { showSwal, confirmSwal } from "../utils/alerts";
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
} from "@/app/utils/api/formapago/formapago";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { siguiente } from "@/app/utils/api/formapago/formapago";
import { ReportePDF } from "../utils/ReportesPDF";
import { debounce } from "../utils/globalfn";
import VistaPrevia from "@/app/components/VistaPrevia";
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
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const [busqueda, setBusqueda] = useState({ tb_id: "", tb_desc: "" });
  const [animateLoading, setAnimateLoading] = useState(false);

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
  const Buscar = useCallback(() => {
    const { tb_id, tb_desc } = busqueda;
    if (tb_id === "" && tb_desc === "") {
      setFormaPagosFiltrados(formasPago);
      return;
    }
    const infoFiltrada = formasPago.filter((formapago) => {
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

  useEffect(() => {
    const debouncedBuscar = debounce(Buscar, 500);
    debouncedBuscar();
    return () => {
      clearTimeout(debouncedBuscar);
    };
  }, [busqueda, Buscar]);
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
      nombre: "Forma Pagos",
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
      <VistaPrevia
        pdfPreview={pdfPreview}
        pdfData={pdfData}
        PDF={ImprimePDF}
        Excel={ImprimeExcel}
        id={"modalVFormaPago"}
        titulo={"Vista Previa de Formas de Pago"}
        CerrarView={CerrarView}
      />

      <div className="container h-[80vh] w-full max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden">
        <div className="flex flex-col justify-start p-3">
          <div className="flex flex-wrap md:flex-nowrap items-start md:items-center">
            <div className="order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0">
              <Acciones
                Buscar={Buscar}
                Alta={Alta}
                home={home}
                Ver={handleVerClick}
                animateLoading={animateLoading}
              />
            </div>

            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
              Formas de Pago
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
    </>
  );
}

export default FormaPago;
