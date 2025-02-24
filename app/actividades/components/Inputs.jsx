import { soloDecimales, soloEnteros } from '@/app/utils/globalfn'
import React from 'react'
import { showSwal } from '@/app/utils/alerts';

function Inputs({
    Titulo,
    name,
    message,
    register,
    errors,
    requerido,
    type,
    dataType,
    className,
    tamañolabel,
    maxLenght,
    isDisabled,
    handleBlur,
    arreglos,
    onChange
}) {

  if (errors && Object.keys(errors).length > 0) {
    showSwal("Error", "Complete todos los campos requeridos", "error", "my_modal_3");
  }

    if (type === 'selectAsignatura') {
        return (
          <div className="w-full md:w-3/4 px-0.5 py-2 mb-2 md:mb-0">
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
                  onChange: (e) => {
                    onChange && onChange(e);
                  }
                })}
                disabled={isDisabled}
                // onChange={(e) => onChange && onChange(e)}
              >
                <option value="" className="bg-transparent text-black dark:text-white dark:bg-[#1d232a]">
                  Seleccione una opción
                </option>
                {arreglos.map((arreglo) => (
                  <option
                    className="bg-transparent text-black dark:text-white dark:bg-[#1d232a]"
                    key={arreglo.numero}
                    value={arreglo.numero}
                  >
                    {arreglo.descripcion}
                  </option>
                ))}
              </select>
            </label>
            {errors[name] && requerido && (
              <span className="text-red-500 text-sm font-semibold">{errors[name].message}</span>
            )}
          </div>
        );
      }
    return (
        <div className='flex flex-col'>
            <label className={`input input-bordered input-sm md:input-md flex items-center gap-3 ${tamañolabel} text-black dark:text-white`}>
                {Titulo}
                <input
                    {...(maxLenght !== 0 && { maxLength: maxLenght })}
                    name={name}
                    id={name}
                    type={type}
                    className={`text-black dark:text-white border-b-2 border-slate-300 dark:border-slate-700 input-xs md:input-sm ${className}`}
                    {...(dataType === "int" && { onKeyDown: soloEnteros })}
                    {...(dataType === "float" && { onKeyDown: soloDecimales })}
                    {...register(name, {
                        ...(requerido && { required: message }),
                    })}
                    {...(dataType === "int" ||
                        (dataType === "float" && {
                            onBlur: (event) => handleBlur(event, dataType),
                        }))}
                    disabled={isDisabled}
                />
            </label>
            {errors[name] && (
                <span className="text-red-500 text-sm mt-2 font-semibold">
                    {errors[name].message}
                </span>
            )}
        </div>
    )
}

export default Inputs
