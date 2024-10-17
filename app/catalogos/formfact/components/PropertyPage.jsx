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
  setTextoAnterior,
  changeSelectedLabel,
}) {
  const {
    register,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      columna_impresion: labels[selectedIndex].columna_impresion,
      numero_archivo: labels[selectedIndex].numero_archivo,
      font_nombre: labels[selectedIndex].font_nombre,
      font_tamaño: labels[selectedIndex].font_tamaño,
      font_bold:
        labels[selectedIndex].font_bold === "S"
          ? labels[selectedIndex].font_bold
          : "",
      font_italic:
        labels[selectedIndex].font_italic === "S"
          ? labels[selectedIndex].font_italic
          : "",
      font_rallado:
        labels[selectedIndex].font_rallado === "S"
          ? labels[selectedIndex].font_rallado
          : "",
      font_subrallado:
        labels[selectedIndex].font_subrallado === "S"
          ? labels[selectedIndex].font_subrallado
          : "",
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
      font_tamaño: labels[selectedIndex].font_tamaño,
      font_bold:
        labels[selectedIndex].font_bold === "S"
          ? labels[selectedIndex].font_bold
          : "",
      font_italic:
        labels[selectedIndex].font_italic === "S"
          ? labels[selectedIndex].font_italic
          : "",
      font_rallado:
        labels[selectedIndex].font_rallado === "S"
          ? labels[selectedIndex].font_rallado
          : "",
      font_subrallado:
        labels[selectedIndex].font_subrallado === "S"
          ? labels[selectedIndex].font_subrallado
          : "",
      formato: labels[selectedIndex].formato,
      renglon_impresion: labels[selectedIndex].renglon_impresion,
      descripcion_campo: labels[selectedIndex].descripcion_campo,
      tipo_campo: labels[selectedIndex].tipo_campo,
    });
    const selectLabels = document.getElementById("idlabel");
    selectLabels.selectedIndex = selectedIndex;
    setSelectedLabel(selectedIndex);
  }, [selectedIndex, labels, reset]);

  const setSelectedLabel = (idx) => {
    const idlabel = parseInt(idx) + 1;
    const lbl = document.getElementById(`texto_${idlabel}`);
    changeSelectedLabel(lbl.attributes["name"].value);
    setTextoAnterior(lbl.attributes["name"].value);
    lbl.classList.add(
      "border-2",
      "border-blue-500",
      "border-dashed",
      "rounded-lg"
    );
  };
  const getValueInput = async (evt) => {
    const { name, value } = evt.target;
    if (
      name === "columna_impresion" ||
      name === "renglon_impresion" ||
      name === "font_tamaño"
    ) {
      return parseInt(value);
    } else if (
      name === "font_bold" ||
      name === "font_italic" ||
      name === "font_rallado" ||
      name === "font_subrallado"
    ) {
      return evt.target.checked ? String("S") : String("");
    } else {
      return String(value);
    }
  };
  const roundToNearest = (value, threshold) => {
    const roundedValue = Math.round(value / threshold) * threshold;
    return roundedValue;
  };
  const handleChange = async (evt) => {
    const { name } = evt.target;
    const resultado = [...labels];
    const value = await getValueInput(evt);
    resultado[selectedIndex] = {
      ...resultado[selectedIndex],
      [name]: value,
    };
    setLabels(resultado);
  };
  const handleKeyDown = async (evt) => {
    if (evt.key === 'Enter') {
      console.log("entra");
      const { name } = evt.target;
      const resultado = [...labels];
      let value = await getValueInput(evt);
      console.log(value);
      const redondea = 10;
      value = roundToNearest(value, redondea);
      resultado[selectedIndex] = {
        ...resultado[selectedIndex],
        [name]: value,
      };
      setLabels(resultado);
    } else { console.log("no entra"); }
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
      const res = await updateFormat(session.user.token, labels);
      if (res.status) {
        setShowSheet(false);
        setSelectedIndex(null);
        setLabels([]);
        showSwal(res.alert_title, res.message, res.alert_icon);
      }
    } else {
      return;
    }
  };

  const handleLabelChange = (evt) => {
    const index = evt.target.selectedOptions[0].attributes["data-key"].value;
    setSelectedIndex(index);
  };

  return (
    <div className="flex flex-col card bg-slate-100 dark:bg-slate-800 rounded-lg ">
      <div className=" bg-slate-400 w-full p-2 rounded-lg rounde flex flex-row">
        <h3 className="text-center font-bold ">Propiedades de </h3>
        <Inputs
          dataType={"string"}
          name={"idlabel"}
          tamañolabel={"w-full input-xs ml-1"}
          className={"w-full text-left input-xs "}
          Titulo={""}
          type={"select"}
          requerido={true}
          errors={errors}
          register={register}
          message={""}
          isDisabled={false}
          data={labels}
          handleChange={handleLabelChange}
        />
      </div>
      <div className="flex flex-col p-1">
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
                type={"number_enter"}
                requerido={true}
                errors={errors}
                register={register}
                message={"columna requerido"}
                isDisabled={false}
                handleKeyDown={handleKeyDown}
                step="10"
              />
              <Inputs
                dataType={"int"}
                name={"renglon_impresion"}
                tamañolabel={"w-full input-xs"}
                className={"w-full text-right input-xs"}
                Titulo={"Renglon: "}
                type={"number_enter"}
                requerido={true}
                errors={errors}
                register={register}
                message={"Renglon requerido"}
                isDisabled={false}
                handleKeyDown={handleKeyDown}
                step="15"
              />
            </div>
          </div>

          <div className="divider mt-0 mb-0"></div>
          <div className="collapse collapse-arrow bg-base-200">
            <input type="radio" name="my-accordion-2" defaultChecked />
            <div className="collapse-title text-xl font-medium">Fuente</div>
            <div className="collapse-content grid gap-2">
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
              <Inputs
                dataType={"int"}
                name={"font_tamaño"}
                tamañolabel={"w-full input-xs"}
                className={"w-full text-right input-xs"}
                Titulo={"Tamaño: "}
                type={"number"}
                requerido={true}
                errors={errors}
                register={register}
                message={"Tamaño requerido"}
                isDisabled={false}
                handleChange={handleChange}
              />
              <div className="flex flex-row">
                <Inputs
                  name={"font_bold"}
                  tamañolabel={"w-full input-xs"}
                  className={"toggle toggle-sm toggle-success"}
                  Titulo={"Bold: "}
                  type={"checkbox"}
                  requerido={true}
                  errors={errors}
                  register={register}
                  message={"Tipo fuente requerido"}
                  isDisabled={false}
                  handleChange={handleChange}
                />
                <Inputs
                  name={"font_italic"}
                  tamañolabel={"w-full input-xs"}
                  className={"toggle toggle-sm toggle-success"}
                  Titulo={"Itallic: "}
                  type={"checkbox"}
                  requerido={true}
                  errors={errors}
                  register={register}
                  message={"Tipo fuente requerido"}
                  isDisabled={false}
                  handleChange={handleChange}
                />
              </div>
              <div className="flex flex-row">
                <Inputs
                  name={"font_rallado"}
                  tamañolabel={"w-full input-xs"}
                  className={"toggle toggle-sm toggle-success"}
                  Titulo={"Rallado: "}
                  type={"checkbox"}
                  requerido={true}
                  errors={errors}
                  register={register}
                  message={"Tipo fuente requerido"}
                  isDisabled={false}
                  handleChange={handleChange}
                />
                <Inputs
                  name={"font_subrallado"}
                  tamañolabel={"w-full input-xs"}
                  className={"toggle toggle-sm toggle-success"}
                  Titulo={"Subrallado: "}
                  type={"checkbox"}
                  requerido={true}
                  errors={errors}
                  register={register}
                  message={"Tipo fuente requerido"}
                  isDisabled={false}
                  handleChange={handleChange}
                />
              </div>
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
                handleChange={handleChange}
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
      <div className="flex flex-row justify-between m-1">
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
