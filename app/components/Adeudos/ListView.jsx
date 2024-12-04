import { formatDate } from '@/app/utils/globalfn';
import iconos from '@/app/utils/iconos';
import Image from 'next/image';
import React, { useEffect, useRef } from 'react'

function ListView({ adeudos }) {
    const adeudoRefl = useRef(null);
    const primeradeudol = useRef(null);
    useEffect(() => {
        if (adeudoRefl.current) {
            adeudoRefl.current.scrollIntoView({
                behavior: "smooth",
                inline: "center", // Centra el elemento horizontalmente
                block: "nearest",
            });
        }
    }, [])
    let alu_Ant = 0;            
    const fecha = new Date();
    const fechaHoy = formatDate(fecha).replace(/\//g, "-")
    const documentos = adeudos.documentos?.filter((doc)=>doc.fecha === fechaHoy)
    const alumnos = adeudos.alumnos
    const saldosPorAlumno = documentos?.reduce((acc, documento) => {
        const saldo = documento.importe - documento.importe * (documento.descuento / 100);
        if (!acc[documento.alumno]) {
            acc[documento.alumno] = { total: 0, nombre: '' };
        }
        acc[documento.alumno].total += saldo;        
        if (!acc[documento.alumno].nombre) {
            const data = alumnos.find((alumno) => alumno.numero === documento.alumno);
            acc[documento.alumno].nombre = data?.nombre || "Sin nombre";
        }
    
        return acc;
    }, {});
    return (
        <div className='carousel carousel-vertical carousel-center rounded-box h-96 w-64 flex  gap-1'>
            {documentos?.map((documento, idx) => {
                let mostrar = alu_Ant !== documento.alumno;
                alu_Ant = documento.alumno;
                const data =alumnos.find((alumno)=>alumno.numero === documento.alumno)
                const saldoAlumno = saldosPorAlumno[documento.alumno]?.total || 0;
                const nombreAlumno = saldosPorAlumno[documento.alumno]?.nombre || "Sin nombre";                
                return (
                    <>
                        {mostrar && (                            
                            <div className='carousel-item bg-base-200 dark:bg-[#1d232a] rounded-box p-2 m-2 w-4/5 h-10 grid grid-rows-2 grid-cols-4 grid-flow-col' key={idx}>
                                <div className='bg-base-200 dark:bg-[#1d232a] row-span-2 col-span-1 grid content-center justify-items-center w-16 '>
                                    {
                                        <>
                                            <Image
                                                width={26}
                                                alt={documento.alumno}
                                                src={iconos.recargo}
                                                className="block dark:hidden "
                                            ></Image>
                                            <Image
                                                width={26}
                                                alt={documento.alumno}
                                                src={iconos.recargo_w}
                                                className="hidden dark:block"
                                            ></Image>
                                        </>
                                    }
                                </div>
                                <div
                                    className={`col-span-3 text-xs text-black dark:text-white content-center font-thin
                                }`}
                                >
                                    <p className="truncate">{nombreAlumno}</p>
                                </div>
                                <div
                                    className={`col-span-3 text-xs text-black dark:text-white content-center font-thin
                                }`}
                                >
                                    <p>$ {saldoAlumno.toFixed(2)}</p>
                                </div>
                            </div>                            
                        )}
                    </>
                )
            })}
        </div>
    )
}

export default ListView
