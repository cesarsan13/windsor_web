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
import { getBoletas3, getActividadMateria, getEvaluacionMateria } from "@/app/utils/api/boletas/boletas";
import { setGlobalVariable, globalVariables, loadGlobalVariables } from "@/app/utils/globalfn";
function CreacionBoletas3Bimestre() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [isLoading, setisLoading] = useState(false);
    const [pdfPreview, setPdfPreview] = useState(false);
    const [pdfData, setPdfData] = useState("");
    const [grupo, setGrupo] = useState({});
    const [alumno, setAlumno] = useState({});
    const [ciclo, setCiclo] = useState([]);
    const [promediosEsFiltrados, setPromediosEsFiltrados] = useState([]);
    const [promediosEs, setPromediosEs] = useState([]);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();
    let cicloSelect = watch('ciclo');

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

    const Buscar = handleSubmit(async (data) => {
        // console.log(data);
        // console.log(alumno);
        // console.log(grupo);
        const { token } = session.user;
        if (!grupo) {
            showSwal('Error', 'Debe seleccionar un grupo.', 'error');
            return;
        }
        if (!alumno) {
            showSwal('Error', 'Debe seleccionar un alumno.', 'error');
            return;
        }
        const datosDG1 = await getBoletas3(token, grupo.numero);
        data.alumno = alumno.numero;
        data.nombre_alumno = alumno.nombre;
        data.grupo = grupo.numero;
        data.grupo_nombre = grupo.horario;
        setPromediosEs(datosDG1);
        setPromediosEsFiltrados(datosDG1);
        if (datosDG1.length > 0) {
            const rango = 5;
            for (let i = 0; i < datosDG1.length; i += rango) {
                const batch = datosDG1.slice(i, i + rango);
                const promises = batch.map(async (val) => {
                    try {
                        if (val.area === 1 || va.area === 4) {
                            data.materia = val.numero;
                            data.materia_nombre = val.descripcion;
                            // console.log(data);
                            const datosDG2 = await getActividadMateria(token, val.numero);
                            if (datosDG2[0].actividad === 'No') {
                                const datosDG3 = await getEvaluacionMateria(token, data);
                                // console.log(datosDG3);
                            } else {
                                const datosDG3 = await getEvaluacionMateria(token, data);
                                // console.log(datosDG3);
                            }
                        } else {
                            const datosDG4 = await getEvaluacionMateria(token, data);
                        }

                    } catch (error) {
                        // console.error('Error al obtener actividad:', error);
                    }
                });
                await Promise.all(promises);
            }
        }
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
                                    tamañolabel={"w-2/6"}
                                    className={"w-1/2 text-right"}
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
                                    requerido={true}
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
                                    requerido={true}
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

                        <div className="flex flex-col items-center h-full">
                            <div className="w-full max-w-4xl">
                                <TablaPromedioEspañol
                                    isLoading={isLoading}
                                    promediosEsFiltrados={promediosEsFiltrados}
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