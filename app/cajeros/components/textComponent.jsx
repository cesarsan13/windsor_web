import React from "react";

function TextComponent({
  titulo,
  name,
  message,
  register,
  errors,
  requerido,
  type,
}) {
  return (
    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
      <label className="text-slate-500 mb-2 block" htmlFor="username">
        {titulo}
      </label>
      <input
        type={type}
        name={name}
        className="p-3 rounded block bg-white-900 text-slate-900 w-full"
        placeholder={titulo}
        {...register(name, {
          ...(requerido && { required: message }),
        })}
      />
      {errors[name] && requerido && (
        <span className="text-red-500 text-sm">{errors[name].message}</span>
      )}
    </div>
  );
}

export default TextComponent;
