import { soloDecimales, soloEnteros } from "@/app/utils/globalfn";
import React from 'react'
import Select from 'react-select'
import { Controller } from 'react-hook-form'

function Inputs({
  Titulo,
  name,
  message,
  register,
  errors,
  requerido,
  control,
  options,
  onChange,
  value,
  type,
  dataType,
  className,
  tamañolabel,
  maxLenght,
  isDisabled,
  handleBlur,
}) {
  if (type === 'multi-select') {
    return (
      <div className="w-full md:w-1/2 px-0.5 py-2 mb-6 md:mb-0">
        <label className={`input input-bordered input-md flex items-center gap-3 ${tamañolabel} text-black dark:text-white`}>
          {Titulo}
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                isMulti
                isDisabled={isDisabled}
                options={options}
                className={`text-black ${className}`}
                classNamePrefix='select'
                value={value}
                onChange={onChange}
              />
            )}
          />
        </label>

        {errors[name] && requerido && (
          <span className="text-red-500 text-sm">{errors[name].message}</span>
        )}
      </div>
    )
  } if (type === "select") {
    return (
      <div className="w-full md:w-1/2 px-0.5 py-2 mb-6 md:mb-0">
        <label className={`input input-bordered input-md flex items-center gap-3 ${tamañolabel} text-black dark:text-white`}>
          {Titulo}
          <select
            name={name}
            className={`text-black dark:text-white bg-transparent dark: ${className}`}
            id={name}
            disabled={isDisabled}
            {...register(name, {
              ...(requerido && { required: message }),
            })}
          >
            <option value="" className="bg-transparent text-black dark:text-white dark:bg-[#1d232a]">--Seleccione una opcion--</option>
            <option value="NIÑOS" className="bg-transparent text-black dark:text-white dark:bg-[#1d232a]">Niños</option>
            <option value="NIÑAS" className="bg-transparent text-black dark:text-white dark:bg-[#1d232a]">Niñas</option>
            <option value="MIXTO" className="bg-transparent text-black dark:text-white dark:bg-[#1d232a]">Mixto</option>
          </select>
        </label>

        {errors[name] && requerido && (
          <span className="text-red-500 text-sm">{errors[name].message}</span>
        )}
      </div>
    )
  } if (type === 'text') {
    return (
      <div className="w-full md:w-1/2 px-0.5 py-2 mb-6 md:mb-0">
        <label
          className={`input input-bordered input-md flex items-center gap-3 ${tamañolabel} text-black dark:text-white`}
        >
          {Titulo}
          <input
            // defaultValue={defaultValue}
            {...(maxLenght !== 0 && { maxLength: maxLenght })}
            name={name}
            id={name}
            type={type}
            className={`text-black dark:text-white border-b-2 border-slate-300 dark:border-slate-700 ${className}`}
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
          <span className="text-red-500 text-sm mt-2">
            {errors[name].message}
          </span>
        )}
      </div>
    );
  }
}

export default Inputs
