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
function Productos() {
    // const { data: session, status } = useSession();
    const [productos, setProductos] = useState([]);
    const [producto, setProducto] = useState({});
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [bajas, setBajas] = useState(false);
    const [openModal, setModal] = useState(false);
    const [accion, setAccion] = useState("");
    const [isLoading, setisLoading] = useState(false);
    const [currentID, setCurrentId] = useState('');
    useEffect(() => {
        const fetchData = async () => {
            const data = await getProductos(bajas);
            console.log(data);
            setProductos(data);
            setProductosFiltrados(data);
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
        console.log(siguienteId);
        siguienteId = Number(siguienteId);
        setCurrentId(siguienteId);
    };
    const handleModal = () => {
        setModal(!openModal);
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
                        // session={session}
                        producto={producto}
                        productos={productos}
                        productosFiltrados={productosFiltrados}
                        setProductosFiltrados={setProductosFiltrados}
                        setProductos={setProductos}
                        bajas={bajas}
                    />
                )}

                <div className='top-4 left-4 '>
                    <Link href="../" className="btn btn-xs btn-error rounded-lg mr-2 ">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </Link>
                    <Link href="../" className="btn btn-xs btn-warning rounded-lg mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                        </svg>
                    </Link>
                    <Link href="../" className="btn btn-xs btn-success rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                </div>

                {/* catalogo */}
                <h1 className="text-3xl text-black font-semibold mb-4 text-center">Cátalogo Productos</h1>
                {/* container */}
                <div className="p-6 bg-zinc-800 shadow-lg rounded-lg border border-gray-200 h-[calc(60%)]">
                    <div className='flex'>
                        <label className="input input-bordered bg-neutral-900 flex items-center gap-2 w-1/3">
                            <input type="text" className="grow" placeholder="Search" />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-4 w-4 opacity-70">
                                <path
                                    fillRule="evenodd"
                                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                    clipRule="evenodd" />
                            </svg>
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
                    {/* </div> */}
                    {/* container */}
                    {/* <div className="p-4 bg-zinc-800 shadow-lg rounded-lg border border-gray-200"> */}
                    <TablaProductos
                        productosFiltrados={productosFiltrados}
                        showInfo={showInfo}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </div >
    );
}
export default Productos;
