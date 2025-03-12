import React from "react";

function Inputs({
  Titulo,
  name,
  type,
  errors,
  maxLength,
  isDisabled,
  setValue,
  value,
  conteClassName="flex flex-col",
  labelClassName="input input-bordered input-md text-black dark:text-white flex items-center gap-3",
  inputClassName="text-black dark:text-white"
}) {
  return (
    <div className={conteClassName}>
      <label
        className={labelClassName}>
        {Titulo}
        <input
          {...(maxLength !== 0 && { maxLength: maxLength })}
          name={name}
          id={name}
          type={type}
          className={inputClassName}
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
