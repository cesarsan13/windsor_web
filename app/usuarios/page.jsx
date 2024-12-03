"use client";
import React, { useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { showSwal, confirmSwal, showSwalTarget } from "@/app/utils/alerts";
import ModalUsuarios from "./components/ModalUsuario";
import Busqueda from "./components/Busqueda";
import Acciones from "./components/Acciones";
import { useForm } from "react-hook-form";
import {
  getUsuarios,
  ImprimirPDF,
  ImprimirExcel,
  guardaUsuario,
} from "../utils/api/usuarios/usuarios";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { siguiente } from "@/app/utils/api/comentarios/comentarios";
import "jspdf-autotable";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import "@react-pdf-viewer/core/lib/styles/index.css";
import TablaUsuarios from "./components/TablaUsuarios";
import { debounce, permissionsComponents } from "../utils/globalfn";
import VistaPrevia from "../components/VistaPrevia";
function Usuarios() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [usuarios, setUsuarios] = useState([]);
  const [usuario, setUsuario] = useState({});
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [animateLoading, setAnimateLoading] = useState(false);

  const [bajas, setBajas] = useState(false);
  const [openModal, setModal] = useState(false);
  const [accion, setAccion] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [currentID, setCurrentId] = useState("");
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const usuariosRef = useRef(usuarios);
  const [busqueda, setBusqueda] = useState({
    tb_id: "",
    tb_name: "",
  });
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setisLoading(true);
      const { token, permissions } = session.user;
      const es_admin = session.user.es_admin;
      const menuSeleccionado = Number(localStorage.getItem("puntoMenu"));

      const data = await getUsuarios(token, bajas);
      setUsuarios(data);
      setUsuariosFiltrados(data);
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
  }, [session, status, bajas]);
  useEffect(() => {
    usuariosRef.current = usuarios;
  }, [usuarios]);
  const Buscar = useCallback(() => {
    const { tb_id, tb_name } = busqueda;

    if (tb_id === "" && tb_name === "") {
      setUsuariosFiltrados(usuariosRef.current);
      return;
    }
    const infoFiltrada = usuariosRef.current.filter((fusuarios) => {
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
  }, [busqueda]);

  const debouncedBuscar = useMemo(() => debounce(Buscar, 500), [Buscar]);
  useEffect(() => {
    debouncedBuscar();
    return () => {
      clearTimeout(debouncedBuscar);
    };
  }, [busqueda, debouncedBuscar]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      id: usuario.id,
      nombre: usuario.nombre,
      name: usuario.name,
      email: usuario.email,
      password: usuario.password,
      match_password: usuario.match_password,
    },
  });
  useEffect(() => {
    reset({
      id: usuario.id,
      nombre: usuario.nombre,
      name: usuario.name,
      email: usuario.email,
      password: usuario.password,
      match_password: usuario.match_password,
    });
  }, [usuario, reset]);

  const limpiarBusqueda = (evt) => {
    evt.preventDefault();
    setBusqueda({ tb_id: "", tb_name: "" });
  };

  const handleVerClick = () => {
    setAnimateLoading(true);
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Usuarios",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: usuariosFiltrados,
    };

    const orientacion = "Portrait";
    const reporte = new ReportePDF(configuracion, orientacion);
    const { body } = configuracion;
    const Enca1 = (doc) => {
      if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalV();
        doc.nextRow(12);
        doc.ImpPosX("Id", 15, doc.tw_ren);
        doc.ImpPosX("Usuario", 30, doc.tw_ren);
        doc.ImpPosX("Nombre", 70, doc.tw_ren);
        doc.ImpPosX("Email", 150, doc.tw_ren);

        doc.nextRow(4);
        doc.printLineV();
        doc.nextRow(4);
        doc.tiene_encabezado = true;
      } else {
        doc.nextRow(6);
        doc.tiene_encabezado = true;
      }
    };

    Enca1(reporte);
    body.forEach((usuarios) => {
      reporte.ImpPosX(usuarios.id.toString(), 20, reporte.tw_ren, 0, "R");
      reporte.ImpPosX(usuarios.name.toString(), 30, reporte.tw_ren, 35, "L");
      reporte.ImpPosX(usuarios.nombre.toString(), 70, reporte.tw_ren, 35, "L");
      reporte.ImpPosX(usuarios.email.toString(), 150, reporte.tw_ren, 35, "L");
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
      ? document.getElementById("modalVPUsuario").showModal()
      : document.getElementById("modalVPUsuario").close();
  };

  const CerrarView = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVPUsuario").close();
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
      match_password: "",
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
        Nombre_Reporte: "Reporte de Usuarios",
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
        Nombre_Reporte: "Reporte de Usuarios",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },

      body: usuariosFiltrados,
      columns: [
        { header: "Id", dataKey: "id" },
        { header: "Usuario", dataKey: "name" },
        { header: "Nombre", dataKey: "nombre" },
        { header: "Email", dataKey: "email" },
      ],
      nombre: "Usuarios",
    };
    ImprimirExcel(configuracion);
  };

  const onSubmitModal = handleSubmit(async (data) => {
    event.preventDefault;

    const password1 = watch("password", "");
    const password2 = watch("match_password", "");

    if (password1 !== password2) {
      showSwal(
        "Error de Validación",
        "Las contraseñas no coinciden",
        "error",
        "modal_usuarios"
      );
      return;
    } else {
      if (
        (accion === "Alta" || accion === "Editar") &&
        (password1 === "" || password2 === "")
      ) {
        showSwal(
          "Error de Validación",
          "Por favor capture las contraseñas",
          "error",
          "modal_usuarios"
        );
        return;
      }

      let res = null;

      if (accion === "Eliminar") {
        const confirmed = await confirmSwal(
          "¿Desea Continuar?",
          "Se eliminara al usuario seleccionado",
          "warning",
          "Aceptar",
          "Cancelar",
          "modal_usuarios"
        );
        if (!confirmed) {
          return;
        }
      }

      data.numero_prop = 1;

      res = await guardaUsuario(session.user.token, data, accion);
      if (res.status) {
        if (accion === "Alta") {
          data.id = res.data;
          setCurrentId(data.id);
          const nuevoUsuarios = { currentID, ...data };
          setUsuarios([...usuarios, nuevoUsuarios]);
          if (!bajas) {
            setUsuariosFiltrados([...usuariosFiltrados, nuevoUsuarios]);
          }
        }
        if (accion === "Eliminar" || accion === "Editar") {
          const index = usuarios.findIndex((fp) => fp.id === data.id);
          if (index !== -1) {
            if (accion === "Eliminar") {
              const fpFiltrados = usuarios.filter((fp) => fp.id !== data.id);
              setUsuarios(fpFiltrados);
              setUsuariosFiltrados(fpFiltrados);
            } else {
              if (bajas) {
                const fpFiltrados = usuarios.filter((fp) => fp.id !== data.id);
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
      <VistaPrevia
        id="modalVPUsuario"
        titulo={"Vista Previa de Usuarios"}
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
                animateLoading={animateLoading}
                permiso_alta={permissions.altas}
                permiso_imprime={permissions.impresion}
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
              permiso_cambio={permissions.cambios}
              permiso_baja={permissions.bajas}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Usuarios;
