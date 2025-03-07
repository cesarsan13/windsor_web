import React, { useState } from "react";
import Inputs from "@/app/usuarios/components/Inputs";
import { ActionButton, ActionColumn } from "@/app/utils/GlobalComponents";
import iconos from "@/app/utils/iconos";

export const useUsuariosUI = (
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

        const fieldset = document.getElementById("fs_usuario");
        const form = fieldset?.closest("form");
        const inputs = Array.from(
            fieldset.querySelectorAll("input[name='name'], input[name='nombre'], input[name='email'], input[name='password'], input[name='match_password']")
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

    const tableColumns = (data = []) => {
      const hasBajas = data.some(item => item.baja === "*");
        return (
            <thead className={`sticky top-0 z-[2] ${
              hasBajas ? "text-black" : "bg-white dark:bg-[#1d232a]"}`}
              style={hasBajas ? { backgroundColor: "#CF2A2A" } : {}}
            >
              <tr>
                  <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
                  <td className="w-[20%]">Usuario</td>
                  <td className="w-[35%] hidden sm:table-cell">Nombre</td>
                  <td className="w-[25%] hidden sm:table-cell">Email</td>
                  <ActionColumn 
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
                {data.map((item) => (
                  <tr key={item.id} className="hover:cursor-pointer">
                        <th
                          className={
                            typeof item.comision === "number"
                              ? "text-left"
                              : "text-right"
                          }
                        >
                          {item.id}
                        </th>
                        <td className="w-[25%]"> {item.name} </td>
                        <td className="w-[35%] hidden sm:table-cell">
                          {" "}
                          {item.nombre}{" "}
                        </td>
                        <td className="w-[25%] hidden sm:table-cell"> {item.email} </td>

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
            <fieldset id="fs_usuario"
              dataTypedisabled={accion === "Ver"  || accion === "Eliminar" ? true : false }
            >
                <div className="container flex flex-col space-y-5">
                    <Inputs
                        dataType={"string"}
                        name={"name"}
                        tamañolabel={""}
                        className={"rounded block grow"}
                        Titulo={"Usuario: "}
                        type={"text"}
                        requerido={true}
                        isNumero={false}
                        errors={errors}
                        register={register}
                        message={"Usuario requerido"}
                        maxLenght={50}
                        isDisabled={isDisabled}
                        onKeyDown={(evt) => {
                          handleKeyDown(evt);
                        }}
                    />

                    <Inputs
                        dataType={"string"}
                        name={"nombre"}
                        tamañolabel={""}
                        className={"rounded block grow"}
                        Titulo={"Nombre: "}
                        type={"text"}
                        requerido={true}
                        isNumero={false}
                        errors={errors}
                        register={register}
                        message={"Nombre requerido"}
                        maxLenght={50}
                        isDisabled={isDisabled}
                        onKeyDown={(evt) => {
                          handleKeyDown(evt);
                        }}
                    />

                    <Inputs
                        dataType={"string"}
                        name={"email"}
                        tamañolabel={""}
                        className={"rounded block grow"}
                        Titulo={"Email: "}
                        type={"email"}
                        requerido={true}
                        isNumero={false}
                        errors={errors}
                        register={register}
                        message={"Email requerido"}
                        maxLenght={50}
                        isDisabled={isDisabled}
                        onKeyDown={(evt) => {
                          handleKeyDown(evt);
                        }}
                    />
                    
                      <Inputs
                        dataType={"string"}
                        name={"password"}
                        tamañolabel={""}
                        className={"rounded block grow"}
                        Titulo={"Contraseña: "}
                        type={"password"}
                        requerido={false}
                        isNumero={false}
                        errors={errors}
                        register={register}
                        message={"Contraseña requerida"}
                        maxLenght={255}
                        isDisabled={isDisabled}
                        onKeyDown={(evt) => {
                          handleKeyDown(evt);
                        }}
                      /> 
                    
                      <Inputs
                        dataType={"string"}
                        name={"match_password"}
                        tamañolabel={""}
                        className={"rounded block grow"}
                        Titulo={"Confirmar Contraseña: "}
                        type={"password"}
                        requerido={false}
                        isNumero={false}
                        errors={errors}
                        register={register}
                        message={"Confirmar Contraseña requerida"}
                        maxLenght={255}
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