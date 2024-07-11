"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { showSwal, confirmSwal } from "../utils/alerts";
import ModalCajero from "@/app/cajeros/components/modalCajeros";
import TablaCajeros from "@/app/cajeros/components/tablaCajeros";
import Busqueda from "@/app/cajeros/components/Busqueda";
import Acciones from "@/app/cajeros/components/Acciones";
import { useForm } from "react-hook-form";
import {
  getCajeros,
  guardaCajero,
} from "@/app/utils/api/cajeros/cajeros";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { siguiente } from "@/app/utils/api/cajeros/cajeros";
import { eventNames } from "process";
import { NEXT_CACHE_REVALIDATE_TAG_TOKEN_HEADER } from "next/dist/lib/constants";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import ModalCajeros from "@/app/cajeros/components/modalCajeros";

function Cajeros() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [cajeros, setCajeros] = useState([]);  //formasPago
  const [cajero, setCajero] = useState({});    //formaPago
  const [cajerosFiltrados, setCajerosFiltrados] = useState([]);
  const [bajas, setBajas] = useState(false);
  const [openModal, setModal] = useState(false);
  const [accion, setAccion] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [currentID, setCurrentId] = useState("");
  const [filtro, setFiltro] = useState("");
  const [TB_Busqueda, setTB_Busqueda] = useState("");

  useEffect(() => {
    if (status === "loading" || !session) {
      return;
    }
    const fetchData = async () => {
      setisLoading(true);
      const { token } = session.user;
      const data = await getCajeros(token, bajas);
      setCajeros(data);
      setCajerosFiltrados(data);
      if (filtro !== "" && TB_Busqueda !== "") {
        Buscar();
      }
      setisLoading(false);
    };
    fetchData();
  }, [session, status, bajas]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      numero: cajero.numero,
      nombre: cajero.nombre,
      direccion: cajero.direccion,
      colonia: cajero.colonia,
      telefono: cajero.telefono,
      estado: cajero.estado,
      fax: cajero.fax,
      mail: cajero.mail,
      clave_cajero: cajero.clave_cajero,
    },
  });
  useEffect(() => {
    reset({
      numero: cajero.numero,
      nombre: cajero.nombre,
      direccion: cajero.direccion,
      colonia: cajero.colonia,
      telefono: cajero.telefono,
      estado: cajero.estado,
      fax: cajero.fax,
      mail: cajero.mail,
      clave_cajero: cajero.clave_cajero,
    });
  }, [cajero, reset]);
  const Buscar = () => {
    // alert(filtro);
    console.log(TB_Busqueda, filtro);
    if (TB_Busqueda === "" || filtro === "") {
      setCajerosFiltrados(cajeros);
      return;
    }
    const infoFiltrada = cajeros.filter((cajero) => {
      const valorCampo = cajero[filtro];
      if (typeof valorCampo === "number") {
        return valorCampo.toString().includes(TB_Busqueda);
      }
      return valorCampo
        ?.toString()
        .toLowerCase()
        .includes(TB_Busqueda.toLowerCase());
    });
    setCajerosFiltrados(infoFiltrada);
  };

  const limpiarBusqueda = (evt) => {
    evt.preventDefault;
    setTB_Busqueda("");
  };

  const Alta = async (event) => {
    setCurrentId("");
    const { token } = session.user;
    reset({
      numero: "",
      nombre: "",
      direccion: "",
      colonia: "",
      telefono: "",
      mail: "",
    });
    let siguienteId = await siguiente(token);
    siguienteId = Number(siguienteId) + 1;
    setCurrentId(siguienteId);
    setCajero({ numero: siguienteId });
    setModal(!openModal);
    setAccion("Alta");
    showModal(true);

    document.getElementById("nombre").focus();
  };

  const imprimir = () => {
    const doc = new jsPDF();
    const { name } = session.user;

    doc.setFontSize(14);
    doc.text("Sistema de Control de Escolar", 14, 16);

    doc.setFontSize(10);
    doc.text("Reporte Datos de Cajero", 14, 22);

    doc.setFontSize(10);
    doc.text(`Usuario: ${name}`, 14, 28);

    const date = new Date();
    const dateStr = `${date.getFullYear()}/${(
      "0" +
      (date.getMonth() + 1)
    ).slice(-2)}/${("0" + date.getDate()).slice(-2)}`;
    const timeStr = `${("0" + date.getHours()).slice(-2)}:${(
      "0" + date.getMinutes()
    ).slice(-2)}:${("0" + date.getSeconds()).slice(-2)}`;
    doc.text(`Fecha: ${dateStr}`, 150, 16);
    doc.text(`Hora: ${timeStr}`, 150, 22);
    doc.text(`Hoja: 1`, 150, 28);

    const columns = [
      { header: "Número", dataKey: "numero" },
      { header: "Nombre", dataKey: "nombre" },
      //{ header: "Clave_Cajero", dataKey: "clave_cajero" },
      { header: "Dirección", dataKey: "direccion" },
      { header: "Colonia", dataKey: "colonia" },
      //{ header: "Fax", dataKey: "fax" },
      { header: "Teléfono", dataKey: "telefono" },
      { header: "Mail", dataKey: "mail" },
      //{ header: "Estado", dataKey: "estado" },
    ];

    // Agregar tabla
    doc.autoTable({
      startY: 40,
      head: [columns.map((col) => col.header)],
      body: cajerosFiltrados.map((row) =>
        columns.map((col) => row[col.dataKey] || "")
      ),
      styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
      headStyles: { fillColor: [230, 230, 230], textColor: [0, 0, 0] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      theme: "plain",
      margin: { top: 40 },
      columnStyles: {
        0: { halign: "right" },
      },
    });

    // Agregar número de página al pie de página
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      const pageText = `Página ${i} de ${pageCount}`;
      const textWidth = doc.getTextWidth(pageText);
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      doc.text(pageText, pageWidth - textWidth - 10, pageHeight - 10);
    }

    doc.save("cajeros.pdf");
  };

  const excel = () => {
    const { name } = session.user;
    const date = new Date();
    const dateStr = `${date.getFullYear()}/${(
      "0" +
      (date.getMonth() + 1)
    ).slice(-2)}/${("0" + date.getDate()).slice(-2)}`;
    const timeStr = `${("0" + date.getHours()).slice(-2)}:${(
      "0" + date.getMinutes()
    ).slice(-2)}:${("0" + date.getSeconds()).slice(-2)}`;

    const headerInfo = [
      ["Sistema de Control de Escolar", "", "", "", `Fecha: ${dateStr}`],
      ["Reporte Datos de Cajero", "", "", "", `Hora: ${timeStr}`],
      [`Usuario: ${name}`, "", "", "", "Hoja: 1"],
      [],
    ];

    const columns = [
      { header: "Número", dataKey: "numero" },
      { header: "Nombre", dataKey: "nombre" },
      { header: "Dirección", dataKey: "direccion" },
      { header: "Colonia", dataKey: "colonia" },
      { header: "Teléfono", dataKey: "telefono" },
      { header: "Mail", dataKey: "mail" },
    ];

    const data = cajerosFiltrados.map((row) => {
      let rowData = {};
      columns.forEach((col) => {
        rowData[col.header] = row[col.dataKey] || "";
      });
      return rowData;
    });

    const worksheetData = headerInfo.concat(
      XLSX.utils.sheet_to_json(XLSX.utils.json_to_sheet(data), { header: 1 })
    );
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cajeros");
    XLSX.writeFile(workbook, "cajeros.xlsx");
  };


  const onSubmitModal = handleSubmit(async (data) => {
    event.preventDefault;
    const dataj = JSON.stringify(data);
    data.id = currentID;
    let res = null;
    if (accion === "Eliminar") {
      showModal(false);
      const confirmed = await confirmSwal(
        "¿Desea Continuar?",
        "Se eliminara el cajero seleccionado",
        "warning",
        "Aceptar",
        "Cancelar"
      );
      if (!confirmed) {
        showModal(true);
        return;
      }
      // showModal(true);
    }
    res = await guardaCajero(session.user.token, data, accion);
    // console.log(res.status + " " + res);
    if (res.status) {
      if (accion === "Alta") {
        const nuevaCajero = { currentID, ...data };
        setCajeros([...cajeros, nuevaCajero]);
        if (!bajas) {
          setCajerosFiltrados([...cajerosFiltrados, nuevaCajero]);
        }
      }
      if (accion === "Eliminar" || accion === "Editar") {
        const index = cajeros.findIndex((c) => c.numero === data.numero);
        if (index !== -1) {
          if (accion === "Eliminar") {
            const cFiltrados = cajeros.filter((c) => c.numero !== data.numero);
            setCajeros(cFiltrados);
            setCajerosFiltrados(cFiltrados);
          } else {
            if (bajas) {
              const cFiltrados = cajeros.filter((c) => c.numero !== data.numero);
              setCajeros(cFiltrados);
              setCajerosFiltrados(cFiltrados);
            } else {
              const cActualizadas = cajeros.map((c) =>
                c.numero === currentID ? { ...c, ...data } : c
              );
              setCajeros(cActualizadas);
              setCajerosFiltrados(cActualizadas);
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
    setTB_Busqueda(event.target.value);
  };
  if (status === "loading") {
    return (
      <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  return (
    <>
      <ModalCajeros
        accion={accion}
        onSubmit={onSubmitModal}
        currentID={currentID}
        errors={errors}
        register={register}
        setCajero={setCajero}
        cajero={cajero}
      />
      <div className="container  w-full  max-w-screen-xl bg-slate-100 shadow-xl rounded-xl px-3 ">
        <div className="flex justify-start p-3 ">
          <h1 className="text-4xl font-xthin text-black md:px-12">
            Cajeros.
          </h1>
        </div>
        <div className="container grid grid-cols-8 grid-rows-1 h-[calc(100%-20%)] ">
          <div className="col-span-1 flex flex-col ">
            <Acciones Buscar={Buscar} Alta={Alta} home={home} imprimir={imprimir} excel={excel}></Acciones>
          </div>
          <div className="col-span-7  ">
            <div className="flex flex-col h-[calc(100%)]">
              <Busqueda
                setBajas={setBajas}
                setFiltro={setFiltro}
                limpiarBusqueda={limpiarBusqueda}
                Buscar={Buscar}
                handleBusquedaChange={handleBusquedaChange}
                TB_Busqueda={TB_Busqueda}
              />
              <TablaCajeros
                isLoading={isLoading}
                cajerosFiltrados={cajerosFiltrados}
                showModal={showModal}
                setCajero={setCajero}
                setAccion={setAccion}
                setCurrentId={setCurrentId}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Cajeros;
