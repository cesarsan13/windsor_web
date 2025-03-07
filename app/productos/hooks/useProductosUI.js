import React from "react";
import Inputs from "@/app/productos/components/Inputs";
import { ActionButton, ActionColumn } from "@/app/utils/GlobalComponents";
import iconos from "@/app/utils/iconos";
import { formatNumber } from "@/app/utils/globalfn";
import { useState } from "react";
export const useProductosUI = (
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

        const fieldset = document.getElementById("fs_productos");
        const form = fieldset?.closest("form");
        const inputs = Array.from(
            fieldset.querySelectorAll("input[name='numero'], input[name='descripcion'], input[name='ref'], input[name='frecuencia'], input[name='aplicacion'], input[name='costo'], input[name='por_recargo'], input[name='iva'], input[name='cond_1'], input[name='cam_precio']")
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

  const itemHeaderTable = () => {
    return (
      <>
        <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
        <td className="w-[40%]">Descripcion</td>
        <td className="w-[15%]">Costo</td>
        <td className="w-[15%]">Frecuencia</td>
        <td className="w-[10%]">Recargo</td>
        <td className="w-[15%]">Aplicacion</td>
        <td className="w-[10%]">IVA</td>
        <td className="w-[10%]">Condición</td>
        <td className="w-[10%]">Cambia Precio</td>
        <td className="w-[10%]">Referencia</td>
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
              typeof item.numero === "number" ? "text-left" : "text-right"
            }
          >
            {item.numero}
          </th>
          <td className="w-[40%] max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap pt-[.10rem] pb-[.10rem]">
            {item.descripcion}
          </td>
          <td className="text-right">{formatNumber(item.costo)}</td>
          <td className="text-left">{item.frecuencia}</td>
          <td className="text-right">{item.por_recargo}</td>
          <td className="text-right">{item.aplicacion}</td>
          <td className="text-right">{item.iva}</td>
          <td className="text-right">{item.cond_1}</td>
          <td className="text-right">{item.cam_precio}</td>
          <td className="text-left">{item.ref}</td>
          <td className="text-left">{item.baja}</td>
        </tr>
      </>
    );
  };
  const tableColumns = (data = []) => {
    const hasBajas = data.some(item => item.baja === "*");
    return (
        <thead className={`sticky top-0 z-[2] ${
          hasBajas ? "text-black" : "bg-white dark:bg-[#1d232a]"}`}
          style={hasBajas ? { backgroundColor: "#CF2A2A" } : {}}>        
          <tr>
          <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
          <td className="w-[40%]">Descripcion</td>
          <td className="w-[15%]">Aplicacion</td>
          <td className="w-[15%]">Costo</td>
          <td className="w-[10%]">Recargo</td>
          <td className="w-[10%]">Condición</td>
          <td className="w-[10%]">IVA</td>
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
            <th
              className={
                typeof item.comision === "number" ? "text-left" : "text-right"
              }
            >
              {item.numero}
            </th>
            <td className="w-[40%] max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap pt-[.10rem] pb-[.10rem]">
              {item.descripcion}
            </td>
            <td>{item.aplicacion}</td>
            <td className="text-right">{formatNumber(item.costo)}</td>
            <td className="text-right">{formatNumber(item.por_recargo)}</td>
            <td className="text-right">{item.cond_1}</td>
            <td className="text-right">{formatNumber(item.iva)}</td>

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
      <fieldset
        id="fs_productos"
        disabled={accion === "Ver" || accion === "Eliminar" ? true : false}
      >
        <div className="container flex flex-col space-y-5">
          <Inputs
            dataType={"int"}
            name={"numero"}
            tamañolabel={`w-3/6 ${accion !== "Alta" ? "hidden" : ""}`}
            className={"w-2/6 grow text-right"}
            Titulo={"Numero: "}
            type={"int"}
            requerido={true}
            isNumero={false}
            errors={errors}
            register={register}
            message={"Numero requerido"}
            maxLenght={20}
            isDisabled={isDisabled}
            onKeyDown={(evt) => {
              handleKeyDown(evt);
            }}
          />
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
            message={"Descripción requerido"}
            maxLenght={30}
            isDisabled={isDisabled}
            onKeyDown={(evt) => {
              handleKeyDown(evt);
            }}
          />
          <Inputs
            dataType={"string"}
            name={"ref"}
            tamañolabel={""}
            className={"grow"}
            Titulo={"Referencia: "}
            type={"text"}
            requerido={true}
            isNumero={false}
            errors={errors}
            register={register}
            message={"Referencia requerido"}
            maxLenght={3}
            isDisabled={isDisabled}
            onKeyDown={(evt) => {
              handleKeyDown(evt);
            }}
          />
          <Inputs
            dataType={"string"}
            name={"frecuencia"}
            tamañolabel={""}
            className={"grow"}
            Titulo={"Frecuencia:"}
            type={"text"}
            requerido={true}
            errors={errors}
            register={register}
            message={"Frecuencia requerido"}
            maxLenght={6}
            isDisabled={isDisabled}
            onKeyDown={(evt) => {
              handleKeyDown(evt);
            }}
          />
          <Inputs
            dataType={"string"}
            name={"aplicacion"}
            tamañolabel={""}
            className={"grow"}
            Titulo={"Aplicación:"}
            type={"text"}
            requerido={true}
            errors={errors}
            register={register}
            message={"Aplicación requerido"}
            maxLenght={34}
            isDisabled={isDisabled}
            onKeyDown={(evt) => {
              handleKeyDown(evt);
            }}
          />
          <Inputs
            dataType={"float"}
            name={"costo"}
            tamañolabel={"w-3/6"}
            className={" w-2/6 grow text-right"}
            Titulo={"Costo:"}
            type={"float"}
            requerido={true}
            errors={errors}
            register={register}
            message={"Costo requerido"}
            maxLenght={10}
            isDisabled={isDisabled}
            onKeyDown={(evt) => {
              handleKeyDown(evt);
            }}
          />
          <Inputs
            dataType={"float"}
            name={"por_recargo"}
            tamañolabel={"w-3/6"}
            className={" w-2/6 grow text-right"}
            Titulo={"Recargos:"}
            type={"float"}
            requerido={true}
            errors={errors}
            register={register}
            message={"Recargos requerido"}
            maxLenght={10}
            isDisabled={isDisabled}
            onKeyDown={(evt) => {
              handleKeyDown(evt);
            }}
          />
          <Inputs
            dataType={"float"}
            name={"iva"}
            tamañolabel={"w-3/6"}
            className={" w-2/6 grow text-right"}
            Titulo={"IVA:"}
            type={"float"}
            requerido={true}
            errors={errors}
            register={register}
            message={"IVA requerido"}
            maxLenght={10}
            isDisabled={isDisabled}
            onKeyDown={(evt) => {
              handleKeyDown(evt);
            }}
          />
          <Inputs
            dataType={"int"}
            name={"cond_1"}
            tamañolabel={"w-3/6"}
            className={" w-2/6 grow text-right"}
            Titulo={"Condición:"}
            type={"int"}
            requerido={true}
            errors={errors}
            register={register}
            message={"Condición requerido"}
            maxLenght={10}
            isDisabled={isDisabled}
            onKeyDown={(evt) => {
              handleKeyDown(evt);
            }}
          />
          <Inputs
            dataType={"boolean"}
            name={"cam_precio"}
            tamañolabel={"w-3/6"}
            className={" w-2/6 grow"}
            Titulo={"Cambia P."}
            type={"checkbox"}
            requerido={false}
            errors={errors}
            register={register}
            message={"Cambia precio requerido"}
            maxLenght={1}
            isDisabled={isDisabled}
            onKeyDown={(evt) => {
              handleKeyDown(evt);
            }}
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
