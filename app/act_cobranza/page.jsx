'use client'
import React, { useEffect, useState } from 'react'
import Acciones from './components/Acciones'
import BuscarCat from '../components/BuscarCat'
import { useSession } from 'next-auth/react';
import { getAlumnos } from '../utils/api/alumnos/alumnos';
import TablaActCobranzaAlumnos from './components/tablaActCobranzaAlumnos';
import TablaDocumentosCobranza from './components/tablaDocumentosCobranza';
import { getDocumentosAlumno, guardarActCobranza } from '../utils/api/act_cobranza/act_cobranza';
import { confirmSwal, showSwal, showSwalAndWait } from '../utils/alerts';
import ModalActCobranza from './components/ModalActCobranza';
import { useForm } from 'react-hook-form';
import { formatFecha } from '../utils/globalfn';
import { useRouter } from 'next/navigation';
import Busqueda from './components/Busqueda';


function Act_Cobranza() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [isLoading, setisLoading] = useState(false);
    const [isLoadingDocumentos, setisLoadingDocumentos] = useState(false);
    const [alumnos, setAlumnos] = useState([])
    const [alumnosFiltrados, setAlumnosFiltrados] = useState([])
    const [alumno, setAlumno] = useState({})
    const [accion, setAccion] = useState("")
    const [documentos, setDocumentos] = useState([])
    const [documento, setDocumento] = useState({})
    const [currentID, setCurrentId] = useState("")
    const [producto, setProducto] = useState({})
    const [currentIDDocumento, setCurrentIdDocumento] = useState("")
    const [busqueda, setBusqueda] = useState({
        tb_id: "",
        tb_desc: "",
    });
    useEffect(() => {
        if (status === "loading" || !session) {
            return;
        }
        const fetchData = async () => {
            setisLoading(true)
            const { token } = session.user
            const data = await getAlumnos(token, false)
            setAlumnos(data)
            setAlumnosFiltrados(data)
            setisLoading(false)
        }
        fetchData();
    }, [session, status])
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            producto: documento.producto,
            numero_doc: documento.numero_doc,
            fecha: formatFecha(documento.fecha),
            importe: documento.importe,
            descuento: documento.descuento,
        }
    })
    useEffect(() => {
        reset({
            producto: documento.producto,
            numero_doc: documento.numero_doc,
            fecha: formatFecha(documento.fecha),
            importe: documento.importe,
            descuento: documento.descuento,
        })
    }, [documento, reset])
    const documentosAlumno = async (id) => {
        setisLoadingDocumentos(true)
        const { token } = session.user
        const data = await getDocumentosAlumno(token, id)
        setDocumentos(data)
        setisLoadingDocumentos(false)
    }
    const Alta = async (event) => {
        if (!currentID) {
            showSwal("INFO", "Debe seleccionar a un alumno", "info")
            return
        }
        reset({
            producto: "",
            numero_doc: "",
            fecha: "",
            importe: "",
            descuento: "",
        })
        setAccion("Alta")
        showModal(true)
    }
    const showModal = (show) => {
        show ? document.getElementById("my_modal_3").showModal()
            : document.getElementById("my_modal_3").close();
    }
    if (status === "loading") {
        return (
            <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
        );
    }
    const onSubmitModal = handleSubmit(async (data) => {
        event.preventDefault();
        if (accion === "Alta") data.producto = producto.numero;
        data.alumno = currentID;
        setCurrentIdDocumento(data.documento);        
        if (accion === "Eliminar") {
            showModal(false);
            const confirmed = await confirmSwal(
                "¿Desea Continuar?",
                "Se eliminará el documento seleccionado.",
                "warning",
                "Aceptar",
                "Cancelar"
            );
            if (!confirmed) {
                showModal(true);
                return;
            }
        }
        const res = await guardarActCobranza(session.user.token, accion, data);
        if (res.status) {
            if (accion === "Alta") {
                const nuevaActividad = { currentIDDocumento, ...data };
                setDocumentos([...documentos, nuevaActividad]);
            }

            if (accion === "Eliminar" || accion === "Editar") {
                const index = documentos.findIndex((fp) =>
                    fp.numero_doc === data.numero_doc &&                    
                    fp.producto === data.producto &&
                    fp.fecha === data.fecha
                );
                if (index !== -1) {
                    if (accion === "Eliminar") {
                        const actDocFiltrados = documentos.filter((fp) =>
                            fp.numero_doc !== data.numero_doc ||
                            fp.producto !== data.producto ||
                            fp.fecha !== data.fecha
                        );
                        setDocumentos(actDocFiltrados);
                    } else {
                        const actDocActualizadas = documentos.map((fp) =>
                            fp.numero_doc === data.numero_doc &&                            
                            fp.producto === data.producto &&
                            fp.fecha === data.fecha
                                ? { ...fp, ...data }
                                : fp
                        );
                        setDocumentos(actDocActualizadas);
                    }
                }
            }
            showSwal(res.alert_title, res.alert_text, res.alert_icon);
            showModal(false);
        } else {
            showSwal(res.alert_title, res.alert_text, res.alert_icon);
            showModal(false);
        }
    });
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
    const limpiarBusqueda = (evt) => {
        evt.preventDefault;
        setBusqueda({ tb_id: "", tb_desc: "" });
    };
    const Buscar = () => {
        const { tb_id, tb_desc } = busqueda
        if (tb_id === "" && tb_desc === "") {
            setAlumnosFiltrados(alumnos)
            return
        }
        const infoFiltrada = alumnos.filter((alumno) => {
            const coincideId = tb_id
                ? alumno["numero"].toString().includes(tb_id)
                : true;
            const coincideDescripcion = tb_desc
                ? alumno["nombre"]
                    .toString()
                    .toLowerCase()
                    .includes(tb_desc.toLowerCase())
                : true;
            return coincideId && coincideDescripcion
        })
        setAlumnosFiltrados(infoFiltrada)
    }
    return (
        <>
            <ModalActCobranza
                accion={accion}
                session={session}
                documento={documento}
                errors={errors}
                register={register}
                onSubmit={onSubmitModal}
                setProducto={setProducto}
            ></ModalActCobranza>
            <div className='container h-[83vh] w-full max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden'>
                <div className='flex flex-col justify-start p-3'>
                    <div className='flex flex-wrap md:flex-nowrap items-start md:items-center'>
                        <div className='order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0 pr-4'>
                            <Acciones
                                Alta={Alta}
                                home={home}
                                Buscar={Buscar}
                            />
                        </div>
                        <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
                            Actualización de Cobranza
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
                        />
                    </div>
                    <div className='w-full max-w-4xl flex flex-row gap-2'>
                        <TablaActCobranzaAlumnos
                            alumnosFiltrados={alumnosFiltrados}
                            isLoading={isLoading}
                            setAccion={setAccion}
                            setAlumno={setAlumno}
                            documentosAlumno={documentosAlumno}
                            setCurrentId={setCurrentId}
                        ></TablaActCobranzaAlumnos>
                        <TablaDocumentosCobranza
                            isLoading={isLoadingDocumentos}
                            documentos={documentos}
                            setAccion={setAccion}
                            setCurrentId={setCurrentIdDocumento}
                            setDocumento={setDocumento}
                            showModal={showModal}
                        ></TablaDocumentosCobranza>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Act_Cobranza
