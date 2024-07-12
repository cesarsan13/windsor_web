"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { showSwal, confirmSwal } from '../utils/alerts'
import ModalHorario from '@/app/horarios/components/ModalHorario'
import TablaHorarios from '@/app/horarios/components/TablaHorarios'
import Busqueda from "@/app/horarios/components/Busqueda";
import Acciones from "@/app/horarios/components/Acciones";
import { useForm } from "react-hook-form";
import {
    getHorarios,
    guardarHorario,
    Imprimir,
    ImprimirExcel
} from "@/app/utils/api/horarios/horarios"
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getUltimoHorario } from '@/app/utils/api/horarios/horarios'

function Horarios() {
    const router = useRouter()
    const { data: session, status } = useSession()
    const [horarios, setHorarios] = useState([])
    const [horario, setHorario] = useState({})
    const [horariosFiltrados, setHorariosFiltrados] = useState([])
    const [bajas, setBajas] = useState(false)
    const [openModal, setModal] = useState(false)
    const [accion, setAccion] = useState("")
    const [isLoading, setisLoading] = useState(false);
    const [currentID, setCurrentId] = useState("");
    const [filtro, setFiltro] = useState("");
    const [dia, setDia] = useState("")
    const [TB_Busqueda, setTB_Busqueda] = useState("");

    useEffect(() => {
        if (status === "loading" || !session) {
            return
        }
        const fetchData = async () => {
            setisLoading(true)
            const { token } = session.user
            const data = await getHorarios(token, bajas)            
            setHorarios(data)
            setHorariosFiltrados(data)
            if (filtro !== "" && TB_Busqueda !== "") {
                Buscar();
            }
            setisLoading(false)
        }
        fetchData()
    }, [session, status, bajas])
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: {
            numero: horario.numero,
            cancha: horario.cancha,
            dia: horario.dia,
            horario: horario.horario,
            max_niños: horario.max_niños,
            sexo: horario.sexo,
            edad_ini: horario.edad_ini,
            edad_fin: horario.edad_fin,
        }
    })
    useEffect(() => {
        reset({
            numero: horario.numero,
            cancha: horario.cancha,
            dia: horario.dia,
            horario: horario.horario,
            max_niños: horario.max_niños,
            sexo: horario.sexo,
            edad_ini: horario.edad_ini,
            edad_fin: horario.edad_fin,
        })
    }, [horario, reset])
    const Buscar = () => {        
        if (TB_Busqueda === "" || filtro === "") {
            setHorariosFiltrados(horarios);
            return;
        }
        const infoFiltrada = horarios.filter((formapago) => {
            const valorCampo = formapago[filtro];
            if (typeof valorCampo === "number") {
                return valorCampo.toString().includes(TB_Busqueda);
            }
            return valorCampo
                ?.toString()
                .toLowerCase()
                .includes(TB_Busqueda.toLowerCase());
        });
        setHorariosFiltrados(infoFiltrada);
    }
    const limpiarBusqueda = () => {
        setFiltro("")
        setTB_Busqueda("")
    }
    const Alta = async (event) => {
        setCurrentId("");
        const { token } = session.user;
        reset({
            numero: "",
            cancha: "",
            dia: "",
            horario: "",
            max_niños: "",
            sexo: "",
            edad_ini: "",
            edad_fin: "",
        });
        let siguienteId = await getUltimoHorario(token);
        siguienteId = Number(siguienteId);
        setCurrentId(siguienteId);
        setHorario({ numero: siguienteId });
        setModal(!openModal);
        setAccion("Alta");
        showModal(true);

        document.getElementById("cancha").focus();
    };
    const onSubmitModal = handleSubmit(async (data) => {
        event.preventDefault;
        data.numero = currentID
        let res = null
        if (accion === "Eliminar") {
            showModal(false);
            const confirmed = await confirmSwal(
                "¿Desea Continuar?",
                "Se eliminara el horario seleccionado",
                "warning",
                "Aceptar",
                "Cancelar"
            );
            if (!confirmed) {
                showModal(true);
                return;
            }
        }        
        if (Array.isArray(dia)) {
            data.dia = dia.join("/")
        } else {
            data.dia = dia;
        }        
        res = await guardarHorario(session.user.token, data, accion)
        if (res.status) {
            if (accion === "Alta") {
                const nuevaHorario = { currentID, ...data };
                setHorarios([...horarios, nuevaHorario]);
                if (!bajas) {
                    setHorariosFiltrados([...horariosFiltrados, nuevaHorario]);
                }
            }
            if (accion === "Eliminar" || accion === "Editar") {
                const index = horarios.findIndex((fp) => fp.numero === data.numero);
                if (index !== -1) {
                    if (accion === "Eliminar") {
                        const fpFiltrados = horarios.filter((fp) => fp.numero !== data.numero);
                        setHorarios(fpFiltrados);
                        setHorariosFiltrados(fpFiltrados);
                    } else {
                        if (bajas) {
                            const fpFiltrados = horarios.filter((fp) => fp.numero !== data.numero);
                            setHorarios(fpFiltrados);
                            setHorariosFiltrados(fpFiltrados);
                        } else {                            
                            const fpActualizadas = horarios.map((fp) =>
                                fp.nuemro === currentID ? { ...fp, ...data } : fp
                            );                            
                            setHorarios(fpActualizadas);
                            setHorariosFiltrados(fpActualizadas);
                        }
                    }
                }
            }
            showSwal(res.alert_title, res.alert_text, res.alert_icon);
            showModal(false);
        }
    })
    const showModal = (show) => {
        show
            ? document.getElementById("my_modal_3").showModal()
            : document.getElementById("my_modal_3").close();
    };
    const home = () => {
        router.push("/");
    };
    const handleBusquedaChange = (event) => {
        event.preventDefault;
        setTB_Busqueda(event.target.value);
    };
    if (status === "loading") {
        return (
            <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
        );
    }
    const ImprimePDF  = () => {
        const configuracion ={
            Encabezado:{
                Nombre_Aplicacion: "Sistema de Control Escolar",
            Nombre_Reporte: "Reporte Datos Horario",
            Nombre_Usuario: `Usuario: ${session.user.name}`,
            },
            body : horariosFiltrados
        }
        Imprimir(configuracion)
    }
    const ImprimeExcel = () =>{
        const configuracion ={
            Encabezado:{
                Nombre_Aplicacion: "Sistema de Control Escolar",
            Nombre_Reporte: "Reporte Datos Horario",
            Nombre_Usuario: `Usuario: ${session.user.name}`,
            },
            body:horariosFiltrados,
            columns:[
                {header:"Numero",dataKey:"numero"},
                {header:"Cancha",dataKey:"cancha"},
                {header:"Dia",dataKey:"dia"},
                {header:"Horario",dataKey:"horario"},
                {header:"Niños",dataKey:"max_niños"},
                {header:"Sexo",dataKey:"sexo"},
                {header:"Edad Ini",dataKey:"edad_ini"},
                {header:"Edad Fin",dataKey:"edad_fin"},
            ],
            nombre:"Horarios"
        }
        ImprimirExcel(configuracion)        
    }
    return (
        <>
            <ModalHorario
                accion={accion}
                onSubmit={onSubmitModal}
                currentID={currentID}
                errors={errors}
                register={register}
                setHorarios={setHorario}
                horarios={horario}
                control={control}
                setDia={setDia}
            />
            <div className='container  w-full  max-w-screen-xl bg-slate-100 shadow-xl rounded-xl px-3 '>
                <div className='flex justify-start p-3'>
                    <h1 className='text-4xl font-xthin text-black md:px-12'>Horarios</h1>
                </div>
                <div className='container grid grid-cols-8 grid-rows-1 h-[calc(100%-20%)] '>
                    <div className='col-span-1 flex flex-col'>
                        <Acciones Buscar={Buscar} Alta={Alta} home={home} PDF={ImprimePDF} Excel={ImprimeExcel}></Acciones>
                    </div>
                    <div className='col-span-7'>
                        <div className='flex flex-col h-[calc(100%)]'>
                            <Busqueda
                                setBajas={setBajas}
                                setFiltro={setFiltro}
                                limpiarBusqueda={limpiarBusqueda}
                                Buscar={Buscar}
                                handleBusquedaChange={handleBusquedaChange}
                                TB_Busqueda={TB_Busqueda}
                                setTB_Busqueda={setTB_Busqueda}
                            />
                            <TablaHorarios
                                isLoading={isLoading}
                                HorariosFiltrados={horariosFiltrados}
                                showModal={showModal}
                                setHorario={setHorario}
                                setAccion={setAccion}
                                setCurrentId={setCurrentId}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Horarios
