import { soloDecimales, soloEnteros } from "@/app/utils/globalfn";
import React from "react";

function Inputs({
  Titulo,
  name,
  type,
  dataType,
  errors,
  register,
  tamañolabel,
  maxLength,
  isDisabled,
  className,
  requerido,
}) {
  return (
    <div className="w-full md:w-full px-0.5  md:mb-0">
      <label
        className={`input input-bordered input-sm md:input-md flex items-center gap-3 ${tamañolabel} text-black dark:text-white`}
        style={{ whiteSpace: "nowrap" }}
      >
        {Titulo}
        <input
          {...(maxLength !== 0 && { maxLength: maxLength })}
          name={name}
          id={name}
          type={type}
          className={`text-black dark:text-white border-b-2 border-slate-300 dark:border-slate-700 input-xs md:input-sm ${className}`}
          {...(dataType === "int" && { onKeyDown: soloEnteros })}
          {...(dataType === "float" && { onKeyDown: soloDecimales })}
          {...register(name, {
            maxLength: {
              value: maxLength,
              message: `El campo ${name} no puede tener más de ${maxLength} caracteres`,
            },
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

export default Inputs;
