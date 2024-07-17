"use client"
import React from "react"
import { useRouter } from "next/navigation";
import { showSwal, confirmSwal } from "../utils/alerts";
import ModalComentarios from "./components/ModalComentarios";
import TablaComentarios from "./components/TablaComentarios";
import Busqueda from "./components/Busqueda";
import Acciones from "./components/Acciones";
import { useForm } from "react-hook-form";
import { getComentarios, guardaComentarios } from "../utils/api/comentarios/comentarios";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { siguiente } from "../utils/api/comentarios/comentarios";
import { eventNames } from "process";
import { NEXT_CACHE_REVALIDATE_TAG_TOKEN_HEADER } from "next/dist/lib/constants";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

function FormaComentarios(){
  const router = useRouter();
  const {data: session, status} = useSession();
  const [ formasComentarios, setFormasComentarios] = useState([]);
  const [ formaComentarios, setFormaComentarios ] = useState({});
  const [ formaComentariosFiltrados, setFormaComentariosFiltrados] = useState([]);
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
      const data = await getComentarios(token, bajas);
      setFormasComentarios(data);
      setFormaComentariosFiltrados(data);
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
      id: formaComentarios.id,
      comentario_1: formaComentarios.comentario_1,
      comentario_2: formaComentarios.comentario_2,
      comentario_3: formaComentarios.comentario_3,
      generales: formaComentarios.generales,
    },
  });
  useEffect(() => {
    reset({
      id: formaComentarios.id,
      comentario_1: formaComentarios.comentario_1,
      comentario_2: formaComentarios.comentario_2,
      comentario_3: formaComentarios.comentario_3,
      generales: formaComentarios.generales,
    });
  }, [formaComentarios, reset]);
  const Buscar = () => {
    // alert(filtro);
    console.log(TB_Busqueda, filtro);
    if (TB_Busqueda === "" || filtro === "") {
      setFormaComentariosFiltrados(formasComentarios);
      return;
    }
    const infoFiltrada = formasComentarios.filter((formacomentarios) => {
      const valorCampo = formacomentarios[filtro];
      if (typeof valorCampo === "number") {
        return valorCampo.toString().includes(TB_Busqueda);
      }
      return valorCampo
        ?.toString()
        .toLowerCase()
        .includes(TB_Busqueda.toLowerCase());
    });
    setFormaComentariosFiltrados(infoFiltrada);
  };
  const limpiarBusqueda = (evt) => {
    evt.preventDefault;
    setTB_Busqueda("");
  };

  const Alta = async (event) => {
    setCurrentId("");
    const { token } = session.user;
    reset({
      id: "",
      comentario_1: "",
      comentario_2: "",
      comentario_3: "",
      generales: "",
    });
    let siguienteId = await siguiente(token);
    siguienteId = Number(siguienteId) + 1;
    setCurrentId(siguienteId);
    setFormaComentarios({ id: siguienteId });
    setModal(!openModal);
    setAccion("Alta");
    showModal(true);

    document.getElementById("comentario_1").focus();
  };


  const Imprimir = () => {
    const doc = new jsPDF();
    const {name} = session.user;
    
    doc.setFontSize(14);
    doc.text("Sistema de Control Escolar", 14, 16);

    doc.setFontSize(10);
    doc.text("Reporte de Comentarios", 14, 22);

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
      { header: "Id", dataKey: "id" },
      { header: "Comentario 1", dataKey: "comentario_1" },
      { header: "Comentario 2", dataKey: "comentario_2" },
      { header: "Comentario 3", dataKey: "comentario_3" },
      { header: "Generales", dataKey: "generales" },
    ];

     // Agregar tabla
     doc.autoTable({
      startY: 40,
      head: [columns.map((col) => col.header)],
      body: formaComentariosFiltrados.map((row) =>
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

    doc.save("comentarios.pdf");

  }

  const exportToExcel = () => {
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
      ["","Sistema de Control de Escolar", "", "", "", "",`Fecha: ${dateStr}`],
      ["","Reporte de Comentarios", "", "", "", "", `Hora: ${timeStr}`],
      ["",`Usuario: ${name}`, "", "", "","", "Hoja: 1"],
      [],
    ];

    const columns = [
      { header: "Id", dataKey: "id" },
      { header: "Comentario 1", dataKey: "comentario_1", width: 50 },
      { header: "Comentario 2", dataKey: "comentario_2" },
      { header: "Comentario 3", dataKey: "comentario_3" },
      { header: "Generales", dataKey: "generales" },
    ];

    const data = formaComentariosFiltrados.map((row) => {
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
    XLSX.writeFile(workbook, "comentarios.xlsx");

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
        "Se eliminara el comentario seleccionado",
        "warning",
        "Aceptar",
        "Cancelar"
      );
      if (!confirmed) {
        showModal(true);
        return;
      }
    }
    res = await guardaComentarios(session.user.token, data, accion);
    if (res.status) {
      if (accion === "Alta") {
        const nuevaFormaComentarios = { currentID, ...data };
        setFormasComentarios([...formasComentarios, nuevaFormaComentarios]);
        if (!bajas) {
          setFormaComentariosFiltrados([...formaComentariosFiltrados, nuevaFormaComentarios]);
        }
      }
      if (accion === "Eliminar" || accion === "Editar") {
        const index = formasComentarios.findIndex((fp) => fp.id === data.id);
        if (index !== -1) {
          if (accion === "Eliminar") {
            const fpFiltrados = formasComentarios.filter((fp) => fp.id !== data.id);
            setFormasComentarios(fpFiltrados);
            setFormaComentariosFiltrados(fpFiltrados);
          } else {
            if (bajas) {
              const fpFiltrados = formasComentarios.filter((fp) => fp.id !== data.id);
              setFormasComentarios(fpFiltrados);
              setFormaComentariosFiltrados(fpFiltrados);
            } else {
              const fpActualizadas = formasComentarios.map((fp) =>
                fp.id === currentID ? { ...fp, ...data } : fp
              );
              setFormasComentarios(fpActualizadas);
              setFormaComentariosFiltrados(fpActualizadas);
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
    console.log(event.target.value);
  };

  if (status === "loading") {
    return (
      <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  return (
    <>
      <ModalComentarios
        accion={accion}
        onSubmit={onSubmitModal}
        currentID={currentID}
        errors={errors}
        register={register}
        setFormaComentarios={setFormaComentarios}
        formaComentarios={formaComentarios}
      />
      <div className="container  w-full  max-w-screen-xl bg-slate-100 shadow-xl rounded-xl px-3 ">
        <div className="flex justify-start p-3 ">
          <h1 className="text-4xl font-xthin text-black md:px-12">
            Forma de Comentarios.
          </h1>
        </div>
        <div className="container grid grid-cols-8 grid-rows-1 h-[calc(100%-20%)] ">
          <div className="col-span-1 flex flex-col ">
            <Acciones Buscar={Buscar} Alta={Alta} Imprimir={Imprimir} excel={exportToExcel} home={home}></Acciones>
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
                setTB_Busqueda={setTB_Busqueda}
              />
              <TablaComentarios
                isLoading={isLoading}
                formaComentariosFiltrados={formaComentariosFiltrados}
                showModal={showModal}
                setFormaComentarios={setFormaComentarios}
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

export default FormaComentarios;