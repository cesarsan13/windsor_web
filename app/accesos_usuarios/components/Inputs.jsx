import React from "react";
import { showSwal } from "@/app/utils/alerts";

function Inputs({
  Titulo,
  name,
  message,
  register,
  errors,
  requerido,
  tamañolabel
}) {
  if (errors && Object.keys(errors).length > 0) {
      showSwal(
        "Error",
        "Complete todos los campos requeridos",
        "error",
        "my_modal_3"
      );
  }

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
        <span className="text-red-500 text-sm mt-2 font-semibold">
          {errors[name].message}
        </span>
      )}
    </div>
  );
}

export default Inputs;
