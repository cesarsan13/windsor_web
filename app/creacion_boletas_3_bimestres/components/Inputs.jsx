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
  arreglos,
  options,
}) {
  if (type === "select") {
    return (
      <div className="w-full md:w-1/2 px-0.5 py-2 mb-2 md:mb-0">
        <label
          htmlFor={name}
          className={`input input-bordered input-sm md:input-md flex items-center gap-3 ${tamañolabel} text-black dark:text-white`}
        >
          {Titulo}
          <select
            name={name}
            className={`text-black dark:text-white bg-transparent ${className}`}
            id={name}
            {...register(name, {
              ...(requerido && { required: message }),
            })}
            disabled={isDisabled}
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
        {errors[name] && requerido && (
          <span className="text-red-500 text-sm">{errors[name].message}</span>
        )}
      </div>
    );
  }  else if (type === "checkbox") {
    return (
      <div className="w-full md:w-1/2 px-0.5 py-2 mb-2 md:mb-0 flex items-center">
        <input
          type="checkbox"
          id={name}
          name={name}
          className={`checkbox checkbox-md ${className} ${
            isDisabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          {...register(name, {
            ...(requerido && { required: message }),
          })}
          disabled={isDisabled}
        />
        <label
          htmlFor={name}
          className={`ml-2 text-black dark:text-white cursor-pointer ${
            isDisabled ? "line-through" : ""
          }`}
        >
          {Titulo}
        </label>
        {errors[name] && requerido && (
          <span className="text-red-500 text-sm ml-2">
            {errors[name].message}
          </span>
        )}
      </div>
    );
  } else if (type === "radio") {
    return (
      <div className="w-full md:w-1/2 px-0.5 py-2 mb-2 md:mb-0">
        <span className="text-black dark:text-white">{Titulo}</span>
        <div className="flex flex-col text-black dark:text-white">
          {options.map((option) => (
            <label key={option.value} className="flex items-center mb-2">
              <input
                type="radio"
                name={name}
                value={option.value}
                className={`mr-2 ${className} radio  checked:text-neutral-600 dark:text-neutral-200`}
                {...register(name, {
                  ...(requerido && { required: message }),
                })}
                disabled={isDisabled}
                defaultChecked={true}
              />
              {option.label}
            </label>
          ))}
        </div>
        {errors[name] && requerido && (
          <span className="text-red-500 text-sm">{errors[name].message}</span>
        )}
      </div>
    );
  } else {
    return (
      <div className="w-full md:w-1/2 px-0.5 py-2 mb-2 md:mb-0">
        <label
          htmlFor={name}
          className={`input input-bordered input-sm md:input-md flex items-center gap-3 ${tamañolabel} text-black dark:text-white`}
        >
          {Titulo}
          <input
            {...(maxLenght !== 0 && { maxLength: maxLenght })}
            name={name}
            id={name}
            type={type}
            className={`grow dark:text-neutral-200 join-item input-xs md:input-sm border-b-2 border-slate-300 dark:border-slate-700 text-neutral-600 rounded-r-none w-auto ${className}`}
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

export default Inputs;
