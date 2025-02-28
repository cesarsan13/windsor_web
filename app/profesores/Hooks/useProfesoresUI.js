import React from "react";
import Inputs from "@/app/profesores/components/Inputs";
import { ActionButton, ActionColumn } from "@/app/utils/GlobalComponents";
import iconos from "@/app/utils/iconos";

export const useProfesoresUI = (
    tableAction,
    register,
    permissions,
    isDisabled,
    errors,
    accion,
) => {
  
  const handleKeyDown = (evt) => {
    if (evt.key === "Enter") {
        evt.preventDefault(); 

        const fieldset = document.getElementById("fs_profesores");
        const inputs = Array.from(
            fieldset.querySelectorAll("input[name='nombre'], input[name='ap_paterno'], input[name='ap_materno'], input[name='direccion'], input[name='colonia'], input[name='ciudad'], input[name='estado'], input[name='cp'], input[name='pais'], input[name='rfc'], input[name='telefono_1'], input[name='telefono_2'], input[name='fax'], input[name='celular'], input[name='email'], input[name='contraseña']")
        );

        const currentIndex = inputs.indexOf(evt.target);
        console.log("a",currentIndex);
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
          <td className="w-[40%]">Nombre</td>
          <td className="w-[15%]">Ap. Paterno</td>
          <td className="w-[15%]">Ap. Materno</td>
          <td className="w-[15%]">Direccion</td>
          <td className="w-[15%]">Colonia</td>
          <td className="w-[10%]">Ciudad</td>
          <td className="w-[10%]">Estado</td>
          <td className="w-[10%]">CP</td>
          <td className="w-[10%]">Pais</td>
          <td className="w-[10%]">RFC</td>
          <td className="w-[10%]">Telefono 1</td>
          <td className="w-[10%]">Telefono 2</td>
          <td className="w-[10%]">Fax</td>
          <td className="w-[10%]">Celular</td>
          <td className="w-[10%]">Email</td>
          <td className="w-[10%]">Contraseña</td>
          <td className="w-[10%]">Baja</td>
        </>
      );
    };
      
    const itemDataTable = (item) => {
      return (
        <>
          <tr key={item.numero} className="hover:cursor-pointer">
            <th className="text-left"> {item.numero} </th>
            <td>{item.nombre}</td>
            <td>{item.ap_paterno}</td>
            <td>{item.ap_materno}</td>
            <td>{item.direccion}</td>
            <td>{item.colonia}</td>
            <td>{item.ciudad}</td>
            <td>{item.estado}</td>
            <td>{item.cp}</td>
            <td>{item.pais}</td>
            <td>{item.rfc}</td>
            <td>{item.telefono_1}</td>
            <td>{item.telefono_2}</td>
            <td>{item.fax}</td>
            <td>{item.celular}</td>
            <td>{item.email}</td>
            <td>{item.contraseña}</td>
            <td>{item.baja}</td>
          </tr>
        </>
      );
    };

    const tableColumns = (data = [] ) => {
      const hasBajas = data.some(item => item.baja === "*");  
      return(
            <thead 
              className={`sticky top-0 z-[2] ${
              hasBajas ? "text-black" : "bg-white dark:bg-[#1d232a]"}`}
              style={hasBajas ? { backgroundColor: "#CF2A2A" } : {}}
            >
            <tr>
              <td className="w-[50px]">Núm.</td>
              <td className="w-[250px]">Nombre</td>
              <td className="w-[150px] hidden sm:table-cell">RFC</td>
              <td className="w-[150px] hidden sm:table-cell">Telefono1</td>
              <td className="w-[200px] hidden sm:table-cell">Email</td>
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
        return(
            <tbody style={{ backgroundColor: hasBajas ? "#CD5C5C" : "" }}>
            {data.map((item) => (
              <tr key={item.numero} className="hover:cursor-pointer">
                <td className="text-right">{item.numero}</td>
                <td className="text-left">{item.nombre_completo}</td>
                <td className="text-left hidden sm:table-cell">{item.rfc}</td>
                <td className="text-left hidden sm:table-cell">{item.telefono_1}</td>
                <td className="text-left hidden sm:table-cell">{item.email}</td>
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
        return(
            <fieldset id="fs_profesores"
              dataTypedisabled={accion === "Ver"  || accion === "Eliminar" ? true : false }
            >
                <div className="container flex flex-col space-y-5">
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
                    name={"ap_paterno"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"Apellido Paterno: "}
                    type={"text"}
                    requerido={true}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Apellido Paterno requerido"}
                    maxLenght={50}
                    isDisabled={isDisabled}
                    onKeyDown={(evt) => {
                      handleKeyDown(evt);
                    }}
                  />

                  <Inputs
                    dataType={"string"}
                    name={"ap_materno"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"Apellido Materno: "}
                    type={"text"}
                    requerido={true}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Apellido Materno requerido"}
                    maxLenght={50}
                    isDisabled={isDisabled}
                    onKeyDown={(evt) => {
                      handleKeyDown(evt);
                    }}
                  />

                  <Inputs
                    dataType={"string"}
                    name={"direccion"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"Direccion: "}
                    type={"text"}
                    requerido={true}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Direccion requerido"}
                    maxLenght={50}
                    isDisabled={isDisabled}
                    onKeyDown={(evt) => {
                      handleKeyDown(evt);
                    }}
                  />

                  <Inputs
                    dataType={"string"}
                    name={"colonia"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"Colonia: "}
                    type={"text"}
                    requerido={true}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Colonia requerido"}
                    maxLenght={50}
                    isDisabled={isDisabled}
                    onKeyDown={(evt) => {
                      handleKeyDown(evt);
                    }}
                  />

                  <Inputs
                    dataType={"string"}
                    name={"ciudad"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"Ciudad: "}
                    type={"text"}
                    requerido={true}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Ciudad requerido"}
                    maxLenght={50}
                    isDisabled={isDisabled}
                    onKeyDown={(evt) => {
                      handleKeyDown(evt);
                    }}
                  />

                  <Inputs
                    dataType={"string"}
                    name={"estado"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"Estado: "}
                    type={"text"}
                    requerido={true}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Estado requerido"}
                    maxLenght={20}
                    isDisabled={isDisabled}
                    onKeyDown={(evt) => {
                      handleKeyDown(evt);
                    }}
                  />

                  <Inputs
                    dataType={"string"}
                    name={"cp"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"CP: "}
                    type={"text"}
                    requerido={true}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"CP requerido"}
                    maxLenght={6}
                    isDisabled={isDisabled}
                    onKeyDown={(evt) => {
                      handleKeyDown(evt);
                    }}
                  />

                  <Inputs
                    dataType={"string"}
                    name={"pais"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"Pais: "}
                    type={"text"}
                    requerido={true}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Pais requerido"}
                    maxLenght={20}
                    isDisabled={isDisabled}
                    onKeyDown={(evt) => {
                      handleKeyDown(evt);
                    }}
                  />

                  <Inputs
                    dataType={"string"}
                    name={"rfc"}
                    tamañolabel={""}
                    className={"rounded block grow uppercase"}
                    Titulo={"RFC: "}
                    type={"text"}
                    requerido={true}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"RFC requerido"}
                    maxLenght={13}
                    isDisabled={isDisabled}
                    onKeyDown={(evt) => {
                      handleKeyDown(evt);
                    }}
                  />

                  <Inputs
                    dataType={"string"}
                    name={"telefono_1"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"Telefono 1: "}
                    type={"text"}
                    requerido={false}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Telefono 1 requerido"}
                    maxLenght={20}
                    isDisabled={isDisabled}
                    onKeyDown={(evt) => {
                      handleKeyDown(evt);
                    }}
                  />

                  <Inputs
                    dataType={"string"}
                    name={"telefono_2"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"Telefono 2: "}
                    type={"text"}
                    requerido={false}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Telefono 2 requerido"}
                    maxLenght={20}
                    isDisabled={isDisabled}
                    onKeyDown={(evt) => {
                      handleKeyDown(evt);
                    }}
                  />

                  <Inputs
                    dataType={"string"}
                    name={"fax"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"Fax: "}
                    type={"text"}
                    requerido={false}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Fax requerido"}
                    maxLenght={20}
                    isDisabled={isDisabled}
                    onKeyDown={(evt) => {
                      handleKeyDown(evt);
                    }}
                  />

                  <Inputs
                    dataType={"string"}
                    name={"celular"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"Celular: "}
                    type={"text"}
                    requerido={true}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Celular requerido"}
                    maxLenght={20}
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
                    maxLenght={80}
                    isDisabled={isDisabled}
                    onKeyDown={(evt) => {
                      handleKeyDown(evt);
                    }}
                  />
                  { accion !== "Eliminar" && (
                  <Inputs
                    dataType={"string"}
                    name={"contraseña"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"Contraseña: "}
                    type={"password"}
                    requerido={true}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Contraseña requerido"}
                    maxLenght={12}
                    isDisabled={isDisabled}
                    password={true} 
                  /> )}
                  
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