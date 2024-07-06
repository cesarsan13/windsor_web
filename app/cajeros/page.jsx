"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  getCajeros,
  guardaCajero,
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

  const Alta = async () => {
    setCurrentId("");
    setCajero({});
    setModal(!openModal);
    setAccion("Alta");
    const { token } = session.user;
    let siguienteId = await siguiente(token);
    siguienteId = Number(siguienteId) + 1;
    setCurrentId(siguienteId);
  };

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
    const valorBusqueda = event.target.value;
    if (valorBusqueda === "") {
      setCajerosFiltrados(cajeros);
    } else {
      const infoFiltrada = cajeros.filter((cajero) =>
        Object.values(cajero).some(
          (valor) =>
            typeof valor === "string" &&
            valor.toLowerCase().includes(valorBusqueda.toLowerCase())
        )
      );
      setCajerosFiltrados(infoFiltrada);
    }
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
    <div className="flex justify-center items-start h-screen max-w-5xl w-5/6">
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
      <div className="bg-white shadow rounded-lg p-9 w-full max-w-full mt-10">
        <h2 className="text-gray-800 text-2xl font-semibold mb-4">Cajeros</h2>
        <div className="flex items-center space-x-2 mb-4">
          <input
            className="border border-gray-300 rounded-lg px-4 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="search"
            placeholder="Nombre"
            onChange={handleBusquedaChange}
          />
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              onChange={(evt) => setBaja(evt.target.checked)}
            />
            <span className="ml-2 text-gray-700">Bajas</span>
          </label>
          <button
            onClick={Alta}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 ml-auto"
          >
            Añadir
          </button>
        </div>
        <TablaCajeros
          cajerosFiltrados={cajerosFiltrados}
          isLoading={isLoading}
          showInfo={showInfo}
          className="text-sm"
        />
      </div>
    </div>
  );
}

export default Cajeros;
