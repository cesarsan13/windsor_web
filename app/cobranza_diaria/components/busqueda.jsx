import BuscarCat from '@/app/components/BuscarCat'
import { soloEnteros } from '@/app/utils/globalfn'
import iconos from '@/app/utils/iconos'
import Image from 'next/image'
import React from 'react'

function Busqueda({
  setItem,
  session,
  handleBusquedaChange,
  handleBusqueda,
  fecha,
  setCheque,
}) {
  return (
    <div className='flex flex-col space-y-4'>
      <div className='w-full flex flex-col md:flex-row gap-2 flex-wrap'>
        <label className='input input-bordered input-sm md:input-md flex items-center gap-3 w-full md:w-1/6 text-black dark:text-white'>
          Recibo
          <input
            type="text"
            name="recibo"
            id="recibo"
            className='text-black dark:text-white border-b-2 border-slate-300 w-full md:w-2/6 dark:border-slate-700 input-xs md:input-sm'
            onKeyDown={soloEnteros}
            onChange={(event) => handleBusquedaChange(event)}
          />
        </label>
        <label className='input input-bordered input-sm md:input-md flex items-center gap-3 w-full md:w-3/12 text-black dark:text-white'>
          Fecha
          <input
            type='date'
            name='fecha'
            id='fecha'
            onChange={(event)=>handleBusqueda(event)}
            value={fecha}
            className='text-black dark:text-white border-b-2 border-slate-300 w-full md:w-4/5 dark:border-slate-700 input-xs md:input-sm'
          />
        </label>
        <BuscarCat
          table={"alumnos"}
          fieldsToShow={["numero", "nombre"]}
          nameInput={["numero", "nombre"]}
          titulo={"Alumnos: "}
          setItem={setItem}
          token={session.user.token}
          modalId="modal_horario1"
          alignRight={"text-right"}
          inputWidths={{ contdef: "180px", first: "70px", second: "150px" }}
        />
        <label className="flex items-center gap-2">
          <input
            id="ch_cheques"
            type="checkbox"
            className="checkbox checkbox-md"
            onClick={(evt) => setCheque(evt.target.checked)}
          />
          <span className="label-text font-bold text-neutral-600 dark:text-neutral-200">
          Solo cheques
          </span>
        </label>
      </div>
    </div>
  )
}

export default Busqueda
