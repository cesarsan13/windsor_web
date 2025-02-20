import React from "react";
import Inputs from "@/app/comentarios/components/Inputs";
import { ActionButton, ActionColumn } from "@/app/utils/GlobalComponents";
import iconos from "@/app/utils/iconos";

export const useCommentsUI = (
  tableAction,
  register,
  permissions,
  isDisabled,
  errors
) => {
  const generales = [
    { id: 1, descripcion: "Si" },
    { id: 0, descripcion: "No" },
  ];

  const itemHeaderTable = () => {
    return (
      <>
        <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">No.</td>
        <td className="w-[35%]">Comentario 1</td>
        <td className="w-[35%]">Comentario 2</td>
        <td className="w-[35%]">Comentario 3</td>
        <td className="w-[10%]">Baja</td>
        <td className="w-[10%]">Generales</td>
      </>
    );
  };

  const itemDataTable = (item) => {
    return (
      <>
        <tr key={item.numero} className="hover:cursor-pointer">
          <th className="text-left">{item.numero} </th>
          <td>{item.comentario_1}</td>
          <td>{item.comentario_2}</td>
          <td>{item.comentario_3}</td>
          <td>{item.baja}</td>
          <td>{item.generales}</td>
        </tr>
      </>
    );
  };

  const tableColumns = () => {
    return (
      <thead className="sticky top-0 bg-white dark:bg-[#1d232a] z-[2]">
        <tr>
          <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
          <td className="w-[45%]">Comentario 1</td>
          <td className="w-[25%] hidden sm:table-cell">Comentario 2</td>
          <td className="w-[25%] hidden sm:table-cell">Comentario 3</td>
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
    return (
      <tbody>
        {data.map((item) => (
          <tr key={item.numero} className="hover:cursor-pointer">
            <th
              className={
                typeof item.comision === "number" ? "text-left" : "text-right"
              }
            >
              {item.numero}
            </th>
            <td className="w-[45%]"> {item.comentario_1} </td>
            <td className="w-[25%] hidden sm:table-cell">
              {" "}
              {item.comentario_2}{" "}
            </td>
            <td className="w-[25%] hidden sm:table-cell">
              {" "}
              {item.comentario_3}{" "}
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
      <fieldset id="fs_comentario">
        <div className="container flex flex-col space-y-5">
          <Inputs
            dataType={"string"}
            name={"comentario_1"}
            tamañolabel={""}
            className={"rounded block grow"}
            Titulo={"Comentario 1: "}
            type={"text"}
            requerido={false}
            isNumero={false}
            errors={errors}
            register={register}
            message={"Comentario requerido"}
            maxLenght={50}
            isDisabled={isDisabled}
          />
          <Inputs
            dataType={"string"}
            name={"comentario_2"}
            tamañolabel={""}
            className={"rounded block grow"}
            Titulo={"Comentario 2: "}
            type={"text"}
            requerido={false}
            isNumero={false}
            errors={errors}
            register={register}
            message={"Comentario requerido"}
            maxLenght={50}
            isDisabled={isDisabled}
          />
          <Inputs
            dataType={"string"}
            name={"comentario_3"}
            tamañolabel={""}
            className={"rounded block grow"}
            Titulo={"Comentario 3: "}
            type={"text"}
            requerido={false}
            isNumero={false}
            errors={errors}
            register={register}
            message={"Comentario requerido"}
            maxLenght={50}
            isDisabled={isDisabled}
          />
          <Inputs
            name={"generales"}
            tamañolabel={"w-3/6"}
            className={"md:w-1/3 w-3/6"}
            Titulo={"Generales:"}
            type={"toogle"}
            requerido={false}
            errors={errors}
            maxLenght={1}
            register={register}
            message={"General requerido"}
            isDisabled={isDisabled}
            generales={generales}
          />
        </div>
      </fieldset> 
    );
  };

  return {
    itemHeaderTable,
    itemDataTable,
    tableColumns,
    tableBody,
    modalBody,
  };
};