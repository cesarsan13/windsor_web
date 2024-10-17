'use client'
import React, { useEffect, useState } from 'react'
import Acciones from './components/Acciones'
import Busqueda from './components/Busqueda'
import TablaActividades from './components/tablaActividades';
import { useSession } from 'next-auth/react';
import { getActividades, Imprimir, guardarActividad,ImprimirExcel } from '../utils/api/actividades/actividades';
import { useForm } from 'react-hook-form';
import ModalActividades from './components/ModalActividades';
import { confirmSwal, showSwal } from '../utils/alerts';
import ModalVistaPreviaActividades from './components/ModalVistaPreviaActividades';
import { ReportePDF } from '../utils/ReportesPDF';

function Page() {
    const { data: session, status } = useSession();
    const [busqueda, setBusqueda] = useState({ tb_id: "", tb_desc: "" });
    const [actividades, setActividades] = useState([]);
    const [actividad, setActividad] = useState({})
    const [ActividadesFiltradas, setActividadesFiltradas] = useState([])
    const [bajas, setBajas] = useState(false);
    const [openModal, setModal] = useState(false);
    const [accion, setAccion] = useState("");
    const [isLoading, setisLoading] = useState(false);
    const [currentID, setCurrentId] = useState("");
    const [pdfPreview, setPdfPreview] = useState(false);
    const [pdfData, setPdfData] = useState("");

    useEffect(() => {
        if (status === "loading" || !session) {
            return;
        }
        const fetchData = async () => {
            setisLoading(true);
            const { token } = session.user
            const data = await getActividades(token, bajas)
            setActividades(data)
            setActividadesFiltradas(data)
            setisLoading(false);
        }
        fetchData()
    }, [session, status, bajas])
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            materia: actividad.materia,
            secuencia: actividad.secuencia,
            descripcion: actividad.descripcion,
            EB1: actividad.EB1,
            EB2: actividad.EB2,
            EB3: actividad.EB3,
            EB4: actividad.EB4,
            EB5: actividad.EB5,
            baja: actividad.baja,
        }
    })
    useEffect(() => {
        reset({
            materia: actividad.materia,
            secuencia: actividad.secuencia,
            descripcion: actividad.descripcion,
            evaluaciones: actividad.evaluaciones,
            EB1: actividad.EB1,
            EB2: actividad.EB2,
            EB3: actividad.EB3,
            EB4: actividad.EB4,
            EB5: actividad.EB5,
            baja: actividad.baja,
        })
    }, [actividad, reset])
    const Buscar = () => {
        const { tb_id, td_desc } = busqueda;
        if (tb_id === "" && td_desc === "") {
            setActividadesFiltradas(actividades)
            return
        }
        const infoFiltrada = actividades.filter((actividad) => {
            const coincideId = tb_id ? actividad["materia"].toString().toLowerCase().includes(tb_id.toLowerCase()) : true
            const coincideDescripcion = td_desc ? actividad["materia"].toString().toLowerCase().includes(tb_id.toLowerCase()) : true
            return coincideId && coincideDescripcion
        })
        setActividadesFiltradas(infoFiltrada)
    }
    if (status === "loading") {
        return (
            <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
        );
    }
    const limpiarBusqueda = (evt) => {
        evt.preventDefault
        setBusqueda({ tb_id: "", tb_desc: "" });
    }
    const handleBusquedaChange = (event) => {
        event.preventDefault;
        setBusqueda((estadoPrevio) => ({
            ...estadoPrevio,
            [event.target]: event.target.value,
        }));
    };

    const showModal = (show) => {
        show
            ? document.getElementById("my_modal_3").showModal()
            : document.getElementById("my_modal_3").close();
    };
    const Alta = async (event) => {
        setCurrentId("");
        const { token } = session.user
        reset({
            materia: "",
            secuencia: "",
            descripcion: "",
            EB1: "",
            EB2: "",
            EB3: "",
            EB4: "",
            EB5: "",
            baja: "",
        })
        setModal(!openModal)
        setAccion("Alta")
        showModal(true)
    }
    const onSubmitModal = handleSubmit(async (data) => {
        event.preventDefault
        let res = null
        if (accion === "Eliminar") {
            showModal(false)
            const confirmed = await confirmSwal(
                "¿Desea Continuar?",
                "se eliminara la Actividad Seleccionada",
                "warning",
                "Aceptar",
                "Cancelar"
            )
            if (!confirmed) {
                showModal(true)
                return
            }
        }
        res = await guardarActividad(session.user.token, accion, data)
        if (res.status) {
            if (accion === "Alta") {
                const nuevaActividad = { currentID, ...data }
                setActividades([...actividades, nuevaActividad])
                if (!bajas) {
                    setActividadesFiltradas([...ActividadesFiltradas, nuevaActividad])
                }
            }
            if (accion === "Eliminar" || accion === "Editar") {
                const index = actividades.findIndex((fp) => fp.materia === data.materia)
                if (index !== -1) {
                    if (accion === "Eliminar") {
                        const fpFiltrados = actividades.filter((fp) => fp.materia !== data.materia)
                        setActividades(fpFiltrados)
                        setActividadesFiltradas(fpFiltrados)
                    } else {
                        if (bajas) {
                            const fpFiltrados = actividades.filter((fp) => fp.materia !== data.materia)
                            setActividades(fpFiltrados)
                            setActividadesFiltradas(fpFiltrados)
                        } else {
                            const fpActualizadas = actividades.map((fp) =>
                                fp.materia === currentID && fp.secuencia === data.secuencia ? { ...fp, ...data } : fp
                            )
                            setActividades(fpActualizadas)
                            setActividadesFiltradas(fpActualizadas)
                        }
                    }
                }
            }
            showSwal(res.alert_title, res.alert_text, res.alert_icon);
            showModal(false);
        }
    })
    const handleVerClick = () => {
        const configuracion = {
            Encabezado: {
                Nombre_Aplicacion: "Sistema de Control Escolar",
                Nombre_Reporte: "Reporte Datos Horario",
                Nombre_Usuario: `Usuario: ${session.user.name}`,
            },
        };
        const Enca1 = (doc) => {
            if (!doc.tiene_encabezado) {
                doc.imprimeEncabezadoPrincipalV();
                doc.nextRow(12);
                doc.ImpPosX("Asignatura", 14, doc.tw_ren);
                doc.ImpPosX("Actividad", 38, doc.tw_ren);
                doc.nextRow(4);
                doc.printLineV();
                doc.nextRow(4);
                doc.tiene_encabezado = true;
            } else {
                doc.nextRow(6)
                doc.tiene_encabezado = true
            }
        }
        const reporte = new ReportePDF(configuracion)
        Enca1(reporte)
        ActividadesFiltradas.forEach((actividad) => {
            reporte.ImpPosX(actividad.materia.toString(), 24, reporte.tw_ren, 0, "R")
            reporte.ImpPosX(actividad.descripcion.toString(), 38, reporte.tw_ren, 0, "L")
            Enca1(reporte);
            if (reporte.tw_ren >= reporte.tw_endRen) {
                reporte.pageBreak();
                Enca1(reporte);
            }
        })
        const pdfData = reporte.doc.output("datauristring");
        setPdfData(pdfData);
        setPdfPreview(true);
        showModalVista(true)
    }
    const showModalVista = (show) => {
        show
            ? document.getElementById("modalVPActividades").showModal()
            : document.getElementById("modalVPActividades").close();
    }
    const ImprimePDF = () => {
        const configuracion = {
            Encabezado: {
                Nombre_Aplicacion: "Sistema de Control Escolar",
                Nombre_Reporte: "Reporte Datos Actividades",
                Nombre_Usuario: `Usuario: ${session.user.name}`,
            },
            body: ActividadesFiltradas
        };
        Imprimir(configuracion)
    }
    const ImprimeExcel = () => {
        const configuracion = {
            Encabezado: {
                Nombre_Aplicacion: "Sistema de Control Escolar",
                Nombre_Reporte: "Reporte Datos Actividades",
                Nombre_Usuario: `Usuario: ${session.user.name}`,
            },
            body:ActividadesFiltradas,
            columns:[
                {header:"Asignatura",dataKey:"materia"},
                {header:"Actividad",dataKey:"descripcion"}
            ],
            nombre:"Actividades"
        }
        ImprimirExcel(configuracion)
    }
    return (
        <>
            <ModalActividades
                accion={accion}
                currentID={currentID}
                errors={errors}
                register={register}
                setActividades={setActividades}
                actividades={actividades}
                watch={watch}
                session={session}
                setValue={setValue}
                onSubmit={onSubmitModal}
            />
            <ModalVistaPreviaActividades pdfData={pdfData} pdfPreview={pdfPreview} PDF={ImprimePDF} Excel={ImprimeExcel} />
            <div className='container h-[80vh] w-full max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden'>
                <div className='flex flex-col justify-start p-3'>
                    <div className='flex flex-wrap md:flex-nowrap items-start md:items-center'>
                        <div className='order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0'>
                            <Acciones
                                Alta={Alta}
                                Ver={handleVerClick}
                            />
                        </div>
                        <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
                            Actividades
                        </h1>
                    </div>
                </div>
                <div className='flex flex-col items-center h-full'>
                    <div className='w-full max-w-4xl'>
                        <Busqueda
                            busqueda={busqueda}
                            Buscar={Buscar}
                            handleBusquedaChange={handleBusquedaChange}
                            limpiarBusqueda={limpiarBusqueda}
                            setBajas={setBajas}
                        />
                        <TablaActividades
                            isLoading={isLoading}
                            setAccion={setAccion}
                            setActividad={setActividad}
                            setCurrentId={setCurrentId}
                            showModal={showModal}
                            ActividadesFiltradas={ActividadesFiltradas}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Page
