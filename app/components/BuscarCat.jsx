import React, { useEffect, useState } from "react";
import ModalBuscarCat from "@/app/components/ModalBuscarCat";
import { FaSpinner } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { getProductos } from "@/app/utils/api/productos/productos";
import {
  getHorarios,
  getHorariosXAlumno,
} from "@/app/utils/api/horarios/horarios";
import { getCajeros } from "@/app/utils/api/cajeros/cajeros";
import { getFormasPago } from "@/app/utils/api/formapago/formapago";
import {
  getAsignaturas,
  getAsignaturasCasoOtro,
} from "@/app/utils/api/asignaturas/asignaturas";
import { getAlumnos } from "@/app/utils/api/alumnos/alumnos";
import { getComentarios } from "@/app/utils/api/comentarios/comentarios";
import { getGrupos } from "@/app/utils/api/grupos/grupos";
import { getClasesBuscaCat } from "@/app/utils/api/clases/clases";
import { loadGlobalVariables, globalVariables } from "@/app/utils/globalfn";
import { getProfesores } from "@/app/utils/api/profesores/profesores";
import { getUsuarios } from "@/app/utils/api/usuarios/usuarios";
import { getMenus } from "@/app/utils/api/accesos_menu/accesos_menu";

function BuscarCat({
  deshabilitado = false,
  table,
  nameInput,
  fieldsToShow,
  titulo,
  setItem,
  token,
  modalId,
  array,
  alignRight = false,
  id,
  idBusqueda,
  inputWidths = { contdef: "180px", first: "100px", second: "150px" },
  accion,
  contador,
  descClassName = "flex  md:w-56 sm:w-60 w-full ",
  contClassName = "flex flex-row ",
}) {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [tiutloInput, setTiutloInput] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  const { register, setValue, watch, reset } = useForm({
    defaultValues: {
      [nameInput[0]]: "",
      [nameInput[1]]: "",
    },
  });

  useEffect(() => {
    if (accion === "Alta") {
      setValue(nameInput[0], "");
      setValue(nameInput[1], "");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accion, contador]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let fetchedData = [];
        setisLoading(true);
        switch (table) {
          case "asignaturascasootro":
            fetchedData = await getAsignaturasCasoOtro(token, false);
            setTiutloInput(["numero", "Descripción"]);
            break;
          case "asignaturas":
            fetchedData = await getAsignaturas(token, false);
            setTiutloInput(["numero", "Descripción"]);
            break;
          case "alumnos":
            fetchedData = await getAlumnos(token, false);
            setTiutloInput(["numero", "Nombre"]);
            break;
          case "productos":
            fetchedData = await getProductos(token, "");
            setTiutloInput(["Id", "Descripción"]);
            break;
          case "productos_cond":
            fetchedData = await getProductos(token, "");
            setTiutloInput(["Cond", "Descripción"]);
            break;
          case "horarios":
            fetchedData = await getHorarios(token, "");
            setTiutloInput(["numero", "horario"]);
            break;
          case "cajeros":
            fetchedData = await getCajeros(token, "");
            setTiutloInput(["Número", "Nombre"]);
            break;
          case "comentarios":
            fetchedData = await getComentarios(token, "");
            setTiutloInput(["Id", "Comentario"]);
            break;
          case "grupos":
            fetchedData = await getGrupos(token, false);
            setTiutloInput(["Grupo", "Salon"]);
            break;
          case "alumnogrupo":
            loadGlobalVariables();
            fetchedData = await getHorariosXAlumno(token, idBusqueda);
            setTiutloInput(["Numero", "Nombre"]);
            break;
          case "clases":
            loadGlobalVariables();
            fetchedData = await getClasesBuscaCat(token, globalVariables.grupo);
            setTiutloInput(["Grupo", "Salon"]);
            break;
          case "formfact":
          case "formaPago":
            fetchedData = await getFormasPago(token, false);
            setTiutloInput(["numero", "descripcion"]);
            break;
          case "proveedores":
          default:
            fetchedData = [];
            break;
          case "profesores":
            fetchedData = await getProfesores(token, false);
            setTiutloInput(["numero", "nombre"]);
            break;
          case "materias":
            fetchedData = await getAsignaturas(token, false);
            setTiutloInput(["numero", "descripcion"]);
            break;
          case "usuarios":
            fetchedData = await getUsuarios(token, false);
            setTiutloInput(["numero", "nombre"]);
            break;
          case "menus":
            fetchedData = await getMenus(token, false);
            setTiutloInput(["numero", "descripcion"]);
            break;
        }
        setData(fetchedData);
        setFilteredData(fetchedData);

        if (fetchedData.length > 0) {
          const defaultItem = fetchedData.find(
            (item) => item[fieldsToShow[0]] === array
          ); // Aquí puedes elegir la lógica para establecer el default item
          if (defaultItem) {
            reset({
              [nameInput[0]]: defaultItem[fieldsToShow[0]] || "",
              [nameInput[1]]: defaultItem[fieldsToShow[1]] || "",
            });
            setItem(defaultItem);
          }
        }
        setisLoading(false);
      } catch (error) {
        setisLoading(false);
      }
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, token, id, array, idBusqueda]);

  const inputValue = watch(nameInput[0]);
  const inputValueDesc = watch(nameInput[1]);

  const Buscar = () => {
    showModal(true);
  };

  const showModal = (show) => {
    show
      ? document.getElementById(modalId).showModal()
      : document.getElementById(modalId).close();
  };

  const handleSetItem = (item) => {
    const id = item[fieldsToShow[0]];
    const description = item[fieldsToShow[1]];
    setValue(nameInput[0], id);
    setValue(nameInput[1], description);
    setItem(item);
  };

  const handleKeyDown = (evt) => {
    if (evt.key !== "Enter") return;
    evt.preventDefault();
    BuscarInfo();
  };

  const onBlur = () => {
    BuscarInfo();
  };

  const BuscarInfo = () => {
    const inputValueStr = String(inputValue);
    if (inputValueStr === "") {
      setFilteredData(data);
      reset({
        [nameInput[0]]: "",
        [nameInput[1]]: "",
      });
      setItem({});
      return;
    }

    const infoFiltrada = data.filter((item) => {
      return fieldsToShow.some((field) => {
        const valorCampo = item[field];
        const valorCampoStr = String(valorCampo);

        if (typeof valorCampo === "number") {
          return valorCampoStr === inputValueStr;
        }
        return valorCampoStr.toLowerCase() === inputValueStr.toLowerCase();
      });
    });
    setFilteredData(infoFiltrada);
    setItem(infoFiltrada);
    if (infoFiltrada.length > 0) {
      const item = infoFiltrada[0];
      const id = item[fieldsToShow[0]];
      const description = item[fieldsToShow[1]];
      setValue(nameInput[0], id);
      setValue(nameInput[1], description);
      setItem(item);
    } else {
      reset({
        [nameInput[0]]: "",
        [nameInput[1]]: "Sin información.",
      });
      setFilteredData([]);
      setItem({});
    }
  };

  return (
    <div className={contClassName}>
      {isLoading ? (
        <div className="flex justify-center items-center text-gray-600 text-lg">
          <FaSpinner className="animate-spin mx-2" />
          Cargando...
        </div>
      ) : (
        <>
          <div className="flex items-center">
            <div>
              <label
                className={`input input-bordered  input-sm md:input-md join-item text-black dark:text-white input-md flex items-center  md:mr-0`}
              >
                {/* {titulo} */}
                <input
                  disabled={deshabilitado}
                  id={nameInput[0]}
                  name={nameInput[0]}
                  type="text"
                  placeholder={titulo}
                  {...register(nameInput[0])}
                  onKeyDown={(evt) => handleKeyDown(evt)}
                  onBlur={onBlur}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  className={`grow dark:text-neutral-200 join-item input-xs md:input-sm border-b-2 border-slate-300 dark:border-slate-700 text-neutral-600 rounded-r-none ${
                    alignRight ? "text-right" : ""
                  } `}
                  style={{ width: inputWidths.first }}
                />
              </label>
            </div>
            <div>
              {" "}
              <button
                disabled={deshabilitado}
                type="button"
                className="bg-transparent join-item hover:bg-transparent border-none shadow-none dark:text-white text-black btn rounded-r-lg  max-[499px]:pl-0 max-[499px]:pr-0 mx-2 md:mx-0"
                onClick={Buscar}
              >
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>
            <div>
              {" "}
              <input
                disabled={deshabilitado}
                id={nameInput[1]}
                name={nameInput[1]}
                type="text"
                readOnly={true}
                {...register(nameInput[1])}
                className={`${descClassName} input input-bordered  input-sm md:input-md join-item rounded-r-md bg-gray-100 dark:bg-slate-800 text-black dark:text-white input-md w-full `}
                style={{ maxWidth: "380px" }}
              />
            </div>
          </div>
        </>
      )}
      <ModalBuscarCat
        data={data}
        titulo={table}
        fieldsToShow={fieldsToShow}
        setItem={handleSetItem}
        modalId={modalId}
        tiutloInput={tiutloInput}
      />
    </div>
  );
}

export default BuscarCat;
