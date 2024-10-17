'use client';
import React from 'react';
import Acciones from "@/app/clases/components/Acciones";
import TablaClases from "@/app/clases/components/tablaClases";
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { 
  getClases, 
  guardaClase
} from "@/app/utils/api/clases/clases";
import ModalVistaPreviaClases from './components/modalVistaPreviaClases';
import Busqueda from "@/app/clases/components/Busqueda";
import ModalClases from "@/app/clases/components/modalClases";

function Clases() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [clases, setClases] = useState([]);
  const [clase, setClase] = useState({});
  const [clasesFiltrados, setClasesFiltrados] = useState([]);
  const [bajas, setBajas] = useState(false);
  const [openModal, setModal] = useState(false);
  const [accion, setAccion] = useState("")
  const [grado, setGrado] = useState({});

  const [isLoading, setisLoading] = useState(false);
  const [currentID, setCurrentId] = useState({
    grupo: "",
    materia: "",
  });
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const [busqueda, setBusqueda] = useState({
    tb_grupo: "",
    tb_materia: "",
    tb_profesor: "",
  });
  useEffect(() => {
    if (status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {
      setisLoading(true);
      const { token } = session.user;
      const data = await getClases(token, bajas);
      setClases(data);
      setClasesFiltrados(data);
      setisLoading(false);
    };
    fetchData();
  }, [session, status, bajas]);

  useEffect(() => {
    Buscar();
  }, [busqueda]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      grupo: clase.grupo,
      materia: clase.materia,
      profesor: clase.profesor,
      lunes: clase.lunes,
      martes: clase.martes,
      miercoles: clase.miercoles,
      jueves: clase.jueves,
      viernes: clase.viernes,
      sabado: clase.sabado,
      domingo: clase.domingo,
    },
  });
  useEffect(() => {
    reset({
      grupo: clase.grupo,
      materia: clase.materia,
      profesor: clase.profesor,
      lunes: clase.lunes,
      martes: clase.martes,
      miercoles: clase.miercoles,
      jueves: clase.jueves,
      viernes: clase.viernes,
      sabado: clase.sabado,
      domingo: clase.domingo,
    });
  }, [clase, reset]);

  const Buscar = () => {
    const { tb_grupo, tb_materia, tb_profesor} = busqueda;
    if (tb_grupo === "" && tb_materia === "" && tb_profesor === "") {
      setClasesFiltrados(clases);
      return;
    }
    const infoFiltrada = clases.filter((clase) => {
      const coincideGrupo = tb_grupo
      ? clase["grupo"].toString().includes(tb_grupo)
      : true;
      const coincideMateria = tb_materia
      ? clase["materia"].toString().includes(tb_materia)
      : true;
      const coincideProfesor = tb_profesor
      ? clase["profesor"].toString().toLowerCase().includes(tb_profesor.toLowerCase())
      : true;
      return (
        coincideGrupo && coincideMateria && coincideProfesor
      );
    });
    setClasesFiltrados(infoFiltrada);
  };

  const limpiarBusqueda = (evt) => {
    evt.preventDefault;
    setBusqueda({ tb_grupo: "", tb_materia: "", tb_profesor: ""});
  };

  const Alta = async (event) => {
    setCurrentId("");
    const { token } = session.user;
    reset({
      grupo: "",
      materia: "",
      profesor: "",
      lunes: "",
      martes: "",
      miercoles: "",
      jueves: "",
      viernes: "",
      sabado: "",
      domingo: "",
    });
    setModal(!openModal);
    setAccion("Alta");
    showModal(true);
    setGrado({});

    document.getElementById("lunes").focus();
  };
  
  const onSubmitModal = handleSubmit(async (data) => {
    event.preventDefault;
    // const dataj = JSON.stringify(data);
    data.id = currentID;
    let res = null;
    if (accion === "Eliminar") {
      showModal(false);
      const confirmed = await confirmSwal(
        "¿Desea Continuar?",
        "Se eliminara la clase seleccionada",
        "warning",
        "Aceptar",
        "Cancelar"
      );
      if (!confirmed) {
        showModal(true);
        return;
      }
       showModal(true);
    }
    res = await guardaClase(session.user.token, data, accion);
    if (res.status) {
      if (accion === "Alta") {
        const nuevaClase = { currentID, ...data };
        setClases([...clases, nuevaClase]);
        if (!bajas) {
          setClasesFiltrados([...clasesFiltrados, nuevaClase]);
        }
      }
      if (accion === "Eliminar" || accion === "Editar") {
        const index = clases.findIndex((c) => c.grupo === data.grupo && c.materia === data.materia);
        if (index !== -1) {
          if (accion === "Eliminar") {
            const cFiltrados = clases.filter((c) => c.grupo !== data.grupo && c.materia !== data.materia);
            setClases(cFiltrados);
            setClasesFiltrados(cFiltrados);
          } else {
            if (bajas) {
              const cFiltrados = clases.filter(
                (c) => c.numero !== data.numero
              );
              setClases(cFiltrados);
              setClasesFiltrados(cFiltrados);
            } else {
              const cActualizadas = clases.map((c) =>
                c.numero === currentID ? { ...c, ...data } : c
              );
              setClases(cActualizadas);
              setClasesFiltrados(cActualizadas);
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
    setBusqueda((estadoPrevio) => ({
      ...estadoPrevio,
      [event.target.id]: event.target.value,
    }));
  };
  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVPClase").showModal()
      : document.getElementById("modalVPClase").close();
  };
  return (
    <>
      <ModalClases
        session={session}
        accion={accion}
        onSubmit={onSubmitModal}
        currentID={currentID}
        errors={errors}
        register={register}
        setClase={setClase}
        clase={clase}
        setGrado={setGrado}
      />
     {/* <ModalVistaPreviaClases
        pdfPreview={pdfPreview}
        pdfData={pdfData}
        PDF={ImprimePDF}
        Excel={ImprimeExcel}
      /> */}
    <div className="container h-[80vh] w-full max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden">
    <div className="flex flex-col justify-start p-3">
      <div className="flex flex-wrap md:flex-nowrap items-start md:items-center">
        <div className="order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0">
          <Acciones
            Buscar={Buscar}
            Alta={Alta}
            home={home}
            // Ver={handleVerClick}
          />
        </div>

        <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
          Clases
        </h1>
      </div>
    </div>
    <div className="flex flex-col items-center h-full">
          <div className="w-full max-w-4xl">
            <Busqueda
              setBajas={setBajas}
              limpiarBusqueda={limpiarBusqueda}
              Buscar={Buscar}
              handleBusquedaChange={handleBusquedaChange}
              busqueda={busqueda}
            />
            <TablaClases
               isLoading={isLoading}
               clasesFiltrados={clasesFiltrados}
               showModal={showModal}
               setClase={setClase}
               setAccion={setAccion}
               setCurrentId={setCurrentId}
            />
          </div>
          </div>
    </div>
    </>
  )
}

export default Clases
