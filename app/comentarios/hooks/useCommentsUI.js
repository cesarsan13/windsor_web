import React from "react";
import Inputs from "@/app/comentarios/components/Inputs";
import { ActionButton, ActionColumn } from "@/app/utils/GlobalComponents";
import iconos from "@/app/utils/iconos";
import { useState } from "react";

export const useCommentsUI = (
  tableAction,
  register,
  permissions,
  isDisabled,
  errors,
  accion
) => {

  const [sinZebra, setSinZebra] = useState(false);

  const generales = [
    { id: 1, descripcion: "Si" },
    { id: 0, descripcion: "No" },
  ];

  const handleKeyDown = (evt) => {
    if (evt.key === "Enter") {
        evt.preventDefault(); 

        const fieldset = document.getElementById("fs_comentario");
        const inputs = Array.from(
            fieldset.querySelectorAll("input[name='comentario_1'], input[name='comentario_2'], input[name='comentario_3']") //input[name='generales']
        );

        const currentIndex = inputs.indexOf(evt.target);
        if (currentIndex !== -1) {
            if (currentIndex < inputs.length - 1) {
                inputs[currentIndex + 1].focus(); 
            } else {
                const submitButton = fieldset?.querySelector("button[type='submit']");
                if (submitButton) submitButton.click(); 
            }
        }
    }
  };

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

  const tableColumns = (data = []) => {
    const hasBajas = data.some(item => item.baja === "*");
    return (
      <thead   className={`sticky top-0 z-[2] ${
        hasBajas ? "text-black" : "bg-white dark:bg-[#1d232a]"
      }`}
      style={hasBajas ? { backgroundColor: "#CF2A2A" } : {}}>
        <tr>
          <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
          <td className="w-[45%]">Comentario 1</td>
          <td className="w-[25%] hidden sm:table-cell">Comentario 2</td>
          <td className="w-[25%] hidden sm:table-cell">Comentario 3</td>
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
          <tr key={item.numero} className="hover:cursor-pointer">
            <th className="text-left">{item.numero}</th>
            <td className="w-[45%]">{item.comentario_1}</td>
            <td className="w-[25%] hidden sm:table-cell">{item.comentario_2}</td>
            <td className="w-[25%] hidden sm:table-cell">{item.comentario_3}</td>
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
      <fieldset id="fs_comentario"
        dataTypedisabled={accion === "Ver"  || accion === "Eliminar" ? true : false }
        >
        <div className="container flex flex-col space-y-5">
          <Inputs
            dataType={"string"}
            name={"comentario_1"}
            tamañolabel={""}
            className={"rounded block grow"}
            Titulo={"Comentario 1: "}
            type={"text"}
            requerido={true}
            isNumero={false}
            errors={errors}
            register={register}
            message={"Comentario requerido"}
            maxLenght={50}
            isDisabled={isDisabled}
            onKeyDown={(evt) => {
              handleKeyDown(evt);
            }}
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
            onKeyDown={(evt) => {
              handleKeyDown(evt);
            }}
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
            onKeyDown={(evt) => {
              handleKeyDown(evt);
            }}
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
    sinZebra
  };
};