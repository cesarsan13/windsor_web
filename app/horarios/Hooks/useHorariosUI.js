import React from "react";
import { ActionButton, ActionColumn } from "@/app/utils/GlobalComponents";
import iconos from "@/app/utils/iconos";
import Inputs from "@/app/horarios/components/Inputs";
import { useState, useEffect } from "react";
export const useHorariosUI = (
    tableAction,
    register,
    permissions,
    isDisabled,
    errors,
    horarios,
    control
) => {
  const options = [
    { value: "LU", label: "Lunes" },
    { value: "MA", label: "Martes" },
    { value: "MI", label: "Miércoles" },
    { value: "JU", label: "Jueves" },
    { value: "VI", label: "Viernes" },
    { value: "SA", label: "Sábado" },
    { value: "DO", label: "Domingo" },
  ];
  const [selectedDias, setSelectedDias] = useState([]);
    const [dia, setDia] = useState("");
  
      useEffect(() => {
        if (horarios && horarios.dia) {
          setDia(horarios.dia.split("/"));
          setSelectedDias(horarios.dia.split("/"));
        } else {
          setDia("");
          setSelectedDias("");
        }
      }, [horarios]);
    const handleSelectChange = (selectedOptions) => {
      setSelectedDias(selectedOptions.map((option) => option.value).join("/"));
      setDia(selectedOptions.map((option) => option.value).join("/"));
    };
    const itemHeaderTable = () => {
        return (
          <>
            <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
            <td className="w-[15%]">Horario</td>
            <td className="w-[10%]">Salon</td>
            <td className="w-[15%]">Dia</td>
            <td className="w-[40%]">Cancha</td>
            <td className="w-[15%]">Max_niños</td>
            <td className="w-[15%]">Sexo</td>
            <td className="w-[10%]">Edad_ini</td>
            <td className="w-[10%]">Edad_fin</td>
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
                {item.cancha}
              </td>
              <td className="text-right">{item.dia}</td>
              <td className="text-left">{item.horario}</td>
              <td className="text-right">{item.max_niños}</td>
              <td className="text-right">{item.sexo}</td>
              <td className="text-right">{item.edad_ini}</td>
              <td className="text-right">{item.edad_fin}</td>
              <td className="text-right">{item.baja}</td>
              <td className="text-left">{item.salon}</td>
            </tr>
          </>
        );
    };

    const tableColumns = () => {
        return (
            <thead className="sticky top-0 bg-white dark:bg-[#1d232a] z-[2]">
                <tr>
                    <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
                    <th className="w-[15%]">Horario</th>
                    <th className="w-[5%]">Salón</th>
                    <th className="w-[25%]">Dia</th>
                    <th className="w-[5%]">Cancha</th>
                    <th className="w-[10%]">Max Niños</th>
                    <th className="w-[5%]">Sexo</th>
                    <th className="w-[5%]">Edad Ini</th>
                    <th className="w-[5%]">Edad Fin</th>
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
                  <tr key={item.numero}>
                    <th
                      className={
                        typeof item.numero === "number" ? "text-left" : "text-right"
                      }
                    >
                      {item.numero}
                    </th>
                    <td>{item.horario}</td>
                    <td>{item.salon}</td>
                    <td>{item.dia}</td>
                    <td
                      className={
                        typeof item.numero === "number" ? "text-left" : "text-right"
                      }
                    >
                      {item.cancha}
                    </td>
                    <td className="text-right">{item.max_niños}</td>
                    <td>{item.sexo}</td>
                    <td className="text-right">{item.edad_ini}</td>
                    <td className="text-right">{item.edad_fin}</td>
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
            <fieldset id="fs_horario">
            <div className="container flex flex-col space-y-5">
              {/* <Inputs
                dataType={"int"}
                name={"numero"}
                tamañolabel={"w-3/6"}
                className={"w-3/6 text-right"}
                Titulo={"Numero: "}
                type={"text"}
                requerido={true}
                errors={errors}
                register={register}
                message={"Numero Requerido"}
                isDisabled={true}
              /> */}
              <Inputs
                dataType={"int"}
                name={"cancha"}
                tamañolabel={"w-3/6"}
                className={"w-4/6 text-right"}
                Titulo={"Cancha: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Cancha Requerida"}
                maxLenght={50}
                isDisabled={isDisabled}
              />
              {/* <Inputs
                titulo={"Dias de la semana"}
                name={"dia"}
                Titulo={"Dias de la semana"}
                tamañolabel={"input input-bordered flex items-center gap-3 grow text-black dark:text-white"}
                message={"dia requerido"}
                register={register}
                className={`fyo8m-select p-1.0 grow ${isDisabled ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-white"}`}
                errors={errors}
                requerido={true}
                dataType={"multi-select"}
                type={"multi-select"}
                options={options}
                control={control}
                value={options.filter((option) =>
                  selectedDias.includes(option.value)
                )}
                onChange={handleSelectChange}
                isDisabled={isDisabled}
              /> */}
              <Inputs
                dataType={"string"}
                name={"horario"}
                tamañolabel={"w-3/6"}
                className={"w-5/6"}
                Titulo={"Horario: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Horario Requerido"}
                maxLenght={50}
                isDisabled={isDisabled}
              />
              <Inputs
                dataType={"int"}
                name={"max_niños"}
                tamañolabel={"w-2/5"}
                className={"w-2/5 text-right"}
                Titulo={"Max Niños: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Max Niños Requerido"}
                maxLenght={50}
                isDisabled={isDisabled}
              />
              <Inputs
                Titulo={"Sexo"}
                name={"sexo"}
                message={"sexo requerido"}
                tamañolabel={""}
                className={`fyo8m-select p-1.5 grow ${isDisabled ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-white"}`}
                register={register}
                errors={errors}
                requerido={true}
                type={"select"}
                isDisabled={isDisabled}
                arreglos={[
                  { id: "NIÑOS", descripcion: "Niños" },
                  { id: "NIÑAS", descripcion: "Niñas" },
                  { id: "MIXTO", descripcion: "Mixto" },
                ]}
              />
              <Inputs
                dataType={"int"}
                name={"edad_ini"}
                tamañolabel={"w-2/5"}
                className={"w-2/5 text-right"}
                Titulo={"Edad Ini: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Edad Inicial Requerida"}
                maxLenght={50}
                isDisabled={isDisabled}
              />
              <Inputs
                dataType={"int"}
                name={"edad_fin"}
                tamañolabel={"w-2/5"}
                className={"w-2/5 text-right"}
                Titulo={"Edad Fin: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Edad Final Requerida"}
                maxLenght={50}
                isDisabled={isDisabled}
              />
              <Inputs
                dataType={"string"}
                name={"salon"}
                tamañolabel={"w-3/6"}
                className={"w-5/6"}
                Titulo={"Salón: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Salón Requerido"}
                maxLenght={10}
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
        horarios,
    };
};
