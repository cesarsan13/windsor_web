import React from "react";
import { useSession } from "next-auth/react";
import Sheet from "./sheet";
function ConfigReporte({ labels, setLabels }) {
  const { data: session, status } = useSession();

  return (
    // <dialog id="modal_formato" className="modal ">
    <div className=" w-11/12 max-w-5xl">
      <button
        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        onClick={() => document.getElementById("modal_formato").close()}
      >
        ✕
      </button>
      <form>
        <h1 className="font-bold text-2xl mb-5">Actualizacion de formato</h1>
        <fieldset id="fs_formapago" className="flex flex-row">
          <Sheet labels={labels} setLabels={setLabels}></Sheet>
          <div className=" flex flex-col">
            <h3>Propiedades de </h3>

            <div
              className={`tooltip tooltip-top my-5  "hover:cursor-pointer"
              `}
              data-tip="Guardar"
            >
              <button
                type="submit"
                id="btn_guardar"
                className="btn  bg-blue-500 hover:bg-blue-700 text-white"
              >
                <i className="fa-regular fa-floppy-disk mx-2"></i> Guardar
              </button>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
    // </dialog>
  );
}

export default ConfigReporte;
