"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { showSwal, confirmSwal } from "../utils/alerts";
import ModalUsuarios from "./components/ModalUsuario";
import Busqueda from "./components/Busqueda";
import Acciones from "./components/Acciones";
import { useForm } from "react-hook-form";
import { getUsuarios } from "../utils/api/usuarios/usuarios";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { siguiente } from "@/app/utils/api/comentarios/comentarios";
import "jspdf-autotable";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import "@react-pdf-viewer/core/lib/styles/index.css";
import ModalVistaPreviaComentarios from "@/app/comentarios/components/modalVistaPreviaComentarios";
import TablaUsuarios from "./components/TablaUsuarios";

function Usuarios() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [usuarios, setUsuarios] = useState([]);
  const [usuario, setUsuario] = useState({});
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);

  const [bajas, setBajas] = useState(false);
  const [openModal, setModal] = useState(false);
  const [accion, setAccion] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [currentID, setCurrentId] = useState("");
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const [busqueda, setBusqueda] = useState({
    tb_id: "",
    tb_name: "",
  });
  useEffect(() => {
    if (status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {
      setisLoading(true);
      const { token } = session.user;
      const data = await getUsuarios(token, bajas);
      setUsuarios(data);
      setUsuariosFiltrados(data);
      setisLoading(false);
    };
    fetchData();
  }, [session, status, bajas]);

  useEffect(() => {
    Buscar();
  }, [busqueda]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
        id:usuario.id,
        nombre:usuario.nombre,
        name:usuario.name,
        email:usuario.email,
        password:usuario.password,
        password_confirm:usuario.password_confirm
    },
  });
  useEffect(() => {
    reset({
        id:usuario.id,
        nombre:usuario.nombre,
        name:usuario.name,
        email:usuario.email,
        password:usuario.password,
        password_confirm:usuario.password_confirm
    });
  }, [usuario, reset]);

  const Buscar = () => {
    const { tb_id, tb_name } = busqueda;

    if (tb_id === "" && tb_name === "") {
      setUsuariosFiltrados(usuarios);
      return;
    }
    const infoFiltrada = usuarios.filter((fusuarios) => {
      const coincideID = tb_id
        ? fusuarios["id"].toString().includes(tb_id)
        : true;
      const coincideusuario = tb_name
        ? fusuarios["name"]
            .toString()
            .toLowerCase()
            .includes(tb_name.toLowerCase())
        : true;
      return coincideID && coincideusuario;
    });
    setUsuariosFiltrados(infoFiltrada);
  };
  const limpiarBusqueda = (evt) => {
    evt.preventDefault;
    setBusqueda({ tb_id: "", tb_name: "" });
  };

  const handleVerClick = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Comentarios",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: usuariosFiltrados,
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
    const pdfData = reporte.doc.output("datauristring");
    setPdfData(pdfData);
    setPdfPreview(true);
    showModalVista(true);
  };

  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVPComentario").showModal()
      : document.getElementById("modalVPComentario").close();
  };

  const CerrarView = () => {
    setPdfPreview(false);
    setPdfData("");
  };

  const Alta = async (event) => {
    setCurrentId("");
    const { token } = session.user;
    reset({
      id: "",
      name: "",
      nombre: "",
      email: "",
      password: "",
      password_confirm:""
    });

    setUsuario({ id: "" });
    setModal(!openModal);
    setAccion("Alta");
    showModal(true);

    document.getElementById("name").focus();
  };

  const ImprimePDF = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Comentarios",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: usuariosFiltrados,
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

      body: usuariosFiltrados,
      columns: [
        { header: "Id", dataKey: "numero" },
        { header: "Comentario 1", dataKey: "comentario_1" },
        { header: "Comentario 2", dataKey: "comentario_2" },
        { header: "Comentario 3", dataKey: "comentario_3" },
        { header: "Generales", dataKey: "generales" },
      ],

      nombre: "Comentarios",
    };
    ImprimirExcel(configuracion);
  };

  const onSubmitModal = handleSubmit(async (data) => {
    event.preventDefault;
    accion === "Alta" ? (data.id = "") : (data.id = currentID);
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
        return;
      }
    }

    const formData = new FormData();
    formData.append("id", data.id || "");
    formData.append("nombre", data.nombre || "");
    formData.append("name", data.name || "");
    formData.append("email", data.email || "");
    formData.append("password", data.password || "");
    formData.append("numero_prop", 1 || "");

    res = await guardaComentarios(session.user.token, formData, accion);
    if (res.status) {
      if (accion === "Alta") {
        
        //const password = watch("password");
        //const password_confirm = watch("password_confirm");

        data.id = res.data;
        setCurrentId(data.id);
        const nuevoUsuarios = { currentID, ...data };
        setUsuarios([...usuarios, nuevoUsuarios]);
        if (!bajas) {
          setUsuariosFiltrados([
            ...usuariosFiltrados,
            nuevoUsuarios,
          ]);
        }
      }
      if (accion === "Eliminar" || accion === "Editar") {
        const index = usuarios.findIndex(
          (fp) => fp.id === data.id
        );
        if (index !== -1) {
          if (accion === "Eliminar") {
            const fpFiltrados = usuarios.filter(
              (fp) => fp.id !== data.id
            );
                setUsuarios(fpFiltrados);
                setUsuariosFiltrados(fpFiltrados);
          } else {
            if (bajas) {
              const fpFiltrados = usuarios.filter(
                (fp) => fp.id !== data.id
              );
                setUsuarios(fpFiltrados);
                setUsuariosFiltrados(fpFiltrados);
            } else {
              const fpActualizadas = usuarios.map((fp) =>
                fp.id === currentID ? { ...fp, ...data } : fp
              );
                setUsuarios(fpActualizadas);
                setUsuariosFiltrados(fpActualizadas);
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
      ? document.getElementById("modal_usuarios").showModal()
      : document.getElementById("modal_usuarios").close();
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

  if (status === "loading") {
    return (
      <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  return (
    <>
      <ModalUsuarios
        accion={accion}
        onSubmit={onSubmitModal}
        currentID={currentID}
        errors={errors}
        register={register}
        setUsuario={setUsuario}
        Usuario={usuario}
        watch={watch}
      />
      <ModalVistaPreviaComentarios
        pdfPreview={pdfPreview}
        pdfData={pdfData}
        PDF={ImprimePDF}
        Excel={ImprimeExcel}
      />

      <div className="container h-[80vh] w-full max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden">
        <div className="flex flex-col justify-start p-3">
          <div className="flex flex-wrap md:flex-nowrap items-start md:items-center">
            <div className="order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0">
              <Acciones
                Buscar={Buscar}
                Alta={Alta}
                // ImprimePDF={ImprimePDF}
                // ImprimeExcel={ImprimeExcel}
                home={home}
                Ver={handleVerClick}
                // CerrarView={CerrarView}
              ></Acciones>
            </div>

            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
              Usuarios
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
            <TablaUsuarios
              isLoading={isLoading}
              usuariosFiltrados={usuariosFiltrados}
              showModal={showModal}
              setUsuario={setUsuario}
              setAccion={setAccion}
              setCurrentId={setCurrentId}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Usuarios;
