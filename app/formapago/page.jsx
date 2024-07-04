import React from "react";
import Link from "next/link";
function FormaPago() {
  return (
    <div className="container mt-10">
      <div className="flex justify-center p-3">
        <h1 className="text-4xl font-bold">Formas de Pago</h1>
      </div>
      {/* botones laterales */}
      <div className="container grid grid-cols-8 gap-4 h-[calc(100%-10%)]">
        <div className=" col-span-1 w-full flex justify-center place-content-center">
          <div className="join join-vertical">
            {/* <div className="grid grid-cols-4 w-1/4 justify-items-start p-2 "> */}
            <div className="tooltip tooltip-top my-12" data-tip="Buscar">
              <kbd className="kbd">
                <i className="fa-solid fa-magnifying-glass"></i>
              </kbd>
            </div>
            <div className="tooltip tooltip-top my-5" data-tip="Añadir">
              <kbd className="kbd">
                <i className="fa-regular fa-square-plus"></i>
              </kbd>
            </div>
            <div className="tooltip tooltip-top my-5" data-tip="Guardar">
              <kbd className="kbd">
                <i className="fa-regular fa-floppy-disk"></i>
              </kbd>
            </div>
            <div className="tooltip tooltip-top my-5" data-tip="Regresar">
              <kbd className="kbd">
                <i className="fa-regular fa-circle-xmark"></i>
              </kbd>
            </div>
            {/* </div> */}
          </div>
        </div>

        <div className=" col-span-7 pt-10">
          <div className="flex ">
            <div className="join w-full flex justify-start">
              <input
                className="input input-bordered join-item w-1/3"
                placeholder="Buscar..."
              />
              <select className="select select-bordered join-item">
                <option disabled selected>
                  Filtros
                </option>
                <option>Sci-fi</option>
                <option>Drama</option>
                <option>Action</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormaPago;
