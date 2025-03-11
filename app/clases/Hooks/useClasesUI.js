import React from "react";
import { ActionButton, ActionColumn } from "@/app/utils/GlobalComponents";
import iconos from "@/app/utils/iconos";
import Inputs from "@/app/clases/components/Inputs";
import { useState } from "react";
import BuscarCat from "@/app/components/BuscarCat";
import { useSession } from "next-auth/react";

export const useClasesUI = (
    tableAction,
    register,
    setGrado,
    permissions,
    isDisabled,
    isDisabledBusca,
    errors,
    accion,
    contador,
    clase,
    setMateria,
    setProfesor,
    vGrado, 
    vMateria, 
    vProfesor,
) => {
    const { data: session} = useSession();
    //Horario
    const columnasBuscaCat = ["numero", "horario"];
    const nameInputs = ["horario_1", "numero_1_nombre"];
    //Profesor
    const columnasBuscaCat1 = ["numero", "nombre"];
    const nameInputs3 = ["profesor", "profesor_nombre"];
    //Materias
    const columnasBuscaCat2 = ["numero", "descripcion"];
    const nameInputs4 = ["materia", "materia_nombre"];

    const [sinZebra, setSinZebra] = useState(false);

    const handleKeyDown = (evt) => {
        if (evt.key === "Enter") {
            evt.preventDefault(); 
    
            const fieldset = document.getElementById("fs_horario");
            const form = fieldset?.closest("form");
            const inputs = Array.from(
                fieldset.querySelectorAll("input[name='cancha'], input[name='horario'], input[name='max_niños'], input[name='sexo'], input[name='edad_ini'], input[name='edad_fin'], input[name='salon']")
            );
    
            const currentIndex = inputs.indexOf(evt.target);
            if (currentIndex !== -1) {
                if (currentIndex < inputs.length - 1) {
                    inputs[currentIndex + 1].focus(); 
                } else {
                    const submitButton = form?.querySelector("button[type='submit']");
                    if (submitButton) submitButton.click(); 
                }
            }
        }
    };

    const tableColumns = (data = []) => {
        const hasBajas = data.some(item => item.baja === "*");
        return (
          <thead   className={`sticky top-0 z-[2] ${
            hasBajas ? "text-black" : "bg-white dark:bg-[#1d232a]"
          }`}
          style={hasBajas ? { backgroundColor: "#CF2A2A" } : {}}>
            <tr>
                <td className="w-[21%]">Grupo</td>
                <td className="w-[21%]">Materia</td>
                <td className="w-[21%] hidden sm:table-cell">Profesor</td>
                <td className="w-[5%] hidden sm:table-cell">Lunes</td>
                <td className="w-[5%] hidden sm:table-cell">Martes</td>
                <td className="w-[5%] hidden sm:table-cell">Miercoles</td>
                <td className="w-[5%] hidden sm:table-cell">Jueves</td>
                <td className="w-[5%] hidden sm:table-cell">Viernes</td>
                <td className="w-[5%] hidden sm:table-cell">Sabado</td>
                <td className="w-[5%] hidden sm:table-cell">Domingo</td>
                <ActionColumn description={"Ver"} permission={true} />
                {!hasBajas && <ActionColumn description={"Editar"} permission={permissions.cambios} />}
                {!hasBajas && <ActionColumn description={"Eliminar"} permission={permissions.bajas}/>}
                {hasBajas && <ActionColumn description={"Reactivar"} permission={true} />}
            </tr>
          </thead>
        );
    };

    const tableBody = (data = []) => {
        const hasBajas = data.some(item => item.baja === "*");
        setSinZebra(hasBajas);
        return (
            <tbody style={{ backgroundColor: hasBajas ? "#CD5C5C" : "" }}>
                {data.map((item) => (
                    <tr key={item.grupo} className="hover:cursor-pointer">
                        <td className="w-[21%]" > {item.grupo_descripcion} </td>
                        <td className="w-[21%]"> {item.materia_descripcion} </td>
                        <td className="w-[21%] hidden sm:table-cell "> {item.profesor_nombre}</td>
                        <td className="w-[5%]  hidden sm:table-cell ">{item.lunes}</td>
                        <td className="w-[5%]  hidden sm:table-cell ">{item.martes}</td>
                        <td className="w-[5%]  hidden sm:table-cell ">{item.miercoles}</td>
                        <td className="w-[5%]  hidden sm:table-cell ">{item.jueves}</td>
                        <td className="w-[5%]  hidden sm:table-cell ">{item.viernes}</td>
                        <td className="w-[5%]  hidden sm:table-cell ">{item.sabado}</td>
                        <td className="w-[5%]  hidden sm:table-cell ">{item.domingo}</td>
                        <ActionButton
                          tooltip="Ver"
                          iconDark={iconos.ver}
                          iconLight={iconos.ver_w}
                          onClick={(evt) => tableAction(evt, item, "Ver")}
                          permission={true}
                        />
                        {item.baja !== "*" ? (
                          <>
                            <ActionButton
                              tooltip="Editar"
                              iconDark={iconos.editar}
                              iconLight={iconos.editar_w}
                              onClick={(evt) => tableAction(evt, item, "Editar")}
                              permission={permissions.cambios}
                            />
                            <ActionButton
                              tooltip="Eliminar"
                              iconDark={iconos.eliminar}
                              iconLight={iconos.eliminar_w}
                              onClick={(evt) => tableAction(evt, item, "Eliminar")}
                              permission={permissions.bajas}
                            />
                          </>
                        ) : (
                          <ActionButton
                            tooltip="Reactivar"
                            iconDark={iconos.documento}
                            iconLight={iconos.documento_w}
                            onClick={(evt) => tableAction(evt, item, "Reactivar")}
                            permission={true}
                          />
                        )}
                    </tr>
                ))}
            </tbody>
        );
    };

    const modalBody = () => {
        return (
            <fieldset id="fs_clase"
                dataTypedisabled={accion === "Ver"  || accion === "Eliminar" ? true : false }
            >
                <div className="flex flex-col gap-3 mb-6">
                    <div className="container flex flex-col space-y-5">
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
                    {
                        vGrado === true && vGrado !== null &&
                        (
                            <span className={`text-red-500 text-sm mt-2`}>
                              {"Grado requerido"}
                            </span>
                        )
                    }
                    </div>

                    <div className="container flex flex-col space-y-5">
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
                    {
                        vMateria === true && vMateria !== null && (
                            <span className={`text-red-500 text-sm mt-2`}>
                              {"Materia requerida"}
                            </span>
                        )
                    }
                    </div>

                    <div className="container flex flex-col space-y-5">
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
                    {
                        vProfesor === true && vProfesor !== null && (
                            <span className={`text-red-500 text-sm mt-2`}>
                              {"Profesor requerido"}
                            </span>
                        )
                    }
                    </div>
                </div>
                <div className="gap-3">
                <div className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 mb-6 items-start">
                    <Inputs
                      dataType={"string"}
                      name={"lunes"}
                      tamañolabel={""}
                      className={"w-full"}
                      Titulo={"Lunes: "}
                      type={"time"}
                      requerido={false}
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
                      requerido={false}
                      isNumero={false}
                      errors={errors}
                      register={register}
                      maxLenght={15}
                      isDisabled={isDisabled}
                    />
                </div>
                <div className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 mb-6 items-start">
                    <Inputs
                      dataType={"string"}
                      name={"miercoles"}
                      tamañolabel={""}
                      className={"w-full"}
                      Titulo={"Miercoles: "}
                      type={"time"}
                      requerido={false}
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
                      requerido={false}
                      isNumero={false}
                      errors={errors}
                      register={register}
                      maxLenght={15}
                      isDisabled={isDisabled}
                    />
                </div>
                <div className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 mb-6 items-start">
                    <Inputs
                      dataType={"string"}
                      name={"viernes"}
                      tamañolabel={""}
                      className={"w-full"}
                      Titulo={"Viernes: "}
                      type={"time"}
                      requerido={false}
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
                      requerido={false}
                      isNumero={false}
                      errors={errors}
                      register={register}
                      maxLenght={15}
                      isDisabled={isDisabled}
                    />
                </div>
                <div className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 mb-6 items-start">
                    <Inputs
                      dataType={"string"}
                      name={"domingo"}
                      tamañolabel={""}
                      className={"w-full"}
                      Titulo={"Domingo: "}
                      type={"time"}
                      requerido={false}
                      isNumero={false}
                      errors={errors}
                      register={register}
                      maxLenght={15}
                      isDisabled={isDisabled}
                    />
                </div>    
                </div>   

            </fieldset> 
        );
    };

    return {
        tableColumns,
        tableBody,
        modalBody,
        sinZebra
    };
};