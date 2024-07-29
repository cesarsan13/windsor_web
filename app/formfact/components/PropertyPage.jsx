import React from "react";
import { useForm } from "react-hook-form";
import Inputs from "@/app/formfact/components/Inputs";
import { useEffect } from "react";
import { confirmSwal, showSwal } from "@/app/utils/alerts";
import { updateFormat } from "@/app/utils/api/formfact/formfact";
function PropertyPage({
  setLabels,
  selectedIndex,
  labels,
  propertyData,
  setShowSheet,
  setSelectedIndex,
  session,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      columna_impresion: labels[selectedIndex].columna_impresion,
      numero_archivo: labels[selectedIndex].numero_archivo,
      font_nombre: labels[selectedIndex].font_nombre,
      formato: labels[selectedIndex].formato,
      renglon_impresion: labels[selectedIndex].renglon_impresion,
      descripcion_campo: labels[selectedIndex].descripcion_campo,
      tipo_campo: labels[selectedIndex].tipo_campo,
    },
  });
  useEffect(() => {
    reset({
      columna_impresion: labels[selectedIndex].columna_impresion,
      numero_archivo: labels[selectedIndex].numero_archivo,
      font_nombre: labels[selectedIndex].font_nombre,
      formato: labels[selectedIndex].formato,
      renglon_impresion: labels[selectedIndex].renglon_impresion,
      descripcion_campo: labels[selectedIndex].descripcion_campo,
      tipo_campo: labels[selectedIndex].tipo_campo,
    });
  }, [selectedIndex, labels, reset]);
  const handleChange = (evt) => {
    const { name, value } = evt.target;
    const resultado = [...labels];

    resultado[selectedIndex] = {
      ...resultado[selectedIndex],
      [name]:
        name !== "font_nombre" &&
        name !== "numero_archivo" &&
        name !== "formato" &&
        name !== "tipo_campo"
          ? parseInt(value)
          : String(value),
    };
    console.log(resultado[selectedIndex]);
    setLabels(resultado);
  };
  const handleCancelarClick = (evt) => {
    evt.preventDefault();
    setShowSheet(false);
    setSelectedIndex(null);
    setLabels([]);
  };
  const handleGuardarClick = async (evt) => {
    evt.preventDefault();
    const confirmed = await confirmSwal(
      "¿Desea continuar?",
      "Se actualizaran los valores del formato",
      "question",
      "Si",
      "Cancelar"
    );
    if (confirmed) {
      // console.log("llegamos al update format");
      const res = await updateFormat(session.user.token, labels);
      console.log(res);
    } else {
      return;
    }
  };
  return (
    <div className="flex flex-col card bg-white rounded-lg ">
      <div className=" bg-slate-400 w-full p-2 rounded-lg rounde">
        <h3 className="text-center font-bold">
          Propiedades de Texto {labels[selectedIndex].numero_dato}
        </h3>
      </div>
      <div className="flex flex-col p-2">
        <form action="">
          <div className="collapse collapse-arrow bg-base-200">
            <input type="radio" name="my-accordion-2" defaultChecked />
            <div className="collapse-title text-xl font-medium">Posicion</div>
            <div className="collapse-content grid gap-2">
              <Inputs
                dataType={"int"}
                name={"columna_impresion"}
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
                step="10"
              />
              <Inputs
                dataType={"int"}
                name={"renglon_impresion"}
                tamañolabel={"w-full input-xs"}
                className={"w-full text-right input-xs"}
                Titulo={"Renglon: "}
                type={"number"}
                requerido={true}
                errors={errors}
                register={register}
                message={"Renglon requerido"}
                isDisabled={false}
                handleChange={handleChange}
                step="10"
              />
            </div>
          </div>

          <div className="divider mt-0 mb-0"></div>

          <div className="divider mt-0 mb-0"></div>
          <div className="collapse collapse-arrow bg-base-200">
            <input type="radio" name="my-accordion-2" defaultChecked />
            <div className="collapse-title text-xl font-medium">Fuente</div>
            <div className="collapse-content">
              <Inputs
                dataType={"string"}
                name={"font_nombre"}
                tamañolabel={"w-full input-xs"}
                className={"w-full text-left input-xs"}
                Titulo={"Fuente: "}
                type={"select"}
                requerido={true}
                errors={errors}
                register={register}
                message={"Fuente requerido"}
                isDisabled={false}
                data={propertyData.fuente}
                handleChange={handleChange}
                //defaultValue={formaPago.id}
              />
            </div>
          </div>
          <div className="divider mt-0 mb-0"></div>
          <div className="collapse collapse-arrow bg-base-200">
            <input type="radio" name="my-accordion-2" defaultChecked />
            <div className="collapse-title text-xl font-medium">Texto</div>
            <div className="collapse-content grid gap-2">
              <Inputs
                dataType={"string"}
                name={"descripcion_campo"}
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
              <Inputs
                dataType={"string"}
                name={"numero_archivo"}
                tamañolabel={"w-full input-xs"}
                className={"w-full text-left input-xs"}
                Titulo={"Campo: "}
                type={"select"}
                requerido={true}
                errors={errors}
                register={register}
                message={"Campo requerido"}
                isDisabled={false}
                data={propertyData.campo}
                //defaultValue={formaPago.id}
              />
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
                data={propertyData.formato}
                //defaultValue={formaPago.id}
              />
              <Inputs
                dataType={"string"}
                name={"tipo_campo"}
                tamañolabel={"w-full input-xs"}
                className={"w-full text-left input-xs"}
                Titulo={"Area: "}
                type={"select"}
                requerido={true}
                errors={errors}
                register={register}
                message={"Area requerida"}
                isDisabled={false}
                data={propertyData.area}
                //defaultValue={formaPago.id}
              />
            </div>
          </div>

          <div className="divider mt-0 mb-0"></div>
        </form>
      </div>
      <div className="flex flex-row justify-between m-2">
        <div
          className={`tooltip tooltip-top my-5  "hover:cursor-pointer"
              `}
          data-tip="cancelar"
        >
          <button
            type="submit"
            id="btn_cancelar"
            className="btn  bg-red-500 hover:bg-red-700 text-white"
            onClick={(evt) => handleCancelarClick(evt)}
          >
            <i className="fas fa-x mx-2"></i>
          </button>
        </div>
        <div
          className={`tooltip tooltip-top my-5  "hover:cursor-pointer"
              `}
          data-tip="Guardar"
        >
          <button
            onClick={(evt) => handleGuardarClick(evt)}
            type="submit"
            id="btn_guardar"
            className="btn  bg-blue-500 hover:bg-blue-700 text-white"
          >
            <i className="fa-regular fa-floppy-disk mx-2"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PropertyPage;
