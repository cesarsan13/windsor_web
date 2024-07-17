import React, { useState } from 'react';
import ModalBuscarCat from './ModalBuscarCat';

function BuscarCat({ data, fieldsToShow, setItem }) {
  const [inputValue, setInputValue] = useState(''); // Estado para el valor del input

  const Buscar = async (event) => {
    showModal(true);
  };

  const showModal = (show) => {
    show
      ? document.getElementById("my_modal_4").showModal()
      : document.getElementById("my_modal_4").close();
  };

  // Función para actualizar el valor del input
  const handleSetItem = (item) => {
    const descripcion = item[fieldsToShow[0]]; // Obtener el valor del campo 'descripcion'
    setInputValue(descripcion); // Ajusta el input con 'descripcion'
    setItem(item);
  };
  const handleKeyDown = (evt) => {
    if (evt.key !== "Enter") return;
    handleSetItem()
  };
  return (
    <div className='join w-full max-w-3/4 flex justify-start items-center h-1/8 p-1'>
      <input 
        type="text"
        onKeyDown={(evt)=> handleKeyDown(evt)}
        value={inputValue} // Asignar el valor del estado al input
        onChange={(e) => setInputValue(e.target.value)} // Manejar cambios en el input
        className='input input-bordered input-md join-item w-1/4 max-w-lg dark:bg-[#191e24] dark:text-neutral-200 text-neutral-600 '
      />
      <div className="tooltip" data-tip="Limpiar">
        <button
          className="btn join-item bg-blue-500 hover:bg-blue-700 text-white input-bordered"
          onClick={Buscar}
        >
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>
      <ModalBuscarCat data={data} fieldsToShow={fieldsToShow} setItem={handleSetItem} />
    </div>
  );
}

export default BuscarCat;
