import { soloDecimales, soloEnteros } from "@/app/utils/globalfn";
import React from "react";

function Inputs({
  tipoInput,
  Titulo,
  name,
  register,
  requerido,
  type,
  className,
  errors,
  tamañolabel,
  maxLenght,
  isDisabled,
  setValue,
  eventInput,
  valueInput,
  dataType,
}) {
  if (tipoInput === 'onChange') {
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
            disabled={isDisabled}
          // onChange={(event) => setValue(event.target.value)}
          />
        </label>
        {errors[name] && (
          <span className="text-red-500 text-sm mt-2">
            {errors[name].message}
          </span>
        )}
      </div>
    );
  } else if (tipoInput === 'valueDisabled') {
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
            disabled={isDisabled}
            value={valueInput}
            {...register(name, {
              ...(requerido && { required: message }),
            })}
          />
        </label>
        {errors[name] && (
          <span className="text-red-500 text-sm mt-2">
            {errors[name].message}
          </span>
        )}
      </div>
    );
  } else if (tipoInput === 'enterEvent') {
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
            disabled={isDisabled}
            onKeyDown={(evt) => eventInput(evt)}
            {...register(name, {
              ...(requerido && { required: message }),
            })}
          />
        </label>
        {errors[name] && (
          <span className="text-red-500 text-sm mt-2">
            {errors[name].message}
          </span>
        )}
      </div>
    );
  } else if (tipoInput === 'disabledInput') {
    return (
      <input
        name={name}
        id={name}
        type={type}
        className={`input input-bordered bg-gray-100 dark:bg-slate-800 text-black dark:text-white input-md flex items-center gap-3 ${className}`}
        disabled={isDisabled}
        value={valueInput}
        {...register(name, {
          ...(requerido && { required: message }),
        })}
      />
    );
  } else if (tipoInput === 'numberDouble') {
    return (
      <div className="w-full md:w-1/2 px-0.5 py-2 mb-6 md:mb-0">
        <label
          className={`input input-bordered input-md flex items-center gap-3 ${tamañolabel} text-black dark:text-white`}
        >
          {Titulo}
          <input
            {...(maxLenght !== 0 && { maxLength: maxLenght })}
            name={name}
            id={name}
            type={type}
            className={`text-black dark:text-white ${className}`}
            {...(dataType === "int" && { onKeyDown: soloEnteros })}
            {...(dataType === "float" && { onKeyDown: soloDecimales })}
            {...(dataType === "int" ||
              (dataType === "float" && {
                onBlur: (event) => eventInput(event, dataType),
              }))}
            disabled={isDisabled}
            value={valueInput}
            {...register(name, {
              ...(requerido && { required: message }),
            })}
          />
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
          className={`input input-bordered input-md text-black dark:text-white flex items-center gap-3 ${tamañolabel}`}>
          {Titulo}
          <input
            {...(maxLenght !== 0 && { maxLength: maxLenght })}
            name={name}
            id={name}
            type={type}
            className={`text-black dark:text-white ${className}`}
            disabled={isDisabled}
            {...(dataType === "int" && { onKeyDown: soloEnteros })}
            {...(dataType === "float" && { onKeyDown: soloDecimales })}
            {...(dataType === "int" ||
              (dataType === "float" && {
                onBlur: (event) => eventInput(event, dataType),
              }))}
            {...register(name, {
              ...(requerido && { required: message }),
            })}
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
