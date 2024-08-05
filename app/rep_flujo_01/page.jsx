"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Inputs from "./components/Inputs";
import { useForm } from "react-hook-form";
import Acciones from "./components/Acciones";
import { formatDate } from "../utils/globalfn";
import { DocumentosCobranza } from "../utils/api/rep_flujo_01/rep_flujo_01";
import ModalVistaPreviaRepFlujo01 from "./components/modalVistaPreviaRepFlujo01";
import { ReportePDF } from "../utils/ReportesPDF";

function Rep_Flujo_01() {
  const date = new Date();
  const dateStr = formatDate(date);
  const router = useRouter();
  const { data: session, status } = useSession();
  let [fecha_ini, setFecha_ini] = useState(dateStr.replace(/\//g, "-"));
  let [fecha_fin, setFecha_fin] = useState(dateStr.replace(/\//g, "-"));
  const [selectedOption, setSelectedOption] = useState("sin_deudores");
  const [dataDocumentoCobranza, setDataDocumentoCobranza] = useState([]);
  const {
    formState: { errors },
  } = useForm({});

  useEffect(() => {
    if (status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {
      const { token } = session.user;
      const data = await DocumentosCobranza(token, fecha_ini, fecha_fin);
      setDataDocumentoCobranza(data);
    };
    fetchData();
  }, [session, status, fecha_ini, fecha_fin]);

  if (status === "loading") {
    return (
      <div className="container skeleton w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  const handleCheckChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const home = () => {
    router.push("/");
  };
  const handleVerClick = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Cobranza por Alumno(s)",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: dataDocumentoCobranza,
    };
    const reporte = new ReportePDF(configuracion);
    const { body } = configuracion;
    const documentosCobranza = body.docuemntos_cobranza;
    const alumnos = body.alumnos;
    let Tw_Col = Array.from({ length: 14 }, () => Array(9).fill(0.0));
    let Tw_TGe = Array(9).fill(0.0);
    let Tw_Per = Array(14).fill("");

    for (let Pos_Act = 0; Pos_Act < 13; Pos_Act++) {
      Tw_Per[Pos_Act] = "";
      Tw_Col[Pos_Act][1] = 0;
      Tw_Col[Pos_Act][2] = 0;
      Tw_Col[Pos_Act][3] = 0;
      Tw_Col[Pos_Act][4] = 0;
      Tw_Col[Pos_Act][5] = 0;
      Tw_Col[Pos_Act][6] = 0;
      Tw_Col[Pos_Act][7] = 0;
      Tw_Col[Pos_Act][8] = 0;
    }
    for (let Pos_Act = 1; Pos_Act < 8; Pos_Act++) {
      Tw_TGe[Pos_Act] = 0;
    }
    Tw_Per[1] = fecha_ini.slice(0, 7);
    Tw_Per[12] = fecha_fin.slice(0, 7);
    documentosCobranza.forEach((docuemnto) => {});
    showModalVista(true);
  };
  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVPRepFlujo01").showModal()
      : document.getElementById("modalVPRepFlujo01").close();
  };
  return (
    <>
      <ModalVistaPreviaRepFlujo01 />
      <div className="container w-full  max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3">
        <div className="flex justify-start p-3 ">
          <h1 className="text-4xl font-xthin text-black dark:text-white md:px-12">
            Reporte Adeudos Pendientes
          </h1>
        </div>
        <div className="container grid grid-cols-8 grid-rows-1 h-[calc(100%-20%)]">
          <div className="col-span-1 flex flex-col">
            <Acciones home={home} Ver={handleVerClick} />
          </div>
          <div className="col-span-7">
            <div className="flex flex-col h-full space-y-4">
              <div className="flex space-x-4">
                <Inputs
                  name={"fecha_ini"}
                  tamañolabel={""}
                  className={"rounded block grow"}
                  Titulo={"Fecha Inicial: "}
                  type={"date"}
                  errors={errors}
                  maxLength={11}
                  isDisabled={false}
                  setValue={setFecha_ini}
                  value={fecha_ini}
                />
                <Inputs
                  name={"fecha_fin"}
                  tamañolabel={""}
                  className={"rounded block grow"}
                  Titulo={"Fecha Final: "}
                  type={"date"}
                  errors={errors}
                  maxLength={11}
                  isDisabled={false}
                  setValue={setFecha_fin}
                  value={fecha_fin}
                />
              </div>
              <div className="flex space-x-4">
                <div className="flex flex-col space-y-2">
                  <label className="flex items-center space-x-2 dark:text-white text-black">
                    <input
                      type="radio"
                      name="options"
                      value="sin_deudores"
                      checked={selectedOption === "sin_deudores"}
                      onChange={handleCheckChange}
                      className="form-radio"
                    />
                    <span>Sin Deudores</span>
                  </label>
                  <label className="flex items-center space-x-2 dark:text-white text-black">
                    <input
                      type="radio"
                      name="options"
                      value="solo_deudores"
                      checked={selectedOption === "solo_deudores"}
                      onChange={handleCheckChange}
                      className="form-radio"
                    />
                    <span>Solo Deudores</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Rep_Flujo_01;
