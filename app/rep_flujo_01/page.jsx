"use client"
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Inputs from './components/Inputs'
import { useForm } from 'react-hook-form'
import Acciones from './components/Acciones'
import { Fecha_de_Ctod, formatDate } from '../utils/globalfn'
import { DocumentosCobranza, ImprimirExcel, ImprimirPDF } from '../utils/api/rep_flujo_01/rep_flujo_01'
import ModalVistaPreviaRepFlujo01 from './components/modalVistaPreviaRepFlujo01'
import { ReportePDF } from '../utils/ReportesPDF'

function page() {
  const date = new Date();
  const dateStr = formatDate(date);
  const router = useRouter();
  const { data: session, status } = useSession();
  let [fecha_ini, setFecha_ini] = useState(dateStr.replace(/\//g, '-'));
  let [fecha_fin, setFecha_fin] = useState(dateStr.replace(/\//g, '-'));
  const [selectedOption, setSelectedOption] = useState('sin_deudores');
  const [dataDocumentoCobranza, setDataDocumentoCobranza] = useState([])
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const {
    formState: { errors },
  } = useForm({})

  useEffect(() => {
    if (status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {
      const { token } = session.user
      const fecha_ciclo = Fecha_de_Ctod(fecha_ini, -63)
      console.log("nueva fecha xd:", fecha_ciclo)
      const data = await DocumentosCobranza(token, fecha_ciclo, fecha_fin)
      setDataDocumentoCobranza(data)      
    }
    fetchData()
  }, [session, status, fecha_ini, fecha_fin])

  if (status === "loading") {
    return (
      <div className="container skeleton w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  const handleCheckChange = (event) => {
    setSelectedOption(event.target.value);
  };
  console.log(selectedOption)
  const home = () => {
    router.push("/");
  };
  console.log(fecha_ini, fecha_fin)
  const handleVerClick = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: `Reporte de Adeudos Pendientes  al ${fecha_ini}`,
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: dataDocumentoCobranza,
    }
    const reporte = new ReportePDF(configuracion);
    const { body } = configuracion;
    const documentosCobranza = body.documentos_cobranza
    const alumnos = body.alumnos
    console.log("documentos Cobranza:", documentosCobranza)
    console.log("alumnos:", alumnos)
    let Tw_Col = Array.from({ length: 14 }, () => Array(9).fill(0.0));
    let Tw_TGe = Array(9).fill(0.0);
    let Tw_Per = Array(14).fill("");
    const Enca1 = (doc) => {
      if (!doc.tiene_encabezado) {
        doc.imprimeEncabezadoPrincipalV();
        doc.nextRow(12);
        doc.ImpPosX("Periodo", 14, doc.tw_ren);
        doc.ImpPosX("Coleg.", 34, doc.tw_ren);
        doc.ImpPosX("Desc.", 54, doc.tw_ren);
        doc.ImpPosX("Inscrip.", 74, doc.tw_ren);
        doc.ImpPosX("Recargo", 94, doc.tw_ren);
        doc.ImpPosX("Taller", 114, doc.tw_ren);
        doc.ImpPosX("Total", 134, doc.tw_ren);
        doc.ImpPosX("Cobro", 154, doc.tw_ren);
        doc.ImpPosX("Saldo", 174, doc.tw_ren);
        doc.nextRow(4);
        doc.printLineV();
        doc.nextRow(4);
        doc.tiene_encabezado = true;
      } else {
        doc.nextRow(6);
        doc.tiene_encabezado = true;
      }
    }
    Enca1(reporte)
    for (let Pos_Act = 0; Pos_Act < 13; Pos_Act++) {
      Tw_Per[Pos_Act] = ""
      Tw_Col[Pos_Act][1] = 0
      Tw_Col[Pos_Act][2] = 0
      Tw_Col[Pos_Act][3] = 0
      Tw_Col[Pos_Act][4] = 0
      Tw_Col[Pos_Act][5] = 0
      Tw_Col[Pos_Act][6] = 0
      Tw_Col[Pos_Act][7] = 0
      Tw_Col[Pos_Act][8] = 0
    }
    for (let Pos_Act = 1; Pos_Act < 8; Pos_Act++) {
      Tw_TGe[Pos_Act] = 0
    }
    Tw_Per[1] = fecha_ini.slice(0, 7)
    Tw_Per[12] = fecha_fin.slice(0, 7)
    let adiciona
    let per_str
    let pos_act
    documentosCobranza.forEach((documento) => {
      const alumno = alumnos.find((alu) => alu.id === documento.alumno)
      if (alumno) {
        adiciona = true
        if (selectedOption === 'sin_deudor') {
          if (alumno.estatus.toUpperCase() === "CARTERA") {
            adiciona = false
          } else {
            adiciona = true
          }
        }
        if (selectedOption === 'solo_deudores') {
          if (alumno.estatus.toUpperCase() === "CARTERA") {
            adiciona = true
          } else {
            adiciona = false
          }
        }
      } else {
        adiciona = false
      }
      if (adiciona === true) {
        per_str = documento.fecha.toString().slice(0, 7)
        if (per_str < Tw_Per[1]) {
          pos_act = 0
        } else if (per_str > Tw_Per[12]) {
          pos_act = 13
        } else {
          for (pos_act = 1; pos_act < 13; pos_act++) {
            if (Tw_Per[pos_act] === per_str) break
            if (Tw_Per[pos_act] === "") {
              Tw_Per[pos_act] = per_str
              break
            }
          }
        }
        if (pos_act < 13) {
          if (documento.ref.toString().toUpperCase() === 'COL') {
            Tw_Col[pos_act][1] = Number(Tw_Col[pos_act][1]) + documento.importe
            Tw_Col[pos_act][2] = Number(Tw_Col[pos_act][2]) + (documento.importe * (documento.descuento / 100))
          }
          if (documento.ref.toString().toUpperCase() === 'INS') {
            Tw_Col[pos_act][3] = Number(Tw_Col[pos_act][3]) + documento.importe
            Tw_Col[pos_act][4] = Number(Tw_Col[pos_act][4]) + (documento.importe * (documento.descuento / 100))
          }
          if (documento.ref.toString().toUpperCase() === 'REC') {
            Tw_Col[pos_act][4] = Number(Tw_Col[pos_act][4]) + documento.importe
          }
          if (documento.ref.toString().toUpperCase() == 'TAL') {
            Tw_Col[pos_act][5] = Number(Tw_Col[pos_act][5]) + documento.importe
          }
          Tw_Col[pos_act][8] = Number(Tw_Col[pos_act][8]) + documento.importe_pago
        }
      }
    })
    let imp_total
    for (pos_act = 0; pos_act < 13; pos_act++) {
      imp_total = Number(Tw_Col[pos_act][1]) - Number(Tw_Col[pos_act][2]) + Number(Tw_Col[pos_act][3]) + Number(Tw_Col[pos_act][4]) + Number(Tw_Col[pos_act][5])
      Tw_TGe[1] = Number(Tw_TGe[1]) + Number(Tw_Col[pos_act][1])
      Tw_TGe[2] = Number(Tw_TGe[2]) + Number(Tw_Col[pos_act][2])
      Tw_TGe[3] = Number(Tw_TGe[3]) + Number(Tw_Col[pos_act][3])
      Tw_TGe[4] = Number(Tw_TGe[4]) + Number(Tw_Col[pos_act][4])
      Tw_TGe[5] = Number(Tw_TGe[5]) + Number(Tw_Col[pos_act][5])
      Tw_TGe[6] = Number(Tw_TGe[6]) + Number(Tw_Col[pos_act][6])
      Tw_TGe[7] = Number(Tw_TGe[7]) + Number(imp_total)
      Tw_TGe[8] = Number(Tw_TGe[8]) + Number(Tw_Col[pos_act][8])
      reporte.ImpPosX(Tw_Per[pos_act].toString(),14,reporte.tw_ren)
      reporte.ImpPosX(Tw_Col[pos_act][1].toString(),34,reporte.tw_ren)
      reporte.ImpPosX(Tw_Col[pos_act][2].toString(),54,reporte.tw_ren)
      reporte.ImpPosX(Tw_Col[pos_act][3].toString(),74,reporte.tw_ren)
      reporte.ImpPosX(Tw_Col[pos_act][4].toString(),94,reporte.tw_ren)
      reporte.ImpPosX(Tw_Col[pos_act][5].toString(),114,reporte.tw_ren)
      reporte.ImpPosX(imp_total.toString(),134,reporte.tw_ren)
      reporte.ImpPosX(Tw_Col[pos_act][8].toString(),154,reporte.tw_ren)
      const sum = Number(imp_total)-Number(Tw_Col[pos_act][8].toString())
      reporte.ImpPosX(sum.toString(),174,reporte.tw_ren)      
      Enca1(reporte);
      if (reporte.tw_ren >= reporte.tw_endRen) {
        reporte.pageBreak();
        Enca1(reporte);
      }
    }
    reporte.ImpPosX("Total",14,reporte.tw_ren)
    reporte.ImpPosX(Tw_TGe[1].toString(),34,reporte.tw_ren)
    reporte.ImpPosX(Tw_TGe[2].toString(),54,reporte.tw_ren)
    reporte.ImpPosX(Tw_TGe[3].toString(),74,reporte.tw_ren)
    reporte.ImpPosX(Tw_TGe[4].toString(),94,reporte.tw_ren)
    reporte.ImpPosX(Tw_TGe[5].toString(),114,reporte.tw_ren)
    reporte.ImpPosX(Tw_TGe[7].toString(),134,reporte.tw_ren)
    reporte.ImpPosX(Tw_TGe[8].toString(),154,reporte.tw_ren)
    const sum = Number(Tw_TGe[7].toString())-Number(Tw_TGe[8].toString())
    reporte.ImpPosX(sum.toString(),174,reporte.tw_ren)
    console.log("tw_col", Tw_Col)
    console.log("tw_tGe", Tw_TGe)
    console.log("tw_per", Tw_Per)
    const pdfData = reporte.doc.output("datauristring")
    setPdfData(pdfData)
    setPdfPreview(true)
    showModalVista(true)
  }
  const ImprimePDF = async () =>{
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: `Reporte de Adeudos Pendientes  al ${fecha_ini}`,
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: dataDocumentoCobranza,    
    }
    ImprimirPDF(configuracion,fecha_ini,fecha_fin,selectedOption )
  }
  const ImprimeExcel = async () =>{
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: `Reporte Adeudos Pendientes  al ${fecha_ini}`,
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: dataDocumentoCobranza,
      columns:[
        { header: "Periodo", dataKey: "periodo" },
        { header: "Coleg", dataKey: "coleg" },
        { header: "Desc", dataKey: "desc" },
        { header: "Inscrip", dataKey: "inscrip" },
        { header: "Recargo", dataKey: "recargo" },
        { header: "Taller", dataKey: "taller" },
        { header: "Total", dataKey: "total" },
        { header: "Cobro", dataKey: "cobro" },
        { header: "Saldo", dataKey: "saldo" },
      ],
      nombre:"Reporte de Adeudos Pendientes"
    }
    ImprimirExcel(configuracion,fecha_ini,fecha_fin,selectedOption )
  }
  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVPRepFlujo01").showModal()
      : document.getElementById("modalVPRepFlujo01").close();
  }
  return (
    <>
      <ModalVistaPreviaRepFlujo01
        pdfPreview={pdfPreview}
        pdfData={pdfData}
        PDF={ImprimePDF}
        Excel={ImprimeExcel}
        />
      <div className='container w-full  max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3'>
        <div className='flex justify-start p-3 '>
          <h1 className='text-4xl font-xthin text-black dark:text-white md:px-12'>
            Reporte Adeudos Pendientes
          </h1>
        </div>
        <div className='container grid grid-cols-8 grid-rows-1 h-[calc(100%-20%)]'>
          <div className='col-span-1 flex flex-col'>
            <Acciones home={home} Ver={handleVerClick} />
          </div>
          <div className='col-span-7'>
            <div className='flex flex-col h-full space-y-4'>
              <div className='flex space-x-4'>
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
              <div className='flex space-x-4'>
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

  )
}

export default page
