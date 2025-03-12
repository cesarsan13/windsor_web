import React from 'react'

function CardsHome({ titulo, value, descripcion, valueImp, mes }) {
    return (
        <div className="w-full card  bg-transparent  items-center p-5 mb-4">
            <div className="w-full sticky top-0 flex justify-center ">
                <div className="grid grid-flow-row text-neutral-600 dark:text-white">
                    <h1 className="font-bold text-black my-4">Alumnos inscritos del mes de {mes}</h1>
                        <div className="stats shadow bg-base-200 dark:bg-[#1d232a] ">
                            <div className="stat">
                                <div className="stat-title text-sm truncate text-neutral-600 dark:text-white">{titulo}</div>
                                <div className="stat-value text-xl md:text-4xl text-neutral-600 dark:text-white">{value || "0"}</div>
                                <div className="stat-desc text-xs md:text-sm truncate text-neutral-600 dark:text-white">
                                    {descripcion}
                                </div>
                                <div className="stat-value text-xl md:text-4xl text-neutral-600 dark:text-white">${valueImp || "0"}</div>
                            </div>
                        </div>
                </div>
            </div>
        </div>
        
    )
}

export default CardsHome;