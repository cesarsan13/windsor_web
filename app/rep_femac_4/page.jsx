"use client";
import { React, useRef } from "react";
import { useRouter } from "next/navigation";
import Acciones from "@/app/rep_femac_4/components/Acciones";
import Inputs from "@/app/rep_femac_4/components/Inputs";
import {
  calculaDigitoBvba,
  formatFecha,
  format_Fecha_String,
  permissionsComponents
} from "@/app/utils/globalfn";
import { useForm } from "react-hook-form";
import {
  getCredencialFormato,
  getFotoAlumno,
  getCredencialAlumno,
  Imprimir,
} from "@/app/utils/api/rep_femac_4/rep_femac_4";
import BuscarCat from "@/app/components/BuscarCat";
import VistaPrevia from "@/app/rep_femac_4/components/VistaPrevia";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { showSwal } from "@/app/utils/alerts";
import "jspdf-autotable";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { ReportePDF } from "@/app/utils/ReportesPDF";
import Image from "next/image";

function Rep_femac_4() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formato, setFormato] = useState([]);
  const [alumno, setAlumno] = useState({});
  const [telefonos, setTelefonos] = useState("");
  const [credencial, setCredencial] = useState(null);
  const [fecha_hoy, setFechaHoy] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const inputfileref = useRef(null);
  const [files, setFile] = useState(null);
  const [condicion, setcondicion] = useState(false);

  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const [animateLoading, setAnimateLoading] = useState(false);

  const [permissions, setPermissions] = useState({});

  const fetchFacturasFormato = async (id) => {
    const { token } = session.user;
    const facturas = await getCredencialFormato(token, id);
    setLabels(facturas);
  };
  useEffect(() => {
    const fetchData = async () => {
      const formData = new FormData();
      formData.append("numero", alumno.numero || "");
      const { token,permissions } = session.user;
      const es_admin = session.user.es_admin;
      if (alumno && Object.keys(alumno).length > 0) {
        const data = await getCredencialAlumno(token, formData);
        // console.log("Credencial del alumno => ",data);
        setCredencial(data);
        const imagenUrl = await getFotoAlumno(
          session.user.token,
          alumno.ruta_foto
        );
        if (imagenUrl) {
          setCapturedImage(imagenUrl);
        }
      }
      const permisos = permissionsComponents(es_admin, permissions, session.user.id, 1);
      setPermissions(permisos);
    };
    if (status === "loading" || !session) {
      return;
    }
    fetchData();
  }, [alumno, session, status]);
  useEffect(() => {
    let fecha_hoy = new Date();
    const fechaFormateada = fecha_hoy.toISOString().split("T")[0];
    setFechaHoy(fechaFormateada);
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const { token } = session.user;
      const formato = await getCredencialFormato(token, 3);
      // console.log("formato => ",formato);
      setFormato(formato);
    };
    if (status === "loading" || !session) {
      return;
    }
    fetchData();
  }, [session, status]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      cancha_1: credencial?.cancha_1 || "",
      cancha_2: credencial?.cancha_2 || "",
      cancha_3: credencial?.cancha_3 || "",
      cancha_4: credencial?.cancha_4 || "",
      horario_1: credencial?.horario_1 || "",
      horario_2: credencial?.horario_2 || "",
      horario_3: credencial?.horario_3 || "",
      horario_4: credencial?.horario_4 || "",
      ciclo_escolar: credencial?.alumno.ciclo_escolar || "",
      direccion: credencial?.alumno.direccion || "",
      colonia: credencial?.alumno.colonia || "",
      // telefono:credencial?.alumno?.telefono1 || ""+" "+credencial?.alumno?.telefono2 || "",
      telefono1: credencial?.alumno.telefono1 || "",
      telefono2: credencial?.alumno.telefono2 || "",
      cp: credencial?.alumno?.cp || "",
      fecha_nac: formatFecha(
        credencial?.alumno?.fecha_nac || formatFecha(fecha_hoy)
      ),
    },
  });
  useEffect(() => {
    reset({
      cancha_1: credencial?.cancha_1 || "",
      cancha_2: credencial?.cancha_2 || "",
      cancha_3: credencial?.cancha_3 || "",
      cancha_4: credencial?.cancha_4 || "",
      horario_1: credencial?.horario_1 || "",
      horario_2: credencial?.horario_2 || "",
      horario_3: credencial?.horario_3 || "",
      horario_4: credencial?.horario_4 || "",
      ciclo_escolar: credencial?.alumno.ciclo_escolar || "",
      direccion: credencial?.alumno.direccion || "",
      colonia: credencial?.alumno.colonia || "",
      // telefono:credencial?.alumno?.telefono1 || ""+" "+credencial?.alumno?.telefono2 || "",
      telefono1: credencial?.alumno.telefono1 || "",
      telefono2: credencial?.alumno.telefono2 || "",
      cp: credencial?.alumno?.cp || "",
      fecha_nac: formatFecha(
        credencial?.alumno?.fecha_nac || formatFecha(fecha_hoy)
      ),
    });
  }, [credencial, reset]);

  const ImprimeExcel = async () => {
    alumnosFiltrados = await formaImprime();
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Reporte Altas Bajas de Alumnos por Periodo",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: alumnosFiltrados,
      columns: [
        { header: "No.", dataKey: "numero" },
        { header: "Nombre", dataKey: "nombre_completo" },
        { header: "Dia", dataKey: "dia" },
        { header: "Mes", dataKey: "mes" },
        { header: "Año", dataKey: "año" },
      ],
      nombre: "Reporte Altas Bajas Alumnos por Periodo",
    };
    ImprimirExcel(configuracion);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFile(selectedFile);
        setcondicion(true);
        setCapturedImage(reader.result); // La imagen en formato Base64
      };
      reader.readAsDataURL(selectedFile); // Convierte el archivo a Base64
    }
  };
  const openFileSelector = () => {
    if (inputfileref.current) {
      inputfileref.current.click(); // Simula el clic en el input
    }
  };
  const home = () => {
    router.push("/");
  };

  const handleVerClick = async () => {
    setAnimateLoading(true);
    cerrarModalVista();

    if (credencial === null || credencial === undefined) {
      showSwal(
        "Oppss!",
        "Para imprimir, debes seleccionar un alumno primero",
        "error"
      );
      setTimeout(() => {
        setPdfPreview(false);
        setPdfData("");
        setAnimateLoading(false);
        document.getElementById("modalVRep4").close();
      }, 500);
    } else {
      // const imagenUrl = await getFotoAlumno(session.user.token, credencial.alumno.ruta_foto);

      const configuracion = {
        Encabezado: {
          Nombre_Aplicacion: "Sistema de Control Escolas",
          Nombre_Reporte: "Credencial del Alumno",
          Nombre_Usuario: `Usuario: ${session.user.name}`,
        },
        body: credencial,
        formato: formato,
      };
      const conX = 0.4;
      const conY = 0.4;
      const reporte = new ReportePDF(configuracion, "landscape");
      let doc = reporte.getDoc();
      doc.addImage(capturedImage, "PNG", 10, 10, 80, 80);
      formato.forEach((formato) => {
        switch (formato.descripcion_campo) {
          case "No. Alumno":
            reporte.ImpPosX(
              credencial.alumno.numero.toString(),
              formato.columna_impresion * conX,
              formato.renglon_impresion * conY,
              0,
              "R"
            );
            break;
          case "Ciclo escolar":
            reporte.ImpPosX(
              credencial.alumno.ciclo_escolar.toString(),
              formato.columna_impresion * conX,
              formato.renglon_impresion * conY,
              0,
              "L"
            );
            break;
          case "Fecha nacimiento":
            reporte.ImpPosX(
              credencial.alumno.fecha_nac.toString(),
              formato.columna_impresion * conX,
              formato.renglon_impresion * conY,
              0,
              "L"
            );
            break;
          case "Nombre":
            reporte.ImpPosX(
              credencial.alumno.nombre.toString(),
              formato.columna_impresion * conX,
              formato.renglon_impresion * conY,
              0,
              "L"
            );
            break;
          case "Dirección":
            reporte.ImpPosX(
              credencial.alumno.direccion.toString(),
              formato.columna_impresion * conX,
              formato.renglon_impresion * conY,
              0,
              "L"
            );
            break;
          case "Colonia":
            reporte.ImpPosX(
              credencial.alumno.colonia.toString(),
              formato.columna_impresion * conX,
              formato.renglon_impresion * conY,
              0,
              "L"
            );
            break;
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
  const imprimePDF = () => {
    const configuracion = {
      Encabezado: {
        Nombre_Aplicacion: "Sistema de Control Escolar",
        Nombre_Reporte: "Credencial del Alumno",
        Nombre_Usuario: `Usuario: ${session.user.name}`,
      },
      body: credencial,
      formato: formato,
      imagen: capturedImage,
    };
    Imprimir(configuracion);
  };

  const showModalVista = (show) => {
    show
      ? document.getElementById("modalVRep4").showModal()
      : document.getElementById("modalVRep4").close();
  };
  const cerrarModalVista = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVRep4").close();
  };
  const CerrarView = () => {
    setPdfPreview(false);
    setPdfData("");
    document.getElementById("modalVRep4").close();
  };

  if (status === "loading") {
    return (
      <div className="container skeleton    w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
    );
  }
  return (
    <>
      <VistaPrevia
        id={"modalVRep4"}
        titulo={"Vista Previa de Credencial del Alumno"}
        pdfPreview={pdfPreview}
        pdfData={pdfData}
        PDF={imprimePDF}
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
                Credencial del Alumno
              </h1>
            </div>
          </div>
        </div>

        {/* Fila del formulario de la pagina */}
        <div className="w-full py-3 flex flex-col gap-y-2">
          <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 min-[1300px]:w-1/3 min-[1920px]:w-1/4 w-1/2 mx-auto ">
            <div className="col-span-full md:col-span-full lg:col-span-full">
              {/* <div className="w-full"> */}
              <div className="w-2/6 max-[600px]:w-full max-[768px]:w-full">
                <input
                  type="file"
                  name="imagen"
                  onChange={handleFileChange}
                  ref={inputfileref}
                  style={{ display: "none" }}
                  className="ml-4 btn hover:bg-transparent border-none shadow-md bg-transparent hover:bg-slate-200 dark:hover:bg-neutral-700 text-black dark:text-white font-bold px-4 rounded"
                />
                {(capturedImage || files) && (
                  <div className="bottom-0 left-0 w-full">
                    <h2 className="text-center text-xl mb-2">
                      {condicion ? "Imagen Seleccionada:" : "Foto del Alumno:"}
                    </h2>
                    <Image
                      src={
                        condicion ? URL.createObjectURL(files) : capturedImage
                      }
                      alt="Imagen"
                      width={80}
                      height={80}
                      className="w-full object-contain mx-auto my-4"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 min-[1300px]:w-1/3 min-[1920px]:w-1/4 w-1/2 mx-auto ">
            <div className="col-span-full md:col-span-full lg:col-span-full">
              <div className="w-full">
                <BuscarCat
                  table="alumnos"
                  itemData={[]}
                  fieldsToShow={["numero", "nombre_completo"]}
                  nameInput={["numero", "nombre_completo"]}
                  titulo={"Alumno: "}
                  setItem={setAlumno}
                  token={session.user.token}
                  modalId="modal_alumnos1"
                  inputWidths={{ first: "100px", second: "300px" }}
                  descClassName="md:mt-0 w-full"
                  contClassName="flex flex-row md:flex-row justify-start gap-2 sm:flex-row w-full"
                />
              </div>
            </div>
          </div>
          <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 min-[1300px]:w-1/3 min-[1920px]:w-1/4 w-1/2 mx-auto ">
            <div className="col-span-full md:col-span-full lg:col-span-full">
              <div className="w-full">
                <div className="flex items-center">
                  <div>
                    <Inputs
                      name={"cancha_1"}
                      tamañolabel={""}
                      className={"rounded grow w-full md:w-full"}
                      Titulo={"Cancha 1"}
                      type={"text"}
                      errors={errors}
                      requerido={false}
                      register={register}
                      maxLength={15}
                      dataType={"int"}
                      isDisabled={false}
                      // setValue={setFacturaIni}
                      style={{ with: "100px" }}
                    />
                  </div>
                  <div>
                    <Inputs
                      name={"horario_1"}
                      tamañolabel={""}
                      requerido={false}
                      className={"md:mt-0 w-full"}
                      Titulo={"Horario 1"}
                      type={"text"}
                      errors={errors}
                      register={register}
                      maxLength={15}
                      dataType={"string"}
                      isDisabled={false}
                      // setValue={setFacturaFin}
                      style={{ with: "300px" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 min-[1300px]:w-1/3 min-[1920px]:w-1/4 w-1/2 mx-auto ">
            <div className="col-span-full md:col-span-full lg:col-span-full">
              <div className="w-full">
                <div className="flex items-center">
                  <div>
                    <Inputs
                      name={"cancha_2"}
                      tamañolabel={""}
                      className={"rounded grow w-full md:w-full"}
                      Titulo={"Cancha 2"}
                      requerido={false}
                      type={"text"}
                      errors={errors}
                      register={register}
                      maxLength={15}
                      dataType={"int"}
                      isDisabled={false}
                      // setValue={setFacturaIni}
                      style={{ with: "100px" }}
                    />
                  </div>
                  <div>
                    <Inputs
                      name={"horario_2"}
                      tamañolabel={""}
                      className={"md:mt-0 w-full"}
                      Titulo={"Horario 2"}
                      requerido={false}
                      type={"text"}
                      errors={errors}
                      register={register}
                      maxLength={15}
                      dataType={"string"}
                      isDisabled={false}
                      // setValue={setFacturaFin}
                      style={{ with: "300px" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 min-[1300px]:w-1/3 min-[1920px]:w-1/4 w-1/2 mx-auto ">
            <div className="col-span-full md:col-span-full lg:col-span-full">
              <div className="w-full">
                <div className="flex items-center">
                  <div>
                    <Inputs
                      name={"cancha_3"}
                      tamañolabel={""}
                      className={"rounded grow w-full md:w-full"}
                      Titulo={"Cancha 3"}
                      type={"text"}
                      errors={errors}
                      requerido={false}
                      register={register}
                      maxLength={15}
                      dataType={"int"}
                      isDisabled={false}
                      // setValue={setFacturaIni}
                      style={{ with: "100px" }}
                    />
                  </div>
                  <div>
                    <Inputs
                      name={"horario_3"}
                      tamañolabel={""}
                      className={"md:mt-0 w-full"}
                      Titulo={"Horario 3"}
                      type={"text"}
                      requerido={false}
                      errors={errors}
                      register={register}
                      maxLength={15}
                      dataType={"string"}
                      isDisabled={false}
                      // setValue={setFacturaFin}
                      style={{ with: "300px" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 min-[1300px]:w-1/3 min-[1920px]:w-1/4 w-1/2 mx-auto ">
            <div className="col-span-full md:col-span-full lg:col-span-full">
              <div className="w-full">
                <div className="flex items-center">
                  <div>
                    <Inputs
                      name={"cancha_4"}
                      tamañolabel={""}
                      className={"rounded grow w-full md:w-full"}
                      Titulo={"Cancha 4"}
                      type={"text"}
                      requerido={false}
                      errors={errors}
                      register={register}
                      maxLength={15}
                      dataType={"int"}
                      isDisabled={false}
                      // setValue={setFacturaIni}
                      style={{ with: "100px" }}
                    />
                  </div>
                  <div>
                    <Inputs
                      name={"horario_4"}
                      tamañolabel={""}
                      className={"md:mt-0 w-full"}
                      Titulo={"Horario 4"}
                      requerido={false}
                      dataType={"string"}
                      type={"text"}
                      errors={errors}
                      register={register}
                      maxLength={15}
                      isDisabled={false}
                      // setValue={setFacturaFin}
                      style={{ with: "300px" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 min-[1300px]:w-1/3 min-[1920px]:w-1/4 w-1/2 mx-auto ">
            <div className="col-span-full md:col-span-full lg:col-span-full">
              <div className="w-full">
                <div className="flex items-center">
                  <div>
                    <Inputs
                      name={"ciclo_escolar"}
                      tamañolabel={""}
                      className={"rounded grow w-full md:w-full"}
                      Titulo={"Ciclo escolar:"}
                      dataType={"string"}
                      type={"text"}
                      requerido={false}
                      errors={errors}
                      register={register}
                      maxLength={15}
                      isDisabled={false}
                      // setValue={setFacturaIni}
                      style={{ with: "100px" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 min-[1300px]:w-1/3 min-[1920px]:w-1/4 w-1/2 mx-auto ">
            <div className="col-span-full md:col-span-full lg:col-span-full">
              <div className="w-full">
                <div className="">
                  <div>
                    <Inputs
                      name={"direccion"}
                      tamañolabel={""}
                      className={"rounded grow w-full md:w-full"}
                      Titulo={"Direccion:"}
                      requerido={false}
                      dataType={"string"}
                      type={"text"}
                      errors={errors}
                      register={register}
                      maxLength={15}
                      isDisabled={false}
                      // setValue={setFacturaIni}
                      style={{ with: "100px" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 min-[1300px]:w-1/3 min-[1920px]:w-1/4 w-1/2 mx-auto ">
            <div className="col-span-full md:col-span-full lg:col-span-full">
              <div className="w-full">
                <div className="">
                  <div>
                    <Inputs
                      name={"colonia"}
                      tamañolabel={""}
                      className={"rounded grow w-full md:w-full"}
                      Titulo={"Colonia:"}
                      requerido={false}
                      dataType={"string"}
                      type={"text"}
                      errors={errors}
                      register={register}
                      maxLength={15}
                      isDisabled={false}
                      // setValue={setFacturaIni}
                      style={{ with: "100px" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 min-[1300px]:w-1/3 min-[1920px]:w-1/4 w-1/2 mx-auto ">
            <div className="col-span-full md:col-span-full lg:col-span-full">
              <div className="w-full">
                <div className="">
                  <div>
                    <Inputs
                      name={"telefono1"}
                      tamañolabel={""}
                      className={"rounded grow w-full md:w-full"}
                      Titulo={"Telefono 1"}
                      requerido={false}
                      dataType={"string"}
                      type={"text"}
                      errors={errors}
                      register={register}
                      maxLength={15}
                      isDisabled={false}
                      // setValue={setFacturaIni}
                      style={{ with: "100px" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 min-[1300px]:w-1/3 min-[1920px]:w-1/4 w-1/2 mx-auto ">
            <div className="col-span-full md:col-span-full lg:col-span-full">
              <div className="w-full">
                <div className="">
                  <div>
                    <Inputs
                      name={"telefono2"}
                      tamañolabel={""}
                      className={"rounded grow w-full md:w-full"}
                      Titulo={"Telefono 2"}
                      requerido={false}
                      dataType={"string"}
                      type={"text"}
                      errors={errors}
                      register={register}
                      maxLength={15}
                      isDisabled={false}
                      // setValue={setFacturaIni}
                      style={{ with: "100px" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 min-[1300px]:w-1/3 min-[1920px]:w-1/4 w-1/2 mx-auto ">
            <div className="col-span-full md:col-span-full lg:col-span-full">
              <div className="w-full">
                <div className="">
                  <div>
                    <Inputs
                      name={"cp"}
                      tamañolabel={""}
                      className={"rounded grow w-full md:w-full"}
                      Titulo={"C.P."}
                      requerido={false}
                      dataType={"string"}
                      type={"text"}
                      errors={errors}
                      register={register}
                      maxLength={15}
                      isDisabled={false}
                      // setValue={setFacturaIni}
                      style={{ with: "100px" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 min-[1300px]:w-1/3 min-[1920px]:w-1/4 w-1/2 mx-auto ">
            <div className="flex flex-row max-[499px]:gap-1 gap-4">
              <div className="lg:w-fit md:w-fit">
                <Inputs
                  name={"fecha_nac"}
                  tamañolabel={""}
                  // className={"rounded block grow"}
                  Titulo={"Fecha Nac."}
                  dataType={"string"}
                  type={"date"}
                  requerido={false}
                  errors={errors}
                  register={register}
                  maxLength={15}
                  isDisabled={false}
                  setValue={setFechaHoy}
                  onChange={(e) => setFechaHoy(e.target.value)}
                  className="rounded block grow text-black max-[500px]:w-[100px] w-auto dark:text-white border-b-2 border-slate-300 dark:border-slate-700 "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Rep_femac_4;
