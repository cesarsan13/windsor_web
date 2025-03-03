import { soloDecimales, soloEnteros } from "@/app/utils/globalfn";
import React from "react";

function Inputs({
  Titulo,
  name,
  type,
  requerido,
  dataType,
  className,
  register,
  message,
  errors,
  tamañolabel,
  maxLenght,
  isDisabled,
  handleBlur,
  arreglos,
  pattern,
  message_pattern,
  onKeyDown
}) {

  if (type === "select") {
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
            disabled={isDisabled}
          >
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
          <span className="text-red-500 text-sm mt-2 font-semibold">
            {errors[name].message}
          </span>
        )}
      </div>
    );
  } else {
    return (
      <div className="w-full md:w-1/2 px-0.5 py-2 mb-2 md:mb-0">
        <label
          className={`input input-bordered input-sm md:input-md flex items-center gap-3 ${tamañolabel} text-black dark:text-white`}
        >
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
              maxLength: {
                value: maxLenght,
                message: `El campo ${name} no puede tener más de ${maxLenght} caracteres`,
              },
              ...(pattern && {
                pattern: { value: pattern, message: message_pattern },
              }),
              ...(requerido && { required: message }),
            })}
            {...(dataType === "int" ||
              (dataType === "float" && {
                onBlur: (event) => handleBlur(event, dataType),
              }))}
            disabled={isDisabled}
            onKeyDown={onKeyDown}
          />
        </label>
        {errors[name] && (
          <span className="text-red-500 text-sm mt-2 font-semibold">
            {errors[name].message}
          </span>
        )}
      </div>
    );
  }
}

export default Inputs;
