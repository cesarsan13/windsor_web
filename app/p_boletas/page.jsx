"use client";
import React, { useEffect, useState } from "react";
import Acciones from "./components/Acciones";
import Busqueda from "./components/Busqueda";
import { useSession } from "next-auth/react";
import TablaCalificaciones from "./components/tablaCalificaciones";
import {
  conversion,
  getCalificaciones,
  getCalificacionesAlumnos,
  getLugaresArea1,
  getMateriasGrupo,
  Imprimir,
} from "../utils/api/calificaciones/calificaciones";
import { getHorariosXAlumno } from "../utils/api/horarios/horarios";
import { showSwal } from "../utils/alerts";
import { useRouter } from "next/navigation";
import { ReportePDF } from "../utils/ReportesPDF";
import ModalVistaPreviaPBoletas from "./components/modalVistaPreviaPBoletas";
import { permissionsComponents } from "../utils/globalfn";

function P_Boletas() {
  const currentYear = new Date().getFullYear();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [grupo, setGrupo] = useState([]);
  const [alumnosHorario, setAlumnosHorario] = useState([]);
  const [calificaciones, setCalificaciones] = useState([]);
  const [calificacionesAlumnos, setCalificacionesAlumnos] = useState([]);
  const [caliAlum, setCaliAlum] = useState(true);
  const [lugaresArea1, setLugaresArea1] = useState([]);
  const [lugaresArea4, setLugaresArea4] = useState([]);
  const [bimestre, setBimestre] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [checkPromedio, setCheckPromedio] = useState(false);
  const [checkCaliLetra, setCheckCaliLetra] = useState(false);
  const [checkBoletaKinder, setCheckBoletaKinder] = useState(false);
  const [promedio, setPromedio] = useState("");
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const [cicloFechas, setCicloFechas] = useState(
    `${currentYear} - ${currentYear + 1}`
  );
  const [selectedOption, setSelectedOption] = useState("español");
  const [isLoadingGrupos, setisLoadingGrupos] = useState(false);
  const [permissions, setPermissions] = useState({});
  useEffect(() => {
    if (status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {
      setisLoadingGrupos(true);
      const { token, permissions } = session.user;
      const es_admin = session.user.es_admin;
      const menu_seleccionado = Number(localStorage.getItem("puntoMenu"));
      const permisos = permissionsComponents(
        es_admin,
        permissions,
        session.user.id,
        menu_seleccionado
      );
      setPermissions(permisos);
      const datos = await getCalificacionesAlumnos(token, grupo);
      if (datos.length === 0) {
        setisLoadingGrupos(false);
        return;
      }
      let alumnosArea1 = datos.alumnos.map((alumno) => {
        return {
          ...alumno,
          1: "",
          2: "",
          3: "",
          4: "",
          5: "",
          6: "",
        };
      });
      let alumnosArea4 = datos.alumnos.map((alumno) => {
        return {
          ...alumno,
          1: "",
          2: "",
          3: "",
          4: "",
          5: "",
          6: "",
        };
      });
      const calificaciones = datos.calificaciones;
      const actividades = datos.actividades;
      const materiasArea1 = datos.materiasArea1;
      const materiasArea4 = datos.materiasArea4;
      const lugaresArea1 = getLugaresArea1(
        calificaciones,
        actividades,
        materiasArea1,
        alumnosArea1
      );
      const lugaresArea4 = getLugaresArea1(
        calificaciones,
        actividades,
        materiasArea4,
        alumnosArea4
      );
      setLugaresArea1(lugaresArea1);
      setLugaresArea4(lugaresArea4);
      setisLoadingGrupos(false);
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grupo, status]);

  useEffect(() => {
    if (Number(bimestre) > 5) {
      setBimestre("5");
    }
  }, [bimestre]);

  const Bus = async () => {
    if (!grupo.numero) {
      showSwal("Error", "Debe seleccionar un grupo.", "error");
      return;
    }
    if (!alumnosHorario.numero) {
      showSwal("Error", "Debe seleccionar un alumno.", "error");
      return;
    }
    if (bimestre > 5) {
      setBimestre("5");
    }
    if (bimestre <= 0) {
      showSwal("Error", "El bimestre debe de ser entre 1 y 5.", "error");
      return;
    }
    setisLoading(true);
    const { token } = session.user;
    const [dataMaterias, dataCalificaciones] = await Promise.all([
      getMateriasGrupo(token, grupo.numero),
      getCalificaciones(token, grupo.horario),
    ]);
    let sumatoria = 0;
    let evaluaciones = 0;
    let calificaciones = [];
    let sumaPromedio = "";
    dataMaterias.map((materia) => {
      for (let bi = 1; bi <= bimestre; bi++) {
        sumatoria = 0;
        evaluaciones = 0;
        let calificacion = 0;
        const mat = dataCalificaciones.materias.find(
          (mat) => mat.numero === materia.numero
        );
        if (mat) {
          if (materia.area === 1 || materia.area === 4) {
            if (mat.actividad === "no") {
              const calif = dataCalificaciones.calificaciones.find(
                (calif) =>
                  calif.grupo === materia.horario &&
                  calif.alumno === alumnosHorario.numero &&
                  calif.actividad === 0 &&
                  calif.materia === mat.numero &&
                  calif.unidad <= mat.evaluaciones
              );
              if (!calif) {
                sumatoria = 0.0;
              } else {
                sumatoria = calif.calificacion;
                evaluaciones = mat.evaluaciones;
              }
            } else {
              const actividad = dataCalificaciones.actividades.filter(
                (act) => act.materia === mat.numero
              );
              actividad.map((act) => {
                const califAct = dataCalificaciones.calificaciones.find(
                  (calAct) =>
                    calAct.alumno === alumnosHorario.numero &&
                    calAct.materia === mat.numero &&
                    calAct.bimestre === bi &&
                    calAct.actividad === act.secuencia &&
                    calAct.unidad <= act[`EB${bi}`]
                );
                let cpa = califAct?.calificacion || 0;
                if (cpa > 0) {
                  const EB = act[`EB${bi}`];
                  sumatoria += cpa / EB;
                  evaluaciones += 1;
                }
              });
              if (sumatoria === 0 || evaluaciones === 0) {
                calificacion = 0.0;
              } else {
                calificacion = sumatoria / evaluaciones;
                if (calificacion < 5.0) {
                  calificacion = 5.0;
                } else {
                  calificacion = sumatoria / evaluaciones || 0;
                }
              }
            }
          } else {
            const calif = dataCalificaciones.calificaciones.find(
              (calif) =>
                calif.grupo === materia.horario &&
                calif.alumno === alumnosHorario.numero &&
                calif.materia === mat.numero &&
                calif.bimestre === bi
            );
            if (!calif) {
              calificacion = 0;
            } else {
              calificacion = Number(calif.calificacion) || 0;
            }
          }
        }
        let materiaExistente = calificaciones.find(
          (cal) => cal.materia === materia.descripcion
        );
        if (materiaExistente) {
          materiaExistente[`EB${bi}`] = parseFloat(calificacion.toFixed(1));
        } else {
          calificaciones.push({
            numero: materia.numero,
            materia: materia.descripcion,
            area: materia.area,
            EB1: 0,
            EB2: 0,
            EB3: 0,
            EB4: 0,
            EB5: 0,
            [`EB${bi}`]: parseFloat(calificacion.toFixed(1)),
          });
        }
      }
    });
    setCalificaciones(calificaciones);
    for (let i = 1; i <= bimestre; i++) {
      let sumaPromedioArea1 = 0;
      let sumaPromedioArea4 = 0;
      let contArea1 = 0;
      let contArea4 = 0;
      let indexArea1 = -1;
      let indexArea4 = -1;
      calificaciones.forEach((calificacion) => {
        if (
          calificacion.area === 1 &&
          calificacion.materia !== "LUGAR" &&
          calificacion.materia !== "PROMEDIO"
        ) {
          sumaPromedioArea1 += calificacion[`EB${i}`];
          contArea1++;
          if (indexArea1 === -1) {
            indexArea1 = calificaciones.findIndex((p) => p.area === 2);
            if (indexArea1 === -1) {
              indexArea1 = calificaciones.length + 1;
            }
          }
        }
        if (
          calificacion.area === 4 &&
          calificacion.materia !== "PLACE" &&
          calificacion.materia !== "AVERAGE"
        ) {
          sumaPromedioArea4 += calificacion[`EB${i}`];
          contArea4++;
          if (indexArea4 === -1) {
            indexArea4 = calificaciones.findIndex((p) => p.area === 5);
            if (indexArea4 === -1) {
              indexArea4 = calificaciones.length + 2;
            }
          }
        }
      });
      let promedioArea1 =
        contArea1 > 0 ? (sumaPromedioArea1 / contArea1).toFixed(1) : 0;
      let promedioArea4 =
        contArea4 > 0 ? (sumaPromedioArea4 / contArea4).toFixed(1) : 0;
      if (promedioArea1 < 5.0) promedioArea1 = 5.0;
      if (promedioArea4 < 5.0) promedioArea4 = 5.0;
      let promedioExistenArea1 = calificaciones.find(
        (cal) => cal.materia === "PROMEDIO"
      );
      if (promedioExistenArea1) {
        promedioExistenArea1[`EB${i}`] = promedioArea1;
      } else {
        calificaciones.splice(indexArea1, 0, {
          numero: 0,
          materia: "PROMEDIO",
          area: 1,
          EB1: 0,
          EB2: 0,
          EB3: 0,
          EB4: 0,
          EB5: 0,
          [`EB${i}`]: promedioArea1,
        });
      }
      const lugaraArea1 = lugaresArea1.find(
        (lugar) => lugar.numero === alumnosHorario.numero
      );
      let lugarExistenArea1 = calificaciones.find(
        (cal) => cal.materia === "LUGAR"
      );
      if (lugarExistenArea1) {
        lugarExistenArea1[`EB${i}`] = lugaraArea1[i];
      } else {
        calificaciones.splice(indexArea1 + 1, 0, {
          numero: 0,
          materia: "LUGAR",
          area: 1,
          EB1: 0,
          EB2: 0,
          EB3: 0,
          EB4: 0,
          EB5: 0,
          [`EB${i}`]: lugaraArea1[i],
        });
      }
      const lugaraArea4 = lugaresArea4.find(
        (lugar) => lugar.numero === alumnosHorario.numero
      );
      let lugarExistenArea4 = calificaciones.find(
        (cal) => cal.materia === "PLACE"
      );
      if (lugarExistenArea4) {
        lugarExistenArea4[`EB${i}`] = lugaraArea4[i];
      } else {
        calificaciones.splice(indexArea4 + 1, 0, {
          numero: 0,
          materia: "PLACE",
          area: 4,
          EB1: 0,
          EB2: 0,
          EB3: 0,
          EB4: 0,
          EB5: 0,
          [`EB${i}`]: lugaraArea4[i],
        });
      }
      let promedioExistenArea4 = calificaciones.find(
        (cal) => cal.materia === "AVERAGE"
      );
      if (promedioExistenArea4) {
        promedioExistenArea4[`EB${i}`] = promedioArea4;
      } else {
        calificaciones.splice(indexArea4, 0, {
          numero: 0,
          materia: "AVERAGE",
          area: 4,
          EB1: 0,
          EB2: 0,
          EB3: 0,
          EB4: 0,
          EB5: 0,
          [`EB${i}`]: promedioArea4,
        });
      }
    }
    if (checkPromedio) {
      let proTotal = 0;
      calificaciones = calificaciones.map((materia) => {
        let sumatoria = 0;
        let evaluaciones = 0;
        if (materia.materia !== "LUGAR" && materia.materia !== "PLACE") {
          for (let i = 1; i <= bimestre; i++) {
            sumatoria += parseFloat(materia[`EB${i}`]);
            evaluaciones++;
          }
          const promedio =
            evaluaciones > 0 ? (sumatoria / evaluaciones).toFixed(1) : 0;
          return {
            ...materia,
            promedio: promedio,
          };
        } else {
          return materia;
        }
      });
      proTotal = calificaciones.find((cal) => cal.materia === "PROMEDIO");
      setPromedio(proTotal.promedio);
      setCalificaciones(calificaciones);
    }
    if (checkCaliLetra) {
      calificaciones.map((calificacion) => {
        const tipo = calificacion.area <= 3 ? "español" : "ingles"; // Español si área es 1, 2 o 3; inglés si es 4 o 5
        if (calificacion.materia === "LUGAR") {
          return calificacion;
        }
        if (calificacion.materia === "PLACE") {
          return calificacion;
        }
        calificacion.EB1 = conversion(parseFloat(calificacion.EB1), tipo);
        calificacion.EB2 = conversion(parseFloat(calificacion.EB2), tipo);
        calificacion.EB3 = conversion(parseFloat(calificacion.EB3), tipo);
        calificacion.EB4 = conversion(parseFloat(calificacion.EB4), tipo);
        calificacion.EB5 = conversion(parseFloat(calificacion.EB5), tipo);
        if (checkPromedio)
          calificacion.promedio = conversion(
            parseFloat(calificacion.promedio),
            tipo
          );
        return calificacion;
      });
    }
    setisLoading(false);
  };
  if (status === "loading") {
    return (
      <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  const handleBusquedaChange = (event) => {
    event.preventDefault;
    setBimestre(event.target.value);
  };

  const home = () => {
    router.push("/");
  };
  const handleVerClick = () => {
    setCaliAlum(true);
    if (!grupo.numero) {
      showSwal("Error", "Debe seleccionar un grupo.", "error");
      return;
    }
    if (!alumnosHorario.numero) {
      showSwal("Error", "Debe seleccionar un alumno.", "error");
      return;
    }
    if (bimestre > 5) {
      setBimestre("5");
    }
    if (bimestre <= 0) {
      showSwal("Error", "El bimestre debe de ser entre 1 y 5.", "error");
      return;
    }
    let configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Lista de Alumnos por clase",
        Nombre_Reporte: "Reporte de Alumnos",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
    };
    let header = [];
    let header2 = [];
    if (selectedOption === "español") {
      const body = calificaciones.filter(
        (cal) => cal.area !== 4 && cal.area !== 5
      );
      configuracion = { ...configuracion, body: body };
      header = [
        "ASIGNATURAS",
        "1ER BIMESTRE",
        "2DO BIMESTRE",
        "3ER BIMESTRE",
        "4TO BIMESTRE",
        "5TO BIMESTRE",
        "PROMEDIO FINAL",
      ];
    } else if (selectedOption === "ingles") {
      const body = calificaciones.filter(
        (cal) => cal.area !== 1 && cal.area !== 2 && cal.area !== 3
      );
      configuracion = { ...configuracion, body: body };
      header = [
        "SUBJECTS",
        "1ST TERM",
        "2ND TERM",
        "3RD TERM",
        "4TH TERM",
        "5TH TERM",
        "FINAL AVERAGE",
      ];
    } else {
      configuracion = { ...configuracion, body: calificaciones };
      header = [
        "ASIGNATURAS",
        "1ER BIMESTRE",
        "2DO BIMESTRE",
        "3ER BIMESTRE",
        "4TO BIMESTRE",
        "5TO BIMESTRE",
        "PROMEDIO FINAL",
      ];
      header2 = [
        "SUBJECTS",
        "1ST TERM",
        "2ND TERM",
        "3RD TERM",
        "4TH TERM",
        "5TH TERM",
        "FINAL AVERAGE",
      ];
    }
    const Enca1 = (doc) => {
      if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalV();
        doc.nextRow(12);
        doc.nextRow(4);
        doc.ImpPosX(
          "AV.SANTA ANA N° 368 COL. SAN FRANCISCO CULCHUACÁN C.P. 04420",
          50,
          doc.tw_ren,
          0,
          "L"
        );
        doc.nextRow(4);
        doc.ImpPosX(
          "ACUERDO N° 09980051 DEL  13 AGOSTO DE 1998",
          65,
          doc.tw_ren,
          0,
          "L"
        );
        doc.nextRow(4);
        doc.ImpPosX("CLAVE 51-2636-510-32-PX-014", 80, doc.tw_ren, 0, "L");
        doc.nextRow(4);
        doc.ImpPosX("CCT 09PPR1204U", 90, doc.tw_ren, 0, "L");
        doc.nextRow(4);
        if (checkBoletaKinder) {
          doc.ImpPosX("JARDIN DE NIÑOS", 90, doc.tw_ren, 0, "L");
          doc.nextRow(4);
        }
        doc.ImpPosX(`${cicloFechas || ""}`, 97, doc.tw_ren, 0, "L");
        doc.nextRow(4);
        doc.ImpPosX(
          "El acercamiento al colegio será una forma para asegurar el éxito del alumno",
          50,
          doc.tw_ren,
          0,
          "L"
        );
        doc.nextRow(4);
        doc.printLineV();
        doc.tiene_encabezado = true;
      } else {
        doc.nextRow(6);
        doc.tiene_encabezado = true;
      }
    };
    const reporte = new ReportePDF(configuracion);
    const { body } = configuracion;
    Enca1(reporte);
    reporte.nextRow(10);
    reporte.ImpPosX(
      `ALUMNO ${alumnosHorario.nombre || ""}`,
      15,
      reporte.tw_ren,
      0,
      "L"
    );
    reporte.nextRow(4);
    reporte.ImpPosX(
      `GRUPO: ${grupo.horario || ""}`,
      15,
      reporte.tw_ren,
      0,
      "L"
    );
    if (selectedOption === "español") {
      reporte.ImpPosX(`ESPAÑOL`, 90, reporte.tw_ren, 0, "L");
      const data = body
        .filter((c) => c.area <= 3)
        .map((boleta) => [
          {
            content: boleta.materia.toString(),
            styles: {
              fontStyle:
                boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                  ? "bold"
                  : "normal",
              fontSize:
                boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                  ? "12"
                  : "10",
            },
          },
          {
            content: boleta.EB1?.toString() ?? "",
            styles: {
              halign: "right",
              fontStyle:
                boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                  ? "bold"
                  : "normal",
              fontSize:
                boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                  ? "12"
                  : "10",
            },
          },
          {
            content: boleta.EB2?.toString() ?? "",
            styles: {
              halign: "right",
              fontStyle:
                boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                  ? "bold"
                  : "normal",
              fontSize:
                boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                  ? "12"
                  : "10",
            },
          },
          {
            content: boleta.EB3?.toString() ?? "",
            styles: {
              halign: "right",
              fontStyle:
                boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                  ? "bold"
                  : "normal",
              fontSize:
                boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                  ? "12"
                  : "10",
            },
          },
          {
            content: boleta.EB4?.toString() ?? "",
            styles: {
              halign: "right",
              fontStyle:
                boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                  ? "bold"
                  : "normal",
              fontSize:
                boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                  ? "12"
                  : "10",
            },
          },
          {
            content: boleta.EB5?.toString() ?? "",
            styles: {
              halign: "right",
              fontStyle:
                boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                  ? "bold"
                  : "normal",
              fontSize:
                boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                  ? "12"
                  : "10",
            },
          },
          {
            content: boleta.promedio?.toString() ?? "",
            styles: {
              halign: "right",
              fontStyle:
                boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                  ? "bold"
                  : "normal",
              fontSize:
                boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                  ? "12"
                  : "10",
            },
          },
        ]);
      reporte.generateTable(header, data);
    } else if (selectedOption === "ingles") {
      reporte.ImpPosX(`INGLES`, 90, reporte.tw_ren, 0, "L");
      const data = body
        .filter((c) => c.area >= 3)
        .map((boleta) => [
          {
            content: boleta.materia.toString(),
            styles: {
              fontStyle:
                boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                  ? "bold"
                  : "normal",
              fontSize:
                boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                  ? "12"
                  : "10",
            },
          },
          {
            content: boleta.EB1?.toString() ?? "",
            styles: {
              halign: "right",
              fontStyle:
                boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                  ? "bold"
                  : "normal",
              fontSize:
                boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                  ? "12"
                  : "10",
            },
          },
          {
            content: boleta.EB2?.toString() ?? "",
            styles: {
              halign: "right",
              fontStyle:
                boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                  ? "bold"
                  : "normal",
              fontSize:
                boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                  ? "12"
                  : "10",
            },
          },
          {
            content: boleta.EB3?.toString() ?? "",
            styles: {
              halign: "right",
              fontStyle:
                boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                  ? "bold"
                  : "normal",
              fontSize:
                boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                  ? "12"
                  : "10",
            },
          },
          {
            content: boleta.EB4?.toString() ?? "",
            styles: {
              halign: "right",
              fontStyle:
                boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                  ? "bold"
                  : "normal",
              fontSize:
                boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                  ? "12"
                  : "10",
            },
          },
          {
            content: boleta.EB5?.toString() ?? "",
            styles: {
              halign: "right",
              fontStyle:
                boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                  ? "bold"
                  : "normal",
              fontSize:
                boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                  ? "12"
                  : "10",
            },
          },
          {
            content: boleta.promedio?.toString() ?? "",
            styles: {
              halign: "right",
              fontStyle:
                boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                  ? "bold"
                  : "normal",
              fontSize:
                boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                  ? "12"
                  : "10",
            },
          },
        ]);
      reporte.generateTable(header, data);
    } else {
      reporte.ImpPosX(`ESPAÑOL`, 90, reporte.tw_ren, 0, "L");
      const data = body
        .filter((c) => c.area <= 3)
        .map((boleta) => [
          {
            content: boleta.materia.toString(),
            styles: {
              fontStyle:
                boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                  ? "bold"
                  : "normal",
              fontSize:
                boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                  ? "12"
                  : "10",
            },
          },
          {
            content: boleta.EB1?.toString() ?? "",
            styles: {
              halign: "right",
              fontStyle:
                boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                  ? "bold"
                  : "normal",
              fontSize:
                boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                  ? "12"
                  : "10",
            },
          },
          {
            content: boleta.EB2?.toString() ?? "",
            styles: {
              halign: "right",
              fontStyle:
                boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                  ? "bold"
                  : "normal",
              fontSize:
                boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                  ? "12"
                  : "10",
            },
          },
          {
            content: boleta.EB3?.toString() ?? "",
            styles: {
              halign: "right",
              fontStyle:
                boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                  ? "bold"
                  : "normal",
              fontSize:
                boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                  ? "12"
                  : "10",
            },
          },
          {
            content: boleta.EB4?.toString() ?? "",
            styles: {
              halign: "right",
              fontStyle:
                boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                  ? "bold"
                  : "normal",
              fontSize:
                boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                  ? "12"
                  : "10",
            },
          },
          {
            content: boleta.EB5?.toString() ?? "",
            styles: {
              halign: "right",
              fontStyle:
                boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                  ? "bold"
                  : "normal",
              fontSize:
                boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                  ? "12"
                  : "10",
            },
          },
          {
            content: boleta.promedio?.toString() ?? "",
            styles: {
              halign: "right",
              fontStyle:
                boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                  ? "bold"
                  : "normal",
              fontSize:
                boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                  ? "12"
                  : "10",
            },
          },
        ]);
      reporte.generateTable(header, data);
      reporte.nextRow(10);
      reporte.ImpPosX(`INGLES`, 90, reporte.tw_ren, 0, "L");
      const data2 = body
        .filter((c) => c.area >= 3)
        .map((boleta) => [
          {
            content: boleta.materia.toString(),
            styles: {
              fontStyle:
                boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                  ? "bold"
                  : "normal",
              fontSize:
                boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                  ? "12"
                  : "10",
            },
          },
          {
            content: boleta.EB1?.toString() ?? "",
            styles: {
              halign: "right",
              fontStyle:
                boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                  ? "bold"
                  : "normal",
              fontSize:
                boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                  ? "12"
                  : "10",
            },
          },
          {
            content: boleta.EB2?.toString() ?? "",
            styles: {
              halign: "right",
              fontStyle:
                boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                  ? "bold"
                  : "normal",
              fontSize:
                boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                  ? "12"
                  : "10",
            },
          },
          {
            content: boleta.EB3?.toString() ?? "",
            styles: {
              halign: "right",
              fontStyle:
                boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                  ? "bold"
                  : "normal",
              fontSize:
                boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                  ? "12"
                  : "10",
            },
          },
          {
            content: boleta.EB4?.toString() ?? "",
            styles: {
              halign: "right",
              fontStyle:
                boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                  ? "bold"
                  : "normal",
              fontSize:
                boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                  ? "12"
                  : "10",
            },
          },
          {
            content: boleta.EB5?.toString() ?? "",
            styles: {
              halign: "right",
              fontStyle:
                boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                  ? "bold"
                  : "normal",
              fontSize:
                boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                  ? "12"
                  : "10",
            },
          },
          {
            content: boleta.promedio?.toString() ?? "",
            styles: {
              halign: "right",
              fontStyle:
                boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                  ? "bold"
                  : "normal",
              fontSize:
                boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                  ? "12"
                  : "10",
            },
          },
        ]);
      reporte.generateTable(header2, data2);
    }
    reporte.nextRow(50);
    reporte.printLine(50, 160);
    reporte.nextRow(6);
    reporte.ImpPosX(
      "NOMBRE Y FIRMA DEL PADRE O TUTOR",
      70,
      reporte.tw_ren,
      0,
      "L"
    );
    const pdfData = reporte.doc.output("datauristring");
    setPdfData(pdfData);
    setPdfPreview(true);
    showModalVista(true);
  };
  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVPAlumno").showModal()
      : document.getElementById("modalVPAlumno").close();
  };
  const PDF = async () => {
    setisLoadingGrupos(true);
    setCaliAlum(false);
    if (!grupo.numero) {
      showSwal("Error", "Debe seleccionar un grupo.", "error");
      return;
    }
    if (!alumnosHorario.numero) {
      showSwal("Error", "Debe seleccionar un alumno.", "error");
      return;
    }
    if (bimestre > 5) {
      setBimestre("5");
    }
    if (bimestre <= 0) {
      showSwal("Error", "El bimestre debe de ser entre 1 y 5.", "error");
      return;
    }
    const { token } = session.user;
    const [dataMaterias, dataCalificaciones, data] = await Promise.all([
      getMateriasGrupo(token, grupo.numero),
      getCalificaciones(token, grupo.horario),
      getCalificacionesAlumnos(token, grupo),
    ]);
    let sumatoria = 0;
    let evaluaciones = 0;
    let calificaciones = [];
    const alumnos = data.alumnos;
    alumnos.map((alumno) => {
      dataMaterias.map((materia) => {
        for (let bi = 1; bi <= bimestre; bi++) {
          sumatoria = 0;
          evaluaciones = 0;
          let calificacion = 0;
          const mat = dataCalificaciones.materias.find(
            (mat) => mat.numero === materia.numero
          );
          if (mat) {
            if (materia.area === 1 || materia.area === 4) {
              if (mat.actividad === "No") {
                const calif = dataCalificaciones.calificaciones.find(
                  (calif) =>
                    calif.grupo === materia.horario &&
                    calif.alumno === alumno.numero &&
                    calif.actividad === 0 &&
                    calif.materia === mat.numero &&
                    calif.unidad <= mat.evaluaciones
                );
                if (!calif) {
                  sumatoria = 0.0;
                } else {
                  sumatoria = calif.calificacion;
                  evaluaciones = mat.evaluaciones;
                }
              } else {
                const actividad = dataCalificaciones.actividades.filter(
                  (act) => act.materia === mat.numero
                );
                actividad.map((act) => {
                  const califAct = dataCalificaciones.calificaciones.find(
                    (calAct) =>
                      calAct.alumno === alumno.numero &&
                      calAct.materia === mat.numero &&
                      calAct.bimestre === bi &&
                      calAct.actividad === act.secuencia &&
                      calAct.unidad <= act[`EB${bi}`]
                  );
                  let cpa = califAct?.calificacion || 0;
                  if (cpa > 0) {
                    const EB = act[`EB${bi}`];
                    sumatoria += cpa / EB;
                    evaluaciones += 1;
                  }
                });
                if (sumatoria === 0 || evaluaciones === 0) {
                  calificacion = 0.0;
                } else {
                  calificacion = sumatoria / evaluaciones;
                  if (calificacion < 5.0) {
                    calificacion = 5.0;
                  } else {
                    calificacion = sumatoria / evaluaciones || 0;
                  }
                }
              }
            } else {
              const calif = dataCalificaciones.calificaciones.find(
                (calif) =>
                  calif.grupo === materia.horario &&
                  calif.alumno === alumno.numero &&
                  calif.materia === mat.numero &&
                  calif.bimestre === bi
              );
              if (!calif) {
                calificacion = 0;
              } else {
                calificacion = Number(calif.calificacion) || 0;
              }
            }
            let materiaExistente = calificaciones.find(
              (cal) =>
                cal.materia === materia.descripcion &&
                cal.alumnos === alumno.numero
            );
            if (materiaExistente) {
              materiaExistente[`EB${bi}`] = parseFloat(calificacion.toFixed(1));
            } else {
              calificaciones.push({
                alumnos: alumno.numero,
                nombre: alumno.nombre,
                numero: materia.numero,
                materia: materia.descripcion,
                area: materia.area,
                EB1: 0,
                EB2: 0,
                EB3: 0,
                EB4: 0,
                EB5: 0,
                [`EB${bi}`]: parseFloat(calificacion.toFixed(1)),
              });
            }
          }
        }
      });
    });
    for (let i = 1; i <= bimestre; i++) {
      let sumaPromedioArea1 = 0;
      let sumaPromedioArea4 = 0;
      let contArea1 = 0;
      let contArea4 = 0;
      let indexArea1 = -1;
      let indexArea4 = -1;
      alumnos.map((alumno) => {
        indexArea1 = -1;
        sumaPromedioArea1 = 0;
        contArea1 = 0;
        indexArea4 = -1;
        sumaPromedioArea4 = 0;
        contArea4 = 0;
        let calificacionesArea1 = calificaciones.filter(
          (alum) => alum.alumnos === alumno.numero && alum.area === 1
        );
        calificacionesArea1.map((calificacion) => {
          if (
            calificacion.area === 1 &&
            calificacion.materia !== "LUGAR" &&
            calificacion.materia !== "PROMEDIO"
          ) {
            sumaPromedioArea1 += calificacion[`EB${i}`];
            contArea1++;
            if (indexArea1 === -1) {
              indexArea1 = calificaciones.findIndex(
                (p) => p.area === 2 && p.alumnos === alumno.numero
              );
              if (indexArea1 === -1) {
                indexArea1 = calificacionesArea1.length + 1;
              }
            }
          }
        });
        let promedioArea1 =
          contArea1 > 0 ? (sumaPromedioArea1 / contArea1).toFixed(1) : 0;
        if (promedioArea1 < 5.0) promedioArea1 = 5.0;
        let promedioExistenArea1 = calificaciones.find(
          (cal) => cal.materia === "PROMEDIO" && cal.alumnos === alumno.numero
        );
        if (promedioExistenArea1) {
          promedioExistenArea1[`EB${i}`] = promedioArea1;
        } else {
          calificaciones.splice(indexArea1, 0, {
            alumnos: alumno.numero,
            nombre: alumno.nombre,
            numero: 0,
            materia: "PROMEDIO",
            area: 1,
            EB1: 0,
            EB2: 0,
            EB3: 0,
            EB4: 0,
            EB5: 0,
            [`EB${i}`]: promedioArea1,
          });
        }
        const lugaraArea1 = lugaresArea1.find(
          (lugar) => lugar.numero === alumno.numero
        );
        let lugarExistenArea1 = calificaciones.find(
          (cal) => cal.materia === "LUGAR" && cal.alumnos === alumno.numero
        );
        if (lugarExistenArea1) {
          lugarExistenArea1[`EB${i}`] = lugaraArea1[i];
        } else {
          calificaciones.splice(indexArea1 + 1, 0, {
            alumnos: alumno.numero,
            nombre: alumno.nombre,
            numero: 0,
            materia: "LUGAR",
            area: 1,
            EB1: 0,
            EB2: 0,
            EB3: 0,
            EB4: 0,
            EB5: 0,
            [`EB${i}`]: lugaraArea1[i],
          });
        }
        let calificacionesArea4 = calificaciones.filter(
          (alum) => alum.alumnos === alumno.numero && alum.area === 4
        );
        calificacionesArea4.map((calificacion) => {
          if (
            calificacion.area === 4 &&
            calificacion.materia !== "PLACE" &&
            calificacion.materia !== "AVERAGE"
          ) {
            sumaPromedioArea4 += calificacion[`EB${i}`];
            contArea4++;
            if (indexArea4 === -1) {
              indexArea4 = calificaciones.findIndex(
                (p) => p.area === 5 && p.alumnos === alumno.numero
              );
              if (indexArea4 === -1) {
                indexArea4 =
                  calificaciones.findIndex(
                    (p) => p.area === 2 && p.alumnos === alumno.numero
                  ) + 2;
              }
            }
          }
        });
        let promedioArea4 =
          contArea4 > 0 ? (sumaPromedioArea4 / contArea4).toFixed(1) : 0;
        if (promedioArea4 < 5.0) promedioArea4 = 5.0;
        let promedioExistenArea4 = calificaciones.find(
          (cal) => cal.materia === "AVERAGE" && cal.alumnos === alumno.numero
        );
        if (promedioExistenArea4) {
          promedioExistenArea4[`EB${i}`] = promedioArea4;
        } else {
          calificaciones.splice(indexArea4, 0, {
            alumnos: alumno.numero,
            nombre: alumno.nombre,
            numero: 0,
            materia: "AVERAGE",
            area: 4,
            EB1: 0,
            EB2: 0,
            EB3: 0,
            EB4: 0,
            EB5: 0,
            [`EB${i}`]: promedioArea4,
          });
        }
        const lugaraArea4 = lugaresArea4.find(
          (lugar) => lugar.numero === alumno.numero
        );
        let lugarExistenArea4 = calificaciones.find(
          (cal) => cal.materia === "PLACE" && cal.alumnos === alumno.numero
        );
        if (lugarExistenArea4) {
          lugarExistenArea4[`EB${i}`] = lugaraArea4[i];
        } else {
          calificaciones.splice(indexArea4 + 1, 0, {
            alumnos: alumno.numero,
            nombre: alumno.nombre,
            numero: 0,
            materia: "PLACE",
            area: 4,
            EB1: 0,
            EB2: 0,
            EB3: 0,
            EB4: 0,
            EB5: 0,
            [`EB${i}`]: lugaraArea4[i],
          });
        }
      });
    }
    if (checkPromedio) {
      calificaciones = calificaciones.map((materia) => {
        let sumatoria = 0;
        let evaluaciones = 0;
        if (materia.materia !== "LUGAR" && materia.materia !== "PLACE") {
          for (let i = 1; i <= bimestre; i++) {
            sumatoria += parseFloat(materia[`EB${i}`]);
            evaluaciones++;
          }
          const promedio =
            evaluaciones > 0 ? (sumatoria / evaluaciones).toFixed(1) : 0;
          return {
            ...materia,
            promedio: promedio,
          };
        } else {
          return materia;
        }
      });
    }
    if (checkCaliLetra) {
      calificaciones.map((calificacion) => {
        const tipo = calificacion.area <= 3 ? "español" : "ingles"; // Español si área es 1, 2 o 3; inglés si es 4 o 5
        if (calificacion.materia === "LUGAR") {
          return calificacion;
        }
        if (calificacion.materia === "PLACE") {
          return calificacion;
        }
        calificacion.EB1 = conversion(parseFloat(calificacion.EB1), tipo);
        calificacion.EB2 = conversion(parseFloat(calificacion.EB2), tipo);
        calificacion.EB3 = conversion(parseFloat(calificacion.EB3), tipo);
        calificacion.EB4 = conversion(parseFloat(calificacion.EB4), tipo);
        calificacion.EB5 = conversion(parseFloat(calificacion.EB5), tipo);
        if (checkPromedio)
          calificacion.promedio = conversion(
            parseFloat(calificacion.promedio),
            tipo
          );
        return calificacion;
      });
    }
    setCalificacionesAlumnos(calificaciones);
    let configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Boletas por Bimestre",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
    };
    let header = [];
    let header2 = [];
    if (selectedOption === "español") {
      const body = calificaciones.filter(
        (cal) => cal.area !== 4 && cal.area !== 5
      );
      configuracion = { ...configuracion, body: body };
      header = [
        "ASIGNATURAS",
        "1ER BIMESTRE",
        "2DO BIMESTRE",
        "3ER BIMESTRE",
        "4TO BIMESTRE",
        "5TO BIMESTRE",
        "PROMEDIO FINAL",
      ];
    } else if (selectedOption === "ingles") {
      const body = calificaciones.filter(
        (cal) => cal.area !== 1 && cal.area !== 2 && cal.area !== 3
      );
      configuracion = { ...configuracion, body: body };
      header = [
        "SUBJECTS",
        "1ST TERM",
        "2ND TERM",
        "3RD TERM",
        "4TH TERM",
        "5TH TERM",
        "FINAL AVERAGE",
      ];
    } else {
      configuracion = { ...configuracion, body: calificaciones };
      header = [
        "ASIGNATURAS",
        "1ER BIMESTRE",
        "2DO BIMESTRE",
        "3ER BIMESTRE",
        "4TO BIMESTRE",
        "5TO BIMESTRE",
        "PROMEDIO FINAL",
      ];
      header2 = [
        "SUBJECTS",
        "1ST TERM",
        "2ND TERM",
        "3RD TERM",
        "4TH TERM",
        "5TH TERM",
        "FINAL AVERAGE",
      ];
    }
    const newPDF = new ReportePDF(configuracion);
    const { body } = configuracion;
    const Enca1 = (doc) => {
      if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalV();
        doc.nextRow(12);
        doc.nextRow(4);
        doc.ImpPosX(
          "AV.SANTA ANA N° 368 COL. SAN FRANCISCO CULCHUACÁN C.P. 04420",
          50,
          doc.tw_ren,
          0,
          "L"
        );
        doc.nextRow(4);
        doc.ImpPosX(
          "ACUERDO N° 09980051 DEL  13 AGOSTO DE 1998",
          65,
          doc.tw_ren,
          0,
          "L"
        );
        doc.nextRow(4);
        doc.ImpPosX("CLAVE 51-2636-510-32-PX-014", 80, doc.tw_ren, 0, "L");
        doc.nextRow(4);
        doc.ImpPosX("CCT 09PPR1204U", 90, doc.tw_ren, 0, "L");
        doc.nextRow(4);
        if (checkBoletaKinder) {
          doc.ImpPosX("JARDIN DE NIÑOS", 90, doc.tw_ren, 0, "L");
          doc.nextRow(4);
        }
        doc.ImpPosX(`${cicloFechas || ""}`, 97, doc.tw_ren, 0, "L");
        doc.nextRow(4);
        doc.ImpPosX(
          "El acercamiento al colegio será una forma para asegurar el éxito del alumno",
          50,
          doc.tw_ren,
          0,
          "L"
        );
        doc.nextRow(4);
        doc.printLineV();
        doc.tiene_encabezado = true;
      } else {
        doc.nextRow(6);
        doc.tiene_encabezado = true;
      }
    };
    let alumAnt = 0;
    let alumAct = 0;
    body.map((cal, index) => {
      alumAct = cal.alumnos;
      if (alumAnt !== alumAct) {
        Enca1(newPDF);
        newPDF.nextRow(10);
        newPDF.ImpPosX(`ALUMNO ${cal.nombre || ""}`, 15, newPDF.tw_ren, 0, "L");
        newPDF.nextRow(4);
        newPDF.ImpPosX(
          `GRUPO: ${grupo.horario || ""}`,
          15,
          newPDF.tw_ren,
          0,
          "L"
        );
        if (selectedOption === "español") {
          newPDF.ImpPosX(`ESPAÑOL`, 90, newPDF.tw_ren, 0, "L");
        } else if (selectedOption === "ingles") {
          newPDF.ImpPosX(`INGLES`, 90, newPDF.tw_ren, 0, "L");
        } else {
          newPDF.ImpPosX(`ESPAÑOL`, 90, newPDF.tw_ren, 0, "L");
          const data = body
            .filter((c) => c.alumnos === alumAct && c.area <= 3)
            .map((boleta) => [
              {
                content: boleta.materia.toString(),
                styles: {
                  fontStyle:
                    boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                      ? "bold"
                      : "normal",
                  fontSize:
                    boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                      ? "12"
                      : "10",
                },
              },
              {
                content: boleta.EB1?.toString() ?? "",
                styles: {
                  halign: "right",
                  fontStyle:
                    boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                      ? "bold"
                      : "normal",
                  fontSize:
                    boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                      ? "12"
                      : "10",
                },
              },
              {
                content: boleta.EB2?.toString() ?? "",
                styles: {
                  halign: "right",
                  fontStyle:
                    boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                      ? "bold"
                      : "normal",
                  fontSize:
                    boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                      ? "12"
                      : "10",
                },
              },
              {
                content: boleta.EB3?.toString() ?? "",
                styles: {
                  halign: "right",
                  fontStyle:
                    boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                      ? "bold"
                      : "normal",
                  fontSize:
                    boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                      ? "12"
                      : "10",
                },
              },
              {
                content: boleta.EB4?.toString() ?? "",
                styles: {
                  halign: "right",
                  fontStyle:
                    boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                      ? "bold"
                      : "normal",
                  fontSize:
                    boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                      ? "12"
                      : "10",
                },
              },
              {
                content: boleta.EB5?.toString() ?? "",
                styles: {
                  halign: "right",
                  fontStyle:
                    boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                      ? "bold"
                      : "normal",
                  fontSize:
                    boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                      ? "12"
                      : "10",
                },
              },
              {
                content: boleta.promedio?.toString() ?? "",
                styles: {
                  halign: "right",
                  fontStyle:
                    boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                      ? "bold"
                      : "normal",
                  fontSize:
                    boleta.materia === "LUGAR" || boleta.materia === "PROMEDIO"
                      ? "12"
                      : "10",
                },
              },
            ]);
          newPDF.generateTable(header, data);
          newPDF.nextRow(10);
          newPDF.ImpPosX(`INGLES`, 90, newPDF.tw_ren, 0, "L");
          const data2 = body
            .filter((c) => c.alumnos === alumAct && c.area >= 3)
            .map((boleta) => [
              {
                content: boleta.materia.toString(),
                styles: {
                  fontStyle:
                    boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                      ? "bold"
                      : "normal",
                  fontSize:
                    boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                      ? "12"
                      : "10",
                },
              },
              {
                content: boleta.EB1?.toString() ?? "",
                styles: {
                  halign: "right",
                  fontStyle:
                    boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                      ? "bold"
                      : "normal",
                  fontSize:
                    boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                      ? "12"
                      : "10",
                },
              },
              {
                content: boleta.EB2?.toString() ?? "",
                styles: {
                  halign: "right",
                  fontStyle:
                    boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                      ? "bold"
                      : "normal",
                  fontSize:
                    boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                      ? "12"
                      : "10",
                },
              },
              {
                content: boleta.EB3?.toString() ?? "",
                styles: {
                  halign: "right",
                  fontStyle:
                    boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                      ? "bold"
                      : "normal",
                  fontSize:
                    boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                      ? "12"
                      : "10",
                },
              },
              {
                content: boleta.EB4?.toString() ?? "",
                styles: {
                  halign: "right",
                  fontStyle:
                    boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                      ? "bold"
                      : "normal",
                  fontSize:
                    boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                      ? "12"
                      : "10",
                },
              },
              {
                content: boleta.EB5?.toString() ?? "",
                styles: {
                  halign: "right",
                  fontStyle:
                    boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                      ? "bold"
                      : "normal",
                  fontSize:
                    boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                      ? "12"
                      : "10",
                },
              },
              {
                content: boleta.promedio?.toString() ?? "",
                styles: {
                  halign: "right",
                  fontStyle:
                    boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                      ? "bold"
                      : "normal",
                  fontSize:
                    boleta.materia === "PLACE" || boleta.materia === "AVERAGE"
                      ? "12"
                      : "10",
                },
              },
            ]);
          newPDF.generateTable(header2, data2);
        }
        if (selectedOption === "español" || selectedOption === "ingles") {
          const data = body
            .filter((c) => c.alumnos === alumAct)
            .map((boleta) => [
              {
                content: boleta.materia.toString(),
                styles: {
                  fontStyle:
                    boleta.materia === "LUGAR" ||
                    boleta.materia === "PLACE" ||
                    boleta.materia === "PROMEDIO" ||
                    boleta.materia === "AVERAGE"
                      ? "bold"
                      : "normal",
                  fontSize:
                    boleta.materia === "LUGAR" ||
                    boleta.materia === "PLACE" ||
                    boleta.materia === "PROMEDIO" ||
                    boleta.materia === "AVERAGE"
                      ? "12"
                      : "10",
                },
              },
              {
                content: boleta.EB1?.toString() ?? "",
                styles: {
                  halign: "right",
                  fontStyle:
                    boleta.materia === "LUGAR" ||
                    boleta.materia === "PLACE" ||
                    boleta.materia === "PROMEDIO" ||
                    boleta.materia === "AVERAGE"
                      ? "bold"
                      : "normal",
                  fontSize:
                    boleta.materia === "LUGAR" ||
                    boleta.materia === "PLACE" ||
                    boleta.materia === "PROMEDIO" ||
                    boleta.materia === "AVERAGE"
                      ? "12"
                      : "10",
                },
              },
              {
                content: boleta.EB2?.toString() ?? "",
                styles: {
                  halign: "right",
                  fontStyle:
                    boleta.materia === "LUGAR" ||
                    boleta.materia === "PLACE" ||
                    boleta.materia === "PROMEDIO" ||
                    boleta.materia === "AVERAGE"
                      ? "bold"
                      : "normal",
                  fontSize:
                    boleta.materia === "LUGAR" ||
                    boleta.materia === "PLACE" ||
                    boleta.materia === "PROMEDIO" ||
                    boleta.materia === "AVERAGE"
                      ? "12"
                      : "10",
                },
              },
              {
                content: boleta.EB3?.toString() ?? "",
                styles: {
                  halign: "right",
                  fontStyle:
                    boleta.materia === "LUGAR" ||
                    boleta.materia === "PLACE" ||
                    boleta.materia === "PROMEDIO" ||
                    boleta.materia === "AVERAGE"
                      ? "bold"
                      : "normal",
                  fontSize:
                    boleta.materia === "LUGAR" ||
                    boleta.materia === "PLACE" ||
                    boleta.materia === "PROMEDIO" ||
                    boleta.materia === "AVERAGE"
                      ? "12"
                      : "10",
                },
              },
              {
                content: boleta.EB4?.toString() ?? "",
                styles: {
                  halign: "right",
                  fontStyle:
                    boleta.materia === "LUGAR" ||
                    boleta.materia === "PLACE" ||
                    boleta.materia === "PROMEDIO" ||
                    boleta.materia === "AVERAGE"
                      ? "bold"
                      : "normal",
                  fontSize:
                    boleta.materia === "LUGAR" ||
                    boleta.materia === "PLACE" ||
                    boleta.materia === "PROMEDIO" ||
                    boleta.materia === "AVERAGE"
                      ? "12"
                      : "10",
                },
              },
              {
                content: boleta.EB5?.toString() ?? "",
                styles: {
                  halign: "right",
                  fontStyle:
                    boleta.materia === "LUGAR" ||
                    boleta.materia === "PLACE" ||
                    boleta.materia === "PROMEDIO" ||
                    boleta.materia === "AVERAGE"
                      ? "bold"
                      : "normal",
                  fontSize:
                    boleta.materia === "LUGAR" ||
                    boleta.materia === "PLACE" ||
                    boleta.materia === "PROMEDIO" ||
                    boleta.materia === "AVERAGE"
                      ? "12"
                      : "10",
                },
              },
              {
                content: boleta.promedio?.toString() ?? "",
                styles: {
                  halign: "right",
                  fontStyle:
                    boleta.materia === "LUGAR" ||
                    boleta.materia === "PLACE" ||
                    boleta.materia === "PROMEDIO" ||
                    boleta.materia === "AVERAGE"
                      ? "bold"
                      : "normal",
                  fontSize:
                    boleta.materia === "LUGAR" ||
                    boleta.materia === "PLACE" ||
                    boleta.materia === "PROMEDIO" ||
                    boleta.materia === "AVERAGE"
                      ? "12"
                      : "10",
                },
              },
            ]);
          newPDF.generateTable(header, data);
        }

        newPDF.nextRow(50);
        newPDF.printLine(50, 160);
        newPDF.nextRow(6);
        newPDF.ImpPosX(
          "NOMBRE Y FIRMA DEL PADRE O TUTOR",
          70,
          newPDF.tw_ren,
          0,
          "L"
        );
        newPDF.tiene_encabezado = false;
        const ultimoRegistro = body[body.length - 1].alumnos;
        if (index < body.length - 1 && alumAct !== ultimoRegistro) {
          newPDF.addPage();
        }
        alumAnt = alumAct;
      }
    });
    setisLoadingGrupos(false);
    const pdfData = newPDF.doc.output("datauristring");
    setPdfData(pdfData);
    setPdfPreview(true);
    showModalVista(true);
  };
  const PDFAlumno = () => {
    if (caliAlum) {
      let configuracion = {
        Encabezado: {
          Nombre_Aplicacion: "Lista de Alumnos por clase",
          Nombre_Reporte: "Reporte de Alumnos",
          Nombre_Usuario: `Usuario: ${session.user.name}`,
        },
      };
      let header = [];
      let header2 = [];
      if (selectedOption === "español") {
        const body = calificaciones.filter(
          (cal) => cal.area !== 4 && cal.area !== 5
        );
        configuracion = { ...configuracion, body: body };
        header = [
          "ASIGNATURAS",
          "1ER BIMESTRE",
          "2DO BIMESTRE",
          "3ER BIMESTRE",
          "4TO BIMESTRE",
          "5TO BIMESTRE",
          "PROMEDIO FINAL",
        ];
        configuracion = { ...configuracion, body: body, header: header };
      } else if (selectedOption === "ingles") {
        const body = calificaciones.filter(
          (cal) => cal.area !== 1 && cal.area !== 2 && cal.area !== 3
        );
        header = [
          "SUBJECTS",
          "1ST TERM",
          "2ND TERM",
          "3RD TERM",
          "4TH TERM",
          "5TH TERM",
          "FINAL AVERAGE",
        ];
        configuracion = { ...configuracion, body: body, header: header };
      } else {
        header = [
          "ASIGNATURAS",
          "1ER BIMESTRE",
          "2DO BIMESTRE",
          "3ER BIMESTRE",
          "4TO BIMESTRE",
          "5TO BIMESTRE",
          "PROMEDIO FINAL",
        ];
        header2 = [
          "SUBJECTS",
          "1ST TERM",
          "2ND TERM",
          "3RD TERM",
          "4TH TERM",
          "5TH TERM",
          "FINAL AVERAGE",
        ];
        configuracion = {
          ...configuracion,
          body: calificaciones,
          header: header,
          header2: header2,
        };
      }
      configuracion = {
        ...configuracion,
        checkBoletaK: checkBoletaKinder,
        cicloFechas: cicloFechas,
        alumno: alumnosHorario.nombre,
        grupo: grupo.horario,
        selectedOption: selectedOption,
      };
      Imprimir(configuracion);
    } else {
      let configuracion = {
        Encabezado: {
          Nombre_Aplicacion: "Lista de Alumnos por clase",
          Nombre_Reporte: "Reporte de Alumnos",
          Nombre_Usuario: `Usuario: ${session.user.name}`,
        },
        grupo: grupo.horario,
        checkBoletaK: checkBoletaKinder,
        cicloFechas: cicloFechas,
        selectedOption: selectedOption,
      };
      let header = [];
      let header2 = [];
      if (selectedOption === "español") {
        const body = calificacionesAlumnos.filter(
          (cal) => cal.area !== 4 && cal.area !== 5
        );
        configuracion = { ...configuracion, body: body };
        header = [
          "ASIGNATURAS",
          "1ER BIMESTRE",
          "2DO BIMESTRE",
          "3ER BIMESTRE",
          "4TO BIMESTRE",
          "5TO BIMESTRE",
          "PROMEDIO FINAL",
        ];
        configuracion = { ...configuracion, body: body, header: header };
      } else if (selectedOption === "ingles") {
        const body = calificacionesAlumnos.filter(
          (cal) => cal.area !== 1 && cal.area !== 2 && cal.area !== 3
        );
        header = [
          "SUBJECTS",
          "1ST TERM",
          "2ND TERM",
          "3RD TERM",
          "4TH TERM",
          "5TH TERM",
          "FINAL AVERAGE",
        ];
        configuracion = { ...configuracion, body: body, header: header };
      } else {
        header = [
          "ASIGNATURAS",
          "1ER BIMESTRE",
          "2DO BIMESTRE",
          "3ER BIMESTRE",
          "4TO BIMESTRE",
          "5TO BIMESTRE",
          "PROMEDIO FINAL",
        ];
        header2 = [
          "SUBJECTS",
          "1ST TERM",
          "2ND TERM",
          "3RD TERM",
          "4TH TERM",
          "5TH TERM",
          "FINAL AVERAGE",
        ];
        configuracion = {
          ...configuracion,
          body: calificacionesAlumnos,
          header: header,
          header2: header2,
        };
      }
      const { body } = configuracion;
      let alumAnt = 0;
      let alumAct = 0;
      body.map((cal, index) => {
        alumAct = cal.alumnos;
        if (alumAnt !== alumAct) {
          const alumno = cal.nombre;
          const data = body.filter((c) => c.alumnos === alumAct);
          configuracion = { ...configuracion, body: data, alumno: alumno };
          Imprimir(configuracion);
          alumAnt = alumAct;
        }
      });
    }
  };
  return (
    <>
      <ModalVistaPreviaPBoletas
        PDF={PDFAlumno}
        pdfData={pdfData}
        pdfPreview={pdfPreview}
      />
      <div className="container h-[80vh] w-full max-w-screen-xl bg-base-200 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden">
        <div className="flex flex-col justify-start p-3">
          <div className="flex flex-wrap md:flex-nowrap items-start md:items-center">
            <div className="order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0">
              <Acciones
                Buscar={Bus}
                home={home}
                Ver={handleVerClick}
                BoletasGrupo={PDF}
                isLoadingBoletasGrupo={isLoadingGrupos}
                isLoadingVistaPrevia={isLoading}
                permiso_imprime={permissions.impresion}
              />
            </div>
            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
              Creación de Boletas
            </h1>
          </div>
        </div>
        <div className="flex flex-col items-center h-full">
          <div className="w-full max-w-4xl">
            <Busqueda
              session={session}
              setItem1={setGrupo}
              setItem2={setAlumnosHorario}
              item1={grupo}
              item2={alumnosHorario}
              handleBusquedaChange={handleBusquedaChange}
              setCheckCaliLetra={setCheckCaliLetra}
              setCheckPromedio={setCheckPromedio}
              setCheckBoletaKinder={setCheckBoletaKinder}
              promedio={promedio}
              PDF={PDF}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              setCicloFechas={setCicloFechas}
              cicloFechas={cicloFechas}
            />
            <TablaCalificaciones
              Calificaciones={calificaciones}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default P_Boletas;
