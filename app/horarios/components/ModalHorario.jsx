import React from "react";
import { useState, useEffect } from "react";
import Inputs from "@/app/horarios/components/Inputs";
import Image from "next/image";
import iconos from "@/app/utils/iconos";

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
    <dialog id="my_modal_horario" className="modal">
      <div className="modal-box">
        <form onSubmit={onSubmit}>
          <div className="sticky -top-6 flex justify-between items-center bg-white dark:bg-[#1d232a] w-full h-10 z-10 mb-5">
            <h3 className="font-bold text-lg">{titulo}</h3>
            <div className="flex space-x-2 items-center">
              <div
                className={`tooltip tooltip-bottom ${
                  accion === "Ver"
                    ? "hover:cursor-not-allowed hidden"
                    : "hover:cursor-pointer"
                }`}
                data-tip="Guardar"
              >
                <button
                  type="submit"
                  id="btn_guardar"
                  className="bg-transparent hover:bg-slate-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-white rounded-lg btn btn-sm "
                >
                  <Image
                    src={iconos.guardar}
                    alt="Guardar"
                    className="w-5 h-5 md:w-6 md:h-6 mr-1"
                  />
                  <span className="hidden sm:inline">Guardar</span>
                </button>
              </div>
              <button
                className="btn btn-sm btn-circle btn-ghost"
                onClick={(event) => {
                  event.preventDefault();
                  document.getElementById("my_modal_horario").close();
                }}
              >
                ✕
              </button>
            </div>
          </div>
          <fieldset id="fs_horario">
            <div className="container flex flex-col space-y-5">
              <Inputs
                dataType={"int"}
                name={"numero"}
                tamañolabel={"w-3/6"}
                className={"w-3/6 text-right"}
                Titulo={"Numero: "}
                type={"text"}
                requerido={true}
                errors={errors}
                register={register}
                message={"Numero Requerido"}
                isDisabled={true}
              />
              <Inputs
                dataType={"int"}
                name={"cancha"}
                tamañolabel={"w-3/6"}
                className={"w-4/6 text-right"}
                Titulo={"Cancha: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Cancha Requerida"}
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
                tamañolabel={"w-5/6"}
                className={"w-5/6"}
                Titulo={"Horario: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Horario Requerido"}
                maxLenght={50}
                isDisabled={isDisabled}
              />
              <Inputs
                dataType={"int"}
                name={"max_niños"}
                tamañolabel={"w-5/6"}
                className={"w-4/6 text-right"}
                Titulo={"Max Niños: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Max Niños Requerido"}
                maxLenght={50}
                isDisabled={isDisabled}
              />
              <Inputs
                Titulo={"Sexo"}
                name={"sexo"}
                message={"sexo requerido"}
                className={"fyo8m-select w-4/6 bg-[#ffffff] "}
                tamañolabel={"w-5/6"}
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
                tamañolabel={"w-3/6"}
                className={"w-3/6 text-right"}
                Titulo={"Edad Ini: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Edad Inicial Requerida"}
                maxLenght={50}
                isDisabled={isDisabled}
              />
              <Inputs
                dataType={"int"}
                name={"edad_fin"}
                tamañolabel={"w-3/6"}
                className={"w-3/6 text-right"}
                Titulo={"Edad Fin: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Edad Final Requerida"}
                maxLenght={50}
                isDisabled={isDisabled}
              />
              <Inputs
                dataType={"string"}
                name={"salon"}
                tamañolabel={"w-3/6"}
                className={"w-5/6"}
                Titulo={"Salón: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Salón Requerido"}
                maxLenght={10}
                isDisabled={isDisabled}
              />
            </div>
          </fieldset>
        </form>
      </div>
    </dialog>
  );
}

export default ModalHorario;
