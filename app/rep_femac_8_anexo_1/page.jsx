"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Acciones from "@/app/rep_femac_8_anexo_1/components/Acciones";
import Inputs from "@/app/rep_femac_8_anexo_1/components/Inputs";
import { useForm } from "react-hook-form";
import {
  getRelaciondeRecibos,
  Imprimir,
  ImprimirExcel,
  verImprimir,
} from "@/app/utils/api/rep_femac_8_anexo_1/rep_femac_8_anexo_1";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import BuscarCat from "@/app/components/BuscarCat";
import "jspdf-autotable";
import VistaPrevia from "@/app/components/VistaPrevia";
import { permissionsComponents } from "@/app/utils/globalfn";
import ModalFechas from "@/app/components/modalFechas";
import { ReporteExcel } from "@/app/utils/ReportesExcel";

function RelacionDeRecivos() {
  const router = useRouter();
  const { data: session, status } = useSession();
  let [recibo_ini, setRecibeIni] = useState("");
  let [recibo_fin, setRecibeFin] = useState("");
  let [factura_ini, setFacturaIni] = useState("");
  let [factura_fin, setFacturaFin] = useState("");
  let [alumno_ini, setAlumnoIni] = useState("");
  let [alumno_fin, setAlumnoFin] = useState("");
  let [alumnosFiltrados, setAlumnosFiltrados] = useState([]);
  const [tomaFechas, setTomaFechas] = useState(true);
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const [animateLoading, setAnimateLoading] = useState(false);
  const [permissions, setPermissions] = useState({});
  //Modal Fechas
  let [fecha_ini, setFecha_ini] = useState("");
  let [fecha_fin, setFecha_fin] = useState("");
  const [tempFechaIni, setTempFechaIni] = useState("");
  const [tempFechaFin, setTempFechaFin] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAllAlumnos, setSelectedAllAlumnos] = useState(false);
  const [excelPreviewData, setExcelPreviewData] = useState([]);

  const {
    formState: { errors },
  } = useForm({});

  useEffect(() => {
    const fetchData = async () => {
      let { permissions } = session.user;
      const es_admin = session.user.es_admin;
      const menuSeleccionado = Number(localStorage.getItem("puntoMenu"));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const getPrimerDiaDelMes = () => {
    const fechaActual = new Date();
    return new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1)
      .toISOString()
      .split("T")[0];
  };

  const getUltimoDiaDelMes = () => {
    const fechaActual = new Date();
    return new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];
  };

  useEffect(() => {
    setFecha_ini(getPrimerDiaDelMes());
    setFecha_fin(getUltimoDiaDelMes());
  }, []);

  const formaImprime = async () => {
    let data;
    const { token } = session.user;
    const fechaIniFormateada = fecha_ini ? fecha_ini.replace(/-/g, "/") : 0;
    const fechaFinFormateada = fecha_fin ? fecha_fin.replace(/-/g, "/") : 0;
    data = await getRelaciondeRecibos(
      token,
      tomaFechas,
      selectedAllAlumnos,
      fechaIniFormateada,
      fechaFinFormateada,
      factura_ini,
      factura_fin,
      recibo_ini,
      recibo_fin,
      alumno_ini.numero,
      alumno_fin.numero
    );
    return data;
  };
  const ImprimePDF = async () => {
    alumnosFiltrados = await formaImprime();
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Relación de Recibos",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: alumnosFiltrados,
    };
    Imprimir(configuracion);
  };

  const ImprimeExcel = async () => {
    alumnosFiltrados = await formaImprime();
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Relación de Recibos",
        Nombre_Usuario: ` ${session.user.name}`,
      },
      body: alumnosFiltrados,
      columns: [
        { header: "Recibo", dataKey: "recibo" },
        { header: "Factura", dataKey: "factura" },
        { header: "Fecha P", dataKey: "fecha" },
        { header: "No.", dataKey: "alumno" },
        { header: "Nombre Alumno", dataKey: "nombre_alumno" },
        { header: "Total Rec.", dataKey: "importe_total" },
      ],
      nombre: "Reporte Relación Recibos",
    };
    ImprimirExcel(configuracion);
  };

  const home = () => {
    router.push("/");
  };

  const handleVerClick = async () => {
    setAnimateLoading(true);
    cerrarModalVista();
    alumnosFiltrados = await formaImprime();
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Relación de Recibos",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: alumnosFiltrados,
    };
    setTimeout(async () => {
      const newExcel = new ReporteExcel(configuracion);
      const { pdfData,tablaExcel, alignsIndex } = await verImprimir(configuracion);
      const previewExcel = await newExcel.previewExcel(tablaExcel, alignsIndex);
      setPdfData(pdfData);
      setPdfPreview(true);
      setExcelPreviewData(previewExcel)
      showModalVista(true);
      setAnimateLoading(false);
    }, 500);
  };

  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVPRepFemac8Anexo1").showModal()
      : document.getElementById("modalVPRepFemac8Anexo1").close();
  };

  const cerrarModalVista = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVPRepFemac8Anexo1").close();
  };
  const CerrarView = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVPRepFemac8Anexo1").close();
  };

  const handleCloseModal = () => setModalOpen(false);
  const handleSelectDates = () => {
    setFecha_ini(tempFechaIni);
    setFecha_fin(tempFechaFin);
    setModalOpen(false);
  };
  const handleOpenModal = () => {
    setTempFechaIni(fecha_ini);
    setTempFechaFin(fecha_fin);
    setModalOpen(true);
  };

  if (status === "loading") {
    return (
      <div className="container skeleton w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  return (
    <>
      <VistaPrevia
        id={"modalVPRepFemac8Anexo1"}
        titulo={"Vista Previa Relacion de Recibos"}
        pdfPreview={pdfPreview}
        pdfData={pdfData}
        excelPreviewData={excelPreviewData}
        PDF={ImprimePDF}
        Excel={ImprimeExcel}
        CerrarView={CerrarView}
        seeExcel={true}
        seePDF={true}
      />
      <div className="flex flex-col justify-start items-start bg-base-200 shadow-xl rounded-xl dark:bg-slate-700 h-full max-[420px]:w-full w-11/12">
        <div className="w-full py-3">
          {/* Fila de la cabecera de la pagina */}
          <div className="flex flex-col justify-start p-3 max-[600px]:p-0">
            <div className="flex flex-wrap items-start md:items-center mx-auto">
              <div className="order-2 md:order-1 flex justify-between w-full md:w-auto mb-0">
                <Acciones
                  home={home}
                  Ver={handleVerClick}
                  isLoading={animateLoading}
                  permiso_imprime={permissions.impresion}
                />
              </div>
              <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 mx-5">
                Relación de Recibos
              </h1>
            </div>
          </div>
        </div>
        <div className="w-full py-3 flex flex-col gap-y-4">
          {/* Fila del formulario de la pagina */}
          <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 min-[1300px]:w-1/3 min-[1920px]:w-1/4 w-1/2 mx-auto space-y-4">
            <div className="flex flex-row gap-4">
              <div className="lg:w-fit md:w-fit">
                <input
                  type="date"
                  value={fecha_ini}
                  onChange={(e) => setFecha_ini(e.target.value)}
                  className="border p-2 rounded"
                />
              </div>
              <button
                onClick={handleOpenModal}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                📅
              </button>
              <div className="lg:w-fit md:w-fit">
                <input
                  type="date"
                  value={fecha_fin}
                  onChange={(e) => setFecha_fin(e.target.value)}
                  className="border p-2 rounded"
                />
              </div>

              {modalOpen && (
                <ModalFechas
                  tempFechaIni={tempFechaIni}
                  setTempFechaIni={setTempFechaIni}
                  tempFechaFin={tempFechaFin}
                  setTempFechaFin={setTempFechaFin}
                  handleSelectDates={handleSelectDates}
                  handleCloseModal={handleCloseModal}
                />
              )}
            </div>
            <div className="flex flex-row max-[499px]:gap-1 gap-4">
              <div className="lg:w-fit md:w-fit">
                <Inputs
                  name={"recibo_ini"}
                  tamañolabel={""}
                  className={"rounded block grow w-full md:w-1/2 "}
                  Titulo={"Recibos: "}
                  type={"text"}
                  errors={errors}
                  maxLength={15}
                  dataType={"int"}
                  isDisabled={false}
                  setValue={setRecibeIni}
                />
              </div>
              <div className="lg:w-fit md:w-fit">
                <Inputs
                  name={"recibo_fin"}
                  tamañolabel={""}
                  className={"rounded block grow w-full md:w-1/2"}
                  Titulo={""}
                  type={"text"}
                  errors={errors}
                  maxLength={15}
                  dataType={"int"}
                  isDisabled={false}
                  setValue={setRecibeFin}
                />
              </div>
            </div>
            <div className="flex flex-row max-[499px]:gap-1 gap-4">
              <div className="lg:w-fit md:w-fit">
                <Inputs
                  name={"factura_ini"}
                  tamañolabel={""}
                  className={"rounded block grow w-full md:w-1/2"}
                  Titulo={"Facturas: "}
                  type={"text"}
                  errors={errors}
                  maxLength={15}
                  dataType={"int"}
                  isDisabled={false}
                  setValue={setFacturaIni}
                />
              </div>
              <div className="lg:w-fit md:w-fit">
                <Inputs
                  name={"factura_fin"}
                  tamañolabel={""}
                  className={"rounded block grow w-full md:w-1/2"}
                  Titulo={""}
                  type={"text"}
                  errors={errors}
                  maxLength={15}
                  dataType={"int"}
                  isDisabled={false}
                  setValue={setFacturaFin}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-row">
            <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 min-[1300px]:w-1/3 min-[1920px]:w-1/4 w-1/2 mx-auto ">
              <div className="col-span-full md:col-span-full lg:col-span-full">
                <div className="w-full p-1">
                  <BuscarCat
                    deshabilitado={selectedAllAlumnos === true}
                    table="alumnos"
                    itemData={[]}
                    fieldsToShow={["numero", "nombre_completo"]}
                    nameInput={["numero", "nombre_completo"]}
                    titulo={"Alumno Inicio: "}
                    setItem={setAlumnoIni}
                    token={session.user.token}
                    modalId="modal_alumnos1"
                    inputWidths={{ first: "109px", second: "300px" }}
                    descClassName="md:mt-0 w-full"
                  />
                </div>
              </div>
              <div className="col-span-full md:col-span-full lg:col-span-full">
                <div className="w-full p-1">
                  <BuscarCat
                    deshabilitado={selectedAllAlumnos === true}
                    table="alumnos"
                    itemData={[]}
                    fieldsToShow={["numero", "nombre_completo"]}
                    nameInput={["numero", "nombre_completo"]}
                    titulo={"Alumno Fin: "}
                    setItem={setAlumnoFin}
                    token={session.user.token}
                    modalId="modal_alumnos2"
                    inputWidths={{ first: "109px", second: "300px" }}
                    descClassName="md:mt-0 w-full"
                  />
                </div>
              </div>
              {!modalOpen && (
                <div className="flex flex-row max-[499px]:gap-1 gap-4">
                  <div className="lg:w-fit md:w-fit">
                  <div className="tooltip" data-tip="Tomar Fechas">
                      <label
                        htmlFor="ch_tomaFechas"
                        className="label cursor-pointer flex justify-start space-x-2"
                      >
                        <input
                          id="ch_tomaFechas"
                          type="checkbox"
                          className="checkbox checkbox-md"
                          defaultChecked={true}
                          onClick={(evt) => setTomaFechas(evt.target.checked)}
                        />
                        <span className="fa-regular fa-calendar block sm:hidden md:hidden lg:hidden xl:hidden text-neutral-600 dark:text-neutral-200"></span>
                        <span className="label-text font-bold md:block hidden text-neutral-600 dark:text-neutral-200">
                          Toma Fechas
                        </span>
                      </label>
                    </div>
                    <div className="tooltip" data-tip="Toma todos los Alumnos">
                      <label
                        htmlFor="ch_SelectedAllAlumnos"
                        className="label cursor-pointer flex justify-start space-x-2"
                      >
                        <input
                          id="ch_selectedAllAlumnos"
                          type="checkbox"
                          className="checkbox checkbox-md"
                          defaultChecked={false}
                          onClick={(evt) => setSelectedAllAlumnos(evt.target.checked)}
                        />
                        <span className="label-text font-bold md:block hidden text-neutral-600 dark:text-neutral-200">
                          Toma todos los Alumnos
                        </span>
                      </label>
                    </div>
                    
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RelacionDeRecivos;
