import { soloDecimales, soloEnteros } from "@/app/utils/globalfn";
import React from "react";

function Inputs({
  Titulo,
  name,
  type,
  className,
  errors,
  dataType,
  tamañolabel,
  maxLenght,
  isDisabled,
  setValue,
  value,
}) {
  return (
    <div className="flex flex-col ">
      <label
        className={`input input-bordered input-md text-black dark:text-white flex items-center gap-3 ${tamañolabel}`}>
        {Titulo}
        <input
          {...(maxLenght !== 0 && { maxLength: maxLenght })}
          name={name}
          id={name}
          type={type}
          className={`text-black dark:text-white ${className}  grow dark:text-neutral-200 join-item border-b-2 border-slate-300 dark:border-slate-700 text-neutral-600 rounded-r-none`}
          {...(dataType === "int" && { onKeyDown: soloEnteros })}
          {...(dataType === "float" && { onKeyDown: soloDecimales })}
          {...(dataType === "int" ||
            (dataType === "float" && {
              onBlur: (event) => handleBlur(event, dataType),
            }))}
          disabled={isDisabled}
          value={value} 
          onChange={(event) => setValue(event.target.value)}
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