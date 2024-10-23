import { soloEnteros, soloDecimales, pone_ceros } from "@/app/utils/globalfn";
import { showSwal, confirmSwal } from "@/app/utils/alerts";
import { useState, useEffect, useRef } from "react";
import Inputs from "@/app/cajeros/components/Inputs";
import Image from "next/image";
import iconos from "@/app/utils/iconos";
import BuscarCat from "@/app/components/BuscarCat";

function ModalClases({
  session,
  accion,
  onSubmit,
  currentID,
  register,
  errors,
  setClase,
  clase,
  setGrado,
  setprof1,
  setprof2,
}) {
  const [error, setError] = useState(null);
  //Horario
  const columnasBuscaCat = ["numero", "horario"];
  const nameInputs = ["horario_1", "grupo_nombre"];
  //Profesor
  const columnasBuscaCat1 = ["numero", "nombre"];
  const nameInputs3 = ["profesor", "profesor_nombre"];
  //Materias
  const columnasBuscaCat2 = ["numero", "descripcion"];
  const nameInputs4 = ["materia", "materia_nombre"];
  const [titulo, setTitulo] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  useEffect(() => {
    if (accion === "Eliminar" || accion === "Ver") {
      setIsDisabled(true);
    }
    if (accion === "Alta" || accion === "Editar") {
      setIsDisabled(false);
    }
    setTitulo(
      accion === "Alta"
        ? `Nueva Clase: ${currentID}`
        : accion === "Editar"
        ? `Editar Clase: ${currentID}`
        : accion === "Eliminar"
        ? `Eliminar Clase: ${currentID}`
        : `Ver Clase: ${currentID}`
    );
  }, [accion, currentID]);
  
  return (
<dialog id="my_modal_3" className="modal">
  <div className="modal-box max-w-5xl">
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
              className="bg-transparent hover:bg-slate-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-white rounded-lg btn btn-sm"
            >
              <Image src={iconos.guardar} alt="Guardar" className="w-5 h-5 md:w-6 md:h-6 mr-1" />
              <span className="hidden sm:inline">Guardar</span>
            </button>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost"
            onClick={(event) => { event.preventDefault();
              document.getElementById("my_modal_3").close()}}
          >
            ✕
          </button>
        </div>
      </div>
      
      <fieldset id="fs_formapago">
      <div className="flex flex-wrap -mx-3 mb-6">
                    <BuscarCat
                    table="materias"
                    itemData={setprof2}
                    fieldsToShow={columnasBuscaCat2}
                    nameInput={nameInputs4}
                    titulo="Materias: "
                    setItem={setprof2}
                    token={session.user.token}
                    modalId="modal_materias"
                    array={clase.materia}
                    id={clase.materia}
                    alignRight={true}
                    inputWidths={{ first: "80px", second: "380px" }}
                    accion={accion}
                  />
                  <BuscarCat
                    table="horarios"
                    itemData={grupo}
                    fieldsToShow={columnasBuscaCat}
                    nameInput={nameInputs}
                    titulo={"Grado: "}
                    setItem={setGrado}
                    token={session.user.token}
                    modalId="modal_horarios"
                    array={clase.horario_1}
                    id={clase.numero}
                    alignRight={true}
                    inputWidths={{ first: "80px", second: "380px" }}
                    accion={accion}
                  />
                  <BuscarCat
                    table="profesores"
                    fieldsToShow={columnasBuscaCat1}
                    nameInput={nameInputs3}
                    setItem={setprof1}
                    token={session.user.token}
                    modalId="modal_profesores"
                    array={clase.profesor}
                    id={clase.profesor}
                    titulo="Profesor: "
                    alignRight={true}
                    inputWidths={{ first: "80px", second: "380px" }}
                    accion={accion}
                  />
                </div>
      <div className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-3 mb-6">
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
            <div className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-3 justify-center">
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