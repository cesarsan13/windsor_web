"use client"
import React from 'react'
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Acciones from './components/Acciones';
import BuscarCat from '../components/BuscarCat';
import { useRouter } from "next/navigation";
import { Cobranza, Imprimir, ImprimirExcel } from '../utils/api/Rep_Femac_6/Rep_Femac_6';
import { formatDate } from '../utils/globalfn';

function Rep_Femac_6() {
    const date = new Date();
    const dateStr = formatDate(date);
    const router = useRouter();
    const { data: session, status } = useSession();
    const [cajero, setCajero] = useState({})
    const [fechaIni, setFechaIni] = useState(dateStr.replace(/\//g, '-'));
    const [fechaFin, setFechaFin] = useState(dateStr.replace(/\//g, '-'));
    const [dataCobranza, setDataCobranza] = useState([])
    const [isLoading, setisLoading] = useState(false);
    useEffect(() => {
        if (status === "loading" || !session) {
            return;
        }
        const fetchData = async () => {
            setisLoading(true);
            const { token } = session.user
            console.log(token)
            console.log(fechaFin)
            console.log(fechaIni)

            const id = cajero.numero
            console.log(id)
            const data = await Cobranza(token, fechaIni, fechaFin, id)
            setDataCobranza(data)
            setisLoading(false);
        }
        fetchData()
    }, [session, status, cajero, fechaFin, fechaIni])
    console.log(dataCobranza)
    if (status === "loading") {
        return (
            <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
        );
    }
    const home = () => {
        router.push("/");
    };
    const ImprimePDF = () => {
        const configuracion = {
            Encabezado: {
                Nombre_Aplicacion: "Nombre de la Aplicación",
                Nombre_Reporte: `Reporte de Cobranza Rango de Fecha del ${fechaIni} al ${fechaFin}`,
                Nombre_Usuario: `Usuario: ${session.user.name}`,
            },
            body: dataCobranza
        }
        Imprimir(configuracion, cajero.numero)
    }
    const ImprimeExcel = () => {
        const configuracion = {
            Encabezado: {
                Nombre_Aplicacion: "Sistema de Control Escolar",
                Nombre_Reporte: `Reporte de Cobranza Rango de Fecha del ${fechaIni} al ${fechaFin}`,
                Nombre_Usuario: `${session.user.name}`,
            },
            body1:dataCobranza.producto,
            body2:dataCobranza.tipo_pago,
            body3:dataCobranza.cajeros,
            columns1:[
                {header:"Producto",dataKey:"articulo"},
                {header:"Descripcion",dataKey:"descripcion"},
                {header:"Importe",dataKey:"precio_unitario"}
            ],
            columns2:[
                {header:"Tipo Cobro",dataKey:"tipo_pago"},
                {header:"Descripcion",dataKey:"descripcion"},
                {header:"Importe",dataKey:"importe"}
            ],
            columns3:[
                {header:"Cajero",dataKey:"cajero"},
                {header:"Descripcion",dataKey:"descripcion"},
                {header:"Importe",dataKey:"importe"}
            ],
            nombre:"Reporte de Cobranza"
        }
        ImprimirExcel(configuracion, cajero.numero);
    }
    console.log(cajero)
    
    return (
        <>
            <div className='container w-full  max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3 '>
                <div className='flex justify-start p-3 '>
                    <h1 className='text-4xl font-xthin text-black dark:text-white md:px-12'>
                        Reporte Resumen de Cobranza
                    </h1>
                </div>
                <div className='container grid grid-cols-8 grid-rows-1 h-[calc(100%-20%)] '>
                    <div className='col-span-1 flex flex-col '>
                        <Acciones home={home} ImprimePDF={ImprimePDF} ImprimeExcel={ImprimeExcel} />
                    </div>
                    <div className='col-span-7'>
                        <div className='flex flex-col md:flex-row h-[calc(100%)]'>
                            <div className='flex flex-col'>
                                <label className='input input-bordered input-md text-black dark:text-white flex items-center gap-3'>
                                    Fecha Inicia
                                    <input
                                        type="date"
                                        value={fechaIni}
                                        onChange={(e) => setFechaIni(e.target.value)}
                                        className='text-black dark:text-white'
                                    />
                                </label>
                            </div>
                            <div className='flex flex-col'>
                                <label className='input input-bordered input-md text-black dark:text-white flex items-center gap-3'>
                                    Fecha Final
                                    <input
                                        type="date"
                                        value={fechaFin}
                                        onChange={(e) => setFechaFin(e.target.value)}
                                        className='text-black dark:text-white'
                                    />
                                </label>
                            </div>
                            <div className='flex flex-col'>
                                <BuscarCat
                                    table={"cajeros"}
                                    titulo={"Cajeros: "}
                                    token={session.user.token}
                                    fieldsToShow={["numero", "nombre"]}
                                    nameInput={["numero", "nombre"]}
                                    setItem={setCajero}
                                    modalId={"modal_Cajeros"}
                                />
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </>
    )
}

export default Rep_Femac_6
