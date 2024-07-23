import React, { useState, useEffect } from "react";
import ModalBuscarCat from "./ModalBuscarCat";
import { getProductos } from "../utils/api/productos/productos";
import { getHorarios } from "../utils/api/horarios/horarios";
import { getCajeros } from "../utils/api/cajeros/cajeros";
import { getFormasPago } from "@/app/utils/api/formapago/formapago";
import { getAlumnos } from "@/app/utils/api/alumnos/alumnos";

function BuscarCat({ table, fieldsToShow, titulo, setItem, token, modalId }) {
  const [inputValue, setInputValue] = useState(""); // Estado para el valor del input

  const [inputValueDesc, setInputValueDesc] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

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
    };
    fetchData();
  }, [table, token]);
  const Buscar = async (event) => {
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
    setInputValue(id);
    setInputValueDesc(description);
    setItem(item);
  };
  const handleKeyDown = (evt) => {
    if (evt.key !== "Enter") return;
    BuscarInfo();
  };
  const BuscarInfo = () => {
    if (inputValue === "") {
      setFilteredData(data);
      setInputValue("");
      setInputValueDesc("");

      setItem({});
      return;
    }
    const infoFiltrada = data.filter((item) => {
      return fieldsToShow.some((field) => {
        const valorCampo = item[field];
        if (typeof valorCampo === "number") {
          return valorCampo.toString().includes(inputValue);
        }
        return valorCampo
          ?.toString()
          .toLowerCase()
          .includes(inputValue.toLowerCase());
      });
    });
    setFilteredData(infoFiltrada);
    setItem(infoFiltrada);
    if (infoFiltrada.length > 0) {
      const item = infoFiltrada[0];
      const id = item[fieldsToShow[0]];
      const description = item[fieldsToShow[1]];
      setInputValue(id);
      setInputValueDesc(description);
      setItem(item);
    }
  };

  return (
    <div className="  flex justify-start items-center">
      <label className="input input-bordered text-black dark:text-white input-md flex items-center gap-3  w-4/12">
        {titulo}
        <input
          id={fieldsToShow[0]}
          name={fieldsToShow[0]}
          type="text"
          onKeyDown={(evt) => handleKeyDown(evt)}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="grow dark:text-neutral-200 text-neutral-600  rounded-r-none"
        />
      </label>
      <div className="tooltip" data-tip="Buscar">
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white btn rounded-r-lg "
          onClick={Buscar}
        >
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>
      <input
        id={fieldsToShow[1]}
        name={fieldsToShow[1]}
        type="text"
        readOnly={true}
        onKeyDown={(evt) => handleKeyDown(evt)}
        value={inputValueDesc}
        // onChange={(e) => setInputValue(e.target.value)}
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
