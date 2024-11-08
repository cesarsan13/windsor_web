import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/NoData";
import Image from "next/image";
import iconos from "@/app/utils/iconos";
import { formatNumber, globalVariables, loadGlobalVariables, soloDecimales } from "@/app/utils/globalfn";
import { showSwal } from "@/app/utils/alerts";
import BuscarCat from "@/app/components/BuscarCat";
import Inputs from "@/app/concentradoCalificaciones/components/InputMateria";
import { useForm } from "react-hook-form";
import DetallesMaterias from "./TablaDetalles";
import {
    getActividadesXHorarioXAlumnoXMateriaXBimestre,
    getActividadesDetalles
} from "@/app/utils/api/concentradoCalificaciones/concentradoCalificaciones";

function Modal_Detalles_Actividades({
    alumnoData,
    materiasReg,
    grupo,
    bimestre
}){
    const { data: session, status } = useSession();
    const [Actividades, setActividades] = useState({});
    const [matAct, setMatAct] = useState({});
    let M = 0;

    let dataEncabezadoDetalles = [];
    let dataCaliAlumnosBodyDetalles = [];

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const Buscar = handleSubmit(async (data) => {
        M = Number(data.Materias);
        try{
            const { token } = session.user;
            const res = await getActividadesXHorarioXAlumnoXMateriaXBimestre(token, grupo, alumnoData.numero, M, bimestre);
            const acres = await getActividadesDetalles(token, M);
            setActividades(res);
            setMatAct(acres);
        } catch (error) { }
    });
    
    return(
        <dialog id="DetallesActividades" className="modal">
            <div className="modal-box w-full max-w-5xl h-full">
                <form  encType="multipart/form-data">
                    <div className="sticky -top-6 flex justify-between items-center bg-white dark:bg-[#1d232a] w-full h-10 z-10 mb-5">
                        <h3 className="font-bold text-lg"> Detalles alumno: {alumnoData.nombre} </h3>
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
                        <div className="flex flex-row justify-center items-center h-full">
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
                                <div>
                                <button
                                  type="button"
                                  className="bg-transparent join-item hover:bg-transparent border-none shadow-none dark:text-white text-black btn rounded-r-lg max-[499px]:pb-4 max-[768px]:pb-4 max-[499px]:pt-0 max-[499px]:pl-0 max-[499px]:pr-0"
                                  onClick={Buscar}
                                >
                                  <i className="fa-solid fa-magnifying-glass"></i>
                                </button>
                                </div>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 w-full mt-10">
                            <div className="w-4/5">
                                <h4 className="font-bold text-lg"> Actividades y Evaluaciones</h4>
                                <DetallesMaterias
                                 Actividades = {Actividades}
                                 matAct = {matAct}
                                 AlumnoD = {alumnoData.numero}
                                 materiaD = {M}
                                 bimestre = {bimestre}
                                 dataEncabezadoDetalles = {dataEncabezadoDetalles}
                                />
                            </div>
                        </div>
                    </fieldset>
                </form>
            </div>
        </dialog>
    );
}
export default Modal_Detalles_Actividades;