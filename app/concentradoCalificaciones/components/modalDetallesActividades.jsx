import React, { useState } from "react";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/NoData";
import Image from "next/image";
import iconos from "@/app/utils/iconos";
import { formatNumber, globalVariables, loadGlobalVariables, soloDecimales } from "@/app/utils/globalfn";
import { showSwal } from "@/app/utils/alerts";


function Modal_Detalles_Actividades({
    alumnoData

}){
    console.log("modal", alumnoData);
    
    
    
    return(
        <dialog id="DetallesActividades" className="modal">
            <div className="modal-box w-full max-w-3xl h-full">
                <form  encType="multipart/form-data">
                    <div className="sticky -top-6 flex justify-between items-center bg-white dark:bg-[#1d232a] w-full h-10 z-10 mb-5">
                        <h3 className="font-bold text-lg"> Detalles alumno {alumnoData.nombre} </h3>
                        <div className="flex space-x-2 items-center">
                        <button
                          className="btn btn-sm btn-circle btn-ghost"
                          onClick={(event) => {
                            event.preventDefault();
                            document.getElementById("DetallesActividades").close();
                          }}
                        >
                          ✕
                        </button>
                        </div>
                    </div>
                </form>
            </div>
        </dialog>
    );
}
export default Modal_Detalles_Actividades;