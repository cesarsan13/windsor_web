import React from "react";

function ImpElementos({
    setFormaHorarioAPC,
    handleSelectionChange,
    handleCheckChange
 
}){

  
    return (
      <div className="flex flex-row h-[calc(100%)] gap-4">
        <label title="Horario 1:" className={`input input-bordered input-md text-black dark:text-white flex items-center gap-3`}>
        <span className="text-black dark:text-white">Horario</span>
          <select className={`text-black dark:text-white`} onChange={(event) => handleSelectionChange(event)}>
            <option value="">&nbsp;&nbsp; ... &nbsp;&nbsp;</option>
            { setFormaHorarioAPC.map((option) => (
              <option key={option.numero} value={option.numero}>
                {option.horario}
              </option>
            ))}
          </select>
        </label>
        <label title="Horario 2:" className={`input input-bordered input-md text-black dark:text-white flex items-center gap-3`}>
        <span className="text-black dark:text-white">Horario</span>
          <select className={`text-black dark:text-white`} onChange={(event) => handleSelectionChange(event)}>
            <option>&nbsp;&nbsp; ... &nbsp;&nbsp;</option>
            { setFormaHorarioAPC.map((option) => (
              <option key={option.numero} value={option.numero}>
                {option.horario}
              </option>
            ))}
          </select>
        </label>
            
        <div className=" col-8">
            <label className={` input-md text-black dark:text-white flex items-center gap-3`}>
                <span className="text-black dark:text-white">Ordenar por:</span>
                <label className={` input-md text-black dark:text-white flex items-center gap-3`} onChange={(event) => handleCheckChange(event)} >
                    <span className="text-black dark:text-white">Nombre</span>
                    <input type="radio" name="ordenar" value="nombre" className="radio"defaultChecked />
                </label>
                <label className={` input-md text-black dark:text-white flex items-center gap-3`} onChange={(event) => handleCheckChange(event)}>
                    <span className="text-black dark:text-white">Número</span>
                    <input type="radio" name="ordenar" value="numero" className="radio" />
                </label>
            </label>
        </div>
    
      </div>

    )

  }

export default ImpElementos;
