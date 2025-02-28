import React from "react";
import Inputs from "@/app/cajeros/components/Inputs";
import { ActionButton, ActionColumn } from "@/app/utils/GlobalComponents";
import iconos from "@/app/utils/iconos";

export const useCajerosUI = (
    tableAction,
    register,
    permissions,
    isDisabled,
    errors,
    accion
) => {

  const handleKeyDown = (evt) => {
    if (evt.key === "Enter") {
        evt.preventDefault(); 

        const fieldset = document.getElementById("fs_formapago");
        const inputs = Array.from(
            fieldset.querySelectorAll("input[name='nombre'], input[name='direccion'], input[name='colonia'], input[name='estado'], input[name='telefono'], input[name='fax'], input[name='mail'],input[name='clave_cajero']")
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

    const tableColumns = (data = []) => {
      const hasBajas = data.some(item => item.baja === "*");
        return(
          <thead   className={`sticky top-0 z-[2] ${
            hasBajas ? "text-black" : "bg-white dark:bg-[#1d232a]"
          }`}
          style={hasBajas ? { backgroundColor: "#CF2A2A" } : {}}>
              <tr>
                <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
                <td className="sm:w-[35%]">Nombre</td>
                <td className="w-[20%]">Telefono</td>
                <td className="w-[30%]">Correo</td>
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
        return(
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
                  <td className="w-[20%]">{item.telefono}</td>
                  <td className="w-[30%]">{item.mail}</td>

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
            <fieldset id="fs_formapago"
            disabled={accion === "Ver" || accion === "Eliminar" ? true : false}>
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
                maxLenght={35}
                isDisabled={isDisabled}
                onKeyDown={(evt) => {
                  handleKeyDown(evt);
                }}
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
                onKeyDown={(evt) => {
                  handleKeyDown(evt);
                }}
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
                onKeyDown={(evt) => {
                  handleKeyDown(evt);
                }}
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
                onKeyDown={(evt) => {
                  handleKeyDown(evt);
                }}
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
                onKeyDown={(evt) => {
                  handleKeyDown(evt);
                }}
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
                onKeyDown={(evt) => {
                  handleKeyDown(evt);
                }}
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
                onKeyDown={(evt) => {
                  handleKeyDown(evt);
                }}
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
                password={true}
                onKeyDown={(evt) => {
                  handleKeyDown(evt);
                }}
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
