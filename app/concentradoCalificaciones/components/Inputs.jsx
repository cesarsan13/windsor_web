import { soloDecimales, soloEnteros } from "@/app/utils/globalfn";
import React from "react";

function Inputs({
  Titulo,
  name,
  type,
  requerido,
  dataType,
  className,
  message,
  errors,
  tamañolabel,
  maxLenght,
  isDisabled,
  handleBlur,
  register,
  arreglos
}) {




  if (type === 'select') {
    return (
      <div className="w-full md:w-1/2 px-0.5 mb-2 md:mb-0">
        <label
          htmlFor={name}
          className={`input input-bordered  input-sm md:input-md flex items-center gap-3 ${tamañolabel} text-black dark:text-white`}
        >
          {Titulo}
          <select
            name={name}
            className={`text-black dark:text-white bg-transparent dark: ${className}`}
            id={name}
            {...register(name, {
              ...(requerido && { required: message }),
            })}
            disabled={isDisabled}
          >
            <option value={0} className="bg-transparent text-black dark:text-white dark:bg-[#1d232a]">
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
        {errors[name] && requerido && (
          <span className="text-red-500 text-sm">{errors[name].message}</span>
        )}
      </div>
    );
  } 
}

export default Inputs;