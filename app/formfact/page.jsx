"use client";
import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { showSwal, confirmSwal } from "../utils/alerts";
import ModalFormFact from "@/app/formfact/components/modalFormFact";
import TablaFormFact from "@/app/formfact/components/tablaFormFact";
import Busqueda from "@/app/formfact/components/Busqueda";
import Acciones from "@/app/formfact/components/Acciones";
import { useForm } from "react-hook-form";
import { getPropertyData } from "@/app/utils/api/formfact/formfact";
import {
  getFacturasFormato,
  getFormFact,
  guardaFormFact,
} from "@/app/utils/api/formfact/formfact";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { siguiente } from "@/app/utils/api/formfact/formfact";
import "jspdf-autotable";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import ConfigReporte from "./components/configReporte";
function FormFact() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formFacts, setFormFacts] = useState([]); //formasPago
  const [formFact, setFormFact] = useState({}); //formaPago
  const [formFactsFiltrados, setFormFactsFiltrados] = useState([]);
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

  const [configuracion, setConfiguracion] = useState({
    Encabezado: {
      Nombre_Aplicacion: "Sistema de Control Escolar",
      Nombre_Reporte: "Reporte Alumnos Mensual",
      Nombre_Usuario: `Usuario: ${"prueb"}`,
    },
    body: {},
  });
  useEffect(() => {
    if (formato === "") {
      return;
    }
    const data = getPropertyData(formato);
    setPropertyData(data);
  }, [formato]);

  useEffect(() => {
    if (status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {
      setisLoading(true);
      const { token } = session.user;
      const data = await getFormFact(token, bajas);
      setFormFacts(data);
      setFormFactsFiltrados(data);
      setisLoading(false);
    };
    fetchData();
    setFormato("Facturas");
  }, [session, status, bajas]);
  useEffect(() => {
    Buscar();
  }, [busqueda]);

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
      numero: formFact.numero,
      nombre: formFact.nombre,
      longitud: formFact.longitud,
    },
  });
  useEffect(() => {
    reset({
      numero: formFact.numero,
      nombre: formFact.nombre,
      longitud: formFact.longitud,
    });
  }, [formFact, reset]);
  const Buscar = () => {
    // alert(filtro);
    const { tb_id, tb_desc } = busqueda;
    if (tb_id === "" && tb_desc === "") {
      setFormFactsFiltrados(formFacts);
      return;
    }
    const infoFiltrada = formFacts.filter((formFact) => {
      const coincideId = tb_id
        ? formFact["numero"].toString().includes(tb_id)
        : true;
      const coincideDescripcion = tb_desc
        ? formFact.nombre.toLowerCase().includes(tb_desc.toLowerCase())
        : true;
      return coincideId && coincideDescripcion;
    });
    // const valorCampo = formFact[filtro];
    // if (typeof valorCampo === "number") {
    //   return valorCampo.toString().includes(TB_Busqueda);
    // }
    // return valorCampo
    //   ?.toString()
    //   .toLowerCase()
    //   .includes(TB_Busqueda.toLowerCase());
    // });
    setFormFactsFiltrados(infoFiltrada);
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
      nombre: "",
      longitud: "",
    });
    let siguienteId = await siguiente(token);
    siguienteId = Number(siguienteId) + 1;
    setCurrentId(siguienteId);
    setFormFact({ numero: siguienteId });
    setModal(!openModal);
    setAccion("Alta");
    showModal(true);

    document.getElementById("nombre").focus();
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
        "Se eliminara el forma factura seleccionado",
        "warning",
        "Aceptar",
        "Cancelar"
      );
      if (!confirmed) {
        showModal(true);
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
        const index = formFacts.findIndex((c) => c.numero === data.numero);
        if (index !== -1) {
          if (accion === "Eliminar") {
            const formFiltrados = formFacts.filter(
              (c) => c.numero !== data.numero
            );
            setFormFacts(formFiltrados);
            setFormFactsFiltrados(formFiltrados);
          } else {
            if (bajas) {
              const formFiltrados = formFacts.filter(
                (c) => c.numero !== data.numero
              );
              setFormFacts(formFiltrados);
              setFormFactsFiltrados(formFiltrados);
            } else {
              const formActualizadas = formFacts.map((c) =>
                c.numero === currentID ? { ...c, ...data } : c
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

  if (status === "loading") {
    return (
      <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  return (
    <>
      <div className="h-[83vh] max-h-[83vh] container w-full bg-slate-100 rounded-3xl shadow-xl px-3 dark:bg-slate-700 overflow-y-auto">
        <ModalFormFact
          accion={accion}
          onSubmit={onSubmitModal}
          currentID={currentID}
          errors={errors}
          register={register}
          setFormFact={setFormFact}
          formFact={formFact}
        />
        <div className="flex justify-start p-3">
          <h1 className="text-4xl font-xthin text-black dark:text-white md:px-12">
            Formas Facturas.
          </h1>
        </div>
        <div className="flex flex-col md:grid md:grid-cols-8 md:grid-rows-1 h-full">
          <div className="md:col-span-1 flex flex-col">
            <Acciones
              Buscar={Buscar}
              Alta={Alta}
              home={home} /*imprimir={imprimir} excel={excel}*/
            ></Acciones>
          </div>
          <div className="md:col-span-7">
            <div className="flex flex-col h-full">
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
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FormFact;
