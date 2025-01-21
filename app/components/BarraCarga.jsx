"use client";
import React from "react";

function BarraCarga({porcentaje, cerrarTO}){
    setTimeout(() => {
        if(cerrarTO){
            document.getElementById("cargamodal").close();
        }
    }, 500);

    return(
        <>
        <dialog id="cargamodal" className="modal-box w-full min-w-64 min-h-44 bg-base-200">
            <h3 className="font-bold text-lg mb-5 text-black dark:text-white">
              Proceso de Registros Excel
            </h3>
            <progress value={porcentaje} max="100" class="h-6 progress bg-[#ffffff]"> </progress>
            <h4 className="text-center font-bold text-lg mb-5 text-slate-700 dark:text-white">
              {porcentaje}%
            </h4>
        </dialog>
        
        </>
    );
}
export default BarraCarga;