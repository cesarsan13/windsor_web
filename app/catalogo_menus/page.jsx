"use client";
import React, {
  useCallback,
  useRef,
  useMemo,
  useState,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import { showSwal, confirmSwal } from "@/app/utils/alerts";
import ModalMenus from "@/app/catalogo_menus/components/modalMenus";
import TablaMenus from "@/app/catalogo_menus/components/tablaMenus";
import Busqueda from "@/app/catalogo_menus/components/Busqueda";
import Acciones from "@/app/catalogo_menus/components/Acciones";
import { useForm } from "react-hook-form";
import {
  getMenus,
  guardarMenus,
  siguiente,
  Imprimir,
  ImprimirExcel,
} from "@/app/utils/api/menus/menus";
import { useSession } from "next-auth/react";
import "jspdf-autotable";
import VistaPrevia from "@/app/components/VistaPrevia";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import { debounce } from "@/app/utils/globalfn";
import ModalMenu from "../accesos_menu/components/modalMenu";

function Menus() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [menus, setMenus] = useState([]);
  const [menu, setMenu] = useState({});
  const [menusFiltrados, setMenusFiltrados] = useState([]);
  const [bajas, setBajas] = useState(false);
  const [openModal, setModal] = useState(false);
  const [accion, setAccion] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [isLoadingButton, setisLoadingButton] = useState(false);
  const [currentID, setCurrentId] = useState("");
  const [pdfPreview, setPdfPreview] = useState(false);
  const [animateLoading, setAnimateLoading] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const menusRef = useRef(menus);
  const [busqueda, setBusqueda] = useState({
    tb_id: "",
    tb_desc: "",
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      numero: menu.numero,
      nombre: menu.nombre,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setisLoading(true);
      const { token } = session.user;
      const data = await getMenus(token, bajas);
      setMenus(data);
      setMenusFiltrados(data);
      setisLoading(false);
    };
    if (status === "loading" || !session) {
      return;
    }
    fetchData();
  }, [session, status, bajas]);

  useEffect(() => {
    reset({
      numero: menu.numero,
      nombre: menu.nombre,
    });
  }, [menu, reset]);

  useEffect(() => {
    menusRef.current = menus;
  }, [menus]);

  const Buscar = useCallback(() => {
    const { tb_id, tb_desc } = busqueda;
    if (tb_id === "" && tb_desc === "") {
      setMenusFiltrados(menusRef.current);
      return;
    }
    const infoFiltrada = menusRef.current.filter((menu) => {
      const coincideNumero = tb_id
        ? menu["numero"].toString().includes(tb_id)
        : true;
      const coincideNombre = tb_desc
        ? menu["nombre"]
            .toString()
            .toLowerCase()
            .includes(tb_desc.toLowerCase())
        : true;
      return coincideNumero && coincideNombre;
    });
    setMenusFiltrados(infoFiltrada);
  }, [busqueda]);

  const debouncedBuscar = useMemo(() => debounce(Buscar, 500), [Buscar]);
  useEffect(() => {
    debouncedBuscar();
    return () => {
      clearTimeout(debouncedBuscar);
    };
  }, [busqueda, debouncedBuscar]);

  const limpiarBusqueda = (evt) => {
    evt.preventDefault();
    setBusqueda({ tb_id: "", tb_desc: "" });
  };

  const Alta = async (event) => {
    setCurrentId("");
    const { token } = session.user;
    reset({
      numero: "",
      nombre: "",
    });
    let siguienteId = await siguiente(token);
    setCurrentId(siguienteId);
    setMenu({ numero: siguienteId });
    setModal(!openModal);
    setAccion("Alta");
    showModal(true);
    document.getElementById("nombre").focus();
  };

  const onSubmitModal = handleSubmit(async (data) => {
    event.preventDefault;
    setisLoadingButton(true);
    data.numero = currentID;
    let res = null;
    if (accion === "Eliminar") {
      showModal(false);
      const confirmed = await confirmSwal(
        "¿Desea Continuar?",
        "Se eliminara el Menu seleccionado",
        "warning",
        "Aceptar",
        "Cancelar"
      );
      if (!confirmed) {
        showModal(true);
        setisLoadingButton(false);
        return;
      }
    }
    res = await guardarMenus(session.user.token, accion, data);
    if (res.status) {
      if (accion === "Alta") {
        console.log("menus alaverga", data);
        const nuevoMenu = { currentID, ...data };
        setMenus([...menus, nuevoMenu]);
        if (!bajas) {
          setMenusFiltrados([...menusFiltrados, nuevoMenu]);
        }
      }
      if (accion === "Eliminar" || accion === "Editar") {
        const index = menus.findIndex((c) => c.numero === data.numero);
        if (index !== -1) {
          if (accion === "Eliminar") {
            const cFiltrados = menus.filter((c) => c.numero !== data.numero);
            setMenus(cFiltrados);
            setMenusFiltrados(cFiltrados);
          } else {
            if (bajas) {
              const cFiltrados = menus.filter((c) => c.numero !== data.numero);
              setMenus(cFiltrados);
              setMenusFiltrados(cFiltrados);
            } else {
              const cActualizadas = menus.map((c) =>
                c.numero === currentID ? { ...c, ...data } : c
              );
              setMenus(cActualizadas);
              setMenusFiltrados(cActualizadas);
            }
          }
        }
      }
      showSwal(res.alert_title, res.alert_text, res.alert_icon);
      showModal(false);
    } else {
      showSwal(res.alert_title, res.alert_text, "error", "my_modal_3");
    }
    setisLoadingButton(false);
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

  const ImprimePDF = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Menus",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: menusFiltrados,
    };
    Imprimir(configuracion);
  };

  const ImprimeExcel = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Menus",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: menusFiltrados,
      columns: [
        { header: "Numero", dataKey: "numero" },
        { header: "Nombre", dataKey: "nombre" },
      ],
      nombre: "Menus",
    };
    ImprimirExcel(configuracion);
  };

  const handleVerClick = () => {
    setAnimateLoading(true);
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Menus",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
    };
    const Enca1 = (doc) => {
      if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalV();
        doc.nextRow(12);
        doc.ImpPosX("No.", 14, doc.tw_ren, 0, "L");
        doc.ImpPosX("Nombre", 28, doc.tw_ren, 0, "L");
        doc.nextRow(4);
        doc.printLineV();
        doc.nextRow(4);
        doc.tiene_encabezado = true;
      } else {
        doc.nextRow(6);
        doc.tiene_encabezado = true;
      }
    };
    const reporte = new ReportePDF(configuracion);
    Enca1(reporte);
    menusFiltrados.forEach((menu) => {
      reporte.ImpPosX(menu.numero.toString(), 24, reporte.tw_ren, 0, "R");
      reporte.ImpPosX(menu.nombre.toString(), 28, reporte.tw_ren, 0, "L");
      Enca1(reporte);
      if (reporte.tw_ren >= reporte.tw_endRen) {
        reporte.pageBreak();
        Enca1(reporte);
      }
    });
    setTimeout(() => {
      const pdfData = reporte.doc.output("datauristring");
      setPdfData(pdfData);
      setPdfPreview(true);
      showModalVista(true);
      setAnimateLoading(false);
    }, 500);
  };

  const showModalVista = (show) => {
    show
      ? document.getElementById("modalMenus").showModal()
      : document.getElementById("modalMenus").close();
  };

  const CerrarView = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalMenus").close();
  };

  const tableAction = (evt, menu, accion) => {
    setMenu(menu);
    setAccion(accion);
    setCurrentId(menu.numero);
    showModal(true);
  };

  if (status === "loading") {
    return (
      <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  return (
    <>
      <ModalMenus
        accion={accion}
        onSubmit={onSubmitModal}
        currentID={currentID}
        errors={errors}
        register={register}
        setMenu={setMenu}
        menu={menu}
        isLoadingButton={isLoadingButton}
      />
      <VistaPrevia
        id={"modalMenus"}
        titulo={"Vista Previa de Menus"}
        pdfPreview={pdfPreview}
        pdfData={pdfData}
        PDF={ImprimePDF}
        Excel={ImprimeExcel}
        CerrarView={CerrarView}
      />
      <div className="container h-[80vh] w-full max-w-screen-xl bg-base-200 dark:bg-slate-700 shadow-xl rounded-xl px-3 md:overflow-y-auto lg:overflow-y-hidden">
        <div className="flex flex-col justify-start p-3">
          <div className="flex flex-wrap md:flex-nowrap items-start md:items-center">
            <div className="order-2 md:order-1 flex justify-around w-full md:w-auto md:justify-start mb-0 md:mb-0">
              <Acciones
                Buscar={Buscar}
                Alta={Alta}
                home={home}
                Ver={handleVerClick}
                animateLoading={animateLoading}
              />
            </div>
            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
              Menus.
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
            {status === "loading" ||
              (!session ? (
                <></>
              ) : (
                <TablaMenus
                  session={session}
                  menusFiltrados={menusFiltrados}
                  isLoading={isLoading}
                  tableAction={tableAction}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Menus;
