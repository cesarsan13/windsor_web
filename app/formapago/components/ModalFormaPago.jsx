import React from "react";

function ModalFormaPago() {
  return (
    <div>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-5">Forma de Pago</h3>
          <div className="container flex flex-col space-y-5">
            <label className="input input-bordered input-md flex items-center gap-3 w-2/6">
              Numero
              <input type="text" className="w-3/6" />
            </label>
            <label className="input input-bordered input-md flex items-center gap-3">
              Descripcion
              <input type="text" className="grow" />
            </label>
            <label className="input input-bordered input-md flex items-center gap-3 w-3/6">
              Comision
              <input type="text" className="grow w-4/6" />
            </label>
            <label className="input input-bordered input-md flex items-center gap-3 w-5/6">
              Aplicacion
              <input type="text" className="grow w-5/6" />
            </label>
            <label className="input input-bordered input-md flex items-center gap-3 w-5/6">
              Banco
              <input type="text" className="grow w-5/6" />
            </label>
          </div>
          <div className=" modal-action">
            <div className="tooltip tooltip-top my-5" data-tip="Guardar">
              <kbd className="kbd">
                <i className="fa-regular fa-floppy-disk mx-2"></i> Guardar
              </kbd>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default ModalFormaPago;
