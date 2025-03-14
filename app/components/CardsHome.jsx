import React from 'react'

function CardsHome({ titulo, value, descripcion }) {
    return (
        <div className="stats shadow bg-base-200 dark:bg-[#1d232a]">
            <div className="stat">
                <div className="stat-title text-sm truncate text-neutral-600 dark:text-white">{titulo}</div>
                <div className="stat-value text-xl md:text-4xl text-neutral-600 dark:text-white">{value || ""}</div>
                <div className="stat-desc text-xs md:text-sm truncate text-neutral-600 dark:text-white">
                    {descripcion}
                </div>
            </div>
        </div>
    )
}

export default CardsHome;