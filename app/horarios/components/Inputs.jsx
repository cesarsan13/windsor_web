import { soloDecimales, soloEnteros } from "@/app/utils/globalfn";
import React from "react";
import Select from "react-select";
import { Controller } from "react-hook-form";
import { showSwal } from "@/app/utils/alerts";

function Inputs({
  Titulo,
  name,
  message,
  register,
  errors,
  requerido,
  control,
  options,
  onChange,
  value,
  type,
  dataType,
  className,
  tamañolabel,
  maxLenght,
  isDisabled,
  handleBlur,
  arreglos,
}) {

  if (errors && Object.keys(errors).length > 0) {
    showSwal("Error", "Complete todos los campos requeridos", "error", "my_modal_3");
  }

  const styles = {
    control: (styles) => ({
      ...styles,
      width: "100%",
      minHeight: "48px",
      maxWidth: "400px",
      overflow: "hidden",
      backgroundColor: "bg-white dark:bg-[#1d232a]",
    }),
    valueContainer: (styles) => ({
      ...styles,
      display: "flex",
      flexWrap: "nowrap",
      overflowX: "auto",
      maxWidth: "100%",
    }),
    multiValue: (styles) => ({
      ...styles,
      borderRadius: "4px",
      fontSize: "16px",
    }),
    multiValueLabel: (styles) => ({
      ...styles,
      fontSize: "14px",
    }),
  };

  if (type === "multi-select") {
    return (
      <div className="flex flex-col">
        <label className={tamañolabel}>
          {Titulo}
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                closeMenuOnSelect={false}
                isMulti
                isDisabled={isDisabled}
                options={options}
                className={className}
                classNamePrefix="react-select"
                value={value}
                onChange={onChange}
                styles={styles}
                placeholder={"Días"}
              />
            )}
          />
        </label>
        {errors[name] && requerido && (
          <span className="text-red-500 text-sm font-semibold">
            {errors[name].message}
          </span>
        )}
      </div>
    );
  }

  if (type === "select") {
    return (
      <div className="w-full md:w-1/2 px-0.5 py-2 mb-2 md:mb-0">
        <label
          htmlFor={name}
          className={`input input-bordered input-sm md:input-md flex items-center gap-3 ${tamañolabel} text-black dark:text-white`}
        >
          {Titulo}
          <select
            name={name}
            className={`text-black dark:text-white ${
              isDisabled
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white"
            } ${className}`}
            id={name}
            {...register(name, {
              ...(requerido && { required: message }),
            })}
            disabled={isDisabled}
          >
            <option
              value=""
              className="bg-transparent text-black dark:text-white dark:bg-[#1d232a]"
            >
              Seleccione una opción
            </option>
            {arreglos.map((arreglo) => (
              <option
                className="bg-transparent text-black dark:text-white dark:bg-[#1d232a]"
                key={arreglo.id}
                value={arreglo.id}
              >
                {arreglo.descripcion}
              </option>
            ))}
          </select>
        </label>
        {errors[name] && requerido && (
          <span className="text-red-500 text-sm font-semibold">
            {errors[name].message}
          </span>
        )}
      </div>
    );
  }

  if (type === "text") {
    return (
      <div className="flex flex-col">
        <label
          className={`input input-bordered input-sm md:input-md flex items-center gap-3 ${tamañolabel} text-black dark:text-white`}
        >
          {Titulo}
          <input
            {...(maxLenght !== 0 && { maxLength: maxLenght })}
            name={name}
            id={name}
            type={type}
            className={`text-black dark:text-white border-b-2 border-slate-300 dark:border-slate-700 input-xs md:input-sm ${
              isDisabled
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : ""
            } ${className}`}
            {...(dataType === "int" && { onKeyDown: soloEnteros })}
            {...(dataType === "float" && { onKeyDown: soloDecimales })}
            {...register(name, {
              ...(requerido && { required: message }),
            })}
            {...(dataType === "int" ||
              (dataType === "float" && {
                onBlur: (event) => handleBlur(event, dataType),
              }))}
            disabled={isDisabled}
          />
        </label>
        {errors[name] && (
          <span className="text-red-500 text-sm mt-2 font-semibold">
            {errors[name].message}
          </span>
        )}
      </div>
    );
  }
}

export default Inputs;
