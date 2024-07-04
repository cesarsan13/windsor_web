"use client";
// import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import {
    getProductos,
    getLastProduct,
    guardarProductos,
} from '@/app/utils/api/productos/productos';
import TablaProductos from "@/app//productos/components/tablaProductos";
import ModalProductos from "@/app/productos/components/modalProductos";
import Link from "next/link";
import { useRouter } from "next/navigation";
function Productos() {
    const router = useRouter();
    // const { data: session, status } = useSession();
    const [productos, setProductos] = useState([]);
    const [producto, setProducto] = useState({});
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [bajas, setBajas] = useState(false);
    const [openModal, setModal] = useState(false);
    const [accion, setAccion] = useState("");
    const [isLoading, setisLoading] = useState(false);
    const [currentID, setCurrentId] = useState('');

    const goToHome = () => {
        router.push('/');
    };
    const goBack = () => {
        router.back();
    };
    useEffect(() => {
        const fetchData = async () => {
            setisLoading(true);
            const data = await getProductos(bajas);
            console.log(data);
            setProductos(data);
            setProductosFiltrados(data);
            setisLoading(false);
        };
        fetchData();
    }, [bajas]);
    const showInfo = (acc, id) => {
        const producto = productos.find((producto) => producto.id === id);
        if (producto) {
            setCurrentId(id);
            setModal(!openModal);
            setAccion(acc);
            setProducto(producto);
        }
    };
    const Alta = async (event) => {
        setCurrentId("");
        setProducto({});
        setModal(!openModal);
        setAccion("Alta");
        // const { token } = session.user;
        let siguienteId = await getLastProduct();
        siguienteId = Number(siguienteId + 1);
        setCurrentId(siguienteId);
    };
    const handleModal = () => {
        setModal(!openModal);
    };
    const [valorBusqueda, setValorBusqueda] = useState("");
    const Buscar = () => {
        setisLoading(true);
        console.log('sepa que esta haciendo ', valorBusqueda);
        if (valorBusqueda === "") {
            setProductosFiltrados(productos);
        }
        const infoFiltrada = productos.filter((producto) =>
            Object.values(producto).some(
                (valor) =>
                    typeof valor === "string" &&
                    valor.toLowerCase().includes(valorBusqueda.toLowerCase())
            )
        );
        setProductosFiltrados(infoFiltrada);
        setisLoading(false);
    };
    const handleBusquedaChange = (event) => {
        event.preventDefault();
        setValorBusqueda(event.target.value);
        // const valorBusqueda = event.target.value;
        // if (valorBusqueda === "") {
        //     setProductosFiltrados(productos);
        // }
        // const infoFiltrada = productos.filter((producto) =>
        //     Object.values(producto).some(
        //         (valor) =>
        //             typeof valor === "string" &&
        //             valor.toLowerCase().includes(valorBusqueda.toLowerCase())
        //     )
        // );
        // setProductosFiltrados(infoFiltrada);
    };

    return (
        <div className="flex w-full h-full bg-neutral-100 min-h-screen">
            <div className="p-4 w-full">
                {openModal && (
                    <ModalProductos
                        accion={accion}
                        handleModal={handleModal}
                        id={currentID}
                        guardarProductos={guardarProductos}
                        producto={producto}
                        productos={productos}
                        productosFiltrados={productosFiltrados}
                        setProductosFiltrados={setProductosFiltrados}
                        setProductos={setProductos}
                        bajas={bajas}
                    />
                )}

                <div className='top-4 left-4'>
                    <button onClick={goToHome} className="btn btn-xs rounded-full mr-2">
                        <svg class="w-3 h-3 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path fill-rule="evenodd" d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z" clip-rule="evenodd" />
                        </svg>
                    </button>

                    <button onClick={goBack} className="btn btn-xs rounded-full mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>

                {/* container */}
                <div className="p-6 bg-zinc-800 shadow-lg rounded-lg border border-gray-200 mt-4 lg:h-[calc(93%)] sm:h-[calc(93%)]">
                    {/* catalogo */}
                    <h1 className="text-3xl text-white font-semibold mb-4 text-left">Productos</h1>
                    <div className='flex'>
                        <label className="relative w-full md:w-1/3">
                            <input
                                type="search"
                                className="w-full p-3 pl-10 bg-neutral-900 text-white rounded"
                                placeholder="Search"
                                value={valorBusqueda}
                                onChange={handleBusquedaChange}
                            />
                            <button
                                className="absolute top-0 right-0 h-full px-3 bg-transparent"
                                type="button"
                                onClick={Buscar}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                    className="h-4 w-4 opacity-70"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </label>
                        <div className="form-control bg-neutral-900 ml-4 w-32 rounded-xl flex items-center space-x-2">
                            <label className="label cursor-pointer flex items-center gap-2 pt-3">
                                <span className="label-text text-white text-left">Bajas</span>
                                <input type="checkbox" className="checkbox checkbox-bordered border-2 border-neutral-300"
                                    onChange={(evt) => {
                                        setBajas(evt.target.checked);
                                    }}
                                />
                            </label>
                        </div>
                        <button className="btn btn-outline btn-success ml-4 rounded-xl flex items-center space-x-2" onClick={Alta}>Alta</button>
                    </div>
                    <div className='h-[calc(90%)] w-[calc(100%)]'>
                        <TablaProductos
                            productosFiltrados={productosFiltrados}
                            showInfo={showInfo}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

}
export default Productos;
