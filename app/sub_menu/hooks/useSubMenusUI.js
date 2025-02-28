import { ActionButton } from "@/app/utils/GlobalComponents";
import iconos from "@/app/utils/iconos";
import Inputs from "@/app/accesos_menu/components/Inputs";
import BuscarCat from "@/app/components/BuscarCat";

export const useSubMenusUI = (
  tableAction,
  register,
  setMenu,
  permissions,
  isDisabled,
  errors,
  subMenu,
  currentAction,
  session
) => {
  const columnasBuscaCat = ["numero", "descripcion"];
  const nameInputs = ["numero", "descripcion"];

  const tableColumns = () => {
    return (
      <thead>
        <tr>
          <th className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</th>
          <th className="sm:w-[5%]">ID Acceso</th>
          <th className="sm:w-[20%]">Sub Menú</th>
          <th className="sm:w-[20%]">Menú Descripción</th>
          <th className="sm:w-[20%]">Menú</th>
          <th className="sm:w-[20%]">Menú Ruta</th>
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
        {data.map((row) => (
          <tr
            key={`${row.numero}-${row.id_acceso}`}
            className="hover:cursor-pointer"
          >
            <th className="text-left">{row.numero}</th>
            <th className="text-left">{row.id_acceso}</th>
            <td className="w-[20%]">{row.descripcion}</td>
            <td className="w-[20%]">{row.menu_descripcion}</td>
            <td className="w-[20%]">{row.menu}</td>
            <td className="w-[20%]">{row.menu_ruta}</td>
            <td>
              <ActionButton
                tooltip="Ver"
                iconDark={iconos.ver}
                iconLight={iconos.ver_w}
                onClick={(evt) => tableAction(evt, row, "Ver")}
                permission={true}
              />
            </td>
            <td>
              <ActionButton
                tooltip="Editar"
                iconDark={iconos.editar}
                iconLight={iconos.editar_w}
                onClick={(evt) => tableAction(evt, row, "Editar")}
                permission={permissions.cambios}
              />
            </td>
            <td>
              <ActionButton
                tooltip="Eliminar"
                iconDark={iconos.eliminar}
                iconLight={iconos.eliminar_w}
                onClick={(evt) => tableAction(evt, row, "Eliminar")}
                permission={permissions.bajas}
              />
            </td>
          </tr>
        ))}
      </tbody>
    );
  };

  const modalBody = () => {
    return (
      <fieldset id="fs_formapago">
        <div className="container flex flex-col space-y-5">
          <Inputs
            dataType={"string"}
            name={"descripcion"}
            tamañolabel={"w-3/6"}
            className={"w-3/6"}
            Titulo={"Descripción: "}
            type={"text"}
            requerido={true}
            errors={errors}
            register={register}
            message={"Descripción requerido"}
            isDisabled={isDisabled}
            maxLenght={50}
          />
          <BuscarCat
            table="menus"
            fieldsToShow={columnasBuscaCat}
            nameInput={nameInputs}
            setItem={setMenu}
            token={session.user.token}
            modalId="modal_menus"
            array={subMenu.id_acceso}
            id={subMenu.id_acceso}
            titulo="Menu: "
            alignRight={true}
            inputWidths={{ first: "60px", second: "380px" }}
            accion={currentAction}
            // deshabilitado={isDisabled}
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
