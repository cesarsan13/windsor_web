"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import TextComponent from "@/app/productos/components/textComponent";
function ModalProductos({
    accion,
    handleModal,
    id,
    guardarProductos,
    //   session,
    producto,
    productos,
    productosFiltrados,
    setProductosFiltrados,
    setProductos,
    bajas,
}) {
    const [error, setError] = useState(null);
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            descripcion: producto.descripcion,
            costo: producto.costo,
            frecuencia: producto.frecuencia,
            pro_recargo: producto.pro_recargo,
            aplicacion: producto.aplicacion,
            iva: producto.iva,
            cond_1: producto.cond_1,
            cam_precio: producto.cam_precio,
            precio: producto.precio,
        },
    });

    const onSubmit = handleSubmit(async (data) => {
        event.preventDefault;
        console.log(data);
    });

    return (
        <>
            {/* {openmodal && ( */}
            <div className="fixed rounded-xl h-[calc(100%-20%)] lg:h-[calc(100%-24px)] w-[calc(100%-5%)] lg:w-[calc(82%-1rem)] bg-slate-900 bg-opacity-75 flex items-center  justify-center z-10  ">
                <div className=" w-3/4 bg-slate-200 shadow-lg  rounded-md overflow-y-scroll xl:overflow-y-hidden lg:overflow-y-hidden h-[75%] lg:h-auto ">
                    <div className="sticky top-0 bg-slate-200 ">
                        <h1 className="font-medium text-gray-900 border-b border-gray-300 py-3 px-4 mb-4 ">
                            {accion} Productos {id}.
                        </h1>
                    </div>

                    <div className="px-4 pb-4 ">
                        <form action="" onSubmit={onSubmit}>
                            {error && (
                                <p className="bg-red-500 text-white text-xs p-3 rounded-md text-center">
                                    {error}
                                </p>
                            )}
                            <fieldset disabled={accion === "Eliminar"}>
                                <div className="flex flex-wrap -mx-3 mb-6">
                                    <TextComponent
                                        titulo="Descripcion"
                                        name="descripcion"
                                        message={"Descripcion de usuario requerido"}
                                        register={register}
                                        errors={errors}
                                        requerido={true}
                                        type="text"
                                    />
                                    <TextComponent
                                        titulo="Costo"
                                        name="costo"
                                        message={"Costo requerido"}
                                        register={register}
                                        errors={errors}
                                        requerido={false}
                                        type="number"
                                    />
                                    <TextComponent
                                        titulo="Frecuencia"
                                        name="frecuencia"
                                        message={"Frecuencia requerido"}
                                        register={register}
                                        errors={errors}
                                        requerido={false}
                                        type="text"
                                    />
                                    <TextComponent
                                        titulo="Recargo"
                                        name="pro_cargo"
                                        message={"Recargo requerida"}
                                        register={register}
                                        errors={errors}
                                        requerido={false}
                                        type="number"
                                    />
                                    <TextComponent
                                        titulo="Aplicacion"
                                        name="aplicacion"
                                        message={"Aplicacion requerida"}
                                        register={register}
                                        errors={errors}
                                        requerido={false}
                                        type="text"
                                    />
                                    <TextComponent
                                        titulo="IVA"
                                        name="iva"
                                        message={"IVA requerida"}
                                        register={register}
                                        errors={errors}
                                        requerido={false}
                                        type="number"
                                    />
                                    <TextComponent
                                        titulo="Condición"
                                        name="cond_1"
                                        message={"Condicion requerida"}
                                        register={register}
                                        errors={errors}
                                        requerido={false}
                                        type="number"
                                    />
                                    <TextComponent
                                        titulo="Precio"
                                        name="cam_precio"
                                        message={"Precio requerida"}
                                        register={register}
                                        errors={errors}
                                        requerido={false}
                                        type="number"
                                    />
                                    <TextComponent
                                        titulo="Referencia"
                                        name="ref"
                                        message={"Referencia requerida"}
                                        register={register}
                                        errors={errors}
                                        requerido={false}
                                        type="text"
                                    />
                                </div>
                            </fieldset>
                            <div className="border-t border-gray-300 flex justify-between items-center px-4 pt-2 mt-5">
                                <button
                                    type="submit"
                                    className=" bg-green-800 text-white text-md h-8 px-3 rounded-md"
                                >
                                    Guardar
                                </button>
                                <button
                                    type="button"
                                    className="h-8 px-2 text-md rounded-md bg-red-700 text-white "
                                    onClick={handleModal}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* )} */}
        </>
    );
}

export default ModalProductos;
