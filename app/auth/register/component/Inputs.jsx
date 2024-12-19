import React from "react";

export default function Inputs({
  titulo,
  name,
  message,
  register,
  errors,
  requerido,
  type,
  opciones,
  handleChange,
}) {
  return type === "text" ||
    type === "email" ||
    type === "date" ||
    type === "time" ||
    type === "password" ||
    type === "datetime-local" ? (
    <div className="w-full px-3 mb-6 md:mb-0">
      <label htmlFor={name} className="text-slate-500 mb-2 block">
        {titulo}
      </label>
      <input
        type={type}
        name={name}
        className="p-3 rounded block text-slate-400 w-full"
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
  ) : type === "select" ? (
    <div className="w-full px-3 mb-6 md:mb-0">
      <label className="text-slate-500 mb-2 block" htmlFor={name}>
        {titulo}
      </label>
      <select
        name={name}
        className="p-3 rounded block text-slate-400 w-full"
        {...register(name, {
          ...(requerido && { required: message }),
          onChange: (evt) => handleChange && handleChange(evt),
        })}
      >
        <option
          value=""
          className="bg-transparent text-black dark:text-white dark:bg-[#1d232a]"
        >
          Seleccione una opción
        </option>
        {opciones &&
          opciones.map((opcion) => (
            <option
              className="bg-transparent text-black dark:text-white dark:bg-[#1d232a]"
              key={opcion.id}
              value={opcion.id}
            >
              {opcion.nombre}
            </option>
          ))}
      </select>
      {errors[name] && requerido && (
        <span className="text-red-500 text-sm">{errors[name].message}</span>
      )}
    </div>
  ) : (
    <></>
  );
}
