import React from "react";
import Inputs from "@/app/usuarios/components/Inputs";
import { ActionButton, ActionColumn } from "@/app/utils/GlobalComponents";
import iconos from "@/app/utils/iconos";

export const useUsuariosUI = (
  tableAction,
  register,
  permissions,
  isDisabled,
  errors
) => {
    const tableColumns = () => {
        return (
            <thead className="sticky top-0 bg-white dark:bg-[#1d232a] z-[2]">
                <tr>
                    <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
                    <td className="w-[20%]">Usuario</td>
                    <td className="w-[35%] hidden sm:table-cell">Nombre</td>
                    <td className="w-[25%] hidden sm:table-cell">Email</td>
                    <ActionColumn 
                      description={"Ver"} 
                      permission={true} 
                    />
                    <ActionColumn
                      description={"Editar"}
                      permission={permissions.cambios}
                    />
                    <ActionColumn
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
            <fieldset id="fs_usuario">
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
                    />
                </div>
            </fieldset>    
        );
    };

    return{
      tableColumns,
      tableBody,
      modalBody
    };
};