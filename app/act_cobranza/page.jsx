"use client";
import React, { useEffect, useState } from "react";
import Acciones from "@/app/act_cobranza/components/Acciones";
import { useSession } from "next-auth/react";
import TablaDocumentosCobranza from "@/app/act_cobranza/components/tablaDocumentosCobranza";
import {
  getDocumentosAlumno,
  guardarActCobranza,
} from "@/app/utils/api/act_cobranza/act_cobranza";
import { confirmSwal, showSwal } from "@/app/utils/alerts";
import ModalActCobranza from "@/app/act_cobranza/components/ModalActCobranza";
import { useForm } from "react-hook-form";
import {
  Elimina_Comas,
  formatFecha,
  formatNumber,
  permissionsComponents,
  format_Fecha_String
} from "@/app/utils/globalfn";
import { useRouter } from "next/navigation";
import Busqueda from "@/app/act_cobranza/components/Busqueda";
import { getProductos } from "@/app/utils/api/productos/productos";

function Act_Cobranza() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoadingDocumentos, setisLoadingDocumentos] = useState(false);
  const [alumno, setAlumno] = useState({});
  const [productos, setProductos] = useState([]);
  const [accion, setAccion] = useState("");
  const [documentos, setDocumentos] = useState([]);
  const [documentosFiltrados, setDocumentosFiltrados] = useState([]);
  const [documento, setDocumento] = useState({});
  const [currentID, setCurrentId] = useState("");
  const [producto, setProducto] = useState({});
  const [currentIDDocumento, setCurrentIdDocumento] = useState("");
  const [permissions, setPermissions] = useState({});
  const [busqueda, setBusqueda] = useState({
    tb_id: "",
    tb_desc: "",
  });

  useEffect(() => {
    if (status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {
      const { token, permissions } = session.user;
      const es_admin = session.user.es_admin;
      const menu_seleccionado = Number(localStorage.getItem("puntoMenu"));
      const dataProducto = await getProductos(token, false);
      setProductos(dataProducto);
      const permisos = permissionsComponents(
        es_admin,
        permissions,
        session.user.id,
        menu_seleccionado
      );
      setPermissions(permisos);
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      producto: documento.producto,
      numero_doc: documento.numero_doc,
      fecha: formatFecha(documento.fecha),
      importe: documento.importe,
      descuento: documento.descuento,
    },
  });

  useEffect(() => {
    reset({
      producto: documento.producto,
      numero_doc: documento.numero_doc,
      fecha: formatFecha(documento.fecha),
      importe: formatNumber(documento.importe, 2),
      descuento: formatNumber(documento.descuento, 2),
    });
  }, [documento, reset]);

  useEffect(() => {
    const documentosAlumno = async (id) => {
      setCurrentId(id);
      setisLoadingDocumentos(true);
      const { token } = session.user;
      const data = await getDocumentosAlumno(token, id);
      setDocumentos(data);
      setDocumentosFiltrados(data);
      setisLoadingDocumentos(false);
    };
    if (alumno.numero) {
      documentosAlumno(alumno.numero);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alumno]);

  const Alta = async (event) => {
    if (!currentID) {
      showSwal("INFO", "Debe seleccionar a un alumno", "info");
      return;
    }
    setDocumento({});
    reset({
      producto: "",
      numero_doc: "",
      fecha: "",
      importe: "",
      descuento: "",
    });
    setAccion("Alta");
    showModal(true);
  };

  const showModal = (show) => {
    show
      ? document.getElementById("my_modal_3").showModal()
      : document.getElementById("my_modal_3").close();
  };

  if (status === "loading") {
    return (
      <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }

  const onSubmitModal = handleSubmit(async (data) => {
    event.preventDefault();
    if (accion === "Alta") {
      data.producto = producto.numero;
      data.descripcion = producto.descripcion;
    }
    data.alumno = currentID;
    setCurrentIdDocumento(data.documento);
    if (accion === "Eliminar") {
      showModal(false);
      const confirmed = await confirmSwal(
        "¿Desea Continuar?",
        "Se eliminará el documento seleccionado.",
        "warning",
        "Aceptar",
        "Cancelar"
      );
      if (!confirmed) {
        showModal(true);
        return;
      }
    }
    data.importe = Elimina_Comas(data.importe);
    data.descuento = Elimina_Comas(data.descuento);
    const res = await guardarActCobranza(session.user.token, accion, data);
    data.importe = formatNumber(data.importe, 2);
    data.descuento = formatNumber(data.descuento, 2);
    if (res.status) {
      if (accion === "Alta") {
        const nuevaActividad = { currentIDDocumento, ...data };
        setDocumentos([...documentos, nuevaActividad]);
        setDocumentosFiltrados([...documentos, nuevaActividad]);
      }

      if (accion === "Eliminar" || accion === "Editar") {
        const index = documentos.findIndex(
          (fp) =>
            fp.numero_doc === data.numero_doc &&
            fp.producto === data.producto &&
            fp.fecha === format_Fecha_String(data.fecha)
        );
        if (index !== -1) {
          if (accion === "Eliminar") {
            const actDocFiltrados = documentos.filter(
              (fp) =>
                fp.numero_doc !== data.numero_doc ||
                fp.producto !== data.producto ||
                fp.fecha !== format_Fecha_String(data.fecha)
            );
            setDocumentos(actDocFiltrados);
            setDocumentosFiltrados(actDocFiltrados);
          } else {
            const actDocActualizadas = documentos.map((fp) =>
              fp.numero_doc === data.numero_doc &&
              fp.producto === data.producto &&
              fp.fecha === format_Fecha_String(data.fecha)
                ? { ...fp, ...data }
                : fp
            );
            setDocumentos(actDocActualizadas);
            setDocumentosFiltrados(actDocActualizadas);
          }
        }
      }
      showSwal(res.alert_title, res.alert_text, res.alert_icon);
      showModal(false);
    } else {
      showSwal(res.alert_title, res.alert_text, res.alert_icon);
      showModal(false);
    }
  });

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

  const limpiarBusqueda = (evt) => {
    evt.preventDefault;
    setBusqueda({ tb_id: "", tb_desc: "" });
  };

  const Buscar = () => {
    const { tb_id, tb_desc } = busqueda;
    if (tb_id === "" && tb_desc === "") {
      setDocumentosFiltrados(documentos);
      return;
    }
    const infoFiltrada = documentos.filter((documento) => {
      const coincideId = tb_id
        ? documento["producto"].toString().includes(tb_id)
        : true;
      const coincideDescripcion = tb_desc
        ? documento["descripcion"]
            .toString()
            .toLowerCase()
            .includes(tb_desc.toLowerCase())
        : true;
      return coincideId && coincideDescripcion;
    });
    setDocumentosFiltrados(infoFiltrada);
  };

  const handleBlur = (evt, datatype) => {
    if (evt.target.value === "") return;
      setValue(evt.target.name, formatNumber(evt.target.value, 2));
  };

  const handleInputClick = (evt) => {
    evt.preventDefault();
    evt.target.select();
  };

  return (
    <>
      <ModalActCobranza
        accion={accion}
        session={session}
        documento={documento}
        errors={errors}
        register={register}
        onSubmit={onSubmitModal}
        setProducto={setProducto}
        handleBlur={handleBlur}
        handleInputClick={handleInputClick}
      ></ModalActCobranza>
      <div className="container h-[80vh] w-full max-w-screen-xl bg-base-200 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden">
        <div className="flex flex-col justify-start p-3">
          <div className="flex flex-wrap md:flex-nowrap items-start md:items-center">
            <div className="order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0 pr-4">
              <Acciones
                Alta={Alta}
                home={home}
                Buscar={Buscar}
                permiso_alta={permissions.alta}
              />
            </div>
            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
              Actualización de Cobranza
            </h1>
          </div>
        </div>
        <div className="flex flex-col items-center w-full">
          <div className="w-full max-w-4xl max-h-full overflow-y-scroll">
            <Busqueda
              busqueda={busqueda}
              Buscar={Buscar}
              handleBusquedaChange={handleBusquedaChange}
              limpiarBusqueda={limpiarBusqueda}
              session={session}
              setAlumno={setAlumno}
            />
            <TablaDocumentosCobranza
              isLoading={isLoadingDocumentos}
              documentos={documentosFiltrados}
              setAccion={setAccion}
              setCurrentId={setCurrentIdDocumento}
              setDocumento={setDocumento}
              showModal={showModal}
              productos={productos}
              permiso_cambio={permissions.cambios}
              permiso_baja={permissions.bajas}
            ></TablaDocumentosCobranza>
          </div>
        </div>
      </div>
    </>
  );
}

export default Act_Cobranza;
