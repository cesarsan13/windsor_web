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
    if (type === "double") {
        return (
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="text-slate-500 mb-2 block" htmlFor={name}>
                    {titulo}
                </label>
                <input
                    type="number"
                    name={name}
                    className="p-3 rounded block bg-neutral-900 text-white w-full"
                    placeholder={titulo}
                    step="any"
                    min="0"
                    {...register(name, {
                        ...(requerido && { required: message }),
                    })}
                />
                {errors[name] && requerido && (
                    <span className="text-red-500 text-sm">{errors[name].message}</span>
                )}
            </div>
        );
    } if (type === "number") {
        return (
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="text-slate-500 mb-2 block" htmlFor={name}>
                    {titulo}
                </label>
                <input
                    type="number"
                    name={name}
                    className="p-3 rounded block bg-neutral-900 text-white w-full"
                    placeholder={titulo}
                    step="any"
                    min="0"
                    onKeyPress={(event) => {
                        if (!/[0-9.]/.test(event.key)) {
                            event.preventDefault();
                        }
                    }}
                    {...register(name, {
                        ...(requerido && { required: message }),
                    })}
                />
                {errors[name] && requerido && (
                    <span className="text-red-500 text-sm">{errors[name].message}</span>
                )}
            </div>
        );
    } if (type === "checkbox") {
        return (
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="text-slate-500 mb-2 block" htmlFor={name}>
                    {titulo}
                </label>
                <div className="form-control bg-neutral-900 flex items-center space-x-2 rounded p-3">
                    <label className="label cursor-pointer flex items-center gap-2">
                        <input
                            type="checkbox"
                            name={name}
                            className="checkbox border-2 border-neutral-300"
                            {...register(name, {
                                ...(requerido && { required: message }),
                            })}
                        />
                        <span className="label-text text-white text-left">{titulo}</span>
                    </label>
                </div>
                {errors[name] && requerido && (
                    <span className="text-red-500 text-sm">{errors[name].message}</span>
                )}
            </div>
        );
    } else {
        return (
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="text-slate-500 mb-2 block" htmlFor={name}>
                    {titulo}
                </label>
                <input
                    type={type}
                    name={name}
                    className="p-3 rounded block bg-neutral-900 text-white w-full"
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


    
}

export default TextComponent;
