"use client";
import React, { use } from "react";
import { useForm } from "react-hook-form";
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
  const [filtro, setFiltro] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: formaPago.id,
      descripcion: formaPago.descripcion,
      comision: formaPago.comision,
      aplicacion: formaPago.aplicacion,
      cue_banco: formaPago.cue_banco,
    },
  });
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
    const valorBusqueda = document.getElementById("TB_Busqueda").value;
    if (valorBusqueda === "") {
      setFormaPagosFiltrados(formasPago);
      return;
    }
    const infoFiltrada = formasPago.filter((formapago) =>
      formapago[filtro].toLowerCase().includes(valorBusqueda.toLowerCase())
    );
    setFormaPagosFiltrados(infoFiltrada);
  };
  const handleFiltroChange = (evt) => {
    evt.preventDefault();
    setFiltro(evt.target.value);
  };
  const limpiarBusqueda = () => {
    setFiltro("");
    document.getElementById("TB_Busqueda").value = "";
  };

  const Alta = async (event) => {
    setCurrentId("");
    setFormaPago({});
    setModal(!openModal);
    setAccion("Alta");
    reset();
    document.getElementById("my_modal_3").showModal();
    const { token } = session.user;
    let siguienteId = await siguiente(token);
    siguienteId = Number(siguienteId) + 1;
    setCurrentId(siguienteId);
  };
  const handleModal = () => {
    setModal(!openModal);
  };
  const onSubmitModal = handleSubmit(async (data) => {
    event.preventDefault;
    const dataj = JSON.stringify(data);
    alert(dataj);
  });
  if (!session) {
    return <></>;
  }
  return (
    <div className="container h-full ">
      {/* {openModal && ( */}
      <ModalFormaPago
        accion={accion}
        handleModal={handleModal}
        numero={currentID}
        // guardaCajero={guardaCajero}
        session={session}
        formaPago={formaPago}
        formasPago={formasPago}
        formaPagosFiltrados={formaPagosFiltrados}
        setFormaPagosFiltrados={setFormaPagosFiltrados}
        setFormasPago={setFormasPago}
        bajas={bajas}
        onSubmit={onSubmitModal}
        errors={errors}
        register={register}
      />
      {/* )} */}
      <div className="flex justify-center p-3 ">
        <h1 className="text-4xl font-thin text-black">Formas de Pagos</h1>
      </div>
      <div className="container grid grid-cols-8 grid-rows-1 h-[calc(100%-20%)] z-0">
        <div className="col-span-1  ">
          <Acciones Buscar={Buscar} Alta={Alta}></Acciones>
        </div>
        <div className="col-span-7  ">
          <div className="flex flex-col h-[calc(100%)]">
            <Busqueda
              setBajas={setBajas}
              setFiltro={setFiltro}
              handleFiltroChange={handleFiltroChange}
              limpiarBusqueda={limpiarBusqueda}
            />
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
