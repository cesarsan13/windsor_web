import React from 'react'

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
                    {...(maxLenght !== 0 && { maxLength: maxLenght })}
                    name={name}
                    id={name}
                    type={type}
                    className={inputClassName}
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
    )
}

export default Inputs
