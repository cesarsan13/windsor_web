import { soloEnteros, soloDecimales, pone_ceros } from "@/app/utils/globalfn";
import { showSwal, confirmSwal } from "@/app/utils/alerts";
import { useState, useEffect, useRef } from "react";
import Inputs from "@/app/alumnos/components/Inputs";
import Webcam from "react-webcam";
import Image from "next/image";
import BuscarCat from "@/app/components/BuscarCat";

function ModalAlumnos({
  session,
  accion,
  onSubmit,
  currentID,
  register,
  errors,
  setAlumno,
  alumno,
  formatNumber,
  capturedImage,
  setCapturedImage,
  condicion,
  setcondicion,
  setGrado,
  setGrado2,
  setcond1,
  setcond2,
}) {
  const [error, setError] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [activeTab, setActiveTab] = useState(1);
  const columnasBuscaCat = ["numero", "horario"];
  const nameInputs = ["horario_1", "horario_1_nombre"];
  const nameInputs2 = ["horario_2", "horario_2_nombre"];
  const columnasBuscaCat1 = ["id", "descripcion"];
  const nameInputs3 = ["cond_1", "cond_1_nombre"];
  const nameInputs4 = ["cond_2", "cond_2_nombre"];
  const webcamRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
  };

  const capture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setcondicion(true);
    }
  };

  useEffect(() => {
    if (accion === "Eliminar" || accion === "Ver") {
      setIsDisabled(true);
    }
    if (accion === "Alta" || accion === "Editar") {
      setIsDisabled(false);
    }
    setTitulo(
      accion === "Alta"
        ? `Nuevo Alumno: ${currentID}`
        : accion === "Editar"
        ? `Editar Alumno: ${currentID}`
        : accion === "Eliminar"
        ? `Eliminar Alumno: ${currentID}`
        : `Ver Alumno: ${currentID}`
    );
  }, [accion, currentID]);
  const handleBlur = (evt, datatype) => {
    if (evt.target.value === "") return;
    datatype === "int"
      ? setAlumno((alumno) => ({
          ...alumno,
          [evt.target.name]: pone_ceros(evt.target.value, 0, true),
        }))
      : setAlumno((alumno) => ({
          ...alumno,
          [evt.target.name]: pone_ceros(evt.target.value, 2, true),
        }));
  };
  const handleTabs = (num) => {
    setActiveTab(num);
  };

  return (
    <dialog id="my_modal_3" className="modal">
      <div className="modal-box w-full max-w-3xl h-full">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 dark:text-white text-black"
          onClick={() => document.getElementById("my_modal_3").close()}
        >
          ✕
        </button>
        <form onSubmit={onSubmit} encType="multipart/form-data">
          <h3 className="font-bold text-lg mb-5 dark:text-white text-black">
            {titulo}
          </h3>
          <fieldset id="fs_alumnos">
            <div role="tablist" class="tabs tabs-lifted">
              <input
                type="radio"
                name="my_tabs"
                role="tab"
                className="tab "
                aria-label="Alumno"
                checked={activeTab === 1}
                onChange={() => handleTabs(1)}
              />
              <div
                role="tabpanel"
                className={`tab-content p-6 rounded-box ${
                  activeTab === 1 ? "tab-active " : ""
                }`}
              >
                <div className="flex flex-wrap -mx-3 mb-6 px-3">
                  <Inputs
                    dataType={"int"}
                    name={"id"}
                    tamañolabel={""}
                    className={"rounded block grow text-right"}
                    Titulo={"Numero: "}
                    type={"text"}
                    requerido={true}
                    errors={errors}
                    register={register}
                    message={"id Requerido"}
                    isDisabled={!isDisabled}
                    handleBlur={handleBlur}
                  />

                  <Inputs
                    dataType={"string"}
                    name={"a_paterno"}
                    tamañolabel={""}
                    className={"grow"}
                    Titulo={"Apellido paterno: "}
                    type={"text"}
                    requerido={true}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Apellido paterno requerido"}
                    maxLenght={50}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />
                  <Inputs
                    dataType={"string"}
                    name={"a_materno"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"Apellido materno: "}
                    type={"text"}
                    requerido={true}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Apellido materno requerido"}
                    maxLenght={50}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />
                  <Inputs
                    dataType={"string"}
                    name={"nombre"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"Nombre: "}
                    type={"text"}
                    requerido={true}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Nombre requerido"}
                    maxLenght={50}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />

                  <Inputs
                    dataType={"string"}
                    name={"estatus"}
                    tamañolabel={""}
                    className={"fyo8m-select p-1.5 grow bg-[#ffffff] "}
                    Titulo={"Estatus: "}
                    type={"select"}
                    requerido={true}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Estatus requerido"}
                    maxLenght={25}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                    arreglos={[
                      { id: "Activo", descripcion: "Activo" },
                      { id: "Cartera", descripcion: "Cartera" },
                      { id: "Enfermo", descripcion: "Enfermo" },
                      { id: "Permiso", descripcion: "Permiso" },
                      { id: "Baja", descripcion: "Baja" },
                    ]}
                  />

                  <Inputs
                    dataType={"string"}
                    name={"fecha_nac"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"Fecha nacimiento: "}
                    type={"date"}
                    requerido={true}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Fecha nacimiento requerido"}
                    maxLenght={15}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />

                  <Inputs
                    dataType={"string"}
                    name={"fecha_inscripcion"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"Fecha inscripción: "}
                    type={"date"}
                    requerido={true}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Fecha inscripción requerido"}
                    maxLenght={15}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />

                  <Inputs
                    dataType={"string"}
                    name={"fecha_baja"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"Fecha baja: "}
                    type={"date"}
                    requerido={false}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Fecha baja requerido"}
                    maxLenght={15}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />

                  <Inputs
                    dataType={"string"}
                    name={"sexo"}
                    tamañolabel={""}
                    className={"fyo8m-select p-1.5 grow bg-[#ffffff] "}
                    Titulo={"Sexo: "}
                    type={"select"}
                    requerido={true}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Sexo requerido"}
                    maxLenght={15}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                    arreglos={[
                      { id: "Hombre", descripcion: "Hombre" },
                      { id: "Femenino", descripcion: "Femenino" },
                      { id: "Otro", descripcion: "Otro" },
                    ]}
                  />

                  <Inputs
                    dataType={"string"}
                    name={"escuela"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"Escuela: "}
                    type={"text"}
                    requerido={true}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Escuela requerido"}
                    maxLenght={50}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />

                  <Inputs
                    dataType={"string"}
                    name={"telefono_1"}
                    tamañolabel={""}
                    className={"rounded block grow text-left"}
                    Titulo={"Tels: "}
                    type={"text"}
                    requerido={true}
                    isNumero={true}
                    errors={errors}
                    register={register}
                    message={"Telefono requerido"}
                    maxLenght={15}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />

                  <Inputs
                    dataType={"string"}
                    name={"telefono_2"}
                    tamañolabel={""}
                    className={"rounded block grow text-left"}
                    Titulo={"Tel (opcional)"}
                    type={"text"}
                    requerido={false}
                    isNumero={true}
                    errors={errors}
                    register={register}
                    message={"Telefono requerido"}
                    maxLenght={15}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />
                  <Inputs
                    dataType={"string"}
                    name={"celular"}
                    tamañolabel={""}
                    className={"rounded block grow text-left"}
                    Titulo={"Celular: "}
                    type={"text"}
                    requerido={true}
                    isNumero={true}
                    errors={errors}
                    register={register}
                    message={"Celular requerido"}
                    maxLenght={15}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />
                  <Inputs
                    dataType={"string"}
                    name={"codigo_barras"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"Codigo barras: "}
                    type={"text"}
                    requerido={false}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Codigo barras requerido"}
                    maxLenght={255}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />
                  <Inputs
                    dataType={"int"}
                    name={"referencia"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"Referencia: "}
                    type={"text"}
                    requerido={false}
                    isNumero={true}
                    errors={errors}
                    register={register}
                    message={"Referencia requerido"}
                    maxLenght={20}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />
                </div>
              </div>
              <input
                type="radio"
                name="my_tabs"
                role="tab"
                className="tab"
                aria-label="Generales"
                checked={activeTab === 2}
                onChange={() => handleTabs(2)}
              />
              <div
                role="tabpanel"
                className={`tab-content p-6 rounded-box ${
                  activeTab === 2 ? "tab-active " : ""
                }`}
              >
                <div className="flex flex-wrap -mx-3 mb-6">
                  <Inputs
                    dataType={"string"}
                    name={"direccion"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"Direccion: "}
                    type={"text"}
                    requerido={true}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Direccion requerida"}
                    maxLenght={255}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />

                  <Inputs
                    dataType={"string"}
                    name={"colonia"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"Colonia: "}
                    type={"text"}
                    requerido={true}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Colonia requerido"}
                    maxLenght={100}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />
                  <Inputs
                    dataType={"string"}
                    name={"ciudad"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"Ciudad: "}
                    type={"text"}
                    requerido={true}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Ciudad requerida"}
                    maxLenght={100}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />
                  <Inputs
                    dataType={"string"}
                    name={"estado"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"Estado: "}
                    type={"text"}
                    requerido={true}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Estado requerida"}
                    maxLenght={100}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />
                  <Inputs
                    dataType={"string"}
                    name={"cp"}
                    tamañolabel={""}
                    className={"rounded block grow text-left"}
                    Titulo={"CP: "}
                    type={"text"}
                    requerido={true}
                    isNumero={true}
                    errors={errors}
                    register={register}
                    message={"Codigo postal requerida"}
                    maxLenght={10}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />
                  <Inputs
                    dataType={"string"}
                    name={"email"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"Email: "}
                    type={"email"}
                    requerido={true}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Email requerido"}
                    maxLenght={255}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />
                </div>
              </div>

              <input
                type="radio"
                name="my_tabs"
                role="tab"
                className="tab"
                aria-label="Foto"
                checked={activeTab === 3}
                onChange={() => handleTabs(3)}
              />
              <div
                role="tabpanel"
                className={`tab-content p-6 rounded-box ${
                  activeTab === 3 ? "tab-active " : ""
                }`}
              >
                <div>
                  {isCameraOn && (
                    <>
                      <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="w-full object-contain mx-auto my-4"
                        videoConstraints={{ facingMode: "user" }}
                        mirrored={false}
                      />
                    </>
                  )}
                  <div className="bottom-0 left-0 w-full flex justify-center mb-4">
                    <button
                      type="button"
                      onClick={toggleCamera}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 rounded"
                    >
                      {isCameraOn ? "Apagar cámara" : "Encender cámara"}
                    </button>
                    <button
                      type="button"
                      onClick={capture}
                      disabled={!isCameraOn}
                      className="ml-4 bg-green-500 hover:bg-green-700 text-white font-bold px-4 rounded"
                    >
                      Capturar Foto
                    </button>
                  </div>
                  {capturedImage && (
                    <div className="bottom-0 left-0 w-full">
                      <h2 className="text-center text-xl mb-2">
                        Foto Capturada:
                      </h2>
                      <Image
                        src={condicion ? capturedImage : capturedImage}
                        alt="Captured"
                        width={80}
                        height={80}
                        className="w-full object-contain mx-auto my-4"
                      />
                    </div>
                  )}
                </div>
              </div>

              <input
                type="radio"
                name="my_tabs"
                role="tab"
                className="tab"
                aria-label="Grado"
                checked={activeTab === 4}
                onChange={() => handleTabs(4)}
              />
              <div
                role="tabpanel"
                className={`tab-content p-6 rounded-box ${
                  activeTab === 4 ? "tab-active " : ""
                }`}
              >
                <div className="flex flex-wrap -mx-3 mb-6">
                  <BuscarCat
                    table="horarios"
                    itemData={alumno}
                    fieldsToShow={columnasBuscaCat}
                    nameInput={nameInputs}
                    titulo={"Grado: "}
                    setItem={setGrado}
                    token={session.user.token}
                    modalId="modal_horarios"
                    array={alumno.horario_1}
                    alignRight={true}
                    inputWidths={{ first: "100px", second: "200px" }}
                  />
                  {/* <BuscarCat
                                        table="horarios"
                                        itemData={alumno}
                                        fieldsToShow={columnasBuscaCat}
                                        nameInput={nameInputs2}
                                        titulo={"Grado: "}
                                        setItem={setGrado2}
                                        token={session.user.token}
                                        modalId="modal_horarios2"
                                        array={alumno.horario_2}
                                    /> */}
                </div>
              </div>

              <input
                type="radio"
                name="my_tabs"
                role="tab"
                className="tab"
                aria-label="Pago"
                checked={activeTab === 5}
                onChange={() => handleTabs(5)}
              />
              <div
                role="tabpanel"
                className={`tab-content p-6 rounded-box ${
                  activeTab === 5 ? "tab-active " : ""
                }`}
              >
                <div className="flex flex-wrap -mx-3 mb-6">
                  <Inputs
                    dataType={"string"}
                    name={"ciclo_escolar"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"Ciclo escolar: "}
                    type={"text"}
                    requerido={false}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Ciclo escolar requerido"}
                    maxLenght={50}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />
                  <Inputs
                    dataType={"double"}
                    name={"descuento"}
                    tamañolabel={""}
                    className={"rounded block grow text-right"}
                    Titulo={"Descuento: "}
                    type={"text"}
                    requerido={false}
                    isNumero={true}
                    errors={errors}
                    register={register}
                    message={"Descuento requerido"}
                    maxLenght={12}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />
                  <BuscarCat
                    table="formaPago"
                    fieldsToShow={columnasBuscaCat1}
                    nameInput={nameInputs3}
                    setItem={setcond1}
                    token={session.user.token}
                    modalId="modal_formaPago1"
                    array={alumno.cond_1}
                    titulo="Forma pago: "
                    alignRight={true}
                    inputWidths={{ first: "100px", second: "380px" }}
                  />
                  <BuscarCat
                    table={"formaPago"}
                    fieldsToShow={columnasBuscaCat1}
                    nameInput={nameInputs4}
                    setItem={setcond2}
                    token={session.user.token}
                    modalId="modal_formaPago2"
                    array={alumno.cond_2}
                    titulo={"Forma pago: "}
                    alignRight={true}
                    inputWidths={{ first: "100px", second: "380px" }}
                  />
                  {/* <Inputs
                                        dataType={"string"}
                                        name={"cond_1"}
                                        tamañolabel={""}
                                        className={"form-select p-1.5 grow bg-[#1d232a] "}
                                        Titulo={"Pago: "}
                                        type={"select"}
                                        requerido={true}
                                        isNumero={false}
                                        errors={errors}
                                        register={register}
                                        message={"Pago 1 requerido"}
                                        maxLenght={50}
                                        isDisabled={isDisabled}
                                        handleBlur={handleBlur}
                                        arreglos={[
                                            { label: "PENDIENTE", value: "PENDIENTE" },
                                        ]}
                                    />
                                    <Inputs
                                        dataType={"string"}
                                        name={"cond_2"}
                                        tamañolabel={""}
                                        className={"form-select p-1.5 grow bg-[#1d232a] "}
                                        Titulo={"Pago: "}
                                        type={"select"}
                                        requerido={true}
                                        isNumero={false}
                                        errors={errors}
                                        register={register}
                                        message={"Pago 2 requerido"}
                                        maxLenght={50}
                                        isDisabled={isDisabled}
                                        handleBlur={handleBlur}
                                        arreglos={[
                                            { label: "PENDIENTE", value: "PENDIENTE" },
                                        ]}
                                    /> */}
                </div>
              </div>

              <input
                type="radio"
                name="my_tabs"
                role="tab"
                className="tab"
                aria-label="Medicos"
                checked={activeTab === 6}
                onChange={() => handleTabs(6)}
              />
              <div
                role="tabpanel"
                className={`tab-content p-6 rounded-box ${
                  activeTab === 6 ? "tab-active " : ""
                }`}
              >
                <div className="flex flex-wrap -mx-3 mb-6">
                  <Inputs
                    dataType={"string"}
                    name={"nom_pediatra"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"Pediatra: "}
                    type={"text"}
                    requerido={false}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Pediatra requerido"}
                    maxLenght={50}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />
                  <Inputs
                    dataType={"string"}
                    name={"tel_p_1"}
                    tamañolabel={""}
                    className={"rounded block grow text-left"}
                    Titulo={"Tel del pediatra: "}
                    type={"text"}
                    requerido={false}
                    isNumero={true}
                    errors={errors}
                    register={register}
                    message={"Telefono del pediatra requerido"}
                    maxLenght={15}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />
                  <Inputs
                    dataType={"string"}
                    name={"tel_p_2"}
                    tamañolabel={""}
                    className={"rounded block grow text-left"}
                    Titulo={"Tel (opcional)"}
                    type={"text"}
                    requerido={false}
                    isNumero={true}
                    errors={errors}
                    register={register}
                    message={"Pediatra requerido"}
                    maxLenght={15}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />
                  <Inputs
                    dataType={"string"}
                    name={"cel_p_1"}
                    tamañolabel={""}
                    className={"rounded block grow text-left"}
                    Titulo={"Celular del pediatra: "}
                    type={"text"}
                    requerido={false}
                    isNumero={true}
                    errors={errors}
                    register={register}
                    message={"Celular del pediatra requerido"}
                    maxLenght={15}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />
                  <Inputs
                    dataType={"string"}
                    name={"tipo_sangre"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"Tipo de sangre: "}
                    type={"text"}
                    requerido={false}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Tipo sangre requerido"}
                    maxLenght={20}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />
                  <Inputs
                    dataType={"string"}
                    name={"alergia"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"Alergia: "}
                    type={"text"}
                    requerido={false}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Alergia requerido"}
                    maxLenght={50}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />
                  <Inputs
                    dataType={"string"}
                    name={"aseguradora"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"Aseguradora: "}
                    type={"text"}
                    requerido={false}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Aseguradora requerido"}
                    maxLenght={100}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />
                  <Inputs
                    dataType={"string"}
                    name={"poliza"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"Poliza: "}
                    type={"text"}
                    requerido={false}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Poliza requerido"}
                    maxLenght={50}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />
                  <Inputs
                    dataType={"string"}
                    name={"tel_ase_1"}
                    tamañolabel={""}
                    className={"rounded block grow text-left"}
                    Titulo={"Tels de la aseguradora: "}
                    type={"text"}
                    requerido={false}
                    isNumero={true}
                    errors={errors}
                    register={register}
                    message={"Telefono de la aseguradora requerido"}
                    maxLenght={15}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />
                  <Inputs
                    dataType={"string"}
                    name={"tel_ase_2"}
                    tamañolabel={""}
                    className={"rounded block grow text-left"}
                    Titulo={"Tel (opcional)"}
                    type={"text"}
                    requerido={false}
                    isNumero={true}
                    errors={errors}
                    register={register}
                    message={"Telefonos de la aseguradora requerido"}
                    maxLenght={15}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />
                </div>
              </div>

              <input
                type="radio"
                name="my_tabs"
                role="tab"
                className="tab"
                aria-label="Facturas"
                checked={activeTab === 7}
                onChange={() => handleTabs(7)}
              />
              <div
                role="tabpanel"
                className={`tab-content p-6 rounded-box ${
                  activeTab === 7 ? "tab-active " : ""
                }`}
              >
                <div className="flex flex-wrap -mx-3 mb-6">
                  <Inputs
                    dataType={"string"}
                    name={"razon_social"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"Razon social: "}
                    type={"text"}
                    requerido={false}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Razon social requerido"}
                    maxLenght={30}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />
                  <Inputs
                    dataType={"string"}
                    name={"rfc_factura"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"RFC Factura: "}
                    type={"text"}
                    requerido={false}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"RFC Factura requerido"}
                    maxLenght={50}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />
                  <Inputs
                    dataType={"string"}
                    name={"raz_direccion"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"Dirección: "}
                    type={"text"}
                    requerido={false}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Dirección requerido"}
                    maxLenght={255}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />
                  <Inputs
                    dataType={"string"}
                    name={"raz_colonia"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"Colonia: "}
                    type={"text"}
                    requerido={false}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Colonia requerido"}
                    maxLenght={100}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />
                  <Inputs
                    dataType={"string"}
                    name={"raz_ciudad"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"Ciudad: "}
                    type={"text"}
                    requerido={false}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Ciudad requerido"}
                    maxLenght={100}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />
                  <Inputs
                    dataType={"string"}
                    name={"raz_estado"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"Estado: "}
                    type={"text"}
                    requerido={false}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Estado requerido"}
                    maxLenght={100}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />
                  <Inputs
                    dataType={"string"}
                    name={"raz_cp"}
                    tamañolabel={""}
                    className={"rounded block grow text-left"}
                    Titulo={"CP: "}
                    type={"text"}
                    requerido={false}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Codigo postal requerido"}
                    maxLenght={10}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />
                </div>
              </div>

              <input
                type="radio"
                name="my_tabs"
                role="tab"
                className="tab"
                aria-label="Familiares"
                checked={activeTab === 8}
                onChange={() => handleTabs(8)}
              />
              <div
                role="tabpanel"
                className={`tab-content p-6 rounded-box ${
                  activeTab === 8 ? "tab-active " : ""
                }`}
              >
                <div className="flex flex-wrap -mx-3 mb-6">
                  <Inputs
                    dataType={"string"}
                    name={"nom_padre"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"Nombre del padre: "}
                    type={"text"}
                    requerido={false}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Nombre del padre requerido"}
                    maxLenght={100}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />
                  <Inputs
                    dataType={"string"}
                    name={"tel_pad_1"}
                    tamañolabel={""}
                    className={"rounded block grow text-left"}
                    Titulo={"Tel del padre: "}
                    type={"text"}
                    requerido={false}
                    isNumero={true}
                    errors={errors}
                    register={register}
                    message={"Telefono del padre requerido"}
                    maxLenght={15}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />
                  <Inputs
                    dataType={"string"}
                    name={"tel_pad_2"}
                    tamañolabel={""}
                    className={"rounded block grow text-left"}
                    Titulo={"Tel (opcional)"}
                    type={"text"}
                    requerido={false}
                    isNumero={true}
                    errors={errors}
                    register={register}
                    message={"Telefonos de la aseguradora requerido"}
                    maxLenght={15}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />
                  <Inputs
                    dataType={"string"}
                    name={"cel_pad_1"}
                    tamañolabel={""}
                    className={"rounded block grow text-left"}
                    Titulo={"Celular del padre: "}
                    type={"text"}
                    requerido={false}
                    isNumero={true}
                    errors={errors}
                    register={register}
                    message={"Celular requerido"}
                    maxLenght={15}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />
                  <Inputs
                    dataType={"string"}
                    name={"nom_madre"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"Nombre de la madre: "}
                    type={"text"}
                    requerido={false}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Nombre de la madre requerido"}
                    maxLenght={100}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />
                  <Inputs
                    dataType={"string"}
                    name={"tel_mad_1"}
                    tamañolabel={""}
                    className={"rounded block grow text-right"}
                    Titulo={"Tel de la madre: "}
                    type={"text"}
                    requerido={false}
                    isNumero={true}
                    errors={errors}
                    register={register}
                    message={"Telefono de la madre requerido"}
                    maxLenght={15}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />
                  <Inputs
                    dataType={"string"}
                    name={"tel_mad_2"}
                    tamañolabel={""}
                    className={"rounded block grow text-left"}
                    Titulo={"Tel (opcional)"}
                    type={"text"}
                    requerido={false}
                    isNumero={true}
                    errors={errors}
                    register={register}
                    message={"Telefonos requerido"}
                    maxLenght={15}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />
                  <Inputs
                    dataType={"string"}
                    name={"cel_mad_1"}
                    tamañolabel={""}
                    className={"rounded block grow text-left"}
                    Titulo={"Celular de la madre: "}
                    type={"text"}
                    requerido={false}
                    isNumero={true}
                    errors={errors}
                    register={register}
                    message={"Celular requerido"}
                    maxLenght={15}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />
                  <Inputs
                    dataType={"string"}
                    name={"nom_avi"}
                    tamañolabel={""}
                    className={"rounded block grow"}
                    Titulo={"Avisar: "}
                    type={"text"}
                    requerido={false}
                    isNumero={false}
                    errors={errors}
                    register={register}
                    message={"Avisar requerido"}
                    maxLenght={100}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />
                  <Inputs
                    dataType={"string"}
                    name={"tel_avi_1"}
                    tamañolabel={""}
                    className={"rounded block grow text-left"}
                    Titulo={"Tel del aviso: "}
                    type={"text"}
                    requerido={false}
                    isNumero={true}
                    errors={errors}
                    register={register}
                    message={"Telefono de la madre requerido"}
                    maxLenght={15}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />
                  <Inputs
                    dataType={"string"}
                    name={"tel_avi_2"}
                    tamañolabel={""}
                    className={"rounded block grow text-left"}
                    Titulo={"Tel (opcional)"}
                    type={"text"}
                    requerido={false}
                    isNumero={true}
                    errors={errors}
                    register={register}
                    message={"Telefonos requerido"}
                    maxLenght={15}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />
                  <Inputs
                    dataType={"string"}
                    name={"cel_avi_1"}
                    tamañolabel={""}
                    className={"rounded block grow text-left"}
                    Titulo={"Celular del aviso: "}
                    type={"text"}
                    requerido={false}
                    isNumero={true}
                    errors={errors}
                    register={register}
                    message={"Celular requerido"}
                    maxLenght={15}
                    isDisabled={isDisabled}
                    handleBlur={handleBlur}
                  />
                </div>
              </div>
            </div>
          </fieldset>
          <div className="modal-action">
            <div
              className={`tooltip tooltip-top my-5 ${
                accion === "Ver"
                  ? "hover:cursor-not-allowed hidden"
                  : "hover:cursor-pointer"
              }`}
              data-tip="Guardar"
            >
              <button
                type="submit"
                id="btn_guardar"
                className="btn bg-blue-500 hover:bg-blue-700 text-white"
              >
                <i className="fa-regular fa-floppy-disk mx-2"></i> Guardar
              </button>
            </div>
          </div>
        </form>
      </div>
    </dialog>
  );
}

export default ModalAlumnos;
