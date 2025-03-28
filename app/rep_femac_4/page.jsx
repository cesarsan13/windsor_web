"use client";
import { React } from "react";
import { useRouter } from "next/navigation";
import Acciones from "@/app/rep_femac_4/components/Acciones";
import Inputs from "@/app/rep_femac_4/components/Inputs";
import { formatFecha, permissionsComponents } from "@/app/utils/globalfn";
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
  const [credencial, setCredencial] = useState(null);
  const [fecha_hoy, setFechaHoy] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfData, setPdfData] = useState("");
  const [animateLoading, setAnimateLoading] = useState(false);
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const formData = new FormData();
      formData.append("numero", alumno.numero || "");
      const { token, permissions } = session.user;
      const es_admin = session.user.es_admin;
      if (alumno && Object.keys(alumno).length > 0) {
        const data = await getCredencialAlumno(token, formData);
        setCredencial(data);
        let imagenUrl = null;
        if (alumno.ruta_foto && alumno.ruta_foto.trim() !== "") {
          imagenUrl = await getFotoAlumno(session.user.token, alumno.ruta_foto);
        }
        const base64Image = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(imagenUrl);
        });
        setCapturedImage(base64Image);
      }
      const menu_seleccionado = Number(localStorage.getItem("puntoMenu"));
      const permisos = permissionsComponents(
        es_admin,
        permissions,
        session.user.id,
        menu_seleccionado
      );
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
      const formato = await getCredencialFormato(token, 3);
      setFormato(formato);
    };
    if (status === "loading" || !session) {
      return;
    }
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const {
    register,
    reset,
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
      telefono1: credencial?.alumno.telefono1 || "",
      telefono2: credencial?.alumno.telefono2 || "",
      cp: credencial?.alumno?.cp || "",
      fecha_nac: formatFecha(
        credencial?.alumno?.fecha_nac || formatFecha(fecha_hoy)
      ),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [credencial, reset]);

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
      const configuracion = {
        body: credencial,
        formato: formato,
      };
      const conX = 0.4;
      const conY = 0.4;
      const reporte = new ReportePDF(configuracion, "landscape");
      let doc = reporte.getDoc();
      const match = capturedImage.match(/^data:image\/([a-zA-Z0-9]+);base64,/);
      const valorMatch = match ? match[1] : null;
      if (
        capturedImage &&
        typeof capturedImage === "string" 
        &&
        capturedImage.startsWith(`data:image/${valorMatch};base64,`)
      ) {
        doc.addImage(capturedImage, valorMatch, 10, 10, 80, 80);
      }
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
      <div className="container skeleton w-full  max-w-screen-xl  shadow-xl rounded-xl "></div>
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
        <div className="w-full py-1">
          <div className="flex flex-col justify-start p-2 max-[600px]:p-0">
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

        <div className=" overflow-y-auto w-full py-3 flex flex-col gap-y-2 mb-2 ">
          <div className=" max-[600px]:w-full max-[768px]:w-full max-[972px]:w-3/4 min-[1300px]:w-1/3 min-[1920px]:w-1/4 w-1/2 mx-auto">
            <div className="col-span-3 md:col-span-full lg:col-span-full">
              <div className="w-full max-[400px]:w-1/2 max-[600px]:w-full max-[768px]:w-full h-1/3">
                {capturedImage && (
                  
                  <div className="flex items-center">
                    <div className="w-1/3 pl-1 p-0">
                      <Image
                        src={capturedImage.startsWith("data:image") ? capturedImage : ""}
                        alt="Imagen del alumno"
                        width={30}
                        height={30}
                        className="w-full object-contain mx-auto my-1 pr-4"
                      />
                    </div>
                    <div className="w-1/3">
                      <h2 className="text-center text-xl mb-2 text-black dark:text-white">
                          Foto del Alumno:
                      </h2>
                    </div>
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
