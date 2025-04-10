"use client";
import React from "react";
import { useState } from "react";
import {
  calculaDigitoBvba,
  permissionsComponents,
  formatNumber,
} from "@/app/utils/globalfn";
import BuscarCat from "@/app/components/BuscarCat";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Acciones from "@/app/rep_femac_12_anexo_4/components/Acciones";
import {
  getDetallePedido,
  getTrabRepCob,
  ImprimirExcel,
  ImprimirPDF,
  insertTrabRepCobr,
} from "@/app/utils/api/rep_femac_12_anexo_4/rep_femac_12_anexo";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import "@react-pdf-viewer/core/lib/styles/index.css";
import VistaPrevia from "@/app/components/VistaPrevia";
import { useEffect } from "react";
import { showSwal } from "@/app/utils/alerts";
import ModalFechas from "@/app/components/modalFechas";

function RepFemac12Anexo() {
  const date = new Date();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [producto1, setProducto1] = useState({});
  //const [producto2, setProducto2] = useState({});
  const [sOrdenar, ssetordenar] = useState("nombre");
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [animateLoading, setAnimateLoading] = useState(false);
  const [permissions, setPermissions] = useState({});
  //Modal Fechas
  const [fecha1, setFecha1] = useState("");
  const [fecha2, setFecha2] = useState("");
  const [tempFechaIni, setTempFechaIni] = useState("");
  const [tempFechaFin, setTempFechaFin] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAllProductos, setSelectedAllProductos] = useState(false);

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
    if (status === "loading" || !session) {
      return;
    }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    setFecha1(getPrimerDiaDelMes());
    setFecha2(getUltimoDiaDelMes());
  }, []);

  if (status === "loading") {
    return (
      <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  const handleCheckChange = (event) => {
    event.preventDefault;
    ssetordenar(event.target.value);
  };
  const home = () => {
    router.push("/");
  };
  const ImprimePDF = () => {
    setisLoading(true);
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Cobranza por Producto",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
    };
    const { token } = session.user;

    ImprimirPDF(
      configuracion,
      token,
      selectedAllProductos,
      fecha1,
      fecha2,
      producto1.numero,
      //producto2.numero,
      sOrdenar
    );
    setisLoading(false);
  };
  const ImprimeExcel = () => {
    setisLoading(true);
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Cobranza por Producto",
        Nombre_Usuario: `${session.user.name}`,
      },
      columns: [
        { header: "Producto", dataKey: "articulo" },
        { header: "Descripcion", dataKey: "descripcion" },
        { header: "", dataKey: "" },
        { header: "", dataKey: "" },
      ],
      columns2: [
        { header: "Alumno", dataKey: "alumno" },
        { header: "Nombre", dataKey: "nombre" },
        { header: "Importe", dataKey: "importe" },
        { header: "Fecha Pago", dataKey: "fecha" },
      ],
      nombre: "Reporte de Cobranza por Producto",
    };
    const { token } = session.user;

    ImprimirExcel(
      configuracion,
      token,
      selectedAllProductos,
      fecha1,
      fecha2,
      producto1.numero,
      //producto2.numero,
      sOrdenar
    );
    setisLoading(false);
  };

  const handleVerClick = async () => {
    try {
      setisLoading(true);
      setAnimateLoading(true);
      cerrarModalVista();
      if (producto1.numero === undefined && selectedAllProductos === false) { //producto2.numero === undefined &&
        showSwal(
          "Oppss!",
          "Para imprimir, debes de seleccionar los productos.",
          "error"
        );
        setTimeout(() => {
          setPdfPreview(false);
          setPdfData("");
          setAnimateLoading(false);
          document.getElementById("modalVPRepFemac12Anexo4").close();
        }, 500);
      } else {
        const configuracion = {
          Encabezado: {
            Nombre_Aplicacion: "Sistema de Control Escolar",
            Nombre_Reporte: "Reporte de Cobranza por Producto",
            Nombre_Usuario: `Usuario: ${session.user.name}`,
          },
        };
        const { token } = session.user;
        const reporte = new ReportePDF(configuracion);
        const Enca1 = (doc) => {
          if (!doc.tiene_encabezado) {
            doc.imprimeEncabezadoPrincipalV();
            doc.nextRow(12);
            doc.ImpPosX("Producto", 24, doc.tw_ren, 0, "R");
            doc.ImpPosX("Descripcion", 43, doc.tw_ren, 0, "L");
            doc.nextRow(4);
            doc.ImpPosX("Alumno", 24, doc.tw_ren, 0, "R");
            doc.ImpPosX("Nombre", 38, doc.tw_ren, 0, "L");
            doc.ImpPosX("Importe", 138, doc.tw_ren, 0, "R");
            doc.ImpPosX("Fecha Pago", 168, doc.tw_ren, 0, "L");
            doc.nextRow(4);
            doc.printLineV();
            doc.nextRow(4);
            doc.tiene_encabezado = true;
          } else {
            doc.nextRow(6);
            doc.tiene_encabezado = true;
          }
        };
        const Cambia_Articulo = (doc, Total_Art) => {
          doc.ImpPosX("TOTAL: ", 95, doc.tw_ren, 0, "L");
          doc.ImpPosX(formatNumber(Total_Art), 138, doc.tw_ren, 0, "R");
          doc.nextRow(4);
        };
        Enca1(reporte);

        let articulo = 0;
        let artFin = 0;

          articulo = producto1.numero === undefined ? "0" : producto1.numero;
          //artFin = producto2.numero === undefined ? "0" : producto2.numero;

        const data = await getDetallePedido(
          token,
          selectedAllProductos,
          fecha1,
          fecha2,
          articulo,
          //artFin
        );
        let alu_Ant;
        let alumno;
        await Promise.all(
          data.map(async (dato) => {
            if (alu_Ant !== dato.alumno) {
              alumno = dato.nombre;
            }
            const importe =
              dato.cantidad * dato.precio_unitario -
              dato.cantidad * dato.precio_unitario * (dato.descuento / 100);
            const datos = {
              recibo: dato.recibo,
              fecha: dato.fecha,
              articulo: dato.articulo,
              documento: dato.documento,
              alumno: dato.alumno,
              nombre: alumno,
              importe: importe,
            };
            await insertTrabRepCobr(token, datos);
            alu_Ant = dato.alumno;
          })
        );
        const dataTrabRepCobr = await getTrabRepCob(token, sOrdenar);
        let Art_Ant = "";
        let tot_art = 0;
        let total_general = 0;
        dataTrabRepCobr.forEach((trabRep) => {
          if (trabRep.articulo !== Art_Ant && Art_Ant !== "") {
            Cambia_Articulo(reporte, tot_art);
            tot_art = 0;
          }
          if (trabRep.articulo !== Art_Ant) {
            reporte.ImpPosX(
              (trabRep.articulo ?? "").toString(),
              24,
              reporte.tw_ren,
              0,
              "R"
            );
            reporte.ImpPosX(
              (trabRep.descripcion ?? "").toString(),
              43,
              reporte.tw_ren,
              0,
              "L"
            );
            Enca1(reporte);
            if (reporte.tw_ren >= reporte.tw_endRen) {
              reporte.pageBreak();
              Enca1(reporte);
            }
          }
          reporte.ImpPosX(
            (trabRep.alumno ?? "").toString() +
              "-" +
              calculaDigitoBvba((trabRep.alumno ?? "").toString()),
            24,
            reporte.tw_ren,
            0,
            "R"
          );
          reporte.ImpPosX(
            (trabRep.nombre ?? "").toString(),
            38,
            reporte.tw_ren,
            0,
            "L"
          );
          reporte.ImpPosX(
            formatNumber(trabRep.importe ?? 0),
            138,
            reporte.tw_ren,
            0,
            "R"
          );
          reporte.ImpPosX(
            (trabRep.fecha ?? "").toString(),
            168,
            reporte.tw_ren,
            0,
            "L"
          );
          Enca1(reporte);
          if (reporte.tw_ren >= reporte.tw_endRen) {
            reporte.pageBreak();
            Enca1(reporte);
          }
          tot_art = tot_art + trabRep.importe;
          total_general = total_general + trabRep.importe;
          Art_Ant = trabRep.articulo;
        });
        Cambia_Articulo(reporte, tot_art);
        reporte.ImpPosX("TOTAL GENERAL: ", 95, reporte.tw_ren, 0, "L");
        reporte.ImpPosX(
          formatNumber(total_general),
          145,
          reporte.tw_ren,
          0,
          "R"
        );
        setTimeout(() => {
          const pdfData = reporte.doc.output("datauristring");
          setPdfData(pdfData);
          setPdfPreview(true);
          showModalVista(true);
          setAnimateLoading(false);
        }, 500);
      }
    } catch (e) {}
  };

  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVPRepFemac12Anexo4").showModal()
      : document.getElementById("modalVPRepFemac12Anexo4").close();
  };

  const cerrarModalVista = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVPRepFemac12Anexo4").close();
  };

  const CerrarView = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVPRepFemac12Anexo4").close();
  };

  const handleCloseModal = () => setModalOpen(false);
  const handleSelectDates = () => {
    setFecha1(tempFechaIni);
    setFecha2(tempFechaFin);
    setModalOpen(false);
  };
  const handleOpenModal = () => {
    setTempFechaIni(fecha1);
    setTempFechaFin(fecha2);
    setModalOpen(true);
  };

  return (
    <>
      <VistaPrevia
        id={"modalVPRepFemac12Anexo4"}
        titulo={"Vista Previa de Cobranza por Productos"}
        pdfPreview={pdfPreview}
        pdfData={pdfData}
        PDF={ImprimePDF}
        Excel={ImprimeExcel}
        CerrarView={CerrarView}
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
                Reporte de Cobranza por Productos
              </h1>
            </div>
          </div>
        </div>
        <div className="w-full py-3 flex flex-col gap-y-4">
          {/* Fila del formulario de la pagina */}
          <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 min-[1300px]:w-1/3 min-[1920px]:w-1/4 w-1/2 mx-auto space-y-4">
            <div className="flex flex-row w-full">
              <div className="max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 min-[1920px]:w-1/4 w-1/2 pl-4">
                <div className="flex items-center justify-start gap-4">
                  <input
                    type="date"
                    value={fecha1}
                    onChange={(e) => setFecha1(e.target.value)}
                    className="border p-2 rounded"
                  />
                  <button
                    onClick={handleOpenModal}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    📅
                  </button>
                  <input
                    type="date"
                    value={fecha2}
                    onChange={(e) => setFecha2(e.target.value)}
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
            </div>
          </div>
          <div className="flex flex-row">
            <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 min-[1300px]:w-1/3 min-[1920px]:w-1/4 w-1/2 mx-auto ">
              <div className="col-span-full md:col-span-full lg:col-span-full">
                <div className="w-full p-1 pl-4">
                  <BuscarCat
                    deshabilitado={selectedAllProductos === true}
                    table={"productos"}
                    nameInput={["producto1", "producto_desc1"]}
                    fieldsToShow={["numero", "descripcion"]}
                    titulo={"Producto Inicial: "}
                    setItem={setProducto1}
                    token={session.user.token}
                    modalId={"modal_producto1"}
                    inputWidths={{ first: "109px", second: "300px" }}
                    descClassName="md:mt-0 w-full"
                  />
                </div>
              </div>
              {/*<div className="col-span-full md:col-span-full lg:col-span-full">
                <div className="w-full p-1 pl-4">
                  <BuscarCat
                    deshabilitado={selectedAllProductos === true}
                    table={"productos"}
                    nameInput={["producto2", "producto_desc2"]}
                    fieldsToShow={["numero", "descripcion"]}
                    titulo={"Producto Final: "}
                    setItem={setProducto2}
                    token={session.user.token}
                    modalId={"modal_producto2"}
                    inputWidths={{ first: "109px", second: "300px" }}
                    descClassName="md:mt-0 w-full"
                  />
                </div>
              </div> */}
              <div className="flex flex-row max-[499px]:gap-1 gap-4">
                <div className="lg:w-fit md:w-fit">
                  <label
                    className={` input-md text-black dark:text-white flex items-center gap-3`}
                  >
                    <span className="text-black dark:text-white">
                      Ordenar por:
                    </span>
                    <label
                      className={` input-md text-black dark:text-white flex items-center gap-3`}
                      onChange={(event) => handleCheckChange(event)}
                    >
                      <span className="text-black dark:text-white">Nombre</span>
                      <input
                        type="radio"
                        name="ordenar"
                        value="nombre"
                        checked={sOrdenar === "nombre"}
                        className="radio checked:text-neutral-600 dark:text-neutral-200"
                      />
                    </label>
                    <label
                      className={` input-md text-black dark:text-white flex items-center gap-3`}
                      onChange={(event) => handleCheckChange(event)}
                    >
                      <span className="text-black dark:text-white">Número</span>
                      <input
                        type="radio"
                        name="ordenar"
                        value="id"
                        checked={sOrdenar === "id"}
                        className="radio checked:text-neutral-600 dark:text-neutral-200"
                      />
                    </label>
                  </label>
                </div>
              </div>
              <div className="flex flex-row max-[499px]:gap-1 gap-4">
                <div className="lg:w-fit md:w-fit pl-4">
                  <div className="tooltip" data-tip="Toma todos los Productos">
                    <label
                      htmlFor="ch_SelectedAllProductos"
                      className="label cursor-pointer flex justify-start space-x-2"
                    >
                      <input
                        id="ch_selectedAllProductos"
                        type="checkbox"
                        className="checkbox checkbox-md"
                        defaultChecked={false}
                        onClick={(evt) => setSelectedAllProductos(evt.target.checked)}
                      />
                      <span className="label-text font-bold md:block hidden text-neutral-600 dark:text-neutral-200">
                        Toma todos los Productos
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RepFemac12Anexo;
