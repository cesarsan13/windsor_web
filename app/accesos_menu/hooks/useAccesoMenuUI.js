import React from "react";
import { ActionButton, ActionColumn } from "@/app/utils/GlobalComponents";
import iconos from "@/app/utils/iconos";
import Inputs from "@/app/accesos_menu/components/Inputs";
import { useState } from "react";



export const useAccesoMenuUI = (
  tableAction,
  register,
  subMenu,
  permissions,
  isDisabled,
  errors,
  menussel,
  accion
) => {

  const [sinZebra, setSinZebra] = useState(false);
    
    const handleKeyDown = (evt) => {
      if (evt.key === "Enter") {
          evt.preventDefault(); 
  
          const fieldset = document.getElementById("fs_AccesoMenu");
          const inputs = Array.from(
              fieldset.querySelectorAll("input[name='descripcion'], input[name='ruta'], input[name='icono']")
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

  const tableColumns = (data = []) => {
    const hasBajas = data.some(item => item.baja === "*");  
    return (
      <thead
        className={`sticky top-0 z-[2] ${
        hasBajas ? "text-black" : "bg-white dark:bg-[#1d232a]"}`}
        style={hasBajas ? { backgroundColor: "#CF2A2A" } : {}}
      >
        <tr>
          <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
          <td className="sm:w-[25%]">Descripción</td>
          <td className="w-[20%] hidden sm:table-cell">Menú</td>
          <td className="w-[25%] hidden sm:table-cell">Submenú</td>
          < ActionColumn
            description={"Ver"}
            permission={true}
          />
          {!hasBajas && < ActionColumn
            description={"Editar"}
            permission={permissions.cambios}
          />}
          {!hasBajas && < ActionColumn
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
        {data.map((item) => {
          const submenus =
            subMenu?.filter((sub) => sub.id_acceso === item.numero) || [];
          const submenuDescripcion =
            submenus.length > 0
              ? submenus.map((sub) => sub.descripcion).join(", ")
              : "";
          return (
            <tr key={item.numero} className="hover:cursor-pointer">
              <th className="text-left">{item.numero}</th>
              <td className="w-[25%]">{item.descripcion}</td>
              <td className="w-[20%] hidden sm:table-cell">{item.menu}</td>
              <td className="w-[25%] hidden sm:table-cell">{submenuDescripcion}</td>
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
          );
        })}
      </tbody>
    );
  };

  const modalBody = () => {
    return (
      <fieldset 
        id="fs_AccesoMenu"
        dataTypedisabled={accion === "Ver"  || accion === "Eliminar" ? true : false }
      >
        <div className="container flex flex-col space-y-5">
          <Inputs
            dataType={"string"}
            name={"descripcion"}
            tamañolabel={""}
            className={"grow"}
            Titulo={"Descripción: "}
            type={"text"}
            requerido={true}
            isNumero={false}
            errors={errors}
            register={register}
            message={"Descripcion requerido"}
            maxLenght={100}
            isDisabled={isDisabled}
            onKeyDown={(evt) => {
              handleKeyDown(evt);
            }}
          />
          <Inputs
            dataType={"string"}
            name={"ruta"}
            tamañolabel={""}
            className={"grow"}
            Titulo={"Ruta: "}
            type={"text"}
            requerido={true}
            isNumero={false}
            errors={errors}
            register={register}
            message={"Ruta requerido"}
            maxLenght={255}
            isDisabled={isDisabled}
            onKeyDown={(evt) => {
              handleKeyDown(evt);
            }}
          />
          <Inputs
            dataType={"string"}
            name={"icono"}
            tamañolabel={""}
            className={"grow"}
            Titulo={"Icono: "}
            type={"text"}
            requerido={true}
            isNumero={false}
            errors={errors}
            register={register}
            message={"Icono requerido"}
            maxLenght={100}
            isDisabled={isDisabled}
            onKeyDown={(evt) => {
              handleKeyDown(evt);
            }}
          />
          <Inputs
            dataType={"string"}
            name={"menu"}
            tamañolabel={""}
            className={"w-full"}
            Titulo={"Menu: "}
            type={"select"}
            requerido={true}
            isNumero={false}
            errors={errors}
            register={register}
            message={"Menu requerido"}
            maxLenght={100}
            arreglos={menussel.map((menu) => ({
              id: menu.id,
              descripcion: menu.nombre,
            }))}
            isDisabled={isDisabled}
          />
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
