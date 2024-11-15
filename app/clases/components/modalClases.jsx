import { soloEnteros, soloDecimales, pone_ceros } from "@/app/utils/globalfn";
import { showSwal, confirmSwal } from "@/app/utils/alerts";
import { useState, useEffect } from "react";
import Inputs from "@/app/cajeros/components/Inputs";
import Image from "next/image";
import iconos from "@/app/utils/iconos";
import BuscarCat from "@/app/components/BuscarCat";
import { FaSpinner } from "react-icons/fa";

function ModalClases({
  session,
  accion,
  onSubmit,
  register,
  errors,
  clase,
  setGrado,
  setProfesor,
  setMateria,
  watch,
  isLoadingButton,
  contador
}) {
  const [error, setError] = useState(null);
  //Horario
  const columnasBuscaCat = ["numero", "horario"];
  const nameInputs = ["horario_1", "numero_1_nombre"];
  //Profesor
  const columnasBuscaCat1 = ["numero", "nombre"];
  const nameInputs3 = ["profesor", "profesor_nombre"];
  //Materias
  const columnasBuscaCat2 = ["numero", "descripcion"];
  const nameInputs4 = ["materia", "materia_nombre"];
  const [titulo, setTitulo] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [isDisabledBusca, setIsDisabledBusca] = useState(true);

  useEffect(() => {
    if (accion === "Eliminar" || accion === "Ver") {
      setIsDisabled(true);
    }
    if (accion === "Alta" || accion === "Editar") {
      setIsDisabled(false);
    }
    if (accion === "Alta") {
      setIsDisabledBusca(false);
    } else if (accion === "Editar" || accion === "Ver" || accion === "Editar") {
      setIsDisabledBusca(true);
    }
    setTitulo(
      accion === "Alta"
        ? `Nueva Clase`
        : accion === "Editar"
          ? `Editar Clase`
          : accion === "Eliminar"
            ? `Eliminar Clase`
            : `Ver Clase`
    );
  }, [accion]);

  return (
    <dialog id="my_modal_3" className="modal">
      <div className="modal-box max-w-5xl bg-base-200">
        <form onSubmit={onSubmit}>
          <div className="sticky -top-6 flex justify-between items-center bg-base-200 dark:bg-[#1d232a] w-full h-10 z-10 mb-5">
            <h3 className="font-bold text-lg">{titulo}</h3>
            <div className="flex space-x-2 items-center">
              <div
                className={`tooltip tooltip-bottom ${accion === "Ver"
                  ? "hover:cursor-not-allowed hidden"
                  : "hover:cursor-pointer"
                  }`}
                data-tip="Guardar"
              >
                <button
                  type="submit"
                  id="btn_guardar"
                  className="bg-transparent hover:bg-slate-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-white rounded-lg btn btn-sm"
                >
                  {isLoadingButton ? (
                    <FaSpinner className="animate-spin mx-2" />
                  ) : (
                    <Image src={iconos.guardar} alt="Guardar" className="w-5 h-5 md:w-6 md:h-6" />
                  )}
                  {isLoadingButton ? " Cargando..." : " Guardar"}
                </button>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-circle btn-ghost"
                onClick={(event) => {
                  event.preventDefault();
                  document.getElementById("my_modal_3").close()
                }}
              >
                ✕
              </button>
            </div>
          </div>
          <fieldset id="fs_clase">
            <div className="flex flex-col gap-3 mb-6">
              <BuscarCat
                deshabilitado={isDisabledBusca}
                table="horarios"
                fieldsToShow={columnasBuscaCat}
                nameInput={nameInputs}
                titulo={"Grado: "}
                setItem={setGrado}
                token={session.user.token}
                modalId="modal_horarios"
                array={clase.grupo}
                id={clase.grupo}
                alignRight={true}
                inputWidths={{ first: "80px", second: "380px" }}
                accion={accion}
                contador={contador}
              />
              <BuscarCat
                deshabilitado={isDisabledBusca}
                table="materias"
                fieldsToShow={columnasBuscaCat2}
                nameInput={nameInputs4}
                titulo="Materias: "
                setItem={setMateria}
                token={session.user.token}
                modalId="modal_materias"
                array={clase.materia}
                id={clase.materia}
                alignRight={true}
                inputWidths={{ first: "80px", second: "380px" }}
                accion={accion}
                contador={contador}
              />
              <BuscarCat
                deshabilitado={isDisabledBusca}
                table="profesores"
                fieldsToShow={columnasBuscaCat1}
                nameInput={nameInputs3}
                setItem={setProfesor}
                token={session.user.token}
                modalId="modal_profesores"
                array={clase.profesor}
                id={clase.profesor}
                titulo="Profesor: "
                alignRight={true}
                inputWidths={{ first: "80px", second: "380px" }}
                accion={accion}
                contador={contador}
              />
            </div>
            <div className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6 items-start">
              <Inputs
                dataType={"string"}
                name={"lunes"}
                tamañolabel={""}
                className={"w-full"}
                Titulo={"Lunes: "}
                type={"time"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                maxLenght={15}
                isDisabled={isDisabled}
              />
              <Inputs
                dataType={"string"}
                name={"martes"}
                tamañolabel={""}
                className={"w-full"}
                Titulo={"Martes: "}
                type={"time"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                maxLenght={15}
                isDisabled={isDisabled}
              />
              <Inputs
                dataType={"string"}
                name={"miercoles"}
                tamañolabel={""}
                className={"w-full"}
                Titulo={"Miercoles: "}
                type={"time"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                maxLenght={15}
                isDisabled={isDisabled}
              />
              <Inputs
                dataType={"string"}
                name={"jueves"}
                tamañolabel={""}
                className={"w-full"}
                Titulo={"Jueves: "}
                type={"time"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                maxLenght={15}
                isDisabled={isDisabled}
              />
            </div>
            <div className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Inputs
                dataType={"string"}
                name={"viernes"}
                tamañolabel={""}
                className={"w-full"}
                Titulo={"Viernes: "}
                type={"time"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                maxLenght={15}
                isDisabled={isDisabled}
              />
              <Inputs
                dataType={"string"}
                name={"sabado"}
                tamañolabel={""}
                className={"w-full"}
                Titulo={"Sabado: "}
                type={"time"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                maxLenght={15}
                isDisabled={isDisabled}
              />
              <Inputs
                dataType={"string"}
                name={"domingo"}
                tamañolabel={""}
                className={"w-full"}
                Titulo={"Domingo: "}
                type={"time"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                maxLenght={15}
                isDisabled={isDisabled}
              />
            </div>
          </fieldset>
        </form>
      </div>
    </dialog>
  );

}

export default ModalClases;
