import React from "react";
import Inputs from "@/app/accesos_usuarios/components/Inputs";
import { useState, useEffect } from "react";
import iconos from "@/app/utils/iconos";
import Image from 'next/image'

export const useAccesosUsuariosUI = (
    tableAction,
    register,
    setValue,
    watch,
    errors
) => {

    const [isChecked, setIsChecked] = useState(false);

    const tableColumns = () => {
        return (
            <thead className='sticky top-0 bg-white dark:bg-[#1d232a] z-[2]'>
                <tr>
                    <th className='sm:w-[10%]'>Sub. Menu</th>
                    <th className='sm:w-[5%] pt-[.5rem] pb-[.5rem]'>Menu</th>
                    <th className='sm:w-[5%]'>T A</th>
                    <th className='w-[5%]'>Altas</th>
                    <th className='w-[5%]'>Bajas</th>
                    <th className='w-[5%]'>Cambios</th>
                    <th className='w-[5%]'>Impresion</th>
                    <th className='w-[5%] pt-[.10rem] pb-[.10rem]'>Editar</th>
                </tr>
            </thead>
        );
    };

    const tableBody = (data) => {
        return (
            <tbody>
                {data.map((item) => (
                    <tr key={item.id_punto_menu} className="hover:cursor-pointer">
                        <th>{item.descripcion}</th>
                        <th>{item.menu}</th>
                        <th>{item.t_a === 1 || item.t_a === '1' ? "Si" : "No"}</th>
                        <th>{item.altas === 1 || item.altas === '1' ? "Si" : "No"}</th>
                        <th>{item.bajas === 1 || item.bajas === '1' ? "Si" : "No"}</th>
                        <th>{item.cambios === 1 || item.cambios === '1' ? "Si" : "No"}</th>
                        <th>{item.impresion === 1 || item.impresion === '1' ? "Si" : "No"}</th>
                        <th className="w-[5%] pt-[.10rem] pb-[.10rem]">
                            <div
                                className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
                                data-tip={`Editar`}
                                onClick={(evt) => tableAction(evt, item, `Editar`)}
                            >
                                <Image src={iconos.editar} alt="Editar" className="block dark:hidden" />
                                <Image src={iconos.editar_w} alt="Editar" className="hidden dark:block" />
                            </div>
                        </th>
                    </tr>
                ))}
            </tbody>
        );
    };

    const toggleCheckbox = (event) => {
        if (event.target.checked === true) {
          setValue("t_a", 1);
          setValue("altas", 1);
          setValue("bajas", 1);
          setValue("cambios", 1);
          setValue("impresion", 1);
        } else if (event.target.checked === false) {
          setValue("t_a", 0);
          setValue("altas", 0);
          setValue("bajas", 0);
          setValue("cambios", 0);
          setValue("impresion", 0);
        }
    };
    
    useEffect(() => {
        const valores = [
          watch("t_a"),
          watch("altas"),
          watch("bajas"),
          watch("cambios"),
          watch("impresion"),
        ];
        const todosSeleccionados = valores.every(valor => valor === 1 || valor === true);
        if (todosSeleccionados && watch("todos") !== true) {
          setIsChecked(true);
        }
        else if (!todosSeleccionados && watch("todos") !== false) {
          setIsChecked(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watch("todos"), watch("t_a"), watch("altas"), watch("bajas"), watch("cambios"), watch("impresion"), setValue]);
    

    const modalBody = () => {
        return (
            <fieldset id="fs_accesosusuario">
            <div className="container flex flex-col space-y-5">
              <div className="form-control w-52">
                <label className={`label cursor-pointer`}>
                  <span className="label-text">Todos</span>
                  <input
                    name="todos"
                    id="todos"
                    type="checkbox"
                    className="toggle toggle-success"
                    checked={isChecked}
                    onChange={toggleCheckbox}
                  />
                </label>
              </div>

              <Inputs
                Titulo={"Tiene Acceso"}
                register={register}
                errors={errors}
                message={"T_A Requerido"}
                name={"t_a"}
                requerido={false}
                tamañolabel={"w-full"}
                className={"md:w-1/3 w-3/6"}
              />
              <Inputs
                Titulo={"Altas"}
                register={register}
                errors={errors}
                message={"Altas Requerido"}
                name={"altas"}
                requerido={false}
                className={"md:w-1/3 w-3/6"}
              />
              <Inputs
                Titulo={"Bajas"}
                register={register}
                errors={errors}
                message={"Baja Requerido"}
                name={"bajas"}
                requerido={false}
                className={"md:w-1/3 w-3/6"}
              />
              <Inputs
                Titulo={"Cambios"}
                register={register}
                errors={errors}
                message={"Cambios Requerido"}
                name={"cambios"}
                requerido={false}
                className={"md:w-1/3 w-3/6"}
              />
              <Inputs
                Titulo={"Impresion"}
                register={register}
                errors={errors}
                message={"Impresion Requerido"}
                name={"impresion"}
                requerido={false}
                className={"md:w-1/3 w-3/6"}
              />
            </div>
          </fieldset>
        );
    };

    return {
        tableColumns,
        tableBody,
        modalBody,
    };

};