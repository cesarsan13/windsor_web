"use client"
import React from "react"
import { useRouter } from "next/navigation";
import Acciones from "./components/Acciones";
import Inputs from "./components/Inputs";
import { useForm } from "react-hook-form";
import {
    getRelaciondeFacturas,
    ImprimirPDF,
    ImprimirExcel,
} from "@/app/utils/api/rep_femac_9_anexo_4/rep_femac_9_anexo_4";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import "jspdf-autotable";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import ModalVistaPreviaRepFemac9Anexo4 from "./components/modalVistaPreviaRepFemac9Anexo4";


function RelaciondeFacturas(){
    const router = useRouter();
    const { data: session, status } = useSession();
    let [fecha_cobro_ini, setFecha_cobro_ini] = useState("");
    let [fecha_cobro_fin, setFecha_cobro_fin] = useState("");
    let [factura_ini, setFacturaIni] = useState("");
    let [factura_fin, setFacturaFin] = useState("");
  
    const [tomaFechas, setTomaFechas] = useState(true);
    const [tomaCanceladas, setTomaCanceladas] = useState(false);
    const [pdfPreview, setPdfPreview] = useState(false);
    const [pdfData, setPdfData] = useState("");
    const [FormaRepRelaciondeFacturas, setFormaRelaciondeFacturas] =  useState([]);

    useEffect(()=> {
        if(status === "loading" || !session) {
          return;
        }
        const fetchData = async () => {
          const { token } = session.user
          const data = await getRelaciondeFacturas(token, tomaFechas, tomaCanceladas, fecha_cobro_ini, fecha_cobro_fin, factura_ini, factura_fin);
          setFormaRelaciondeFacturas(data);
          console.log(data);
        }
        fetchData()
      }, [session, status, tomaFechas, tomaCanceladas, fecha_cobro_ini, fecha_cobro_fin, factura_ini, factura_fin]);
  

    const {
        formState: { errors },
    } = useForm({});

    const home = () => {
        router.push("/");
    };

    const handleVerClick = () => {
     
        const configuracion = {
            Encabezado: {
              Nombre_Aplicacion: "Sistema de Control Escolar",
              Nombre_Reporte: "Reporte de relación de facturas",
              Nombre_Usuario: `Usuario: ${session.user.name}`,
            },
            body: FormaRepRelaciondeFacturas,
        };
        
        const reporte = new ReportePDF(configuracion);
        const { body } = configuracion;
        const Enca1 = (doc) => {
          if (!doc.tiene_encabezado) {
            doc.imprimeEncabezadoPrincipalV();
            doc.nextRow(8);
            if(tomaFechas === true)
            {
                if(fecha_cobro_fin == '')
                {
                    doc.ImpPosX(`Reporte de Factura del ${fecha_cobro_ini} `,15,doc.tw_ren),
                    doc.nextRow(5);
                }
                else{
                    doc.ImpPosX(`Reporte de Facturas del ${fecha_cobro_ini} al ${fecha_cobro_fin}`,15,doc.tw_ren),
                    doc.nextRow(5);
                }
            }
            
            if(tomaCanceladas === true){
              doc.ImpPosX("Facturas Canceladas", 15, doc.tw_ren),
              doc.nextRow(5);
            }

            doc.ImpPosX("Factura",15,doc.tw_ren),
            doc.ImpPosX("Recibo",30,doc.tw_ren),
            doc.ImpPosX("Fecha P",45,doc.tw_ren),
            doc.ImpPosX("Nombre",68,doc.tw_ren),
            doc.ImpPosX("Subtotal",145,doc.tw_ren),
            doc.ImpPosX("I.V.A",165,doc.tw_ren),
            doc.ImpPosX("Total",180,doc.tw_ren),
            doc.nextRow(4);
            doc.printLineV();
            doc.nextRow(4);
            doc.tiene_encabezado = true;
          } else {
            doc.nextRow(6);
            doc.tiene_encabezado = true;
          }
        };
        
        let total_general = 0;

        Enca1(reporte);
        body.forEach((imp) => {
          const noFac = imp.numero_factura;
          const recibo = imp.recibo;
          const fecha = imp.fecha;
          const razon_social = imp.razon_social;
          const ivaimp = imp.iva;
          const iva = imp.iva;
          const cantidad = imp.cantidad;
          const precio_unitario = imp.precio_unitario;
          const descuento = imp.descuento;

          
          let total_importe = 0; 
          let sub_total = 0;
          const r_s_nombre = "FACTURA GLOBAL DEL DIA";
          let razon_social_cambio = "";

          /*Para hacer las operaciones*/
          total_importe = cantidad * precio_unitario;
          total_importe = total_importe - (total_importe *(descuento / 100));
  
          if (iva > 0 ){
            sub_total = total_importe * (iva / 100);
            sub_total += total_importe;

          } else if (iva < 0 || iva === 0){
            sub_total = total_importe;
          }

          if(razon_social === '' || razon_social === ' '){
            razon_social_cambio = r_s_nombre;
          } else {
            razon_social_cambio = razon_social;
         
          }
            reporte.ImpPosX(noFac.toString(), 15, reporte.tw_ren);
            reporte.ImpPosX(recibo.toString(), 30, reporte.tw_ren);
            reporte.ImpPosX(fecha, 45, reporte.tw_ren);
            reporte.ImpPosX(razon_social_cambio, 68, reporte.tw_ren);
            reporte.ImpPosX(total_importe.toFixed(2), 145, reporte.tw_ren);
            reporte.ImpPosX(`${ivaimp} %`.toString(), 165, reporte.tw_ren);
            reporte.ImpPosX(sub_total.toFixed(2), 180, reporte.tw_ren);
         
          Enca1(reporte);
          if (reporte.tw_ren >= reporte.tw_endRen) {
            reporte.pageBreak();
            Enca1(reporte);
          }
          total_general = total_general + sub_total;

        });
        reporte.nextRow(4);
        reporte.ImpPosX(`TOTAL IMPORTE: ${total_general.toFixed(2)}`|| '', 149, reporte.tw_ren);

        const pdfData = reporte.doc.output("datauristring");
        setPdfData(pdfData);
        setPdfPreview(true);
        showModalVista(true);
      
    };

    //hasta aqui

    const showModalVista = (show) => {
      show
        ? document.getElementById("modalVPRepFemac9Anexo4").showModal()
        : document.getElementById("modalVPRepFemac9Anexo4").close();
    }


    const ImprimePDF = async () => {
        const configuracion = {
            Encabezado: {
              Nombre_Aplicacion: "Sistema de Control Escolar",
              Nombre_Reporte: "Reporte de relación de facturas",
              Nombre_Usuario: `Usuario: ${session.user.name}`,
            },
            body: FormaRepRelaciondeFacturas,
        }
        ImprimirPDF(configuracion, fecha_cobro_ini, fecha_cobro_fin, tomaFechas, tomaCanceladas)
    };

    const ImprimeExcel = async () => {
        let detallefecha = "";
        let detallecanceladas = "";
        if(tomaFechas === true)
          {
              if(fecha_cobro_fin == '')
              {
                  detallefecha = `Reporte de Factura del ${fecha_cobro_ini} `;
              }
              else{
                  detallefecha = `Reporte de Facturas del ${fecha_cobro_ini} al ${fecha_cobro_fin}`;
              }
          }
          
          if(tomaCanceladas === true){
            detallecanceladas = "Facturas Canceladas";
          }

        const configuracion = {
            Encabezado: {
                Nombre_Aplicacion: "Sistema de Control Escolar",
                Nombre_Reporte: "Reporte de relación de facturas",
                Nombre_Usuario: `${session.user.name}`,
                Clase: detallefecha,
                Profesor: detallecanceladas,
                FechaE: "",
            },
            body: FormaRepRelaciondeFacturas,
            columns: [
                { header: "Factura", dataKey: "facturaI" },
                { header: "Recibo", dataKey: "reciboI" },
                { header: "Fecha P", dataKey: "fechapI" },
                { header: "Nombre", dataKey: "nombreI" },
                { header: "Subtotal", dataKey: "subtotalI" },
                { header: "I.V.A", dataKey: "ivaI" },
                { header: "Total", dataKey: "totalI" },
            ],
            nombre: "Reporte de relación de facturas"
        }
        ImprimirExcel(configuracion) 
    };



 if (status === "loading") {
        return (
            <div className="container skeleton w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
        );
    }
    return ( 
        <>
        <ModalVistaPreviaRepFemac9Anexo4
        pdfPreview={pdfPreview} 
        pdfData={pdfData} 
        PDF={ImprimePDF} 
        Excel = {ImprimeExcel}/>

        <div className="container w-full max-w-screen-xl bg-slate-100 dark:bg-slate-700 shadow-xl rounded-xl px-3">
          <div className="flex justify-start p-3">
            <h1 className="text-4xl font-xthin text-black dark:text-white md:px-12">
              Relación de Facturas
            </h1>
          </div>
          <div className="flex flex-col md:grid md:grid-cols-8 md:grid-rows-1 h-full">
            <div className="md:col-span-1 flex flex-col">
              <Acciones home={home} Ver={handleVerClick} />
            </div>
            <div className="col-span-7">
              <div className="flex flex-col h-[calc(80%)] overflow-y-auto">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className='w-11/12 md:w-4/12 lg:w-3/12'>
                    <Inputs
                      name={"fecha_cobro_ini"}
                      tamañolabel={""}
                      className={"rounded block grow"}
                      Titulo={"Fecha Inicial: "}
                      type={"date"}
                      errors={errors}
                      maxLength={15}
                      isDisabled={false}
                      setValue={setFecha_cobro_ini}
                    />
                  </div>
                  <div className='w-11/12 md:w-4/12 lg:w-3/12'>
                    <Inputs
                      name={"fecha_cobro_fin"}
                      tamañolabel={""}
                      className={"rounded block grow"}
                      Titulo={"Fecha Final: "}
                      type={"date"}
                      errors={errors}
                      maxLength={15}
                      isDisabled={false}
                      setValue={setFecha_cobro_fin}
                    />
                  </div>
                </div>
                <div >
                  <div className="tooltip" data-tip="Tomar Fechas">
                    <label
                      htmlFor="ch_tomaFechas"
                      className="label cursor-pointer flex justify-start space-x-2">
                      <input
                        id="ch_tomaFechas"
                        type="checkbox"
                        className="checkbox checkbox-md"
                        defaultChecked={true}
                        onClick={(evt) => setTomaFechas(evt.target.checked)}
                      />
                      <span className="fa-regular fa-calendar block sm:hidden md:hidden lg:hidden xl:hidden text-neutral-600 dark:text-neutral-200"></span>
                      <span className="label-text font-bold hidden sm:block text-neutral-600 dark:text-neutral-200">
                        Toma Fechas
                      </span>
                    </label>
                  </div>
                  <div className="tooltip" data-tip="Tomar Facturas Canceladas">
                    <label
                      htmlFor="ch_tomaCanceladas"
                      className="label cursor-pointer flex justify-start space-x-2">
                      <input
                        id="ch_tomaCanceladas"
                        type="checkbox"
                        className="checkbox checkbox-md"
                        defaultChecked={false}
                        onClick={(evt) => setTomaCanceladas(evt.target.checked)}
                      />
                      <span className="fa-regular fa-file-lines block sm:hidden md:hidden lg:hidden xl:hidden text-neutral-600 dark:text-neutral-200"></span>
                      <span className="label-text font-bold hidden sm:block text-neutral-600 dark:text-neutral-200">
                        Toma Facturas Canceladas
                      </span>
                    </label>
                  </div>
                </div>
              
              <div className="flex md:flex-row lg:flex-row md:space-x-1 gap-3">
                <Inputs
                  name={"factura_ini"}
                  tamañolabel={""}
                  className={"rounded grow w-full md:w-1/2"}
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
                  className={"rounded grow w-full md:w-1/2"}
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
          </div>
        </div> 

    </>
    );
}

export default RelaciondeFacturas;