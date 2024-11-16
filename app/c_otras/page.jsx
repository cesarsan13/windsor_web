"use client";
import React, { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Acciones from "@/app/c_otras/components/Acciones";
import { useSession } from "next-auth/react";
import BuscarCat from "@/app/components/BuscarCat";
import Inputs from "@/app/c_otras/components/Inputs";
import TablaCalificaciones from "@/app/c_otras/components/tablaC_Otras";
import { getContraseñaProfe } from "@/app/utils/api/profesores/profesores";
import {
  getProcesoCalificacionesAlumnos,
  ImprimirPDF,
  ImprimirExcel,
  getProcesoTareasTrabajosPendientes,
  guardarC_Otras,
} from "@/app/utils/api/c_otras/c_otras";
import { showSwal } from "@/app/utils/alerts";
import ModalVistaPreviaC_Otras from "@/app/c_otras/components/modalVistaPreviaC_Otras";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "jspdf-autotable";

function C_Otras() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [accion, setAccion] = useState("");
  const [currentID, setCurrentId] = useState("");
  const [c_Otra, setC_Otra] = useState({});
  const [c_Otras, setC_Otras] = useState([]);
  const [b_asignatura, setB_Asignatura] = useState({});
  const [c_OtrasFiltrados, setC_OtrasFiltrados] = useState([]);
  const [grupo, setGrupo] = useState({});
  const [isLoading, setisLoading] = useState(false);
  const [animateLoading, setAnimateLoading] = useState(false);
  const [isDisabledSave, setIsDisabledSave] = useState(false);
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const Guardar = handleSubmit(async (data) => {
    const { token } = session.user;
    if (!data) {
      return;
    }
    if (c_Otras.length <= 0) {
      return
    }
    setIsDisabledSave(true);
    data.grupo = grupo.horario;
    data.materia = b_asignatura.numero;
    const promises = c_Otras.map(async (otras) => {
      try {
        return await guardarC_Otras(token, otras, data);
      } catch (error) { }
    });
    const results = await Promise.all(promises);
    showSwal('ÉXITO', 'Las calificaciones se han registrado correctamente.', 'success');
    setIsDisabledSave(false);
  });

  const Buscar = handleSubmit(async (data) => {
    const { token } = session.user;
    if (!grupo) {
      showSwal("Error", "Debe seleccionar un grupo", "error");
      return;
    }
    if (!b_asignatura.numero) {
      showSwal("Error", "Debe seleccionar una materia", "error");
      return;
    }
    setAnimateLoading(true);
    setC_OtrasFiltrados([]);
    setC_Otras([]);
    const validacion = await validar(grupo.numero, b_asignatura.numero, data.contraseña_profesor || '');
    if (!validacion) { setAnimateLoading(false); return }
    data.grupo = grupo.numero;
    data.grupo_nombre = grupo.horario;
    data.materia = b_asignatura.numero;
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
            let res2 = await getProcesoTareasTrabajosPendientes(token, data);
            if (res2.status) {
              const datosos = res2.data;
              newData.push({
                numero: datosos[0].numero,
                nombre: datosos[0].nombre,
                calificacion: datosos[0].calificacion,
              });
            }
          } catch (error) {
          }
        });
        await Promise.all(promises);
      }
      if (newData) {
        setC_Otras(newData);
        setC_OtrasFiltrados(newData);
      } else {
        showSwal("Error", "No se pudieron obtener las c_Otras", "error");
      }
      setAnimateLoading(false);
    } else {
      showSwal(res1.alert_title, res1.alert_text, res1.alert_icon);
      setAnimateLoading(false);
      return;
    }
  });

  const validar = async (grupo, materia, contraseña) => {
    const { token } = session.user;
    let validar;
    let res = await getContraseñaProfe(token, grupo, materia);
    const data = res.data;
    if (!data || data.contraseña == null || data.contraseña === "") {
      showSwal('Error', 'Grupo no asignado a profesor.', 'error');
      return false;
    }
    if (contraseña.toLowerCase() === data.contraseña.toLowerCase()) {
      validar = true;
    } else {
      validar = false;
      showSwal('Error', 'Grupo no asignado a profesor.', 'error');
    }
    return validar;
  }

  const cerrarModalVista = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVC_Otras").close();
  };

  const home = () => {
    router.push("/");
  };

  const handleVerClick = () => {
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
    body.forEach((otra) => {
      reporte.ImpPosX(otra.numero.toString(), 25, reporte.tw_ren, 0, "R");
      reporte.ImpPosX(otra.nombre.toString(), 30, reporte.tw_ren, 35, "L");
      reporte.ImpPosX(otra.calificacion.toString(), 153, reporte.tw_ren, 35, "R");
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
      ? document.getElementById("modalVC_Otras").showModal()
      : document.getElementById("modalVC_Otras").close();
  };

  const ImprimePDF = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Calificaciones",
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
        Nombre_Reporte: "Calificaciones",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: c_OtrasFiltrados,
      columns: [
        { header: "Numero", dataKey: "numero" },
        { header: "Alumno", dataKey: "nombre" },
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
      <ModalVistaPreviaC_Otras
        pdfPreview={pdfPreview}
        pdfData={pdfData}
        PDF={ImprimePDF}
        Excel={ImprimeExcel}
      />
      <div className='container h-[80vh] w-full max-w-screen-xl bg-base-200 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y'>
        <div className='flex flex-col justify-start p-3'>
          <div className='flex flex-wrap md:flex-nowrap items-start md:items-center'>
            <div className='order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0'>
              <Acciones
                Alta={Guardar}
                home={home}
                Buscar={Buscar}
                Ver={handleVerClick}
                isLoading={animateLoading}
                isDisabledSave={isDisabledSave}
              />
            </div>
            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
              Actualización de Asistencias y Trabajos.
            </h1>
          </div>
        </div>
        <div className='flex flex-col items-center h-full'>
          <div className='w-full max-w-4xl'>
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
                setItem={setB_Asignatura}
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
              />

              <div className="flex flex-col items-center h-full">
                <div className="w-full max-w-4xl">
                  <TablaCalificaciones
                    session={session}
                    isLoading={isLoading}
                    c_OtrasFiltrados={c_OtrasFiltrados}
                    c_Otras={c_Otras}
                    setC_Otra={setC_Otra}
                    setC_Otras={setC_Otras}
                    setC_OtrasFiltrados={setC_OtrasFiltrados}
                    setAccion={setAccion}
                    setCurrentId={setCurrentId}
                    aignatura_nombre={b_asignatura.descripcion || "Sin Asignatura"}
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
