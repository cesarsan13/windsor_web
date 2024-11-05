import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/NoData";
import Image from "next/image";
import iconos from "@/app/utils/iconos";
import { formatNumber, globalVariables, loadGlobalVariables, soloDecimales } from "@/app/utils/globalfn";
import { showSwal } from "@/app/utils/alerts";
import BuscarCat from "@/app/components/BuscarCat";
import Inputs from "@/app/concentradoCalificaciones/components/Inputs";
import { useForm } from "react-hook-form";


function Modal_Detalles_Actividades({
    alumnoData,
    materiasReg,
    

}){
    const { data: session, status } = useSession();
    const [materia, setMateria] = useState({});
    console.log("modal", alumnoData);
    
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();
    
    return(
        <dialog id="DetallesActividades" className="modal">
            <div className="modal-box w-full max-w-7xl h-full">
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
                    <fieldset>
                        <div className="flex flex-col items-center h-full">
                            <Inputs
                                dataType={"int"}
                                name={"Materias"}
                                tamañolabel={""}
                                className={"fyo8m-select p-1 grow bg-[#ffffff] "}
                                Titulo={"Materia: "}
                                type={"select"}
                                requerido={true}
                                errors={errors}
                                register={register}
                                message={"Materia Requerido"}
                                isDisabled={false}
                                maxLenght={5}
                                arreglos={materiasReg}
                            />

                        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 w-full">
                          
                        </div>
                        </div>
                    </fieldset>
                </form>
            </div>
        </dialog>
    );
}
export default Modal_Detalles_Actividades;