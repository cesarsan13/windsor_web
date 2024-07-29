'use client'
import React from 'react'
import { useState } from 'react'
import { formatDate } from '../utils/globalfn';
import BuscarCat from '../components/BuscarCat';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

function RepFemac12Anexo() {
    const date = new Date();
    const dateStr = formatDate(date);
    const router = useRouter();
    const { data: session, status } = useSession();
    console.log(session)
    const [fecha1, setFecha1] = useState(dateStr.replace(/\//g, '-'))
    const [fecha2, setFecha2] = useState(dateStr.replace(/\//g, '-'))
    const [producto1, setProducto1] = useState({})
    const [producto2, setProducto2] = useState({})
    const [sOrdenar, ssetordenar] = useState('nombre');

    if (status === "loading") {
        return (
            <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
        );
    }
    const handleCheckChange = (event) =>{
        event.preventDefault;
        ssetordenar(event.target.value);
      }
    return (
        <>
            <div className='container w-full  max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3'>
                <div className='flex justify-start p-3'>
                    <h1 className='text-4xl font-xthin text-black dark:text-white md:px-12'>
                        Reporte de Cobranza Productos
                    </h1>
                </div>
                <div className='container grid grid-cols-8 grid-rows-1 h-[calc(100%-20%)]'>
                    <div className='col-span-1 flex flex-col'>

                    </div>
                    <div className='col-span-7'>
                        <div className='flex flex-col h-[calc(100%)]'>
                            <div className='flex flex-col gap-4 md:flex-row'>
                                <div className='w-full sm:w-full md:w-4/12 lg:w-3/12'>
                                    <label className='input input-bordered input-md text-black dark:text-white flex items-center gap-3'>
                                        Fecha Inicia
                                        <input
                                            type="date"
                                            value={fecha1}
                                            onChange={(e) => setFecha1(e.target.value)}
                                            className='text-black dark:text-white'
                                        />
                                    </label>
                                </div>
                                <div className='w-full sm:w-full md:w-4/12 lg:w-3/12'>
                                    <label className='input input-bordered input-md text-black dark:text-white flex items-center gap-3'>
                                        Fecha Inicia
                                        <input
                                            type="date"
                                            value={fecha2}
                                            onChange={(e) => setFecha2(e.target.value)}
                                            className='text-black dark:text-white'
                                        />
                                    </label>
                                </div>

                                <div className='w-6/12'>
                                    <BuscarCat
                                        table={'productos'}
                                        nameInput={['producto1', 'producto_desc1']}
                                        fieldsToShow={['id', 'descripcion']}
                                        titulo={'Producto: '}
                                        setItem={setProducto1}
                                        token={session.user.token}
                                        modalId={'modal_producto1'}
                                    />
                                </div>
                            </div>
                            <div className='flex flex-col gap-4 md:flex-row'>
                                <div className='w-6/12'>
                                    <BuscarCat
                                        table={'productos'}
                                        nameInput={['producto2', 'producto_desc2']}
                                        fieldsToShow={['id', 'descripcion']}
                                        titulo={'Producto: '}
                                        setItem={setProducto2}
                                        token={session.user.token}
                                        modalId={'modal_producto2'}
                                    />
                                </div>
                                <div className="">
                                    <label className={` input-md text-black dark:text-white flex items-center gap-3`}>
                                        <span className="text-black dark:text-white">Ordenar por:</span>
                                        <label className={` input-md text-black dark:text-white flex items-center gap-3`} onChange={(event) => handleCheckChange(event)} >
                                            <span className="text-black dark:text-white">Nombre</span>
                                            <input type="radio" name="ordenar" value="nombre" className="radio" />
                                        </label>
                                        <label className={` input-md text-black dark:text-white flex items-center gap-3`} onChange={(event) => handleCheckChange(event)}>
                                            <span className="text-black dark:text-white">Número</span>
                                            <input type="radio" name="ordenar" value="id" className="radio" />
                                        </label>
                                    </label>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RepFemac12Anexo
