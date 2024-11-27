import React from 'react'

function Inputs({
    Titulo,
    name,
    message,
    register,
    errors,
    requerido,    
    className,
    tamañolabel,
    arreglos
}) {
  return (
    <div className="w-full md:w-1/2 px-0.5 py-2 mb-2 md:mb-0">
        <label
          className={`input input-bordered  input-sm md:input-md flex items-center gap-3 ${tamañolabel} text-black dark:text-white`}
        >
          {Titulo}
          <select
            name={name}
            id={name}
            className={`text-black dark:text-white bg-transparent dark: ${className}`}
            {...register(name, {
              ...(requerido && { required: message }),
            })}
            // disabled={isDisabled}
          >
            <option
              value=""
              className="bg-transparent text-black dark:text-white dark:bg-[#1d232a]"
            >
              Seleccione una opción
            </option>
            {arreglos.map((arreglo) => (
              <option
                className="bg-transparent text-black dark:text-white dark:bg-[#1d232a]"
                key={arreglo.id}
                value={arreglo.id}
              >
                {arreglo.descripcion}
              </option>
            ))}
          </select>
        </label>
        {errors[name] && (
          <span className="text-red-500 text-sm mt-2">
            {errors[name].message}
          </span>
        )}
      </div>
  )
}

export default Inputs
