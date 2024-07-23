import React, { useState, useEffect } from 'react';
import ModalBuscarCat from './ModalBuscarCat';
import { getProductos } from '../utils/api/productos/productos';
import { getHorarios } from '../utils/api/horarios/horarios';
import { getCajeros } from '../utils/api/cajeros/cajeros';

function BuscarCat({ table, fieldsToShow,titulo, setItem, token, modalId }) {
  const [inputValue, setInputValue] = useState(''); // Estado para el valor del input
  const [inputValueDesc, setInputValueDesc] = useState('');
  const [data, setData] = useState([]); // Estado para los datos de la tabla
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let fetchedData = [];
      switch (table) {
        case 'productos':
          fetchedData = await getProductos(token, "");
          break;
        case 'horarios':
          fetchedData = await getHorarios(token, "");
          break;
          case 'cajeros':
            fetchedData= await getCajeros(token,"")
            break
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
    const id = item[fieldsToShow[0]]; // Obtener el valor del campo 'id'
    const description = item[fieldsToShow[1]]
    setInputValue(id); // Ajusta el input con 'descripcion'
    setInputValueDesc(description)
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
      
      setItem({})
      return;
    }

    const infoFiltrada = data.filter((item) => {
      return fieldsToShow.some((field) => {
        const valorCampo = item[field];
        if (typeof valorCampo === "number") {
          return valorCampo.toString().includes(inputValue);
        }
        return valorCampo?.toString().toLowerCase().includes(inputValue.toLowerCase());
      });
    });

    console.log("Datos filtrados:", infoFiltrada); // Agrega un log para verificar los datos filtrados
    setFilteredData(infoFiltrada);
    setItem(infoFiltrada)
    if (infoFiltrada.length > 0) {
      const item = infoFiltrada[0];
      const id = item[fieldsToShow[0]]; // Obtener el valor del campo 'id'
      const description = item[fieldsToShow[1]]; // Obtener el valor del campo 'description'
      setInputValue(id); // Ajusta el input con 'id'
      setInputValueDesc(description); // Ajusta el input con 'description'
      setItem(item); // Establece el item
    }
  };

  return (
    <div className='  flex justify-start items-center'>
      <label className='input input-bordered text-black dark:text-white input-md flex items-center gap-3  w-4/12'>
        {titulo} 
        <input
          type="text"
          onKeyDown={(evt) => handleKeyDown(evt)}
          value={inputValue} // Asignar el valor del estado al input
          onChange={(e) => setInputValue(e.target.value)} // Manejar cambios en el input
          className='grow dark:text-neutral-200 text-neutral-600  rounded-r-none'
        />

      </label>
      <div className="tooltip" data-tip="Buscar">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white btn rounded-r-lg "
          onClick={Buscar}
        >
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>
      <input
          type="text"
          readOnly={true}
          onKeyDown={(evt) => handleKeyDown(evt)}
          value={inputValueDesc} // Asignar el valor del estado al input
          // onChange={(e) => setInputValue(e.target.value)} // Manejar cambios en el input
          className='input input-bordered bg-gray-100 dark:bg-slate-800 text-black dark:text-white input-md flex items-center gap-3'
        />
      <ModalBuscarCat data={data} titulo={table} fieldsToShow={fieldsToShow} setItem={handleSetItem} modalId={modalId} />
    </div>
  );
}

export default BuscarCat;