import React from "react";
export default function Inputs({
  titulo,
  name,
  message,
  register,
  errors,
  requerido,
  type,
}) {
  return type === "text" ||
    type === "email" ||
    type === "date" ||
    type === "time" ||
    type === "password" ||
    type === "datetime-local" ? (
    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
      <label htmlFor={name} className="text-slate-500 mb-2 block">
        {titulo}
      </label>
      <input
        type={type}
        name={name}
        className="input input-bordered w-full "
        placeholder={titulo}
        {...register(name, {
          ...(requerido && { required: message }),
        })}
        {...(type === "time" && { min: "07:00:00", max: "19:00" })}
      />
      {errors[name] && requerido && (
        <span className="text-red-500 text-sm">{errors[name].message}</span>
      )}
    </div>
  ) : (
    <></>
  );
}
