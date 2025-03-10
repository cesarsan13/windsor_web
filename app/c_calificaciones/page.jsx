"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Acciones from "@/app/c_calificaciones/components/Acciones";
import { useSession } from "next-auth/react";
import BuscarCat from "@/app/components/BuscarCat";
import Inputs from "@/app/c_calificaciones/components/Inputs";
import TablaCalificaciones from "@/app/c_calificaciones/components/tablaCalificaciones";
import {
  setGlobalVariable,
  globalVariables,
  loadGlobalVariables,
  permissionsComponents,
} from "@/app/utils/globalfn";
import {
  getMateriaEvaluacion,
  getMateriaBuscar,
} from "@/app/utils/api/materias/materias";
import { getActividadSecuencia } from "@/app/utils/api/actividades/actividades";
import { getContraseñaProfe } from "@/app/utils/api/profesores/profesores";
import {
  getProcesoCalificaciones,
  getProcesoCalificacionesAlumnos,
  guardarProcesoCalificaciones,
  ImprimirPDF,
  ImprimirExcel,
} from "@/app/utils/api/calificaciones/calificaciones";
import { showSwal, confirmSwal } from "@/app/utils/alerts";
import ModalVistaPreviaCalis from "@/app/c_calificaciones/components/modalVistaPreviaCalis";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import { getClasesBuscaCat } from "@/app/utils/api/clases/clases";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "jspdf-autotable";

