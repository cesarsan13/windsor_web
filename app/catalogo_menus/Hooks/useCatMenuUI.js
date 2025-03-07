import React from "react";
import Inputs from "@/app/catalogo_menus/components/Inputs";
import { ActionButton, ActionColumn } from "@/app/utils/GlobalComponents";
import iconos from "@/app/utils/iconos";
import { useState } from "react";

export const useCatMenuUI = (
    tableAction,
    register,
    permissions,
    isDisabled,
    errors
) => {

    const [sinZebra, setSinZebra] = useState(false);
      
      const handleKeyDown = (evt) => {
        if (evt.key === "Enter") {
            evt.preventDefault(); 
    
            const fieldset = document.getElementById("fs_menu");
            const form = fieldset?.closest("form");
            const inputs = Array.from(
                fieldset.querySelectorAll("input[name='nombre']")
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

    const tableColumns = (data = [] ) => {
        const hasBajas = data.some(item => item.baja === "*");
        return (
            <thead className={`sticky top-0 z-[2] ${
                hasBajas ? "text-black" : "bg-white dark:bg-[#1d232a]"}`}
                style={hasBajas ? { backgroundColor: "#CF2A2A" } : {}}
            >
                <tr>
                    <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
                    <td className="sm:w-[35%]">Nombre</td>
                    <ActionColumn 
                        description={"Ver"} 
                        permission={true} 
                    />
                    {!hasBajas && <ActionColumn
                    description={"Editar"}
                    permission={permissions.cambios}
                    /> }
                    {!hasBajas && <ActionColumn
                        description={"Eliminar"}
                        permission={permissions.bajas}
                    />}
                    {hasBajas && <ActionColumn 
                        description={"Reactivar"} 
                        permission={true} 
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
                        <th
                            className={
                            typeof item.comision === "number"
                                ? "text-left"
                                : "text-right"
                            }
                        >
                            {item.numero}
                        </th>
                        <td className="w-[35%] max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap pt-[.10rem] pb-[.10rem]">
                            {item.nombre}
                        </td>
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
            <fieldset id="fs_menu">
                <div className="container flex flex-col space-y-5">
                  <Inputs
                    dataType={"string"}
                    name={"nombre"}
                    tamañolabel={""}
                    className={"grow"}
                    Titulo={"Nombre: "}
                    type={"text"}
                    requerido={true}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Nombre requerido"}
                    maxLenght={80}
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
        tableColumns,
        tableBody,
        modalBody,
        sinZebra
    };
};