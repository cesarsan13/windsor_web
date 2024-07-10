"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import TextComponent from "@/app/productos/components/textComponent";
import Style from "@/app/productos/styles.module.css"
import { showSwal, confirmSwal } from "@/app/utils/alerts";
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
    const [loading, setLoading] = useState(false);
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
            ref: producto.ref,
        },
    });
    const onSubmit = handleSubmit(async (data) => {
        event.preventDefault;
        data.id = id;
        let res = null;
        setLoading(true);
        if (accion === "Eliminar") {
            const confirmed = await confirmSwal(
                "¿Desea Continuar?",
                "Se eliminara el consultorio seleccionado",
                "warning",
                "Aceptar",
                "Cancelar"
            );
            if (!confirmed) {
                setLoading(false);
                return;
            }
        }
        const camprecio = data.cam_precio;
        data.cam_precio = camprecio;
        res = await guardarProductos(data, accion);
        if (res.status) {
            if (res.status) {
                if (accion === "Alta") {
                    const nuevoProdutco = { id, ...data };
                    setProductos([...productos, nuevoProdutco]);
                    if (!bajas) {
                        setProductosFiltrados([
                            ...productosFiltrados,
                            nuevoProdutco,
                        ]);
                    }
                }
                if (accion === "Eliminar" || accion === "Editar") {
                    const index = productos.findIndex(
                        (productos) => productos.id === data.id
                    );
                    const indexfiltrados = productosFiltrados.findIndex(
                        (productos) => productos.id === data.id
                    );
                    if (index !== -1) {
                        if (accion === "Eliminar") {
                            const productosFiltrados = productos.filter(
                                (p) => p.id !== id
                            );
                            setProductos(productosFiltrados);
                            setProductosFiltrados(productosFiltrados);
                        } else {
                            if (bajas) {
                                const productosFiltrados = productos.filter(
                                    (p) => p.id !== id
                                );
                                setProductos(productosFiltrados);
                                setProductosFiltrados(productosFiltrados);
                            } else {
                                const productosActualizados = productos.map((p) =>
                                    p.id === data.id ? data : p
                                );
                                setProductos(productosActualizados);
                                setProductosFiltrados(productosActualizados);
                            }
                        }
                    }
                }
                showSwal(res.alert_title, res.alert_text, res.alert_icon);
                setLoading(false);
                handleModal();
            }
        }
    });

    return (
        <>
            <div className="fixed inset-0 bg-slate-900 bg-opacity-75 flex items-center justify-center z-10">
                <div className="w-3/4 bg-slate-200 shadow-lg rounded-md overflow-y-scroll xl:overflow-y-hidden lg:overflow-y-hidden h-[75%] lg:h-auto">
                    <div className="sticky top-0 bg-slate-200">
                        <h1 className="font-medium text-gray-900 border-b border-gray-300 py-3 px-4 mb-4">
                            {accion} Productos {id}.
                        </h1>
                    </div>
                    <div className="px-4 pb-4">
                        {loading ? (
                            <div className="w-full py-44 h-full flex justify-center items-center">
                                <div className={Style.loader}></div>
                            </div>
                        ) : (
                            <>
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
                                                requerido={true}
                                                type="double"
                                            />
                                            <TextComponent
                                                titulo="Frecuencia"
                                                name="frecuencia"
                                                message={"Frecuencia requerido"}
                                                register={register}
                                                errors={errors}
                                                requerido={true}
                                                type="text"
                                            />
                                            <TextComponent
                                                titulo="Recargo"
                                                name="pro_recargo"
                                                message={"Recargo requerida"}
                                                register={register}
                                                errors={errors}
                                                requerido={true}
                                                type="double"
                                            />
                                            <TextComponent
                                                titulo="Aplicacion"
                                                name="aplicacion"
                                                message={"Aplicacion requerida"}
                                                register={register}
                                                errors={errors}
                                                requerido={true}
                                                type="text"
                                            />
                                            <TextComponent
                                                titulo="IVA"
                                                name="iva"
                                                message={"IVA requerida"}
                                                register={register}
                                                errors={errors}
                                                requerido={true}
                                                type="double"
                                            />
                                            <TextComponent
                                                titulo="Referencia"
                                                name="ref"
                                                message={"Referencia requerida"}
                                                register={register}
                                                errors={errors}
                                                requerido={true}
                                                type="text"
                                            />
                                            <TextComponent
                                                titulo="Condición"
                                                name="cond_1"
                                                message={"Condicion requerida"}
                                                register={register}
                                                errors={errors}
                                                requerido={true}
                                                type="number"
                                            />
                                            <TextComponent
                                                titulo="Cambia precio"
                                                name="cam_precio"
                                                message={"Cambia precio requerida"}
                                                register={register}
                                                errors={errors}
                                                requerido={false}
                                                type="checkbox"
                                            />
                                        </div>
                                    </fieldset>
                                    <div className="border-t border-gray-300 flex justify-between items-center px-4 pt-2 mt-5">
                                        <button
                                            type="submit"
                                            className="btn btn-outline btn-success text-white text-md h-8 px-3 rounded-md"
                                        >
                                            Guardar
                                        </button>
                                        <button
                                            type="button"
                                            className="h-8 px-2 text-md rounded-md btn btn-outline btn-error text-white"
                                            onClick={handleModal}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );

}

export default ModalProductos;
