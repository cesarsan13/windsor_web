"use client";
import React, { useCallback, useRef, useMemo } from "react";
import Acciones from "@/app/clases/components/Acciones";
import TablaClases from "@/app/clases/components/tablaClases";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  getClases,
  guardaClase,
  Imprimir,
  ImprimirExcel,
} from "@/app/utils/api/clases/clases";
import VistaPrevia from "@/app/components/VistaPrevia";
import Busqueda from "@/app/clases/components/Busqueda";
import ModalClases from "@/app/clases/components/modalClases";
import { ReportePDF } from "../utils/ReportesPDF";
import { showSwal, confirmSwal, showSwalAndWait } from "../utils/alerts";
import { debounce, obtenerFechaYHoraActual } from "../utils/globalfn";
import "@react-pdf-viewer/core/lib/styles/index.css";

function Clases() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [clases, setClases] = useState([]);
  const [clase, setClase] = useState({});
  const [clasesFiltrados, setClasesFiltrados] = useState(null);
  const [bajas, setBajas] = useState(false);
  const [openModal, setModal] = useState(false);
  const [accion, setAccion] = useState("");
  const [grado, setGrado] = useState({});
  const [grado2, setGrado2] = useState({});
  const [materia, setMateria] = useState({});
  const [profesor, setProfesor] = useState({});
  const [animateLoading, setAnimateLoading] = useState(false);
  const [isLoadingButton, setisLoadingButton] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const clasesRef = useRef(clases);
  const [currentID, setCurrentId] = useState({
    grupo: "",
    materia: "",
  });
  const [contador, setContador] = useState(0);
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const [busqueda, setBusqueda] = useState({
    tb_grupo: "",
    tb_materia: "",
    tb_profesor: "",
  });
  useEffect(() => {
    clasesRef.current = clases;
  }, [clases]);
  useEffect(() => {
    const fetchData = async () => {
      setisLoading(true);
      const { token } = session.user;
      const data = await getClases(token, bajas);
      setClases(data);
      setClasesFiltrados(data);
      setisLoading(false);
    };
    if (status === "loading" || !session) {
      return;
    }
    fetchData();
  }, [session, status, bajas]);

  const Buscar = useCallback(() => {
    const { tb_grupo, tb_materia, tb_profesor } = busqueda;
    if (tb_grupo === "" && tb_materia === "" && tb_profesor === "") {
      setClasesFiltrados(clasesRef.current);
      return;
    }
    const infoFiltrada = clasesRef.current.filter((clase) => {
      const coincideGrupo = tb_grupo
        ? clase["grupo_descripcion"]?.toString().toLowerCase().includes(tb_grupo.toLowerCase())
        : true;
      const coincideMateria = tb_materia
        ? clase["materia_descripcion"]?.toString().toLowerCase().includes(tb_materia.toLowerCase())
        : true;
      const coincideProfesor = tb_profesor
        ? clase["profesor_nombre"]?.toString().toLowerCase().includes(tb_profesor.toLowerCase())
        : true;
      return coincideGrupo && coincideMateria && coincideProfesor;
    });
    setClasesFiltrados(infoFiltrada);
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
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      grupo: clase.grupo,
      materia: clase.materia,
      profesor: clase.profesor,
      lunes: clase.lunes,
      martes: clase.martes,
      miercoles: clase.miercoles,
      jueves: clase.jueves,
      viernes: clase.viernes,
      sabado: clase.sabado,
      domingo: clase.domingo,
    },
  });
  useEffect(() => {
    reset({
      grupo: clase.grupo,
      materia: clase.materia,
      profesor: clase.profesor,
      lunes: clase.lunes,
      martes: clase.martes,
      miercoles: clase.miercoles,
      jueves: clase.jueves,
      viernes: clase.viernes,
      sabado: clase.sabado,
      domingo: clase.domingo,
    });
  }, [clase, reset]);



  const limpiarBusqueda = (evt) => {
    evt.preventDefault;
    setBusqueda({ tb_grupo: "", tb_materia: "", tb_profesor: "" });
  };
  // useEffect(() => {
  //   setMateria({});
  //   setProfesor({});
  //   setGrado({});
  // }, [limpiaBusCat]);
  const Alta = async (event) => {
    setCurrentId("");
    setContador(prevCount => prevCount + 1); // Cambia la clave para re-renderizar los buscat
    reset({
      grupo: "",
      materia: "",
      profesor: "",
      lunes: "",
      martes: "",
      miercoles: "",
      jueves: "",
      viernes: "",
      sabado: "",
      domingo: "",
    });
    setModal(!openModal);
    setAccion("Alta");
    showModal(true);
    console.log("Materia: ",materia);
    console.log("Profesor: ",profesor);
    console.log("Grado: ",grado);
    // setMateria({numero:"",descripcion:""});
    // setProfesor({numero:"",nombre:""});
    // setGrado({numero:"",horario:""});
    // setLimpiaBusCat(true)
    // Forzar un renderizado
    setMateria({});
    setProfesor({});
    setGrado({});
    console.log("2Materia: ",materia);
    console.log("2Profesor: ",profesor);
    console.log("2Grado: ",grado);
    document.getElementById("lunes").focus();
  };

  const handleReset = () => {
    setMateria({});
    setProfesor({});
    setGrado({});
};
  const onSubmitModal = handleSubmit(async (data) => {
    event.preventDefault();
    if (!currentID) {
      // console.log("Clases: ",clases);
      const claseExistente = clases.find(
        (clase) =>
          clase.grupo === data.grupo &&
          clase.materia === data.materia &&
          clase.profesor === data.profesor &&
          clase.id !== currentID
      );
      if (claseExistente) {
        showSwal(
          "Error",
          "Esta combinación de grupo, materia y profesor ya está registrada.",
          "error",
          "my_modal_3"
        );
        return;
      }
    }
    setisLoadingButton(true);
    let res = null;
    if (accion === "Eliminar") {
      showModal(false);
      const confirmed = await confirmSwal(
        "¿Desea Continuar?",
        "Se eliminara la clase seleccionada",
        "warning",
        "Aceptar",
        "Cancelar"
      );
      if (!confirmed) {
        showModal(true);
        return;
      }
    }
    data.grupo = grado.numero ?? clase.grupo;
    data.grupo_descripcion = grado.horario ?? clase.grupo_descripcion;
    data.materia = materia.numero ?? clase.materia;
    data.materia_descripcion = materia.descripcion ?? clase.materia_descripcion;
    data.profesor = profesor.numero ?? clase.profesor;
    data.profesor_nombre = profesor.nombre_completo ?? clase.profesor_nombre;
    res = await guardaClase(session.user.token, data, accion);
    if (res.status) {
      if (accion === "Alta") {
        const nuevaClase = { currentID, ...data };
        setClases([...clases, nuevaClase]);
        if (!bajas) {
          setClasesFiltrados([...clasesFiltrados, nuevaClase]);
        }
      } else if (accion === "Eliminar" || accion === "Editar") {
        const index = clases.findIndex(
          (c) => c.grupo === data.grupo && c.materia === data.materia
        );
        if (index !== -1) {
          if (accion === "Eliminar") {
            const cFiltrados = clases.filter(
              (c) => c.grupo !== data.grupo || c.materia !== data.materia
            );
            setClases(cFiltrados);
            setClasesFiltrados(cFiltrados);
          } else {
            if (bajas) {
              const cFiltrados = clases.filter(
                (c) => c.grupo !== data.grupo || c.materia !== data.materia
              );
              setClases(cFiltrados);
              setClasesFiltrados(cFiltrados);
            } else {
              const cActualizadas = clases.map((c) =>
                c.grupo === data.grupo && c.materia === data.materia ? { ...c, ...data } : c
              );
              setClases(cActualizadas);
              setClasesFiltrados(cActualizadas);
            }
          }
        }
      }
      setisLoadingButton(false);
      showModal(false);
      await showSwalAndWait(res.alert_title, res.alert_text, res.alert_icon);
    } else {
      setisLoadingButton(false);
      showModal(false);
      await showSwalAndWait(res.alert_title, res.alert_text, res.alert_icon, 8000);
      showModal(true);
    };6
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

  const ImprimePDF = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Datos Clases",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: clasesFiltrados,
    };
    Imprimir(configuracion);
  };

  const ImprimeExcel = () => {
    const { fecha, hora } = obtenerFechaYHoraActual();
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Datos Clases",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: clasesFiltrados,
      columns: [
        { header: "Grupo", dataKey: "grupo_descripcion" },
        { header: "Asignatura", dataKey: "materia_descripcion" },
        { header: "Profesor", dataKey: "profesor_nombre" },
        { header: "Lunes", dataKey: "lunes" },
        { header: "Martes", dataKey: "martes" },
        { header: "Miercoles", dataKey: "miercoles" },
        { header: "Jueves", dataKey: "jueves" },
        { header: "Viernes", dataKey: "viernes" },
        { header: "Sabado", dataKey: "sabado" },
        { header: "Domingo", dataKey: "domingo" },
      ],
      nombre: `Reporte_Clases_${fecha}${hora}`,
    };
    ImprimirExcel(configuracion);
  };

  const handleVerClick = () => {
    setAnimateLoading(true);
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Datos Clase",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
    };
    const Enca1 = (doc) => {
      if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalH();
        doc.nextRow(12);
        doc.ImpPosX("Grupo", 14, doc.tw_ren, 0, "L");
        doc.ImpPosX("Asignatura", 50, doc.tw_ren, 0, "L");
        doc.ImpPosX("Profesor", 95, doc.tw_ren, 0, "L");
        doc.ImpPosX("Lunes", 180, doc.tw_ren, 0, "L");
        doc.ImpPosX("Martes", 195, doc.tw_ren, 0, "L");
        doc.ImpPosX("Miercoles", 210, doc.tw_ren, 0, "L");
        doc.ImpPosX("Jueves", 230, doc.tw_ren, 0, "L");
        doc.ImpPosX("Viernes", 245, doc.tw_ren, 0, "L");
        doc.ImpPosX("Sabado", 260, doc.tw_ren, 0, "L");
        doc.ImpPosX("Domingo", 275, doc.tw_ren, 0, "L");
        doc.nextRow(4);
        doc.printLineH();
        doc.nextRow(4);
        doc.tiene_encabezado = true;
      } else {
        doc.nextRow(6);
        doc.tiene_encabezado = true;
      }
    };
    const orientacion = "Landscape";
    const reporte = new ReportePDF(configuracion, orientacion);
    Enca1(reporte);
    clasesFiltrados.forEach((clase) => {
      reporte.ImpPosX(clase.grupo_descripcion?.toString() ?? "", 14, reporte.tw_ren, 12, "L");
      reporte.ImpPosX(clase.materia_descripcion?.toString() ?? "", 50, reporte.tw_ren, 20, "L");
      reporte.ImpPosX(clase.profesor_nombre?.toString() ?? "", 95, reporte.tw_ren, 35, "L");
      reporte.ImpPosX(clase.lunes?.toString() ?? "", 180, reporte.tw_ren, 0, "L");
      reporte.ImpPosX(clase.martes?.toString() ?? "", 195, reporte.tw_ren, 0, "L");
      reporte.ImpPosX(clase.miercoles?.toString() ?? "", 210, reporte.tw_ren, 0, "L");
      reporte.ImpPosX(clase.jueves?.toString() ?? "", 230, reporte.tw_ren, 0, "L");
      reporte.ImpPosX(clase.viernes?.toString() ?? "", 245, reporte.tw_ren, 0, "L");
      reporte.ImpPosX(clase.sabado?.toString() ?? "", 260, reporte.tw_ren, 0, "L");
      reporte.ImpPosX(clase.domingo?.toString() ?? "", 275, reporte.tw_ren, 0, "L");
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
    }, 500)
  };

  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVPClase").showModal()
      : document.getElementById("modalVPClase").close();
  };

  const CerrarView = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVPClase").close();
  };

  if (status === "loading") {
    return (
      <div className="container skeleton w-full max-w-screen-xl shadow-xl rounded-xl"></div>
    );
  };
  return (
    <>
      <ModalClases
        session={session}
        accion={accion}
        onSubmit={onSubmitModal}
        currentID={currentID}
        errors={errors}
        register={register}
        setClase={setClase}
        clase={clase}
        setGrado={setGrado}
        setGrado2={setGrado2}
        setProfesor={setProfesor}
        setMateria={setMateria}
        watch={watch}
        isLoadingButton={isLoadingButton}
        contador={contador}
      />
      <VistaPrevia
        id="modalVPClase"
        titulo={"Vista PRevia de Clases"}
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
                contador={contador}
              />
            </div>

            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
              Clases
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
            {status === "loading" ||
              (!session ? (
                <></>
              ) : (
                <TablaClases
                  session={session}
                  isLoading={isLoading}
                  clasesFiltrados={clasesFiltrados}
                  showModal={showModal}
                  setClase={setClase}
                  setAccion={setAccion}
                  setCurrentId={setCurrentId}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Clases;
