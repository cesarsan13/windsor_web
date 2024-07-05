"use client";
import React from "react";
import Link from "next/link";
import ModalFormaPago from "@/app/formapago/components/ModalFormaPago";
import TablaFormaPago from "@/app/formapago/components/TablaFormaPAgo";
import Busqueda from "@/app/formapago/components/Busqueda";
import Acciones from "@/app/formapago/components/Acciones";
import { getFormasPago } from "@/app/utils/api/formapago/formapago";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
function FormaPago() {
  const { data: session, status } = useSession();
  const [formasPago, setFormasPago] = useState([]);
  const [formaPago, setFormaPago] = useState({});
  const [formaPagosFiltrados, setFormaPagosFiltrados] = useState([]);
  const [bajas, setBajas] = useState(false);
  const [openModal, setModal] = useState(false);
  const [accion, setAccion] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [currentID, setCurrentId] = useState("");
  const [TB_Busqueda, setTB_Busqueda] = useState("");
  useEffect(() => {
    if (status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {
      setisLoading(true);
      const { token } = session.user;
      const data = await getFormasPago(token, bajas);
      setFormasPago(data);
      setFormaPagosFiltrados(data);
      setisLoading(false);
    };
    fetchData();
  }, [session, status, bajas]);

  const Buscar = (event) => {
    event.preventDefault();
    alert("esyas buscando");
    // const valorBusqueda = event.target.value;
    // if (valorBusqueda === "") {
    //   setFormaPagosFiltrados(formasPago);
    // }
    // const infoFiltrada = formasPago.filter((proveedor) =>
    //   Object.values(proveedor).some(
    //     (valor) =>
    //       typeof valor === "string" &&
    //       valor.toLowerCase().includes(valorBusqueda.toLowerCase())
    //   )
    // );
    // setFormaPagosFiltrados(infoFiltrada);
  };

  if (!session) {
    return <></>;
  }
  return (
    <div className="container h-full">
      <ModalFormaPago></ModalFormaPago>
      <div className="flex justify-center p-3 ">
        <h1 className="text-4xl font-thin text-black">Formas de Pagos</h1>
      </div>
      <div className="container grid grid-cols-8 grid-rows-1 h-[calc(100%-20%)] z-0">
        <div className="col-span-1  ">
          <Acciones Buscar={Buscar}></Acciones>
        </div>
        <div className="col-span-7  ">
          <div className="flex flex-col h-[calc(100%)]">
            <Busqueda setBajas={setBajas} />
            <TablaFormaPago
              isLoading={isLoading}
              formaPagosFiltrados={formaPagosFiltrados}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormaPago;
