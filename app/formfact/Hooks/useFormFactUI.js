import React from "react";
import Inputs from "@/app/formfact/components/Inputs";
import { ActionButton, ActionColumn } from "@/app/utils/GlobalComponents";
import iconos from "@/app/utils/iconos";

export const useFormFactUI = (
    tableAction,
    register,
    permissions,
    isDisabled,
    errors
) => {
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

    const tableColumns = () => {
        return (
            <thead className="sticky top-0 bg-white dark:bg-[#1d232a] z-[2]">
                <tr>
                    <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
                    <td className="w-[60%]">Nombre</td>
                    <td className="w-[40%]">Longitud</td>
                    < ActionColumn
                        description={"Ver"}
                        permission={true}
                    />
                    < ActionColumn
                        description={"Editar"}
                        permission={permissions.cambios}
                    />
                    < ActionColumn
                        description={"Eliminar"}
                        permission={permissions.bajas}
                    />
                    < ActionColumn
                        description={"A. Formato"}
                        permission={permissions.cambios}
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
                  <th className="text-left">{item.numero_forma}</th>
                  <td className="text-left w-50">{item.nombre_forma}</td>
                  <td>{item.longitud}</td>
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
                <ActionButton
                  tooltip="A. Formato"
                  iconDark={iconos.actualizar_formato}
                  iconLight={iconos.actualizar_formato_w}
                  onClick={(evt) => tableAction(evt, item, "ActualizaFormato")}
                  permission={permissions.cambios}
                />
                </tr>
              ))}
            </tbody>
        );
    };

    const modalBody = () => {
        return (
            <fieldset 
              id="fs_formapago"
              disabled={accion === "Ver"  || accion === "Eliminar" ? true : false }
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
                //handleBlur={handleBlur}
              />
              <Inputs
                dataType={"int"}
                name={"longitud"}
                tamañolabel={"w-4/6"}
                className={"rounded block w-4/6 text-right"}
                Titulo={"Longitud: "}
                type={"int"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Longitud requerido"}
                maxLenght={7}
                isDisabled={isDisabled}
                //handleBlur={handleBlur}
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
        modalBody
    };

};