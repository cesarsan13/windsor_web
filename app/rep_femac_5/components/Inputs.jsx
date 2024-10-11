import { soloDecimales, soloEnteros } from "@/app/utils/globalfn";
import React from "react";

function Inputs({
  Titulo,
  name,
  type,
  className,
  errors,
  tamañolabel,
  maxLength,
  isDisabled,
  setValue,
  value,
}) {
  return (
    <div className="flex flex-col">
      <label
        className={`input input-bordered input-md text-black dark:text-white flex items-center gap-3 ${tamañolabel}`}>
        {Titulo}
        <input
          {...(maxLength !== 0 && { maxLength: maxLength })}
          name={name}
          id={name}
          type={type}
          className={`text-black dark:text-white ${className}`}
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
