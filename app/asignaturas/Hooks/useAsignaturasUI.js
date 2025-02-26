import React from "react";
import Inputs from "@/app/asignaturas/components/Inputs";
import { ActionButton, ActionColumn } from "@/app/utils/GlobalComponents";
import iconos from "@/app/utils/iconos";

export const useAsignaturasUI = (
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
          <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">No.</td>
          <td className="w-[40%]">Descripcion</td>
          <td className="w-[15%]">Fecha Seg</td>
          <td className="w-[15%]">Hora Seg</td>
          <td className="w-[15%]">Cve Seg</td>
          <td className="w-[10%]">Baja</td>
          <td className="w-[10%]">Evaluaciones</td>
          <td className="w-[10%]">Actividad</td>
          <td className="w-[10%]">Area</td>
          <td className="w-[10%]">Orden</td>
          <td className="w-[10%]">Lenguaje</td>
          <td className="w-[10%]">Caso Evaluar</td>
        </>
      );
    };

    const itemDataTable = (item) => {
      return (
        <>
          <tr key={item.numero} className="hover:cursor-pointer">
            <th className="text-left">{item.numero}</th>
            <td>{item.descripcion}</td>
            <td>{item.fecha_seg}</td>
            <td>{item.hora_seg}</td>
            <td>{item.cve_seg}</td>
            <td>{item.baja}</td>
            <td>{item.evaluaciones}</td>
            <td>{item.actividad}</td>
            <td>{item.area}</td>
            <td>{item.orden}</td>
            <td>{item.lenguaje}</td>
            <td>{item.caso_evaluar}</td>
          </tr>
        </>
      );
    };

    const tableColumns = () => {
        return (
            <thead className="sticky top-0 bg-white dark:bg-[#1d232a] z-[2]">
            <tr>
              <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Numero</td>
              <td className="w-[30%]">Asignatura</td>
              <td className="w-[5%]">Lenguaje</td>
              <td className="w-[10%]">Caso a Evaluar</td>
              <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Area</td>
              <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Orden</td>
              <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Evaluaciones</td>
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
                <th
                  className={
                    typeof item.numero === "number" ? "text-right" : "text-left"
                  }
                >
                  {item.numero}
                </th>
                <td>{item.descripcion}</td>
                <td>{item.lenguaje}</td>
                <td>{item.caso_evaluar}</td>
                <td className={
                  typeof item.area === "number" ? "text-right" : "text-left"
                }
                >{item.area}</td>
                <td className={
                  typeof item.orden === "number" ? "text-right" : "text-left"
                }
                >{item.orden}</td>
                <td className={
                  typeof item.evaluaciones === "number" ? "text-right" : "text-left"
                }>
                  {item.evaluaciones}
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
            <fieldset id="fs_asignaturas"
            disabled={accion === "Ver" || accion === "Eliminar" ? true : false}>
            <div className="flex flex-wrap -mx-3 mb-6 px-3 gap-x-5 gap-y-5">
              <div className="flex flex-col w-full">
                <Inputs
                  dataType={"string"}
                  name={"descripcion"}
                  tamañolabel={"w-full"}
                  className={"w-full uppercase"}
                  Titulo={"Descripción: "}
                  type={"text"}
                  requerido={true}
                  isNumero={false}
                  errors={errors}
                  register={register}
                  message={"Descripción requerida"}
                  maxLenght={100}
                  isDisabled={isDisabled}
                  //handleBlur={handleBlur}
                />
              </div>
              <div className="flex flex-col w-full">
                <Inputs
                  dataType={"string"}
                  name={"lenguaje"}
                  tamañolabel={"w-full"}
                  className={`fyo8m-select p-1.5 grow `} //${isDisabled ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-white"}
                  Titulo={"Lenguaje: "}
                  type={"select"}
                  requerido={true}
                  isNumero={false}
                  errors={errors}
                  register={register}
                  message={"Lenguaje requerido"}
                  maxLenght={15}
                  isDisabled={isDisabled}
                  //handleBlur={handleBlur}
                  arreglos={[
                    { id: "ESPAÑOL", descripcion: "ESPAÑOL" },
                    { id: "INGLÉS", descripcion: "INGLÉS" },
                  ]}
                />
              </div>
              <div className="flex flex-col w-full">
                <Inputs
                  dataType={"string"}
                  name={"caso_evaluar"}
                  tamañolabel={""}
                  className={"fyo8m-select p-1.5 grow  "}
                  Titulo={"Caso a Evaluar: "}
                  type={"select"}
                  requerido={true}
                  isNumero={false}
                  errors={errors}
                  register={register}
                  message={"Caso a Evaluar requerido"}
                  maxLenght={15}
                  isDisabled={isDisabled}
                  //handleBlur={handleBlur}
                  arreglos={[
                    { id: "CALIFICACIÓN", descripcion: "CALIFICACIÓN" },
                    { id: "OTRO", descripcion: "OTRO" },
                  ]}
                />
              </div>
              <div className="flex flex-row w-full gap-x-5">
                <div className="flex flex-col w-3/6 gap-x-5">
                  <Inputs
                    dataType={"int"}
                    name={"area"}
                    tamañolabel={"w-full"}
                    className={"w-3/6 text-right"}
                    Titulo={"Area: "}
                    type={"select"}
                    requerido={true}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Area requerida"}
                    maxLenght={15}
                    isDisabled={isDisabled}
                    //handleBlur={handleBlur}
                    arreglos={[
                      { id: 1, descripcion: 1 },
                      { id: 2, descripcion: 2 },
                      { id: 3, descripcion: 3 },
                      { id: 4, descripcion: 4 },
                    ]}
                  />
                </div>
                <div className="flex flex-col w-3/6 gap-x-5">
                  <Inputs
                    dataType={"int"}
                    name={"orden"}
                    tamañolabel={"w-full"}
                    className={"w-3/6 text-right "}
                    Titulo={"Orden: "}
                    type={"inputNum"}
                    requerido={false}
                    errors={errors}
                    register={register}
                    maxLenght={6}
                    message={"Orden requerido"}
                    isDisabled={isDisabled}
                    //handleBlur={handleBlurOut}
                  />
                </div>

              </div>

              <div className="flex flex-row w-full gap-x-5 gap-y-5 max-[420px]:flex-wrap">
                <div className="flex flex-col w-3/6">
                  <Inputs
                    dataType={"int"}
                    name={"evaluaciones"}
                    tamañolabel={"w-full"}
                    className={"w-3/6 text-right"}
                    Titulo={"Evaluaciones: "}
                    type={"inputNum"}
                    requerido={false}
                    errors={errors}
                    register={register}
                    maxLenght={6}
                    message={"Evaluaciones requerida"}
                    isDisabled={isDisabled}
                    //handleBlur={handleBlurOut}
                  />
                </div>
                <div className="flex flex-col max-[420px]:w-full w-3/6">
                  <Inputs
                    dataType={"boolean"}
                    name={"actividad"}
                    tamañolabel={"max-[420px]:w-full"}
                    className={"max-[420px]:w-full w-2/6 "}
                    Titulo={"Evaluación por Actividades."}
                    type={"checkbox"}
                    requerido={false}
                    errors={errors}
                    register={register}
                    message={"Evaluación por Actividades requerida"}
                    maxLenght={5}
                    isDisabled={isDisabled}
                    //handleBlur={handleBlur}
                    //getValues={getValues}
                  />
                </div>
              </div>
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