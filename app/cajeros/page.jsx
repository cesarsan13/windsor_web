"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  getCajeros,
  guardaCajero, //insert
  siguiente,
} from "@/app/utils/api/cajeros/cajeros";
import ModalCajero from "@/app/cajeros/components/modalCajeros";
import { showSwal } from "@/app/utils/alerts";
import { Tooltip } from "react-tooltip";
import TablaCajeros from "@/app/cajeros/components/tablaCajeros";

function Cajeros() {
  const { data: session, status } = useSession();
  const [cajero, setCajero] = useState({});
  const [cajeros, setCajeros] = useState([]);
  const [cajerosFiltrados, setCajerosFiltrados] = useState([]);
  const [error, setError] = useState(null);
  const [currentID, setCurrentId] = useState(0);
  const [openModal, setModal] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [accion, setAccion] = useState("");
  const [baja, setBaja] = useState(false);

  useEffect(() => {
    if (status === "loading" || !session) {
      return;
    }
    const fetchCajeros = async () => {
      try {
        setisLoading(true);
        const { token } = session.user;
        const data = await getCajeros(token, baja);
        setCajeros(data);
        setCajerosFiltrados(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setisLoading(false);
      }
    };
    fetchCajeros();
  }, [session, status, baja]);
  if (!session) {
    return <></>;
  }
  const Alta = async (event) => {
    setCurrentId("");
    setCajero({});
    setModal(!openModal);
    setAccion("Alta");
    const { token } = session.user;
    let siguienteId = await siguiente(token);
    siguienteId = Number(siguienteId) + 1;
    setCurrentId(siguienteId);
  };
  const maxId = cajeros.reduce((max, obj) => {
    return obj.numero > max ? obj.numero : max;
  }, 0);
  const handleModal = () => {
    setModal(!openModal);
  };
  const showInfo = (acc, numero) => {
    const cajero = cajeros.find((cajero) => cajero.numero === numero);
    if (cajero) {
      setCurrentId(numero);
      setModal(!openModal);
      setAccion(acc);
      setCajero(cajero);
    }
  };
  const handleBusquedaChange = (event) => {
    event.preventDefault();
    const valorBusqueda = event.target.value;
    if (valorBusqueda === "") {
      setCajerosFiltrados(cajeros);
    }
    const infoFiltrada = cajeros.filter((cajero) =>
      Object.values(cajero).some(
        (valor) =>
          typeof valor === "string" &&
          valor.toLowerCase().includes(valorBusqueda.toLowerCase())
      )
    );
    setCajerosFiltrados(infoFiltrada);
  };
  const buscarCajeros = async () => {
    try {
      setisLoading(true);
      const { token } = session.user;
      const data = await getCajeros(token, baja);
      setCajeros(data);
      setCajerosFiltrados(data);
    } catch (error) {
      showSwal("Error", error, "error");
    } finally {
      setisLoading(false);
    }
  };

  return (
    <div className="flex  w-full h-full bg-white  m-3 rounded-xl shadow-md shadow-slate-700 ">
      <div className="flex w-full h-[calc(100%-30%)]">
        {openModal && (
          <ModalCajero
            accion={accion}
            handleModal={handleModal}
            numero={currentID}
            guardaCajero={guardaCajero}
            session={session}
            cajero={cajero}
            cajeros={cajeros}
            cajerosFiltrados={cajerosFiltrados}
            setCajerosFiltrados={setCajerosFiltrados}
            setCajeros={setCajeros}
            baja={baja}
          />
        )}
        <div className="flex flex-col w-full h-[calc(100%-30%)]">
          <div className="bg-gray-200 m-3 rounded-xl h-[calc(100%-3%)] ">
            <div className="sticky top-0 bg-gray-300 w-full">
              <h2 className="text-gray-500 text-lg font-semibold p-2  ">
                Cajeros
              </h2>
              <div className="my-1"></div>
              <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div>
            </div>

            <div className="bg-gray-200 m-3 rounded-xl ">
              <div className="grid grid-cols-6">
                <div className="relative max-w-md mx-3 my-6  col-start-1 col-end-4 ">
                  <div className="absolute top-1 left-2 inline-flex items-center p-2">
                    <i className="fas fa-search  text-gray-400"></i>
                  </div>
                  <div className="flex justify-between ">
                    <input
                      className="w-full h-10 pl-10 pr-4 py-1 text-base placeholder-gray-500 border rounded-full focus:shadow-outline text-black"
                      type="search"
                      placeholder="Buscar..."
                      onChange={() => handleBusquedaChange(event)}
                    />
                    <Tooltip id="toolBuscar"></Tooltip>
                    <i
                      data-tooltip-id={`toolBuscar`}
                      data-tooltip-content="Buscar"
                      onClick={() => {
                        buscarCajeros();
                      }}
                      className="fas fa-search pt-3 px-3 text-md font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    ></i>
                  </div>
                </div>

                <div className="relative max-w-md mx-3 my-6  col-start-4 col-end-5 ">
                  <label
                    htmlFor="hs-vertical-checkbox-in-form"
                    className="max-w-xs flex p-3 w-full   text-md focus:border-blue-500 focus:ring-blue-500 bg-white rounded-full"
                  >
                    <input
                      type="checkbox"
                      className="shrink-0 mt-0.5 border-gray-200  text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                      id="hs-vertical-checkbox-in-form"
                      onChange={(evt) => {
                        setBaja(evt.target.checked);
                      }}
                    />
                    <span className="text-md text-gray-900 ms-3 dark:text-neutral-900">
                      Bajas
                    </span>
                  </label>
                </div>

                <div className="flex justify-end col-end-7 col-span-2">
                  <button
                    data-tooltip-id={`toolAñadir`}
                    data-tooltip-content="Añadir"
                    onClick={Alta}
                    className="bg-green-600 rounded-xl m-4 p-4 hover:scale-110 hover:bg-green-700 focus:ring-1  focus:ring-green-900 focus:ring-offset-2 focus:ring-offset-green-800 transition-colors shadow-lg shadow-gray-800"
                  >
                    <i className={`fas fa-plus`}></i>
                    <Tooltip id="toolAñadir"></Tooltip>
                    <span className="hidden lg:inline-block ml-2">Añadir</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-y-scroll h-full ">
              <TablaCajeros
                cajerosFiltrados={cajerosFiltrados}
                isLoading={isLoading}
                showInfo={showInfo}
              ></TablaCajeros>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Cajeros;
