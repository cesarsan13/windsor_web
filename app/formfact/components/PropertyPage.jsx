import React from "react";
import { useForm } from "react-hook-form";
import Inputs from "@/app/formfact/components/Inputs";
function PropertyPage({ selectedLabel }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      columna: selectedLabel.columna_impresion,
      campo: selectedLabel.numero_archivo,
      font: selectedLabel.font_nombre,
      formato: selectedLabel.formato,
      renglon: selectedLabel.renglon_impresion,
      texto: selectedLabel.descripcion_campo,
      area: selectedLabel.tipo_campo,
    },
  });
  return (
    <div className="flex flex-col card bg-slate-300 rounded-lg ">
      <div className=" bg-slate-400 w-full p-2 rounded-lg rounde">
        <h3 className="text-center font-bold">
          Propiedades de Texto {selectedLabel.numero_dato}
        </h3>
      </div>
      <div className="flex flex-col p-2">
        <Inputs
          dataType={"int"}
          name={"columna"}
          tamañolabel={"w-4/6"}
          className={"w-3/6 text-right"}
          Titulo={"Columna: "}
          type={"number"}
          requerido={true}
          errors={errors}
          register={register}
          message={"columna requerido"}
          isDisabled={false}
          //defaultValue={formaPago.id}
        />
        <Inputs
          dataType={"string"}
          name={"campo"}
          tamañolabel={"w-4/6"}
          className={"w-3/6 text-right"}
          Titulo={"Campo: "}
          type={"select"}
          requerido={true}
          errors={errors}
          register={register}
          message={"Campo requerido"}
          isDisabled={false}
          //defaultValue={formaPago.id}
        />
      </div>
      <div
        className={`tooltip tooltip-top my-5  "hover:cursor-pointer"
              `}
        data-tip="Guardar"
      >
        <button
          type="submit"
          id="btn_guardar"
          className="btn  bg-blue-500 hover:bg-blue-700 text-white"
        >
          <i className="fa-regular fa-floppy-disk mx-2"></i> Guardar
        </button>
      </div>
    </div>
  );
}

export default PropertyPage;
