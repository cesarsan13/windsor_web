import React from "react";

function Busqueda({ setBajas }) {
  return (
    <div className="join w-full flex justify-start h-1/8">
      <input
        id="TB_Busqueda"
        className="input input-bordered input-md join-item w-full md:w-3/6 dark:bg-slate-100 "
        placeholder="Buscar..."
      />
      <select className="select select-bordered join-item dark:bg-slate-100">
        <option disabled defaultValue={true}>
          Filtros
        </option>
        <option>Numero</option>
        <option>Descripcion</option>
      </select>
      <div className="form-control">
        <label htmlFor="" className="label cursor-pointer">
          <input
            type="checkbox"
            className=" checkbox mx-2 checkbox-md"
            onClick={(evt) => setBajas(evt.target.checked)}
          />
          <span className="label-text font-bold">Bajas</span>
        </label>
      </div>
    </div>
  );
}

export default Busqueda;
