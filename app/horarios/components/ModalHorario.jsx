import React from "react";
import { useState, useEffect } from "react";
import Inputs from "@/app/horarios/components/Inputs";

function ModalHorario({
  accion,
  onSubmit,
  currentID,
  register,
  errors,
  setHorarios,
  horarios,
  control,
  setDia,
}) {
  const [error, setError] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  useEffect(() => {
    if (accion === "Eliminar" || accion === "Ver") {
      setIsDisabled(true);
      // accion === "Ver" &&
      //   document.getElementById("btn_guardar").setAttribute("disabled", true);
    }
    if (accion === "Alta" || accion === "Editar") {
      // alert(accion);
      setIsDisabled(false);
    }
    setTitulo(
      accion === "Alta"
        ? `Nuevo Horario: ${currentID}`
        : accion === "Editar"
        ? `Editar Horario: ${currentID}`
        : accion === "Eliminar"
        ? `Eliminar Horario: ${currentID}`
        : `Ver Horario: ${currentID}`
    );
  }, [accion]);
  const handleBlur = (evt, datatype) => {
    if (evt.target.value === "") return;
    datatype === "int"
      ? setHorarios((horarios) => ({
          ...horarios,
          [evt.target.name]: pone_ceros(evt.target.value, 0, true),
        }))
      : setHorarios((horarios) => ({
          ...horarios,
          [evt.target.name]: pone_ceros(evt.target.value, 2, true),
        }));
  };
  const options = [
    { value: "LU", label: "Lunes" },
    { value: "MA", label: "Martes" },
    { value: "MI", label: "Miércoles" },
    { value: "JU", label: "Jueves" },
    { value: "VI", label: "Viernes" },
    { value: "SA", label: "Sábado" },
    { value: "DO", label: "Domingo" },
  ];
  const [selectedDias, setSelectedDias] = useState([]);

  useEffect(() => {
    if (horarios && horarios.dia) {
      setDia(horarios.dia.split("/"));
      setSelectedDias(horarios.dia.split("/"));
    } else {
      setDia("");
      setSelectedDias("");
    }
  }, [horarios]);
  const handleSelectChange = (selectedOptions) => {
    setSelectedDias(selectedOptions.map((option) => option.value).join("/"));
    setDia(selectedOptions.map((option) => option.value).join("/"));
  };
  return (
    <dialog id="my_modal_3" className="modal">
      <div className="modal-box">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => document.getElementById("my_modal_3").close()}
        >
          ✕
        </button>
        <form onSubmit={onSubmit}>
          <h3 className="font-bold text-lg mb-5 text-black dark:text-white">
            {titulo}
          </h3>
          <fieldset id="fs_horario">
            <div className="container flex flex-col space-y-5">
              <Inputs
                dataType={"int"}
                name={"numero"}
                tamañolabel={"3/6"}
                className={"w-4/6 text-right"}
                Titulo={"Numero: "}
                type={"text"}
                requerido={true}
                errors={errors}
                register={register}
                message={"numeroRequerido"}
                isDisabled={true}
              />
              <Inputs
                dataType={"int"}
                name={"cancha"}
                tamañolabel={""}
                className={"w-4/6 text-right"}
                Titulo={"Cancha: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"cancha requerid"}
                maxLenght={50}
                isDisabled={isDisabled}
              />
              <Inputs
                titulo={"Dias de la semana"}
                name={"dia"}
                Titulo={"Dias de la semana"}
                tamañolabel={"w-full sm:w-96"}
                message={"dia requerido"}
                register={register}
                className={"p-1.5 grow  sm:w-auto"}
                errors={errors}
                requerido={true}
                dataType={"multi-select"}
                type={"multi-select"}
                options={options}
                control={control}
                value={options.filter((option) =>
                  selectedDias.includes(option.value)
                )}
                onChange={handleSelectChange}
                isDisabled={isDisabled}
              />
              <Inputs
                dataType={"string"}
                name={"horario"}
                tamañolabel={""}
                className={"w-4/6"}
                Titulo={"Horario: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"horario requerido"}
                maxLenght={50}
                isDisabled={isDisabled}
              />
              <Inputs
                dataType={"int"}
                name={"max_niños"}
                tamañolabel={""}
                className={"w-4/6 text-right"}
                Titulo={"Max Niños: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Max Niños requerido"}
                maxLenght={50}
                isDisabled={isDisabled}
              />
              <Inputs
                Titulo={"Sexo"}
                name={"sexo"}
                message={"sexo requerido"}
                className={"fyo8m-select w-4/6 bg-[#ffffff] "}
                tamañolabel={"w-4/6"}
                register={register}
                errors={errors}
                requerido={true}
                type={"select"}
                isDisabled={isDisabled}
                arreglos={[
                  { id: "NIÑOS", descripcion: "Niños" },
                  { id: "NIÑAS", descripcion: "Niñas" },
                  { id: "MIXTO", descripcion: "Mixto" },
                ]}
              />
              <Inputs
                dataType={"int"}
                name={"edad_ini"}
                tamañolabel={""}
                className={"w-4/6 text-right"}
                Titulo={"Edad Ini: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Edad Ini requerido"}
                maxLenght={50}
                isDisabled={isDisabled}
              />
              <Inputs
                dataType={"int"}
                name={"edad_fin"}
                tamañolabel={""}
                className={"w-3/6 text-right"}
                Titulo={"Edad Fin: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Edad Fin requerido"}
                maxLenght={50}
                isDisabled={isDisabled}
              />
            </div>
          </fieldset>
          <div className=" modal-action">
            <div
              className={`tooltip tooltip-top my-5 ${
                accion === "Ver"
                  ? "hover:cursor-not-allowed hidden"
                  : "hover:cursor-pointer"
              }`}
              data-tip="Guardar"
            >
              <button
                type="submit"
                id="btn_guardar"
                className="bg-transparent over:bg-slate-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-white rounded-lg btn"
              >
                <i className="fa-regular fa-floppy-disk mx-2"></i> Guardar
              </button>
            </div>
          </div>
        </form>
      </div>
    </dialog>
  );
}

export default ModalHorario;
