
import React, { useState, useEffect } from 'react';
import NoData from "@/app/components/noData";

function ModalBuscarCat({ data, fieldsToShow, setItem, modalId, titulo,tiutloInput }) {
  const [inputValues, setInputValues] = useState({}); // Estado para los valores de los inputs
  const [filteredData, setFilteredData] = useState(data); // Estado para los datos filtrados

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleInputChange = (field, value) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    const filtered = data.filter((item) => {
      return fieldsToShow.every((field) => {
        const valorCampo = item[field]?.toString().toLowerCase();
        const inputValue = inputValues[field]?.toLowerCase();
        return inputValue ? valorCampo.includes(inputValue) : true;
      });
    });
    setFilteredData(filtered);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const ModalAction = (dato) => {
    setItem(dato);
    setFilteredData(data)
    setInputValues({});
    document.getElementById(modalId).close();
  };
  const handleclosemodal = () => {
    setFilteredData(data)
    setInputValues({});
    document.getElementById(modalId).close()
  }
  return (
    <dialog id={modalId} className='modal'>
      <div className='modal-box w-full h-full'>
        <button
        type='button'
          className='btn btn-sm btn-circle btn-ghost text-black dark:text-white absolute right-2 top-2'
          onClick={handleclosemodal}
        >
          ✕
        </button>
        <h3 className='font-bold text-lg mb-5 text-black dark:text-white'>Catalogo de {titulo}</h3>
        <div className='flex justify-start items-center'>
          {fieldsToShow.map((field, index) => (
            <label key={index} className={`input w-5/12 input-bordered ml-2 text-black dark:text-white input-md flex items-center gap-3`}>
              {`${tiutloInput[index] || fieldsToShow[index]}: `}
              <input
                type="text"
                value={inputValues[field] || ''}
                onChange={(e) => handleInputChange(field, e.target.value)}
                onKeyDown={handleKeyDown} // Añadir evento de tecla abajo
                className='grow dark:text-neutral-200 border-b-2 border-slate-300 dark:border-slate-700 w-5/12 input-sm text-neutral-600 rounded-r-none'
              />
            </label>
          ))}
          <div className="tooltip" data-tip="Buscar">
            <button
            type='button'
              className="hover:bg-transparent border-none shadow-none bg-transparent text-black dark:text-white btn rounded-r-lg"
              onClick={handleSearch}
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
        </div>
        <div className='text-black bg-white dark:bg-[#1d232a] dark:text-white mt-4 w-full'>
          {filteredData.length > 0 ? (
            <table className='table table-xs table-zebra table-pin-rows table-pin-cols max-h-[calc(50%)]'>
              <thead className='relative z-[1] md:static'>
                <tr>
                  <th></th>
                  {fieldsToShow.map((field, index) => (
                    <th key={index}>{field}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index}>
                    <th key={index}>
                      <div className='flex flex-row'>
                        <div
                          className="kbd tooltip tooltip-right hover:cursor-pointer hover:bg-transparent border-none shadow-none bg-transparent text-black dark:text-white"
                          data-tip={`Seleccionar ${item[fieldsToShow[0]]}`}
                          onClick={() => ModalAction(item)}
                        >
                          <i className="fa-solid fa-check-double"></i>
                        </div>
                      </div>
                    </th>
                    {fieldsToShow.map((field, subIndex) => (
                      <td className='p-2' key={subIndex}>{item[field]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <NoData />
          )}
        </div>
      </div>
    </dialog>
  );
}

export default ModalBuscarCat;
