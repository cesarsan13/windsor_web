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
  generales,
}) {
  if (type === "toogle") {
    return (
      <div className="form-control w-52">
        <label className={`label cursor-pointer ${tamañolabel}`}>
          <span className="label-text">{Titulo}</span>
          <input
            type="checkbox"
            name={name}
            id={name}
            className="toggle toggle-success"
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
      // <div className="flex flex-col">
      //   <label
      //     className={`input input-bordered input-md flex items-center gap-3 ${tamañolabel} text-black dark:text-white`}
      //     disabled={isDisabled}
      //   >
      //     {Titulo}
      //     <select
      //       name={name}
      //       id={name}
      //       className={`text-black  dark:text-white bg-transparent dark: ${className}`}
      //       {...register(name, {
      //         ...(requerido && { required: message }),
      //       })}
      //       disabled={isDisabled}
      //     >
      //       {generales.map((arreglo) => (
      //         <option
      //           className="bg-transparent text-black dark:text-white dark:bg-[#1d232a]"
      //           key={arreglo.id}
      //           value={arreglo.id}
      //         >
      //           {arreglo.descripcion}
      //         </option>
      //       ))}
      //     </select>
      //   </label>
      //   {errors[name] && (
      //     <span className="text-red-500 text-sm mt-2">
      //       {errors[name].message}
      //     </span>
      //   )}
      // </div>
    );
  }
  if (type === "text") {
    return (
      <div className="flex flex-col">
        <label
          className={`input input-bordered input-md flex items-center gap-3 ${tamañolabel} text-black dark:text-white`}
        >
          {Titulo}
          <input
            {...(maxLenght !== 0 && { maxLength: maxLenght })}
            name={name}
            id={name}
            type={type}
            className={`text-black dark:text-white border-b-2 border-slate-300 dark:border-slate-700  ${className}`}
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
