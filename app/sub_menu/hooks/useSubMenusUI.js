import iconos from "@/app/utils/iconos";
import Inputs from "@/app/accesos_menu/components/Inputs";
import BuscarCat from "@/app/components/BuscarCat";
import { ActionButton, ActionColumn } from "@/app/utils/GlobalComponents";
import { useState } from "react";

export const useSubMenusUI = (
  tableAction,
  register,
  setMenu,
  permissions,
  isDisabled,
  errors,
  subMenu,
  currentAction,
  session,
  accion
) => {
  const columnasBuscaCat = ["numero", "descripcion"];
  const nameInputs = ["numero", "descripcion"];
  const [sinZebra, setSinZebra] = useState(false);

  const tableColumns = (data = []) => {
    const hasBajas = data.some(item => item.baja === "*"); 
    return (
      <thead
        className={`sticky top-0 z-[2] ${
        hasBajas ? "text-black" : "bg-white dark:bg-[#1d232a]"}`}
        style={hasBajas ? { backgroundColor: "#CF2A2A" } : {}}
      >
        <tr>
          <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
          <td className="sm:w-[5%] hidden sm:table-cell">ID Acceso</td>
          <td className="sm:w-[20%]">Sub Menú</td>
          <td className="sm:w-[20%]">Menú Descripción</td>
          <td className="sm:w-[20%] hidden sm:table-cell">Menú</td>
          <td className="sm:w-[20%] hidden sm:table-cell">Menú Ruta</td>
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
    setSinZebra(hasBajas);
    return (
      <tbody style={{ backgroundColor: hasBajas ? "#CD5C5C" : "" }}>
        {data.map((row) => (
          <tr
            key={`${row.numero}-${row.id_acceso}`}
            className="hover:cursor-pointer"
          >
            <td className="text-left">{row.numero}</td>
            <td className="text-left hidden sm:table-cell">{row.id_acceso}</td>
            <td className="w-[20%]">{row.descripcion}</td>
            <td className="w-[20%]">{row.menu_descripcion}</td>
            <td className="w-[20%] hidden sm:table-cell">{row.menu}</td>
            <td className="w-[20%] hidden sm:table-cell">{row.menu_ruta}</td>
            <ActionButton
              tooltip="Ver"
              iconDark={iconos.ver}
              iconLight={iconos.ver_w}
              onClick={(evt) => tableAction(evt, row, "Ver")}
              permission={true}
            />
            {row.baja !== "*" ? (
              <>
                <ActionButton
                  tooltip="Editar"
                  iconDark={iconos.editar}
                  iconLight={iconos.editar_w}
                  onClick={(evt) => tableAction(evt, row, "Editar")}
                  permission={permissions.cambios}
                />

                <ActionButton
                  tooltip="Eliminar"
                  iconDark={iconos.eliminar}
                  iconLight={iconos.eliminar_w}
                  onClick={(evt) => tableAction(evt, row, "Eliminar")}
                  permission={permissions.bajas}
                />
              </>
            ) : (
              <ActionButton
                tooltip="Reactivar"
                iconDark={iconos.documento}
                iconLight={iconos.documento_w}
                onClick={(evt) => tableAction(evt, row, "Reactivar")}
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
      <fieldset id="fs_SubMenus">
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
          />
        </div>
      </fieldset>
    );
  };

  return {
    tableColumns,
    tableBody,
    modalBody,
    sinZebra
  };
};
