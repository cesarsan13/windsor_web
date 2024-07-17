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
}) {
  if (type === 'select') {
    return (
      <div className="w-full md:w-1/2 px-0.5 py-2 mb-6 md:mb-0">
        <label className={`input input-bordered input-md flex items-center gap-3 ${tamañolabel}`}>
          {Titulo}
          <select
            name={name}
            id={name}
            className={className}
            {...register(name, {
              ...(requerido && { required: message }),
            })}
            disabled={isDisabled}
          >
            {arreglos.map((arreglo) => (
              <option key={arreglo.id} value={arreglo.id}>{arreglo.descripcion}</option>
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

  } else {
    return (
      <div className="w-full md:w-1/2 px-0.5 py-2 mb-6 md:mb-0">
        <label
          className={`input input-bordered input-md flex items-center gap-3 ${tamañolabel}`}
        >
          {Titulo}
          <input
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