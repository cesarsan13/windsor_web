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
      <div className='flex flex-col'>
        <label htmlFor={name} className={`input input-bordered input-md text-black dark:text-white flex items-center gap-3 ${tamañolabel}`}>
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
                className={`text-black dark:text-white ${className}`}
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
      <div className='flex flex-col'>
        <label htmlFor={name} className={`input input-bordered input-md text-black dark:text-white flex items-center gap-3 ${tamañolabel}`}>
          {Titulo}
          <select
          name={name}
          className={`text-black dark:text-white ${className}`}
          id={name}
          disabled={isDisabled}
          {...register(name, {
            ...(requerido && { required: message }),
          })}
        >
          <option value="">--Seleccione una opcion--</option>
          <option value="NIÑOS">Niños</option>
          <option value="NIÑAS">Niñas</option>
          <option value="MIXTO">Mixto</option>
        </select>
        </label>
        
        {errors[name] && requerido && (
          <span className="text-red-500 text-sm">{errors[name].message}</span>
        )}
      </div>
    )
  } if (type === 'text') {    
    return (
      <div className="flex flex-col">
        <label
          className={`input input-bordered text-black dark:text-white input-md flex items-center gap-3 ${tamañolabel}`}
        >
          {Titulo}
          <input
            // defaultValue={defaultValue}
            {...(maxLenght !== 0 && { maxLength: maxLenght })}
            name={name}
            id={name}
            type={type}
            className={`text-black dark:text-white ${className}`}
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
