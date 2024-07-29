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
  handleChange,
  data,
  step,
}) {
  return type !== "select" ? (
    <div className="flex flex-col">
      <label className={`input   flex items-center  ${tamañolabel}`}>
        {Titulo}
        <input
          {...(step && { step: step })}
          {...(handleChange && { onChangeCapture: (evt) => handleChange(evt) })}
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
            (dataType === "float" &&
              handleBlur && {
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
  ) : (
    <div className="flex flex-col">
      <label
        className={`input  text-black dark:text-white flex items-center ${tamañolabel}`}
      >
        {Titulo}
        <select
          {...(handleChange && { onChangeCapture: (evt) => handleChange(evt) })}
          name={name}
          id={name}
          className={`text-black dark:text-white ${className}`}
          {...register(name, {
            ...(requerido && { required: message }),
          })}
        >
          {data && name === "font_nombre"
            ? Object.entries(data).map(([key, value]) => (
                <option key={key} value={value}>
                  {value}
                </option>
              ))
            : Object.entries(data).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
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
  );
}

export default Inputs;
