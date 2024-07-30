import React, { useEffect, useState } from "react";
import ModalBuscarCat from "./ModalBuscarCat";
import { useForm } from "react-hook-form";
import { getProductos } from "@/app/utils/api/productos/productos";
import { getHorarios } from "@/app/utils/api/horarios/horarios";
import { getCajeros } from "@/app/utils/api/cajeros/cajeros";
import { getFormasPago } from "@/app/utils/api/formapago/formapago";
import { getAlumnos } from "@/app/utils/api/alumnos/alumnos";
import { getComentarios } from "@/app/utils/api/comentarios/comentarios";

function BuscarCat({ table, nameInput, fieldsToShow, titulo, setItem, token, modalId, id }) {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const { register, setValue, watch, reset } = useForm({
    defaultValues: {
      [nameInput[0]]: "",
      [nameInput[1]]: ""
    }
  });
  // console.log(id);

  useEffect(() => {
    const fetchData = async () => {
      let fetchedData = [];
      switch (table) {
        case "alumnos":
          fetchedData = await getAlumnos(token, false);
          break;
        case "productos":
          fetchedData = await getProductos(token, "");
          break;
        case "horarios":
          fetchedData = await getHorarios(token, "");
          break;
        case "cajeros":
          fetchedData = await getCajeros(token, "");
          break;
        case "comentarios":
          fetchedData = await getComentarios(token, "");
          break;
        case "formfact":
        case "formaPago":
          fetchedData = await getFormasPago(token, false);
          break;
        case "proveedores":
        default:
          fetchedData = [];
          break;
      }
      setData(fetchedData);
      setFilteredData(fetchedData);

      // Establecer los valores predeterminados con la data recibida solo una vez
      if (fetchedData.length > 0) {
        // console.log(fetchedData);
        const defaultItem = fetchedData.find(item => item[fieldsToShow[0]] === id); // Aquí puedes elegir la lógica para establecer el default item
        // console.log(defaultItem);
        if (defaultItem) {
          reset({
            [nameInput[0]]: defaultItem[fieldsToShow[0]] || "",
            [nameInput[1]]: defaultItem[fieldsToShow[1]] || ""
          });
        }
      }
    };
    fetchData();
  }, [table, token, id]);

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

  const BuscarInfo = () => {
    const inputValueStr = String(inputValue); // Asegura que inputValue sea una cadena

    if (inputValueStr === "") {
      setFilteredData(data);
      reset();
      setItem({});
      return;
    }

    const infoFiltrada = data.filter((item) => {
      return fieldsToShow.some((field) => {
        const valorCampo = item[field];
        const valorCampoStr = String(valorCampo); // Asegura que valorCampo sea una cadena

        if (typeof valorCampo === "number") {
          return valorCampoStr.includes(inputValueStr);
        }
        return valorCampoStr.toLowerCase().includes(inputValueStr.toLowerCase());
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
    }
  };


  return (
    <div className="flex justify-start items-center">
      <label className="input input-bordered text-black dark:text-white input-md flex items-center gap-3 w-4/12">
        {titulo}
        <input
          id={nameInput[0]}
          name={nameInput[0]}
          type="text"
          {...register(nameInput[0])}
          onKeyDown={(evt) => handleKeyDown(evt)}
          className="grow dark:text-neutral-200 text-neutral-600 rounded-r-none"
        />
      </label>
      <div className="tooltip" data-tip="Buscar">
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white btn rounded-r-lg"
          onClick={Buscar}
        >
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>
      <input
        id={nameInput[1]}
        name={nameInput[1]}
        type="text"
        readOnly={true}
        {...register(nameInput[1])}
        onKeyDown={(evt) => handleKeyDown(evt)}
        className="input input-bordered bg-gray-100 dark:bg-slate-800 text-black dark:text-white input-md flex items-center gap-3"
      />
      <ModalBuscarCat
        data={data}
        titulo={table}
        fieldsToShow={fieldsToShow}
        setItem={handleSetItem}
        modalId={modalId}
      />
    </div>
  );
}

export default BuscarCat;
