import React from "react";
import { ActionButton, ActionColumn } from "@/app/utils/GlobalComponents";
import iconos from "@/app/utils/iconos";
import Inputs from "@/app/horarios/components/Inputs";
import { useState, useEffect } from "react";
export const useHorariosUI = (
  tableAction, 
  register, 
  control, 
  permissions, 
  isDisabled, 
  errors,
  accion,
  formaHorarios,
  setDia
) => {

  const [sinZebra, setSinZebra] = useState(false);

  const handleKeyDown = (evt) => {
    if (evt.key === "Enter") {
        evt.preventDefault(); 

        const fieldset = document.getElementById("fs_horario");
        const form = fieldset?.closest("form");
        const inputs = Array.from(
            fieldset.querySelectorAll("input[name='cancha'], input[name='horario'], input[name='max_niños'], input[name='sexo'], input[name='edad_ini'], input[name='edad_fin'], input[name='salon']")
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
  //const [dia, setDia] = useState("");
  
      useEffect(() => {
        if (formaHorarios && formaHorarios.dia) {
          setDia(formaHorarios.dia.split("/"));
          setSelectedDias(formaHorarios.dia.split("/"));
        } else {
          setDia("");
          setSelectedDias("");
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [formaHorarios]);

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

    const tableColumns = (data = []) => {
      const hasBajas = data.some(item => item.baja === "*");
        return (
            <thead className={`sticky top-0 z-[2] ${
              hasBajas ? "text-black" : "bg-white dark:bg-[#1d232a]"}`}
              style={hasBajas ? { backgroundColor: "#CF2A2A" } : {}}>
                <tr>
                    <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
                    <td className="w-[20%]">Horario</td>
                    <td className="w-[10%] hidden sm:table-cell">Salón</td>
                    <td className="w-[20%] hidden sm:table-cell">Dia</td>
                    <td className="w-[5%] hidden sm:table-cell">Cancha</td>
                    <td className="w-[5%] hidden sm:table-cell">Max Niños</td>
                    <td className="w-[10%] hidden sm:table-cell">Sexo</td>
                    <td className="w-[5%] hidden sm:table-cell">Edad Ini</td>
                    <td className="w-[5%] hidden sm:table-cell">Edad Fin</td>
                    <ActionColumn
                      description={"Ver"}
                      permission={true}
                    />
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
                    <th className={
                        typeof item.numero === "number" ? "text-left" : "text-right"
                      }> {item.numero} </th>
                    <td className="w-[20%]">{item.horario}</td>
                    <td className="w-[10%] hidden sm:table-cell">{item.salon}</td>
                    <td className="w-[20%] hidden sm:table-cell">{item.dia}</td>
                    <td className={ typeof item.numero === "number" ? "text-left hidden sm:table-cell w-[5%] " : "text-right hidden sm:table-cell w-[5%] "}>
                      {item.cancha}
                    </td>
                    <td className="w-[5%] text-right hidden sm:table-cell">{item.max_niños}</td>
                    <td className="w-[10%] hidden sm:table-cell">{item.sexo}</td>
                    <td className="w-[5%] text-right hidden sm:table-cell">{item.edad_ini}</td>
                    <td className="w-[5%] text-right hidden sm:table-cell">{item.edad_fin}</td>
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
            <fieldset id="fs_horario"
            dataTypedisabled={accion === "Ver"  || accion === "Eliminar" ? true : false }>
            <div className="container flex flex-col space-y-5">
              <div className="flex w-full flex-col md:flex-row gap-4 md:gap-0 items-start"> {/*flex w-full gap-0 items-start */}
                <Inputs
                  id={"cancha"}
                  dataType={"int"}
                  name={"cancha"}
                  tamañolabel={"w-4/6 "}
                  className={"w-3/5 text-right"}
                  Titulo={"Cancha: "}
                  type={"text"}
                  requerido={true}
                  isNumero={false}
                  errors={errors}
                  register={register}
                  message={"Cancha Requerida"}
                  maxLenght={50}
                  isDisabled={isDisabled}
                  onKeyDown={(evt) => {
                    handleKeyDown(evt);
                  }}
                />
                <Inputs
                dataType={"string"}
                name={"salon"}
                tamañolabel={"w-4/6"}
                className={"w-3/5"}
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
                <Inputs
                  id={"dia"}
                  titulo={"Dias de la semana"}
                  name={"dia"}
                  Titulo={"Dias de la semana"}
                  tamañolabel={"W-6/6 input input-bordered flex items-center gap-1 grow text-black dark:text-white"}
                  message={"dia requerido"}
                  register={register}
                  className={`W-6/6 fyo8m-select p-1.0 grow ${isDisabled ? "bg-white dark:bg-[#1d232a] cursor-not-allowed" : "bg-white dark:bg-[#1d232a]"}`}
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
                />
              
              <Inputs
                  id={"horario"}
                  dataType={"string"}
                  name={"horario"}
                  tamañolabel={"w-6/6"}
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
                  onKeyDown={(evt) => {
                    handleKeyDown(evt);
                  }}
              />
              <div className="flex w-full xl:gap-4 flex-col gap-4 md:flex-row md:gap-0 items-start"> {/*flex w-full md:w-full gap-4 */}
              <Inputs
                Titulo={"Sexo"}
                name={"sexo"}
                message={"sexo requerido"}
                tamañolabel={"w-6/6"}
                className={`w-6/6 fyo8m-select p-1.5 grow ${isDisabled ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-white"}`}
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
                onKeyDown={(evt) => {
                  handleKeyDown(evt);
                }}
              />
              <Inputs
                dataType={"int"}
                name={"max_niños"}
                tamañolabel={"w-6/6"}
                className={"w-6/6 text-right"}
                Titulo={"Max Niños: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Max Niños Requerido"}
                maxLenght={50}
                isDisabled={isDisabled}
                onKeyDown={(evt) => {
                  handleKeyDown(evt);
                }}
              />
              </div>
              <div className="flex w-full xl:gap-4 flex-col gap-4 md:flex-row  md:gap-0 items-start">{/* flex w-full md:w-full gap-4 */}
              
              <Inputs
                dataType={"int"}
                name={"edad_ini"}
                tamañolabel={"w-6/6"}
                className={"w-3/5 text-right"}
                Titulo={"Edad Ini: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Edad Inicial Requerida"}
                maxLenght={50}
                isDisabled={isDisabled}
                onKeyDown={(evt) => {
                  handleKeyDown(evt);
                }}
              />

              <Inputs
                dataType={"int"}
                name={"edad_fin"}
                tamañolabel={"w-6/6"}
                className={"w-3/5 text-right"}
                Titulo={"Edad Fin: "}
                type={"text"}
                requerido={true}
                isNumero={false}
                errors={errors}
                register={register}
                message={"Edad Final Requerida"}
                maxLenght={50}
                isDisabled={isDisabled}
                onKeyDown={(evt) => {
                  handleKeyDown(evt);
                }}
              />
              </div>
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
      sinZebra
    };
};
