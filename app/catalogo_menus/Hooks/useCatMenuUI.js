import React from "react";
import Inputs from "@/app/catalogo_menus/components/Inputs";
import { ActionButton, ActionColumn } from "@/app/utils/GlobalComponents";
import iconos from "@/app/utils/iconos";

export const useCatMenuUI = (
    tableAction,
    register,
    permissions,
    isDisabled,
    errors
) => {

    const tableColumns = () => {
        return (
            <thead className="sticky top-0 bg-white dark:bg-[#1d232a] z-[2]">
                <tr>
                    <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
                    <td className="sm:w-[35%]">Nombre</td>
                    <ActionColumn 
                        description={"Ver"} 
                        permission={true} 
                    />
                    <ActionColumn
                    description={"Editar"}
                    permission={permissions.cambios}
                    />
                    <ActionColumn
                        description={"Eliminar"}
                        permission={permissions.bajas}
                    />
                </tr>
            </thead>
        );
    };    

    const tableBody = (data) => {
        return (
            <tbody>
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
                  />
                </div>
            </fieldset>
        );
    };

    return{
        tableColumns,
        tableBody,
        modalBody
    };
};