import { ActionButton } from "@/app/utils/GlobalComponents";
import iconos from "@/app/utils/iconos";
import Inputs from "@/app/accesos_menu/components/Inputs";

export const useAccesoMenuUI = (
  tableAction,
  register,
  subMenu,
  permissions,
  isDisabled,
  errors,
  menussel
) => {
  const tableColumns = () => {
    return (
      <thead>
        <tr>
          <th className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</th>
          <th className="sm:w-[25%]">Descripción</th>
          <th className="w-[20%]">Menú</th>
          <th className="w-[25%]">Submenú</th>
          <th className="w-[5%]">Ver</th>
          <th className="w-[5%]">Editar</th>
          <th className="w-[5%]">Eliminar</th>
        </tr>
      </thead>
    );
  };

  const tableBody = (data) => {
    return (
      <tbody>
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
              <td className="w-[20%]">{item.menu}</td>
              <td className="w-[25%]">{submenuDescripcion}</td>
              <td>
                <ActionButton
                  tooltip="Ver"
                  iconDark={iconos.ver}
                  iconLight={iconos.ver_w}
                  onClick={(evt) => tableAction(evt, item, "Ver")}
                  permission={true}
                />
              </td>
              <td>
                <ActionButton
                  tooltip="Editar"
                  iconDark={iconos.editar}
                  iconLight={iconos.editar_w}
                  onClick={(evt) => tableAction(evt, item, "Editar")}
                  permission={permissions.cambios}
                />
              </td>
              <td>
                <ActionButton
                  tooltip="Eliminar"
                  iconDark={iconos.eliminar}
                  iconLight={iconos.eliminar_w}
                  onClick={(evt) => tableAction(evt, item, "Eliminar")}
                  permission={permissions.bajas}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    );
  };

  const modalBody = () => {
    return (
      <fieldset id="fs_formapago">
        <div className="container flex flex-col space-y-5">
          <Inputs
            dataType={"int"}
            name={"numero"}
            tamañolabel={"w-3/6"}
            className={"w-3/6 text-right"}
            Titulo={"Numero: "}
            type={"text"}
            requerido={true}
            errors={errors}
            register={register}
            message={"numero requerido"}
            isDisabled={true}
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
            message={"Descripcion requerido"}
            maxLenght={100}
            isDisabled={isDisabled}
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
          />
          <Inputs
            dataType={"string"}
            name={"menu"}
            tamañolabel={""}
            className={"w-5/6"}
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
          {/* <Inputs
            dataType={"string"}
            name={"sub_menu"}
            tamañolabel={""}
            className={"grow"}
            Titulo={"Sub Menu (descripción): "}
            type={"text"}
            requerido={false}
            isNumero={false}
            errors={errors}
            register={register}
            message={"Sub Menu requerido"}
            maxLenght={100}
            isDisabled={isDisabled}
          /> */}
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
