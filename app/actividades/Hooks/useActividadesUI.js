import React from "react";
import Inputs from "@/app/actividades/components/Inputs";
import { ActionButton, ActionColumn } from "@/app/utils/GlobalComponents";
import iconos from "@/app/utils/iconos";
import { useState } from "react";

export const useActividadesUI = (
    tableAction,
    register,
    permissions,
    isDisabled,
    errors,
    asignaturas,
    handleAsignaturaChange,
    accion
) => {

  const [sinZebra, setSinZebra] = useState(false);

  const handleKeyDown = (evt) => {
    if (evt.key === "Enter") {
        evt.preventDefault(); 

        const fieldset = document.getElementById("fs_actividad");
        const modalForm = document.getElementById("modal_form");
        const inputs = Array.from(
            fieldset.querySelectorAll("input[name='secuencia'], input[name='descripcion'], input[name='EB1'], input[name='EB2'], input[name='EB3'], input[name='EB4'], input[name='EB5']")
        );

        const currentIndex = inputs.indexOf(evt.target);
        if (currentIndex !== -1) {
            if (currentIndex < inputs.length - 1) {
                inputs[currentIndex + 1].focus(); 
            } else {
                const submitButton = modalForm?.querySelector("button[type='submit']");
                if (submitButton) submitButton.click(); 
            }
        }
    }
  };
    

    const itemHeaderTable = () => {
        return (
          <>
            <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Materia</td>
            <td className="w-[10%]">Secuencia</td>
            <td className="w-[20%]">Mat. Desc</td>
            <td className="w-[20%]">Descripcion</td>
            <td className="w-[10%]">Evaluaciones</td>
            <td className="w-[10%]">EB1</td>
            <td className="w-[10%]">EB2</td>
            <td className="w-[10%]">EB3</td>
            <td className="w-[10%]">EB4</td>
            <td className="w-[10%]">EB5</td>
            <td className="w-[10%]">Baja</td>
          </>
        );
    };
      
    const itemDataTable = (item) => {
        return (
          <>
            <tr key={item.materia} className="hover:cursor-pointer">
              <th
                className={
                  typeof item.materia === "number" ? "text-left" : "text-right"
                }
              >
                {item.materia}
              </th>
              <td className="text-right">{item.secuencia}</td>
              <td className="text-left"> {item.matDescripcion} </td>
              <td className="text-left"> {item.descripcion} </td>
              <td className="text-right">{item.evaluaciones}</td>
              <td className="text-right">{item.EB1}</td>
              <td className="text-right">{item.EB2}</td>
              <td className="text-right">{item.EB3}</td>
              <td className="text-right">{item.EB4}</td>
              <td className="text-right">{item.EB5}</td>
              <td className="text-left">{item.baja}</td>
            </tr>
          </>
        );
    };

    const tableColumns = (data = []) => {
      const hasBajas = data.some(item => item.baja === "*");
        return (
            <thead className={`sticky top-0 z-[2] ${
              hasBajas ? "text-black" : "bg-white dark:bg-[#1d232a]"}`}
              style={hasBajas ? { backgroundColor: "#CF2A2A" } : {}}>
            <tr>
              <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Asignatura</td>
              <td className="w-[10%]">Descripción</td>
              <th className="w-[5%]">Actividad</th>
              <th className="w-[10%] hidden sm:table-cell">Bim 1</th>
              <th className="w-[10%] hidden sm:table-cell">Bim 2</th>
              <th className="w-[10%] hidden sm:table-cell">Bim 3</th>
              <th className="w-[10%] hidden sm:table-cell">Bim 4</th>
              <th className="w-[10%] hidden sm:table-cell">Bim 5</th>
              < ActionColumn
                description={"Ver"}
                permission={true}
              />
              {!hasBajas && <ActionColumn description={"Editar"} permission={permissions.cambios} />}
              {!hasBajas && <ActionColumn description={"Eliminar"} permission={permissions.bajas}/>}
              {hasBajas && <ActionColumn description={"Reactivar"} permission={permissions.cambios} />}
            </tr>
          </thead>
        );
    };

    const tableBody = (data = []) => {
      const hasBajas = data.some(item => item.baja === "*");
      setSinZebra(hasBajas);
        return (
            <tbody style={{ backgroundColor: hasBajas ? "#CD5C5C" : "" }}>
            {data.map((item, index) => (
              <tr key={index}>
                <th
                  className={
                    typeof item.materia === "number"
                      ? "text-left"
                      : "text-right"
                  }
                >
                  {item.materia}
                </th>
                <td>{item.matDescripcion}</td>
                <td>{item.descripcion}</td>
                <td className="text-right hidden sm:table-cell">{item.EB1}</td>
                <td className="text-right hidden sm:table-cell">{item.EB2}</td>
                <td className="text-right hidden sm:table-cell">{item.EB3}</td>
                <td className="text-right hidden sm:table-cell">{item.EB4}</td>
                <td className="text-right hidden sm:table-cell">{item.EB5}</td>
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
                    permission={permissions.cambios}
                  />
                )}
              </tr>
            ))}
          </tbody>
        );
    };

    const modalBody = () => {
        return (
            <fieldset id='fs_actividad'
            dataTypedisabled={accion === "Ver"  || accion === "Eliminar" ? true : false }>
                <div className='container flex flex-col space-y-5'>
                    <Inputs
                        dataType={"int"}
                        name={"materia"}
                        tamañolabel={""}
                        className={"fyo8m-select p-1.5 grow bg-[#ffffff] "}
                        Titulo={"Asignatura: "}
                        type={"selectAsignatura"}
                        requerido={true}
                        errors={errors}
                        register={register}
                        message={"Asignatura Requerido"}
                        isDisabled={isDisabled}
                        maxLenght={5}
                        arreglos={asignaturas}
                        onChange={handleAsignaturaChange}
                    />
                    <Inputs
                        dataType={"int"}
                        name={"secuencia"}
                        tamañolabel={"w-3/6"}
                        className={"w-3/6 text-right"}
                        Titulo={"Secuencia: "}
                        requerido={true}
                        errors={errors}
                        register={register}
                        message={"secuenciaRequerido"}
                        isDisabled={isDisabled}
                        onKeyDown={(evt) => {
                          handleKeyDown(evt);
                        }}
                        />
                    <Inputs
                        dataType={"string"}
                        name={"descripcion"}
                        tamañolabel={"w-5/6"}
                        Titulo={"Descripcion"}
                        type={"text"}
                        requerido={true}
                        register={register}
                        isDisabled={isDisabled}
                        message={"Descripcion requerido"}
                        maxLenght={30}
                        errors={errors}
                        onKeyDown={(evt) => {
                          handleKeyDown(evt);
                        }}
                    />
                    <Inputs
                        dataType={"int"}
                        name={"EB1"}
                        tamañolabel={"w-3/6"}
                        className={"w-3/6 text-right"}
                        Titulo={"EB1: "}
                        requerido={true}
                        errors={errors}
                        register={register}
                        message={"EB1 Requerido"}
                        isDisabled={isDisabled}
                        onKeyDown={(evt) => {
                          handleKeyDown(evt);
                        }}
                    />
                    <Inputs
                        dataType={"int"}
                        name={"EB2"}
                        tamañolabel={"w-3/6"}
                        className={"w-3/6 text-right"}
                        Titulo={"EB2: "}
                        requerido={true}
                        errors={errors}
                        register={register}
                        message={"EB2 Requerido"}
                        isDisabled={isDisabled}
                        onKeyDown={(evt) => {
                          handleKeyDown(evt);
                        }}
                    />
                    <Inputs
                        dataType={"int"}
                        name={"EB3"}
                        tamañolabel={"w-3/6"}
                        className={"w-3/6 text-right"}
                        Titulo={"EB3: "}
                        requerido={true}
                        errors={errors}
                        register={register}
                        message={"EB3 Requerido"}
                        isDisabled={isDisabled}
                        onKeyDown={(evt) => {
                          handleKeyDown(evt);
                        }}
                    />
                    <Inputs
                        dataType={"int"}
                        name={"EB4"}
                        tamañolabel={"w-3/6"}
                        className={"w-3/6 text-right"}
                        Titulo={"EB4: "}
                        requerido={true}
                        errors={errors}
                        register={register}
                        message={"EB4 Requerido"}
                        isDisabled={isDisabled}
                        onKeyDown={(evt) => {
                          handleKeyDown(evt);
                        }}
                    />
                    <Inputs
                        dataType={"int"}
                        name={"EB5"}
                        tamañolabel={"w-3/6"}
                        className={"w-3/6 text-right"}
                        Titulo={"EB5: "}
                        requerido={true}
                        errors={errors}
                        register={register}
                        message={"EB5 Requerido"}
                        isDisabled={isDisabled}
                        onKeyDown={(evt) => {
                          handleKeyDown(evt);
                        }}
                    />
                </div>
            </fieldset>
        );
    };

    return{
        itemHeaderTable,
        itemDataTable,
        tableColumns,
        tableColumns,
        tableBody,
        modalBody,
        sinZebra
    };
};