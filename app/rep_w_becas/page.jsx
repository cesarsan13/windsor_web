"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Acciones from "@/app/rep_w_becas/components/Acciones";
import {
  ImprimirPDF,
  ImprimirExcel,
  getBecas,
} from "@/app/utils/api/rep_w_becas/rep_w_becas";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import "jspdf-autotable";
import BuscarCat from "@/app/components/BuscarCat";
import VistaPrevia from "@/app/components/VistaPrevia";
import { showSwal } from "@/app/utils/alerts";
import { permissionsComponents } from "@/app/utils/globalfn";

function RepBecas() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sOrdenar, ssetordenar] = useState("nombre");
  const [formaBecas, setFormaBecas] = useState([]);
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const [isLoading, setisLoading] = useState(false);
  //guarda el valor
  const [horario1, setHorario1] = useState({});
  const [horario2, setHorario2] = useState({});
  const [animateLoading, setAnimateLoading] = useState(false);
  const [permissions, setPermissions] = useState({});
  const [selectedAllAlumnos, setSelectedAllAlumnos] = useState(false);

  useEffect(() => {
    if (status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {
      setisLoading(true);
      const { token } = session.user;
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
      const data = await getBecas(token, horario1, horario2, sOrdenar, selectedAllAlumnos);
      setFormaBecas(data.data);
      setisLoading(false);
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, horario1, horario2, sOrdenar, selectedAllAlumnos]);
  const home = () => {
    router.push("/");
  };
  const CerrarView = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVPRepWBecas").close();
  };

  const ImprimePDF = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Becas",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: formaBecas,
    };
    ImprimirPDF(configuracion);
  };
  const ImprimeExcel = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte de Becas",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: formaBecas,
      columns: [
        { header: "No.", dataKey: "numero" },
        { header: "Nombre", dataKey: "alumno" },
        { header: "Grado", dataKey: "grado" },
        { header: "Beca", dataKey: "colegiatura" },
        { header: "Colegiatura", dataKey: "descuento" },
        { header: "Descuento", dataKey: "costo_final" },
      ],
      nombre: "ReporteBecas",
    };
    ImprimirExcel(configuracion);
  };
  const handleCheckChange = (event) => {
    ssetordenar(event.target.value);
  };

  const handleVerClick = () => {
    setAnimateLoading(true);
    if (horario1.numero === undefined && horario2.numero == undefined && selectedAllAlumnos === false) {
      showSwal(
        "Oppss!",
        "Para imprimir, mínimo debe estar seleccionado un Alumno",
        "error"
      );
      setAnimateLoading(false);
    } else {
      const configuracion = {
        Encabezado: {
          Nombre_Aplicacion: "Sistema de Control Escolar",
          Nombre_Reporte: "Reporte de Becas",
          Nombre_Usuario: `Usuario: ${session.user.name}`,
        },
        body: formaBecas,
      };
      const reporte = new ReportePDF(configuracion, "Landscape");
      const { body } = configuracion;
      const Enca1 = (doc) => {
        if (!doc.tiene_encabezado) {
          doc.imprimeEncabezadoPrincipalH();
          doc.nextRow(12);
          doc.ImpPosX("No.", 15, doc.tw_ren),
            doc.ImpPosX("Nombre", 25, doc.tw_ren),
            doc.ImpPosX("Grado", 115, doc.tw_ren),
            doc.ImpPosX("Colegiatura", 160, doc.tw_ren),
            doc.ImpPosX("Descuento", 190, doc.tw_ren),
            doc.ImpPosX("Saldo", 210, doc.tw_ren),
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
      body.forEach((reporte1) => {
        reporte.ImpPosX(reporte1.numero.toString(), 15, reporte.tw_ren);
        reporte.ImpPosX(reporte1.alumno.toString(), 25, reporte.tw_ren);
        reporte.ImpPosX(
          reporte1.grado === null ? "" : reporte1.grado.toString(),
          115,
          reporte.tw_ren
        );
        reporte.ImpPosX(
          reporte1.colegiatura.toString(),
          160,
          reporte.tw_ren
        );
        reporte.ImpPosX(
          reporte1.descuento.toString(),
          190,
          reporte.tw_ren
        );
        reporte.ImpPosX(reporte1.costo_final.toString(), 210, reporte.tw_ren);
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
    }
  };
  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVPRepWBecas").showModal()
      : document.getElementById("modalVPRepWBecas").close();
  };

  if (status === "loading") {
    return (
      <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  return (
    <>
      <VistaPrevia
        id={"modalVPRepWBecas"}
        titulo={"Vista Previa de Reporte de Becas"}
        pdfPreview={pdfPreview}
        pdfData={pdfData}
        PDF={ImprimePDF}
        Excel={ImprimeExcel}
        CerrarView={CerrarView}
      />

      <div className="flex flex-col justify-start items-start bg-base-200 shadow-xl rounded-xl dark:bg-slate-700 h-full max-[420px]:w-full w-11/12">
        <div className="w-full py-3">
          <div className="flex flex-col justify-start p-3 max-[600px]:p-0">
            <div className="flex flex-wrap items-start md:items-center mx-auto">
              <div className="order-2 md:order-1 flex justify-between w-full md:w-auto mb-0">
                <Acciones
                  Ver={handleVerClick}
                  ImprimePDF={ImprimePDF}
                  ImprimeExcel={ImprimeExcel}
                  home={home}
                  isLoading={animateLoading}
                  permiso_imprime={permissions.impresion}
                  CerrarView={CerrarView}
                ></Acciones>
              </div>
              <h1 className="order-1 md:order-2 text-4xl font-xthin text-black dark:text-white mb-5 md:mb-0 mx-5">
                Reporte de Becas.
              </h1>
            </div>
          </div>
        </div>
        <div className="w-full py-3 flex flex-col gap-y-4">
          <div className="max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 min-[1300px]:w-1/3 min-[1920px]:w-1/4 w-1/2 mx-auto ">
            <div className="flex flex-col max-[499px]:gap-1 gap-4">
              <div className="lg:w-fit md:w-fit">
                <BuscarCat
                  deshabilitado={selectedAllAlumnos === true}
                  table="alumnos"
                  token={session.user.token}
                  nameInput={["numero", "nombre"]}
                  fieldsToShow={["numero", "nombre"]}
                  setItem={setHorario1}
                  modalId="modal_horarios"
                  titulo={"Alumno 1"}
                />
              </div>
              <div className="">
                <BuscarCat
                  deshabilitado={selectedAllAlumnos === true}
                  table="alumnos"
                  token={session.user.token}
                  nameInput={["numero_2", "nombre_2"]}
                  fieldsToShow={["numero", "nombre"]}
                  setItem={setHorario2}
                  modalId="modal_horarios2"
                  titulo={"Alumno 2"}
                />
              </div>
                <div className="lg:w-fit md:w-fit">
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
                        onClick={(evt) => setSelectedAllAlumnos(evt.target.checked)}
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
    </>
  );
}

export default RepBecas;
