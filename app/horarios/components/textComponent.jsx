import React from 'react'
import Select from 'react-select'
import { Controller } from 'react-hook-form'

function Textcomponent({
    titulo,
    name,
    message,
    register,
    errors,
    requerido,
    control,
    options,
    onChange,
    value,
    type
}) {
    if (type === 'multi-select') {
        return (
            <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
                <label htmlFor={name} className='text-slate-500 mb-2 block'>
                    {titulo}
                </label>
                <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                        <Select
                            {...field}
                            isMulti
                            options={options}
                            className='rounded block text-black  w-full'
                            classNamePrefix='select'
                            value={value}
                            onChange={onChange}
                        />
                    )}
                />
                {errors[name] && requerido && (
                    <span className="text-red-500 text-sm">{errors[name].message}</span>
                )}
            </div>
        )
    } if (type === "select") {
        return (
            <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
                <label htmlFor={name} className='text-slate-500 mb-2 block'>
                    {titulo}
                </label>
                <select
                    name={name}
                    className='select w-full'
                    id={name}
                    {...register(name, {
                        ...(requerido && { required: message }),
                    })}
                >
                    <option value="">--Seleccione una opcion--</option>
                    <option value="NIÑOS">Niños</option>
                    <option value="NIÑAS">Niñas</option>
                    <option value="MIXTO">Mixto</option>
                </select>
                {errors[name] && requerido && (
                    <span className="text-red-500 text-sm">{errors[name].message}</span>
                )}
            </div>
        )
    } if (type === "number") {
        return (
            <div className='w-full  md:w-1/2 px-3 mb-6 md:mb-0'>
                <label htmlFor={name} className='text-slate-500 mb-2 block'>
                    {titulo}
                </label>
                <input
                    type={"text"}
                    name={name}
                    id={name}
                    className='p-3 rounded block w-full'
                    placeholder={titulo}
                    {...register(name, {
                        ...(requerido && { required: message }),
                        pattern: {
                            value: /^[0-9]+$/,
                            message: 'Solo se permiten números',
                        },
                    })}
                />
                {errors[name] && requerido && (
                    <span className="text-red-500 text-sm">{errors[name].message}</span>
                )}
            </div>
        )
    } else {
        return (
            <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
                <label htmlFor={name} className='text-slate-500 mb-2 block'>
                    {titulo}
                </label>
                <input
                    type={type}
                    name={name}
                    id={name}
                    className='p-3 rounded block w-full'
                    placeholder={titulo}
                    {...register(name, {
                        ...(requerido && { required: message }),
                    })}
                />
                {errors[name] && requerido && (
                    <span className="text-red-500 text-sm">{errors[name].message}</span>
                )}
            </div>
        )
    }
}

export default Textcomponent
