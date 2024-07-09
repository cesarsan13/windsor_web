import { soloEnteros } from "@/app/utils/globalfn";
import React from "react";

function Inputs({
  Titulo,
  name,
  type,
  requerido,
  isNumero,
  className,
  register,
  message,
  errors,
  tamañolabel,
  maxLenght,
  defaultValue,
  isDisabled,
}) {
  return (
    <div className="flex flex-col">
      <label
        className={`input input-bordered input-md flex items-center gap-3 ${tamañolabel}`}
      >
        {Titulo}
        <input
          // defaultValue={defaultValue}
          {...(maxLenght !== 0 && { maxLength: maxLenght })}
          name={name}
          id={name}
          type={type}
          className={className}
          {...(isNumero && { onKeyDown: soloEnteros })}
          {...register(name, {
            ...(requerido && { required: message }),
          })}
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
