import { soloDecimales, soloEnteros,snToBool } from "@/app/utils/globalfn";
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
  setValue,
  value,
  getValues,
}) {
  if (type === "select") {
    return (
      <div className="">
        <label
        // className={`input input-bordered input-sm md:input-md flex items-center gap-3 ${tamañolabel}  text-black dark:text-white`}

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
            onChange={(event) => setValue(event.target.value)}
            value={value||1} onClick={(e) => setValue(e.target.value)}
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
            {/* <option value={"Activo"}>Activo</option>
            <option value={"Enfermo"}>Enfermo</option>
            <option value={"Permiso"}>Permiso</option>
            <option value={"Cartera"}>Cartera</option>
            <option value={"Baja"}>Baja</option> */}
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
  else if (type === 'inputNum') {
    return (
      <div className="flex flex-col">
        <label
        className={`input input-bordered input-sm md:input-md flex items-center gap-3 ${tamañolabel}  text-black dark:text-white`}
        >
          {Titulo}
          <input
            {...(maxLenght !== 0 && { maxLength: maxLenght })}
            name={name}
            id={name}
            type={"text"}
            className={`text-black dark:text-white border-b-2 border-slate-300 dark:border-slate-700 input-xs md:input-sm  ${className}`}
            {...(dataType === "int" && { onKeyDown: soloEnteros })}
            {...(dataType === "float" && { onKeyDown: soloDecimales })}
            {...register(name, {
              maxLength: {
                value: maxLenght,
                message: `El campo ${name} no puede tener más de ${maxLenght} caracteres`,
              },
              ...(requerido && { required: message }),
              // onBlur: handleBlur,
            })}
            disabled={isDisabled}
            onBlurCapture={(event) => handleBlur(event, type)}
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
  else if(type === 'checkbox'){
    return (
    <div className="flex flex-col w-full">
        <label
          className={`input input-bordered  md:input-md flex items-center gap-3 ${tamañolabel} text-black dark:text-white`}
        >
          {Titulo}
          <input
            // defaultValue={defaultValue}
            {...(maxLenght !== 0 && { maxLength: maxLenght })}
            name={name}
            id={name}
            type={"checkbox"}
            className={`text-black dark:text-white border-b-2 border-slate-300 dark:border-slate-700 input-xs md:input-sm  ${className}`}
            // checked={snToBool(getValues(name))}
            {...register(name, {
              maxLength: {
                value: maxLenght,
                message: `El campo ${name} no puede tener más de ${maxLenght} caracteres`,
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
  else {
    return (
      <div className="flex flex-col w-full">
        <label
          className={`input input-bordered input-sm md:input-md flex items-center gap-3 ${tamañolabel} text-black dark:text-white`}
        >
          {Titulo}
          <input
            // defaultValue={defaultValue}
            {...(maxLenght !== 0 && { maxLength: maxLenght })}
            name={name}
            id={name}
            type={type}
            className={`text-black dark:text-white border-b-2 border-slate-300 dark:border-slate-700 input-xs md:input-sm  ${className}`}
            {...(dataType === "int" && { onKeyDown: soloEnteros })}
            {...(dataType === "float" && { onKeyDown: soloDecimales })}
            {...register(name, {
              maxLength: {
                value: maxLenght,
                message: `El campo ${name} no puede tener más de ${maxLenght} caracteres`,
              },
              ...(requerido && { required: message }),
            })}
            {...(dataType === "int" ||
              (dataType === "float" && {
                onBlur: (event) => handleBlur(event, dataType),
              }))}
            disabled={isDisabled}
            onChange={(event) => setValue(event.target.value)}
            // onBlurCapture={(event) => handleBlur(event, type)}
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
