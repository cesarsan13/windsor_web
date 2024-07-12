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
  defaultValue,
  isDisabled,
  handleBlur,
  options,
}) {

  if (type === 'select') {
    return (
      <div className="flex flex-col">
        <label className={`input input-bordered input-md flex items-center gap-3 ${tamañolabel}`}>
          {Titulo}
          <select
            name={name}
            id={name}
            className={className}
            {...register(name, {
              ...(requerido && { required: message }),
              onBlur: (event) => handleBlur(event, dataType),
            })}

            disabled={isDisabled}>
            <option value={"S"}>Si</option>
            <option value={"N"}>No</option>
          </select>
        </label>
        {errors[name] && (
          <span className="text-red-500 text-sm mt-2">
            {errors[name].message}
          </span>
        )}
      </div>
    );

  } else {

  return (
    <div className="flex flex-col">
      <label
        className={`input input-bordered input-md flex items-center gap-3 ${tamañolabel}`}>
        {Titulo}
        <input
          // defaultValue={defaultValue}
          {...(maxLenght !== 0 && { maxLength: maxLenght })}
          name={name}
          id={name}
          type={type}
          className={className}
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
