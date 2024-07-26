'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import Acciones from './components/Acciones'
import { formatDate } from '../utils/globalfn';
import { Imprimir } from '../utils/api/Rep_Femac_7/Rep_Femac_7';
import { useSession } from 'next-auth/react';

function Repo_Femac_7() {
    const date = new Date();
    const dateStr = formatDate(date);
    const router = useRouter();
    const { data: session, status } = useSession();
    const [fecha, setFecha] = useState(dateStr.replace(/\//g, '-'));
    const [documento, setDocumento] = useState(0);
    const [sinDeudores, setSinDeudores] = useState(true);
    const [grupoAlumno, setGrupoAlumno] = useState(false);
    const home = () => {
        router.push("/");
    };
    const ImprimePDF = () => {
        const configuracion = {
            Encabezado: {
                Nombre_Aplicacion: "Nombre de la Aplicación",
                Nombre_Reporte: `Reporte de Reporte de Adeudos Pendientes al ${fecha}`,
                Nombre_Usuario: `Usuario: ${session.user.name}`,
            },            
        }
        const { token } = session.user
        Imprimir(configuracion,grupoAlumno,token,fecha,sinDeudores,documento)
    }
    const ImprimeExcel = () => {

    }
    const handleVerClick = () => {

    }
    return (
        <>
            <div className='container w-full  max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3'>
                <div className='flex justify-start p-3 '>
                    <h1 className='text-4xl font-xthin text-black dark:text-white md:px-12'>
                        Reporte Adeudos Pendientes
                    </h1>
                </div>
                <div className='container grid grid-cols-8 grid-rows-1 h-[calc(100%-20%)]'>
                    <div className='col-span-1 flex flex-col'>
                        <Acciones home={home} ImprimePDF={ImprimePDF} />
                    </div>
                    <div className='col-span-7'>
                        <div className='flex flex-col h-[calc(100%)]'>
                            <div className='flex flex-col md:flex-row gap-4'>
                                <div className='w-7/12 md:w-4/12 lg:w-3/12'>
                                    <label className='input input-bordered input-md text-black dark:text-white flex items-center gap-3'>
                                        Fecha 
                                        <input
                                            type="date"
                                            value={fecha}
                                            onChange={(e) => setFecha(e.target.value)}
                                            className='text-black dark:text-white'
                                        />
                                    </label>
                                </div>
                                <div className='w-7/12 md:w-4/12 lg:w-3/12'>
                                    <label className='input input-bordered input-md text-black dark:text-white flex items-center gap-3'>
                                        Documento
                                        <input
                                            type="text"
                                            value={documento}
                                            onChange={(e) => setDocumento(e.target.value)}
                                            className='text-black dark:text-white'
                                        />
                                    </label>
                                </div>
                                <label htmlFor="ch_sinDeudores" className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        id="ch_sinDeudores"
                                        className="checkbox mx-2 checkbox-md"
                                        checked={sinDeudores}
                                        onClick={(evt) => setSinDeudores(evt.target.checked)}
                                    />
                                    <span className="label-text font-bold text-neutral-600 dark:text-neutral-200">Sin Deudores</span>
                                </label>
                                <label htmlFor="ch_grupoAlumno" className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        id="ch_grupoAlumno"
                                        className="checkbox mx-2 checkbox-md"
                                        onClick={(evt) => setGrupoAlumno(evt.target.checked)}
                                    />
                                    <span className="label-text font-bold text-neutral-600 dark:text-neutral-200">Imprimir Grupo,Alumno</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Repo_Femac_7
