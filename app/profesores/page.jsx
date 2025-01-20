"use client";
import React, { useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { showSwal, confirmSwal, showSwalAndWait } from "@/app/utils/alerts";
import ModalProfesores from "@/app/profesores/components/ModalProfesores";
import VistaPrevia from "@/app/components/VistaPrevia";
import TablaProfesores from "@/app/profesores/components/TablaProfesores";
import Busqueda from "@/app/profesores/components/Busqueda";
import Acciones from "@/app/profesores/components/Acciones";
import { useForm } from "react-hook-form";
import {
  getProfesores,
  guardaProfesor,
  ImprimirPDF,
  siguiente,
  ImprimirExcel,
  storeBatchProfesores
} from "@/app/utils/api/profesores/profesores";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { debounce,permissionsComponents, chunkArray } from "../utils/globalfn";
import ModalProcesarDatos from "../components/modalProcesarDatos";
function Profesores() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [profesores, setProfesores] = useState([]);
  const [profesor, setProfesor] = useState({});
  const [profesoresFiltrados, setProfesoresFiltrados] = useState(null);
  const [bajas, setBajas] = useState(false);
  const [openModal, setModal] = useState(false);
  const [accion, setAccion] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [isLoadingButton, setisLoadingButton] = useState(false);
  const [currentID, setCurrentId] = useState("");
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const profesoresRef = useRef(profesores);
  const [busqueda, setBusqueda] = useState({
    tb_numero: "",
    tb_nombre: "",
  });
  const [animateLoading, setAnimateLoading] = useState(false);
  const [permissions, setPermissions] = useState({});
  const [dataJson, setDataJson] = useState([]); 
  const [reload_page, setReloadPage] = useState(false)

  useEffect(() => {
    profesoresRef.current = profesores; // Actualiza el ref cuando profesores cambia
  }, [profesores]);

  const Buscar = useCallback(() => {
    const { tb_numero, tb_nombre } = busqueda;
    if (tb_numero === "" && tb_nombre === "") {
      setProfesoresFiltrados(profesoresRef.current);
      return;
    }
    const infoFiltrada = profesoresRef.current.filter((profesor) => {
      const coincideID = tb_numero
        ? profesor["numero"].toString().includes(tb_numero)
        : true;
      const coincideNombre = tb_nombre
        ? profesor["nombre"]
          .toString()
          .toLowerCase()
          .includes(tb_nombre.toLowerCase())
        : true;
      return coincideID && coincideNombre;
    });
    setProfesoresFiltrados(infoFiltrada);
  }, [busqueda]);

  const debouncedBuscar = useMemo(() => debounce(Buscar, 500), [Buscar]);

  useEffect(() => {
    debouncedBuscar();
    return () => {
      clearTimeout(debouncedBuscar);
    };
  }, [busqueda, debouncedBuscar]);


  useEffect(() => {
    
    const fetchData = async () => {
      setisLoading(true);
      const { token, permissions } = session.user;
      const es_admin = session.user.es_admin;
      const menuSeleccionado = Number(localStorage.getItem("puntoMenu"));

      const data = await getProfesores(token, bajas);
      setProfesores(data);
      setProfesoresFiltrados(data);
      setisLoading(false);
      const permisos = permissionsComponents(
        es_admin,
        permissions,
        session.user.id,
        menuSeleccionado
      );
      setPermissions(permisos);
    };
    if (status === "loading" || !session) {
      return;
    }
    fetchData();
  }, [session, status, bajas]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      numero: profesor.numero,
      nombre: profesor.nombre,
      nombre_completo: profesor.nombre_completo,
      ap_paterno: profesor.ap_paterno,
      ap_materno: profesor.ap_materno,
      direccion: profesor.direccion,
      colonia: profesor.colonia,
      ciudad: profesor.ciudad,
      estado: profesor.estado,
      cp: profesor.cp,
      pais: profesor.pais,
      rfc: profesor.rfc,
      telefono_1: profesor.telefono_1,
      telefono_2: profesor.telefono_2,
      fax: profesor.fax,
      celular: profesor.celular,
      email: profesor.email,
      contraseña: "",
    },
  });

  useEffect(() => {
    reset({
      numero: profesor.numero,
      nombre: profesor.nombre,
      nombre_completo: profesor.nombre_completo,
      ap_paterno: profesor.ap_paterno,
      ap_materno: profesor.ap_materno,
      direccion: profesor.direccion,
      colonia: profesor.colonia,
      ciudad: profesor.ciudad,
      estado: profesor.estado,
      cp: profesor.cp,
      pais: profesor.pais,
      rfc: profesor.rfc,
      telefono_1: profesor.telefono_1,
      telefono_2: profesor.telefono_2,
      fax: profesor.fax,
      celular: profesor.celular,
      email: profesor.email,
      contraseña: "",
    });
  }, [profesor, reset]);

  

  const limpiarBusqueda = (evt) => {
    evt.preventDefault();
    setBusqueda({ tb_numero: "", tb_nombre: "" });
  };

  const handleVerClick = () => {
    setAnimateLoading(true);
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Profesores",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: profesoresFiltrados,
    };

    const orientacion = "Landscape";
    const reporte = new ReportePDF(configuracion, orientacion);
    const { body } = configuracion;
    const Enca1 = (doc) => {
      if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalH();
        doc.nextRow(12);
        doc.ImpPosX("Numero", 15, doc.tw_ren);
        doc.ImpPosX("Nombre", 40, doc.tw_ren);
        doc.ImpPosX("Dirección", 110, doc.tw_ren);
        doc.ImpPosX("Colonia", 155, doc.tw_ren);
        doc.ImpPosX("Ciudad", 200, doc.tw_ren);
        doc.ImpPosX("Estado", 245, doc.tw_ren);
        doc.ImpPosX("C.P.", 270, doc.tw_ren);
        doc.nextRow(4);
        doc.ImpPosX("Email", 15, doc.tw_ren);
        doc.ImpPosX("Telefono1", 155, doc.tw_ren);
        doc.ImpPosX("Telefono2", 200, doc.tw_ren);
        doc.ImpPosX("Celular", 245, doc.tw_ren);
        doc.nextRow(4);
        doc.printLineH();
        doc.nextRow(4);
        doc.tiene_encabezado = true;
      } else {
        doc.nextRow(6);
        doc.tiene_encabezado = true;
      }
    };

    Enca1(reporte);
    body.forEach((profesores) => {
      reporte.setFontSize(8)
      reporte.ImpPosX(profesores.numero.toString(), 20, reporte.tw_ren, 0, "R");
      reporte.ImpPosX(
        profesores.nombre_completo.toString(),
        40,
        reporte.tw_ren,
        0,
        "L"
      );
      reporte.ImpPosX(
        profesores.direccion.toString(),
        110,
        reporte.tw_ren,
        0,
        "L"
      );
      reporte.ImpPosX(
        profesores.colonia.toString(),
        155,
        reporte.tw_ren,
        0,
        "L"
      );
      reporte.ImpPosX(
        profesores.ciudad.toString(),
        200,
        reporte.tw_ren,
        0,
        "L"
      );
      reporte.ImpPosX(
        profesores.estado.toString(),
        245,
        reporte.tw_ren,
        0,
        "L"
      );
      reporte.ImpPosX(profesores.cp.toString(), 270, reporte.tw_ren, 0, "L");
      reporte.nextRow(4);
      reporte.ImpPosX(profesores.email.toString(), 15, reporte.tw_ren, 0, "L");
      reporte.ImpPosX(
        profesores.telefono_1.toString(),
        155,
        reporte.tw_ren,
        12,
        "L"
      );
      reporte.ImpPosX(
        profesores.telefono_2.toString(),
        200,
        reporte.tw_ren,
        12,
        "L"
      );
      reporte.ImpPosX(
        profesores.celular.toString(),
        245,
        reporte.tw_ren,
        12,
        "L"
      );
      Enca1(reporte);
      if (reporte.tw_ren >= reporte.tw_endRenH) {
        reporte.pageBreakH();
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
      ? document.getElementById("modalVPProfesor").showModal()
      : document.getElementById("modalVPProfesor").close();
  };

  const CerrarView = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVPProfesor").close();
  };

  const Alta = async (event) => {
    setCurrentId("");
    const { token } = session.user;
    reset({
      numero: "",
      nombre: "",
      nombre_completo: "",
      ap_paterno: "",
      ap_materno: "",
      direccion: "",
      colonia: "",
      ciudad: "",
      estado: "",
      cp: "",
      pais: "",
      rfc: "",
      telefono_1: "",
      telefono_2: "",
      fax: "",
      celular: "",
      email: "",
      contraseña: "",
    });
    let siguienteId = await siguiente(token);
    siguienteId = Number(siguienteId) + 1;
    setCurrentId(siguienteId);
    setProfesor({ numero: siguienteId });
    setModal(!openModal);
    setAccion("Alta");
    showModal(true);

    document.getElementById("nombre").focus();
  };

  const ImprimePDF = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Profesores",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: profesoresFiltrados,
    };
    ImprimirPDF(configuracion);
  };

  const ImprimeExcel = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Profesores",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: profesoresFiltrados,
      columns: [
        { header: "Numero", dataKey: "numero" },
        { header: "Nombre", dataKey: "nombre_completo" },
        { header: "Dirección", dataKey: "direccion" },
        { header: "Colonia", dataKey: "colonia" },
        { header: "Telefono1", dataKey: "telefono_1" },
        { header: "Telefono2", dataKey: "telefono_2" },
        { header: "Ciudad", dataKey: "ciudad" },
        { header: "Estado", dataKey: "estado" },
        { header: "Celular", dataKey: "celular" },
        { header: "C.P.", dataKey: "cp" },
      ],
      nombre: "Profesores_",
    };
    ImprimirExcel(configuracion);
  };

  const onSubmitModal = handleSubmit(async (data) => {
    event.preventDefault();
    setisLoadingButton(true);
    data.numero = currentID;
    let res = null;
    if (accion === "Eliminar") {
      showModal(false);
      const confirmed = await confirmSwal(
        "¿Desea Continuar?",
        "Se eliminara el profesor seleccionado",
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
    data.nombre_completo = `${data.nombre} ${data.ap_paterno} ${data.ap_materno}`
    res = await guardaProfesor(session.user.token, data, accion);
    if (res.status) {
      if (accion === "Alta") {
        const nuevaProfesor = { currentID, ...data };
        setProfesores([...profesores, nuevaProfesor]);
        if (!bajas) {
          setProfesoresFiltrados([...profesoresFiltrados, nuevaProfesor]);
        }
      }
      if (accion === "Eliminar" || accion === "Editar") {
        const index = profesores.findIndex((fp) => fp.numero === data.numero);
        if (index !== -1) {
          if (accion === "Eliminar") {
            const fpFiltrados = profesores.filter(
              (fp) => fp.numero !== data.numero
            );
            setProfesores(fpFiltrados);
            setProfesoresFiltrados(fpFiltrados);
          } else {
            if (bajas) {
              const fpFiltrados = profesores.filter(
                (fp) => fp.numero !== data.numero
              );
              setProfesores(fpFiltrados);
              setProfesoresFiltrados(fpFiltrados);
            } else {
              const fpActualizadas = profesores.map((fp) =>
                fp.numero === currentID ? { ...fp, ...data } : fp
              );
              setProfesores(fpActualizadas);
              setProfesoresFiltrados(fpActualizadas);
            }
          }
        }
      }
      showModal(false);
      showSwal(res.alert_title, res.alert_text, res.alert_icon);
    } else {
      showModal(false);
      await showSwalAndWait(res.alert_title, res.alert_text, res.alert_icon);
      showModal(true);
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
    setBusqueda((estadoPrevio) => ({
      ...estadoPrevio,
      [event.target.id]: event.target.value,
    }));
  };

      const procesarDatos = () => {
        //showModalProcesa(true);
        document.getElementById("my_modal_profesores").showModal()
      }
    
      const buttonProcess = async () => {
          event.preventDefault();
          setisLoadingButton(true);
          const { token } = session.user;
          const chunks = chunkArray(dataJson, 20);
          for (let chunk of chunks) {
            await storeBatchProfesores(token, chunk)
          }
          setDataJson([]);
          document.getElementById("my_modal_profesores").close();
          showSwal("Éxito", "Los datos se han subido correctamente.", "success");
          setReloadPage(!reload_page);
          setisLoadingButton(false);
        };  
    
      const handleFileChange = async (e) => {
          const confirmed = await confirmSwal(
            "¿Desea Continuar?",
            "Asegúrate de que las columnas del archivo de excel coincidan exactamente con las columnas de la tabla en la base de datos.",
            "warning",
            "Aceptar",
            "Cancelar",
            "my_modal_profesores"
          );
          if (!confirmed) {
            return;
          }
          const selectedFile = e.target.files[0];
          if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const data = new Uint8Array(event.target.result);
              const workbook = XLSX.read(data, { type: "array" });
              const sheetName = workbook.SheetNames[0];
              const worksheet = workbook.Sheets[sheetName];
              const jsonData = XLSX.utils.sheet_to_json(worksheet);
              const convertedData = jsonData.map(item => ({
                numero: parseInt(item.Numero|| 0),
                nombre: (item.Nombre && String(item.Nombre).trim() !== "") ? String(item.Nombre).slice(0, 100) : "N/A",
                ap_paterno: (item.Ap_Paterno && String(item.Ap_Paterno).trim() !== "") ? String(item.Ap_Paterno).slice(0, 100) : "N/A",
                ap_materno: (item.Ap_Materno && String(item.Ap_Materno).trim() !== "") ? String(item.Ap_Materno).slice(0, 100) : "N/A",
                direccion: (item.Direccion && String(item.Direccion).trim() !== "") ? String(item.Direccion).slice(0, 100) : "N/A",
                colonia: (item.Colonia && String(item.Colonia).trim() !== "") ? String(item.Colonia).slice(0, 100) : "N/A",
                ciudad: (item.Ciudad && String(item.Ciudad).trim() !== "") ? String(item.Ciudad).slice(0, 100) : "N/A",
                estado: (item.Estado && String(item.Estado).trim() !== "") ? String(item.Estado).slice(0, 100) : "N/A",
                cp: (item.CP && String(item.CP).trim() !== "") ? String(item.CP).slice(0, 100) : "N/A",
                pais: (item.Pais && String(item.Pais).trim() !== "") ? String(item.Pais).slice(0, 100) : "N/A",
                rfc: (item.RFC && String(item.RFC).trim() !== "") ? String(item.RFC).slice(0, 100) : "N/A",
                telefono_1: (item.Telefono_1 && String(item.Telefono_1).trim() !== "") ? String(item.Telefono_1).slice(0, 100) : "N/A",
                telefono_2: (item.Telefono_2 && String(item.Telefono_2).trim() !== "") ? String(item.Telefono_2).slice(0, 100) : "N/A",
                fax: (item.Fax && String(item.Fax).trim() !== "") ? String(item.Fax).slice(0, 100) : "N/A",
                celular: (item.Celular && String(item.Celular).trim() !== "") ? String(item.Celular).slice(0, 100) : "N/A",
                email: (item.Email && String(item.Email).trim() !== "") ? String(item.Email).slice(0, 100) : "N/A",
                contraseña: (item.Contraseña && String(item.Contraseña).trim() !== "") ? String(item.Contraseña).slice(0, 100) : "N/A",
                baja: (item.Baja && item.Baja.trim() !== "") ? String(item.Baja).slice(0, 1) : "n",
              }));
              setDataJson(convertedData);
            };
            reader.readAsArrayBuffer(selectedFile);
          }
        };
    
      const itemHeaderTable = () => {
        return (
          <>
            <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">No.</td>
            <td className="w-[40%]">Nombre</td>
            <td className="w-[15%]">Ap. Paterno</td>
            <td className="w-[15%]">Ap. Materno</td>
            <td className="w-[15%]">Direccion</td>
            <td className="w-[15%]">Colonia</td>
            <td className="w-[10%]">Ciudad</td>
            <td className="w-[10%]">Estado</td>
            <td className="w-[10%]">CP</td>
            <td className="w-[10%]">Pais</td>
            <td className="w-[10%]">RFC</td>
            <td className="w-[10%]">Telefono 1</td>
            <td className="w-[10%]">Telefono 2</td>
            <td className="w-[10%]">Fax</td>
            <td className="w-[10%]">Celular</td>
            <td className="w-[10%]">Email</td>
            <td className="w-[10%]">Contraseña</td>
            <td className="w-[10%]">Baja</td>
          </>
        );
      };
    
      const itemDataTable = (item) => {
        return (
          <>
            <tr key={item.numero} className="hover:cursor-pointer">
              <th
                className={
                  typeof item.numero === "number"
                    ? "text-left"
                    : "text-right"
                }
              >
                {item.numero}
              </th>
              <td className="text-left">{item.nombre}</td>
              <td className="text-left">{item.ap_paterno}</td>
              <td className="text-left">{item.ap_materno}</td>
              <td className="text-left">{item.direccion}</td>
              <td className="text-left">{item.colonia}</td>
              <td className="text-left">{item.ciudad}</td>
              <td className="text-left">{item.estado}</td>
              <td className="text-left">{item.cp}</td>
              <td className="text-left">{item.pais}</td>
              <td className="text-left">{item.rfc}</td>
              <td className="text-left">{item.telefono_1}</td>
              <td className="text-left">{item.telefono_2}</td>
              <td className="text-left">{item.fax}</td>
              <td className="text-left">{item.celular}</td>
              <td className="text-left">{item.email}</td>
              <td className="text-left">{item.contraseña}</td>
              <td className="text-left">{item.baja}</td>

            </tr>
          </>
        );
      };

  if (status === "loading") {
    return (
      <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  return (
    <>
       <ModalProcesarDatos
        id_modal={"my_modal_profesores"}
        session={session}
        buttonProcess={buttonProcess}
        isLoadingButton={isLoadingButton}
        isLoading={isLoading}
        title={"Procesar Datos desde Excel."}
        setDataJson={setDataJson}
        dataJson={dataJson}
        handleFileChange={handleFileChange}
        itemHeaderTable={itemHeaderTable}
        itemDataTable={itemDataTable}
        //clase para mover al tamaño del modal a preferencia (max-w-4xl)
        classModal={"modal-box w-full max-w-4xl h-full bg-base-200"}
      />  

      <ModalProfesores
        accion={accion}
        onSubmit={onSubmitModal}
        currentID={currentID}
        errors={errors}
        register={register}
        setProfesor={setProfesor}
        profesor={profesor}
        isLoadingButton={isLoadingButton}
      />
      <VistaPrevia
        pdfPreview={pdfPreview}
        pdfData={pdfData}
        PDF={ImprimePDF}
        Excel={ImprimeExcel}
        id="modalVPProfesor"
        titulo="Vista Previa de Profesores"
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
                procesarDatos ={procesarDatos}
                animateLoading={animateLoading}
                permiso_alta={permissions.altas}
                permiso_imprime={permissions.impresion}
              ></Acciones>
            </div>

            <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 grid grid-flow-col gap-1 justify-around mx-5">
              Profesores.
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
            <TablaProfesores
              session={session}
              isLoading={isLoading}
              profesoresFiltrados={profesoresFiltrados}
              showModal={showModal}
              setProfesor={setProfesor}
              setAccion={setAccion}
              setCurrentId={setCurrentId}
              permiso_cambio={permissions.cambios}
              permiso_baja={permissions.bajas}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Profesores;
