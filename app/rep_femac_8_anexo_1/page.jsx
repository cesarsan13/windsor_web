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
import ModalVistaPreviaRepFemac8Anexo1 from "./components/ModalVistaPreviaRepFemac8Anexo1";

function AltasBajasAlumnos() {
  const router = useRouter();
  const { data: session, status } = useSession();
  let [fecha_ini, setFecha_ini] = useState("");
  let [fecha_fin, setFecha_fin] = useState("");
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
  const {
    formState: { errors },
  } = useForm({});

  const formaImprime = async () => {
    let data;
    const { token } = session.user;
    const fechaIniFormateada = fecha_ini ? fecha_ini.replace(/-/g, "/") : 0;
    const fechaFinFormateada = fecha_fin ? fecha_fin.replace(/-/g, "/") : 0;
    data = await getRelaciondeRecibos(
      token,
      tomaFechas,
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
        Nombre_Usuario: `Usuario: ${session.user.name}`,
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
    alumnosFiltrados = await formaImprime();
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Relación de Recibos",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: alumnosFiltrados,
    };
    const pdfData = await verImprimir(configuracion);
    setPdfData(pdfData);
    setPdfPreview(true);
    showModalVista(true);
  };

  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVPRepFemac8Anexo1").showModal()
      : document.getElementById("modalVPRepFemac8Anexo1").close();
  };

  if (status === "loading") {
    return (
      <div className="container skeleton w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  return (
    <>
      <ModalVistaPreviaRepFemac8Anexo1
        pdfPreview={pdfPreview}
        pdfData={pdfData}
        PDF={ImprimePDF}
        Excel={ImprimeExcel}
      />
       <div className="container w-full max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3">
        <div className="flex justify-start p-3">
          <h1 className="text-4xl font-xthin text-black dark:text-white md:px-12">
            Relación de Recibos
          </h1>
        </div>
        <div className="flex flex-col md:grid md:grid-cols-8 md:grid-rows-1 h-full">
          <div className="md:col-span-1 flex flex-col">
            <Acciones home={home} Ver={handleVerClick} />
          </div>
          <div className="col-span-7">
            <div className="flex flex-col h-[calc(80%)] overflow-y-auto">
            <div className='flex flex-col md:flex-row gap-4 '>
              <div className='w-11/12 md:w-4/12 lg:w-3/12'>
                <Inputs
                  name={"fecha_ini"}
                  tamañolabel={""}
                  className={"rounded  block grow"}
                  Titulo={"Fecha Inicial: "}
                  type={"date"}
                  errors={errors}
                  maxLength={15}
                  isDisabled={false}
                  setValue={setFecha_ini}
                />
                </div>
                <div className='w-11/12 md:w-4/12 lg:w-3/12'>
             
                <Inputs
                  name={"fecha_fin"}
                  tamañolabel={""}
                  className={"rounded block grow "}
                  Titulo={"Fecha Final: "}
                  type={"date"}
                  errors={errors}
                  maxLength={15}
                  isDisabled={false}
                  setValue={setFecha_fin}
                />
                </div>
              </div>
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
                  <span className="fa-regular fa-calendar block sm:hidden md:hidden lg:hidden xl:hidden  text-neutral-600 dark:text-neutral-200"></span>
                  <span className="label-text font-bold md:block hidden text-neutral-600 dark:text-neutral-200">
                    Toma Fechas
                  </span>
                </label>
              </div>
            
            <div className="flex md:flex-row lg:flex-row md:space-x-1p-1">
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

            <div className="flex md:flex-row lg:flex-row md:space-x-1 gap-3 p-1">
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
            <div className="p-1">
              <BuscarCat
                table="alumnos"
                itemData={[]}
                fieldsToShow={["numero", "nombre_completo"]}
                nameInput={["numero", "nombre_completo"]}
                titulo={"Inicio: "}
                setItem={setAlumnoIni}
                token={session.user.token}
                modalId="modal_alumnos1"
                inputWidths={{ first: "100px", second: "300px" }}
              />
              </div>
              <div className="p-1">
              <BuscarCat
                table="alumnos"
                itemData={[]}
                fieldsToShow={["numero", "nombre_completo"]}
                nameInput={["numero", "nombre_completo"]}
                titulo={"Fin: "}
                setItem={setAlumnoFin}
                token={session.user.token}
                modalId="modal_alumnos2"
                inputWidths={{ first: "115px", second: "300px" }}
              />
              </div>
          </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AltasBajasAlumnos;
