import React from "react";

function Inputs({
  Titulo,
  name,
  message,
  register,
  errors,
  requerido,
  tamañolabel
}) {
  return (
    <div className="form-control w-52">
      <label className={`label cursor-pointer ${tamañolabel}`}>
        <span className="label-text">{Titulo}</span>
        <input
          name={name}
          id={name}
          type="checkbox"
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
  );
}

export default Inputs;
