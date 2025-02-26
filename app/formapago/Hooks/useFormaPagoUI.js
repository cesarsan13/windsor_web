import { ActionButton, ActionColumn } from "@/app/utils/GlobalComponents";
import iconos from "@/app/utils/iconos";
import React from "react";
import Inputs from "@/app/formapago/components/Inputs";

export const useFormaPagoUI = (
    tableAction,
    register,
    permissions,
    isDisabled,
    errors,
    accion
) => {

    
    const itemHeaderTable = () => {
        return (
            <>
                <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
                <td className="w-[50%]">Descripcion</td>
                <td className="w-[10%]">Comision</td>
                <td className="w-[15%]">Aplicacion</td>
                <td className="w-[20%]">Cuenta Banco</td>
                <td className="w-[10%]">Baja</td>
            </>
        );
    };

    const itemDataTable = (item) => {
      return (
        <>
          <tr key={item.numero} className="hover:cursor-pointer">
            <th
              className={
                typeof item.numero === "number"
                  ? "text-left"
                  : "text-right"
              }
            >
              {item.numero}
            </th>
            <td className="w-[40%] max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap pt-[.10rem] pb-[.10rem]">
              {item.descripcion}
            </td>
            <td className="text-right">{item.comision}</td>
            <td className="text-left">{item.aplicacion}</td>
            <td className="text-right">{item.cue_banco}</td>
            <td className="text-left">{item.baja}</td>
          </tr>
        </>
      );
    };

    const tableColumns = () => {
        return (
            <thead className="sticky top-0 bg-white dark:bg-[#1d232a]">
                <tr>
                    <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
                    <td className="w-[50%]">Descripcion</td>
                    <td className="w-[8%]">Comision</td>
                    <td className="w-[15%]">Aplicacion</td>
                    <td className="w-[20%]">Cuenta Banco</td>
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
                </tr>
            </thead>
        );
    };

    const tableBody = (data) => {
        return (
            <tbody>
                {data.map((item) => (
                    <tr key={item.numero} className="hover:cursor-pointer">
                        <th className={"text-right"}>{item.numero}</th>
                        <td>{item.descripcion}</td>
                        <td className={`text-right w-11`}>{item.comision}</td>
                        <td>{item.aplicacion}</td>
                        <td>{item.cue_banco}</td>
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
            <fieldset id="fs_formapago"
            disabled={accion === "Ver" || accion === "Eliminar" ? true : false}>
                <div className="container flex flex-col space-y-5">
                    <Inputs
                        dataType={"string"}
                        name={"descripcion"}
                        tamañolabel={"w-6/6"}
                        className={"w-4/6"}
                        Titulo={"Descripcion: "}
                        type={"text"}
                        requerido={false}
                        isNumero={false}
                        errors={errors}
                        register={register}
                        message={"descripcion requerid"}
                        maxLenght={50}
                        isDisabled={isDisabled}
                    />
                    <Inputs
                        dataType={"float"}
                        name={"comision"}
                        tamañolabel={"w-4/6"}
                        className={"w-4/6 text-right"}
                        Titulo={"Comision:"}
                        type={"text"}
                        requerido={false}
                        errors={errors}
                        register={register}
                        message={"comision requerid"}
                        maxLenght={5}
                        isDisabled={isDisabled}
                    />
                    <Inputs
                        dataType={"string"}
                        name={"aplicacion"}
                        tamañolabel={"w-6/6"}
                        className={"w-4/6"}
                        Titulo={"Aplicacion:"}
                        type={"text"}
                        requerido={false}
                        isNumero={false}
                        errors={errors}
                        register={register}
                        message={"Aplicacion requerida"}
                        maxLenght={30}
                        isDisabled={isDisabled}
                    />
                    <Inputs
                        dataType={"string"}
                        name={"cue_banco"}
                        tamañolabel={"w-6/6"}
                        className={"w-4/6"}
                        Titulo={"Cuenta Banco:"}
                        type={"text"}
                        requerido={false}
                        isNumero={false}
                        errors={errors}
                        register={register}
                        message={"Cuenta Banco requerida"}
                        maxLenght={34}
                        isDisabled={isDisabled}
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