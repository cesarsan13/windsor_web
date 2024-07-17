import { soloEnteros, soloDecimales, pone_ceros } from "@/app/utils/globalfn";
import { showSwal, confirmSwal } from "@/app/utils/alerts";
import { useState, useEffect, useRef } from "react";
import Inputs from "@/app/alumnos/components/Inputs";
import Webcam from 'react-webcam';
import Image from "next/image";

function ModalAlumnos({
    accion,
    onSubmit,
    currentID,
    register,
    errors,
    setAlumno,
    alumno,
    formatNumber,
    formaPagos,
    capturedImage,
    setCapturedImage,
    condicion,
    setcondicion,
}) {
    const [error, setError] = useState(null);
    const [titulo, setTitulo] = useState("");
    const [isDisabled, setIsDisabled] = useState(true);
    const [activeTab, setActiveTab] = useState(1);

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
    }

    return (
        <dialog id="my_modal_3" className="modal">
            <div className="modal-box w-full max-w-3xl h-full">
                <button
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    onClick={() => document.getElementById("my_modal_3").close()}
                >
                    ✕
                </button>
                <form onSubmit={onSubmit} encType="multipart/form-data">
                    <h3 className="font-bold text-lg mb-5">{titulo}</h3>
                    <fieldset id="fs_alumnos">
                        <div role="tablist" class="tabs tabs-lifted">
                            <input type="radio" name="my_tabs" role="tab" className="tab " aria-label="Alumno"
                                checked={activeTab === 1}
                                onChange={() => handleTabs(1)}
                            />
                            <div
                                role="tabpanel"
                                className={`tab-content p-6 rounded-box ${activeTab === 1 ? "tab-active " : ""}`}>
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
                                        className={"rounded block grow"}
                                        Titulo={"Apellido paterno: "}
                                        type={"text"}
                                        requerido={true}
                                        isNumero={false}
                                        errors={errors}
                                        register={register}
                                        message={"Apellido paterno requerido"}
                                        maxLength={50}
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
                                        maxLength={50}
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
                                        maxLength={50}
                                        isDisabled={isDisabled}
                                        handleBlur={handleBlur}
                                    />

                                    <Inputs
                                        dataType={"string"}
                                        name={"estatus"}
                                        tamañolabel={""}
                                        className={"fyo8m-select p-1.5 grow bg-[#1d232a] "}
                                        Titulo={"Estatus: "}
                                        type={"select"}
                                        requerido={true}
                                        isNumero={false}
                                        errors={errors}
                                        register={register}
                                        message={"Estatus requerido"}
                                        maxLength={25}
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
                                        maxLength={15}
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
                                        maxLength={15}
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
                                        maxLength={15}
                                        isDisabled={isDisabled}
                                        handleBlur={handleBlur}
                                    />

                                    <Inputs
                                        dataType={"string"}
                                        name={"sexo"}
                                        tamañolabel={""}
                                        className={"fyo8m-select p-1.5 grow bg-[#1d232a] "}
                                        Titulo={"Sexo: "}
                                        type={"select"}
                                        requerido={true}
                                        isNumero={false}
                                        errors={errors}
                                        register={register}
                                        message={"Sexo requerido"}
                                        maxLength={15}
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
                                        maxLength={50}
                                        isDisabled={isDisabled}
                                        handleBlur={handleBlur}
                                    />

                                    <Inputs
                                        dataType={"int"}
                                        name={"telefono_1"}
                                        tamañolabel={""}
                                        className={"rounded block grow text-right"}
                                        Titulo={"Telefonos: "}
                                        type={"text"}
                                        requerido={true}
                                        isNumero={true}
                                        errors={errors}
                                        register={register}
                                        message={"Telefono requerido"}
                                        maxLength={15}
                                        isDisabled={isDisabled}
                                        handleBlur={handleBlur}
                                    />

                                    <Inputs
                                        dataType={"int"}
                                        name={"telefono_2"}
                                        tamañolabel={""}
                                        className={"rounded block grow text-right"}
                                        Titulo={"Tel (opcional)"}
                                        type={"text"}
                                        requerido={false}
                                        isNumero={true}
                                        errors={errors}
                                        register={register}
                                        message={"Telefono requerido"}
                                        maxLength={15}
                                        isDisabled={isDisabled}
                                        handleBlur={handleBlur}
                                    />
                                    <Inputs
                                        dataType={"int"}
                                        name={"celular"}
                                        tamañolabel={""}
                                        className={"rounded block grow text-right"}
                                        Titulo={"Celular: "}
                                        type={"text"}
                                        requerido={true}
                                        isNumero={true}
                                        errors={errors}
                                        register={register}
                                        message={"Celular requerido"}
                                        maxLength={15}
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
                                        maxLength={255}
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
                                        maxLength={1}
                                        isDisabled={isDisabled}
                                        handleBlur={handleBlur}
                                    />
                                </div>
                            </div>
                            <input type="radio" name="my_tabs" role="tab" className="tab" aria-label="Generales"
                                checked={activeTab === 2}
                                onChange={() => handleTabs(2)}
                            />
                            <div
                                role="tabpanel"
                                className={`tab-content p-6 rounded-box ${activeTab === 2 ? "tab-active " : ""}`}
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
                                        maxLength={255}
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
                                        maxLength={100}
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
                                        maxLength={100}
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
                                        maxLength={100}
                                        isDisabled={isDisabled}
                                        handleBlur={handleBlur}
                                    />
                                    <Inputs
                                        dataType={"string"}
                                        name={"cp"}
                                        tamañolabel={""}
                                        className={"rounded block grow text-right"}
                                        Titulo={"CP: "}
                                        type={"text"}
                                        requerido={true}
                                        isNumero={true}
                                        errors={errors}
                                        register={register}
                                        message={"Codigo postal requerida"}
                                        maxLength={10}
                                        isDisabled={isDisabled}
                                        handleBlur={handleBlur}
                                    />
                                    <Inputs
                                        dataType={"string"}
                                        name={"email"}
                                        tamañolabel={""}
                                        className={"rounded block grow"}
                                        Titulo={"Email: "}
                                        type={"text"}
                                        requerido={true}
                                        isNumero={false}
                                        errors={errors}
                                        register={register}
                                        message={"Email requerido"}
                                        maxLength={255}
                                        isDisabled={isDisabled}
                                        handleBlur={handleBlur}
                                    />
                                </div>
                            </div>

                            <input type="radio" name="my_tabs" role="tab" className="tab" aria-label="Foto"
                                checked={activeTab === 3}
                                onChange={() => handleTabs(3)}
                            />
                            <div
                                role="tabpanel"
                                className={`tab-content p-6 rounded-box ${activeTab === 3 ? "tab-active " : ""}`}
                            >

                                <div>
                                    {isCameraOn && (
                                        <>
                                            <Webcam
                                                audio={false}
                                                ref={webcamRef}
                                                screenshotFormat="image/jpeg"
                                                className="w-full object-contain mx-auto my-4"
                                                videoConstraints={{ facingMode: 'user' }}
                                                mirrored={false}
                                            />
                                        </>
                                    )}
                                    <div className="bottom-0 left-0 w-full flex justify-center mb-4">
                                        <button type="button" onClick={toggleCamera} className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 rounded">
                                            {isCameraOn ? 'Apagar cámara' : 'Encender cámara'}
                                        </button>
                                        <button type="button" onClick={capture} disabled={!isCameraOn} className="ml-4 bg-green-500 hover:bg-green-700 text-white font-bold px-4 rounded">
                                            Capturar Foto
                                        </button>
                                    </div>
                                    {capturedImage && (
                                        <div className="bottom-0 left-0 w-full">
                                            <h2 className="text-center text-xl mb-2">Foto Capturada:</h2>
                                            <Image src={condicion ? capturedImage : capturedImage} alt="Captured" width={80} height={80} className="w-full object-contain mx-auto my-4" />
                                        </div>
                                    )}
                                </div>


                            </div>

                            <input type="radio" name="my_tabs" role="tab" className="tab" aria-label="Grado"
                                checked={activeTab === 4}
                                onChange={() => handleTabs(4)}
                            />
                            <div
                                role="tabpanel"
                                className={`tab-content p-6 rounded-box ${activeTab === 4 ? "tab-active " : ""}`}
                            >
                                <div className="flex flex-wrap -mx-3 mb-6">
                                    <Inputs
                                        dataType={"string"}
                                        name={"hora_1"}
                                        tamañolabel={""}
                                        className={"form-select p-1.5 grow bg-[#1d232a] "}
                                        Titulo={"Grado: "}
                                        type={"select"}
                                        requerido={true}
                                        isNumero={false}
                                        errors={errors}
                                        register={register}
                                        message={"Grado requerido"}
                                        maxLength={30}
                                        isDisabled={isDisabled}
                                        handleBlur={handleBlur}
                                        arreglos={[
                                            { id: "PREMATERNAL", descripcion: "PREMATERNAL" },
                                            { id: "MATERNAL", descripcion: "MATERNAL" },
                                            { id: "KINDER I", descripcion: "KINDER I" },
                                            { id: "KINDER II", descripcion: "KINDER II" },
                                            { id: "PREPRIMARIA", descripcion: "PREPRIMARIA" },
                                            { id: "1° PRIMARIA", descripcion: "1° PRIMARIA" },
                                            { id: "2° PRIMARIA", descripcion: "2° PRIMARIA" },
                                            { id: "3° PRIMARIA", descripcion: "3° PRIMARIA" },
                                            { id: "4° PRIMARIA", descripcion: "4° PRIMARIA" },
                                            { id: "5° PRIMARIA", descripcion: "5° PRIMARIA" },
                                            { id: "6° PRIMARIA", descripcion: "6° PRIMARIA" },
                                            { id: "1° SECUNDARIA", descripcion: "1° SECUNDARIA" },
                                            { id: "2° SECUNDARIA", descripcion: "2° SECUNDARIA" },
                                            { id: "3° SECUNDARIA", descripcion: "3° SECUNDARIA" },
                                            { id: "DEUDOR", descripcion: "DEUDOR" },
                                        ]}
                                    />
                                    <Inputs
                                        dataType={"string"}
                                        name={"hora_1"}
                                        tamañolabel={""}
                                        className={"form-select p-1.5 grow bg-[#1d232a] "}
                                        Titulo={"Grado: "}
                                        type={"select"}
                                        requerido={true}
                                        isNumero={false}
                                        errors={errors}
                                        register={register}
                                        message={"Grado requerido"}
                                        maxLength={30}
                                        isDisabled={isDisabled}
                                        handleBlur={handleBlur}
                                        arreglos={[
                                            { id: "PREMATERNAL", descripcion: "PREMATERNAL" },
                                            { id: "MATERNAL", descripcion: "MATERNAL" },
                                            { id: "KINDER I", descripcion: "KINDER I" },
                                            { id: "KINDER II", descripcion: "KINDER II" },
                                            { id: "PREPRIMARIA", descripcion: "PREPRIMARIA" },
                                            { id: "1° PRIMARIA", descripcion: "1° PRIMARIA" },
                                            { id: "2° PRIMARIA", descripcion: "2° PRIMARIA" },
                                            { id: "3° PRIMARIA", descripcion: "3° PRIMARIA" },
                                            { id: "4° PRIMARIA", descripcion: "4° PRIMARIA" },
                                            { id: "5° PRIMARIA", descripcion: "15° PRIMARIA" },
                                            { id: "6° PRIMARIA", descripcion: "6° PRIMARIA" },
                                            { id: "1° SECUNDARIA", descripcion: "1° SECUNDARIA" },
                                            { id: "2° SECUNDARIA", descripcion: "2° SECUNDARIA" },
                                            { id: "3° SECUNDARIA", descripcion: "3° SECUNDARIA" },
                                            { id: "DEUDOR", descripcion: "DEUDOR" },
                                        ]}
                                    />
                                </div>
                            </div>

                            <input type="radio" name="my_tabs" role="tab" className="tab" aria-label="Pago"
                                checked={activeTab === 5}
                                onChange={() => handleTabs(5)}
                            />
                            <div
                                role="tabpanel"
                                className={`tab-content p-6 rounded-box ${activeTab === 5 ? "tab-active " : ""}`}
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
                                        maxLength={50}
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
                                        maxLength={12}
                                        isDisabled={isDisabled}
                                        handleBlur={handleBlur}
                                    />
                                    <Inputs
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
                                        maxLength={50}
                                        isDisabled={isDisabled}
                                        handleBlur={handleBlur}
                                        // arreglos={[
                                        //     { label: "PENDIENTE", value: "PENDIENTE" },
                                        // ]}
                                        arreglos={formaPagos}
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
                                        maxLength={50}
                                        isDisabled={isDisabled}
                                        handleBlur={handleBlur}
                                        // arreglos={[
                                        //     { label: "PENDIENTE", value: "PENDIENTE" },
                                        // ]}
                                        arreglos={formaPagos}
                                    />
                                </div>
                            </div>

                            <input type="radio" name="my_tabs" role="tab" className="tab" aria-label="Medicos"
                                checked={activeTab === 6}
                                onChange={() => handleTabs(6)}
                            />
                            <div
                                role="tabpanel"
                                className={`tab-content p-6 rounded-box ${activeTab === 6 ? "tab-active " : ""}`}
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
                                        maxLength={50}
                                        isDisabled={isDisabled}
                                        handleBlur={handleBlur}
                                    />
                                    <Inputs
                                        dataType={"int"}
                                        name={"tel_p_1"}
                                        tamañolabel={""}
                                        className={"rounded block grow text-right"}
                                        Titulo={"Telefonos del pediatra: "}
                                        type={"text"}
                                        requerido={false}
                                        isNumero={true}
                                        errors={errors}
                                        register={register}
                                        message={"Telefono del pediatra requerido"}
                                        maxLength={15}
                                        isDisabled={isDisabled}
                                        handleBlur={handleBlur}
                                    />
                                    <Inputs
                                        dataType={"int"}
                                        name={"tel_p_2"}
                                        tamañolabel={""}
                                        className={"rounded block grow text-right"}
                                        Titulo={"Tel (opcional)"}
                                        type={"text"}
                                        requerido={false}
                                        isNumero={true}
                                        errors={errors}
                                        register={register}
                                        message={"Pediatra requerido"}
                                        maxLength={15}
                                        isDisabled={isDisabled}
                                        handleBlur={handleBlur}
                                    />
                                    <Inputs
                                        dataType={"int"}
                                        name={"cel_p_1"}
                                        tamañolabel={""}
                                        className={"rounded block grow text-right"}
                                        Titulo={"Celular del pediatra: "}
                                        type={"text"}
                                        requerido={false}
                                        isNumero={true}
                                        errors={errors}
                                        register={register}
                                        message={"Celular del pediatra requerido"}
                                        maxLength={15}
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
                                        maxLength={20}
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
                                        maxLength={50}
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
                                        maxLength={100}
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
                                        maxLength={50}
                                        isDisabled={isDisabled}
                                        handleBlur={handleBlur}
                                    />
                                    <Inputs
                                        dataType={"int"}
                                        name={"tel_ase_1"}
                                        tamañolabel={""}
                                        className={"rounded block grow text-right"}
                                        Titulo={"Telefonos de la aseguradora: "}
                                        type={"text"}
                                        requerido={false}
                                        isNumero={true}
                                        errors={errors}
                                        register={register}
                                        message={"Telefono de la aseguradora requerido"}
                                        maxLength={15}
                                        isDisabled={isDisabled}
                                        handleBlur={handleBlur}
                                    />
                                    <Inputs
                                        dataType={"int"}
                                        name={"tel_ase_2"}
                                        tamañolabel={""}
                                        className={"rounded block grow text-right"}
                                        Titulo={"Tel (opcional)"}
                                        type={"text"}
                                        requerido={false}
                                        isNumero={true}
                                        errors={errors}
                                        register={register}
                                        message={"Telefonos de la aseguradora requerido"}
                                        maxLength={15}
                                        isDisabled={isDisabled}
                                        handleBlur={handleBlur}
                                    />
                                </div>
                            </div>

                            <input type="radio" name="my_tabs" role="tab" className="tab" aria-label="Facturas"
                                checked={activeTab === 7}
                                onChange={() => handleTabs(7)}
                            />
                            <div
                                role="tabpanel"
                                className={`tab-content p-6 rounded-box ${activeTab === 7 ? "tab-active " : ""}`}
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
                                        maxLength={30}
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
                                        maxLength={50}
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
                                        maxLength={255}
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
                                        maxLength={100}
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
                                        maxLength={100}
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
                                        maxLength={100}
                                        isDisabled={isDisabled}
                                        handleBlur={handleBlur}
                                    />
                                    <Inputs
                                        dataType={"string"}
                                        name={"raz_cp"}
                                        tamañolabel={""}
                                        className={"rounded block grow text-right"}
                                        Titulo={"CP: "}
                                        type={"text"}
                                        requerido={false}
                                        isNumero={false}
                                        errors={errors}
                                        register={register}
                                        message={"Codigo postal requerido"}
                                        maxLength={10}
                                        isDisabled={isDisabled}
                                        handleBlur={handleBlur}
                                    />
                                </div>
                            </div>

                            <input type="radio" name="my_tabs" role="tab" className="tab" aria-label="Familiares"
                                checked={activeTab === 8}
                                onChange={() => handleTabs(8)}
                            />
                            <div
                                role="tabpanel"
                                className={`tab-content p-6 rounded-box ${activeTab === 8 ? "tab-active " : ""}`}
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
                                        maxLength={100}
                                        isDisabled={isDisabled}
                                        handleBlur={handleBlur}
                                    />
                                    <Inputs
                                        dataType={"int"}
                                        name={"tel_pad_1"}
                                        tamañolabel={""}
                                        className={"rounded block grow text-right"}
                                        Titulo={"Telefonos del padre: "}
                                        type={"text"}
                                        requerido={false}
                                        isNumero={true}
                                        errors={errors}
                                        register={register}
                                        message={"Telefono del padre requerido"}
                                        maxLength={15}
                                        isDisabled={isDisabled}
                                        handleBlur={handleBlur}
                                    />
                                    <Inputs
                                        dataType={"int"}
                                        name={"tel_pad_2"}
                                        tamañolabel={""}
                                        className={"rounded block grow text-right"}
                                        Titulo={"Tel (opcional)"}
                                        type={"text"}
                                        requerido={false}
                                        isNumero={true}
                                        errors={errors}
                                        register={register}
                                        message={"Telefonos de la aseguradora requerido"}
                                        maxLength={15}
                                        isDisabled={isDisabled}
                                        handleBlur={handleBlur}
                                    />
                                    <Inputs
                                        dataType={"int"}
                                        name={"cel_pad_1"}
                                        tamañolabel={""}
                                        className={"rounded block grow text-right"}
                                        Titulo={"Celular del padre: "}
                                        type={"text"}
                                        requerido={false}
                                        isNumero={true}
                                        errors={errors}
                                        register={register}
                                        message={"Celular requerido"}
                                        maxLength={15}
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
                                        maxLength={100}
                                        isDisabled={isDisabled}
                                        handleBlur={handleBlur}
                                    />
                                    <Inputs
                                        dataType={"int"}
                                        name={"tel_mad_1"}
                                        tamañolabel={""}
                                        className={"rounded block grow text-right"}
                                        Titulo={"Telefonos de la madre: "}
                                        type={"text"}
                                        requerido={false}
                                        isNumero={true}
                                        errors={errors}
                                        register={register}
                                        message={"Telefono de la madre requerido"}
                                        maxLength={15}
                                        isDisabled={isDisabled}
                                        handleBlur={handleBlur}
                                    />
                                    <Inputs
                                        dataType={"int"}
                                        name={"tel_mad_2"}
                                        tamañolabel={""}
                                        className={"rounded block grow text-right"}
                                        Titulo={"Tel (opcional)"}
                                        type={"text"}
                                        requerido={false}
                                        isNumero={true}
                                        errors={errors}
                                        register={register}
                                        message={"Telefonos requerido"}
                                        maxLength={15}
                                        isDisabled={isDisabled}
                                        handleBlur={handleBlur}
                                    />
                                    <Inputs
                                        dataType={"int"}
                                        name={"cel_mad_1"}
                                        tamañolabel={""}
                                        className={"rounded block grow text-right"}
                                        Titulo={"Celular de la madre: "}
                                        type={"text"}
                                        requerido={false}
                                        isNumero={true}
                                        errors={errors}
                                        register={register}
                                        message={"Celular requerido"}
                                        maxLength={15}
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
                                        maxLength={100}
                                        isDisabled={isDisabled}
                                        handleBlur={handleBlur}
                                    />
                                    <Inputs
                                        dataType={"int"}
                                        name={"tel_avi_1"}
                                        tamañolabel={""}
                                        className={"rounded block grow text-right"}
                                        Titulo={"Telefonos del aviso: "}
                                        type={"text"}
                                        requerido={false}
                                        isNumero={true}
                                        errors={errors}
                                        register={register}
                                        message={"Telefono de la madre requerido"}
                                        maxLength={15}
                                        isDisabled={isDisabled}
                                        handleBlur={handleBlur}
                                    />
                                    <Inputs
                                        dataType={"int"}
                                        name={"tel_avi_2"}
                                        tamañolabel={""}
                                        className={"rounded block grow text-right"}
                                        Titulo={"Tel (opcional)"}
                                        type={"text"}
                                        requerido={false}
                                        isNumero={true}
                                        errors={errors}
                                        register={register}
                                        message={"Telefonos requerido"}
                                        maxLength={15}
                                        isDisabled={isDisabled}
                                        handleBlur={handleBlur}
                                    />
                                    <Inputs
                                        dataType={"int"}
                                        name={"cel_avi_1"}
                                        tamañolabel={""}
                                        className={"rounded block grow text-right"}
                                        Titulo={"Celular del aviso: "}
                                        type={"text"}
                                        requerido={false}
                                        isNumero={true}
                                        errors={errors}
                                        register={register}
                                        message={"Celular requerido"}
                                        maxLength={15}
                                        isDisabled={isDisabled}
                                        handleBlur={handleBlur}
                                    />
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    <div className="modal-action">
                        <div
                            className={`tooltip tooltip-top my-5 ${accion === "Ver" ? "hover:cursor-not-allowed hidden" : "hover:cursor-pointer"}`}
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