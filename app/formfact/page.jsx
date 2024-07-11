"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { showSwal, confirmSwal } from "../utils/alerts";
import ModalFormFact from "@/app/formfact/components/ModalFormFact";
import TablaFormFact from "@/app/formfact/components/tablaFormFact";
import Busqueda from "@/app/formfact/components/Busqueda";
import Acciones from "@/app/formfact/components/Acciones";
import { useForm } from "react-hook-form";
import {
    getFormFact,
    guardaFormFact,
} from "@/app/utils/api/formfact/formfact";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { siguiente } from "@/app/utils/api/formfact/formfact";
import { eventNames } from "process";
import { NEXT_CACHE_REVALIDATE_TAG_TOKEN_HEADER } from "next/dist/lib/constants";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

function FormFact() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [formFacts, setFormFacts] = useState([]);  //formasPago
    const [formFact, setFormFact] = useState({});    //formaPago
    const [formFactsFiltrados, setFormFactsFiltrados] = useState([]);
    const [bajas, setBajas] = useState(false);
    const [openModal, setModal] = useState(false);
    const [accion, setAccion] = useState("");
    const [isLoading, setisLoading] = useState(false);
    const [currentID, setCurrentId] = useState("");
    const [filtro, setFiltro] = useState("");
    const [TB_Busqueda, setTB_Busqueda] = useState("");

    useEffect(() => {
        if (status === "loading" || !session) {
          return;
        }
        const fetchData = async () => {
          setisLoading(true);
          const { token } = session.user;
          const data = await getFormFact(token, bajas);
          setFormFacts(data);
          setFormFactsFiltrados(data);
          if (filtro !== "" && TB_Busqueda !== "") {
            Buscar();
          }
          setisLoading(false);
        };
        fetchData();
      }, [session, status, bajas]);

      const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
      } = useForm({
        defaultValues: {
          numero: formFact.numero,
          nombre: formFact.nombre,
          longitud: formFact.longitud,
        },
      });
      useEffect(() => {
        reset({
          numero: formFact.numero,
          nombre: formFact.nombre,
          longitud: formFact.longitud,
        });
      }, [formFact, reset]);
      const Buscar = () => {
        // alert(filtro);
        console.log(TB_Busqueda, filtro);
        if (TB_Busqueda === "" || filtro === "") {
          setFormFactsFiltrados(formFacts);
          return;
        }
        const infoFiltrada = formFacts.filter((formFact) => {
          const valorCampo = formFact[filtro];
          if (typeof valorCampo === "number") {
            return valorCampo.toString().includes(TB_Busqueda);
          }
          return valorCampo
            ?.toString()
            .toLowerCase()
            .includes(TB_Busqueda.toLowerCase());
        });
        setFormFactsFiltrados(infoFiltrada);
      };
    
      const limpiarBusqueda = (evt) => {
        evt.preventDefault;
        setTB_Busqueda("");
      };

      const Alta = async (event) => {
        setCurrentId("");
        const { token } = session.user;
        reset({
          numero: "",
          nombre: "",
          longitud: "",
        });
        let siguienteId = await siguiente(token);
        siguienteId = Number(siguienteId) + 1;
        setCurrentId(siguienteId);
        setFormFact({ numero: siguienteId });
        setModal(!openModal);
        setAccion("Alta");
        showModal(true);
    
        document.getElementById("nombre").focus();
      };
      //Imprimir
      //Excel
      const onSubmitModal = handleSubmit(async (data) => {
        event.preventDefault;
        const dataj = JSON.stringify(data);
        data.id = currentID;
        let res = null;
        if (accion === "Eliminar") {
          showModal(false);
          const confirmed = await confirmSwal(
            "¿Desea Continuar?",
            "Se eliminara el forma factura seleccionado",
            "warning",
            "Aceptar",
            "Cancelar"
          );
          if (!confirmed) {
            showModal(true);
            return;
          }
          // showModal(true);
        }
        res = await guardaFormFact(session.user.token, data, accion);
    // console.log(res.status + " " + res);
    if (res.status) {
      if (accion === "Alta") {
        const nuevaFormFact = { currentID, ...data };
        setFormFacts([...formFacts, nuevaFormFact]);
        if (!bajas) {
          setFormFactsFiltrados([...formFactsFiltrados, nuevaFormFact]);
        }
      }
      if (accion === "Eliminar" || accion === "Editar") {
        const index = formFacts.findIndex((c) => c.numero === data.numero);
        if (index !== -1) {
          if (accion === "Eliminar") {
            const formFiltrados = formFacts.filter((c) => c.numero !== data.numero);
            setFormFacts(formFiltrados);
            setFormFactsFiltrados(formFiltrados);
          } else {
            if (bajas) {
              const formFiltrados = formFacts.filter((c) => c.numero !== data.numero);
              setFormFacts(formFiltrados);
              setFormFactsFiltrados(formFiltrados);
            } else {
              const formActualizadas = formFacts.map((c) =>
                c.numero === currentID ? { ...c, ...data } : c
              );
              setFormFacts(formActualizadas);
              setFormFactsFiltrados(formActualizadas);
            }
          }
        }
      }
      showSwal(res.alert_title, res.alert_text, res.alert_icon);
      showModal(false);
    }
  });
  const showModal = (show) => {
    show
      ? document.getElementById("my_modal_3").showModal()
      : document.getElementById("my_modal_3").close();
  };
  const home = () => {
    router.push("/");
  };
  const handleBusquedaChange = (event) => {
    event.preventDefault;
    setTB_Busqueda(event.target.value);
  };
  if (status === "loading") {
    return (
      <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  return (
    <>
      <ModalFormFact
        accion={accion}
        onSubmit={onSubmitModal}
        currentID={currentID}
        errors={errors}
        register={register}
        setFormFact={setFormFact}
        formFact={formFact}
      />
      <div className="container  w-full  max-w-screen-xl bg-slate-100 shadow-xl rounded-xl px-3 ">
        <div className="flex justify-start p-3 ">
          <h1 className="text-4xl font-xthin text-black md:px-12">
            Formas Facturas.
          </h1>
        </div>
        <div className="container grid grid-cols-8 grid-rows-1 h-[calc(100%-20%)] ">
          <div className="col-span-1 flex flex-col ">
            <Acciones Buscar={Buscar} Alta={Alta} home={home} /*imprimir={imprimir} excel={excel}*/></Acciones>
          </div>
          <div className="col-span-7  ">
            <div className="flex flex-col h-[calc(100%)]">
              <Busqueda
                setBajas={setBajas}
                setFiltro={setFiltro}
                limpiarBusqueda={limpiarBusqueda}
                Buscar={Buscar}
                handleBusquedaChange={handleBusquedaChange}
                TB_Busqueda={TB_Busqueda}
              />
              <TablaFormFact
                isLoading={isLoading}
                formFactsFiltrados={formFactsFiltrados}
                showModal={showModal}
                setFormFact={setFormFact}
                setAccion={setAccion}
                setCurrentId={setCurrentId}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FormFact;
