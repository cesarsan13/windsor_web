"use client";
import React, { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Acciones from "@/app/c_otras/components/Acciones";
import { useSession } from "next-auth/react";
import ModalC_Otras from "@/app/c_Otras/components/modalC_Otras";
import BuscarCat from "@/app/components/BuscarCat";
import Inputs from "@/app/c_otras/components/Inputs";
import TablaCalificaciones from "@/app/c_otras/components/tablaC_Otras";
import {
  setGlobalVariable,
  globalVariables,
  loadGlobalVariables,
} from "@/app/utils/globalfn";
import {
  getMateriaEvaluacion,
  getMateriaBuscar,
} from "@/app/utils/api/materias/materias";
import { getActividadSecuencia } from "@/app/utils/api/actividades/actividades";
import { getContraseñaProfe } from "@/app/utils/api/profesores/profesores";
import {
  getProcesoCalificaciones,
  guardarProcesoCalificaciones,
  getProcesoCalificacionesAlumnos,
  ImprimirPDF,
  ImprimirExcel,
  getProcesoTareasTrabajosPendientes,
  guardarC_Otras
} from "@/app/utils/api/c_otras/c_otras";
import { showSwal, confirmSwal } from "@/app/utils/alerts";
import ModalVistaPreviaC_Otras from "@/app/c_otras/components/modalVistaPreviaC_Otras";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import { getClasesBuscaCat } from "@/app/utils/api/clases/clases";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "jspdf-autotable";

function C_Otras() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [openModal, setModal] = useState(false);
  const [accion, setAccion] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [isLoading2, setisLoading2] = useState(false);
  const [animateLoading, setAnimateLoading] = useState(false);
  const [currentID, setCurrentId] = useState("");
  const [c_Otra, setC_Otra] = useState({});
  const [c_Otras, setC_Otras] = useState([]);
  const [grupo, setGrupo] = useState({});
  const [contraProfe, setContraProfe] = useState("");
  const [bimestre, setBimestre] = useState("1");
  const [asignatura, setAsignatura] = useState([]);
  const [b_asignatura, setB_Asignatura] = useState({});
  const [c_OtrasFiltrados, setC_OtrasFiltrados] = useState([]);
  const [calificaciones, setCalificaciones] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDisabledSave, setIsDisabledSave] = useState(false);
  const [isDisabled2, setIsDisabled2] = useState(false);
  const [isDisabled3, setIsDisabled3] = useState(false);
  const [actividades, setActividades] = useState([]);
  const [evaluacion, setEvaluacion] = useState([]);
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const [disabledNum, setDisableNum] = useState(false);
  const [num, setNum] = useState("");

  const {
    // register,
    // handleSubmit,
    reset,
    // watch,
    // setValue,
    getValues,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      numero: c_Otra.numero,
      materia: c_Otra.materia,
      calificacion: c_Otra.calificacion,
      nombre: c_Otra.nombre,
      unidad: c_Otra.unidad,
      descripcion: c_Otra.descripcion
    },
});
useEffect(() => {
  reset({
    numero: c_Otra.numero,
      materia: c_Otra.materia,
      calificacion: c_Otra.calificacion,
      nombre: c_Otra.nombre,
      unidad: c_Otra.unidad,
      descripcion: c_Otra.descripcion
  });
}, [c_Otra, reset]);
useEffect(() => {
  console.log("Cambio en b_asignatura:", b_asignatura);
}, [b_asignatura]);
const handleSetBAsignatura = (item) => {
  setB_Asignatura(item);
  console.log("Item asignado en el padre:", item);
};
 const Buscar = useCallback(async (data) => {
  console.log("Data del form => ",data);
    console.log("1");
    const { token } = session.user;
    if (!grupo) {
      showSwal("Error", "Debe seleccionar un grupo", "error");
      return;
    }
    console.log("b_asignatura => ",b_asignatura)
    if (!b_asignatura.numero) {
      showSwal("Error", "Debe seleccionar una materia", "error");
      return;
    }
    const validacion = await validar(
      grupo.numero,
      b_asignatura.numero,
      contraProfe || ""
    );
    if (!validacion) {
      setisLoading2(false);
      return;
    }
    console.log("2");
    data.grupo = grupo.numero;
    data.grupo_nombre = grupo.horario;
    data.materia = b_asignatura.numero;
    // data.cb_actividad = isDisabled2;
    let res1 = await getProcesoCalificacionesAlumnos(token, data);
      if (res1.status) {
      let datos = res1.data;
      // console.log("Datos => ",datos);
      let newData = [];
      const batchSize = 5;
      for (let i = 0; i < datos.length; i += batchSize) {
        const batch = datos.slice(i, i + batchSize);
        const promises = batch.map(async (val) => {
          data.numero = val.numero;
          data.nombre = val.nombre;
          data.bimestre = bimestre;
          try {
            // let res2 = await getProcesoCalificaciones(token, data);
            // console.log("Data send to getProcesoTareasTrabajosPendientes => ",data);
            let res2 = await getProcesoTareasTrabajosPendientes(token, data);
            // console.log("res2 => ", res2);
            if (res2.status) {
              // console.log("Datosos => ",res2.data);
              const datosos = res2.data;
              // console.log(datosos)
              newData.push({
                numero: datosos[0].numero,
                nombre: datosos[0].nombre,
                calificacion: datosos[0].calificacion,
                unidad: datosos[0].unidad,
                materia: datosos[0].materia,
                descripcion: b_asignatura.descripcion
              });
            }
          } catch (error) {
            // console.error(`Error inesperado al procesar ${val.numero}:`, error);
          }
        });
        await Promise.all(promises);
      }
           // newData = newData.json();
      // console.log(newData);
      if (newData) {
        console.log("newData => ",newData)
        setCalificaciones(newData);
        setC_OtrasFiltrados(newData);
      } else {
        showSwal("Error", "No se pudieron obtener las c_Otras", "error");
        // setCalificaciones([]);
        // setCalificacionesFiltrados([]);
      }
      setisLoading2(false);
    } else {
      showSwal(res1.alert_title, res1.alert_text, res1.alert_icon);
      setisLoading2(false);
      return;
    }
  },[calificaciones,grupo,session,b_asignatura,contraProfe]);
  const tableAction = (acc, id) => {
    const calificacion = calificaciones.find(
      (calificacion) => calificacion.numero === id
    );
    if (calificacion) {
      // calificacion.actividad = snToBool(asignatura.actividad);
      console.log("Editar => ",calificacion)
      setC_Otra(calificacion);
      setAccion(acc);
      setDisableNum(true);
      setNum(id);
      setCurrentId(id);
      showModal(true);
    }
  };

  const validar = async (grupo, materia, contraseña) => {
    const { token } = session.user;
    let validar;
    console.log("data a enviar getContraseñaProfe => ",grupo,materia);
    let res = await getContraseñaProfe(token, grupo, materia);
    console.log("Datos profe => ", res);
    const data = res.data;
    console.log("Contra profe => ", contraseña);
    let contrasegura = data.contraseña || "";
    if (contraseña.toLowerCase() === contrasegura.toLowerCase()) {
      validar = true;
    } else {
      validar = false;
      showSwal("Error", "Grupo no asignado a Profesor", "error");
    }
    return validar;
  };

  const showModal = (show) => {
    show
      ? document.getElementById("my_modal_c_otras").showModal()
      : document.getElementById("my_modal_c_otras").close();
  };
  const cerrarModalVista = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVC_Otras").close();
  };
  const formatNumber = (num) => {
    if (!num) return "";
    const numStr = typeof num === "string" ? num : num.toString();
    const floatNum = parseFloat(
      numStr.replace(/,/g, "").replace(/[^\d.-]/g, "")
    );
    if (isNaN(floatNum)) return "";
    return floatNum.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };


  const home = () => {
    router.push("/");
  };

  const handleVerClick = () => {
    setAnimateLoading(true);
    cerrarModalVista();
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Calificaciones",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: c_OtrasFiltrados,
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
        // doc.ImpPosX("Unidad", 140, doc.tw_ren);
        doc.ImpPosX("Calificación", 140, doc.tw_ren);
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
      // reporte.ImpPosX(
      //   calificacion.unidad.toString(),
      //   150,
      //   reporte.tw_ren,
      //   35,
      //   "R"
      // );
      reporte.ImpPosX(
        calificacion.calificacion.toString(),
        150,
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
      setAnimateLoading(false);
    }, 500);
    // const pdfData = reporte.doc.output("datauristring");
    // setPdfData(pdfData);
    // setPdfPreview(true);
    // showModalVista(true);
  };

  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVC_Otras").showModal()
      : document.getElementById("modalVC_Otras").close();
  };
  const onSubmitModal = handleSubmit(async (data) => {
    event.preventDefault;
    const dataj = JSON.stringify(data);
    let res = null;
    if (accion === "Eliminar") {
      showModal(false);
      const confirmed = await confirmSwal(
        "¿Desea Continuar?",
        "Se eliminara la asignatura seleccionada",
        "warning",
        "Aceptar",
        "Cancelar"
      );
      if (!confirmed) {
        showModal(true);
        return;
      }
    }
    data.numero = num || currentID;
    // data = await Elimina_Comas(data);
    let data1 = {
      numero:data.numero,
      calificacion:data.calificacion
    }
    let data2 = {
      materia:data.materia,
      grupo:grupo.horario,
      bimestre:bimestre
    }
    res = await guardarC_Otras(session.user.token, data1, data2);

    if (res.status) {
      if (accion === "Eliminar" || accion === "Editar") {
        console.log("Fue Editar o eliminar y la accion es ", accion);
        // const index = c_Otras.findIndex((p) => p.numero === data.numero);
        const index = calificaciones.findIndex((p) => p.numero === data.numero);
        console.log("Index es igual a ",index)
        if (index !== -1) {
          console.log("Entro al index")
          if (accion === "Eliminar") {
            const cFiltrados = calificaciones.filter(
              (p) => p.numero !== data.numero
            );
            setC_Otras(cFiltrados);
            setC_OtrasFiltrados(cFiltrados);
          } else {
            console.log("Fue Editar ");
              const cActualizadas = calificaciones.map((p) =>
                p.numero === currentID ? { ...p, ...data } : p
              );
              console.log("Se actulizo los datos de la tabla => ", cActualizadas);
              setCalificaciones(cActualizadas);
              setC_Otras(cActualizadas);
              setC_OtrasFiltrados(cActualizadas);
          }
        }
      }
      showSwal(res.alert_title, res.alert_text, res.alert_icon);
      showModal(false);
    } else {
      // const alertText = res.alert_text ? formatValidationErrors(res.alert_text) : "Error desconocido";
      // console.log(alertText);
      showModal(false);
      const confirmed = await confirmSwal(
        res.alert_title,
        res.alert_text,
        res.alert_icon,
        "Aceptar",
        "Cancelar"
      );
      if (!confirmed) {
        showModal(true);
        return;
      } else {
        showModal(true);
        return;
      }
    }
  });
  const ImprimePDF = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Comentarios",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: c_OtrasFiltrados,
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

      body: c_OtrasFiltrados,
      columns: [
        { header: "Numero", dataKey: "numero" },
        { header: "Alumno", dataKey: "nombre" },
        // { header: "Unidad", dataKey: "unidad" },
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
    <ModalC_Otras
        accion={accion}
        onSubmit={onSubmitModal}
        currentID={currentID}
        errors={errors}
        register={register}
        setC_otra={setC_Otra}
        c_Otra={c_Otra}
        formatNumber={formatNumber}
        setValue={setValue}
        watch={watch}
        disabledNum={disabledNum}
        num={num}
        setNum={setNum}
        materiaDesc={b_asignatura.descripcion}
      />
      <ModalVistaPreviaC_Otras
        pdfPreview={pdfPreview}
        pdfData={pdfData}
        PDF={ImprimePDF}
        Excel={ImprimeExcel}
      />
      <div className="container h-[80vh] w-full max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden">
        <div className="flex flex-col justify-start p-3">
          <div className="flex flex-wrap md:flex-nowrap items-start md:items-center">
            <div className="order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0 pr-4">
              <Acciones
                // Alta={Guardar}
                home={home}
                Buscar={Buscar}
                Ver={handleVerClick}
                isLoading={animateLoading}
                isDisabledSave={isDisabledSave}
              />
            </div>
            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around w-auto">
              Actualización de Asistencias y Trabajos.
            </h1>
          </div>
        </div>
        <div className="flex flex-col md:grid md:grid-cols-8 md:grid-rows-1 h-full">
          <div className="col-span-7">
            <div className="flex flex-col h-[calc(100%)] space-y-4">
              <Inputs
                dataType={"int"}
                name={"bimestre"}
                tamañolabel={""}
                className={"fyo8m-select p-1.5 grow bg-[#ffffff] "}
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
                value={bimestre}
                setValue={setBimestre}
                onChange={(e) => setBimestre(e.target.value)}
              />

              <BuscarCat
                table="horarios"
                itemData={[]}
                fieldsToShow={["numero", "horario"]}
                nameInput={["numero", "horario"]}
                titulo={"Grupo: "}
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

              <BuscarCat
                table="asignaturascasootro" 
                itemData={[]}
                fieldsToShow={["numero", "descripcion"]}
                nameInput={["numero", "descripcion"]}
                titulo={"Asignatura: "}
                // setItem={setB_Asignatura}
                setItem={handleSetBAsignatura}
                token={session.user.token}
                modalId="modal_asignaturas1"
                alignRight={"text-right"}
                inputWidths={{
                  contdef: "180px",
                  first: "70px",
                  second: "150px",
                }}
              />

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
                value={contraProfe}
                setValue={setContraProfe}
                onChange={(e) => setContraProfe(e.target.value)}
              />

              <div className="flex flex-col items-center h-full overflow-y-auto">
                <div className="w-full max-w-4xl ">
                  <TablaCalificaciones
                    isLoading={isLoading}
                    c_OtrasFiltrados={c_OtrasFiltrados}
                    c_Otras={c_Otras}
                    setC_Otras={setC_Otras}
                    setC_OtrasFiltrados={setC_OtrasFiltrados}
                    // setC_Otra={setC_Otra}
                    setAccion={setAccion}
                    setCurrentId={setCurrentId}
                    tableAction={tableAction}
                    materiaDesc={b_asignatura.descripcion}
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

export default C_Otras;
