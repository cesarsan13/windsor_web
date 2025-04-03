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
  handleBlur,
  eventInput,
  valueInput,
  dataType,
  onClick,
  message,

}) {
  if (tipoInput === "onChange") {
    return (
      <div className="flex flex-col">
        <label
          className={`input input-bordered input-sm md:input-md text-black dark:text-white flex items-center gap-3 ${tamañolabel}`}
        >
          {Titulo}
          <input
            {...(maxLenght !== 0 && { maxLength: maxLenght })}
            name={name}
            id={name}
            type={type}
            className={`text-black dark:text-white ${className}`}
            disabled={isDisabled}
            onFocus={(e) => e.target.select()}
          />
        </label>
        {errors[name] && (
          <span className="text-red-500 text-sm mt-2">
            {errors[name].message}
          </span>
        )}
      </div>
    );
  } else if (tipoInput === "valueDisabled") {
    return (
      <div className="flex flex-col">
        <label
          className={`input input-bordered input-sm md:input-md text-black dark:text-white flex items-center gap-3 ${tamañolabel}`}
        >
          {Titulo}
          <input
            {...(maxLenght !== 0 && { maxLength: maxLenght })}
            name={name}
            id={name}
            type={type}
            className={`text-black dark:text-white ${className}`}
            disabled={isDisabled}
            onFocus={(e) => e.target.select()}
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
  } else if (tipoInput === "enterEvent") {
    return (
      <div className="flex flex-col">
        <label
          className={`input input-bordered input-sm md:input-md text-black dark:text-white flex items-center gap-3 ${tamañolabel}`}
        >
          {Titulo}
          <input
            {...(maxLenght !== 0 && { maxLength: maxLenght })}
            name={name}
            id={name}
            type={type}
            onFocus={(e) => e.target.select()}
            className={`grow dark:text-neutral-200 join-item input-xs md:input-sm border-b-2 border-slate-300 dark:border-slate-700 text-neutral-600 rounded-r-none  ${className}`}
            disabled={isDisabled}
            onKeyDown={(evt) => eventInput(evt)}
            onBlurCapture={(event) => handleBlur(event, type)}
            onClick={onClick}
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
  } else if (tipoInput === "disabledInput") {
    return (
      <input
        {...(maxLenght !== 0 && { maxLength: maxLenght })}
        name={name}
        id={name}
        type={type}
        className={`input input-bordered bg-gray-100 dark:bg-slate-800 text-black dark:text-white input-sm md:input-md flex items-center gap-3 ${className}`}
        disabled={isDisabled}
        value={valueInput}
        {...register(name, {
          ...(requerido && { required: message }),
        })}
      />
    );
  } else if (tipoInput === "disabledInputRecargo") {
    return (
      <input
        {...(maxLenght !== 0 && { maxLength : maxLenght })}
        name={name}
        id={name}
        type={type}
        className={`input input-bordered bg-gray-100 dark:bg-slate-800 text-black dark:text-white input-sm md:input-md flex items-center gap-3 ${className}`}
        disabled={isDisabled}
        value={valueInput}
        {...register(name, {
          ...(requerido && { required: message }),
        })}
        ref={register(name).ref}
      />
    );
  } else if (tipoInput === "numberDouble") {
    return (
      <div className="w-full md:w-1/2 ">
        <label
          className={`input input-bordered input-sm md:input-md flex items-center gap-3 ${tamañolabel} text-black dark:text-white`}
        >
          {Titulo}
          <input
            {...(maxLenght !== 0 && { maxLength: maxLenght })}
            name={name}
            id={name}
            type={type}
            onFocus={(e) => e.target.select()}
            className={`grow dark:text-neutral-200 join-item input-xs md:input-sm border-b-2 border-slate-300 dark:border-slate-700 text-neutral-600 rounded-r-none  ${className}`}
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
  } else if (tipoInput === "formatNumber") {
    return (
      <div className="flex flex-col">
        <label
          className={`input input-bordered input-sm md:input-md text-black dark:text-white flex items-center gap-3 ${tamañolabel}`}
        >
          {Titulo}
          <input
            {...(maxLenght !== 0 && { maxLength: maxLenght })}
            name={name}
            id={name}
            type={type}
            onFocus={(e) => e.target.select()}
            className={`grow dark:text-neutral-200 join-item input-xs md:input-sm border-b-2 border-slate-300 dark:border-slate-700 text-neutral-600 rounded-r-none  ${className}`}
            disabled={isDisabled}
            onKeyDown={(evt) => soloDecimales(evt)}
            onBlurCapture={(event) => handleBlur(event, type)}
            onClick={onClick}
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
  } else if (tipoInput === "formatNumberRecargo") {
    return (
      <div className="flex flex-col">
        <label
          className={`input input-bordered input-sm md:input-md text-black dark:text-white flex items-center gap-3 ${tamañolabel}`}
        >
          {Titulo}
          <input
            {...(maxLenght !== 0 && { maxLength: maxLenght })}
            name={name}
            id={name}
            type={type}
            onFocus={(e) => e.target.select()}
            className={`grow dark:text-neutral-200 join-item input-xs md:input-sm border-b-2 border-slate-300 dark:border-slate-700 text-neutral-600 rounded-r-none  ${className}`}
            disabled={isDisabled}
            onKeyDown={(evt) => soloDecimales(evt)}
            onBlurCapture={(event) => handleBlur(event, type)}
            onClick={onClick}
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
          className={`input input-bordered input-sm md:input-md text-black dark:text-white flex items-center gap-3 ${tamañolabel}`}
        >
          {Titulo}
          <input
            {...(maxLenght !== 0 && { maxLength: maxLenght })}
            name={name}
            id={name}
            type={type}
            className={`grow dark:text-neutral-200 join-item input-xs md:input-sm border-b-2 border-slate-300 dark:border-slate-700 text-neutral-600 rounded-r-none ${className}`}
            disabled={isDisabled}
            onFocus={(e) => e.target.select()}
            {...(dataType === "int" && { onKeyDown: soloEnteros })}
            {...(dataType === "float" && { onKeyDown: soloDecimales })}
            {...(dataType === "int" ||
              (dataType === "float" && {
                onBlur: (event) => handleBlur(event, dataType),
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