function C_Calificaciones() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [openModal, setModal] = useState(false);
  const [accion, setAccion] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [isLoading2, setisLoading2] = useState(false);
  const [currentID, setCurrentId] = useState("");
  const [calificacion, setCalificacion] = useState({});
  const [calificaciones, setCalificaciones] = useState([]);
  const [grupo, setGrupo] = useState({});
  const [asignatura, setAsignatura] = useState([]);
  const [calificacionesFiltrados, setCalificacionesFiltrados] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDisabledSave, setIsDisabledSave] = useState(false);
  const [isDisabled2, setIsDisabled2] = useState(false);
  const [isDisabled3, setIsDisabled3] = useState(false);
  const [actividades, setActividades] = useState([]);
  const [evaluacion, setEvaluacion] = useState([]);

  const [bimestreSelected, setBimestreSelected] = useState([]);
  const [actividadSelected, setActividadesSelected] = useState([]);
  const [evaluacionSelected, setEvaluacionSelected] = useState([]);
  const [asignaturaSelected, setAsignaturaSelected] = useState([]);

  const [isLoadingPDF, setisLoadingPDF] = useState(false);

  const [permissions, setPermissions] = useState({});

  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  let materia = watch("materia");

  useEffect(() => {
    setCalificaciones([]);
    setCalificacionesFiltrados([]);
  }, [
    bimestreSelected,
    grupo,
    asignaturaSelected,
    evaluacionSelected,
    actividadSelected,
  ]);

  const handlBimestreChange = (event) => {
    setBimestreSelected(event.target.value);    
  };
  const handlEvalChange = (event) => {
    setEvaluacionSelected(event.target.value);    
  };
  const handlActividadesChange = (event) => {
    setActividadesSelected(event.target.value);    
  };
  const handlAsignaturaChange = (event) => {
    setAsignaturaSelected(event.target.value);
  };

  useEffect(() => {
    if (status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {
      let res = null,
        res2 = null,
        res3 = null;
      // let vg_area = '', vg_actividad = '', vg_caso_evaluar = '';
      const { token, permissions } = session.user;
      const es_admin = session.user.es_admin;
      if (materia !== "") {
        res = await getMateriaBuscar(token, materia);
        if (res.data) {
          res.data.forEach((element) => {
            setGlobalVariable("vg_area", element.area);
            setGlobalVariable("vg_actividad", element.actividad);
            setGlobalVariable("vg_caso_evaluar", element.caso_evaluar);
          });
        }
        loadGlobalVariables();
        if (globalVariables.vg_actividad === "No") {
          setIsDisabled2(false);
        } else {
          setIsDisabled2(true);
        }

        if (globalVariables.vg_area === 1 || globalVariables.vg_area == 4) {
          setIsDisabled3(true);
        } else {
          setIsDisabled3(false);
        }

        // if (vg_actividad === 'Si') {
        res2 = await getActividadSecuencia(token, materia);
        if (res2.status) {
          setIsDisabled2(true);
          setActividades(res2.data);
        }
        // else {
        //     showSwal('Error', 'No hay actividades para esta materia', 'error');
        // }
        // } else {
        res3 = await getMateriaEvaluacion(token, materia);
        if (res3.status) {
          const Cb_Evaluacion = [];
          const evaluaciones = res3.data[0].evaluaciones;
          let numeroValuaciones = 0;
          for (let i = 1; i <= evaluaciones; i++) {
            Cb_Evaluacion.push({ id: i, descripcion: i });
            numeroValuaciones += 1;
          }
          setIsDisabled3(true);
          setEvaluacion(Cb_Evaluacion);
        }
        // else {
        //     showSwal('Error', 'No hay evaluación para esta materia', 'error');
        // }
        // }
        const menu_seleccionado = Number(localStorage.getItem("puntoMenu"));

        const permisos = permissionsComponents(
          es_admin,
          permissions,
          session.user.id,
          menu_seleccionado
        );
        setPermissions(permisos);
      }
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [materia]);

  useEffect(() => {
    if (status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {
      const { token } = session.user;
      if (!grupo.numero) {
        return;
      }
      let datos = await getClasesBuscaCat(token, grupo.numero);
      if (datos.length > 0) {
        setAsignatura(datos);
        setIsDisabled(true);
      } else {
        showSwal(
          "¡Atención!",
          "El grupo seleccionado no tiene asignaturas disponibles. Por favor, elige otro grupo.",
          "error"
        );
        setIsDisabled(false);
        setAsignatura([]);
        setEvaluacion([]);
        setActividades([]);
      }
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grupo.numero]);

  const validar = async (grupo, materia, contraseña) => {
    const { token } = session.user;
    let validar;
    let res = await getContraseñaProfe(token, grupo, materia);
    const data = res.data;
    if (!data.contraseña) {
      showSwal("Error", "Grupo no asignado a profesor.", "error");
      return false;
    }
    if (contraseña.toLowerCase() === data.contraseña.toLowerCase()) {
      validar = true;
    } else {
      validar = false;
      showSwal("Error", "Grupo no asignado a profesor.", "error");
    }
    return validar;
  };

  const Guardar = handleSubmit(async (data) => {
    const { token } = session.user;
    if (!data) {
      return;
    }
    if (calificaciones.length <= 0) {
      return;
    }
    if (actividades.length <= 0 || evaluacion.length <= 0) {
      showSwal(
        "ERROR",
        "Para guardar, se necesita la actividad y la evaluación.",
        "error"
      );
      return;
    }
    setIsDisabledSave(true);
    data.grupo = grupo.horario;
    data.materia = materia;
    const promises = calificaciones.map(async (calificacion) => {
      try {
        return await guardarProcesoCalificaciones(token, calificacion, data);
      } catch (error) {}
    });
    const results = await Promise.all(promises);
    showSwal(
      "ÉXITO",
      "Las calificaciones se han registrado correctamente.",
      "success"
    );
    setIsDisabledSave(false);
  });

  const Buscar = handleSubmit(async (data) => {
    const { token } = session.user;
    if (evaluacion.length === 0) {
      showSwal("Error", "La asignatura no tiene evaluacion", "error");
      return;
    }
    if (!grupo) {
      showSwal("Error", "Debe seleccionar un grupo", "error");
      return;
    }
    if (!materia) {
      showSwal("Error", "Debe seleccionar una asignatura", "error");
      return;
    }
    setisLoading2(true);
    const validacion = await validar(
      grupo.numero,
      materia,
      data.contraseña_profesor || ""
    );
    if (!validacion) {
      setisLoading2(false);
      return;
    }

    data.grupo = grupo.numero;
    data.grupo_nombre = grupo.horario;
    data.materia = materia;
    if (evaluacion.length <= 0 || actividades.length <= 0) {
      data.cb_actividad = false;
    } else {
      data.cb_actividad = isDisabled2;
    }
    let res1 = await getProcesoCalificacionesAlumnos(token, data);
    if (res1.status) {
      let datos = res1.data;
      let newData = [];
      const batchSize = 5;
      for (let i = 0; i < datos.length; i += batchSize) {
        const batch = datos.slice(i, i + batchSize);
        const promises = batch.map(async (val) => {
          data.numero = val.numero;
          data.nombre = val.nombre;
          try {
            let res2 = await getProcesoCalificaciones(token, data);
            if (res2.status) {
              const datosos = res2.data;
              newData.push({
                numero: datosos[0].numero,
                nombre: datosos[0].nombre,
                calificacion: datosos[0].calificacion,
                unidad: datosos[0].unidad,
              });
            }
          } catch (error) {}
        });
        await Promise.all(promises);
      }
      if (newData) {
        setCalificaciones(newData);
        setCalificacionesFiltrados(newData);
      } else {
        showSwal("Error", "No se pudieron obtener las calificaciones", "error");
        // setCalificaciones([]);
        // setCalificacionesFiltrados([]);
      }
      setisLoading2(false);
    } else {
      showSwal(res1.alert_title, res1.alert_text, res1.alert_icon);
      setisLoading2(false);
      return;
    }
  });

  const home = () => {
    router.push("/");
  };

  const handleVerClick = () => {
    setisLoadingPDF(true);
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Calificaciones",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: calificacionesFiltrados,
    };
    const orientacion = "Landscape";
    const reporte = new ReportePDF(configuracion, orientacion);
    const { body } = configuracion;
    const Enca1 = (doc) => {
      if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalH();
        doc.nextRow(12);
        doc.ImpPosX("Numero", 15, doc.tw_ren);
        doc.ImpPosX("Alumno", 30, doc.tw_ren);
        doc.ImpPosX("Unidad", 140, doc.tw_ren);
        doc.ImpPosX("Calificación", 170, doc.tw_ren);
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
    body.forEach((calificacion) => {
      reporte.ImpPosX(
        calificacion.numero.toString(),
        25,
        reporte.tw_ren,
        0,
        "R"
      );
      reporte.ImpPosX(
        calificacion.nombre.toString(),
        30,
        reporte.tw_ren,
        35,
        "L"
      );
      reporte.ImpPosX(
        calificacion.unidad.toString(),
        150,
        reporte.tw_ren,
        35,
        "R"
      );
      reporte.ImpPosX(
        calificacion.calificacion.toString(),
        183,
        reporte.tw_ren,
        35,
        "R"
      );
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
      setisLoadingPDF(false);
    }, 500);
    // const pdfData = reporte.doc.output("datauristring");
    // setPdfData(pdfData);
    // setPdfPreview(true);
    // showModalVista(true);
  };

  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVPCali").showModal()
      : document.getElementById("modalVPCali").close();
  };

  const ImprimePDF = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Comentarios",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: calificacionesFiltrados,
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

      body: calificacionesFiltrados,
      columns: [
        { header: "Numero", dataKey: "numero" },
        { header: "Alumno", dataKey: "nombre" },
        { header: "Unidad", dataKey: "unidad" },
        { header: "Calificación", dataKey: "calificacion" },
      ],

      nombre: "Calificaciones ",
    };
    ImprimirExcel(configuracion);
  };

  if (status === "loading") {
    return (
      <div className="container skeleton w-full max-w-screen-xl shadow-xl rounded-xl"></div>
    );
  }
  return (
    <>
      <ModalVistaPreviaCalis
        pdfPreview={pdfPreview}
        pdfData={pdfData}
        PDF={ImprimePDF}
        Excel={ImprimeExcel}
      />
      <div className="container h-[80vh] w-full max-w-screen-xl bg-base-200 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y">
        <div className="flex flex-col justify-start p-3">
          <div className="flex flex-wrap md:flex-nowrap items-start md:items-center">
            <div className="order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0">
              <Acciones
                Alta={Guardar}
                home={home}
                Buscar={Buscar}
                Ver={handleVerClick}
                isLoading={isLoading2}
                isDisabledSave={isDisabledSave}
                isLoadingPDF={isLoadingPDF}
                permiso_alta={permissions.altas}
                permiso_imprime={permissions.impresion}
              />
            </div>
            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
              Actualización del Cátalogo de Calificaciones.
            </h1>
          </div>
        </div>
        <div className="flex flex-col items-center h-full">
          <div className="w-full max-w-4xl">
            <div className="flex flex-col h-[calc(100%)] space-y-4">
              <Inputs
                dataType={"int"}
                name={"bimestre"}
                tamañolabel={""}
                className={"fyo8m-select p-1.5 grow bg-[#ffffff] text-right"}
                Titulo={"Bimestre: "}
                type={"select"}
                requerido={true}
                errors={errors}
                register={register}
                message={"Bimestre Requerido"}
                isDisabled={false}
                maxLenght={5}
                arreglos={[
                  { id: 1, descripcion: "1" },
                  { id: 2, descripcion: "2" },
                  { id: 3, descripcion: "3" },
                  { id: 4, descripcion: "4" },
                  { id: 5, descripcion: "5" },
                ]}
                onChange={handlBimestreChange}
              />

              <BuscarCat
                table="horarios"
                itemData={[]}
                fieldsToShow={["numero", "horario"]}
                nameInput={["numero", "horario"]}
                titulo={"Asignatura: "}
                setItem={setGrupo}
                token={session.user.token}
                modalId="modal_horario1"
                alignRight={"text-right"}
                inputWidths={{
                  contdef: "180px",
                  first: "70px",
                  second: "150px",
                }}
              />

              {isDisabled && (
                <Inputs
                  dataType={"int"}
                  name={"materia"}
                  tamañolabel={""}
                  className={"fyo8m-select p-1.5 grow bg-[#ffffff] "}
                  Titulo={"Asignatura: "}
                  type={"selectHorario"}
                  requerido={true}
                  errors={errors}
                  register={register}
                  message={"Asignatura Requerido"}
                  isDisabled={false}
                  maxLenght={5}
                  arreglos={asignatura}
                  onChange={handlAsignaturaChange}
                />
              )}

              {isDisabled2 && actividades.length > 0 && (
                <Inputs
                  dataType={"int"}
                  name={"actividad"}
                  tamañolabel={""}
                  className={"fyo8m-select p-1.5 grow bg-[#ffffff] "}
                  Titulo={"Actividad: "}
                  type={"select"}
                  requerido={true}
                  errors={errors}
                  register={register}
                  message={"Actividad Requerido"}
                  isDisabled={false}
                  maxLenght={5}
                  arreglos={actividades}
                  onChange={handlActividadesChange}
                />
              )}

              {isDisabled3 && evaluacion.length > 0 && (
                <Inputs
                  dataType={"int"}
                  name={"evaluacion"}
                  tamañolabel={""}
                  className={"fyo8m-select p-1.5 grow bg-[#ffffff] text-right"}
                  Titulo={"No. Evaluación: "}
                  type={"select"}
                  requerido={true}
                  errors={errors}
                  register={register}
                  message={"Evaluación Requerido"}
                  isDisabled={false}
                  maxLenght={5}
                  arreglos={evaluacion}
                  onChange={handlEvalChange}
                />
              )}

              <Inputs
                dataType={"string"}
                name={"contraseña_profesor"}
                tamañolabel={"w-full md:w-2/3"}
                className={"text-left"}
                Titulo={"Contraseña Profesor: "}
                type={"password"}
                requerido={false}
                errors={errors}
                register={register}
                message={"Contraseña profesor Requerido"}
                isDisabled={false}
                maxLenght={255}
              />

              {/* <Inputs
                                dataType={"string"}
                                name={"promedio_grupo"}
                                tamañolabel={"w-full md:w-1/2"}
                                className={"w-full md:w-1/2 text-right"}
                                Titulo={"Prom. del Grupo: "}
                                type={"text"}
                                requerido={false}
                                errors={errors}
                                register={register}
                                message={"Prom. del Grupo Requerido"}
                                isDisabled={true}
                                maxLenght={255}
                            /> */}

              <div className="flex flex-col items-center h-full">
                <div className="w-full max-w-4xl">
                  <TablaCalificaciones
                    isLoading={isLoading}
                    calificacionesFiltrados={calificacionesFiltrados}
                    calificaciones={calificaciones}
                    setCalificaciones={setCalificaciones}
                    setCalificacionesFiltrados={setCalificacionesFiltrados}
                    setCalificacion={setCalificacion}
                    setAccion={setAccion}
                    setCurrentId={setCurrentId}
                    permiso_cambio={permissions.cambios}
                    permiso_baja={permissions.bajas}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default C_Calificaciones;
