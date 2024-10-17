"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Acciones from "@/app/c_calificaciones/components/Acciones";
import { useSession } from "next-auth/react";
import BuscarCat from "@/app/components/BuscarCat";
import Inputs from "@/app/c_calificaciones/components/Inputs";
import TablaCalificaciones from "@/app/c_calificaciones/components/tablaCalificaciones";
import { setGlobalVariable } from "@/app/utils/globalfn";
import { getMateriaEvaluacion, getMateriaBuscar } from "@/app/utils/api/materias/materias";
import { getActividadSecuencia } from "@/app/utils/api/actividades/actividades";
import { getContraseñaProfe } from "@/app/utils/api/profesores/profesores"
import { getProcesoCalificaciones } from "@/app/utils/api/calificaciones/calificaciones";
import { showSwal, confirmSwal } from "@/app/utils/alerts";

function C_Calificaciones() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [openModal, setModal] = useState(false);
    const [accion, setAccion] = useState("");
    const [isLoading, setisLoading] = useState(false);
    const [currentID, setCurrentId] = useState("");
    const [calificacion, setCalificacion] = useState({});
    const [calificaciones, setCalificaciones] = useState([]);
    const [grupo, setGrupo] = useState({});
    const [materia, setMateria] = useState({});
    const [calificacionesFiltrados, setCalificacionesFiltrados] = useState([]);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isDisabled2, setIsDisabled2] = useState(false);
    const [isDisabled3, setIsDisabled3] = useState(false);
    const [actividades, setActividades] = useState([]);
    const [evaluacion, setEvaluacion] = useState([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        if (status === "loading" || !session) {
            return;
        }
        const fetchData = async () => {
            let res = null, res2 = null, res3 = null;
            let vg_area = '', vg_actividad = '', vg_caso_evaluar = '';
            const { token } = session.user;
            console.log(materia);
            res = await getMateriaBuscar(token, materia.materia)
            if (res.data) {
                res.data.forEach(element => {
                    vg_area = element.area
                    vg_actividad = element.actividad
                    vg_caso_evaluar = element.caso_evaluar
                });
            };

            if (vg_actividad === 'No') {
                setIsDisabled2(false);
            } else {
                setIsDisabled2(true);
            }

            if (vg_area === 1 || vg_area == 4) {
                setIsDisabled3(true);
            } else {
                setIsDisabled3(false);
            }

            // if (vg_actividad === 'Si') {
            res2 = await getActividadSecuencia(token, materia.materia);
            if (res2.status) {
                setIsDisabled2(true);
                console.log(res2.data);
                setActividades(res2.data);
            } else {
                showSwal('Error', 'No hay actividades para esta materia', 'error');
            }
            // } else {
            res3 = await getMateriaEvaluacion(token, materia.materia);
            if (res3.status) {
                const Cb_Evaluacion = [];
                const evaluaciones = res3.data[0].evaluaciones;
                let numeroValuaciones = 0;
                for (let i = 1; i <= evaluaciones; i++) {
                    Cb_Evaluacion.push({ id: i, descripcion: i });
                    numeroValuaciones += 1;
                }
                setIsDisabled3(true)
                setEvaluacion(Cb_Evaluacion);
            } else {
                showSwal('Error', 'No hay evaluación para esta materia', 'error');
            }
            // }

        }
        fetchData();
    }, [materia]);

    useEffect(() => {
        if (grupo.numero) {
            setIsDisabled(false);
            setGlobalVariable('grupo', grupo.numero);
            setIsDisabled(true);
        } else {
            setIsDisabled(false);
        };
    }, [grupo]);

    const validar = async (grupo, materia, contraseña) => {
        const { token } = session.user;
        let validar;
        let res = await getContraseñaProfe(token, grupo, materia);
        const data = res.data;
        if (contraseña.toLowerCase() === data.contraseña.toLowerCase()) {
            validar = true;
        } else {
            validar = false;
            showSwal('Error', 'Grupo no asignado a Profesor', 'error');
        }
        return validar;
    }

    const Guardar = handleSubmit(async (data) => {
        console.log(data);
    });

    const Buscar = handleSubmit(async (data) => {
        const { token } = session.user;
        console.log(data);
        if (!grupo) {
            showSwal('Error', 'Debe seleccionar un grupo', 'error');
            return;
        }
        if (!materia) {
            showSwal('Error', 'Debe seleccionar una materia', 'error');
            return;
        }

        const validacion = await validar(grupo.numero, materia.materia, data.contraseña_profesor || '');
        if (!validacion) { return }

        data.grupo = grupo.numero;
        data.materia = materia.materia;
        data.cb_actividad = isDisabled2;
        console.log(data);

        // let res = await getProcesoCalificaciones(token, data);

        // if (res.status) {
        //     showSwal(res.alert_title, res.alert_text, res.alert_icon);
        //     home();
        // } else {
        //     showSwal(res.alert_title, res.alert_text, res.alert_icon);
        // };
    });

    const home = () => {
        router.push("/");
    };

    if (status === "loading") {
        return (
            <div className="container skeleton w-full max-w-screen-xl shadow-xl rounded-xl"></div>
        );
    }
    return (
        <>
            <div className="container h-[80vh] w-full max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden">
                <div className="flex flex-col justify-start p-3">
                    <div className="flex flex-wrap md:flex-nowrap items-start md:items-center">
                        <div className="order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0 pr-4">
                            <Acciones
                                Alta={Guardar}
                                home={home}
                                Buscar={Buscar}
                            />
                        </div>
                        <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around w-auto">
                            Actualización del Cátalogo de Calificaciones.
                        </h1>
                    </div>
                </div>
                <div className="flex flex-col md:grid md:grid-cols-8 md:grid-rows-1 h-full">
                    <div className="col-span-7">
                        <div className="flex flex-col h-[calc(100%)] space-y-4">
                            <Inputs
                                dataType={"int"}
                                name={"bimestre"}
                                tamañolabel={"w-[30%]"}
                                className={"w-[50%] text-right"}
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
                                titulo={"Asignatura: "}
                                setItem={setGrupo}
                                token={session.user.token}
                                modalId="modal_horario1"
                                alignRight={"text-right"}
                                inputWidths={{ contdef: "180px", first: "70px", second: "150px" }}
                            />
                            {isDisabled && (
                                <>
                                    <BuscarCat
                                        table="clases"
                                        itemData={[]}
                                        fieldsToShow={["materia", "descripcion"]}
                                        nameInput={["materia", "descripcion"]}
                                        titulo={"Asignatura: "}
                                        setItem={setMateria}
                                        token={session.user.token}
                                        modalId="modal_asignatura1"
                                        alignRight={"text-right"}
                                        inputWidths={{ contdef: "180px", first: "70px", second: "150px" }}
                                    />
                                </>
                            )}
                            {isDisabled2 && (
                                <>
                                    <Inputs
                                        dataType={"int"}
                                        name={"actividad"}
                                        tamañolabel={""}
                                        className={"w-auto text-right"}
                                        Titulo={"Actividad: "}
                                        type={"select"}
                                        requerido={true}
                                        errors={errors}
                                        register={register}
                                        message={"Actividad Requerido"}
                                        isDisabled={false}
                                        maxLenght={5}
                                        arreglos={actividades}
                                    />
                                </>
                            )}
                            {isDisabled3 && (
                                <>
                                    <Inputs
                                        dataType={"int"}
                                        name={"evaluacion"}
                                        tamañolabel={""}
                                        className={"w-auto text-right"}
                                        Titulo={"No. Evaluación: "}
                                        type={"select"}
                                        requerido={true}
                                        errors={errors}
                                        register={register}
                                        message={"Evaluación Requerido"}
                                        isDisabled={false}
                                        maxLenght={5}
                                        arreglos={evaluacion}
                                    />
                                </>
                            )}
                            <Inputs
                                dataType={"string"}
                                name={"contraseña_profesor"}
                                tamañolabel={"w-[30%]"}
                                className={"w-[30%] text-left"}
                                Titulo={"Contraseña Profesor: "}
                                type={"password"}
                                requerido={false}
                                errors={errors}
                                register={register}
                                message={"Contraseña profesor Requerido"}
                                isDisabled={false}
                                maxLenght={255}
                            />
                            <Inputs
                                dataType={"string"}
                                name={"promedio_grupo"}
                                tamañolabel={"w-[30%]"}
                                className={"w-[30%] text-right"}
                                Titulo={"Prom. del Grupo: "}
                                type={"text"}
                                requerido={false}
                                errors={errors}
                                register={register}
                                message={"Prom. del Grupo Requerido"}
                                isDisabled={true}
                                maxLenght={255}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center h-full">
                    <div className="w-full max-w-4xl">
                        <TablaCalificaciones
                            isLoading={isLoading}
                            calificacionesFiltrados={calificacionesFiltrados}
                            // showModal={showModal}
                            setCalificacion={setCalificacion}
                            setAccion={setAccion}
                            setCurrentId={setCurrentId}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default C_Calificaciones;
