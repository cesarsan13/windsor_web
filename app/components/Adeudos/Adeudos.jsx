import React from 'react'
import ListView from '@/app/components/Adeudos/ListView';

function Adeudos({ adeudos, mesActual }) {
    return (
        <div className='w-full card  bg-transparent  items-center p-5 mb-4'>
            <div className='w-full sticky top-0 flex justify-center my-4'>
                <div className='grid grid-flow-row'>
                    <h1 className='font-bold text-black'>Adeudos del mes de {mesActual}</h1>
                    
                </div>
            </div>
            <ListView adeudos={adeudos}></ListView>
        </div>
    )
}

export default Adeudos
