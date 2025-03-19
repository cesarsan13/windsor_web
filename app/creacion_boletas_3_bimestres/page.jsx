"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { showSwal, confirmSwal } from "@/app/utils/alerts";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "jspdf-autotable";
import Inputs from "@/app/creacion_boletas_3_bimestres/components/Inputs";
import Acciones from "@/app/creacion_boletas_3_bimestres/components/Acciones";
import BuscarCat from "@/app/components/BuscarCat";
import TablaPromedioEspañol from "@/app/creacion_boletas_3_bimestres/components/tablaPromedioEspañol";
import {
  getBoletas3,
  getDatosPorGrupo,
  ImprimirPDF,
} from "@/app/utils/api/boletas/boletas";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import {
  formatNumberDecimalOne,
  permissionsComponents
} from "@/app/utils/globalfn";
import ModalVistaPreviaBoleta3 from "@/app/creacion_boletas_3_bimestres/components/ModalVistaPreviaBoletas3";
import TablaPromedioIngles from "@/app/creacion_boletas_3_bimestres/components/tablaPromedioIngles";
import { getAlumnos } from "@/app/utils/api/alumnos/alumnos";

function CreacionBoletas3Bimestre() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setisLoading] = useState(false);
  const [isLoadingFind, setisLoadingFind] = useState(false);
  const [isLoadingImprime, setisLoadingImprime] = useState(false);
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const [grupo, setGrupo] = useState({});
  const [alumno, setAlumno] = useState({});
  const [ciclo, setCiclo] = useState([]);
  const [promediosEspañol, setPromediosEspañol] = useState([]);
  const [promediosEspañolAr2, setPromediosEspañolAr2] = useState([]);
  const [promediosEspañolAr3, setPromediosEspañolAr3] = useState([]);
  const [promediosInglesAr5, setPromediosInglesAr5] = useState([]);
  const [promediosIngles, setPromediosIngles] = useState([]);
  const [lugaresEspañol, setLugaresEspañol] = useState([]);
  const [lugaresIngles, setLugaresIngles] = useState([]);
  const [animateLoading, setAnimateLoading] = useState(false);
  const [permissions, setPermissions] = useState({});
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      bimestre: 1,
    },
  });
  let bimestre = watch("bimestre");
  const imprimePromedio = watch("imprime_promedio");
  const ciclo_fechas = watch("ciclo");
  const calificacionLetra = watch("calificacion_letra");
  const ordenAlfabetico = watch("orden_alfabetico");
  const asignacion = watch("opcion");
  const boleta_kinder = watch("boleta_kinder");

  useEffect(() => {
    if (status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {
      let newCombo = [];

      for (let i = 2050; i >= 1970; i--) {
        const fechasRango = `${i}-${i + 1}`;
        newCombo.push({
          id: fechasRango,
          descripcion: fechasRango,
        });
      }

      setCiclo(newCombo);
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {
      let { token, permissions } = session.user;
      const menuSeleccionado = Number(localStorage.getItem("puntoMenu"));
      const es_admin = session.user.es_admin;
      const permisos = permissionsComponents(
        es_admin,
        permissions,
        session.user.id,
        menuSeleccionado
      );
      setPermissions(permisos);
      let x;
      const datos = await getDatosPorGrupo(
        session.user.token,
        grupo.numero,
        grupo.horario,
        ordenAlfabetico
      );
      if (
        !datos.alumnos ||
        !datos.materias_español ||
        !datos.materias_ingles ||
        !datos.calificaciones ||
        !datos.actividades
      ) {
        return;
      }
      let alumnos_es = datos.alumnos.map((alumno) => {
        return {
          ...alumno,
          1: "",
          2: "",
          3: "",
          6: "",
        };
      });
      const calificaciones = datos.calificaciones;
      const actividades = datos.actividades;
      const materias_español = datos.materias_español;
      const materias_ingles = datos.materias_ingles;
      for (let b = 1; b <= 3; b++) {
        alumnos_es.map((alumno, falum) => {
          let caliMateria = 0;
          materias_español.map((materia) => {
            let sumatoria = 0;
            let evaluaciones = 0;

            if (materia.actividad === "No") {
              evaluaciones = materia.evaluaciones;
              const filtroCalificaciones = calificaciones.filter(
                (calificacion) =>
                  calificacion.bimestre === b &&
                  calificacion.alumno === alumno.numero &&
                  calificacion.actividad === 0 &&
                  calificacion.materia === materia.materia &&
                  calificacion.unidad <= evaluaciones
              );

              sumatoria = parseFloat(
                filtroCalificaciones.reduce(
                  (acc, calificacion) => acc + calificacion.calificacion,
                  0
                )
              );
              const promedio = sumatoria / evaluaciones;
              caliMateria += parseFloat(formatNumberDecimalOne(promedio));
            } else if (materia.actividad === "Si") {
              const tablas = actividades.filter(
                (actividad) => actividad.materia === materia.materia
              );
              if (tablas.length > 0) {
                for (let i = 0; i < tablas.length; i++) {
                  const filtroCalificaciones = calificaciones.filter(
                    (calificacion) =>
                      calificacion.alumno === alumno.numero &&
                      calificacion.materia === materia.materia &&
                      calificacion.bimestre === b &&
                      calificacion.actividad === tablas[i].secuencia &&
                      calificacion.unidad <= tablas[i]["EB" + b]
                  );
                  const cpa = parseFloat(
                    filtroCalificaciones.reduce(
                      (acc, calificacion) => acc + calificacion.calificacion,
                      0
                    )
                  );
                  const ebValue = tablas[i]["EB" + b] || 1;
                  sumatoria += cpa / ebValue;
                }
                evaluaciones = tablas.length;
                const promedio = parseFloat(sumatoria / evaluaciones);
                caliMateria += parseFloat(formatNumberDecimalOne(promedio));
              }
            }
          });

          if (materias_español.length > 0) {
            alumnos_es[falum] = {
              ...alumnos_es[falum],
              [b]: formatNumberDecimalOne(
                caliMateria / materias_español.length
              ),
            };
          } else {
            alumnos_es[falum] = {
              ...alumnos_es[falum],
              [b]: 0,
            };
          }
        });
      }
      let prom;
      let promedio = 0.0;
      alumnos_es = alumnos_es.map((item) => {
        prom = 0;
        promedio = 0;
        for (let i = 1; i <= 3; i++) {
          const bimestreFiltrado = `${i}`;
          prom += parseFloat(item[bimestreFiltrado]);
        }
        promedio = prom / 3;
        if (promedio < 5.0) {
          promedio = formatNumberDecimalOne(5);
        }
        return { ...item, 6: promedio };
      });

      let alumnos_in = datos.alumnos.map((alumno) => {
        return {
          ...alumno,
          1: "",
          2: "",
          3: "",
          6: "",
        };
      });
      for (let b = 1; b <= 3; b++) {
        alumnos_in.map((alumno, falum) => {
          let caliMateria = 0;
          materias_ingles.map((materia) => {
            let sumatoria = 0;
            let evaluaciones = 0;

            if (materia.actividad === "No") {
              evaluaciones = materia.evaluaciones;
              const filtroCalificaciones = calificaciones.filter(
                (calificacion) =>
                  calificacion.bimestre === b &&
                  calificacion.alumno === alumno.numero &&
                  calificacion.actividad === 0 &&
                  calificacion.materia === materia.materia &&
                  calificacion.unidad <= evaluaciones
              );

              sumatoria = parseFloat(
                filtroCalificaciones.reduce(
                  (acc, calificacion) => acc + calificacion.calificacion,
                  0
                )
              );
              const promedio = sumatoria / evaluaciones;
              caliMateria += parseFloat(formatNumberDecimalOne(promedio));
            } else if (materia.actividad === "Si") {
              const tablas = actividades.filter(
                (actividad) => actividad.materia === materia.materia
              );
              if (tablas.length > 0) {
                for (let i = 0; i < tablas.length; i++) {
                  const filtroCalificaciones = calificaciones.filter(
                    (calificacion) =>
                      calificacion.alumno === alumno.numero &&
                      calificacion.materia === materia.materia &&
                      calificacion.bimestre === b &&
                      calificacion.actividad === tablas[i].secuencia &&
                      calificacion.unidad <= tablas[i]["EB" + b]
                  );
                  const cpa = parseFloat(
                    filtroCalificaciones.reduce(
                      (acc, calificacion) => acc + calificacion.calificacion,
                      0
                    )
                  );
                  const ebValue = tablas[i]["EB" + b] || 1;
                  sumatoria += cpa / ebValue;
                }
                evaluaciones = tablas.length;
                const promedio = parseFloat(sumatoria / evaluaciones);
                caliMateria += parseFloat(formatNumberDecimalOne(promedio));
              }
            }
          });

          if (materias_ingles.length > 0) {
            alumnos_in[falum] = {
              ...alumnos_in[falum],
              [b]: formatNumberDecimalOne(caliMateria / materias_ingles.length),
            };
          } else {
            alumnos_in[falum] = {
              ...alumnos_in[falum],
              [b]: 0,
            };
          }
        });
      }
      prom;
      promedio = 0.0;
      alumnos_in = alumnos_in.map((item) => {
        prom = 0;
        promedio = 0;
        for (let i = 1; i <= 3; i++) {
          const bimestreFiltrado = `${i}`;
          prom += parseFloat(item[bimestreFiltrado]);
        }
        promedio = prom / 3;
        if (promedio < 5.0) {
          promedio = formatNumberDecimalOne(5);
        }
        return { ...item, 6: promedio };
      });

      calcularLugares(alumnos_es, "Español");
      calcularLugares(alumnos_in, "Ingles");
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grupo.numero]);

  const calcularLugares = async (alumnos_prop, tipo) => {
    if (!alumnos_prop) return [];
    const mat_col = [1, 2, 3, 6];
    let alumnos = alumnos_prop.map((alumno) => ({
      ...alumno,
      lugar: "",
    }));
    mat_col.forEach((col) => {
      let lugar1 = 0;
      let lugar2 = 0;
      let lugar3 = 0;
      for (let f = 0; f < alumnos.length; f++) {
        const Calificacion = parseFloat(alumnos[f][col]);
        if (Calificacion > lugar1 && Calificacion > 7) {
          lugar3 = lugar2;
          lugar2 = lugar1;
          lugar1 = Calificacion;
        } else if (
          Calificacion > lugar2 &&
          Calificacion < lugar1 &&
          Calificacion > 7
        ) {
          lugar3 = lugar2;
          lugar2 = Calificacion;
        } else if (
          Calificacion > lugar3 &&
          Calificacion < lugar2 &&
          Calificacion > 7
        ) {
          lugar3 = Calificacion;
        }
      }
      for (let f = 0; f < alumnos.length; f++) {
        const Calificacion = parseFloat(alumnos[f][col]);
        if (Calificacion === lugar1 && lugar1 > 5.9) {
          alumnos[f].lugar = "1er";
        } else if (Calificacion === lugar2 && lugar2 > 5.9) {
          alumnos[f].lugar = "2do";
        } else if (Calificacion === lugar3 && lugar3 > 5.9) {
          alumnos[f].lugar = "3er";
        } else {
          alumnos[f].lugar = "";
        }
      }
    });

    if (tipo === "Español") {
      setLugaresEspañol(alumnos);
    } else {
      setLugaresIngles(alumnos);
    }
  };

  const desplegarPromedioLugar = (
    newPromedio,
    tipo,
    newEspañolAr2,
    newEspañolmAr3,
    newInglesAr5,
    imprime,
    lugar
  ) => {
    let newDataEspañol = [
      {
        numero: "",
        descripcion: "LUGAR",
        bimestre1: "",
        bimestre2: "",
        bimestre3: "",
        promedio: "",
      },
      {
        numero: "",
        descripcion: "PROMEDIO",
        bimestre1: "",
        bimestre2: "",
        bimestre3: "",
        promedio: "",
      },
    ];
    let newDataIngles = [
      {
        numero: "",
        descripcion: "PLACE",
        bimestre1: "",
        bimestre2: "",
        bimestre3: "",
        promedio: "",
      },
      {
        numero: "",
        descripcion: "AVERAGE",
        bimestre1: "",
        bimestre2: "",
        bimestre3: "",
        promedio: "",
      },
    ];
    if (tipo === "Español") {
      if (!imprime) {
        lugaresEspañol.map(function (item) {
          if (item.numero === alumno.numero) {
            newDataEspañol[0].bimestre1 = item.lugar;
            if (parseInt(bimestre) > 1) {
              newDataEspañol[0].bimestre2 = item.lugar;
            }
            if (parseInt(bimestre) > 2) {
              newDataEspañol[0].bimestre3 = item.lugar;
            }
            if (imprimePromedio) {
              newDataEspañol[0].promedio = item.lugar;
            }
          }
        });
      } else {
        newDataEspañol[0].bimestre1 = lugar;
        if (parseInt(bimestre) > 1) {
          newDataEspañol[0].bimestre2 = lugar;
        }
        if (parseInt(bimestre) > 2) {
          newDataEspañol[0].bimestre3 = lugar;
        }
        if (imprimePromedio) {
          newDataEspañol[0].promedio = lugar;
        }
      }
    } else {
      if (!imprime) {
        lugaresIngles.map(function (item) {
          if (item.numero === alumno.numero) {
            newDataIngles[0].bimestre1 = item.lugar;
            if (bimestre === 2) {
              newDataIngles[0].bimestre2 = item.lugar;
            }
            if (bimestre === 3) {
              newDataIngles[0].bimestre3 = item.lugar;
            }
            if (imprimePromedio) {
              newDataIngles[0].promedio = item.lugar;
            }
          }
        });
      } else {
        newDataIngles[0].bimestre1 = lugar;
        if (bimestre === 2) {
          newDataIngles[0].bimestre2 = lugar;
        }
        if (bimestre === 3) {
          newDataIngles[0].bimestre3 = lugar;
        }
        if (imprimePromedio) {
          newDataIngles[0].promedio = lugar;
        }
      }
    }
    if (newPromedio.length > 0) {
      for (let i = 1; i <= bimestre; i++) {
        let promedio = calcularBimestresColumna(newPromedio, i);
        if (promedio < 5.0) {
          promedio = 5.0;
        }
        let formato = promedio === 10 ? "N0" : "N1";
        let formattedValue;
        if (formato === "N0") {
          formattedValue = truncarUno(promedio);
          if (calificacionLetra) {
            formattedValue = conversionALetra(formattedValue, tipo);
          }
        } else {
          formattedValue = truncarUno(promedio).toFixed(1);
          if (calificacionLetra) {
            formattedValue = conversionALetra(formattedValue, tipo);
          }
        }
        if (i === 1) {
          if (tipo === "Español") {
            newDataEspañol[1].bimestre1 = formattedValue;
          } else {
            newDataIngles[1].bimestre1 = formattedValue;
          }
        } else if (i === 2) {
          if (tipo === "Español") {
            newDataEspañol[1].bimestre2 = formattedValue;
          } else {
            newDataIngles[1].bimestre2 = formattedValue;
          }
        } else if (i === 3) {
          if (tipo === "Español") {
            newDataEspañol[1].bimestre3 = formattedValue;
          } else {
            newDataIngles[1].bimestre3 = formattedValue;
          }
        }
        if (imprimePromedio) {
          newPromedio = sacarPromedioArray(newPromedio, tipo);
          if (tipo === "Español") {
            newEspañolAr2 = sacarPromedioArray(newEspañolAr2, tipo);
            newEspañolmAr3 = sacarPromedioArray(newEspañolmAr3, tipo);
            newDataEspañol = sacarPromedioArrayLugares(newDataEspañol, tipo);
          } else if (tipo === "Ingles") {
            newInglesAr5 = sacarPromedioArray(newInglesAr5, tipo);
            newDataIngles = sacarPromedioArrayLugares(newDataIngles, tipo);
          }
        }
      }
      if (calificacionLetra) {
        newPromedio = newPromedio.map((item) => {
          for (let i = 1; i <= bimestre; i++) {
            const bimestreFiltrado = `bimestre${i}`;
            const calificacion = parseFloat(item[bimestreFiltrado]);
            if (!isNaN(calificacion)) {
              const calificacionLetra = conversionALetra(calificacion, tipo);
              item[bimestreFiltrado] = calificacionLetra;
            }
          }
          return item;
        });
        if (tipo === "Español") {
          newEspañolAr2 = newEspañolAr2.map((item) => {
            for (let i = 1; i <= bimestre; i++) {
              const bimestreFiltrado = `bimestre${i}`;
              const calificacion = parseFloat(item[bimestreFiltrado]);
              if (!isNaN(calificacion)) {
                const calificacionLetra = conversionALetra(calificacion, tipo);
                item[bimestreFiltrado] = calificacionLetra;
              }
            }
            return item;
          });
          newEspañolmAr3 = newEspañolmAr3.map((item) => {
            for (let i = 1; i <= bimestre; i++) {
              const bimestreFiltrado = `bimestre${i}`;
              const calificacion = parseFloat(item[bimestreFiltrado]);
              if (!isNaN(calificacion)) {
                const calificacionLetra = conversionALetra(calificacion, tipo);
                item[bimestreFiltrado] = calificacionLetra;
              }
            }
            return item;
          });
        } else {
          newInglesAr5 = newInglesAr5.map((item) => {
            for (let i = 1; i <= bimestre; i++) {
              const bimestreFiltrado = `bimestre${i}`;
              const calificacion = parseFloat(item[bimestreFiltrado]);
              if (!isNaN(calificacion)) {
                const calificacionLetra = conversionALetra(calificacion, tipo);
                item[bimestreFiltrado] = calificacionLetra;
              }
            }
            return item;
          });
        }
      }

      if (tipo === "Español") {
        if (!imprime) {
          setPromediosEspañol([
            ...newPromedio,
            ...newDataEspañol,
            ...newEspañolAr2,
            ...newEspañolmAr3,
          ]);
        } else {
          newPromedio.push(
            ...newDataEspañol,
            ...newEspañolAr2,
            ...newEspañolmAr3
          );
          return newPromedio;
        }
      } else {
        if (!imprime) {
          setPromediosIngles([
            ...newPromedio,
            ...newDataIngles,
            ...newInglesAr5,
          ]);
        } else {
          newPromedio.push(...newDataIngles, ...newInglesAr5);
          return newPromedio;
        }
      }
    }
  };

  const sacarPromedioArray = (arregloPromedio, tipo) => {
    let prom;
    let promedio = 0.0;
    arregloPromedio = arregloPromedio.map((item) => {
      prom = 0;
      promedio = 0;
      for (let i = 1; i <= bimestre; i++) {
        const bimestreFiltrado = `bimestre${i}`;
        prom += parseFloat(item[bimestreFiltrado]);
      }
      promedio = prom / parseInt(bimestre);
      promedio = truncarUno(promedio);
      if (promedio < 5.0) {
        promedio = 5.0;
      }
      if (calificacionLetra) {
        promedio = conversionALetra(promedio, tipo);
      }
      return { ...item, promedio: promedio };
    });
    return arregloPromedio;
  };

  const sacarPromedioArrayLugares = (arregloPromedio, tipo) => {
    let prom = 0;
    let promedio = 0.0;
    arregloPromedio[1] = {
      ...arregloPromedio[1],
      promedio: (() => {
        for (let i = 1; i <= bimestre; i++) {
          const bimestreFiltrado = `bimestre${i}`;
          prom += parseFloat(arregloPromedio[1][bimestreFiltrado]) || 0;
        }
        promedio = prom / parseInt(bimestre);
        promedio = truncarUno(promedio);
        if (promedio < 5.0) {
          promedio = 5.0;
        }
        if (calificacionLetra) {
          promedio = conversionALetra(promedio, tipo);
        }
        return promedio;
      })(),
    };
    return arregloPromedio;
  };

  const conversionALetra = (calif, tipo) => {
    let alfesp = "";
    let alfing = "";
    if (calif === 10) {
      alfesp = "E";
      alfing = "E";
    } else if (calif < 10 && calif >= 9) {
      alfesp = "MB";
      alfing = "VG";
    } else if (calif < 9 && calif >= 8) {
      alfesp = "B";
      alfing = "G";
    } else if (calif < 8 && calif >= 7) {
      alfesp = "A";
      alfing = "R";
    } else if (calif < 7 && calif >= 6) {
      alfesp = "RA";
      alfing = "RS";
    } else {
      alfesp = "RA";
      alfing = "RS";
    }
    return tipo === "Español" ? alfesp : alfing;
  };

  const calcularBimestresColumna = (promedios, bim) => {
    if (promedios.length === 0) return 0;
    let suma = 0;

    promedios.forEach((item) => {
      const bimestreKey = `bimestre${bim}`;
      if (item[bimestreKey] && !isNaN(item[bimestreKey])) {
        suma += parseFloat(item[bimestreKey]);
      }
    });

    const promedio = suma / promedios.length;
    return promedio;
  };

  const truncarUno = (num) => {
    return Math.trunc(num * 10) / 10;
  };

  const Buscar = handleSubmit(async (data) => {
    const { token } = session.user;
    let datosEspañol = [];
    let datosIngles = [];
    let datosEspañolAr2 = [];
    let datosEspañolAr3 = [];
    let datosInglesAr5 = [];

    if (!grupo.numero) {
      showSwal("Error", "Debe seleccionar un grupo.", "error");
      return;
    }
    if (!alumno.numero) {
      showSwal("Error", "Debe seleccionar un alumno.", "error");
      return;
    }
    if (data.bimestre > 3) {
      data.bimestre = 3;
      setValue("bimestre", data.bimestre);
    }
    if (data.bimestre <= 0) {
      showSwal("Error", "El trimestre debe de ser entre 1 y 3.", "error");
      return;
    }

    setPromediosEspañol([]);
    setPromediosIngles([]);
    setPromediosEspañolAr2([]);
    setPromediosEspañolAr3([]);
    setPromediosInglesAr5([]);
    setisLoadingFind(true);

    data.alumno = alumno.numero;
    data.nombre_alumno = alumno.nombre;
    data.grupo = grupo.numero;
    data.grupo_nombre = grupo.horario;

    const datos = await getBoletas3(token, grupo.numero);

    const clases = datos.clases ?? [];
    const materias = datos.materias ?? [];
    const calificaciones = datos.calificaciones ?? [];
    const actividades = datos.actividades ?? [];

    if (
      !clases.length ||
      !materias.length ||
      !calificaciones.length ||
      !actividades.length
    ) {
      setisLoadingFind(false);
      showSwal(
        "Error",
        "No se encontraron datos para calcular las calificaciones.",
        "error"
      );
      return;
    }
    if (clases.length > 0) {
      const materiasMap = {};
      for (let a = 1; a <= data.bimestre; a++) {
        for (let i = 0; i < clases.length; i++) {
          clases.map(function (val) {
            let calificacion_table = 0;
            try {
              const materiaKey = val.numero;
              if (!materiasMap[materiaKey]) {
                materiasMap[materiaKey] = {
                  numero: materiaKey,
                  descripcion: val.descripcion,
                  bimestre1: 0,
                  bimestre2: 0,
                  bimestre3: 0,
                };
              }
              if (val.area === 1 || val.area === 4) {
                const filtroMateria = materias.filter(
                  (materia) => materia.numero === materiaKey
                );
                if (filtroMateria[0].actividad === "No") {
                  evaluacion = materias.filter(
                    (materia) => materia.numero === filtroMateria.numero
                  );
                  const datosDG3 = calificaciones.filter(
                    (calificacion) =>
                      calificacion.bimestre === a &&
                      calificacion.alumno === data.alumno &&
                      calificacion.actividad === 0 &&
                      calificacion.materia === materiaKey &&
                      calificacion.unidad <= evaluacion
                  );
                  let sumaCalificaciones = datosDG3.reduce(
                    (total, calificacion) => {
                      return total + parseFloat(calificacion.calificacion);
                    },
                    0
                  );
                  if (!sumaCalificaciones) {
                    calificacion_table =
                      formatNumberDecimalOne(sumaCalificaciones);
                  } else {
                    calificacion_table = formatNumberDecimalOne(0);
                  }
                } else if (filtroMateria[0].actividad === "Si") {
                  const calificacion = calificaciones.filter(
                    (calificacion) => calificacion.grupo === data.grupo_nombre
                  );
                  const actividad = actividades
                    .filter((actividad) => actividad.materia === materiaKey)
                    .sort((a, b) => a.secuencia - b.secuencia);
                  let sumatoria = 0;
                  let evaluaciones = 0;
                  actividad.forEach((act) => {
                    const EB = `EB${a}`;
                    const filtroActividad = calificacion.filter(
                      (calificacion) =>
                        calificacion.alumno === data.alumno &&
                        calificacion.materia === materiaKey &&
                        calificacion.bimestre === a &&
                        calificacion.actividad === act.secuencia &&
                        calificacion.unidad <= act[EB]
                    );
                    const cpa = filtroActividad.reduce(
                      (total, calificacion) => {
                        return total + parseFloat(calificacion.calificacion);
                      },
                      0
                    );
                    if (cpa > 0) {
                      const rauw = act[EB];
                      sumatoria += parseFloat(cpa / rauw);
                      evaluaciones += 1;
                    }
                  });
                  if (sumatoria === 0 || evaluaciones === 0) {
                    calificacion_table = formatNumberDecimalOne(0);
                  } else {
                    let calificacion_total = parseFloat(
                      sumatoria / evaluaciones
                    );
                    if (calificacion_total < 5.0) {
                      calificacion_table = formatNumberDecimalOne(0);
                    } else {
                      calificacion_table =
                        formatNumberDecimalOne(calificacion_total);
                    }
                  }
                }
                materiasMap[materiaKey][`bimestre${a}`] = calificacion_table;
                if (val.area === 1) {
                  datosEspañol = datosEspañol.map((item) => {
                    if (item.numero === materiaKey) {
                      return {
                        ...item,
                        [`bimestre${a}`]: calificacion_table,
                      };
                    }
                    return item;
                  });
                  if (
                    !datosEspañol.find((item) => item.numero === materiaKey)
                  ) {
                    datosEspañol.push({
                      numero: materiaKey,
                      descripcion: val.descripcion,
                      [`bimestre${a}`]: calificacion_table,
                    });
                  }
                } else if (val.area === 4) {
                  datosIngles = datosIngles.map((item) => {
                    if (item.numero === materiaKey) {
                      return {
                        ...item,
                        [`bimestre${a}`]: calificacion_table,
                      };
                    }
                    return item;
                  });
                  if (!datosIngles.find((item) => item.numero === materiaKey)) {
                    datosIngles.push({
                      numero: materiaKey,
                      descripcion: val.descripcion,
                      [`bimestre${a}`]: calificacion_table,
                    });
                  }
                }
              } else {
                let filtroCalificacion = [];
                filtroCalificacion = calificaciones.filter(
                  (calificacion) =>
                    calificacion.grupo === data.grupo_nombre &&
                    calificacion.alumno === data.alumno &&
                    calificacion.materia === materiaKey &&
                    calificacion.bimestre <= a
                );
                let cali = filtroCalificacion[0].calificacion;
                if (!cali) {
                  calificacion_table = formatNumberDecimalOne(0);
                } else {
                  calificacion_table = formatNumberDecimalOne(cali);
                }
                materiasMap[materiaKey][`bimestre${a}`] = calificacion_table;
                if (val.area === 2) {
                  datosEspañolAr2 = datosEspañolAr2.map((item) => {
                    if (item.numero === materiaKey) {
                      return {
                        ...item,
                        [`bimestre${a}`]: calificacion_table,
                      };
                    }
                    return item;
                  });
                  if (
                    !datosEspañolAr2.find((item) => item.numero === materiaKey)
                  ) {
                    datosEspañolAr2.push({
                      numero: materiaKey,
                      descripcion: val.descripcion,
                      [`bimestre${a}`]: calificacion_table,
                    });
                  }
                } else if (val.area === 3) {
                  datosEspañolAr3 = datosEspañolAr3.map((item) => {
                    if (item.numero === materiaKey) {
                      return {
                        ...item,
                        [`bimestre${a}`]: calificacion_table,
                      };
                    }
                    return item;
                  });
                  if (
                    !datosEspañolAr3.find((item) => item.numero === materiaKey)
                  ) {
                    datosEspañolAr3.push({
                      numero: materiaKey,
                      descripcion: val.descripcion,
                      [`bimestre${a}`]: calificacion_table,
                    });
                  }
                } else if (val.area === 5) {
                  datosInglesAr5 = datosInglesAr5.map((item) => {
                    if (item.numero === materiaKey) {
                      return {
                        ...item,
                        [`bimestre${a}`]: calificacion_table,
                      };
                    }
                    return item;
                  });
                  if (
                    !datosInglesAr5.find((item) => item.numero === materiaKey)
                  ) {
                    datosInglesAr5.push({
                      numero: materiaKey,
                      descripcion: val.descripcion,
                      [`bimestre${a}`]: calificacion_table,
                    });
                  }
                }
              }
            } catch (error) {}
          });
        }
      }
      desplegarPromedioLugar(
        datosEspañol,
        "Español",
        datosEspañolAr2,
        datosEspañolAr3,
        [],
        false,
        ""
      );
      desplegarPromedioLugar(
        datosIngles,
        "Ingles",
        [],
        [],
        datosInglesAr5,
        false,
        ""
      );
    }
    setisLoadingFind(false);
  });

  const home = () => {
    router.push("/");
  };

  const handleVerClick = async () => {
    setAnimateLoading(true);
    cerrarModalVista();
    if (alumno.numero === undefined || grupo.numero === undefined) {
      showSwal(
        "Oppss!",
        "Para imprimir, mínimo debe estar seleccionado un Alumno o un Grupo",
        "error"
      );
      setTimeout(() => {
        setPdfPreview(false);
        setPdfData("");
        setAnimateLoading(false);
        document.getElementById("modalVPBoletas3").close();
      }, 500);
    } else {
      let configuracion = {
        Encabezado: {
          Nombre_Aplicacion: "Sistema de Control Escolar",
          Nombre_Reporte: "Boletas por Trimestre",
          Nombre_Usuario: `Usuario: ${session.user.name}`,
        },
      };
      let header = [];
      if (asignacion === "asig_español") {
        configuracion = { ...configuracion, body: promediosEspañol };
        header = [
          "ASIGNATURAS",
          "1ER TRIMESTRE",
          "2DO TRIMESTRE",
          "3ER TRIMESTRE",
          "PROMEDIO FINAL",
        ];
      } else {
        configuracion = { ...configuracion, body: promediosIngles };
        header = [
          "SUBJECTS",
          "1ST TRIMESTER",
          "2ND TRIMESTER",
          "3RD TRIMESTER",
          "FINAL AVERAGE",
        ];
      }
      const newPDF = new ReportePDF(configuracion, "Landscape");
      const { body } = configuracion;
      const Enca1 = (doc) => {
        if (!doc.tiene_encabezado) {
          doc.imprimeEncabezadoPrincipalV();
          doc.nextRow(12);
          doc.nextRow(4);
          doc.ImpPosX(
            "AV.SANTA ANA N° 368 COL. SAN FRANCISCO CULCHUACÁN C.P. 04420",
            100,
            doc.tw_ren,
            0,
            "L"
          );
          doc.nextRow(4);
          doc.ImpPosX(
            "ACUERDO N° 09980051 DEL  13 AGOSTO DE 1998",
            115,
            doc.tw_ren,
            0,
            "L"
          );
          doc.nextRow(4);
          doc.ImpPosX("CLAVE 51-2636-510-32-PX-014", 130, doc.tw_ren, 0, "L");
          doc.nextRow(4);
          doc.ImpPosX("CCT 09PPR1204U", 140, doc.tw_ren, 0, "L");
          doc.nextRow(4);
          if (boleta_kinder) {
            doc.ImpPosX("JARDIN DE NIÑOS", 140, doc.tw_ren, 0, "L");
            doc.nextRow(4);
          }
          doc.ImpPosX(`${ciclo_fechas || ""}`, 147, doc.tw_ren, 0, "L");
          doc.nextRow(4);
          doc.ImpPosX(
            "El acercamiento al colegio será una forma para asegurar el éxito del alumno",
            100,
            newPDF.tw_ren,
            0,
            "L"
          );
          doc.nextRow(4);
          doc.printLineH();
          doc.tiene_encabezado = true;
        } else {
          doc.nextRow(6);
          doc.tiene_encabezado = true;
        }
      };
      Enca1(newPDF);
      newPDF.nextRow(10);
      newPDF.ImpPosX(
        `ALUMNO: ${alumno.nombre || ""}`,
        15,
        newPDF.tw_ren,
        0,
        "L"
      );
      newPDF.nextRow(4);
      newPDF.ImpPosX(
        `GRUPO: ${grupo.horario || ""}`,
        15,
        newPDF.tw_ren,
        0,
        "L"
      );
      newPDF.nextRow(4);
      if (asignacion === "asig_español") {
        newPDF.ImpPosX(`ESPAÑOL`, 150, newPDF.tw_ren, 0, "L");
      } else {
        newPDF.ImpPosX(`INGLES`, 150, newPDF.tw_ren, 0, "L");
      }
      newPDF.nextRow(4);
      const data = body.map((boleta) => [
        boleta.descripcion.toString(),
        { content: boleta.bimestre1.toString(), styles: { halign: "right" } },
        {
          content: boleta.bimestre2?.toString() ?? "",
          styles: { halign: "right" },
        },
        {
          content: boleta.bimestre3?.toString() ?? "",
          styles: { halign: "right" },
        },
        {
          content: boleta.promedio?.toString() ?? "",
          styles: { halign: "right" },
        },
      ]);
      newPDF.generateTable(header, data);
      newPDF.nextRow(50);
      newPDF.printLineZ();
      newPDF.nextRow(6);
      newPDF.ImpPosX(
        "NOMBRE Y FIRMA DEL PADRE O TUTOR",
        200,
        newPDF.tw_ren,
        0,
        "L"
      );
      setTimeout(() => {
        const pdfData = newPDF.doc.output("datauristring");
        setPdfData(pdfData);
        setPdfPreview(true);
        showModalVista(true);
        setAnimateLoading(false);
      }, 500);
    }
  };

  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVPBoletas3").showModal()
      : document.getElementById("modalVPBoletas3").close();
  };

  const cerrarModalVista = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVPBoletas3").close();
  };

  const ImprimePDF = async () => {
    let configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Relación General de Alumnos",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
    };
    let header = [];
    if (asignacion === "asig_español") {
      header = [
        "ASIGNATURAS",
        "1ER TRIMESTRE",
        "2DO TRIMESTRE",
        "3ER TRIMESTRE",
        "PROMEDIO FINAL",
      ];
      configuracion = {
        ...configuracion,
        body: promediosEspañol,
        alumno: alumno.nombre,
        grupo: grupo.horario,
        asignacion: asignacion,
        header: header,
        ciclo_fechas: ciclo_fechas,
        boleta_kinder: boleta_kinder,
      };
    } else {
      header = [
        "SUBJECTS",
        "1ST TRIMESTER",
        "2ND TRIMESTER",
        "3RD TRIMESTER",
        "FINAL AVERAGE",
      ];
      configuracion = {
        ...configuracion,
        body: promediosIngles,
        alumno: alumno.nombre,
        grupo: grupo.horario,
        asignacion: asignacion,
        header: header,
        ciclo_fechas: ciclo_fechas,
        boleta_kinder: boleta_kinder,
      };
    }
    ImprimirPDF(configuracion);
  };

  const BoletasGrupoImprimir = handleSubmit(async (data) => {
    const confirmed = await confirmSwal(
      "¿Desea Continuar?",
      "Esto iniciará la impresión y descarga de todas las boletas de los alumnos.",
      "warning",
      "Aceptar",
      "Cancelar"
    );
    if (!confirmed) {
      return;
    }
    setisLoadingImprime(true);
    const alumnos = await getAlumnos(session.user.token, false);
    const arrayEspañol = lugaresEspañol;
    const arrayIngles = lugaresIngles;
    if (asignacion === "asig_español") {
      for (const item of arrayEspañol) {
        const estudiante = alumnos.filter((al) => al.numero === item.numero);
        await BuscarImprimirGrupos(
          item.numero,
          estudiante[0]?.nombre ?? "",
          data,
          "Español",
          item.lugar
        );
      }
    } else {
      for (const item of arrayIngles) {
        const estudiante = alumnos.filter((al) => al.numero === item.numero);
        await BuscarImprimirGrupos(
          item.numero,
          estudiante[0]?.nombre ?? "",
          data,
          "Ingles",
          item.lugar
        );
      }
    }
    setisLoadingImprime(false);
  });

  const BuscarImprimirGrupos = async (numero, nombre, data, tipo, lugar) => {
    const { token } = session.user;
    let datosEspañol = [];
    let datosIngles = [];
    let datosEspañolAr2 = [];
    let datosEspañolAr3 = [];
    let datosInglesAr5 = [];

    if (!grupo.numero) {
      showSwal("Error", "Debe seleccionar un grupo.", "error");
      setisLoadingImprime(false);
      return;
    }
    if (!numero) {
      showSwal("Error", "Debe seleccionar un alumno.", "error");
      setisLoadingImprime(false);
      return;
    }
    if (data.bimestre > 3) {
      data.bimestre = 3;
      setValue("bimestre", data.bimestre);
    }
    if (data.bimestre <= 0) {
      showSwal("Error", "El trimestre debe de ser entre 1 y 3.", "error");
      setisLoadingImprime(false);
      return;
    }

    setPromediosEspañol([]);
    setPromediosIngles([]);
    setPromediosEspañolAr2([]);
    setPromediosEspañolAr3([]);
    setPromediosInglesAr5([]);
    setisLoadingImprime(true);

    data.alumno = numero;
    data.nombre_alumno = nombre;
    data.grupo = grupo.numero;
    data.grupo_nombre = grupo.horario;

    const datos = await getBoletas3(token, grupo.numero);

    const clases = datos.clases ?? [];
    const materias = datos.materias ?? [];
    const calificaciones = datos.calificaciones ?? [];
    const actividades = datos.actividades ?? [];

    if (
      !clases.length ||
      !materias.length ||
      !calificaciones.length ||
      !actividades.length
    ) {
      setisLoadingImprime(false);
      showSwal(
        "Error",
        "No se encontraron datos para calcular las calificaciones.",
        "error"
      );
      return;
    }

    if (clases.length > 0) {
      const materiasMap = {};
      for (let a = 1; a <= data.bimestre; a++) {
        for (let i = 0; i < clases.length; i++) {
          clases.map(function (val) {
            let calificacion_table = 0;
            try {
              const materiaKey = val.numero;
              if (!materiasMap[materiaKey]) {
                materiasMap[materiaKey] = {
                  numero: materiaKey,
                  descripcion: val.descripcion,
                  bimestre1: 0,
                  bimestre2: 0,
                  bimestre3: 0,
                };
              }
              if (val.area === 1 || val.area === 4) {
                const filtroMateria = materias.filter(
                  (materia) => materia.numero === materiaKey
                );
                if (filtroMateria[0].actividad === "No") {
                  evaluacion = materias.filter(
                    (materia) => materia.numero === filtroMateria.numero
                  );
                  const datosDG3 = calificaciones.filter(
                    (calificacion) =>
                      calificacion.bimestre === a &&
                      calificacion.alumno === data.alumno &&
                      calificacion.actividad === 0 &&
                      calificacion.materia === materiaKey &&
                      calificacion.unidad <= evaluacion
                  );
                  let sumaCalificaciones = datosDG3.reduce(
                    (total, calificacion) => {
                      return total + parseFloat(calificacion.calificacion);
                    },
                    0
                  );
                  if (!sumaCalificaciones) {
                    calificacion_table =
                      formatNumberDecimalOne(sumaCalificaciones);
                  } else {
                    calificacion_table = formatNumberDecimalOne(0);
                  }
                } else if (filtroMateria[0].actividad === "Si") {
                  const calificacion = calificaciones.filter(
                    (calificacion) => calificacion.grupo === data.grupo_nombre
                  );
                  const actividad = actividades
                    .filter((actividad) => actividad.materia === materiaKey)
                    .sort((a, b) => a.secuencia - b.secuencia);
                  let sumatoria = 0;
                  let evaluaciones = 0;
                  actividad.forEach((act) => {
                    const EB = `EB${a}`;
                    const filtroActividad = calificacion.filter(
                      (calificacion) =>
                        calificacion.alumno === data.alumno &&
                        calificacion.materia === materiaKey &&
                        calificacion.bimestre === a &&
                        calificacion.actividad === act.secuencia &&
                        calificacion.unidad <= act[EB]
                    );
                    const cpa = filtroActividad.reduce(
                      (total, calificacion) => {
                        return total + parseFloat(calificacion.calificacion);
                      },
                      0
                    );
                    if (cpa > 0) {
                      const rauw = act[EB];
                      sumatoria += parseFloat(cpa / rauw);
                      evaluaciones += 1;
                    }
                  });
                  if (sumatoria === 0 || evaluaciones === 0) {
                    calificacion_table = formatNumberDecimalOne(0);
                  } else {
                    let calificacion_total = parseFloat(
                      sumatoria / evaluaciones
                    );
                    if (calificacion_total < 5.0) {
                      calificacion_table = formatNumberDecimalOne(0);
                    } else {
                      calificacion_table =
                        formatNumberDecimalOne(calificacion_total);
                    }
                  }
                }
                materiasMap[materiaKey][`bimestre${a}`] = calificacion_table;
                if (val.area === 1) {
                  datosEspañol = datosEspañol.map((item) => {
                    if (item.numero === materiaKey) {
                      return {
                        ...item,
                        [`bimestre${a}`]: calificacion_table,
                      };
                    }
                    return item;
                  });
                  if (
                    !datosEspañol.find((item) => item.numero === materiaKey)
                  ) {
                    datosEspañol.push({
                      numero: materiaKey,
                      descripcion: val.descripcion,
                      [`bimestre${a}`]: calificacion_table,
                    });
                  }
                } else if (val.area === 4) {
                  datosIngles = datosIngles.map((item) => {
                    if (item.numero === materiaKey) {
                      return {
                        ...item,
                        [`bimestre${a}`]: calificacion_table,
                      };
                    }
                    return item;
                  });
                  if (!datosIngles.find((item) => item.numero === materiaKey)) {
                    datosIngles.push({
                      numero: materiaKey,
                      descripcion: val.descripcion,
                      [`bimestre${a}`]: calificacion_table,
                    });
                  }
                }
              } else {
                let filtroCalificacion = [];
                filtroCalificacion = calificaciones.filter(
                  (calificacion) =>
                    calificacion.grupo === data.grupo_nombre &&
                    calificacion.alumno === data.alumno &&
                    calificacion.materia === materiaKey &&
                    calificacion.bimestre <= a
                );
                let cali = filtroCalificacion[0].calificacion;
                if (!cali) {
                  calificacion_table = formatNumberDecimalOne(0);
                } else {
                  calificacion_table = formatNumberDecimalOne(cali);
                }
                materiasMap[materiaKey][`bimestre${a}`] = calificacion_table;
                if (val.area === 2) {
                  datosEspañolAr2 = datosEspañolAr2.map((item) => {
                    if (item.numero === materiaKey) {
                      return {
                        ...item,
                        [`bimestre${a}`]: calificacion_table,
                      };
                    }
                    return item;
                  });
                  if (
                    !datosEspañolAr2.find((item) => item.numero === materiaKey)
                  ) {
                    datosEspañolAr2.push({
                      numero: materiaKey,
                      descripcion: val.descripcion,
                      [`bimestre${a}`]: calificacion_table,
                    });
                  }
                } else if (val.area === 3) {
                  datosEspañolAr3 = datosEspañolAr3.map((item) => {
                    if (item.numero === materiaKey) {
                      return {
                        ...item,
                        [`bimestre${a}`]: calificacion_table,
                      };
                    }
                    return item;
                  });
                  if (
                    !datosEspañolAr3.find((item) => item.numero === materiaKey)
                  ) {
                    datosEspañolAr3.push({
                      numero: materiaKey,
                      descripcion: val.descripcion,
                      [`bimestre${a}`]: calificacion_table,
                    });
                  }
                } else if (val.area === 5) {
                  datosInglesAr5 = datosInglesAr5.map((item) => {
                    if (item.numero === materiaKey) {
                      return {
                        ...item,
                        [`bimestre${a}`]: calificacion_table,
                      };
                    }
                    return item;
                  });
                  if (
                    !datosInglesAr5.find((item) => item.numero === materiaKey)
                  ) {
                    datosInglesAr5.push({
                      numero: materiaKey,
                      descripcion: val.descripcion,
                      [`bimestre${a}`]: calificacion_table,
                    });
                  }
                }
              }
            } catch (error) {}
          });
        }
      }
      if (tipo === "Español") {
        datosEspañol = desplegarPromedioLugar(
          datosEspañol,
          "Español",
          datosEspañolAr2,
          datosEspañolAr3,
          [],
          true,
          lugar
        );
      } else {
        datosIngles = desplegarPromedioLugar(
          datosIngles,
          "Ingles",
          [],
          [],
          datosInglesAr5,
          true,
          lugar
        );
      }
      let configuracion = {
        Encabezado: {
          Nombre_Aplicacion: "Sistema de Control Escolar",
          Nombre_Reporte: "Reporte Relación General de Alumnos",
          Nombre_Usuario: `Usuario: ${session.user.name}`,
        },
      };
      let header = [];
      if (tipo === "Español") {
        header = [
          "ASIGNATURAS",
          "1ER TRIMESTRE",
          "2DO TRIMESTRE",
          "3ER TRIMESTRE",
          "PROMEDIO FINAL",
        ];
        configuracion = {
          ...configuracion,
          body: datosEspañol,
          alumno: data.nombre_alumno,
          grupo: data.grupo_nombre,
          asignacion: "asig_español",
          header: header,
          ciclo_fechas: ciclo_fechas,
          boleta_kinder: boleta_kinder,
        };
      } else {
        header = [
          "SUBJECTS",
          "1ST TRIMESTER",
          "2ND TRIMESTER",
          "3RD TRIMESTER",
          "FINAL AVERAGE",
        ];
        configuracion = {
          ...configuracion,
          body: datosIngles,
          alumno: data.nombre_alumno,
          grupo: data.grupo_nombre,
          asignacion: "asig_ingles",
          header: header,
          ciclo_fechas: ciclo_fechas,
          boleta_kinder: boleta_kinder,
        };
      }
      ImprimirPDF(configuracion);
    }
    setisLoadingImprime(false);
  };

  if (status === "loading") {
    return (
      <div className="container skeleton w-full max-w-screen-xl shadow-xl rounded-xl"></div>
    );
  }
  return (
    <>
      <ModalVistaPreviaBoleta3
        pdfPreview={pdfPreview}
        pdfData={pdfData}
        PDF={ImprimePDF}
      />

      <div className="container h-[80vh] w-full max-w-screen-xl bg-base-200 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y">
        <div className="flex flex-col justify-start p-3">
          <div className="flex flex-wrap md:flex-nowrap items-start md:items-center">
            <div className="order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0">
              <Acciones
                home={home}
                Buscar={Buscar}
                Ver={handleVerClick}
                BoletasGrupo={BoletasGrupoImprimir}
                isLoadingFind={isLoadingFind}
                isLoadingPDF={animateLoading}
                isLoadingImprime={isLoadingImprime}
                permiso_imprime={permissions.impresion}
              />
            </div>
            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
              Creación de Boletas.
            </h1>
          </div>
        </div>

        <div className="flex flex-col items-center h-full">
          <div className="w-full max-w-4xl">
            <div className="w-full">
              <Inputs
                dataType={"int"}
                name={"bimestre"}
                tamañolabel={"w-1/2"}
                className={"w-full text-right "}
                Titulo={"Bimestre: "}
                type={"text"}
                requerido={true}
                errors={errors}
                register={register}
                message={"Bimestre Requerido"}
                isDisabled={false}
                maxLenght={9}
              />
            </div>
            <div className="flex flex-col md:flex-row lg:flex-row ">
              <div className="w-auto">
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
                    contdef: "200px",
                    first: "70px",
                    second: "200px",
                  }}
                />
              </div>
              <div className="pl-2">
                <BuscarCat
                  table="alumnogrupo"
                  itemData={[]}
                  fieldsToShow={["numero", "nombre"]}
                  nameInput={["TB_Numero", "TB_Nombre"]}
                  titulo={"Alumnos: "}
                  setItem={setAlumno}
                  token={session.user.token}
                  modalId="modal_alumno1"
                  alignRight={"text-right"}
                  inputWidths={{
                    contdef: "200px",
                    first: "70px",
                    second: "200px",
                  }}
                  idBusqueda={grupo.numero}
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row lg:flex-row pb-4">
              <div className="w-full">
                <Inputs
                  dataType={"int"}
                  name={"ciclo"}
                  tamañolabel={"w-2/3"}
                  className={"fyo8m-select p-1.5 grow bg-[#ffffff] "}
                  Titulo={"Ciclo: "}
                  type={"select"}
                  requerido={false}
                  errors={errors}
                  register={register}
                  message={"Ciclo Requerido"}
                  isDisabled={false}
                  maxLenght={10}
                  arreglos={ciclo}
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row lg:flex-row ">
              <div className="w-[59%]">
                <Inputs
                  // Titulo={"Selecciona tu opción"}
                  name={"opcion"}
                  type={"radio"}
                  requerido={true}
                  message={"Debes seleccionar una opción"}
                  errors={errors}
                  register={register}
                  options={[
                    { value: "asig_ingles", label: "Asig. Inglés" },
                    { value: "asig_español", label: "Asig. Español" },
                  ]}
                />
              </div>
              <div className="w-[59%]">
                <Inputs
                  Titulo={"Imprime promedio"}
                  name={"imprime_promedio"}
                  type={"checkbox"}
                  requerido={false}
                  message={"Debes aceptar los términos"}
                  errors={errors}
                  register={register}
                />
              </div>
              <div className="w-[62%]">
                <Inputs
                  Titulo={"Calificación por Letra"}
                  name={"calificacion_letra"}
                  type={"checkbox"}
                  requerido={false}
                  message={"Debes aceptar los Términos"}
                  errors={errors}
                  register={register}
                />
              </div>
              <div className="w-[59%]">
                <Inputs
                  Titulo={"Orden Alfabetico"}
                  name={"orden_alfabetico"}
                  type={"checkbox"}
                  requerido={false}
                  message={"Debes aceptar los términos"}
                  errors={errors}
                  register={register}
                />
              </div>
              <div className="w-[59%]">
                <Inputs
                  Titulo={"Boleta Kinder"}
                  name={"boleta_kinder"}
                  type={"checkbox"}
                  requerido={false}
                  message={"Debes aceptar los términos"}
                  errors={errors}
                  register={register}
                />
              </div>
            </div>

            <div className="flex flex-row items-center w-full">
              <div className="w-full flex">
                <div className="w-1/2 p-2">
                  <TablaPromedioEspañol
                    session={session}
                    isLoading={isLoading}
                    promediosEsFiltrados={promediosEspañol}
                    promediosEspañolAr2={promediosEspañolAr2}
                    promediosEspañolAr3={promediosEspañolAr3}
                  />
                </div>
                <div className="w-1/2 p-2">
                  <TablaPromedioIngles
                    session={session}
                    isLoading={isLoading}
                    promediosEsFiltrados={promediosIngles}
                    promediosInglesAr5={promediosInglesAr5}
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

export default CreacionBoletas3Bimestre;
