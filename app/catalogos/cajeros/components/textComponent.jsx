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
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0 my-3">
            <label className="input input-bordered flex items-center gap-2" htmlFor="username">
                {titulo} : 
            <input
                type={type}
                name={name}
                className="grow"
                {...register(name, {
                    ...(requerido && { required: message }),
                })}
            />
            </label>
            {errors[name] && requerido && (
                <span className="text-red-500 text-sm">{errors[name].message}</span>
            )}
        </div>
    );
}

export default TextComponent;
