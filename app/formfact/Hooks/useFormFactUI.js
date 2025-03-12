import React from "react";
import Inputs from "@/app/formfact/components/Inputs";
import { ActionButton, ActionColumn } from "@/app/utils/GlobalComponents";
import iconos from "@/app/utils/iconos";
import { useState } from "react";

export const useFormFactUI = (
    tableAction,
    register,
    permissions,
    isDisabled,
    errors,
    accion
) => {

  const [sinZebra, setSinZebra] = useState(false);

  const handleKeyDown = (evt) => {
    if (evt.key === "Enter") {
        evt.preventDefault(); 

        const fieldset = document.getElementById("fs_formaFactura");
        const form = fieldset?.closest("form");
        const inputs = Array.from(
            fieldset.querySelectorAll("input[name='nombre_forma'], input[name='longitud']")
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

    const itemHeaderTable = () => {
        return (
          <>
            <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem] text-right">Núm.</td>
            <td className="w-[30%]">Nombre</td>
            <td className="w-[20%] text-right">longitud</td>
            <td className="w-[10%]">Baja</td>
          </>
        );
    };
    
    const itemDataTable = (item) => {
        return (
          <>
            <tr key={item.numero_forma} className="hover:cursor-pointer">
              <th className="text-right">{item.numero_forma}</th>
              <td className="w-[40%] max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap pt-[.10rem] pb-[.10rem] text-left">
                {item.nombre_forma}
              </td>
              <td className="text-right">{item.longitud}</td>
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
                    <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
                    <td className="w-[60%]">Nombre</td>
                    <td className="w-[40%] hidden sm:table-cell">Longitud</td>
                    < ActionColumn
                        description={"Ver"}
                        permission={true}
                    />
                    {!hasBajas && <ActionColumn
                        description={"Editar"}
                        permission={permissions.cambios}
                    />}
                    {!hasBajas && <ActionColumn
                        description={"Eliminar"}
                        permission={permissions.bajas}
                    />}
                    {!hasBajas && <ActionColumn
                        description={"A. Formato"}
                        permission={permissions.cambios}
                    />}
                    {hasBajas && <ActionColumn 
                      description={"Reactivar"}
                      permission={permissions.cambios} 
                    />}
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
                <tr key={item.numero} className="hover:cursor-pointer">
                  <th className="text-left">{item.numero_forma}</th>
                  <td className="text-left w-50 hidden sm:table-cell">{item.nombre_forma}</td>
                  <td>{item.longitud}</td>
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
                    <ActionButton
                      tooltip="A. Formato"
                      iconDark={iconos.actualizar_formato}
                      iconLight={iconos.actualizar_formato_w}
                      onClick={(evt) => tableAction(evt, item, "ActualizaFormato")}
                      permission={permissions.cambios}
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
            <fieldset 
              id="fs_formaFactura"
              dataTypedisabled={accion === "Ver"  || accion === "Eliminar" ? true : false }
            >
            <div className="container flex flex-col space-y-5">
              <Inputs
                dataType={"string"}
                name={"nombre_forma"}
                tamañolabel={""}
                className={"rounded block grow"}
                Titulo={"Nombre: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Nombre requerido"}
                maxLenght={30}
                isDisabled={isDisabled}
                onKeyDown={(evt) => {
                  handleKeyDown(evt);
                }}
              />
              <Inputs
                dataType={"int"}
                name={"longitud"}
                tamañolabel={"w-4/6"}
                className={"rounded block w-4/6 text-right"}
                Titulo={"Longitud: "}
                type={"float"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Longitud requerido"}
                maxLenght={7}
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
        tableBody,
        modalBody,
        sinZebra
    };

};