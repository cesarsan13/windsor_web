import React from "react";
import Inputs from "@/app/cajeros/components/Inputs";
import { ActionButton, ActionColumn } from "@/app/utils/GlobalComponents";
import iconos from "@/app/utils/iconos";

export const useCajerosUI = (
    tableAction,
    register,
    permissions,
    isDisabled,
    errors
) => {
    const itemHeaderTable = () => {
      return (
        <>
          <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
          <td className="w-[35%]">Nombre</td>
          <td className="w-[20%]">Direccion</td>
          <td className="w-[30%]">Colonia</td>
          <td className="w-[10%]">Estado</td>
          <td className="w-[15%]">Telefono</td>
          <td className="w-[10%]">Fax</td>
          <td className="w-[10%]">Mail</td>
          <td className="w-[10%]">Clave Cajero</td>
          <td className="w-[10%]">Baja</td>
        </>
      );
    };

    const itemDataTable = (item) => {
      return (
        <>
          <tr key={item.numero} className="hover:cursor-pointer">
            <th className={
                typeof item.numero === "number"
                  ? "text-left"
                  : "text-right"
              }
            >
              {item.numero}
            </th>
            <td className="w-[40%] max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap pt-[.10rem] pb-[.10rem]">
              {item.nombre}
            </td>
            <td className="text-right">{item.direccion}</td>
            <td className="text-left">{item.colonia}</td>
            <td className="text-right">{item.estado}</td>
            <td className="text-right">{item.telefono}</td>
            <td className="text-right">{item.fax}</td>
            <td className="text-right">{item.mail}</td>
            <td className="text-right">{item.clave_cajero}</td>
            <td className="text-left">{item.baja}</td>
          </tr>
        </>
      );
    };

    const tableColumns = () => {
        return(
            <thead className="sticky top-0 bg-white dark:bg-[#1d232a] z-[2]">
              <tr>
                <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
                <td className="sm:w-[35%]">Nombre</td>
                <td className="w-[20%]">Telefono</td>
                <td className="w-[30%]">Correo</td>
                <ActionColumn description={"Ver"} permission={true} />
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
        return(
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
                  <td className="w-[20%]">{item.telefono}</td>
                  <td className="w-[30%]">{item.mail}</td>

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
        return(
            <fieldset id="fs_formapago">
            <div className="container flex flex-col space-y-5">
              <Inputs
                dataType={"string"}
                name={"nombre"}
                tamañolabel={""}
                className={"grow"}
                Titulo={"Nombre: "}
                type={"text"}
                requerido={false}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Nombre requerido"}
                maxLenght={35}
                isDisabled={isDisabled}
              />
              <Inputs
                dataType={"string"}
                name={"direccion"}
                tamañolabel={""}
                className={"grow"}
                Titulo={"Direccion: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Direccion requerida"}
                maxLenght={50}
                isDisabled={isDisabled}
              />
              <Inputs
                dataType={"string"}
                name={"colonia"}
                tamañolabel={""}
                className={"grow"}
                Titulo={"Colonia: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Colonia requerida"}
                maxLenght={30}
                isDisabled={isDisabled}
              />
              <Inputs
                dataType={"string"}
                name={"estado"}
                tamañolabel={""}
                className={"grow"}
                Titulo={"Estado: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Estado requerido"}
                maxLenght={30}
                isDisabled={isDisabled}
              />
              <Inputs
                dataType={"string"}
                name={"telefono"}
                tamañolabel={""}
                className={"grow"}
                Titulo={"Telefono: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Telefono requerido"}
                maxLenght={20}
                isDisabled={isDisabled}
              />
              <Inputs
                dataType={"string"}
                name={"fax"}
                tamañolabel={""}
                className={"grow"}
                Titulo={"Fax: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Fax requerido"}
                maxLenght={20}
                isDisabled={isDisabled}
              />
              <Inputs
                dataType={"string"}
                name={"mail"}
                tamañolabel={""}
                className={"grow"}
                Titulo={"Correo: "}
                type={"email"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Correo requerido"}
                maxLenght={40}
                isDisabled={isDisabled}
              />
              <Inputs
                dataType={"string"}
                name={"clave_cajero"}
                tamañolabel={""}
                className={"grow"}
                Titulo={"Clave Cajero: "}
                type={"password"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Clave requerida"}
                maxLenght={8}
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
        modalBody,
    };
};
