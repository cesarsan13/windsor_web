import React from "react";
import { useForm } from "react-hook-form";
import Inputs from "@/app/formfact/components/Inputs";
import { useEffect } from "react";
function PropertyPage({
  selectedLabel,
  setSelectedLabel,
  setLabels,
  selectedIndex,
  labels,
}) {
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
  useEffect(() => {
    reset({
      columna: selectedLabel.columna_impresion,
      campo: selectedLabel.numero_archivo,
      font: selectedLabel.font_nombre,
      formato: selectedLabel.formato,
      renglon: selectedLabel.renglon_impresion,
      texto: selectedLabel.descripcion_campo,
      area: selectedLabel.tipo_campo,
    });
  }, [selectedLabel, reset]);
  const handleChange = (evt) => {
    const antes = selectedLabel.columna_impresion;
    const name = evt.target.attributes.name.value;
    const { value } = evt.target;
    console.log("antes", name, antes, value);
    switch (name) {
      case "columna":
        // alert(value);

        const resultado = labels.map((lbl, idx) => {
          return idx === parseInt(selectedIndex)
            ? { ...lbl, columna_impresion: parseInt(value) }
            : lbl;
        });
        setLabels(resultado);
        setSelectedLabel(labels[selectedIndex]);

        // selectedLabel.columna_impresion = value;
        break;
      default:
        break;
    }
    const despues = selectedLabel;
    console.log("despues", despues);
    // reset(selectedLabel);
  };

  return (
    <div className="flex flex-col card bg-white rounded-lg ">
      <div className=" bg-slate-400 w-full p-2 rounded-lg rounde">
        <h3 className="text-center font-bold">
          Propiedades de Texto {selectedLabel.numero_dato}
        </h3>
      </div>
      <div className="flex flex-col p-2">
        <form action="">
          <Inputs
            dataType={"int"}
            name={"columna"}
            tamañolabel={"w-full input-xs"}
            className={"w-full text-right input-xs"}
            Titulo={"Columna: "}
            type={"number"}
            requerido={true}
            errors={errors}
            register={register}
            message={"columna requerido"}
            isDisabled={false}
            handleChange={handleChange}
          />
          <div className="divider mt-0 mb-0"></div>
          <Inputs
            dataType={"string"}
            name={"campo"}
            tamañolabel={"w-full input-xs"}
            className={"w-full text-left input-xs"}
            Titulo={"Campo: "}
            type={"select"}
            requerido={true}
            errors={errors}
            register={register}
            message={"Campo requerido"}
            isDisabled={false}
            //defaultValue={formaPago.id}
          />
          <div className="divider mt-0 mb-0"></div>
          <Inputs
            dataType={"string"}
            name={"font"}
            tamañolabel={"w-full input-xs"}
            className={"w-full text-left input-xs"}
            Titulo={"Fuente: "}
            type={"select"}
            requerido={true}
            errors={errors}
            register={register}
            message={"Fuente requerido"}
            isDisabled={false}
            //defaultValue={formaPago.id}
          />
          <div className="divider mt-0 mb-0"></div>
          <Inputs
            dataType={"string"}
            name={"formato"}
            tamañolabel={"w-full input-xs"}
            className={"w-full text-left input-xs"}
            Titulo={"Formato: "}
            type={"select"}
            requerido={true}
            errors={errors}
            register={register}
            message={"Formato requerido"}
            isDisabled={false}
            //defaultValue={formaPago.id}
          />
          <div className="divider mt-0 mb-0"></div>
          <Inputs
            dataType={"int"}
            name={"renglon"}
            tamañolabel={"w-full input-xs"}
            className={"w-full text-right input-xs"}
            Titulo={"Renglon: "}
            type={"number"}
            requerido={true}
            errors={errors}
            register={register}
            message={"Renglon requerido"}
            isDisabled={false}
          />
          <div className="divider mt-0 mb-0"></div>
          <Inputs
            dataType={"string"}
            name={"texto"}
            tamañolabel={"w-full input-xs"}
            className={"w-full text-left input-xs"}
            Titulo={"Texto: "}
            type={"text"}
            requerido={true}
            errors={errors}
            register={register}
            message={"Texto requerido"}
            isDisabled={false}
          />
          <div className="divider mt-0 mb-0"></div>
          <Inputs
            dataType={"string"}
            name={"area"}
            tamañolabel={"w-full input-xs"}
            className={"w-full text-left input-xs"}
            Titulo={"Area: "}
            type={"select"}
            requerido={true}
            errors={errors}
            register={register}
            message={"Area requerido"}
            isDisabled={false}
            //defaultValue={formaPago.id}
          />
          <div className="divider mt-0 mb-0"></div>
        </form>
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
