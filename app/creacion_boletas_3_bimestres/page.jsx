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
    getActividadMateria,
    getEvaluacionMateria,
    getAreasOtros,
    getAreas,
    getDatosPorGrupo,
} from "@/app/utils/api/boletas/boletas";
import { setGlobalVariable, globalVariables, loadGlobalVariables, formatNumberDecimalOne } from "@/app/utils/globalfn";
import TablaPromedioIngles from "@/app/creacion_boletas_3_bimestres/components/tablaPromedioIngles";
function CreacionBoletas3Bimestre() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [isLoading, setisLoading] = useState(false);
    const [isLoadingFind, setisLoadingFind] = useState(false);
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
    // const [promediosEs, setPromediosEs] = useState([]);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            bimestre: 1
        },
    });
    let bimestre = watch('bimestre');
    const imprimePromedio = watch('imprime_promedio');
    const calificacionLetra = watch('calificacion_letra');

    useEffect(() => {
        if (status === "loading" || !session) {
            return;
        }
        const fetchData = async () => {
            let newCombo = [];
            for (let i = 2050; i >= 1970; i--) {
                const fechasRango = `${i}-${i + 1}`;
                newCombo.push({
                    id: fechasRango, descripcion: fechasRango
                })
            }
            setCiclo(newCombo);
        };
        fetchData();
    }, [session, status]);

    useEffect(() => {
        if (status === "loading" || !session) {
            return;
        }
        const fetchData = async () => {
            let x;
            const datos = await getDatosPorGrupo(session.user.token, grupo.numero, grupo.horario);
            console.log(datos);
            if (!datos) { return; }
            // const alumnos = datos.alumnos;
            let alumnos = datos.alumnos.map(alumno => {
                return {
                    ...alumno,
                    1: '',
                    2: '',
                    3: '',
                    6: ''
                };
            });
            const calificaciones = datos.calificaciones;
            const actividades = datos.actividades;
            const materias = datos.materias;
            for (let b = 1; b <= 3; b++) {
                alumnos.map((alumno, falum) => {
                    let caliMateria = 0;
                    materias.map((materia, fmateria) => {
                        let sumatoria = 0;
                        let evaluaciones = 0;

                        if (materia.actividad === 'No') {
                            evaluaciones = materia.evaluaciones;
                            const filtroCalificaciones = calificaciones.filter(calificacion =>
                                calificacion.bimestre === b &&
                                calificacion.alumno === alumno.numero &&
                                calificacion.actividad === 0 &&
                                calificacion.materia === materia.materia &&
                                calificacion.unidad <= evaluaciones
                            );

                            sumatoria = filtroCalificaciones.reduce((acc, calificacion) => acc + calificacion.calificacion, 0);
                            const promedio = sumatoria / evaluaciones;
                            caliMateria += parseFloat(formatNumberDecimalOne(promedio));
                        } else if (materia.actividad === 'Si') {
                            const tablas = actividades.filter(actividad => actividad.materia === materia.materia);
                            if (tablas.length > 0) {
                                for (let i = 0; i < tablas.length; i++) {
                                    const filtroCalificaciones = calificaciones.filter(calificacion =>
                                        calificacion.alumno === alumno.numero &&
                                        calificacion.materia === materia.materia &&
                                        calificacion.bimestre === b &&
                                        calificacion.actividad === tablas[i].secuencia &&
                                        calificacion.unidad <= tablas[i]["EB" + b]
                                    );
                                    const cpa = filtroCalificaciones.reduce((acc, calificacion) => acc + calificacion.calificacion, 0);
                                    const ebValue = tablas[i]["EB" + b] || 1;
                                    sumatoria += cpa / ebValue;
                                }
                                evaluaciones = tablas.length;
                                const promedio = sumatoria / evaluaciones;
                                caliMateria += parseFloat(formatNumberDecimalOne(promedio));
                            }
                        }
                    });

                    if (materias.length > 0) {
                        alumnos[falum] = {
                            ...alumnos[falum],
                            [b]: formatNumberDecimalOne(caliMateria / materias.length)
                        };
                    } else {
                        alumnos[falum] = {
                            ...alumnos[falum],
                            [b]: 0
                        };
                    }
                });
            }
            console.log('españolllllllllll aaaaaaaaaaaaaaaaaaaaaaaaaa', alumnos);
        };
        fetchData();
    }, [grupo.numero]);

    // useEffect(() => {
    //     desplegarPromedioLugar();
    // }, [promediosEspañol, promediosIngles]);

    const desplegarPromedioLugar = (newPromedio, tipo, newEspañolAr2, newEspañolmAr3, newInglesAr5) => {
        let newDataEspañol = [];
        let newDataIngles = [];
        if (tipo === 'Español') {
            newDataEspañol = [
                { numero: "", descripcion: "LUGAR", bimestre1: "", bimestre2: "", bimestre3: "", promedio: "" },
                { numero: "", descripcion: "PROMEDIO", bimestre1: "", bimestre2: "", bimestre3: "", promedio: "" }
            ];
        } else {
            newDataIngles = [
                { numero: "", descripcion: "PLACE", bimestre1: "", bimestre2: "", bimestre3: "", promedio: "" },
                { numero: "", descripcion: "AVERAGE", bimestre1: "", bimestre2: "", bimestre3: "", promedio: "" }
            ];
        }
        if (newPromedio.length > 0) {
            for (let i = 1; i <= bimestre; i++) {
                let promedio = calcularBimestresColumna(newPromedio, i);
                // console.log(promedio);
                if (promedio < 5.0) { promedio = 5.0; }
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
                    if (tipo === 'Español') {
                        newDataEspañol[1].bimestre1 = formattedValue;
                    } else {
                        newDataIngles[1].bimestre1 = formattedValue;
                    }
                } else if (i === 2) {
                    if (tipo === 'Español') {
                        newDataEspañol[1].bimestre2 = formattedValue;
                    } else {
                        newDataIngles[1].bimestre2 = formattedValue;
                    }
                } else if (i === 3) {
                    if (tipo === 'Español') {
                        newDataEspañol[1].bimestre3 = formattedValue;
                    } else {
                        newDataIngles[1].bimestre3 = formattedValue;
                    }
                }
                if (imprimePromedio) {
                    let prom;
                    let promedio = 0.0;
                    newPromedio = newPromedio.map((item) => {
                        prom = 0;
                        promedio = 0;
                        for (let i = 1; i <= bimestre; i++) {
                            const bimestreFiltrado = `bimestre${i}`
                            prom += parseFloat(item[bimestreFiltrado])
                        }
                        promedio = (prom / parseInt(bimestre))
                        promedio = truncarUno(promedio);
                        // console.log(promedio);
                        if (promedio < 5.0) { promedio = 5.0; }
                        console.log('promedio convertido', promedio)
                        if (calificacionLetra) { promedio = conversionALetra(promedio, tipo); }
                        return { ...item, promedio: promedio };
                    });
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
                if (tipo === 'Español') {
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

            if (tipo === 'Español') {
                setPromediosEspañol(newPromedio);
                setPromediosEspañol(prev => [...prev, ...newDataEspañol]);
                setPromediosEspañol(prev => [...prev, ...newEspañolAr2]);
                setPromediosEspañol(prev => [...prev, ...newEspañolmAr3]);
            } else {
                setPromediosIngles(newPromedio);
                setPromediosIngles(prev => [...prev, ...newDataIngles]);
                setPromediosIngles(prev => [...prev, ...newInglesAr5]);
            }
        }
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

    // const calcularBimestresFila = (promedios, bim) => {
    //     if (promedios.length === 0) return 0;
    //     let suma = 0;

    //     promedios.forEach((item) => {
    //         const bimestreKey = `bimestre${bim}`;
    //         if (item[bimestreKey] && !isNaN(item[bimestreKey])) {
    //             suma += parseFloat(item[bimestreKey]);
    //         }
    //     });

    //     const promedio = suma / promedios.length;
    //     return promedio;
    // };

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

        if (!grupo) {
            showSwal('Error', 'Debe seleccionar un grupo.', 'error');
            return;
        }
        if (!alumno) {
            showSwal('Error', 'Debe seleccionar un alumno.', 'error');
            return;
        }
        if (data.bimestre > 3) {
            data.bimestre = 3;
        }

        // Reiniciar los promedios antes de buscar
        setPromediosEspañol([]);
        setPromediosIngles([]);
        setPromediosEspañolAr2([]);
        setPromediosEspañolAr3([]);
        setPromediosInglesAr5([]);
        setisLoadingFind(true);

        const datosDG1 = await getBoletas3(token, grupo.numero);
        data.alumno = alumno.numero;
        data.nombre_alumno = alumno.nombre;
        data.grupo = grupo.numero;
        data.grupo_nombre = grupo.horario;

        if (datosDG1.length > 0) {
            const rango = 5;
            const materiasMap = {};

            for (let a = 1; a <= data.bimestre; a++) {
                for (let i = 0; i < datosDG1.length; i += rango) {
                    const batch = datosDG1.slice(i, i + rango);
                    const promises = batch.map(async (val) => {
                        try {
                            const materiaKey = val.numero;
                            if (!materiasMap[materiaKey]) {
                                materiasMap[materiaKey] = {
                                    numero: materiaKey,
                                    descripcion: val.descripcion,
                                    bimestre1: 0,
                                    bimestre2: 0,
                                    bimestre3: 0
                                };
                            }
                            let calificacion;
                            if (val.area === 1 || val.area === 4) {
                                const datosDG2 = await getActividadMateria(token, materiaKey);
                                if (datosDG2[0].actividad === 'No') {
                                    const datosDG3 = await getEvaluacionMateria(token, {
                                        ...data,
                                        bimestre: a
                                    }, materiaKey, val.descripcion);
                                    calificacion = formatNumberDecimalOne(datosDG3.calificacion);
                                } else {
                                    const datosDG3 = await getAreas(token, {
                                        ...data,
                                        bimestre: a
                                    }, materiaKey);
                                    calificacion = formatNumberDecimalOne(datosDG3.calificacion);
                                }

                                materiasMap[materiaKey][`bimestre${a}`] = calificacion;
                                if (val.area === 1) {
                                    datosEspañol = datosEspañol.map(item => {
                                        if (item.numero === materiaKey) {
                                            return {
                                                ...item,
                                                [`bimestre${a}`]: calificacion
                                            };
                                        }
                                        return item;
                                    });
                                    if (!datosEspañol.find(item => item.numero === materiaKey)) {
                                        datosEspañol.push({
                                            numero: materiaKey,
                                            descripcion: val.descripcion,
                                            [`bimestre${a}`]: calificacion
                                        });
                                    }
                                    // setPromediosEspañol(prev => {
                                    //     const existingIndex = prev.findIndex(item => item.numero === materiaKey);
                                    //     if (existingIndex >= 0) {
                                    //         const updated = [...prev];
                                    //         updated[existingIndex][`bimestre${a}`] = calificacion;
                                    //         return updated;
                                    //     } else {
                                    //         return [
                                    //             ...prev,
                                    //             { numero: materiaKey, descripcion: val.descripcion, [`bimestre${a}`]: calificacion }
                                    //         ];
                                    //     }
                                    // });
                                } else if (val.area === 4) {
                                    datosIngles = datosIngles.map(item => {
                                        if (item.numero === materiaKey) {
                                            return {
                                                ...item,
                                                [`bimestre${a}`]: calificacion
                                            };
                                        }
                                        return item;
                                    });
                                    if (!datosIngles.find(item => item.numero === materiaKey)) {
                                        datosIngles.push({
                                            numero: materiaKey,
                                            descripcion: val.descripcion,
                                            [`bimestre${a}`]: calificacion
                                        });
                                    }
                                    // setPromediosIngles(prev => {
                                    //     const existingIndex = prev.findIndex(item => item.numero === materiaKey);
                                    //     if (existingIndex >= 0) {
                                    //         const updated = [...prev];
                                    //         updated[existingIndex][`bimestre${a}`] = calificacion;
                                    //         return updated;
                                    //     } else {
                                    //         return [
                                    //             ...prev,
                                    //             { numero: materiaKey, descripcion: val.descripcion, [`bimestre${a}`]: calificacion }
                                    //         ];
                                    //     }
                                    // });
                                }
                            } else {
                                const datosDG3 = await getAreasOtros(token, {
                                    ...data,
                                    bimestre: a
                                }, materiaKey);
                                calificacion = formatNumberDecimalOne(datosDG3.calificacion);
                                materiasMap[materiaKey][`bimestre${a}`] = calificacion;
                                if (val.area === 2) {
                                    datosEspañolAr2 = datosEspañolAr2.map(item => {
                                        if (item.numero === materiaKey) {
                                            return {
                                                ...item,
                                                [`bimestre${a}`]: calificacion
                                            };
                                        }
                                        return item;
                                    });
                                    if (!datosEspañolAr2.find(item => item.numero === materiaKey)) {
                                        datosEspañolAr2.push({
                                            numero: materiaKey,
                                            descripcion: val.descripcion,
                                            [`bimestre${a}`]: calificacion
                                        });
                                    }
                                    // setPromediosEspañolAr2(prev => {
                                    //     const existingIndex = prev.findIndex(item => item.numero === materiaKey);
                                    //     if (existingIndex >= 0) {
                                    //         const updated = [...prev];
                                    //         updated[existingIndex][`bimestre${a}`] = calificacion;
                                    //         return updated;
                                    //     } else {
                                    //         return [
                                    //             ...prev,
                                    //             { numero: materiaKey, descripcion: val.descripcion, [`bimestre${a}`]: calificacion }
                                    //         ];
                                    //     }
                                    // });
                                } else if (val.area === 3) {
                                    datosEspañolAr3 = datosEspañolAr3.map(item => {
                                        if (item.numero === materiaKey) {
                                            return {
                                                ...item,
                                                [`bimestre${a}`]: calificacion
                                            };
                                        }
                                        return item;
                                    });
                                    if (!datosEspañolAr3.find(item => item.numero === materiaKey)) {
                                        datosEspañolAr3.push({
                                            numero: materiaKey,
                                            descripcion: val.descripcion,
                                            [`bimestre${a}`]: calificacion
                                        });
                                    }
                                    // setPromediosEspañolAr3(prev => {
                                    //     const existingIndex = prev.findIndex(item => item.numero === materiaKey);
                                    //     if (existingIndex >= 0) {
                                    //         const updated = [...prev];
                                    //         updated[existingIndex][`bimestre${a}`] = calificacion;
                                    //         return updated;
                                    //     } else {
                                    //         return [
                                    //             ...prev,
                                    //             { numero: materiaKey, descripcion: val.descripcion, [`bimestre${a}`]: calificacion }
                                    //         ];
                                    //     }
                                    // });
                                } else if (val.area === 5) {
                                    datosInglesAr5 = datosInglesAr5.map(item => {
                                        if (item.numero === materiaKey) {
                                            return {
                                                ...item,
                                                [`bimestre${a}`]: calificacion
                                            };
                                        }
                                        return item;
                                    });
                                    if (!datosInglesAr5.find(item => item.numero === materiaKey)) {
                                        datosInglesAr5.push({
                                            numero: materiaKey,
                                            descripcion: val.descripcion,
                                            [`bimestre${a}`]: calificacion
                                        });
                                    }
                                    // setPromediosInglesAr5(prev => {
                                    //     const existingIndex = prev.findIndex(item => item.numero === materiaKey);
                                    //     if (existingIndex >= 0) {
                                    //         const updated = [...prev];
                                    //         updated[existingIndex][`bimestre${a}`] = calificacion;
                                    //         return updated;
                                    //     } else {
                                    //         return [
                                    //             ...prev,
                                    //             { numero: materiaKey, descripcion: val.descripcion, [`bimestre${a}`]: calificacion }
                                    //         ];
                                    //     }
                                    // });
                                }
                            }
                        } catch (error) {
                            console.error(error);
                        }
                    });
                    await Promise.all(promises);
                }
            }
        }
        // console.log('DATA ESPAÑOL LET', datosEspañol);
        // console.log('DATA INGLES LET', datosIngles);
        desplegarPromedioLugar(datosEspañol, 'Español', datosEspañolAr2, datosEspañolAr3, []);
        desplegarPromedioLugar(datosIngles, 'Ingles', [], [], datosInglesAr5);
        setisLoadingFind(false);
    });

    const home = () => { router.push("/"); };

    const handleVerClick = () => { }

    if (status === "loading") {
        return (
            <div className="container skeleton w-full max-w-screen-xl shadow-xl rounded-xl"></div>
        );
    }
    return (
        <>
            <div className="h-[83vh] max-h-[83vh] container w-full bg-slate-100 rounded-3xl shadow-xl px-3 dark:bg-slate-700 overflow-y-auto">
                {/* <ModalVistaPreviaCalis
                pdfPreview={pdfPreview}
                pdfData={pdfData}
                PDF={ImprimePDF}
                Excel={ImprimeExcel}
            /> */}

                <div className="flex flex-col justify-start p-3">
                    <div className="flex flex-wrap md:flex-nowrap items-start md:items-center">
                        <div className="order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0 pr-4">
                            <Acciones
                                home={home}
                                Buscar={Buscar}
                                Ver={handleVerClick}
                                isLoadingFind={isLoadingFind}
                            />
                        </div>
                        <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around w-auto">
                            Creación de Boletas.
                        </h1>
                    </div>
                </div>

                <div className="grid grid-cols-8 grid-rows-1 h-[calc(100%-20%)]">
                    <div className="col-span-7">
                        <div className="flex flex-col md:flex-row lg:flex-row pb-4">
                            <div className="w-full">
                                <Inputs
                                    dataType={"int"}
                                    name={"bimestre"}
                                    tamañolabel={"w-1/2"}
                                    className={"w-1/3 text-right"}
                                    Titulo={"Bimestre: "}
                                    type={"text"}
                                    requerido={true}
                                    errors={errors}
                                    register={register}
                                    message={"Bimestre Requerido"}
                                    isDisabled={false}
                                    maxLenght={3}
                                />
                            </div>
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
                                    inputWidths={{ contdef: "200px", first: "70px", second: "200px" }}
                                />
                            </div>
                            <div className="pl-2">
                                <BuscarCat
                                    table="alumnogrupo"
                                    itemData={[]}
                                    fieldsToShow={["numero", "nombre"]}
                                    nameInput={["Numero", "nombre"]}
                                    titulo={"Alumnos: "}
                                    setItem={setAlumno}
                                    token={session.user.token}
                                    modalId="modal_alumno1"
                                    alignRight={"text-right"}
                                    inputWidths={{ contdef: "200px", first: "70px", second: "200px" }}
                                    idBusqueda={grupo.numero}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row lg:flex-row pb-4">
                            <div className="w-full">
                                <Inputs
                                    dataType={"int"}
                                    name={"ciclo"}
                                    tamañolabel={"w-1/2"}
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
                            <div className="w-[54%]">
                                <Inputs
                                    Titulo={"Selecciona tu opción"}
                                    name={"opcion"}
                                    type={"radio"}
                                    requerido={false}
                                    message={"Debes seleccionar una opción"}
                                    errors={errors}
                                    register={register}
                                    options={[
                                        { value: "asig_español", label: "Asig. Español" },
                                        { value: "asig_ingles", label: "Asig. Inglés" },
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
                                // setEvent={setImprimePromedio}
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
                                // setEvent={setCalificacionLetra}
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
                                // setEvent={setCalificacionLetra}
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
                                // setEvent={setCalificacionLetra}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col items-center h-full">
                            <div className="w-full max-w-4xl">
                                <TablaPromedioEspañol
                                    isLoading={isLoading}
                                    promediosEsFiltrados={promediosEspañol}
                                    promediosEspañolAr2={promediosEspañolAr2}
                                    promediosEspañolAr3={promediosEspañolAr3}
                                />
                                <TablaPromedioIngles
                                    isLoading={isLoading}
                                    promediosEsFiltrados={promediosIngles}
                                    promediosInglesAr5={promediosInglesAr5}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}

export default CreacionBoletas3Bimestre;