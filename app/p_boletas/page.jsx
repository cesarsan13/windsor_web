'use client'
import React, { useEffect, useState } from 'react'
import Acciones from './components/Acciones'
import Busqueda from './components/Busqueda'
import { useSession } from 'next-auth/react';
import TablaCalificaciones from './components/tablaCalificaciones';
import { getCalificaciones, getMateriasGrupo } from '../utils/api/calificaciones/calificaciones';

function P_Boletas() {
    const { data: session, status } = useSession();
    const [grupo, setGrupo] = useState([])
    const [alumnosHorario, setAlumnosHorario] = useState([])
    const [materias, setMaterias] = useState([])
    const [bimestre, setBimestre] = useState("")
    const [isLoading, setisLoading] = useState(false);
    // useEffect(() => {
    //     if (status === "loading" || !session) {
    //         return;
    //     }
    //     const fetchData = async ()=>{
    //         setisLoading(true)
    //         const {token}=session.user
    //         const data = await getMateriasGrupo(token,grupo.numero)
    //         setMaterias(data)
    //         setisLoading(false)
    //     }
    //     fetchData()
    // },[grupo])
    const Buscar = async () => {
        const { token } = session.user
        const data = await getMateriasGrupo(token, grupo)
        let calificaciones = []
        setisLoading(true)
        data.forEach(async (materia) => {
            for (let a = 1; a <= bimestre; a++) {
                console.log("voy en ", a);
                const data = await getCalificaciones(token, grupo.horario, materia.numero, a, alumnosHorario.numero);
                console.log("data bimestre", a, ": ", data);

                // Verificar si la materia ya existe en el arreglo de calificaciones
                let materiaExistente = calificaciones.find(cal => cal.materia === materia.descripcion);

                if (materiaExistente) {
                    // Si ya existe, actualizamos el campo dinámico correspondiente al bimestre
                    materiaExistente[`EB${a}`] = data.calificacion;
                } else {
                    // Si no existe, creamos una nueva entrada
                    calificaciones.push({
                        materia: materia.descripcion,
                        area: materia.area,
                        EB1:0,
                        EB2:0,
                        EB3:0,
                        EB4:0,
                        EB5:0,
                        [`EB${a}`]: data.calificacion,                        
                    });
                }
            }


            console.log("calificaciones:", calificaciones)
        });
        setisLoading(false)
    }
    if (status === "loading") {
        return (
            <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
        );
    }
    const handleBusquedaChange = (event) => {
        event.preventDefault;
        setBimestre(event.target.value);
    }
    return (
        <>
            <div className='container h-[80vh] w-full max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden'>
                <div className='flex flex-col justify-start p-3'>
                    <div className='flex flex-wrap md:flex-nowrap items-start md:items-center'>
                        <div className='order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0'>
                            <Acciones
                                Buscar={Buscar}
                            />
                        </div>
                        <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
                            Creación de Boletas
                        </h1>
                    </div>
                </div>
                <div className='flex flex-col items-center h-full'>
                    <div className='w-full max-w-4xl'>
                        <Busqueda
                            session={session}
                            setItem1={setGrupo}
                            setItem2={setAlumnosHorario}
                            item1={grupo}
                            item2={alumnosHorario}
                            handleBusquedaChange={handleBusquedaChange}
                        />
                        <TablaCalificaciones
                            Calificaciones={materias}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default P_Boletas
