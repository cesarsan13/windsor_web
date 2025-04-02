import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ModalFechas = ({ tempFechaIni, setTempFechaIni, tempFechaFin, setTempFechaFin, handleSelectDates, handleCloseModal }) => {
  const handleDateChange = (date, setTempFecha) => {
    if (date) {
      setTempFecha(date.toLocaleDateString("en-CA")); 
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
      <h2 className="text-lg font-semibold mb-4 text-center">Selecciona las Fechas</h2>
  
      <div className="flex justify-between items-start gap-4 w-full">
        <div className="w-1/2 min-h-[300px]">
          <label className="block text-sm font-medium text-gray-700 mb-1 text-center">
            Fecha Inicial
          </label>
          <DatePicker
            selected={tempFechaIni ? new Date(tempFechaIni) : null}
            onChange={(date) => handleDateChange(date, setTempFechaIni)}
            dateFormat="yyyy-MM-dd"
            inline
            className="w-full"
          />
        </div>
        
        <div className="w-1/2 min-h-[265px]">
          <label className="block text-sm font-medium text-gray-700 mb-1 text-center">
            Fecha Final
          </label>
          <DatePicker
            selected={tempFechaFin ? new Date(tempFechaFin) : null}
            onChange={(date) => handleDateChange(date, setTempFechaFin)}
            dateFormat="yyyy-MM-dd"
            inline
            className="w-full"
          />
        </div>
      </div>
  
      <div className="flex justify-end space-x-2 mt-4">
        <button 
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          onClick={handleCloseModal}
        >
          Cancelar
        </button>
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleSelectDates}
        >
          Seleccionar
        </button>
      </div>
    </div>
  </div>
  
  );
};

export default ModalFechas;
