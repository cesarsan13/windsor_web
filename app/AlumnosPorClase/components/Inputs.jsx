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
  setFormaHorarioAPC,
}) {

  if (type === 'select') {
    return (
      <div className="flex flex-col">
        <label className={`input input-bordered input-md text-black dark:text-white flex items-center gap-3 ${tamañolabel}`}>
          {Titulo}
          <select
            name={name}
            id={name}
            className={`text-black dark:text-white ${className}`}
          >
            <option value="">&nbsp;&nbsp; ... &nbsp;&nbsp;</option>
            { setFormaHorarioAPC.map((option) => (
              <option key={option.numero} value={option.numero}>
                {option.horario}
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

  } if (type === 'text'){
  return ( 
    <div className="flex flex-col">
      <label
        className={`input input-bordered input-md text-black dark:text-white flex items-center gap-3 ${tamañolabel}`}>
        {Titulo}
        <input
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

export default Inputs;
